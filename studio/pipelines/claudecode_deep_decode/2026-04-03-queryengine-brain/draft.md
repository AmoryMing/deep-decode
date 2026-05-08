---
title: "QueryEngine：13000 行代码的大脑中枢"
source: "https://blog.promptlayer.com/claude-code-behind-the-scenes-of-the-master-agent-loop/"
author: 多来源综合（PromptLayer、掘金、架构师JiaGouX、AeroMind、rumor）
date: 2026-03-31
decoded: 2026-04-07
tags: [Claude Code, QueryEngine, Agent Loop, 上下文工程, 流式执行, 源码拆解]
series: Claude Code 源码拆解
series_number: 4
---

88 行和 13000 行之间，隔着什么？

有人用 Rust 重写了 Claude Code 的核心循环，精简到 88 行代码。while 循环、工具调用、结果回填——骨架就这么简单。但真正的 Claude Code 源码里，query.ts 加上 QueryEngine.ts 加上 processUserInput.ts，三个文件合计超过 13000 行。

差出来的那 12900 行，不是冗余。那是一个 AI 编程工具从"能跑"到"能用"的全部距离。

## 三文件脊椎：不是一个函数，是一条流水线

大多数关于 Claude Code 架构的分析都会提到"Agent Loop"——模型思考、调用工具、观察结果、继续思考，循环往复。这个描述没错，但太粗了。就像说人类的神经系统是"接收信号→处理→输出动作"一样正确而无用。

拆开来看，Claude Code 的"大脑"其实是三个文件串起来的一条脊椎：

**main.tsx** 是启动器。它在系统拉起的瞬间就开始并行预取——MDM 设置、Keychain 凭据、API 预连接，能叠的全叠起来。源码注释直接说明了这些并行操作和启动耗时的关系。一个每天被频繁打开的工具，启动时间不是边角问题，是运行时体验。

**QueryEngine.ts** 是会话管理者。它不只是"把用户输入发给模型"。从源码看，`submitMessage()` 方法要准备 cwd、tools、commands、mcpClients、thinkingConfig、budget、session state，调用 `fetchSystemPromptParts()` 并行拉取三块系统提示词（defaultSystemPrompt、userContext、systemContext），再组合 memory prompt、custom prompt、append prompt，构建完整的运行时上下文。它维护着跨轮次的关键状态：`mutableMessages[]`（可变消息历史）、`abortController`（中断控制器）、`permissionDenials[]`（权限拒绝记录）、`totalUsage`（累计 token 用量）、`discoveredSkillNames`（已发现的 Skill 名称集合）。

**query.ts** 是真正的心脏。一个 AsyncGenerator 驱动的 `while(true)` 循环，所有的数据流最终汇聚于此——上下文、工具、压缩、API 调用、状态迁移。

这三个文件的关系不是调用层级，而是职责分层：启动器负责"拉起来"，会话管理者负责"准备好"，核心循环负责"跑起来"。拆开任何一层都好理解，但真正的工程难度在于它们之间的状态传递——一个 Agent 的"记忆"、"判断力"和"行动力"，就是在这些接口处被组装起来的。

## "五步净化"：每次 API 调用前的认知预处理

这是整篇拆解中信息密度最高的部分。

query.ts 的核心循环里，在真正调用 Claude API 之前，每一轮都要经过一条五步预处理流水线。把它叫做**"五步净化"**——就像自来水厂把原水变成饮用水，这条流水线把原始对话历史变成优化后的 API 请求。

**第一步：Snip（裁剪）。** 通过 `HISTORY_SNIP` feature flag 控制。按边界截断历史消息，裁掉最早的那些轮次。关键细节：裁剪掉的 token 数会向下传递给后续步骤，让阈值判断更准确。

**第二步：微压缩（MicroCompact）。** 最细粒度的压缩。每次工具调用返回结果后，如果结果太长，就地缩减。让 Claude 读一个 5000 行的文件，微压缩可能只保留和当前任务相关的部分。这一层对用户完全透明，和内容替换（`applyToolResultBudget`，按 `tool_use_id` 操作）解耦——两者互不干扰，可以叠加。这种正交设计让每一层都能独立演进。

**第三步：上下文折叠（Context Collapse）。** 通过 `CONTEXT_COLLAPSE` feature flag 控制。折叠大块的中间内容，但保留结构。源码注释有一句话说得很直白：

> "Runs BEFORE autocompact so that if collapse gets us under the autocompact threshold, autocompact is a no-op and we keep granular context instead of a single summary."

折叠刻意放在自动压缩之前——如果折叠就够了，就不触发更重的压缩，保留更细粒度的上下文。这不是偶然的顺序，而是经过权衡的设计决策。

**第四步：自动压缩（AutoCompact）。** 当 token 接近上下文窗口时触发。触发阈值不是简单的百分比——用上下文窗口大小减去一个固定的预留量。源码中写死了 `AUTOCOMPACT_BUFFER_TOKENS = 13_000`，这个数字来自实际数据：p99.99 的 compact summary 输出是 17,387 token。还有一条硬约束：`MAX_CONSECUTIVE_AUTOCOMPACT_FAILURES = 3`——连续失败三次就停止尝试，防止无限循环。

压缩过程本身也有一条非常严厉的前置指令——"CRITICAL: Respond with TEXT ONLY. Do NOT call any tools."——因为如果总结过程中 AI 又去调工具，就会产生更多 token 消耗，适得其反。

**第五步：组装请求。** 把净化后的消息、系统提示词、工具定义打包成最终的 API 请求。

五步走完，才轮到真正调用 API。

这条流水线的设计哲学值得上升一层来看。ByteByteGo 最近发了一篇上下文工程指南，核心观点是"more context isn't better, the model needs the right information rather than all available information"。Claude Code 的五步净化是这个理念最彻底的工程实现——不是等窗口快满了才慌忙压缩，而是每一轮都在精细调控进入模型的信息质量。

Oracle 的一份 Agent 架构报告给出了一个具体数字：Agent 系统消耗约 4 倍于普通 chat 的 token，多 Agent 场景高达 15 倍。这解释了为什么 Claude Code 在上下文压缩上投入了这么重的工程——对一个每天被频繁使用的工具来说，压缩效率直接影响 API 成本和响应速度。不是锦上添花，是生死线。

## StreamingToolExecutor：不等模型说完就动手

传统的 Agent 循环是串行的：模型输出完整的 tool_use block → 解析 → 执行工具 → 结果回填 → 下一轮。Claude Code 打破了这个串行等待。

源码中有两条工具执行路径：

**旧路径**（`toolOrchestration.ts`）：把工具调用分批——连续的、并发安全的工具并行执行（最多 10 个并发），不安全的工具串行执行。工具是否并发安全不是固定标签，而是通过 `isConcurrencySafe(input)` 根据实际参数动态判断。

**新路径**（`StreamingToolExecutor`）：模型还在流式输出的时候，就开始准备和执行工具调用。比如模型正在输出一个 BashTool 的参数，执行器已经在做安全检查了。更激进的是 `startSpeculativeClassifierCheck`——在 Auto 模式下，分类器的安全判断和模型输出并行运行，等模型输出完成时，分类器结果可能已经就绪，用户不需要等待。

这和 CPU 的分支预测、推测执行是同一个思路。上海交大和微软研究院最近发了一篇论文 PASTE（Pattern-Aware Speculative Tool Execution），专门研究 Agent 的投机性工具执行——用空闲资源提前执行预测的工具调用，减少未来的等待延迟。Claude Code 的 StreamingToolExecutor 是这个思路在工业级产品中的落地。

但投机执行带来了新的工程挑战。

当主模型在流式输出过程中失败时，系统会切换到 fallback model 重试。但主模型可能已经输出了一部分内容，包括带签名验证的 thinking blocks。这些"孤儿消息"必须被清理——源码用 **tombstone 消息类型**来标记它们，因为残留的 partial thinking block 会导致后续 API 调用报签名错误。

用户中断的处理也不简单。当用户按 Ctrl+C 打断时，系统需要为每一个还没有返回结果的 tool_use block 补一个 error 类型的 tool_result，否则 API 会因为消息协议不完整而拒绝下一次请求。源码里 `yieldMissingToolResultBlocks` 函数专门处理这个——遍历所有未完成的 assistant message，为每个 tool_use 块生成中断消息。这不是 Ctrl+C 那么简单——要在保持协议一致性的前提下，安全中断一个可能正在并行执行多个工具的 Agent。

错误传播用了 `siblingAbortController`——取消兄弟进程而不中断父级查询循环。这种细粒度的中断控制，是工业级 Agent 和 demo 之间的关键差异。

## "胖核心"哲学：为什么不拆散它

读完 query.ts，第一反应是——这文件太大了。按软件工程的教科书，应该拆成更小的模块。

但源码给出了一个反直觉的答案：**刻意不拆**。

Claude Code 这类系统最难管理的，不是单个模块的复杂度，而是跨轮次状态。消息什么时候进入上下文？工具结果什么时候被裁剪？哪些中间状态要持久化？什么时候该停，什么时候该继续？什么时候该压缩历史，什么时候该保留原始链路？

这些状态迁移如果拆得过散，表面上模块是瘦了，实际复杂度往往只是转移了位置——从"一个大函数看不懂"变成"十个小模块之间的交互看不懂"。后者通常更难调试。

有人用 Rust 重写了整个 Agent Loop，精简到 88 行。对比之下，query.ts 的"胖"不是因为代码写得差，而是它承载了所有 88 行版本没有的东西：五步预处理流水线、流式工具执行、fallback 切换、tombstone 清理、thinking block 规则、用户中断恢复、token 预算管理、压缩策略选择、stop hooks 处理......

源码里有一段注释，用魔法师的口吻警告后来者：

> "The rules of thinking are lengthy and fortuitous. They require plenty of thinking of most long duration and deep meditation for a wizard to wrap one's noggin around... Heed these rules well, young wizard. For if ye does not heed these rules, ye will be punished with an entire day of debugging and hair pulling."

这种注释风格说明维护者已经被这段逻辑坑过很多次了。但他们选择保留这个"胖核心"，而不是拆散它让每个片段看起来更清爽。

把这个决策叫做**"胖核心"哲学**——Agent 系统的核心状态机，宁可大而集中，不要小而分散。因为 Agent 的bug 不在模块内部，在模块之间。

这当然有代价。胖核心意味着难以并行开发、难以单元测试、新人上手慢。但对于一个每天被数十万用户使用的 Agent 产品来说，"调试时能一眼看到全部状态流转"比"代码结构好看"重要得多。

## feature() 编译时消除：不存在的代码最安全

query.ts 的另一个工程亮点，是 Bun 运行时的 `feature()` 机制。

```typescript
const contextCollapse = feature('CONTEXT_COLLAPSE')
  ? require('./services/contextCollapse/index.js')
  : null
```

这不是运行时的 if/else 判断。Bun 的 bundler 在编译时就把 `feature()` 求值了——如果 flag 是 false，整个 require 和相关代码被物理删除，不会出现在最终的 npm 包里。反编译都看不到。

源码里通过这个机制控制的模块包括：HISTORY_SNIP（裁剪压缩）、CONTEXT_COLLAPSE（上下文折叠）、REACTIVE_COMPACT（响应式压缩）、COORDINATOR_MODE（多 Agent 协调）、KAIROS（后台守护）、UDS_INBOX（跨实例通信）、WORKFLOW_SCRIPTS（工作流脚本）等。

这意味着外部用户看到的 Claude Code 只是完整系统的一个子集。内部版本（`USER_TYPE === 'ant'`）有更激进的输出策略、更详细的代码风格指引、还在 A/B 测试的实验功能（Verification Agent、Explore & Plan Agent）。Anthropic 自己就是 Claude Code 最大的用户——他们用自己的产品开发自己的产品，这个信号和 OpenAI 用 Codex 开发 Codex 是同一个思路。

## 盲区：这套系统没告诉你的

拆到这里，该说说 QueryEngine 架构没有回答的问题。

**压缩的信息损耗。** 五步净化听起来精巧，但每一步压缩都在丢信息。微压缩把 5000 行文件缩到"相关部分"——谁定义"相关"？如果模型后来需要被压缩掉的那部分代码怎么办？autocompact 连续失败三次后停止尝试，这时候上下文已经快满了，用户体验会怎样？源码里没有公开这些边界情况的处理策略。

**单线程的天花板。** Claude Code 刻意选择单线程主循环，拒绝 Swarm 架构。但当一个 Bash 命令执行了 30 秒、一次 git 操作卡住了——整个主循环被阻塞，用户看到的是一个冻结的终端。Google Chrome 团队的 Addy Osmani 最近系统梳理了多 Agent 编排模式，指出 Agent Teams 通过共享任务列表和点对点消息解决了单点瓶颈问题。Claude Code 选择单线程不是因为不知道多线程的好处，而是在"可调试性"和"并发性能"之间做了取舍——但这个取舍在长任务场景下正在遇到压力。

**"胖核心"的演进困境。** query.ts 今天的大小已经让维护者写出了魔法师口吻的警告注释。当更多 feature flag 被打开（KAIROS、COORDINATOR_MODE、WORKFLOW_SCRIPTS），这个文件还会继续膨胀。有没有一个临界点，超过之后"胖核心"的调试优势会被"太大了改不动"的劣势反超？源码里已经开始出现 `query/stopHooks.ts`、`query/config.ts`、`query/deps.ts`、`query/transitions.ts` 这些子模块——胖核心正在悄悄地、选择性地减肥。

**内外版本分叉。** `USER_TYPE === 'ant'` 分支意味着 Anthropic 内部用户和外部用户体验的是两个不同的 Claude Code。内部版本有更好的 prompt 策略、更多的实验功能、更激进的优化——但外部用户不知道自己用的版本少了什么。这不是技术问题，是透明度问题。

## 对 AI 从业者意味着什么

如果你正在做 Agent 产品，Claude Code 的 QueryEngine 架构至少给出了三个可执行的判断：

**第一，上下文工程不是可选项，是基础设施。** 不是等模型窗口更大就能解决的问题。Claude Code 在 200K token 窗口的基础上还做了六层压缩，每一层解决不同粒度的问题。如果你的 Agent 产品没有上下文管理策略，随着对话变长，质量一定会退化。

**第二，工具执行的串行等待是可以打破的。** StreamingToolExecutor 和投机性分类器检查不是花哨的优化——当用户每天用几十次工具调用时，每次省 200ms 的感知延迟就是竞争优势。这个思路和 CPU 推测执行一脉相承，学术界（PASTE 论文）也在跟进。

**第三，Agent 的核心状态机，慎拆。** "胖核心"哲学违反了软件工程的直觉，但在 Agent 系统中有其合理性——跨轮次状态管理的复杂度，集中比分散更可控。但要注意临界点：当你开始给胖核心写子模块的时候，说明它已经在临界点附近了。

说到底，QueryEngine 这 13000 行代码告诉我们一件事：**Agent 产品的核心不是接了哪个模型，而是中间这条"脊椎"怎么设计。** 88 行的 Agent Loop 谁都能写，但让它在真实用户场景下稳定运行——处理中断、管理上下文、优化延迟、恢复错误——需要的工程量比直觉预期大两个数量级。

这也是为什么 Sebastian Raschka 说"Claude Code 的秘密武器不是模型"。模型是大脑，但没有脊椎，大脑再强也只是一团发号施令但无法行动的组织。

---

## 本期关键词

**AsyncGenerator** -- JavaScript/TypeScript 的异步生成器模式，用 `function*` 和 `yield` 实现惰性求值。query.ts 用它驱动主循环：每次 yield 出一个事件（工具调用、压缩触发、模型响应），外层代码决定怎么处理。比 while+callback 的模式更适合表达"暂停-恢复"的状态机语义。

**StreamingToolExecutor** -- Claude Code 的流式工具执行器。传统做法等模型输出完再执行工具，StreamingToolExecutor 在模型还在流式输出时就开始准备和执行工具调用。本质是把 CPU 推测执行的思路搬到了 Agent 系统。

**tombstone 消息** -- 当 fallback 模型切换时，用于标记和清理主模型留下的"孤儿" thinking blocks。名字来源于数据库领域的墓碑标记（标记已删除但尚未物理清除的记录）。在 Claude Code 中防止签名不匹配导致后续 API 调用失败。

**AutoCompact** -- 自动压缩机制，当 token 使用量接近上下文窗口时触发。预留 13K token 的缓冲区（基于 p99.99 数据），最多连续失败 3 次。压缩过程禁止调用工具，只允许纯文本输出。

**feature() 编译时消除** -- Bun 运行时提供的特性开关机制。和普通的 if/else 不同，它在编译阶段就把未启用的代码物理删除，反编译都看不到。Claude Code 用它控制 KAIROS、COORDINATOR_MODE 等实验性功能的可见性。

**胖核心（Fat Core）** -- 本文提出的概念。指 Agent 系统中刻意将核心状态机保持在一个大文件中，而不是过度模块化的设计哲学。理由：Agent 的 bug 不在模块内部，在模块之间。集中管理跨轮次状态比分散管理更可调试。代价是难以并行开发和单元测试。

**五步净化（Five-Stage Purification）** -- 本文提出的概念。Claude Code 在每次 API 调用前的五步预处理流水线：Snip → 微压缩 → 上下文折叠 → 自动压缩 → 请求组装。每一步解决不同粒度的上下文问题，步骤之间有精心设计的依赖关系。

---

## 原文关键引用

> "Runs BEFORE autocompact so that if collapse gets us under the autocompact threshold, autocompact is a no-op and we keep granular context instead of a single summary."（先于 autocompact 执行，如果折叠就能把 token 降到阈值以下，autocompact 就不触发，保留更细粒度的上下文而非单一摘要。）-- query.ts 源码注释

> "The rules of thinking are lengthy and fortuitous. They require plenty of thinking of most long duration and deep meditation for a wizard to wrap one's noggin around... Heed these rules well, young wizard. For if ye does not heed these rules, ye will be punished with an entire day of debugging and hair pulling."（思考的规则冗长而曲折，需要长时间的深度冥想才能理解......好好记住这些规则，年轻的巫师。否则你将被惩罚整整一天的调试和抓狂。）-- query.ts 源码注释

> "CRITICAL: Respond with TEXT ONLY. Do NOT call any tools."（关键：只能输出纯文本，禁止调用任何工具。）-- compact prompt 指令

> "More context isn't better — the model needs the right information rather than all available information."（更多上下文不等于更好——模型需要的是正确的信息，而不是所有可用的信息。）-- ByteByteGo 上下文工程指南

---

## 引用

1. [Claude Code: Behind the Scenes of the Master Agent Loop](https://blog.promptlayer.com/claude-code-behind-the-scenes-of-the-master-agent-loop/) -- PromptLayer，Agent Loop 核心架构拆解
2. [Claude Code 源码深度解读](https://juejin.cn/post/7623066322222153728) -- 掘金 AeroMind，五步流水线与六层压缩机制
3. [Claude Code 源码架构解析：从启动Prompt到权限管道](context/information_sources/) -- 架构师JiaGouX，主链路与"胖核心"分析
4. [从Claude Code源码看Anthropic的产品野心](context/information_sources/) -- rumor，feature flag 与 KAIROS 全景
5. [Claude Code Architecture Explained: Agent Loop (Rust Rewrite)](https://dev.to/brooks_wilson_36fbefbbae4/claude-code-architecture-explained-agent-loop-tool-system-and-permission-model-rust-rewrite-41b2) -- 88行 Rust 重写与原版对比
6. [Act While Thinking: Accelerating LLM Agents via Pattern-Aware Speculative Tool Execution (PASTE)](https://arxiv.org/pdf/2603.18897) -- 上海交大+微软，投机性工具执行学术研究
7. [A Guide to Context Engineering for LLMs](https://blog.bytebytego.com/p/a-guide-to-context-engineering-for) -- ByteByteGo，上下文工程系统梳理
8. [The Code Agent Orchestra](https://addyosmani.com/blog/code-agent-orchestra/) -- Addy Osmani，多 Agent 编排模式分析
9. [What Is the AI Agent Loop](https://blogs.oracle.com/developers/what-is-the-ai-agent-loop-the-core-architecture-behind-autonomous-ai-systems) -- Oracle，Agent 系统 token 消耗数据
10. [Sebastian Raschka: Claude Code's Secret Sauce Isn't the Model](https://sebastianraschka.com/blog/2026/claude-code-secret-sauce.html) -- Harness > Model 论证
