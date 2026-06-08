---
title: 12MB 对 300MB，但内存不是 Zerostack 的护城河
source: https://crates.io/crates/zerostack/1.0.0
author: gi-dellav
date: 2026-05-18
type: decode
---

![封面](assets/png/00_系列封面.png)

一个开发者 2026 年 5 月 12 日建了个仓库，5 月 17 日就把 1.0.0 推上 crates.io，第二天这个项目在 Hacker News 拿到 536 个赞、295 条评论。它叫 Zerostack，纯 Rust 写的编程代理，空闲时占 8MB 内存，干活时 12MB。同一时刻，Claude Code 在另一个开发者的机器上跑出 29 个进程、合计吃掉 6.3 GiB。

把这两个数字摆在一起，结论看起来很简单：Rust 比 JavaScript 省内存，又一个证明。但这个结论既不新鲜，也不是 Zerostack 值得拆的原因。真正的问题藏在 HN 那条最尖锐的反对评论里——对一个大部分时间在调用大模型、然后干等返回的软件，省那点内存到底有没有意义。

## 一个 7000 行的编程代理在做什么

编程代理（coding agent）是这两年的新工种：你在终端里用自然语言下指令，它读代码、改文件、跑测试、提交 commit。Claude Code、OpenAI Codex CLI、Aider、Cline、OpenCode 都是这个赛道的玩家。Zerostack 是最新一个，作者明说受 pi 和 opencode 启发。

它的功能清单不算寒酸。多 provider，OpenRouter 默认，也接 OpenAI 兼容接口、Anthropic、Gemini、本地的 Ollama。四档权限模式从最严到最松：restrictive 每个动作都问，standard（默认）安全命令如 `ls`、`git log`、`cargo check` 自动放行、写文件和危险操作才问，accept-all 工作目录内全自动、目录外才确认，yolo 全自动不问。它还有一个叫 doom-loop detection 的机制——同一个工具调用重复三次以上就触发警告，专门防代理陷进死循环里反复刷破坏性操作。

最值得看的设计是它处理"技能"的方式。Claude Code 那套有 Skills、有插件、有 MCP，是一个可以无限扩展的生态。Zerostack 反过来：内置十个系统提示模式——code、plan、review、debug、ask、brainstorm、frontend-design、review-security、simplify、write-prompt——运行时用 `/prompt` 切换，作者的原话是想用这一套 prompt"完全替代 superpower 或 Claude 官方的 skills"。它也会自动读项目根目录的 `AGENTS.md` 或 `CLAUDE.md` 注入系统提示。长任务有个叫 Ralph Wiggum loop 的迭代循环：读任务、从计划里挑一项、做、跑测试、更新计划、再循环，直到完成或到迭代上限。

![Zerostack 功能解剖](assets/png/01_功能解剖.png)

这些功能里没有一个是别家没有的。Zerostack 的全部叙事压在一个数字上：7000 行代码、8.9MB 二进制、12MB 内存，做到了别人 300MB 才做到的事。

## "省内存有意义吗"——这条反对没说到点上

HN 上点赞最高的质疑很直接：一个软件大部分时间在调 LLM 然后等响应，追求性能图什么。这个质疑有道理的一半，也漏掉的一半。

有道理的一半是：编程代理的延迟瓶颈确实是模型推理，不是本地进程。你等 Claude 想三十秒，本地代理用 8MB 还是 800MB 内存，对这三十秒毫无影响。从这个角度，Zerostack 的性能优化是在优化一个不在关键路径上的环节。

漏掉的一半是这个赛道的实际使用形态已经变了。开发者现在很少只开一个代理问一个问题，更常见的是同时开五六个 worktree、每个挂一个长跑代理、让它们各自啃一个任务跑几个小时。HN 上有人报 Claude Code 同时跑出 29 个进程占 6.3 GiB——这不是单次调用的内存，是"并行 + 长跑"这个新工作流下的累积内存。Zerostack 作者自己的回应印证了这一点：在试编程代理之前他也觉得性能优化没意义，但看到 Claude Code 和 copilot cli 有多慢、长 session 怎么吃掉几十 GB 内存之后，他"目瞪口呆"。

反对者还有一条更狠的："写不出一个不把系统跑到 swap 的简单 Java 代理，说明的是开发者水平，不是语言。"这条说对了因，错了果。大厂的编程代理吃内存不是因为工程师不会写省内存的代码，是因为他们用 TypeScript / Node 这套栈是为了别的——快速迭代、招人容易、生态现成。内存占用是这个选择的副产品，不是能力问题，是优先级问题。Zerostack 把优先级倒过来：单线程 async（`tokio` 的 current_thread 模式省掉约一半 RAM）、用 smallvec 和 compactstring 把小数据塞进栈、开 LTO 编译优化、按需分配。这些手段每一个 Node 工程师都懂，但没人会为一个内部快速迭代的产品去做，因为它们拖慢迭代速度。

![HN 之争：性能优化在不在关键路径上](assets/png/02_HN之争.png)

## 真正的差异化不在 8MB，在谁选了那 7000 行里的每一个依赖

如果内存数字不是护城河，那 Zerostack 凭什么值得占一篇拆解。证据在一句容易被划过去的作者回应里：他手动用 `cargo add` 选每一个依赖，不让大模型替他选，因为之前吃过代理生成代码引入"奇怪 crate"的亏。

这句话指向的分量比 8MB 重得多。编程代理这个赛道有一个被反复验证的事实：harness（包在大模型外面那层控制循环——接收消息、调模型、解析输出、路由工具调用、把结果塞回上下文）的调校质量，和模型本身一样决定成败。同一个 Opus 模型，在 Claude Code 里跑出 SWE-bench 77 分，在 Cursor 里跑出 93 分，差的 16 分全长在 harness 上。模型厂商把能力天花板一路抬高，agent 厂商真正能差异化的空间，就被挤到 harness 这层的工程质量上。

而 harness 是有保质期的。模型每升级一次，针对旧模型怪癖打的补丁就过期一部分。OpenAI 的应对是把 Codex CLI 用 Rust 重写（codex-rs），说明大厂也认了轻量化这个方向。Zerostack 的差异化不在它选了 Rust——Codex 也选了——而在它选 Rust 的方式：一个人，6 天，7000 行，每个依赖手选，每个 prompt 手写。这套东西的特征是它不可规模化。一个 50 人的团队没法"一个人手选每个依赖"，一个要快速迭代抢市场的产品没法停下来为内存做 LTO。Zerostack 的护城河不是技术领先，是它把工程克制本身变成了产品——而克制是大厂用 TypeScript 抢速度的模式里最难复制的东西。

![护城河：克制是大厂最难复制的差异化](assets/png/03_护城河.png)

## 放进赛道里看：它站在哪个生态位

把主流玩家摊开比，Zerostack 的位置就清楚了。

Claude Code 是为"睡觉时跑"设计的自主编排器，CLAUDE.md 跨 session 持久、Agent Teams 并行子代理、SWE-bench Pro 拿 80.8 分，代价是 3-4 倍的成本和几个 GB 的内存。Codex CLI 主打速度和效率，已用 Rust 重写，patch-based 编辑省 token，SWE-bench Pro 77.3 分。Aider 是 git-first 的结对程序员，每次编辑即一个 commit，token 效率是 Claude Code 的 4.2 倍，强在审计轨迹。OpenCode 接 75+ provider，广度优先但没有持久项目记忆，是 Zerostack 内存对比里那个 300MB 的参照物。Pi 是 primitives 取向的 harness，能作为子进程被 RPC 嵌入。

Zerostack 在这张图里不占"最强"任何一格——它没有 benchmark 分数，没有 Agent Teams，没有跨 session 记忆。它占的是"最小可用"那一格：单文件二进制、cargo 一行装好、12MB 跑起来、GPL 开源。这个生态位真实存在，但很窄——它服务的是那些同时跑很多代理、对资源敏感、愿意用 prompt 模式换 skills 生态的开发者。

![编程代理竞品矩阵](assets/png/04_竞品矩阵.png)

## 盲区：它没说和不能说的

Zerostack 的叙事很干净，但有几块刻意或被动留白。

没有任何公开 benchmark。README 通篇在讲内存和 CPU，找不到一个 SWE-bench、Terminal-Bench 或代码质量盲测的数字。省内存不等于把活干好——一个 12MB 但 SWE-bench 只有 40 分的代理，对真要交付代码的团队毫无意义。这个数字的缺席本身就是信号。

prompt 替代 skills 没有运行时发现机制。HN 上有人精准指出：Claude 的 skills 能被模型在运行时按需发现和加载，Zerostack 的 prompt 模式是用户得自己记得切换的模板系统。把扩展性的复杂度从系统转移到了用户头上，对一次性任务方便，对复杂多阶段任务是退化。

单人项目，6 天到 1.0.0。GitHub 上 529 星、37 fork、9 个 open issue，仓库 5 月 12 日才建。社区热度和可持续性是两件事——一个人能不能跟住模型每月一次的迭代、能不能修生产环境暴露的边界 case，1.0.0 这个版本号回答不了。

GPL-3.0-only。这对个人用户无所谓，对想把代理嵌进闭源产品或内部工具链的企业是真实的法律摩擦。Claude Code、Codex 这些要么是服务、要么许可更宽松，Zerostack 在这一点上把企业内嵌这条路自己堵了一半。

## 对从业者意味着什么

- **架构师**：本周做一次内存账。如果团队在跑"并行多代理 + 长 session"这套工作流，去测一下你现在那套代理的累积内存占用——不是单次调用，是并发峰值。这个数字如果真到几个 GB，Zerostack 代表的轻量路线值得进你的备选；如果你们还在单代理单任务，省内存对你就是伪需求，别被 12MB 这个数字带跑。
- **CTO / 技术决策者**：本周和团队复盘一个问题——你们选编程代理时，是在选模型能力，还是在选 harness 工程质量。Zerostack 证明这两件事正在分开。模型天花板由 OpenAI / Anthropic 决定，你们能差异化的是 harness 这层。这决定你该 buy 一个大厂全家桶，还是 build/fork 一个能完全掌控的轻量内核。GPL-3.0 这条要提前让法务看。
- **PM**：本周想清楚你的代理产品差异化点是不是落在一个会被模型升级吃掉的位置上。Zerostack 的启示是，能撑住的差异化是工程纪律和生态位选择，不是单点功能——功能会被下一个模型版本和下一个竞品抹平。
- **工程师 / Tech Lead**：本周花十分钟 `cargo install zerostack` 跑一次。重点不在它能不能替代你的主力工具，重点在体会"7000 行就能跑起一个可用代理"对你自己造内部工具意味着什么。它的源码（GitHub `gi-dellav/zerostack`，~7k 行）是一份难得的"最小可用编程代理"参考实现。

---

## 本期关键词

**Coding agent（编程代理）** -- 在终端里用自然语言驱动的开发助手，能读代码库、改文件、跑命令、提交 commit，按是否需要人盯着分成监督式（如 Cursor）、自主编排（如 Claude Code）、专注结对（如 Aider）几类。Zerostack 属于轻量自主一类，靠 12MB 内存和单文件二进制切入。

**Harness（调度器 / 控制循环）** -- 包在大模型外面的那层程序：接收用户消息、调用模型、解析模型输出、把工具调用路由到对应执行环境、再把结果塞回模型上下文。Claude Code、Zerostack 本质都是 harness。关键事实是同一个模型在不同 harness 里成绩能差 16 分，所以 harness 工程质量和模型本身一样决定成败。

**Rust 内存安全** -- Rust 是一门系统编程语言，靠编译期的所有权检查避免内存泄漏和越界，不依赖运行时垃圾回收，也没有虚拟机开销。这是 Zerostack 能把内存压到 12MB 的语言层基础，但同一门语言里写出几个 GB 内存的程序也完全可能——语言只是上限，工程纪律才是实际占用。

**Unix 哲学** -- 一套源自 Unix 系统的设计取向：一个程序只做一件事并做好，程序之间用简单接口组合，优先纯文本和可组合性。Zerostack 自我标榜"Unix-inspired"，体现在单一可执行文件、最小依赖、用 prompt 模式而非庞大插件生态来扩展。代价是放弃了运行时可发现的能力扩展。

**RAM footprint（内存占用）** -- 程序运行时占用的物理内存。Zerostack 实测空闲 ~8MB、工作 ~12MB，对照 opencode 等 JS 系代理的 ~300MB。在"并行多代理 + 长 session"的新工作流下，这个数字会从无关紧要变成真实瓶颈——有用户报 Claude Code 29 个进程合占 6.3 GiB。

**Ralph Wiggum loop** -- Zerostack 的长任务迭代循环：代理反复读任务、从计划里挑一项、执行、跑测试、更新计划文件、再循环，直到任务完成或触及迭代上限。它把"长跑自主开发"拆成可观察、可中断的小步，对应 Claude Code 一类工具的自主多小时执行能力。

**MCP（Model Context Protocol）** -- 一套让外部工具和数据源以标准化方式接入大模型代理的协议，是 Claude Code 等扩展生态的基础。Zerostack 把它做成可选编译特性，体现它"按需而非默认全装"的取舍。

**ACP（Agent Communication Protocol）** -- 一套基于 JSON-RPC、规范编辑器与编程代理之间通信的协议。开启 ACP 特性后，Zerostack 能作为后端被 Zed 这类编辑器当成代理调用，是它从命令行工具向编辑器集成延伸的接口。

**Prompt-as-skills（提示替代技能）** -- Zerostack 的扩展策略：不做插件和技能生态，而用十个内置系统提示模式 + 用户自定义 markdown 提示来改变代理行为。优点是零运行时开销和零依赖，缺点是没有运行时发现机制，复杂度从系统转移到了用户记忆。

**GPL-3.0-only** -- 一种强 copyleft 开源许可：任何分发的衍生作品也必须以 GPL 开源。对个人用户无影响，但企业想把 Zerostack 嵌进闭源产品会触发开源义务，是它在企业内嵌场景上的一道法律摩擦。

## 原文关键引用

> "zerostack is one of the smallest and most performant coding agents on the market. RAM footprint: ~8MB on an empty session, ~12MB when working (vs ~300MB for opencode or other JS-based coding agents)."（Zerostack 是市面上最小、最高效的编程代理之一。内存占用：空 session ~8MB，工作时 ~12MB，对比 opencode 等 JS 系代理的 ~300MB。）-- 项目 README

> "Before I tried coding agents my guess would have been: none. But seeing how slow claude code and copilot cli are and how much ram they use I'm flabbergasted."（试编程代理之前，我对'追性能有没有意义'的猜测会是：没有。但看到 Claude Code 和 copilot cli 有多慢、吃多少内存之后，我目瞪口呆。）-- 作者 gi-dellav 在 HN 的回应

> "If you cannot write a simple Java agent without consuming so much RAM that your system is swapping then that says more about the developer than anything."（如果你写不出一个不把系统跑到 swap 的简单 Java 代理，那说明的更多是开发者水平，而不是别的。）-- HN 评论者的反对

## 引用

1. [zerostack — crates.io](https://crates.io/crates/zerostack/1.0.0) -- 本期拆解对象，1.0.0，GPL-3.0-only
2. [gi-dellav/zerostack — GitHub](https://github.com/gi-dellav/zerostack) -- 源码与 README（~7k LoC，529 星）
3. [Zerostack – A Unix-inspired coding agent written in pure Rust — Hacker News](https://news.ycombinator.com/item?id=48164287) -- 536 点 / 295 评论，性能之争与作者回应
4. [AI Coding Harnesses 2026: Claude Code vs Codex vs Aider vs OpenCode vs Pi](https://thoughts.jock.pl/p/ai-coding-harness-agents-2026) -- 竞品定位与 harness 调校 16 分差数据
5. [Claude Code vs Codex CLI 2026 — NxCode](https://www.nxcode.io/resources/news/claude-code-vs-codex-cli-terminal-coding-comparison-2026) -- Claude Code 重质量 vs Codex 重速度的对照框架
