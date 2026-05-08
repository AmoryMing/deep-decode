Claude Code 源码泄露，全面剖析【长文】
Anthropic 的 npm 包里，留了份 60MB 的 source map。

图片
这件事最早发生在 2025 年 2 月，Claude Code v0.2.8 发布时，有人发现 npm 包的 cli.mjs 中内嵌了一段超长的 base64 编码字符串，解码后就是完整的 TypeScript 源码。Anthropic 很快推了 v0.2.9 修复，撤下了旧版本。

但，问题后来又出现了……

后续版本的 npm 包里仍然带着一个 cli.js.map 文件，大约 60MB，包含 1906 个源文件。

GitHub 上有人建了专门的仓库做「洁净室反混淆」，蚂蚁集团工程师做了逆向分析，还有团队对超过 5 万行混淆源码做了硬核解读。

虽然 Anthropic 在 GitHub 上有 claude-code 公开仓库 [1]（目前 81K+ star），但那主要是分发和文档，npm 包里的代码仍然是打包混淆后的产物。

真正的 TypeScript 源码，到现在也只能通过 source map 来还原。

今天我们不聊泄漏本身，也不提供源代码（github 上有许多），我们只聊技术——

我第一时间拿到了还原后的源码，然后……让 Claude 自己读自己的代码。整个过程，花了 1.5 小时。

图片
要知道，Claude Code 的源码，其实是一份含金量相当高的 AI Agent 架构教材。

请往下看。

01
整体骨架
Claude Code 用 TypeScript 写的，运行在 Node.js 上，终端 UI 用的是 React + Ink，一个让你在命令行里写 React 组件的框架。

工具系统架构
工具系统架构
整体结构大致长这样：

• entrypoints/ 负责启动初始化 

• query/ 是核心的 Agent 循环引擎 

• tools/ 装了 45+ 个工具实现 

• commands/ 有 100 多个命令 

• services/ 放业务逻辑（API 调用、MCP、分析等） 

• components/ 和 hooks/ 是 React/Ink 的 UI 层 

• state/ 管理应用状态 

• utils/swarm/ 是多 Agent 协作的核心 

• skills/ 技能系统 

• buddy/ 一个藏起来的电子宠物……（后面细说） 

代码量不小，光 main.tsx 就有 800KB，query.ts 68KB，Tool.ts 29KB。

但架构的核心其实可以用一句话概括：一个带权限系统的流式工具执行循环。

02
启动流程
Claude Code 的启动分了六个阶段，中间还有一条「信任边界」，并非一口气把所有东西加载完的。

启动流程
启动流程
Stage 1：并行预取。MDM 配置和 Keychain 读取同时启动，不等对方。Keychain 读取在 macOS 上大约要 65ms，提前开始能省下不少时间。

Stage 2：配置验证。解析所有 settings.json、CLAUDE.md 等配置文件。出错的话直接弹 InvalidConfigDialog，连 React 都不用加载。

Stage 3：安全环境变量。只应用 CA 证书和网络配置，别的先不碰。因为 Bun 在启动时就缓存了证书库，这步必须在第一次 TLS 握手之前完成。

然后是一条红色虚线：信任边界。

Stage 4：信任对话框。用户确认接受风险，这是安全分界点。

Stage 5：完整初始化。OAuth、Git 仓库检测、LSP、遥测，全部在信任确认之后才跑。远程配置是非阻塞加载的，不等它返回就继续。

Stage 6：延迟预取。等 REPL 渲染完第一帧之后，才去加载用户上下文、文件计数、提示信息这些不急的东西。

这个设计的思路是：能延迟的就延迟，能并行的就并行，信任边界之前只做最安全的事。GrowthBook、OpenTelemetry、上游代理这些重模块都是动态 require() 的，大约能省掉 400-700KB 的初始加载量。

03
Agent 循环
这是整个系统最核心的部分。

Claude Code 的 Agent 循环在 query.ts 和 QueryEngine.ts 里实现，流程大致是这样的：

Agent 循环核心流程
Agent 循环核心流程
准备阶段：把用户消息、系统上下文（git status、CLAUDE.md、memory 文件等）、历史消息打包，构建完整的 system prompt。

请求阶段：调 Claude API，开启流式返回。

执行阶段：模型返回的内容里如果包含工具调用，立刻执行，不等整条消息返回完。这是个很关键的设计，工具是「流进来一个执行一个」的。

循环判断：看 stop reason。如果模型说「我还要继续调工具」，就把工具执行结果拼回消息列表，再来一轮。如果模型说「完事了」，循环结束。

QueryEngine 的配置里有两个实用的安全阀：

●●●

{
maxTurns?:number// 最大循环轮次
maxBudgetUsd?:number// 预算上限（美元）
}
└

跑着跑着 Agent 失控了怎么办呢？设个上限就好。

04
流式工具执行
工具执行这块的设计，很是讲究。

Claude Code 里有个 StreamingToolExecutor，核心逻辑是把工具分成两类：

并发安全的：比如读文件、搜索、glob 这些只读操作，可以同时跑。

需要串行的：比如写文件、执行 bash 命令这些会改状态的操作，必须排队。

每个工具都要自己声明并发安全性：

●●●

typeTool= {
name:string
inputSchema:ZodSchema
isConcurrencySafe(input:unknown):boolean// 关键字段
validateInput(input, context):ValidationResult
call(input, context): Promise<{ data:Output }>
isEnabled():boolean
}
└

这个设计解决了一个很现实的问题：Agent 经常会一口气调好几个工具，你得让能并行的并行，该串行的串行。

不然要么太慢，要么文件冲突。

还有个细节，每个工具执行时都有独立的 abort controller，如果用户中途按 Esc 取消，能精确地停掉正在跑的子进程。

05
四层权限管道
这应该是 Claude Code 架构里最值得学的部分之一了。

权限系统有五个模式：default（每次都问）、bypassPermissions（全部放行，CI 场景）、dontAsk（全部拒绝）、acceptEdits（自动接受编辑）、auto（分类器自动判断）。

重点说 auto 模式，因为它的实现很有参考价值。每个工具调用要过四层决策：

四层权限决策管道
四层权限决策管道
第一层：规则匹配。检查用户配置的 allow/deny 规则，命中就直接返回。最快，纯字符串匹配，亚毫秒级。

第二层：Bash 分类器。对 bash 命令做模式匹配，识别危险操作（force push、rm -rf、生产部署等），覆盖 22 种以上的危险操作类型。

第三层：Transcript 分类器（代码里叫 YOLO 分类器）。基于整段对话上下文判断操作是否安全，能捕捉到前两层遗漏的场景。

第四层：独立的 Claude Sonnet API 调用。用一个单独的模型来做安全分类，温度设为 0 保证确定性输出。这是最后一道防线，也是最慢的一层。

四层是「由快到慢，由简单到复杂」递进的。能在前面拦住的就不走后面，既保证了安全，又控制了延迟。

权限本质上是一个多层级的决策管道，远比一个 yes/no 的开关要复杂。这个思路对做任何 Agent 产品都有借鉴意义。

06
上下文管理
Agent 的 context window 就像一个固定大小的背包，你得决定装什么、不装什么、什么时候清理。

上下文管理
上下文管理
Claude Code 的 System Prompt 由多个来源拼装而成：

CLAUDE.md 文件：从项目根目录一直往上走到 home 目录，沿路收集所有 CLAUDE.md、.claude.md、CLAUDE.markdown 文件。可以用 --bare 参数或环境变量禁用。

Memory 文件：MEMORY.md 是索引（限制 200 行、25KB），每条记录指向一个独立的 topic 文件。索引始终加载，topic 文件按需加载。Memory 分四种类型：user（用户画像）、feedback（行为反馈）、project（项目上下文）、reference（外部资源指针）。

Git 状态：memoized 的 git status，避免重复调用。

MCP 服务器指令：连接的 MCP 服务器提供的 instructions，通过增量 system-reminder 注入，不是一次性全塞进去。

延迟工具列表：只发名字，不发完整 schema。模型需要时通过 ToolSearch 按需加载。

当 token 用量接近上下文窗口的 95% 时，自动触发消息压缩（Message Compaction）。把早期的工具调用和结果压缩成摘要消息，保留关键信息但大幅缩减 token 数。它还支持嵌套压缩，之前压缩过的内容可以再次被压缩。

context window 大小默认 200K，Opus 4.6 和 Sonnet 4.6 可以通过 [1m] 后缀开启 1M 上下文。还有个性能优化：默认 max output tokens 只设 8K（因为 p99 的输出也就 4.9K tokens），真不够用的话会自动 retry 一次并提升到 64K。用 8K 的小默认值，省下了 8-16 倍的计算资源预留。

07
渐进式工具披露
Claude Code 的工具加载也不是一股脑全塞进 prompt 的。这里用了一套「渐进式披露」机制。

渐进式工具披露流程
渐进式工具披露流程
工具分三类来源：

内置工具（BashTool、FileReadTool、AgentTool 等）：核心工具始终加载，但部分工具标记了 shouldDefer，只在 prompt 里出现名字。

MCP 工具：始终延迟加载。MCP 工具和具体工作流绑定，schema 往往很大，没必要一开始就全塞进去。

Skill 工具：只加载 frontmatter（名字、描述、触发条件），完整内容在调用时才加载。

模型怎么知道有哪些延迟工具呢？它们的名字会出现在 <system-reminder> 里。模型要用某个工具时，先调 ToolSearch：

●●●

select:Read,Edit,Grep        // 按名字精确选择
notebook jupyter              // 关键词搜索，评分排序
+slack send                   // 必须包含 "slack"，按 "send" 排序
└

ToolSearch 返回完整的 JSON Schema 定义，模型拿到 schema 后就能正常调用了。

这套机制在 MCP 工具特别多的时候效果明显。如果你接了十几个 MCP 服务器、上百个工具，全塞进 prompt 大概要吃掉 10% 以上的 context window。延迟加载把这个开销降到了几乎为零。

08
Skill 系统
Skill 是 Claude Code 的扩展机制，本质上是带 frontmatter 的 markdown 文件。

Skill 加载架构
Skill 加载架构
Skill 从五个地方加载，优先级从低到高：

1. 内置 skill（编译进二进制）

2. 企业策略 skill（MDM 推送）

3. 项目级 skill（.claude/skills/）

4. 插件 skill

5. 用户级 skill（~/.claude/skills/）

frontmatter 支持的字段相当丰富：

●●●

---
name: 自定义名称
description: 这个 skill 干什么
when_to_use: 什么时候触发
arguments: [arg1, arg2]
allowed-tools: [Bash, Read, Edit]
model: haiku | sonnet | opus
user-invocable: true
context: inline | fork
effort: low | medium | high
paths: "src/*.ts"# 条件激活：编辑匹配文件时才出现
hooks:
PreToolUse: [...]
---
└

paths 字段是个巧妙的设计。比如你有个处理数据库迁移的 skill，设了 paths: "migrations/**"，那它只有在你编辑迁移文件时才会出现在可用列表里。

参数替换支持多种语法：$ARGUMENTS（全部参数）、$0（第一个）、$filename（命名参数）。用 shell-quote 库解析，能正确处理引号嵌套。

token 预算管理也很精细：frontmatter 的 token 量是预估的（名字 + 描述 + 触发条件，大约 100-300 tokens），完整内容只在调用时才计入。这让你可以注册上千个 skill 而不炸掉 prompt。

09
MCP 集成
Model Context Protocol 在 Claude Code 里是一等公民。

MCP 集成生命周期
MCP 集成生命周期
配置来源：settings.json、.claude/mcp.json、企业策略、桌面端插件市场。企业配置覆盖项目配置，项目配置覆盖全局配置。

传输协议：支持 Stdio（子进程）、SSE（Server-Sent Events）、WebSocket、HTTP（Streamable HTTP）四种。

认证：三层机制。PKCE OAuth 做首次授权，Session Token 维持会话，Token Refresh 处理过期。有个 15 分钟的认证缓存，防止批量连接时反复触发 OAuth 弹窗。

工具获取：延迟加载。连接建立后先拿到工具列表，但 schema 不发到 prompt 里。模型通过 ToolSearch 按需获取。

增量通知：MCP 服务器连上或断开时，通过 system-reminder 增量通知模型，只告诉它变化了什么，不重发全量。

还有个防竞态的细节：多个 MCP 服务器同时返回 401 时，认证缓存用序列化写入链防止并发读写冲突。

10
多 Agent 协作
Claude Code 的多 Agent 系统叫「Swarm」，实现在 utils/swarm/ 目录下。

它支持三种后端：InProcess（同进程，AsyncLocalStorage 隔离，默认）、Tmux（tmux pane）、iTerm2（iTerm2 tab）。

多 Agent 协作架构
多 Agent 协作架构
InProcess 模式最值得细看。它不启新进程，而是用 Node.js 的 AsyncLocalStorage 做上下文隔离：

●●●

runWithTeammateContext({ agentId, teamName, ... }, () => {
// 这里面的代码看到的是 teammate 自己的上下文
getSessionId() // 返回 teammate 的 session ID
})
└

多个 Agent 跑在同一个进程里，共享内存但上下文隔离。省资源，还避免了进程间通信的开销。

权限同步用的是 mailbox 机制：teammate 需要权限时往 leader 的 mailbox 发请求，leader 审批后把结果写回 teammate 的 mailbox。UI 上会显示一个 "worker" 标记，让用户知道这是哪个 teammate 在请求权限。

每个 Team 有一个 lead agent 和若干 member agent，配置存在 ~/.claude/teams/{team-name}/config.json，lead 负责分配任务和审批权限。

关键是上下文隔离，不是物理隔离。这是 Claude Code 多 Agent 设计最核心的洞察。

11
Loop 与定时任务
/loop 是个内置 skill，底层调的是 CronCreateTool。

定时任务体系
定时任务体系
用法非常灵活：

●●●

/loop 5m /babysit-prs           # 每 5 分钟跑一次
/loop 30m check the deploy      # 每 30 分钟检查部署
/loop check status every 20m    # 尾部 "every" 写法也行
/loop                           # 默认 10 分钟
└

时间间隔会被转成 cron 表达式：5m → */5 * * * *，2h → 0 */2 * * *，1d → 0 0 * * *。秒级的间隔会向上取整到 1 分钟（cron 的最小粒度）。不整除的间隔会提示用户：「7 分钟的间隔不均匀，帮你取整到 10 分钟了」。

设好之后会立即执行一次，不等第一个 cron 触发。任务默认 14 天后过期。

定时任务存储分两种：

会话级（durable=false）：只在内存里，退出就没了。

持久级（durable=true）：写到 .claude/scheduled_tasks.json，重启后还在。

还有更重量级的远程触发器（Remote Triggers），可以在 Anthropic 云端调度 Claude Code 远程 Agent：

●●●

{
"cron_expression": "0 9 * * 1-5",
"job_config": {
"ccr": {
"sources": [{"git_repository": {"url": "https://github.com/org/repo"}}],
"allowed_tools": ["Bash", "Read", "Write", "Edit"]
    }
  }
}
└

远程触发的最小间隔是 1 小时（本地 cron 是 1 分钟），用 UTC 时间，可以挂 MCP 连接器（Slack、Datadog 等）。管理界面在 claude.ai/code/scheduled。

12
快捷键系统
Claude Code 的快捷键支持自定义，配置文件在 ~/.claude/keybindings.json：

●●●

{
"bindings": [{
"context": "main",
"bindings": {
"ctrl+shift+k": "/help",
"cmd+enter": "submit",
"ctrl+k ctrl+s": "toggleSearch"
    }
  }]
}
└

支持组合键（chord binding），比如 ctrl+k ctrl+s 是先按 ctrl+k 再按 ctrl+s。解析器支持大量别名：ctrl = control，alt = opt = option，cmd = command = super = win。

快捷键是上下文感知的，main、search、textarea、input 等不同上下文可以绑不同的键。部分快捷键（如 Esc 关闭）是保留的，不能重新绑定。

配置文件支持热重载，改了立刻生效，不用重启。

13
Hook 系统
Claude Code 的可扩展性主要通过 Hook 系统实现。支持的事件类型包括：

• PreToolUse / PostToolUse：工具执行前后 

• UserPromptSubmit：用户提交消息时 

• SessionStart：会话开始 

• FileChanged：文件变更 

• PermissionRequest / PermissionDenied：权限相关 

• SubagentStart：Teammate 启动时 

• Elicitation：URL 唤起协议 

Hook 可以从两个来源注册：SDK 回调函数，或者 settings 里配置的 shell 命令。

这个设计让 Claude Code 变成了一个可编程的平台。你可以在工具执行前做校验，在文件变更后触发构建，在用户提交消息时做预处理。

Hook 机制比硬编码的功能更灵活，也更容易让社区贡献扩展。

14
状态管理
Claude Code 的状态分两层：

全局可变状态（bootstrap/state.ts）：session ID、项目根目录、模型配置、token 用量统计、team 上下文、已注册的 hook、已调用的 skill 列表等。这些是基础设施级别的状态，生命周期等于整个进程。

React 管理状态（state/AppState.tsx）：对话消息、任务列表、UI 状态、工具权限上下文等。这些跟 UI 渲染绑定，用 React 的 setState 机制更新。

两层之间的边界挺清晰的：需要跨 Agent 共享的基础设施状态放全局，跟渲染相关的放 React 状态。

15
费用追踪
Claude Code 实时追踪 API 用量和代码变更量。

按模型分别计费：Opus、Sonnet、Haiku 各自统计 input/output/cache tokens。缓存命中的 token 按 10% 计费。Web 搜索每次 $1 固定费用。

会话费用存在项目配置里（~/.claude/config.json），通过 session ID 关联。恢复会话时费用会接着算，新建会话则从零开始。这防止了「忘了关会话，费用一直累积」的问题。

还有个 hasUnknownModelCost 标记，遇到未知模型时会提示费用可能不准确。

16
彩蛋：电子宠物
电子宠物系统
电子宠物系统
源码里有个完整的 /buddy/ 目录，实现了一个电子宠物系统。这个功能目前还没上线，但代码已经写好了，计划在 2026 年 4 月 1 日到 7 日之间作为愚人节彩蛋上线。

18 个物种：鸭子、鹅、水滴怪、猫、龙、章鱼、猫头鹰、企鹅、乌龟、蜗牛、幽灵、六角恐龙、水豚、仙人掌、机器人、兔子、蘑菇、胖墩。

每个物种都有 5 行 × 12 字符的 ASCII 艺术，3 帧动画，500ms 一帧的 idle 动画。

物种名在源码里全部用 String.fromCharCode() 编码存储。为什么呢……因为有一个物种名和 Anthropic 内部的模型代号「canary」撞了，而构建系统会扫描产物中是否包含内部代号。为了不被误报，干脆把所有物种名都编码了。

稀有度系统：60% 普通、25% 稀有、10% 史诗、4% 传说、1% 神话。普通宠物不戴帽子，其他的随机获得：皇冠、礼帽、螺旋桨帽、光环、巫师帽、毛线帽、小鸭子帽。

属性系统：每只宠物有 5 项属性，DEBUGGING（调试力）、PATIENCE（耐心）、CHAOS（混乱值）、WISDOM（智慧）、SNARK（毒舌度）。属性根据稀有度有不同的下限，每只宠物有一项峰值属性和一项弱项。

宠物的「骨骼」（species、稀有度、外观）是从 hash(userId) + salt 确定性生成的，所以你改配置文件也刷不出更高稀有度。但宠物的「灵魂」（名字、性格）是让模型生成的，首次「孵化」后存入配置持久化。

UI 上它会在终端右下角显示 ASCII 动画，偶尔眨眼，偶尔冒个气泡说话。用 /buddy pet 可以摸它，触发一个 2.5 秒的爱心动画。

怎么讲……Anthropic 的工程师，还是挺有童心的。

17
早期版 vs 当前版
泄漏最早发生在 v0.2.8，而现在 Claude Code 已经迭代到了 v2.1.88。通过对比不同时期 source map 还原出的源码，能看到一些演进脉络：

架构内核基本没变。Agent 循环、工具系统、权限管道，这些核心设计从早期一直延续到现在。说明这套架构确实经受住了生产环境的考验。

Feature Flag 越来越多。后续版本里能看到大量的 feature gate，比如 COORDINATOR_MODE、KAIROS、REACTIVE_COMPACT 等。Anthropic 显然在快速迭代，同时用 flag 来控制功能发布节奏。

多 Agent 能力明显更成熟了。早期的 Swarm 系统相对简单，后续加入了 Team 管理、coordinator 模式、更完善的权限同步机制。

MCP 从配角变主角。Model Context Protocol 在后续版本中成了一等公民，Agent 可以自带 MCP 服务器定义，还接入了官方 MCP 注册中心。

安全机制持续加固。Auto 模式的分类器经过了多轮迭代，危险操作的覆盖范围从最初的十几种扩展到 22 种以上。

18
Agent 开发启发
从 Claude Code 的架构里，能提炼出几条对 AI Agent 开发通用的设计原则：

流式优先。不要等模型完整返回再执行工具，边流边执行。用户体感延迟会大幅下降，而且能更早发现问题。

权限是管道，不是开关。单一的 allow/deny 太粗糙了。实际产品需要多层级、可配置、支持自动分类的权限决策链。快路径处理常见 case，慢路径处理边界 case。

工具要声明并发安全性。Agent 框架需要知道哪些工具能并行跑，哪些必须串行。这个信息应该由工具自己声明，而不是框架去猜。

上下文管理才是核心挑战。长会话的 token 管理、消息压缩、关键信息保留，这些才是 Agent 能不能真正干活的基础能力。

渐进式披露省 token。工具 schema、skill 内容、MCP 指令，都不该一开始就全塞进 prompt。按需加载，用多少拿多少。

多 Agent 协作不一定要多进程。AsyncLocalStorage 式的进程内隔离，在很多场景下比进程间通信更高效。关键是上下文隔离，不是物理隔离。

可扩展性靠 Hook，不靠硬编码。预定义一组生命周期事件，让用户和插件在这些点上注入逻辑。比每次加功能都改核心代码，要优雅得多。

19
写在最后
Claude Code 的源码泄漏，客观上给整个 AI Agent 开发社区上了一课。

倒不在于泄漏本身，它展示了一个成熟的、经过生产验证的 Agent 架构应该长什么样。流式执行、分层权限、上下文管理、多 Agent 协作，这些概念在论文和博客里讨论了无数次，但在一个真正日活百万级的产品里是怎么落地的，之前没人看过。

对了，加载动画里有 56 条随机消息，包括 "Clauding"、"Finagling"、"Noodling"、"Vibing"。

这份代码真正的价值，

在于理解它背后每一个取舍。

◇ ◆ ◇

[1] claude-code 公开仓库: https://github.com/anthropics/claude-code

[2] claude-code GitHub 仓库: https://github.com/anthropics/claude-code

[3] ghuntley/claude-code-source-code-deobfuscation: https://github.com/ghuntley/claude-code-source-code-deobfuscation

[4] leeyeel/claude-code-sourcemap: https://github.com/leeyeel/claude-code-sourcemap

[5] shareAI-lab/learn-claude-code: https://github.com/shareAI-lab/analysis_claude_code