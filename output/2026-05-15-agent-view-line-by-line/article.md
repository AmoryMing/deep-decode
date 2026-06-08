---
title: Agent View 逐句解读：Claude Code 把会话从终端剥下来之后
source: https://code.claude.com/docs/en/agent-view
author: Claude Code 官方文档
type: decode-line-by-line
created: 2026-05-15
reader: default
style: default
tags: [ClaudeCode, AgentView, BackgroundAgents, Supervisor, Worktree]
---

> 这是一篇**逐句解读**——不重组、不浓缩、不跳行。原文每句话都过一遍：原句 → 译 → 解读。读完你不仅知道 agent view 是什么，还会知道这份文档为什么这样写、每句话背后藏着什么设计取舍。

---

## 钩子：一份文档里藏着一次产品哲学转向

Claude Code 这份文档最值得读的不是它教你哪些快捷键，而是它在第一段就把"会话"从"终端"上拆了下来。

过去你跑 `claude`，会话就被钉死在那个终端窗口上：窗口关了、Mac 睡了、SSH 掉了，会话就没了。`claude agents` 把这层绑定打断——会话变成由一个**用户级守护进程（supervisor）**托管的、能独立存活的对象。你的终端只是临时挂上去看一眼的"显示器"，不是会话本身。

这套模型不是 Anthropic 发明的——`tmux`、`systemd --user`、`docker exec -it` 都在做类似的事——但把它套到 LLM 长对话上，意味着 Claude Code 在认知里已经不再是"对话工具"，而是"长任务编排平台"。下面 230+ 句话，每一句都在维护这个新模型的边界。

---

![封面](00_系列封面.png)

## §0 标题 + 导语 + Note + 目录

### S0.1 标题

**Manage multiple agents with agent view**
- 译：用 agent view 管理多个 agent。
- 解读：标题用了 "agents"（复数）+ "agent view"（功能名）双重压重。"agent" 在这份文档里等价于"一个 Claude Code 会话"——不是抽象 AI agent。命名上 Anthropic 选了把"会话"叫"agent"，是因为对用户来说，一个独立跑任务的实体本来就更像 agent 而不是"chat session"。

### S0.2 副标题

**Dispatch and manage many Claude Code sessions from one screen.**
- 译：从一个屏幕里派发并管理多个 Claude Code 会话。
- 解读：核心动词是 **dispatch**（派发）。dispatch 在系统调度语境里就是"把一个 job 扔进队列"——而不是"开始对话"。Anthropic 这里刻意用调度术语，是在重新定义读者的心智：你不是在聊天，你在派任务。

**Agent view shows what every session is doing and which ones need your input.**
- 译：Agent view 显示每个会话在干什么、哪些需要你输入。
- 解读：这一句压两个信号：① **可见性**（doing）—— 反对"黑盒后台"；② **可中断性**（need your input）—— 后面 Needs input 状态机的预告。两个一起，构成"被动 supervision"模型——不是你监工 Claude，是 Claude 主动叫你。

### S0.3 导语段（开篇 paragraph 1）

**Agent view, opened with `claude agents`, is one screen for all your background sessions: what's running, what needs your input, and what's done.**
- 译：用 `claude agents` 打开 agent view，它把你所有后台会话集中到一个屏幕：在跑的、等你输入的、已完成的。
- 解读：入口命令 = `claude agents`（注意复数 s）。三档分类提前预告——后面 *Working / Needs input / Completed* 分组就是这三档。"all your background sessions" 暗示是**跨项目**聚合，不是某个目录的局部视图。

**Dispatch new sessions, watch their state at a glance instead of scrolling through transcripts, and step in only when one needs you.**
- 译：派新会话、扫一眼看状态（不必滚长对话）、只在需要时介入。
- 解读："at a glance instead of scrolling through transcripts"——直接打脸早期 Claude Code 的体验痛点：长 transcript 找不到关键信号。Agent view 用"一行摘要"压缩到 O(1) 阅读成本。"step in only when one needs you" 是 supervision 模型的座右铭。

**Each background session is a full Claude Code conversation that keeps running without a terminal attached, so you can open it, reply, and leave whenever you want.**
- 译：每个后台会话都是完整的 Claude Code 对话，不需要终端挂着也能跑，所以你可以随时打开、回复、走人。
- 解读：两个关键词。**full**——不是阉割版；后台不丢功能。**without a terminal attached**——这是整个 agent view 设计的物理基础：进程与终端解耦。后面 supervisor 章节会解释怎么做到。"open / reply / leave whenever" 给了用户**异步参与**的明示授权。

### S0.4 图片 alt 文（视觉规格）

**Agent view in a terminal: the header shows Claude Code v2.1.140, the model, the working directory, and a summary count. Sessions are grouped under Needs input, Working, and Completed, with a dispatch input at the bottom and a footer of keyboard hints.**
- 译：终端里的 agent view：头部显示版本、模型、工作目录、汇总计数；会话按 *Needs input / Working / Completed* 分组；底部是派发输入框；脚部是快捷键提示。
- 解读：图说反而是最严格的"UI 规格"。从上到下：**Header（版本/模型/cwd/计数）→ 分组列表 → 底部输入框 → 快捷键脚**。四层结构。把版本号写进 alt 文本——侧面证明这个 UI 还在快速演进，alt 文不会随便改但版本会。

### S0.5 适用边界

**Use agent view when you have several independent tasks Claude can work on without you watching every step.**
- 译：当你有**几件相互独立**、不需要你盯每一步的任务时，用 agent view。
- 解读：两个边界。**independent**——任务彼此不阻塞；**without you watching every step**——任务对人的依赖低。如果是高耦合 / 高人工把关的活，agent view 反而比 `claude` 慢。

**Dispatch a bug fix, a pull request review, and a flaky-test investigation as three rows, keep working in another window, and check back when a row shows it needs you or has a result.**
- 译：派"修 bug / review PR / 查 flaky 测试"三件事成三行，自己去别处干活，等某行提示需要你或有结果再回来。
- 解读：经典三件套示例。注意三件事的共性——**都是"边界清晰、可异步、有明确产物"**：bug 修完出 commit、review 出评论、查测试出 root cause。Anthropic 用例选得非常克制，没用"帮我写整个项目"这种边界模糊的反面教材。

### S0.6 attach 引入

**When you want to work more directly in any agent's session, attach to the row to enter the full conversation.**
- 译：想直接进入某个 agent 的会话干活，就 attach 到那一行。
- 解读：第一次出现 **attach** 这个动词。这里没解释 attach 和 peek 的区别——peek 看一眼、attach 真接入——后面会展开。但放在导语就引出 attach，是因为它是从"看"到"做"的跨档动作。

### S0.7 对比指引

**To compare agent view with subagents, agent teams, and worktrees, see Run agents in parallel.**
- 译：要对比 agent view 与 subagent / agent team / worktree，看《Run agents in parallel》。
- 解读：这四种是 Claude Code 里**不同抽象层级的"并行"**：
  - subagent = **会话内**的并行（一个对话里派任务）
  - agent team = **会话间**的并行（多个会话互相消息）
  - agent view = **会话级**的并行（多个独立会话同时跑）
  - worktree = **文件系统级**的隔离（每个会话独立写盘）
  Anthropic 没把它们做成一个"统一的 parallel API"，而是分层暴露——把选择权留给用户。

### S0.8 Note 框

**Agent view is in research preview and requires Claude Code v2.1.139 or later.**
- 译：研究预览阶段，需要 v2.1.139 及以上。
- 解读："research preview" 是 Anthropic 标准的"我们觉得能用但留给自己退路"的标签。版本号精确到第三位（2.1.139）——说明 agent view 是某次小版本里塞进来的，不是大改版的卖点。

**Check your version with `claude --version`. The interface and keyboard shortcuts may change as the feature evolves.**
- 译：用 `claude --version` 查版本。界面和快捷键可能随特性演进而变。
- 解读：明确告诉你**别把当前快捷键背成肌肉记忆**。这种"接口不稳定"的免责声明，对一个面向开发者的产品来说是诚实的——但同时也是 Anthropic 给自己留的修改权。

### S0.9 目录

**This page covers: Quick start … Monitor sessions … Dispatch new agents … Manage sessions from the shell … How background sessions are hosted by the supervisor process.**
- 译：本页覆盖快速上手 / 监控会话 / 派发新 agent / shell 管理 / supervisor 托管。
- 解读：五块。前四块讲"怎么用"，最后一块讲"怎么实现的"——这种"先 how-to 再 internals"的顺序是文档老法师的做法：让初学者先成功，让进阶者再看原理。

---

## §1 Quick start

### S1.0 Quick start 导语

**This walkthrough covers the core agent view loop: dispatch a task, watch its row update as Claude works, peek to check on it and reply, and attach for the full conversation.**
- 译：本节走一遍核心循环——派任务 → 看行更新 → peek 检查并回复 → attach 进完整对话。
- 解读：把整个 agent view 的交互压缩到**四个动作循环**：dispatch / watch / peek / attach。这就是产品的核心 loop。其他所有功能都是这个 loop 的变种或装饰。

**The session you dispatch keeps running after you close agent view, so you can leave and come back to it.**
- 译：派的会话在你关掉 agent view 之后还在跑，可以离开再回来。
- 解读：再次重申"会话独立于 UI"。Anthropic 在这页里把这个事重复了至少 5 次——他们知道这是用户最容易出错的心智模型迁移点。

### S1.1 Step 1: Open agent view

**From your shell, run: `claude agents`.**
- 译：在 shell 跑 `claude agents`。
- 解读：唯一入口命令。

**Agent view opens with an input at the bottom and a table that fills in as sessions start.**
- 译：打开后底部是输入框，会话启动后逐渐填进表格。
- 解读："fills in as sessions start"——这是说**第一次打开是空的**。后面 Troubleshooting 会有专门一条"opens with no sessions"。

**Press `Esc` at any time to return to your shell.**
- 译：随时按 Esc 返回 shell。
- 解读：退出快捷键。注意是"返回 shell"——agent view 接管整个终端。

**Your sessions keep running while you're away and reappear the next time you open agent view.**
- 译：你不在时会话继续跑，下次打开还在那。
- 解读：第 6 次强调持久性。可见 Anthropic 文档评审的人对这个点近乎执念。

### S1.2 Step 2: Dispatch a session

**Type a prompt describing a task and press `Enter`.**
- 译：打字写任务描述，回车。
- 解读：dispatch 的最小动作。注意是 **describing a task** 不是"聊天"——再次强化任务心智。

**A new background session starts on that task and appears as a row showing whether it's working, waiting on you, or done.**
- 译：新后台会话启动，作为一行出现，显示在跑/等你/完成。
- 解读：三态在行里的可视化。

**The new session uses the model shown in the agent view header and the same permission mode you'd get running `claude` in that directory.**
- 译：新会话用 header 里显示的模型，权限模式跟在该目录跑 `claude` 一样。
- 解读：两个继承。模型 = header 默认；权限 = 目录默认。意思是 **dispatch 不是"开新进程"，是"用当前上下文派一个 job"**。后面 §3.7 会展开权限模式细节。

**Every prompt you enter here starts its own new session.**
- 译：在这里每输一条 prompt 都开**新**会话。
- 解读：反直觉提示。容易误以为"再输一条是给同一个会话发后续"。

**Typing another prompt and pressing `Enter` launches a second session alongside the first rather than sending a follow-up to it.**
- 译：再输再回车，是开第二个会话，不是给第一个发后续。
- 解读：上一句的换种说法。重复说明同一件事——这个误区肯定撞过用户。

**You can run several in parallel this way.**
- 译：这样可以同时跑多个。
- 解读：把上述"易踩坑"反过来当卖点。

**Each session uses your subscription quota independently, so see Limitations before dispatching many at once.**
- 译：每个会话独立吃配额，狂派之前先看 Limitations。
- 解读：成本预警。10 个并行 = 10 倍速率消耗配额。Anthropic 在初学者节里就把这事说了，免得用户惊讶。

### S1.3 Step 3: Peek and reply

**Select a row with the arrow keys and press `Space` to open the peek panel.**
- 译：方向键选行，按空格打开 peek 面板。
- 解读：peek = "瞥一眼"。空格键是它的开关。

**It shows the session's most recent output, or the question it's waiting on, rather than the full transcript.**
- 译：显示最近输出或它在等的问题，不是完整对话。
- 解读：peek ≠ attach 的核心差别。peek 只给"最有信息量的一小段"——是为了**减少切换成本**。

**Type a reply and press `Enter` to send it without leaving agent view.**
- 译：在 peek 里打字回车就能回复，不用离开 agent view。
- 解读：90% 场景下，peek + 回复就够了。attach 是少数情况。

### S1.4 Step 4: Attach and detach

**Press `Enter` or `→` on a row to attach when you want the full conversation.**
- 译：想看完整对话时，按回车或右箭头 attach。
- 解读：右箭头作为 attach 的视觉隐喻——"进入"。

**The session takes over the terminal exactly as if you had run `claude`.**
- 译：会话接管终端，就像你刚跑了 `claude` 一样。
- 解读："exactly as if" 是承诺——attach 后不损失任何 `claude` 的功能。

**Press `←` on an empty prompt to detach and return to the table.**
- 译：在空 prompt 按左箭头 detach 回到表格。
- 解读：左箭头 = "退出"。"empty prompt" 是关键限定——不空就是删字。

### S1.5 Step 5: Bring an existing session in

**To move a session you already have open into agent view, run `/bg` inside it, or press `←` on an empty prompt to background it and open agent view in one step.**
- 译：把已开的会话挪进 agent view：在里面跑 `/bg`，或在空 prompt 按 ← 一步搞定（background + 打开 agent view）。
- 解读：两种入口。左箭头是**统一手势**——在 agent view 是 detach，在普通 `claude` 是 background-and-open。同一个键在不同上下文做语义对称的事，是好键位设计。

**The session keeps running and appears as a row alongside the ones you dispatched.**
- 译：会话继续跑，以一行形式出现在你派的那些旁边。
- 解读：从"前台"挪到"后台"，会话本身不间断。

### S1.6 总收口

**You can use `claude agents` as your primary entry point instead of `claude`: dispatch every task from agent view, attach when you want the full conversation, and press `←` to return to the table.**
- 译：你可以把 `claude agents` 当主入口（替代 `claude`）：派任务、需要时 attach、按 ← 回表。
- 解读：这是隐藏的产品野心——Anthropic 在劝你**把 agent view 当默认入口**。如果用户照做，那 Claude Code 的心智就从"一次对话工具"彻底变成"任务派发台"。

---

## §2 Monitor sessions with agent view

### S2.0 监控章导语

**Run `claude agents` to open agent view.**
- 译：跑 `claude agents` 打开。
- 解读：第三次给入口命令。

**It takes over the full terminal and lists every session grouped by state, with pinned sessions and the ones that need you at the top.**
- 译：接管整个终端，按状态分组列出所有会话；置顶的和需要你的在最上。
- 解读：列表的优先级 = **置顶 > Needs input > 其他**。把"最干涉用户注意力"的内容放最上——这是注意力调度。

**Each row shows the session's name, current activity, and how long ago it last changed.**
- 译：每行显示名字、当前动作、上次变化的时间差。
- 解读：三列。"how long ago" 用相对时间——不是绝对时间戳——是为了**扫视友好**。

### S2.1 列表范围

**The list shows every background session you've started, across all your projects.**
- 译：列出你所有项目下启动过的后台会话。
- 解读：**全局视图**。这一点重要——它不是"当前目录的会话列表"，是"用户级聚合"。

**A session working in one repository and another in a different worktree both appear here, regardless of which directory you opened agent view from.**
- 译：不同 repo / worktree 里的会话都在，跟你在哪打开 agent view 无关。
- 解读：再次强调跨目录聚合。supervisor 是 per-user，不是 per-project。

**Interactive sessions you have open in other terminals don't appear until you background them.**
- 译：你在别的终端开着的交互会话**不在列表里**，除非你 background 它们。
- 解读：明确边界。"interactive ≠ background" 在 Claude Code 里是两套对象。

**Subagents and teammates a session spawns aren't listed as separate rows.**
- 译：会话内开的 subagent / teammate 不算独立行。
- 解读：粒度限制——agent view 只到**会话级**。会话内部的并行（subagent）藏在那一行里。这是给后面 "Run agents in parallel" 对比页留的伏笔。

### S2.2 示例 ASCII 列表

文档中插入了一段 ASCII 表格示例（Pinned / Ready for review / Needs input / Working / Completed），不逐句翻——它的功能是让你**用眼睛验证前面对状态分组的描述**。值得注意的两点：
- "Pinned" 在所有分组**之上**——和导语描述一致。
- "Ready for review" 介于 Needs input 之上——这是后面会专门说的"开了 PR 的会话单独成组"。

![颜色与形状两条正交信号](01_状态机正交.png)

### S2.3 Read session state — 颜色态

**Each row starts with an icon whose color and animation show the session's state.**
- 译：每行起头一个图标，颜色和动画表达状态。
- 解读：图标承载**两条独立信号**——颜色（状态）和形状（进程是否活）。下面会分别说。

**Working — Animated — Claude is actively running tools or generating a response.**
- 译：Working = 动画图标 = Claude 在跑工具或生成回复。
- 解读：动画 = 活动信号。

**Needs input — Yellow — Claude is waiting on a specific question or permission decision from you.**
- 译：Needs input = 黄色 = 在等你回答问题或决定权限。
- 解读：黄 = 注意。"specific question or permission decision" 两个触发源——一个内容性、一个权限性。

**Idle — Dimmed — The session has nothing to do and is ready for your next prompt.**
- 译：Idle = 灰暗 = 没事干，等你下一句。
- 解读：dimmed 是视觉降权——故意不抢眼。

**Completed — Green — The task finished successfully.**
- 译：Completed = 绿 = 成功完成。
- 解读：绿 = OK。

**Failed — Red — The task ended with an error.**
- 译：Failed = 红 = 出错结束。
- 解读：红 = 警报。

**Stopped — Grey — The session was stopped with `Ctrl+X` or `claude stop`.**
- 译：Stopped = 灰 = 你主动停的。
- 解读：注意 Stopped 跟 Failed 颜色不同（灰 vs 红）——区分**主动结束**和**意外失败**。是个细致的设计。

### S2.4 Read session state — 形状态

**Separately, the icon's shape shows whether the underlying process is running.**
- 译：另一条独立信号是形状，表示进程是否在跑。
- 解读："Separately"——颜色和形状**正交**。你可以是"绿色 + 空心"（已完成 + 进程已退）。

**`✻` or animated `✽` — The session process is alive and replies immediately.**
- 译：✻ 或动 ✽ = 进程活着，秒回。
- 解读：花 = 活。

**`∙` — The process has exited. You can still peek, reply, or attach, and Claude restarts from where it left off.**
- 译：∙ = 进程退了。但你还可以 peek/回复/attach，Claude 会从断点重启。
- 解读：这是 supervisor 的核心承诺——**进程死掉不等于会话死掉**。点（dot）= 退但可复活。

**`✢` — A `/loop` session sleeping between iterations. The row shows its run count and a countdown.**
- 译：✢ = `/loop` 会话在两轮间睡觉，行里显示运行次数和倒计时。
- 解读：把 `/loop`（定时任务 skill）做了图标专属。说明 Anthropic 认为 `/loop` 是头等公民。

### S2.5 持久性总结（再一次）

**Background sessions don't need any terminal open to keep working.**
- 译：后台会话不需要终端开着也能跑。
- 解读：第 7 次。

**A separate supervisor process runs them, so you can close agent view, close your shell, or start a new interactive session and your dispatched work keeps going.**
- 译：背后是独立的 supervisor 进程在跑，所以你关 agent view / 关 shell / 开新会话都不影响。
- 解读：终于第一次正式提到 **supervisor** 这个词。§5 会展开。三个动作（关 view / 关 shell / 开新 session）都不会终止——把"何时会死"的反向边界画清。

**Session state persists on disk through auto-updates and supervisor restarts.**
- 译：状态写在盘上，能扛 auto-update 和 supervisor 重启。
- 解读："through" 表示能穿透。这意味着 Claude Code 自动升级**不会丢你跑了一半的活**。

**If your machine sleeps or shuts down, running sessions stop; restart them with `claude respawn --all`.**
- 译：机器睡眠或关机，跑着的会话会停；用 `claude respawn --all` 恢复。
- 解读：**唯一的真死亡场景 = 机器停**。这是 §5 的设计边界——supervisor 是用户级进程，不是机器级 daemon。后面 Limitations 还会重申一次。

### S2.6 Row summaries

**The one-line summary in each row is generated by a Haiku-class model so the row can tell you what the session is doing, what it needs, or what it produced without opening the transcript.**
- 译：行里那句一行摘要由 Haiku 级模型生成，让你不打开 transcript 就知道在干什么/需要什么/产出什么。
- 解读："Haiku-class" 是性价比型号——快、便宜。Anthropic 让小模型当**"标签生成器"**，给主模型的工作产出贴标签。这是个轻量但有效的用法。

**While a session is actively working, the summary refreshes at most once every 15 seconds, plus once when each turn ends.**
- 译：会话在跑时，摘要最多 15 秒刷一次，外加每轮结束时刷一次。
- 解读：15 秒节流（throttle）+ 关键事件刷新。**避免每个动作都触发一次小模型调用**——既省钱又减少行抖动。

**Each refresh is one short Haiku-class request through your normal provider, billed and handled under the same data usage terms as the session itself.**
- 译：每次刷新就是一次 Haiku 短请求，走你的常规 provider，账单和数据条款跟会话本身一致。
- 解读：把"小模型从哪来"说清楚——**走你的账户**，不是 Anthropic 给你免费送。这避免了"我没用 Haiku 怎么还收费"的疑问。

### S2.7 Pull request status

**When a session opens a pull request, a status dot appears at the right edge of the row, linked to the pull request in terminals that support hyperlinks.**
- 译：会话开 PR 时，行右侧出现状态点；支持 hyperlink 的终端里点可点。
- 解读：把"PR 状态"做成一等公民。这是承认了"开 PR 是后台会话最常见的产物"。

**When the session has opened more than one pull request, the count appears before the dot and the color reflects whichever one most needs attention.**
- 译：开了多个 PR，点前面带数字，颜色取最需要关注的那个。
- 解读：聚合策略——**取最优先级状态**（不是最差，不是平均）。

**Yellow — Waiting on checks or review, or checks failed**
- 译：黄 = 等 check / 等 review / check 失败
- 解读：黄是"待办"，不区分等待和失败——这点其实合并得有点粗，但对扫视友好。

**Green — Checks passed and no review is blocking**
- 译：绿 = check 过了且没人卡 review
- 解读：可以合并的信号。

**Purple — Merged**
- 译：紫 = 已合并
- 解读：紫 = 完成态。

**Grey — Draft or closed**
- 译：灰 = 草稿或已关闭
- 解读：灰 = 非活跃。

**For most tasks this row is where you pick up the result: review and merge the pull request when the dot turns green.**
- 译：大多数任务，"绿点 = 来 review 并合 PR"就是你接手的信号。
- 解读：这一句基本宣告：**agent view 的标准产出是 PR，不是聊天结论**。这是个产品哲学声明。

![watch / peek / attach 三档介入](03_交互三档.png)

### S2.8 Peek and reply（详节）

**Press `Space` on a selected row to open the peek panel.**
- 译：选中行按空格打开 peek。
- 解读：第二次提空格。

**It shows what the session needs from you, its most recent output, and any pull requests it opened.**
- 译：显示它需要你什么、最近输出、开的 PR。
- 解读：三项内容压一屏。"need from you" 放第一位——驱动型设计。

**Most of the time this is enough, and you never need to open the full transcript.**
- 译：多数时候够了，不必开完整 transcript。
- 解读：**peek 是默认推荐**，attach 是逃生通道。

**Type a reply in the peek panel and press `Enter` to send it to that session.**
- 译：peek 里打字回车就发。
- 解读：peek 不只是只读——它是**精简版交互**。

**When the session is asking a multiple-choice question, the peek panel shows the options and you can press a number key to pick one.**
- 译：会话问选择题时，peek 显示选项，数字键选。
- 解读：把 Claude Code 内置的 multi-choice prompt 抬到 peek 层。这意味着 Anthropic 鼓励 Claude 用结构化 prompt 而不是开放问题——便于异步处理。

**For other blocked sessions, press `Tab` to fill the input with a suggested reply you can edit before sending.**
- 译：其他卡住的会话，按 Tab 填进建议回复，编辑后再发。
- 解读：Tab = 建议补全。再次把"减少打字"做成体感。

**Prefix a reply with `!` to send a Bash command instead.**
- 译：回复以 `!` 开头则发 Bash 命令。
- 解读：跟 `claude` 里的 bash 模式一致——保持手势统一。

**Use `↑` and `↓` to peek at adjacent sessions without closing the panel, or `→` to attach.**
- 译：上下箭头连续 peek 邻行，右箭头 attach。
- 解读：peek 里上下 = **横扫**多个会话。配合"多任务并行"非常顺手——一个键一行过。

### S2.9 Attach to a session

**Press `Enter` or `→` on a selected row to attach.**
- 译：选中行按回车或右箭头 attach。
- 解读：第二次说 attach 入口。回车也行——因为多数人下意识就是回车。

**Agent view is replaced by the full interactive session, exactly as if you had run `claude` in that directory.**
- 译：agent view 被完整交互会话替代，就像在那个目录跑 `claude`。
- 解读：再次强调"exactly as if"——零功能损失承诺。

**When you attach, Claude posts a short recap of what happened while you were away.**
- 译：attach 时 Claude 会发个简短的"你不在时发生了什么"。
- 解读：**复盘信号**。解决异步监工的最大痛点——"我离开 1 小时回来，到底发生了什么"。这个"recap"是 Claude 主动做的，不是用户问的。

**While attached, the session behaves like any other Claude Code session: every command, keyboard shortcut, and feature works.**
- 译：attach 状态下，会话跟普通 Claude Code 一样，所有命令、快捷键、特性都好用。
- 解读：第三次强调"零功能损失"。Anthropic 知道用户对"后台 = 阉割"有刻板印象，反复破除。

**Press `←` on an empty prompt to detach and return to agent view.**
- 译：在空 prompt 按 ← detach 回 agent view。
- 解读：第三次说左箭头 detach。

**If a dialog has focus and isn't responding to `←`, press `Ctrl+Z` to detach immediately.**
- 译：弹窗占了焦点不响应 ←，按 Ctrl+Z 立即 detach。
- 解读：**逃生键**。Ctrl+Z 在 Unix 里是 SIGTSTP，挂起进程——Anthropic 复用这个肌肉记忆。

**Detaching never stops a background session: `←`, `Ctrl+C`, `Ctrl+D`, `Ctrl+Z`, and `/exit` all leave it running.**
- 译：detach 不会停后台会话；←、Ctrl+C、Ctrl+D、Ctrl+Z、/exit 都不会停。
- 解读：把"五种你以为会停"的方式一次澄清——**全都只是断开**，不是结束。这是反 Unix 习惯（Ctrl+C 通常杀进程），所以必须明说。

**To end a session from inside it, run `/stop`.**
- 译：要从里面真停掉，用 `/stop`。
- 解读：**主动结束的唯一手段**——配套上面那条。

**After you've dispatched or backgrounded a session, pressing `←` on an empty prompt works from any Claude Code session, not only ones you attached to from agent view.**
- 译：派过/backgrounded 过会话之后，左箭头从**任何** Claude Code 会话里都能用，不限于 attach 来的。
- 解读：这是把"← 切到 agent view"做成**全局手势**——只要你已经进入过 agent view 的生态，左箭头就解锁了。

**It backgrounds the current session and opens agent view with that session pre-selected, so you can switch sessions without leaving the terminal.**
- 译：左箭头会把当前会话 background 并打开 agent view，且预选中它，让你不离终端切会话。
- 解读："pre-selected"——上下文连续性。switch 不丢焦点。这就是 IDE tab 切换的感觉。

**You can turn this shortcut off in `/config`.**
- 译：可以在 `/config` 关掉这个快捷键。
- 解读：给"觉得太激进"的用户留逃生口。

### S2.10 Organize the list

**Agent view groups sessions so the ones that need input are at the top, with `Ready for review` and `Needs input` above `Working` and `Completed`.**
- 译：agent view 把分组排序——Ready for review 和 Needs input 在 Working 和 Completed 之上。
- 解读：**最高优先级 = 等你接手的产出 + 等你回答**。两件最干涉注意力的事最先看到。

**These group names don't map one-to-one to the states above: a session moves to `Ready for review` when it has an open pull request, and `Completed` collects finished, failed, and stopped sessions together.**
- 译：分组名跟前面的状态**不是一一对应**：开 PR 的去 Ready for review；Completed 把成功/失败/停止都收一起。
- 解读：状态机（颜色/形状）≠ 分组（视觉层）。这是 UI 工程师常见的解耦——内部状态多但展示态压缩。

**Press `Ctrl+S` to group by directory instead. Your choice persists across runs.**
- 译：Ctrl+S 改成按目录分组；选择会持久化。
- 解读：两种分组——按状态（默认）、按目录（多 repo 场景）。"persists across runs" = 偏好保存。

**Within a group: Press `Ctrl+T` to pin a session to the top — Press `Shift+↑` or `Shift+↓` to reorder — Press `Ctrl+R` to rename — Press `Enter` on a group header to collapse.**
- 译：组内：Ctrl+T 置顶 / Shift+上下重排 / Ctrl+R 改名 / 回车折叠分组头。
- 解读：四个组内操作。把"用户对列表的所有权"做到位——可置顶、可排、可改名、可折叠。

**To remove a session from the list, press `Ctrl+X` to stop it and `Ctrl+X` again within two seconds to delete it.**
- 译：删除 = Ctrl+X 停 + 两秒内再 Ctrl+X 删。
- 解读：**两次确认**的删除手势——防误删。

**Pressing `Ctrl+X` on a group header deletes every session in that group after confirmation.**
- 译：在分组头按 Ctrl+X 删整组（需确认）。
- 解读：批量删，需对话框确认（不是双击）。

**Deleting removes the session from agent view and cleans up its worktree, including any uncommitted changes in it, so push or commit work you want to keep before deleting.**
- 译：删除会清掉 worktree，**未提交的改动一起没**，所以删之前先 push/commit。
- 解读：**最重要的危险提示**。worktree 是 agent view 的隔离机制（§3.4 详说），删会话 = 删 worktree = 丢未提交。

**The conversation transcript stays on disk and remains available through `claude --resume`.**
- 译：对话 transcript 还在盘上，能用 `claude --resume` 找回。
- 解读：对话历史**不**随删除消失——可读但不可继续派。

**Older completed sessions fold into a `… N more` row to keep the list short.**
- 译：老的已完成会话折叠成"还有 N 条"一行。
- 解读：列表整洁性。

**Failures and sessions with an open pull request always stay visible.**
- 译：失败的、开了 PR 的，**永不折叠**。
- 解读：折叠规则的例外——保证用户不会错过需要处理的事。

### S2.11 Filter sessions

**Type in the dispatch input to filter instead of dispatching.**
- 译：在输入框打字可过滤而不是派发。
- 解读：输入框 = **双模**——派发 + 过滤。怎么区分？看下面三种前缀。

**`a:<name>` — Sessions running the named agent**
- 译：a: + 名字 = 按 agent 名过滤
- 解读：a 取自 agent。

**`s:<state>` — Sessions in the given state, such as `s:working`. Also accepts `s:blocked` for everything waiting on you**
- 译：s: + 状态 = 按状态过滤；`s:blocked` 是"等你的"合集
- 解读：blocked 是个**虚拟状态**——把 Needs input + Ready for review 这些"卡在你这"的合起来。给用户一个"我现在要处理什么"的快查。

**`#<number>` or a PR URL — The session working on that pull request**
- 译：#数字 或 PR URL = 找做那个 PR 的会话
- 解读：从 PR 反查会话。配合 §2.7 PR 状态做闭环。

### S2.12 Keyboard shortcuts 表

**Press `?` in agent view to see every shortcut in context.**
- 译：在 agent view 按 ? 看所有快捷键。
- 解读：`?` 是 vim 系约定。

**The table below summarizes them.**
- 译：下表汇总。
- 解读：下面这张快捷键表不逐行解读——它是参考表，不是论述。但有几个**值得专门指出**的设计点：
  - `Enter` 是双模：行上是 attach，输入框有字是 dispatch。一个键的语义随上下文切换。
  - `Shift+Enter` = dispatch + attach 一步——给"我就想立刻看着它干"的用户。
  - `Alt+1`..`Alt+9` = 数字直达组内 1-9 号——给键盘党。
  - `Ctrl+G` = 用 $EDITOR 写 prompt——长 prompt 体验。
  - `Esc` 和 `Ctrl+C` 都能退，但语义差异：Esc 是"取消当前面板"，Ctrl+C 双按才退。

---

## §3 Dispatch new agents

### S3.0 派发章导语

**You can dispatch new background sessions from agent view, send an existing interactive session to the background, or start one directly from the shell.**
- 译：可以从 agent view 派、或把交互会话送后台、或直接从 shell 起。
- 解读：**三个入口**——后面三个子节分别对应。

### S3.1 From agent view

**Type a prompt in the input at the bottom of agent view and press `Enter` to start a new background session.**
- 译：底部输入框打字回车 = 起新后台会话。
- 解读：最常用入口。

**The session is named automatically from the prompt; rename it later with `Ctrl+R`.**
- 译：会话名从 prompt 自动取；后面 Ctrl+R 改。
- 解读：默认命名。命名重要——因为是行的第一列。

**Paste an image into the prompt to include a screenshot or diagram with the task.**
- 译：粘贴图片 = 把截图/示意图一起带进任务。
- 解读：多模态输入。常用于"看这个 UI 错位"、"按这张架构图实现"。

### S3.2 Prompt 前缀和 mention

**`<agent-name> <prompt>` — If the first word matches a custom subagent name, that subagent runs as the session's main agent with the configuration from its frontmatter**
- 译：第一个词是 subagent 名 → 用该 subagent 当主 agent，吃它的 frontmatter 配置
- 解读：**裸名匹配**——不需要 @ 也能触发。

**`@<agent-name>` — Mention a custom subagent anywhere in the prompt to run it as the main agent**
- 译：@subagent 任意位置 → 用它当主 agent
- 解读：显式手势。

**`@<repo>` — Mention a repository under the directory you opened agent view from to run the session there**
- 译：@repo → 在那个 repo 跑会话
- 解读：跨目录派发的语法糖。

**`/<skill>` — Suggest skills to dispatch as the prompt**
- 译：/skill → 用 skill 当 prompt
- 解读：skill 是封装好的可复用 prompt——后面那句话就讲了这个的价值。

**`#<number>` or a pull request URL — If a session is already working on that PR, select it instead of dispatching**
- 译：#编号或 PR URL → 已有人做就选它，不另起
- 解读：**幂等性**——避免重复派同 PR。

**`Shift+Enter` — Dispatch and immediately attach to the new session**
- 译：Shift+回车 = 派 + 立即 attach
- 解读：跟过滤无关，是手势变体。

**Packaging a recurring task as a skill lets you start the same workflow from agent view repeatedly without retyping the prompt.**
- 译：把重复任务封装成 skill，能在 agent view 反复触发同一个工作流，不用重输 prompt。
- 解读：把 skill 推上正面舞台——这跟用户 CLAUDE.md 里 deep-decode / scout / aihot 这些 skill 的逻辑一致。

**When the same `@name` matches both a subagent and a sibling repository, the subagent takes precedence.**
- 译：subagent 名和 repo 名撞了 → subagent 优先。
- 解读：歧义解析规则。subagent 在 agent view 设计哲学里更核心。

**The bare first-word match also applies, so a prompt that happens to begin with one of your subagent names dispatches that subagent rather than treating the word as plain text.**
- 译：裸首字匹配也适用——prompt 不小心以 subagent 名开头，会触发那个 subagent，不当普通文本。
- 解读：**意外触发警告**。如果你给 subagent 取名 `fix`，那"fix the login bug"就会触发它。

**Use the `@` form when you want to be explicit, or start the prompt with a different word to avoid the match.**
- 译：要明确就用 @；要避开就别用那个词开头。
- 解读：两个规避方法。

### S3.3 Dispatch to a specific directory

**A new session runs in the directory you opened agent view from.**
- 译：新会话在你打开 agent view 的目录里跑。
- 解读：默认行为。

**To target a different directory: Open `claude agents` in that directory — Open `claude agents` in a parent directory that holds several repositories and mention one with `@<repo>` in the prompt — From the shell, `cd` into the directory and run `claude --bg "<prompt>"`.**
- 译：想换目录：① 在目标目录打开 agent view；② 在多 repo 父目录打开后用 @repo；③ shell 里 cd + `claude --bg`。
- 解读：三种 workaround。这透露一个事实——agent view **不支持**在派发时直接切目录（只能通过这三种间接方式）。设计选择。

**When agent view is grouped by directory, the highlighted row's directory becomes the dispatch target, so you can scroll to a group and dispatch into it without retyping the path.**
- 译：按目录分组时，高亮行的目录 = 派发目标，不用重输路径。
- 解读：Ctrl+S 改分组后获得的副作用红利——派发目标随光标走。

### S3.4 From inside a session

**Run `/background` or its alias `/bg` to move the current conversation into a background session.**
- 译：用 `/background` 或别名 `/bg` 把当前会话送后台。
- 解读：核心命令。

**Pass a prompt such as `/bg run the test suite and fix any failures` to give one more instruction first.**
- 译：可以带 prompt 一起发——`/bg run the test suite...`——给后台再多一条指令。
- 解读：background + 派一条新任务，合一步。

**Backgrounding from an interactive session starts a fresh process that resumes from the saved conversation, so running subagents, monitors, and background commands do not transfer to it.**
- 译：从交互会话 background → 起新进程从存盘对话恢复；正在跑的 subagent / monitor / 后台命令**不会**带过去。
- 解读：**重要丢失警告**——in-flight 工作不转移。这是因为 `/bg` 的实现是"存盘 + 重启进程"，不是"进程接管"。

**Claude asks you to confirm before backgrounding when any are running.**
- 译：有 in-flight 的话，Claude 会让你确认再 background。
- 解读：防误丢工作的提示。

**Once in the background, the session can start new subagents, monitors, and background commands, and those keep running across later detach and reattach.**
- 译：进了后台之后，新起的 subagent / monitor / 后台命令能扛 detach + reattach。
- 解读：**只有"重启边界"会丢——边界之后起的就稳了**。这是一个生命周期分水岭。

### S3.5 From your shell

**Pass `--bg` to start a session that goes straight to the background.**
- 译：`--bg` 让会话直接进后台。
- 解读：脚本化友好。

**`claude --bg "investigate the flaky SettingsChangeDetector test"`**
- 译：示例命令。
- 解读：注意 prompt 写法——明确具体任务名（"flaky SettingsChangeDetector test"）。

**To run a specific subagent as the session's main agent, combine `--bg` with `--agent`.**
- 译：要用特定 subagent 当主 agent，`--bg` 配 `--agent`。
- 解读：两个 flag 正交。

**`claude --agent code-reviewer --bg "address review comments on PR 1234"`**
- 译：示例。
- 解读：code-reviewer 是个典型 subagent 名——做 PR 评审这种边界清晰的活非常合适。

**After backgrounding, Claude prints the session's short ID and the commands for managing it.**
- 译：background 完，Claude 打印短 ID 和管理命令。
- 解读：让用户**立刻拿到下一步动作**——不用查文档。

文档示例打印块：
```
backgrounded · 7c5dcf5d
  claude agents             list sessions
  claude attach 7c5dcf5d    open in this terminal
  claude logs 7c5dcf5d      show recent output
  claude stop 7c5dcf5d      stop this session
```
- 解读：8 位短 ID。四条最常用的管理命令。这就是 §4 shell 管理章的预告。

![worktree 隔离：读共享、写各自](04_worktree隔离.png)

### S3.6 How file edits are isolated

**Every background session, whether started from agent view, `/bg`, or `claude --bg`, starts in your working directory.**
- 译：所有后台会话（不管哪种起法）都从你的工作目录开始。
- 解读：三种入口共享起点。

**Before editing files, Claude moves the session into an isolated git worktree under `.claude/worktrees/`, so parallel sessions can read the same checkout but each writes to its own.**
- 译：编辑文件前，Claude 把会话挪进 `.claude/worktrees/` 下独立 worktree——读共享，写各自。
- 解读：**关键机制**。git worktree 是个 underused 的 git 特性——同一仓库多 checkout。Anthropic 拿它做并行隔离的底盘。"读共享"是因为 worktree 共享 .git 对象库。

**Claude skips this when the session is already under `.claude/worktrees/`, when the working directory isn't a git repository, or for writes outside the working directory.**
- 译：三种情况下不进 worktree：① 已经在 worktree 里；② 不是 git 仓库；③ 写到工作目录外。
- 解读：边界条件。第三种特别值得注意——写 ~/.zshrc 不会被隔离。

**Outside a git repository, sessions write to the working directory directly and aren't isolated from each other, so avoid dispatching parallel sessions that edit the same files.**
- 译：非 git 目录里，会话直接写工作目录、互相不隔离，所以别同时派多个改同一份文件。
- 解读：明确"non-git 区是危险区"——并行靠 git。

**The worktree is removed when you delete the session, so merge or push the changes you want to keep before you delete.**
- 译：删会话 = 删 worktree，所以要留的活先合或推。
- 解读：第二次说这事（§2.10 已经提过）。重要到反复提醒。

**To find a session's worktree path, peek the session or attach and check its working directory.**
- 译：找 worktree 路径：peek 它或 attach 后看 cwd。
- 解读：实操指引。

**To make a subagent always run in its own worktree regardless of how it was started, set `isolation: worktree` in its frontmatter.**
- 译：要让 subagent 不管怎么起都用独立 worktree，frontmatter 里写 `isolation: worktree`。
- 解读：声明式隔离。frontmatter 是 subagent 的"配置面板"。

### S3.7 Set the model

**The model name shown in the agent view header is the dispatch default.**
- 译：header 显示的模型 = 派发默认。
- 解读：第一次明确点出 header 模型字段的作用。

**New sessions you start from the input use this model, which is the same setting `/model` controls in any session.**
- 译：从输入框起的新会话用这个模型；这就是 `/model` 在任何会话里控制的那个设置。
- 解读：跨界面一致——dispatch 不引入新概念，是已有设置的复用。

**Each background session can run on a different model.**
- 译：每个后台会话可以用不同模型。
- 解读：异构 — 给"重活用大模型、轻活用小"的策略留口。

**To override it for one session: From the shell, pass `--model` with `claude --bg` — Attach to a running session and run `/model` there. The change persists if the session is respawned — Dispatch a subagent whose frontmatter sets a `model` field.**
- 译：三种覆盖：① shell 加 `--model`；② attach 后 `/model`，respawn 后仍有效；③ 派的 subagent frontmatter 设 model。
- 解读：三层覆盖优先级——CLI > 会话内 > subagent 默认。"persists if respawned" 表示设置写进了会话存档。

### S3.8 Permission mode and settings

**A dispatched session reads its settings and permission mode from the directory it runs in, the same as if you had started `claude` there.**
- 译：派出去的会话读运行目录的 settings 和 permission mode，跟在那里跑 `claude` 一样。
- 解读：第三次说"跟 `claude` 在那目录一样"——一致性原则贯穿全章。

**Dispatching from the agent view input doesn't pass a permission mode, so the session uses the `defaultMode` from that directory's settings or the `permissionMode` from the dispatched subagent's frontmatter.**
- 译：从 agent view 派不传 permission mode，所以会话用目录 settings 的 `defaultMode` 或 subagent frontmatter 的 `permissionMode`。
- 解读：派发**不**覆盖权限——这是安全设计。"目录默认 or subagent frontmatter"是回退链。

**To set the mode from the shell, pass `--permission-mode` with `claude --bg`.**
- 译：从 shell 用 `--permission-mode` 配 `--bg` 设置。
- 解读：shell 是**唯一**能在派发时覆盖权限的路径。

**Using `bypassPermissions` or `auto` this way is refused until you have accepted that mode by running `claude` with it once interactively, since those modes let a session you aren't watching act without approval.**
- 译：用 `bypassPermissions` 或 `auto` 会被拒绝——除非你**先在交互里手动跑过一次接受**。因为这些模式让你没盯着的会话可以无审批行动。
- 解读：**重要安全门**。这是防止"agent view 一键开启自动模式"的滥用。要求"先在面前过一次手"才能在后台用——确认用户知情。这种"first interactive consent"的设计模式值得记下来。

---

## §4 Manage sessions from the shell

### S4.0 Shell 管理章导语

**Every background session has a short ID you can use from the shell.**
- 译：每个后台会话有个短 ID，shell 里能用。
- 解读：ID 是把会话当作"对象"操作的句柄。

**The ID is printed when you start a session with `claude --bg`, and each session's ID is its directory name under `~/.claude/jobs/`.**
- 译：`claude --bg` 启动时打印 ID；ID 也是 `~/.claude/jobs/` 下的目录名。
- 解读：ID = 目录名——**ls 一下就知道有哪些会话**。文件系统作为隐性 API。

**These commands are useful for scripting or when you don't want to open agent view.**
- 译：这些命令适合脚本化或不想开 agent view 时用。
- 解读：双场景——自动化 + 喜欢 CLI 的人。

### S4.1 Shell 命令表

**`claude agents` — Open agent view**
- 解读：第 5 次给入口。

**`claude attach <id>` — Attach to a session in this terminal**
- 解读：跨终端 attach——从 shell 直接进某个会话。这才是 ID 的真正用法。

**`claude logs <id>` — Print the session's recent output**
- 解读：不 attach 看输出。脚本化检查首选。

**`claude stop <id>` — Stop a session. Also accepts `claude kill`**
- 解读：stop / kill 同义。Unix 友好命名。

**`claude respawn <id>` — Restart a stopped session with its conversation intact**
- 解读：复活单个。conversation intact = 对话历史保留。

**`claude respawn --all` — Restart every stopped session**
- 解读：批量复活——机器睡完醒来的那个动作。`--all` 是用户视角下"恢复昨天的工作"。

**`claude rm <id>` — Remove a session from the list. Cleans up its worktree if there are no uncommitted changes**
- 解读：rm 是带保险的——**有未提交就拒删**。注意这跟 §2.10 那条"删会话连未提交一起没"不矛盾——区别在于：agent view 内 Ctrl+X 是强制删，CLI `claude rm` 是保险删。两个入口，两种语义。

---

## §5 How background sessions are hosted

### S5.0 章导语

**Every session listed in agent view is considered a background session, whether or not you're currently attached to it.**
- 译：agent view 里的每个会话都算后台会话，不管你是否 attach。
- 解读：定义。**attach 不改变后台属性**——只是临时连上看。

**By contrast, a session started by running `claude` directly is tied to that terminal and ends when it closes, unless you send it to the background.**
- 译：相比之下，直接 `claude` 起的会话被绑定到那个终端，关终端就完，除非你 background 它。
- 解读：**两类会话**的明确对照——前台（终端绑定）vs 后台（supervisor 托管）。从设计角度看，前台是后台的"未升级版"。

![supervisor 进程拓扑](02_supervisor架构.png)

### S5.1 The supervisor process

**Background sessions are hosted by a per-user supervisor process, separate from your terminal and from agent view.**
- 译：后台会话由一个**用户级** supervisor 进程托管，独立于你的终端和 agent view。
- 解读：**per-user**——每个 OS 用户一个 supervisor。不是 per-machine（系统级 daemon），也不是 per-project。这决定了"supervisor 的生命周期跟用户登录会话有关"。

**The supervisor starts automatically the first time you background a session or open agent view, and you don't manage it directly.**
- 译：第一次 background 或开 agent view 时自动启动；你不用管它。
- 解读："you don't manage it directly"——刻意把 supervisor 藏起来。不让用户碰 = 减少错误面。

**The supervisor and its sessions authenticate with the same credentials as your interactive sessions and make no additional network connections beyond the model API.**
- 译：supervisor 和它的会话用跟交互会话**同一套凭证**认证，除了 model API 不额外联网。
- 解读：**安全声明**。"no additional network connections" 是回应"后台 daemon 是不是在偷偷连什么"的潜在担忧。

**Each background session is its own Claude Code process, managed by the supervisor rather than tied to your terminal.**
- 译：每个后台会话是独立的 Claude Code 进程，supervisor 管，不依附终端。
- 解读：**一会话 = 一进程**。这意味着会话之间资源、内存独立。supervisor 是调度者不是宿主。

**A session that's actively working, waiting for your input, or has a terminal attached keeps its process running.**
- 译：在干活的、等你输入的、有终端 attach 的，进程保持。
- 解读：三种"保活"条件。

**Once a session finishes and sits unattached for about an hour, the supervisor stops its process to free resources.**
- 译：完成且无 attach 闲置约一小时 → supervisor 停掉它的进程释放资源。
- 解读：**一小时 GC**。这是 Anthropic 拍的数字——既不算激进（10 分钟）也不保守（一天）。后面 Troubleshooting 会重复说。

**The transcript and state stay on disk, and the next time you attach, peek, or reply, the supervisor starts a fresh process from where it left off.**
- 译：transcript 和 state 留在盘上；下次 attach/peek/reply 时，supervisor 起新进程从断点恢复。
- 解读：**冷启动透明化**。三个动作都触发恢复——任何用户接触都能复活。

**When every session has finished and no terminal is connected, the supervisor itself exits and starts again the next time you need it.**
- 译：所有会话都完成且无终端连接 → supervisor 自己退出；下次需要再起。
- 解读：**supervisor 也会死**。它不是系统级 daemon——空闲会被自己回收。这是 Mac 用户的 launchd 友好行为。

**The supervisor watches the installed Claude Code binary on disk and restarts into the new version after the regular auto-updater replaces it.**
- 译：supervisor 监视磁盘上的 Claude Code 二进制；auto-updater 换完之后它重启进新版本。
- 解读：**热升级**——auto-updater 替二进制后，supervisor 自己跳进去。无需用户重启。

**This is a local file watch, not a network check.**
- 译：是本地文件监视，不是网络检查。
- 解读：澄清——不会偷偷请求 Anthropic 服务器。

**Background sessions are detached processes, so they keep running through the restart and the new supervisor reconnects to them.**
- 译：后台会话是 detached 进程，所以 supervisor 重启时它们继续跑，新 supervisor 再连上。
- 解读：**升级零中断**。这套机制让 Anthropic 能高频出版本（每周）不打扰用户的长任务。

### S5.2 Where state is stored

**Session state is stored under your Claude Code config directory.**
- 译：状态存在 Claude Code config 目录下。
- 解读：默认 `~/.claude`。

**If you set `CLAUDE_CONFIG_DIR`, the supervisor uses that directory instead of `~/.claude` and runs as a separate instance with its own sessions.**
- 译：设了 `CLAUDE_CONFIG_DIR` 就用那个目录，且 supervisor 作为**独立实例**跑，会话也是独立的。
- 解读：**多租户**——同一台机器同一个用户可以跑多个 Claude Code 实例（比如工作 / 个人分目录）。

**`~/.claude/daemon.log` — Supervisor log**
- 解读：日志位置。troubleshooting 用。

**`~/.claude/daemon/roster.json` — List of running background sessions, used to reconnect after a restart**
- 解读：**关键文件**——supervisor 重启时靠这个 roster 知道有哪些会话要重连。

**`~/.claude/jobs/<id>/state.json` — Per-session state shown in agent view**
- 解读：每会话状态。这就是 agent view 列表的数据源——是文件系统驱动的 UI。

### S5.3 Turn off agent view

**To turn off background agents and agent view entirely, set the `disableAgentView` setting to `true` or set the `CLAUDE_CODE_DISABLE_AGENT_VIEW` environment variable.**
- 译：彻底关 = `disableAgentView: true` 或 `CLAUDE_CODE_DISABLE_AGENT_VIEW` 环境变量。
- 解读：两种关法——配置 + 环境变量。环境变量给容器化/CI 场景。

**Administrators can enforce this through managed settings.**
- 译：管理员可以通过 managed settings 强制关。
- 解读：**企业场景**——IT 给所有员工统一关掉。这暴露了 Claude Code 已经在面向 enterprise 部署。

---

## §6 Troubleshooting / Limitations / Related

### S6.1 `claude agents` lists subagents instead of opening agent view

**If `claude agents` prints a count followed by your configured subagents and then exits, agent view is unavailable in your environment.**
- 译：如果 `claude agents` 打印个数+列出 subagent 就退了，说明 agent view 在你的环境里不可用。
- 解读：**症状识别**——agent view 不可用时，命令降级成"列 subagent"。这是个老版本行为。

**Earlier versions didn't open agent view in every environment, including when connected through Bedrock, Vertex AI, or Foundry.**
- 译：老版本在某些环境不开 agent view，包括 Bedrock / Vertex AI / Foundry。
- 解读：三大云端 LLM provider 都被点名——说明 agent view 早期只支持原生 Anthropic API，后来才补齐。

**Run `claude update` to install the latest version.**
- 译：跑 `claude update` 升级。
- 解读：第一招——升级。

**If agent view still does not open after updating, check whether it has been turned off by a setting or environment variable.**
- 译：升级了还不开，查是不是被设置或环境变量关掉了。
- 解读：第二招——查关闭开关。

### S6.2 Agent view opens with no sessions

**Agent view is empty until you dispatch your first session.**
- 译：在你派第一个会话前，agent view 是空的。
- 解读：空状态是正常的。

**Type a prompt in the input at the bottom and press `Enter`.**
- 译：在底部输入框打字回车。
- 解读：第 N 次说同一件事。文档里反复说基础动作——因为初学者会真的迷路。

### S6.3 Cannot open agents because background tasks are running

**If pressing `←` to background the current session shows `Cannot open agents — N background task(s) running`, the session has in-flight work such as a subagent, a workflow, or a background shell command, and the shortcut won't silently abandon it.**
- 译：按 ← background 时报"有 N 个后台任务在跑"——是因为会话里有 in-flight 工作（subagent / workflow / 后台 shell），快捷键不会**默默**抛弃它们。
- 解读：第二次提"background 会丢 in-flight"。这里把它做成**显式提示+拒绝**——好的"反误操作"设计。

**Run `/tasks` to see what's running, then `/bg` to confirm abandoning them.**
- 译：`/tasks` 看在跑什么，`/bg` 确认放弃。
- 解读：两步——先看清楚再决定。

**See From inside a session for what does and doesn't transfer when you background.**
- 译：哪些东西 background 会带过去哪些不会，看《From inside a session》。
- 解读：内部交叉引用。

### S6.4 Prompt rejected as too short

**The dispatch input expects a task description, not a conversational opener.**
- 译：派发输入框要的是任务描述，不是聊天开场。
- 解读：心智校正——agent view 不是聊天机器人。

**A prompt shorter than four characters is rejected with a `Too short` hint so a stray keystroke doesn't start a session.**
- 译：少于四字会被拒，提示"Too short"，防止误触起会话。
- 解读：**4 字符门槛**——防误触的硬性 guard。一次手抖按错键不会浪费一个会话配额。

**Describe what you want the session to do, such as `investigate the flaky checkout test`.**
- 译：写清楚要它干什么，例如"investigate the flaky checkout test"。
- 解读：示例 prompt——动词开头 + 具体对象。

### S6.5 Sessions show as failed after waking your machine

**Background sessions don't survive sleep or shutdown, so sessions that were running show as failed after you wake.**
- 译：后台会话扛不住睡眠/关机，醒来后显示 failed。
- 解读：**唯一真死亡场景**的用户可见症状。

**Attach, peek, or reply to any of them and the session restarts from where it left off.**
- 译：attach/peek/reply 任一动作就能让它从断点重启。
- 解读：与 §5.1 一致。

**To restart all of them at once, run `claude respawn --all`.**
- 译：批量恢复用 `claude respawn --all`。
- 解读：早晨第一杯咖啡时的那条命令。

### S6.6 A session is slow to respond after attaching

**Once a session has finished and sat unattached for about an hour, the supervisor stops its process to free resources.**
- 译：完成且无 attach 闲置一小时 → 进程被停。
- 解读：第二次说一小时 GC 规则。

**Attaching starts a fresh process from where it left off, which takes a moment.**
- 译：attach 起新进程从断点恢复，需要一点时间。
- 解读：**用户感知的延迟**——告诉你这不是 bug 是设计。

**Sessions that are working or waiting on you are never stopped this way.**
- 译：在干活或等你的会话**绝不会**被这样停掉。
- 解读：明确保护边界——GC 只挑闲置已完成的，不打扰活跃的。

### S6.7 `.claude/worktrees/` is filling up

**Worktrees are removed when you delete the session that created them.**
- 译：删会话 → worktree 跟着删。
- 解读：第三次说。

**If a session ended without cleaning up, list leftover entries with `git worktree list` in the project directory and remove each with `git worktree remove <path>`.**
- 译：会话没清干净就走了 → `git worktree list` 看 + `git worktree remove <path>` 一个个删。
- 解读：**手动清理**指引。Claude Code 没造新工具，直接用 git 原生命令——好习惯。

**See Clean up worktrees.**
- 解读：交叉引用 worktree 专门页。

### S6.8 Limitations

**Agent view is in research preview with the following limitations:**
- 译：研究预览阶段，有以下限制：
- 解读：第二次给 preview 标签——开头说一次，结尾再说一次。

**Rate limits apply: background sessions consume your subscription usage the same as interactive sessions, so running ten agents in parallel uses quota roughly ten times as fast as running one.**
- 译：吃配额：后台会话跟交互一样吃订阅；10 个并行约 10 倍速度耗配额。
- 解读：**精确的成本预警**——"roughly ten times" 是个粗略数字（实际取决于活动密度），但够用户做心算。

**Sessions are local: background sessions run on your machine and stop if it sleeps or shuts down.**
- 译：会话是本地的：跑在你机器上，机器睡/关就停。
- 解读：第二次重申机器停的边界。也是给"为什么不让 supervisor 上云"的回答——这一版就是本地的。

**Worktrees are deleted with the session: merge or push changes before deleting a session that edited files in its own worktree.**
- 译：worktree 跟会话一起删；删之前先合并/推送有改动的会话。
- 解读：**第四次**强调这事。说明用户真的容易踩这个坑。

### S6.9 Related resources

**Run agents in parallel: compare agent view with subagents, agent teams, and worktrees**
- 解读：对比页。如果想搞清楚四种并行的取舍，看这页。

**Agent teams: coordinate multiple sessions that message each other**
- 解读：多会话**互通信**——agent view 只是把多会话放一起，不让它们对话；teams 才是。

**Claude Code on the web: run sessions in a managed cloud environment instead of locally**
- 解读：**云端版**。这条回答了"Sessions are local"的痛点——想要 24/7 不停的，去用 web 版。Anthropic 把云作为差异化产品线明示。

---

## 本期关键词

**supervisor process** — 用户级守护进程，托管所有后台会话。不是系统级（不写 launchd），不是 per-project（跨目录共享）。空闲会自己退出，下次自动起。这是把"会话生命周期"从"终端生命周期"剥离的物理实现。值得知道——它揭示了 Claude Code 已经把自己当成"长任务平台"而不是"聊天 CLI"。

**dispatch** — 在调度系统语境里"派发任务进队列"的动作。Anthropic 用这个词替代"start a conversation"，是在重新定义心智。值得知道——这是产品哲学的语言学信号。

**peek vs attach** — 两层介入的明确分层。peek 是只读 + 精简交互（够 90% 场景），attach 是完整接入（少数情况）。值得知道——这种"轻 vs 重"双档介入是好的注意力调度模式，可以借鉴到自己产品上。

**git worktree** — Git 原生但少有人用的特性。同一仓库的多个独立 checkout，共享对象库。Claude Code 拿它当并行会话的文件隔离底盘。值得知道——这是个 underused 的 Git 技巧，知道了能解锁很多并行工作流。

**respawn** — Claude Code 的复活动词。`claude respawn --all` 是"机器醒来后恢复昨天工作"的那条命令。值得知道——这是后台会话从"crash"到"resumable"的状态机转换名词。

**Haiku-class model** — Anthropic 模型分层里的小快便宜档。这里被拿来当"行摘要生成器"。值得知道——主模型做活，小模型贴标签，是个高性价比的组合用法。

**research preview** — Anthropic 的产品成熟度标签。意思是"我们觉得能用但留退路"，对应"接口可能改"。值得知道——见到这个标签就别把 API 写死进核心流程。

**permission mode** — `defaultMode` / `bypassPermissions` / `auto` 这套权限档位。后两个在派发时必须先在交互里同意过一次。值得知道——"first interactive consent"是个值得学的安全设计模式。

---

## 原文关键引用

> "Each background session is a full Claude Code conversation that keeps running without a terminal attached, so you can open it, reply, and leave whenever you want."
> "每个后台会话都是完整的 Claude Code 对话，不需要终端挂着也能跑，所以你可以随时打开、回复、走人。"
> —— 这是整页设计哲学的中心句。

> "Background sessions are hosted by a per-user supervisor process, separate from your terminal and from agent view."
> "后台会话由用户级 supervisor 进程托管，独立于你的终端和 agent view。"
> —— supervisor 的定义句。

> "Sessions are local: background sessions run on your machine and stop if it sleeps or shuts down."
> "会话是本地的：跑在你机器上，机器睡或关就停。"
> —— 整个设计最大的边界声明。

---

## 引用

1. [Manage multiple agents with agent view](https://code.claude.com/docs/en/agent-view) —— 本期拆解原文（Claude Code 官方文档）
2. [Run agents in parallel](https://code.claude.com/docs/en/agents) —— 对比 agent view / subagents / agent teams / worktrees
3. [Sub-agents](https://code.claude.com/docs/en/sub-agents) —— subagent frontmatter 配置
4. [Agent teams](https://code.claude.com/docs/en/agent-teams) —— 会话间消息互通
5. [Worktrees](https://code.claude.com/docs/en/worktrees) —— git worktree 隔离机制
6. [Claude Code on the web](https://code.claude.com/docs/en/claude-code-on-the-web) —— 云端版补"local-only"的痛点
7. [Auto-updates](https://code.claude.com/docs/en/setup#auto-updates) —— supervisor 热升级机制
8. [Scheduled tasks (`/loop`)](https://code.claude.com/docs/en/scheduled-tasks) —— `/loop` 会话的图标 `✢`
