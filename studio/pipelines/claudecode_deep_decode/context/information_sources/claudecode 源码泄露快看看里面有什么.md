Claude Code 源码泄露，快看看里面有什么
2025 年 2 月，Anthropic 发布 Claude Code 的 npm 包时带上了 sourcemap 文件。开发者 Dave Schumaker 在 cli.mjs 底部发现了 sourceMappingURL，顺着这条线索还原出完整的 TypeScript 源码。Anthropic 在 v0.2.9 中移除了 sourcemap 并下架旧版本，但源码已被社区保存在 GitHub（leeyeel/claude-code-sourcemap）。

2026 年 3 月，同样的事情再次发生。基于 @anthropic-ai/claude-code@2.1.88 的 sourcemap，最新版完整源码被还原。这次规模大得多：1,902 个文件，约 51 万行 TypeScript/TSX 代码，编译产物是一个 13MB 的单文件 cli.js。

这篇文章基于还原后的源码，分析 Claude Code 的技术架构。

图片
代码库概览
51 万行代码中，几个关键模块的体量值得关注。 query.ts 有 1,729 行，承载对话主循环。 services/api/claude.ts 有 3,419 行，负责 API 调用和 SSE 解析。安全相关的 bashSecurity.ts 有 2,592 行， utils/hooks.ts 达到 5,022 行。REPL 主屏幕 screens/REPL.tsx 也有 5,005 行。

整个系统编译为单文件分发，意味着所有依赖都被 bundle 进去了。sourcemap 把这个过程逆转，暴露了完整的模块结构和文件组织。

对话引擎 Query Loop
Claude Code 的对话引擎建立在一个 while(true) 循环上（ query.ts:307）。每次迭代完成一轮模型交互：预处理阶段执行微压缩和 context collapse；调 API 流式接收回复，收集 tool_use blocks；如果有工具调用就执行工具、把结果拼回消息数组，进入下一次迭代；没有工具调用则走 stop hooks 判断是否终止。

图片
消息在迭代间的传递方式（ query.ts:1715-1716）：

// 纯追加：原始消息 + 本轮助手回复 + 工具结果，组成新数组传给下一轮
const
next
:
State
=
{
  messages
:
[...
messagesForQuery
,
...
assistantMessages
,
...
toolResults
],
  transition
:
{
 reason
:
'next_turn'
},
}
state 
=
next
query() 函数的签名是 asyncfunction*（ query.ts:219），选 async generator 有几个具体的技术考量。 yield 每次把一个流事件推给消费者（REPL UI 或 SDK），实现逐 token 渲染。消费者不调 .next()，生产者就不推进，天然实现背压控制。 .return() 可以干净地关闭整条 generator 链，不需要额外的 abort signal 管理。 yield 和 return 分别承载不同类型：前者推 StreamEvent|Message，后者返回 Terminal（终止原因枚举）。

循环内有 7 个 continue 站点，对应不同的错误恢复和状态转换场景。

max_output_tokens_escalate（ query.ts:1217）处理模型输出被截断的情况。如果当前使用默认的 8K token 上限，系统会把 maxOutputTokensOverride 设为 64K（ ESCALATED_MAX_TOKENS），用相同消息重试。

64K 仍然不够时，进入 max_output_tokens_recovery（ query.ts:1246），注入恢复消息让模型继续输出，最多重试 3 次：

// 恢复消息要求模型直接续写，不道歉、不总结，避免浪费 token
const
 recoveryMessage 
=
 createUserMessage
({
  content
:
`Output token limit hit. Resume directly — no apology, no recap `
+
`of what you were doing. Pick up mid-thought if that is where `
+
`the cut happened. Break remaining work into smaller pieces.`
,
  isMeta
:
true
,
})
API 返回 prompt-too-long（413）时触发 reactive_compact_retry，执行一次压缩后重试。stop hook 检出问题（比如测试未通过）时，错误信息被注入对话让模型自行处理。

一个有意思的设计是 Token 预算的边际递减检测（ query/tokenBudget.ts）。系统设了两个阈值：使用不到 90% 预算则继续执行；连续 3 轮增量不足 500 token 则判定边际递减，提前停止。这避免了模型反复输出无意义的小增量。

流式处理方面， StreamingToolExecutor 在模型流式输出过程中就开始执行已完成的 tool_use block。模型输出一个 Read 调用后紧接着输出 Edit 调用时，Read 已经在执行了。工具摘要的生成也是并行的：工具执行完后立即启动 Haiku 生成摘要，不阻塞主循环。

还有一个流式空闲看门狗（ claude.ts）：90 秒无数据主动 abort 并回退到 non-streaming 模式。SDK 的 request timeout 只覆盖初始 fetch，不覆盖 streaming body 阶段，这个看门狗补上了这个盲区。

上下文管理与压缩系统
图片
上下文管理是 Agent 类产品的关键难题。Claude Code 实现了三层压缩架构，按开销从低到高依次是：

Micro Compact（微压缩），每次 API 请求前执行，零 API 调用。它把旧的工具输出替换为 '[Old tool result content cleared]'。可清理的工具包括 Read、Shell、Grep、Glob、WebSearch、WebFetch、Edit、Write。时间驱动的阈值是 60 分钟，和服务端 prompt cache 的 1 小时 TTL 对齐。缓存过期后整个前缀要重写，此时清理旧工具结果能减少重写量，不会造成额外的 cache miss。

Session Memory Compact（会话记忆压缩），同样零 API 调用。Claude Code 在后台持续提取会话记忆，压缩时直接用已有的记忆替代 LLM 摘要。 sessionMemoryCompact.ts 文件头标注了 EXPERIMENT，说明目前还是实验功能。

Full Compact（完整压缩），需要一次 LLM 调用生成摘要，是最后手段。调用顺序在 autoCompactIfNeeded() 里：先试 Session Memory Compact，失败才调 Full Compact。

阈值计算在 autoCompact.ts:33-48。有效上下文窗口 = 模型上下文窗口 - 预留摘要输出空间（20,000 token）。这个 20,000 来自 p99.99 的压缩摘要输出统计（17,387 token）。

以 200K 上下文模型为例：有效窗口 180,000 token，自动压缩在 167,000 token 时触发（减去 13,000 缓冲），177,000 token 时阻断（减去 3,000，此时必须手动 /compact）。

源码中有一条带日期的注释特别引人注目（ autoCompact.ts:67-70）：

// BQ 2026-03-10: 1,279 sessions had 50+ consecutive failures
// (up to 3,272) in a single session, wasting ~250K API calls/day globally.
const
 MAX_CONSECUTIVE_AUTOCOMPACT_FAILURES 
=
3
1,279 个会话出现了 50 次以上的连续压缩失败，最高达 3,272 次，全局每天浪费约 25 万次 API 调用。修复方案很直接：3 次连续失败后停止重试。这是一个从生产事故中长出来的断路器。

压缩后的文件恢复机制也有讲究：最多恢复 5 个最近读取的文件，总预算 50K token，每文件 5K token。CLAUDE.md 和 plan 文件有独立的恢复机制，不占这个预算。

工具系统架构
图片
Tool.ts（792 行）定义的工具接口按关注点分为四层。

执行层： call(args,context,canUseTool,parentMessage,onProgress?) 是所有工具的统一入口。

模型感知层： description() 返回短描述，进入 API 的 tool schema，每次计入 token 费用； prompt() 返回详细指令，注入系统提示词，走 prompt cache。两者分离是一个 token 优化：description 每次都付费所以尽量短，prompt 可以被缓存所以可以写详细。

安全层： validateInput() 校验输入， checkPermissions() 检查权限， isReadOnly() / isDestructive() 标记行为属性。

并发层： isConcurrencySafe() 标记是否可以并行执行。

默认值策略采用安全优先（ buildTool()）：

// 默认假设工具不可并发、会写入，安全的工具需要主动声明
const
 TOOL_DEFAULTS 
=
{
  isConcurrencySafe
:
(
_input
?)
=>
false
,
  isReadOnly
:
(
_input
?)
=>
false
,
  isDestructive
:
(
_input
?)
=>
false
,
}
工具编排（ toolOrchestration.ts）将工具调用序列分区为交替的并行/串行批次：连续的 isConcurrencySafe=true 工具合并为并行批次（最大并发 10），其余单独成串行批次。并行批次内的 contextModifier 被收集后延迟应用，批次跑完再按原始顺序逐一 apply，避免并发修改状态。

MCP 工具的桥接也在这里完成。 services/mcp/client.ts 将 MCP 服务器的工具映射为统一的 Tool 接口，MCP 的 annotations.readOnlyHint 映射为 isReadOnly() / isConcurrencySafe()， destructiveHint 映射为 isDestructive()，权限走通用权限系统。

权限与安全系统
图片
bashSecurity.ts 的 2,592 行代码实现了一个验证器管道，20 多个验证器串行执行。几个有代表性的： validateUnicodeWhitespace 检测 Unicode 零宽字符伪装的命令分隔符； validateCarriageReturn 防 \r 在不同 shell 下的解析差异； validateZshDangerousCommands 拦截 Zsh 特有的危险内建（ zmodload、 ztcp、 sysopen 等）； validateCommentQuoteDesync 防注释与引号的解析状态不同步注入。

子命令超过 50 个时直接回退到 ask 模式（ bashPermissions.ts:103），防止正则/AST 解析被 ReDoS 攻击打爆。

权限系统（ types/permissions.ts）定义了 6 种模式： default 每次都提示用户确认； acceptEdits 文件编辑自动放行； auto 由 AI 分类器（yoloClassifier）自动判定； bypassPermissions 跳过大部分检查； plan 只读； dontAsk 所有需确认操作直接拒绝。

即使在 bypassPermissions 模式下（ permissions.ts:1252-1260），deny 规则和 safetyCheck 仍然强制执行。safetyCheck 保护 .git/、 .claude/、shell 配置文件等路径。

Auto 模式做了三级优化（ permissions.ts:596-686）。先模拟 acceptEdits 模式检查，通过就直接放行，零 API 调用。再查安全工具白名单，同样零调用。以上都未命中，才调 yoloClassifier 做 side query。绝大部分日常操作（文件读写、grep、glob）在前两级就完成了判定。

yoloClassifier 构建上下文时有一个安全考量：只提取用户消息和助手的 tool_use block，排除助手生成的文本内容。因为模型生成的文本可能影响分类器的决策，这相当于防御一种间接提示注入。

Hook 系统（ utils/hooks.ts）支持 20 多种生命周期事件，包括 PreToolUse、PostToolUse、SessionStart、PermissionRequest 等。PreToolUse hook 通过 stdout 返回 JSON 决策： allow（放行）、 deny（阻断）、 ask（回退到用户确认），还支持 updatedInput 修改工具输入。所有 hook 都要求工作区信任验证（ shouldSkipHookDueToTrust()），防止恶意项目通过 .claude/settings.json 中的 hook 在未确认信任前执行命令。

多 Agent 协作
图片
Claude Code 支持三种 Agent 类型。

SubAgent 通过 AgentTool 派生，有独立的对话上下文。支持同步和异步执行。子 Agent 的中间过程不混入主对话，结束时结果被序列化为一条 tool_result 返回。子 Agent 默认关闭思考功能（ thinkingConfig:{type:'disabled'}）。

Fork 继承父 Agent 的完整上下文（系统提示词 + 对话历史）。 forkSubagent.ts 有一个关键的缓存优化：Fork 子 Agent 不重新调用 getSystemPrompt() 生成提示词，直接传递父 Agent 已渲染好的字节。源码注释（ forkSubagent.ts:55-58）解释了原因：

"Reconstructing by re-calling getSystemPrompt() can diverge (GrowthBook cold→warm) and bust the prompt cache"

重新构造可能因为特性开关状态变化导致提示词内容不同，从而破坏缓存。所有 Fork 子 Agent 的 API 请求前缀字节完全相同，仅最后一个 directive text block 不同，多个并行 Fork 共享同一个 prompt cache 条目。

Teammate（Swarm 模式）是独立的团队成员，通过 Mailbox 文件系统通信。Swarm 有三种执行后端：tmux（通过 tmux 分屏管理多个 Agent 进程）、iTerm2（利用 iTerm2 原生 split pane API）、in-process（同一 Node.js 进程内，通过 AsyncLocalStorage 隔离）。

任务类型（ Task.ts:6-13）里有一个特殊的 dream 类型：

export
 type 
TaskType
=
|
'local_bash'
// 本地 Shell 命令
|
'local_agent'
// 本地 Agent（同步/异步）
|
'remote_agent'
// 远程 Agent（沙箱环境）
|
'in_process_teammate'
// 进程内队友（AsyncLocalStorage 隔离）
|
'dream'
// 记忆整合 Agent
dream 是后台自动运行的 Agent，回顾历史会话，将经验整合到 MEMORY.md，分 orient/gather/consolidate/prune 四个阶段。

Coordinator 模式通过环境变量 CLAUDE_CODE_COORDINATOR_MODE 激活。Coordinator 只做三件事：与用户沟通、派发 Worker、综合结果，自己不使用文件/Bash 工具。Worker 遇到权限提示时，通过 Mailbox 转发给 Leader，Leader 端展示审批对话框。

系统提示词与记忆系统
图片
buildEffectiveSystemPrompt()（ utils/systemPrompt.ts:41）按优先级构建提示词： overrideSystemPrompt 完全替换（loop mode 使用）；coordinator mode 使用协调器提示词；agent definition 在常规模式替换、Proactive 模式追加； customSystemPrompt 由 --system-prompt 参数传入；最后是 defaultSystemPrompt。

提示词中有一个动态边界标记（ prompts.ts:105-115）：

// 标记将系统提示词切为两段，前段走全局缓存，后段每用户不同
export
const
 SYSTEM_PROMPT_DYNAMIC_BOUNDARY 
=
'__SYSTEM_PROMPT_DYNAMIC_BOUNDARY__'
标记前约 5,000 token 的静态行为指令使用 scope:'global' 缓存，在 Anthropic 基础设施层面跨用户共享。标记后的环境信息、记忆、MCP 指令等内容每用户/每会话不同，不走全局缓存。

静态部分包含：身份声明 + OWASP 安全指令、输出格式、权限模型、hook 处理、压缩说明、行为约束（约 50 行具体规则）、操作安全边界、工具使用优先级、风格约束、简洁性要求。

行为约束里有几条很有针对性的规则：

"Don't add features, refactor code, or make improvements beyond what was asked"
"Three similar lines of code is better than a premature abstraction"
"Do not propose changes to code you haven't read"
这些规则直指 LLM 在 Agent 场景下的常见过度行为：修 bug 时顺手重构，创建不必要的抽象，对未读代码提出修改。部分规则标注了 @[MODEL LAUNCH]，说明是针对特定模型版本测试后加入的。

CLAUDE.md 的加载有四层：Managed（ /etc/claude-code/CLAUDE.md，企业策略）、User（ ~/.claude/CLAUDE.md + ~/.claude/rules/*.md，个人偏好）、Project（ CLAUDE.md + .claude/CLAUDE.md + .claude/rules/*.md，项目规范）、Local（ CLAUDE.local.md，私有覆盖）。从根目录到 CWD 逐层向下遍历，越接近 CWD 的优先级越高。支持 @include 指令（最深 5 层）和 frontmatter paths 字段做条件注入。

记忆系统（ services/extractMemories/）在每次完整查询循环结束时，通过 runForkedAgent 启动提取 Agent，共享父级的 prompt cache。提取 Agent 的工具受限：只能 Read/Grep/Glob + 只读 Bash + 只对记忆目录 Write/Edit。四种记忆类型：user（用户偏好）、feedback（行为反馈）、project（项目上下文）、reference（参考资料）。

MEMORY.md 有硬性截断：200 行或 25KB（ memdir/memdir.ts:35-36）。它是索引文件，每行格式 -[Title](file.md)—one-line hook。记忆检索由 Sonnet 模型完成（不用主模型），从所有记忆文件的 header 中选出最多 5 个最相关的，以 <system-reminder> 标签注入用户消息。每文件限制 200 行 / 4KB，会话累计限制 60KB。

总结
图片

从 51 万行源码中可以看到，Claude Code 的工程复杂度远超表面上的一个 CLI 工具。

对话引擎用 async generator 实现了流式处理和背压控制，7 个 continue 站点覆盖了从 token 截断到 prompt 过长的各种异常路径。上下文管理搭建了三层压缩体系，从零开销的微压缩到需要 LLM 调用的完整压缩，逐级递进。断路器的注释暴露了一个真实的生产事故：每天 25 万次无效 API 调用。

工具系统用 description/prompt 分离做 token 优化，用默认不安全的策略强制开发者主动声明安全属性。Bash 安全管道的 2,592 行代码覆盖了从 Unicode 零宽字符到 Zsh 特有内建的各种攻击面。权限系统在 Auto 模式下做了三级快速路径，让日常操作避免 API 调用。

多 Agent 协作支持 SubAgent、Fork、Teammate 三种模式。Fork 的 prompt cache 共享设计，以及 dream Agent 的记忆整合机制，体现了对长期使用场景的考量。

系统提示词的动态边界标记把静态指令和动态内容切开，前者跨用户共享缓存，后者按会话变化。行为约束中那些针对 LLM 过度行为的规则，反映了大量实际使用中的问题积累。

这些设计决策，无论是 token 优化、安全防护还是错误恢复，都带着明显的工程迭代痕迹。源码中的注释日期、实验标记、生产数据，记录了一个 AI 编程工具在真实环境中不断演进的过程。

先分析到这，继续去学习源代码了。

