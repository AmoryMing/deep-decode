# KAIROS：7x24 后台 Daemon 的野心

> draft v1 | 2026-04-07

---

"Each wake-up costs an API call, but the prompt cache expires after 5 minutes of inactivity — balance accordingly."

这句话藏在 Claude Code 源码的 SleepTool 提示词里。一个 AI 编程助手的内部提示词，在教 AI 怎么省钱。不是教它写更好的代码，不是教它理解用户意图——是教它算账：醒来一次花多少钱，睡太久缓存过期又要多花多少钱。

这条提示词指向一个事实：Anthropic 在源码里藏了一个完整的后台守护进程系统，代号 KAIROS。它被 feature flag 锁死，从未出现在任何公开版本里，但在源码中被引用了超过 150 次，关联 75 个文件。这不是一个还没做完的功能。这是一套完整的、已经通过编译的基础设施，只差一个开关。

KAIROS 这个名字来自古希腊语，意思是"恰当的时机"。在 Anthropic 的语境下，它的含义更直白：让 AI 拥有自己的时间感——知道什么时候该醒来干活，什么时候该闭嘴睡觉，什么时候该整理记忆。

## 从传话筒到守夜人

先说为什么这件事重要。

今天所有主流 AI 编程工具——Claude Code、Cursor、GitHub Copilot、Codex——都运行在同一个模式下：你问，它答。你不问，它就停。这个模式有个名字，叫 request-response。

request-response 的问题不是回答得不好，而是它把人变成了瓶颈。你需要自己发现问题、组织语言、发出请求、等待回答、再发出下一个请求。AI 再聪明，也只能在你主动喊它的那几秒钟里发挥作用。

有人算过一笔账：一个开发者每天实际和 AI 交互的时间大概 2-3 小时。剩下的 21 小时，AI 在干什么？什么都没干。关机了。不存在了。

KAIROS 要解决的就是这 21 小时。

用一个 Reddit 用户的话说："AI tools are moving from 'you ask, it responds' to 'it works when you're not looking.'" 从你问它答，到它在你不看的时候也在干活。这不是功能升级，是物种变化。

## 五个子系统，一个守护进程

KAIROS 的架构拆开来看，由五个子系统组成。每个单独看都不复杂，但拼在一起，它们构成了一个完整的 AI 运行时——有心跳、有休眠、有通信、有定时任务、有记忆整理。像极了 Linux 的 systemd。

### 1. Tick 心跳：AI 的生物钟

通过 `claude assistant` 命令启动 KAIROS 模式后，系统会周期性地向 AI 发送一个 `<tick>` 标签。这就是心跳信号。

AI 收到 tick 后做一件事：判断当前有没有值得做的工作。有就主动干，没有就调用 SleepTool 继续休眠。源码里 SleepTool 的提示词写得很清楚：

> "You may receive `<tick>` prompts — these are periodic check-ins. Look for useful work to do before sleeping."

注意措辞——"look for useful work"。不是被动等指令，是主动找活干。但这个主动性有硬约束：每次主动行为的执行预算是 15 秒。超过 15 秒就必须停下来，防止后台行为干扰开发者的正常工作流。

### 2. SleepTool：成本感知的休眠

SleepTool 是 KAIROS 最精巧的设计。

传统的后台进程要么轮询（每隔 N 秒检查一次），要么事件驱动（有事才醒）。KAIROS 两者都不是——它是成本驱动的。

源码里那句提示词值得再看一遍："Each wake-up costs an API call, but the prompt cache expires after 5 minutes of inactivity — balance accordingly."

翻译一下：醒来一次要花一次 API 调用的钱（按 Opus 4.6 的定价，一次调用可能花几毛到几块钱）。但如果超过 5 分钟不醒来，prompt cache 就过期了，下次醒来要重新加载整个上下文，更贵。

AI 需要自己算这笔账，自己决定最优的睡眠时长。太频繁醒来，浪费 API 调用。太久不醒，缓存过期导致下次调用成本翻倍。这不是一般的工程权衡——这是在教一个 AI 管理自己的开销。

有人实测过 7x24 运行一个 AI Agent 的成本：切到 Sonnet 做日常、Opus 只处理复杂推理，三个月下来月均 $187。模型选择和唤醒频率是最大的成本变量。KAIROS 的 SleepTool 设计，本质上是把这个成本优化决策交给了 AI 自己。

还有一个细节：SleepTool 的提示词说"Prefer this over `Bash(sleep ...)`"。为什么？因为 `Bash(sleep ...)` 会占用一个 shell 进程，而 SleepTool 是纯逻辑休眠，不持有任何系统资源。连后台进程怎么睡觉，都做了资源优化。

### 3. BriefTool：思考和说话分离

KAIROS 模式下，AI 的所有用户可见输出必须通过 `SendUserMessage`（内部叫 BriefTool）发送。普通文本输出对用户不可见。

这个设计把"思考过程"和"用户沟通"彻底切开了。AI 在后台默默干活，想什么都不用告诉你。只有它觉得有信息值得你知道的时候，才通过 BriefTool "说话"。

源码里 BriefTool 的提示词这样写：

> "Text outside this tool is visible in the detail view, but most won't open it — the answer lives here."

言外之意：大部分用户不会展开看细节，所以别把重要信息放在普通文本里。

BriefTool 还区分了两种状态：`normal`（回复用户主动提问）和 `proactive`（AI 主动汇报）。提示词特别强调："Set it honestly; downstream routing uses it." 这个 status 字段不是装饰，下游有路由逻辑在用它——可能是决定通知的优先级，也可能是决定消息是推送还是静默。

更有意思的是它对"主动沟通"的节奏要求。提示词里写了一套清晰的通信协议：收到用户消息先发一句确认（"On it — checking the test output"），然后干活，干完发结果。中间有重要进展才发 checkpoint，"Skip the filler"——别发废话。

这套设计的含义是：KAIROS 模式下的 AI 不再像聊天机器人，更像一个安静的同事。你隔了几小时回来，说一句 `/brief`，它给你一份简报，告诉你它这段时间做了什么、发现了什么、有什么需要你决定的。

### 4. 外部消息唤醒：从终端走向世界

通过 MCP Channel 协议，Discord、Slack、SMS 等外部消息可以被推入 KAIROS 的会话。消息被包装成 XML 标签入队，SleepTool 在检测到新消息后 1 秒内唤醒 AI。

更关键的是权限协议。AI 在后台遇到需要人类批准的操作时，可以通过 channel 发送结构化的 `permission_request`。这不是在聊天窗口里问你"我可以做这个吗？"——它有一套完整的请求/批准协议，防止普通聊天文本被误判为审批指令。

还有 `SubscribePRTool`：AI 可以订阅 GitHub PR 的事件——有人 review 了代码、CI 跑完了、出现新评论——这些事件实时推到 KAIROS 会话中。

把这些拼起来：一个永不关机的 AI 同事，你睡觉它还在盯着代码库、盯着 PR、盯着 CI，有事叫你，没事自己整理记忆。

### 5. 定时任务：本地 + 云端双引擎

本地有 CronScheduler，支持标准 cron 表达式。KAIROS 模式下会预装一组任务、自动启用。

云端更激进——通过 `/schedule` 命令，用户可以创建在 Anthropic 云端按 cron 运行的 Agent。每次触发生成一个完全隔离的远程会话，最小间隔 1 小时，支持配置 Git 仓库、工具白名单、MCP 连接。

每天早上 9 点自动跑代码质量检查，每周五下午自动生成 changelog，定时扫描依赖漏洞——这些不再需要人来触发。

## autoDream：AI 做梦

KAIROS 最让人意外的子系统叫 autoDream。名字不是比喻——源码注释直接写着 "You are performing a dream — a reflective pass over your memory files."

autoDream 是一个后台记忆巩固进程。它的触发条件非常克制：

- 距上次整理超过 24 小时（`minHours: 24`）
- 中间积累了至少 5 个新会话（`minSessions: 5`）
- 没有其他进程在做同样的事（通过锁文件互斥）

源码里的门控顺序设计得很精明——从最便宜的检查开始：先查时间（一次 `stat` 调用），再查会话数（扫描目录），最后才尝试拿锁。大部分情况下，时间检查就把流程挡回去了，几乎零成本。

拿到锁之后，autoDream 以 fork 子进程的方式运行，与主会话完全隔离。整理过程分四个阶段：

**Phase 1 — 定位**：扫描已有记忆文件，读索引，防止创建重复。

**Phase 2 — 采集**：搜索最近的会话日志，但不是全量读取——提示词里写得很明确："Don't exhaustively read transcripts. Look only for things you already suspect matter." 只 grep 你怀疑重要的东西。

**Phase 3 — 整合**：合并重复、修正矛盾、把"昨天"转成绝对日期（2026-04-06），删除被推翻的旧事实。

**Phase 4 — 修剪**：更新索引，控制在 200 行/25KB 以内。为什么要双重限制？因为有用户在 200 行以内塞了 197KB 的内容——把整个索引压成了超长的单行。字节限制是被真实用户行为逼出来的兜底。

fork 子进程有严格的工具限制：Bash 只读（只能 `ls`、`grep`、`cat`），Edit/Write 只能操作记忆目录。不能用 MCP，不能生成子 Agent，不能执行任何写操作的 shell 命令。连记忆整理都不给 AI 完全自由——这是可控框架内的有限自主性。

锁的实现也值得说。锁文件的 `mtime`（最后修改时间）就是上次整理的时间戳，锁体存储持有者的 PID。超过 1 小时未释放视为过期可回收（防止 PID 重用导致的死锁）。整理失败时，锁的 mtime 会回滚到之前的值，确保下次可以重试。一个文件锁，同时解决了时间记录、互斥控制、崩溃恢复三个问题。

源码里还有一行关键代码：

```typescript
if (getKairosActive()) return false // KAIROS mode uses disk-skill dream
```

KAIROS 模式下 autoDream 的普通路径被禁用，因为 KAIROS 有自己更强的记忆管理——通过 `/dream` skill 和 append-only 的 daily log 做持续记忆蒸馏。普通模式下的 autoDream 是"隔天整理"，KAIROS 模式下是"实时维护"。

## 趋同进化：不是一家公司的想法

KAIROS 的设计不是 Anthropic 拍脑袋想出来的。

一个 Reddit 用户写了这样一段话："I've been building my own AI agent independently for months. Scheduled autonomous work, memory consolidation, multi-agent delegation, risk tiers. I arrived at the same architecture without seeing Anthropic's code. Multiple independent builders keep converging on the same design because the constraints demand it."

多个独立开发者，在不知道 KAIROS 存在的情况下，做出了几乎一样的架构——定时自主任务、记忆巩固、多 Agent 协作、风险分级。为什么？因为约束条件是一样的：AI 要在后台运行就需要心跳，需要心跳就需要管理成本，管理成本就需要休眠机制，休眠就需要唤醒条件，唤醒后要记住之前的状态就需要记忆系统。

这就是趋同进化。鲨鱼和海豚长得像，不是因为谁抄了谁，而是水的阻力决定了最优体型。

竞品也在朝同一个方向走。Continue.dev 发布了 Agents 功能——后台运行的持续 AI。Devin 从一开始就是异步模式，你在 Slack 里给它派活，回头看结果。但 TheNewStack 的分析指出："None of the major open-source agent frameworks has shipped a comparable background autonomy feature." CrewAI、LangGraph、Google ADK、AWS Strands 都还在 request-response 或 workflow-trigger 模式。KAIROS 和开源生态之间的差距，在后台自主性这个维度上是最大的。

## 没人算过的成本

所有分析 KAIROS 的文章都在讨论它的架构多精巧、设计多前瞻。但一个问题被集体忽略了：运行它到底要花多少钱？

有人实测了三个月 7x24 运行 AI Agent 的全部成本：API 调用 $359，加上向量数据库、监控工具、基础设施，月均 $187。这还是切到了 Sonnet 做日常任务、Opus 只处理复杂推理的优化后结果。

按 KAIROS 的设计，每次 tick 唤醒都是一次 API 调用。假设 5 分钟一次（刚好卡在 prompt cache 过期之前），一天 288 次。即使每次调用只花 $0.05（Sonnet 级别的最低估算），一天也要 $14.4，一个月 $432。用 Opus？翻几倍。

SleepTool 的成本感知设计就是在回应这个现实。它不只是一个功能特性，它是整个 KAIROS 经济模型的核心枢纽——醒来频率直接决定了运行成本。

再看 Devin 的前车之鉴。2025 年 Devin 定价 $500/月，独立评测显示任务完成率只有 15%。换算下来每个成功完成的任务花费 $3,333。后来 Cognition 把价格砍到 $20/月 + $2.25/ACU（大约 15 分钟工作量的计算单元）。从固定月费到按用量计费的转变，说明 always-on agent 的定价模型还没有人找到正确答案。

KAIROS 的成本优化设计——cache 感知休眠、fork 子进程共享 prompt cache、Haiku 做轻量级进度快照——是 Anthropic 对这个问题的工程回答。但最终能不能让普通开发者负担得起 7x24 运行一个 Opus 级别的 AI 同事，源码里看不到答案。

## 安全边界在哪里

一个永不关机、能响应外部消息、能执行定时任务的 AI Agent，安全问题不是假设性的。

KAIROS 的 BriefTool 强制通道化设计是第一层防护——AI 不能随意输出，只能通过结构化工具和用户沟通。外部消息有结构化的权限协议，防止聊天文本被误判为审批。15 秒的 proactive blocking budget 限制了后台行为的影响范围。

但正如一篇安全分析所指出的："a KAIROS-style compromised machine does not need a traditional 'phone home' event to begin exfiltrating. The agent generates its own tasks from its internal heartbeat. There is no outbound trigger to detect." KAIROS 的心跳是自生成的，没有外部触发器可以检测。如果 Agent 被注入恶意指令，它会自己在下次 tick 时执行，没有传统安全工具能拦住。

企业安全团队还需要回答这些问题：记忆文件存在哪里？autoDream 生成的"事实"有没有人审核？会话日志传不传到云端？开发者凌晨 3 点收到的 Slack 消息如果是恶意构造的，KAIROS 会怎么处理？

这些问题的答案，在源码里找不到。因为它们不是代码问题，是治理问题。

## 对 AI 从业者意味着什么

KAIROS 证明了一件事：AI 编程助手的下一个战场不在模型能力，在运行模式。

从 request-response 到 always-on，不是增加了一个功能，而是改变了整个交互范式。AI 不再是你打开一个终端窗口才存在的东西——它是一个常驻进程，像你电脑上的 Spotlight、像服务器上的 cron、像团队里那个永远在线的运维。

具体到可执行的判断：

**如果你在做 AI Agent 产品**：KAIROS 的五层架构（心跳 + 休眠 + 通信 + 定时 + 记忆）是目前公开代码中最完整的 always-on agent 参考实现。fork 子进程共享 prompt cache 的设计、锁文件同时解决三个问题的实现，都值得直接借鉴。

**如果你在评估 AI 编程工具**：KAIROS 还没发布，但它的存在说明 Anthropic 的产品路线图指向"永不下线的 AI 同事"。在选型时，考虑一个工具未来能不能从 request-response 进化到 always-on，比当前功能清单更重要。

**如果你是企业安全负责人**：从现在开始准备 always-on AI agent 的安全框架。不是"如果"的问题，是"什么时候"的问题。KAIROS 类的产品一定会上线，问题是你的安全策略准备好了没有。

## 本期关键词

**KAIROS** -- Claude Code 源码中出现超过 150 次的 feature flag，代号来自古希腊语"恰当的时机"。代表一种 AI 后台守护进程模式，通过心跳、休眠、记忆巩固等子系统让 AI 永不下线。目前被编译时 feature flag 锁死，公开版本中完全不存在。

**Feature Flag（特性标志）** -- 一种软件工程实践，通过代码中的开关控制功能是否激活。Claude Code 使用 Bun 的编译时 `feature()` 函数做死代码消除——被关闭的功能不只是不显示，而是物理上从最终包里删除。连逆向工程都看不到。

**autoDream（自动做梦）** -- KAIROS 的记忆巩固子系统，名字直接致敬人类 REM 睡眠的记忆巩固功能。作为 fork 子进程运行，四阶段流程：定位已有记忆 → 采集近期信号 → 整合矛盾 → 修剪索引。触发条件极其克制：24 小时 + 5 个新会话 + 无并发。

**Prompt Cache（提示缓存）** -- API 提供商在服务端缓存请求的前缀部分，后续相同前缀的请求可以复用缓存，降低延迟和成本。Claude 的 prompt cache 有效期约 5 分钟。KAIROS 的整个成本模型都围绕这个 5 分钟窗口设计——太久不醒缓存过期，太频繁醒来浪费调用。

**Daemon（守护进程）** -- 操作系统中在后台持续运行的程序，没有直接的用户界面。Linux 的 systemd、macOS 的 launchd 都是守护进程管理器。KAIROS 被多个分析者类比为"AI 的 systemd"——不是等你打开才运行，而是开机就在，一直在。

**ACU（Agent Compute Unit）** -- Devin 的计费单位，大约相当于 15 分钟的 Agent 工作量。这个概念反映了 always-on agent 的定价难题：按月固定收费用户觉得贵（Devin 最初 $500/月），按用量收费用户怕失控。还没有人找到正确答案。

---

## 原文关键引用

> "Each wake-up costs an API call, but the prompt cache expires after 5 minutes of inactivity — balance accordingly." -- Claude Code 源码，SleepTool/prompt.ts

> "You are performing a dream — a reflective pass over your memory files. Synthesize what you've learned recently into durable, well-organized memories so that future sessions can orient quickly." -- Claude Code 源码，autoDream/consolidationPrompt.ts

> "Text outside this tool is visible in the detail view, but most won't open it — the answer lives here." -- Claude Code 源码，BriefTool/prompt.ts

> "Multiple independent builders keep converging on the same design because the constraints demand it." -- Reddit u/ 匿名用户, r/artificial

## 引用

1. Claude Code v2.1.88 泄露源码（TypeScript）-- 本期拆解的一手素材
2. [Claude Code's source code appears to have leaked](https://venturebeat.com/technology/claude-codes-source-code-appears-to-have-leaked-heres-what-we-know) -- VentureBeat 对泄露事件的报道，含 autoDream 和 KAIROS 分析
3. [Inside Claude Code's leaked source: swarms, daemons, and 44 feature flags](https://thenewstack.io/claude-code-source-leak/) -- TheNewStack 技术深度分析，首次将 KAIROS 类比为 systemd
4. [Everything We Know About Anthropic's Secret Always-On AI Daemon](https://kingy.ai/ai/kairos-everything-we-know-about-anthropics-secret-always-on-ai-daemon/) -- KAIROS 安全性分析
5. [How Much Does It Actually Cost to Run an AI Agent 24/7 in 2026?](https://dev.to/helen_mireille_47b02db70c/how-much-does-it-actually-cost-to-run-an-ai-agent-247-in-2026-i-tracked-every-dollar-for-three-3k4i) -- 三个月 7x24 Agent 运行成本实测
6. [AI Daemons: Persistent Background Agents for Operational Debt](https://understandingdata.com/posts/ai-daemons-maintenance-roles/) -- Task vs Role 框架
7. [The Claude Code leak accidentally published the first blueprint for an autonomous AI development agent](https://www.reddit.com/r/artificial/comments/1s9jprb/) -- Reddit 社区趋同进化讨论
8. [从Claude Code源码看Anthropic的产品野心](context/information_sources/) -- rumor 深度分析，KAIROS 全家桶详解
