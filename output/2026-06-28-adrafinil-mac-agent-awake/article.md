---
title: 一个用提神药命名的小工具，把"别睡"这件事交给了 AI agent 自己决定
source: https://github.com/kageroumado/adrafinil
author: kageroumado
date: 2026-06-28
type: decode
voice: default-doubao
style: default
tags: [mac, ai-agent, claude-code, codex, caffeinate, 防睡眠, 桌面工具, 工作流, hook, mcp]
---

防止 Mac 睡眠，是个二十年没变过的需求。系统自带 `caffeinate`，App Store 里躺着 Amphetamine 和一堆同类，逻辑都一样：你点一下，机器就一直醒着，直到你记得关。这件事简单到不值得写一篇文章。

但 2026 年 6 月，一个叫 Adrafinil 的菜单栏小工具被发到 Hacker News，拿了一百多分。它干的还是“别睡”这件老事——区别在于，它不让你决定什么时候醒，而是让你的 AI agent 替你决定。Claude Code 开始回答的那一刻，机器醒；它回答完，机器睡。你合上盖子走人，它在包里替你看着那个跑了一半的活儿。

值得拆的不是这个工具本身——它薄得几乎称不上软件。值得拆的是：为什么一个老到不能再老的需求，会因为 agent 突然长出一个新形态。

## 老工具的逻辑是"常开"，新需求是"按需"

先看 Adrafinil 到底做了什么。作者 kageroumado 在 README 里把它定义为"caffeinate、Amphetamine 这类常开唤醒工具的反面"。这句话是整个产品的题眼。

caffeinate 的模型是一个开关：打开，机器不睡；关上，恢复。Amphetamine 复杂一点，能设触发条件，但本质还是你提前告诉它"满足 X 就一直醒着"。它们都把"醒着"当成一种状态——一种你要手动进入、手动退出的状态。问题是，这个状态对人是负担（你得记得关），对电池是浪费（没活儿的时候它也醒着）。

Adrafinil 把"醒着"从状态改成了事件的副产品。它只在一件具体的事发生时才阻止睡眠：有一个 AI 编码 agent 正在跑一个 turn。README 里的措辞很精确——它是"活动级"（activity-scoped）而不是"会话级"（session-scoped）。绑的不是"你开没开 Claude Code"，而是"Claude Code 这一轮在不在干活"。零个活跃 session，机器就正常睡，包括合盖即睡。

这个差别听起来小，落到使用上却是反的。老工具默认醒着、需要你记得让它睡；Adrafinil 默认睡着、只在该醒的瞬间醒。对一个习惯了"开着 agent 跑长任务、合盖走人"的人，后者才是对的默认值。

## 它怎么知道 agent 在干活

一个工具要“按 agent 的状态”开合，前提是能感知这个状态。Adrafinil 给了两条路。

主路是 hook。一键安装会把自己接进九个 agent 的 hook 系统——Claude Code、Codex、Cursor、Gemini CLI、Aider、Hermes、OpenCode、Cline、Pi。以 Claude Code 为例：在 `UserPromptSubmit`（你提交一个提示）时调 `adrafinil acquire`，在 `Stop`（这一轮停了）时调 `adrafinil release`。背后一个常驻进程（daemon）按 session key 做引用计数，计数大于零就阻止睡眠，归零就放手。这是干净的做法——它不去猜 agent 忙不忙，而是让 agent 在自己的工作流节点上主动报告。

为了不拖慢 agent，这两个命令往返 daemon 的延迟压在 50 毫秒以内。这个数字有意义：hook 是同步卡在 agent 主流程上的，如果 acquire 慢，你的每一次对话都会卡一下。做到亚 50 毫秒，等于承诺“我不会成为你工作流里的延迟来源”。

备路是进程嗅探：daemon 直接盯着系统里有没有已知的 agent 二进制在跑，有就自动 acquire，不依赖 hook。这条路覆盖哪些没接 hook、或者根本不支持 hook 的场景，代价是粗糙——它只能看到“进程在不在”，看不到“这一轮忙不忙”。两条路一精一糙，精的靠 agent 配合，糙的靠系统观察，合起来兜住覆盖面。

这里有个值得记下的判断：hook 接入是 agent 时代特有的集成方式。十年前你想让一个工具“知道另一个程序在干嘛”，只能去嗅探进程、读日志、抓窗口标题——全是从外部猜。Claude Code、Codex 这代 agent 把生命周期事件（开始、停止、用工具）做成了可挂载的钩子，等于对外开放了自己的内部状态。Adrafinil 就站在这个开放接口上——它能做到“精确按 turn 开合”，不是因为它聪明，是因为 agent 主动把状态喂给了它。

## 真正的脏活在合盖那一刻

到这里 Adrafinil 看起来还是个轻巧的小东西。但它真正费劲的地方，在一个具体的物理动作：你合上盖子。

合盖睡眠（clamshell sleep）是 macOS 里最硬的一道睡眠。普通的防睡眠手段——也就是系统公开的 IOPMAssertion 那套断言——打不过它。README 写得很直白：公开的 assertion 类型“beat 不过合盖睡眠”。所以 Adrafinil 用了更底层的 `pmset disablesleep`，它设的是一个内核级标志（SleepDisabled），在 Apple Silicon 上能穿透合盖事件、哪怕不接外接显示器也能让机器保持清醒。这一点经得起交叉核对：Macworld 和社区的共识是，这个内核标志确实被系统当成对睡眠的否决票。

对照之下，`caffeinate` 在这件事上是残的。它的合盖防睡眠参数（-s）只在接电时有效；Apple Silicon 上，合盖一关，它基本抗不住。这就是为什么作者反复强调“不用外接显示器、不用插电也能合盖跑”——那是 caffeinate 做不到、外接屏方案又要求插电的那块空白。

但骗操作系统“别睡”是带刺的。一台合着盖、塞在背包里、却被强行保持清醒的 Mac，会发热。裸用 `pmset disablesleep` 还有个坑：合盖后内屏可能继续全亮，在黑暗的包里空烧几个小时电。Adrafinil 把这些脏活包了起来——合盖期间监控温度，越过阈值就强制释放所有断言，让机器该睡睡，免得变成一块“包里的暖手宝”；持有断言的进程要是死了或者 CPU 空闲超过 N 分钟，也自动撤销。合盖时它还会播一声提示音，因为屏幕已经黑了、没法弹通知，这声音是唯一能确认“断言生效了”的反馈；开盖后给你看离开期间跑了什么、峰值温度多少、有没有触发过热保护。

这一段是这个小工具里唯一称得上有分量的部分。它的价值不在“让机器别睡”——那是一行 `pmset` 命令的事——而在“让机器别睡的同时别把自己烧坏、别把电耗干、别在不该醒的时候醒着”。这些边界条件加起来，才是它存在的理由。

## 噱头、撞名，和「15000 行干一件小事」

得说清楚它薄在哪。

名字是个梗。Adrafinil（阿德拉非尼）是一种提神药，作者拿它隐喻「给电脑提神」。HN 评论区立刻有人指出，一个叫 modafinil（莫达非尼，另一种同类药）的 App 先到了——连撞名都撞在同一类药上。这种命名是营销，不是技术，记一笔就好。

更实在的质疑也来自 HN：有人算了下，这么个功能用了大约一万五千行 Swift，而它的内核本质就是「有 agent 在跑就 `pmset disablesleep 1`，没了就 `0`」，几行脚本就能写出雏形。这个质疑站得住一半。它确实是一层薄薄的自动化包在一条系统命令之上；但前面那段热保护、电量兜底、引用计数、三层权限隔离（只有一个 root 级 helper 碰睡眠 API、其余逻辑全在非特权组件里），恰恰是「几行脚本」和「敢让它合盖塞包里跑一整晚」之间的距离。代码量大，一部分是过度工程，一部分是把脏活做干净的必要成本——两者都有。

它也不孤独。同一时期，GitHub 上冒出来一整排做同一件事的工具：agents-sleep-preventer、NoSleepAgent、Macchiato、Lidless、StayUp、owly……有的用进程检测，有的用 hook，功能高度重叠。一个需求短时间内长出这么多近乎相同的实现，通常说明两件事之一：要么这是个真痛点，人人都在挠；要么这是个跟风点，改个图标就能发。从这些工具普遍很薄、star 数普遍不高来看，大概率是前者里掺着后者——痛点是真的，但解法太简单，导致谁都能做一个。

## 盲区:我们不知道的

亚 50 毫秒的延迟、一万五千行的代码量，都来自 README 和 HN 评论的口径，没有独立复现。star 数（约 159）、版本（v1.1.2）、HN 分数（108）是抓取当下的快照，会变。

更根本的盲区是：这个品类会不会被收编。Adrafinil 解决的是“本地 agent 跑在你的机器上、机器睡了 agent 就停”这个具体麻烦。但有一天 agent 的执行整体挪到云端（很多产品正在这么做），或者 macOS 自己把“有后台任务时智能保持清醒”做进系统（它已经有部分电源管理智能），这一整类工具的存在前提就消失了。Adrafinil 押的是“agent 在本地跑、而 OS 不够聪明”这个窗口期——窗口多宽，现在看不清。

还有一个没人能替你回答的问题：你到底多频繁地“合盖让 agent 隔夜跑”？如果一个月一次，记一行 `sudo pmset -a disablesleep 1` 用完再关掉就够了。这个工具的全部价值，建立在你足够频繁地干这件事、且懒得每次手动开关之上。

## 对 AI 从业者/实践者意味着什么

第一，如果你已经在用 Claude Code、Codex 跑长任务又想着合盖走人，先认清老办法的边界再决定装不装：`caffeinate` 扛不住合盖（除非接电），Amphetamine 常开、要自己写脚本才能接 agent，裸 `pmset disablesleep` 能扛合盖但会空烧内屏、低电量仍会强制睡。Adrafinil 的增量价值就是把这三种事情——抗合盖、按 agent 开合、热/电兜底——打包了。值不值这层包装，看你自己的频率。

第二，把 hook 当成一个可以利用的接口，而不只是配置项。Adrafinil 整个产品成立的根基，是 Claude Code 这代 agent 把 `UserPromptSubmit`/`Stop` 这类生命周期事件开放成了钩子。你自己工作流里的通知、计时、限流、联动设备，同样能挂在这些钩子上。Adrafinil 只是第一个把“挂在 hook 上感知 agent 状态”做成商品的样本，不会是最后一个。

第三，留意“agent 工作流正在给桌面环境提需求”这条线。防睡眠只是最表层、最容易填上的一个。agent 在本地长时间无人值守，会连带牵出一串新问题：断网谁接着跑、崩了谁重启、跑过头谁喊停、跑的时候机器能不能干别的。这些大多还没有好工具。Adrafinil 是这条线上一个微不足道但很典型的信号——需求是新的，解法可以很老。

## 本期关键词

- **caffeinate** —— macOS 自带的命令行防睡眠工具，终端里敲一下机器就不睡，按 Control+C 退出。它是“常开”型：你让它醒，它就一直醒。短板在合盖——它的合盖防睡眠参数（-s）只在接电时管用，拔了电、合上盖基本就扛不住了。

- **合盖睡眠（clamshell sleep）** —— MacBook 一合上盖子就进入的睡眠。它比普通的“闲置睡眠”更硬，系统公开给开发者的那套防睡眠手段打不过它。要抗合盖睡眠，得动用更底层的内核开关（就是下面这个 pmset）。

- **pmset disablesleep** —— 一条系统级命令，设一个内核里的标志告诉 macOS“别睡”。它够硬，能穿透合盖，在新的 Apple 芯片 Mac 上不接外接显示器也能让机器保持清醒。但它是把双刃剑：合盖后内屏可能继续全亮空烧电，电量太低时系统还是会强制睡。Adrafinil 干的脏活，很大一部分就是替你管住这条命令的副作用。

- **hook（钩子）** —— 一个程序在自己运行到某个节点时，主动调用外部命令的机制。Claude Code 把“用户提交提示”“这一轮结束”这些时刻做成了可挂载的钩子，外部工具挂上去，就能在那个瞬间被通知到。Adrafinil 就是挂在这些钩子上，才知道 agent 什么时候开始、什么时候结束干活。

- **IOPMAssertion（电源管理断言）** —— macOS 给程序的一种“举手”机制：一个程序可以“声明”自己有理由让系统别睡（比如正在放视频）。系统公开的这套断言能挡住闲置睡眠，但挡不住合盖睡眠——这正是 Adrafinil 不得不绕到 pmset 那条更底层路子的原因。

- **MCP（模型上下文协议，Model Context Protocol）** —— 一套让 AI agent 和外部工具对话的标准接口。Adrafinil 内置了一个 MCP 工具，让支持 MCP 的 agent 能自己开口“帮我多醒 30 分钟，我要部署”，而不必靠人去点菜单。

1. [kageroumado/adrafinil — GitHub README](https://github.com/kageroumado/adrafinil) —— 作者一手仓库，功能、架构、机制全在此。核心描述："prevents system sleep — including clamshell (lid-closed) sleep — exclusively while an AI coding agent has an active session."（只在 AI 编码 agent 有活跃会话时阻止系统睡眠，包括合盖睡眠。）

2. [Show HN: Adrafinil – keep a lid-closed Mac awake only while agents work](https://news.ycombinator.com/item?id=48701512) —— 作者自述 + 社区讨论（撞名、过度工程质疑、与 caffeinate/Amphetamine 对比）。

3. [Your AI Agents Die the Moment Your Mac Falls Asleep (Masset Blog)](https://www.getmasset.com/resources/blog/keep-your-mac-awake-for-ai-agents) —— "When that computer sleeps, your worker clocks out."（电脑一睡，你的工人就下班了。）点明了 caffeinate 的局限与 agent 隔夜跑的场景。

4. [How to use a MacBook with the lid closed (Macworld)](https://www.macworld.com/article/673295/how-to-use-macbook-with-lid-closed-stop-closed-mac-sleeping.html) —— 核实 pmset disablesleep 与 caffeinate 在 Apple Silicon 上的合盖行为。

5. [CharlonTank/agents-sleep-preventer](https://github.com/CharlonTank/agents-sleep-preventer) —— 同类竞品（进程检测路线），佐证这是个拥挤的小赛道。
