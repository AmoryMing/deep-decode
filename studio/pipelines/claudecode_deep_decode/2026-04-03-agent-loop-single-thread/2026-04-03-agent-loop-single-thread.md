---
title: "单线程 Agent Loop：为什么 Claude Code 不用 Swarm"
source: "https://blog.promptlayer.com/claude-code-behind-the-scenes-of-the-master-agent-loop/"
author: 多来源综合（PromptLayer、rumor、onefly.top、Sebastian Raschka、LMCache）
date: 2026-03-31
decoded: 2026-04-07
tags: [Claude Code, Agent Loop, 单线程, Swarm, Coordinator, 多Agent, 源码拆解]
series: Claude Code 源码拆解
series_number: 5
---

`while (true)` —— 51 万行代码的 AI 编程工具，心脏只有这四个单词。

2024 年 10 月，OpenAI 开源了 Swarm，一个多 Agent 编排框架，核心卖点是 Agent 之间的 handoff 和 routine。社区一片叫好：多 Agent 是未来。2026 年 3 月，Claude Code 源码泄露，51 万行 TypeScript 摊在阳光下。所有人都去找它的多 Agent 系统——确实找到了三套。但翻遍 1900 个文件后，一个更有趣的事实浮出水面：**Claude Code 的默认模式是单线程。一个 `while(true)` 循环，一条消息历史，模型自己决定下一步做什么。**

三套多 Agent 系统全部是 feature-flagged 的可选层。Anthropic 把多 Agent 当作特定场景的解决方案，而非通用范式。

这个选择背后，藏着 AI Agent 架构中一场安静但重要的路线之争。

![系列封面](material/pngs/00_系列封面.png)

## 一条 while 循环的一生

打开 `query.ts`，核心心跳就在第 307 行：

```typescript
// eslint-disable-next-line no-constant-condition
while (true) {
  // ...300+ 行循环体
}
```

注释 `no-constant-condition` 说明连 linter 都觉得这写法不对劲。但这恰好揭示了 Claude Code 的架构哲学：**不是模型服从编排器的调度，而是模型自己就是调度器。**

这个循环干什么？每一轮做四件事：

1. **准备**：把消息历史、系统提示词、工具定义打包成 API 请求。在此之前还要经过"五步净化"——裁剪、微压缩、上下文折叠、自动压缩、最终组装（详见本系列[[2026-04-03-queryengine-brain|QueryEngine 拆解]]）。
2. **请求**：调 Claude API，开启流式返回。
3. **执行**：模型输出的内容里如果包含工具调用，`StreamingToolExecutor` 立刻开始执行——不等整条消息返回完。
4. **判断**：看 `stop_reason`。模型说"还要继续调工具"→ 工具结果拼回消息列表，再来一轮。模型说"完事了"→ 循环结束。

源码中有两个安全阀：`maxTurns`（最大循环轮次）和 `maxBudgetUsd`（预算上限，美元）。Agent 跑飞了怎么办？设个上限就好。还有 `taskBudget` 通过 API 层面的 `output_config.task_budget` 做服务端预算控制——客户端和服务端双保险。

整个设计的核心假设用一句话就能概括：**模型足够聪明，可以充当自己的调度器。**

不需要外部编排框架替它决定"下一步做什么"，不需要 DAG（有向无环图）来预定义执行流程，不需要状态机来管理 Agent 间的切换。模型看到当前状态，自己判断该调什么工具、该怎么组合、什么时候停下来。

姑且给这个设计哲学一个名字：**"模型即调度器"（Model-as-Scheduler）**。

![Agent Loop vs Swarm](material/pngs/01_agent_loop_vs_swarm.png)

## 不是没有并发，是在正确的层级做并发

"单线程"三个字容易让人误解为"不并发"。恰好相反，Claude Code 在单线程内实现了精细的并发控制。

源码中有个关键类 `StreamingToolExecutor`（`src/services/tools/StreamingToolExecutor.ts`），它把工具分成两类：

- **并发安全的**（`isConcurrencySafe` 返回 `true`）：读文件、搜索、glob 这些只读操作，可以同时跑。
- **需要串行的**：写文件、执行 bash 命令这些会改状态的操作，必须排队。

关键是，并发安全不是一个固定标签，而是**根据实际参数动态判断**的。同一个 BashTool，`ls` 是并发安全的，`rm -rf` 不是。每个工具通过 `isConcurrencySafe(input)` 方法声明自己在当前输入下是否可以并行：

```typescript
// StreamingToolExecutor 的并发判断逻辑
private canExecuteTool(isConcurrencySafe: boolean): boolean {
  const executingTools = this.tools.filter(t => t.status === 'executing')
  return (
    executingTools.length === 0 ||
    (isConcurrencySafe && executingTools.every(t => t.isConcurrencySafe))
  )
}
```

翻译成大白话：如果当前没有工具在跑，随便跑。如果有工具在跑，新工具必须是并发安全的，且正在跑的工具也全都是并发安全的。一旦出现一个非并发安全的工具，所有人都得等它跑完。

更激进的是**投机执行**。在 Auto 权限模式下，模型还在流式输出工具调用参数的时候，`StreamingToolExecutor` 已经开始做安全分类检查了（`startSpeculativeClassifierCheck`）。等模型输出完成时，分类器结果可能已经就绪，用户零等待。这和 CPU 的分支预测是同一个思路——用空闲资源消除等待。

所以准确的描述不是"单线程不并发"，而是：**主循环单线程保证全局一致性，工具层并发最大化局部吞吐量。** 一个 Agent 在单次 turn 中可能同时读 10 个文件、并行搜索 3 个目录，但写文件必须一个一个来。

这解决了一个很现实的问题：Agent 经常一口气调好几个工具，不并行太慢，不串行就文件冲突。Claude Code 的答案是——**不在 Agent 层做并发，在工具层做并发**。

![三级并发阶梯](material/pngs/02_concurrency_ladder.png)

## 单线程的经济学：prompt cache 红利

选择单线程不只是架构偏好，背后有一笔精确的经济账。

Sebastian Raschka 在分析 Claude Code 时提出了一个核心论点：**harness 比 model 更重要**。其中最关键的 harness 技术就是 prompt cache——Anthropic API 对请求前缀相同的调用，缓存命中部分的计费只有正常价格的 10%。

单线程架构天然适合 prompt cache。每次 while 循环迭代时，系统提示词、CLAUDE.md、memory、工具定义、消息历史的前缀部分完全相同，只有最后追加的新消息不同。LMCache 团队的分析显示，Claude Code 的 prompt cache 命中率高达 **92%**。

这个数字意味着什么？Oracle 的一份 Agent 架构报告给出了参照：普通 Agent 系统消耗约 4 倍于 chat 的 token，多 Agent 场景高达 **15 倍**。如果 Claude Code 用多 Agent 作为默认架构，每个 Agent 各自维护独立的消息历史，前缀重叠率大幅下降，cache 命中率骤降，API 成本可能翻好几倍。

这笔账 Anthropic 显然算过了。源码中有一个精巧的设计印证了这一点——Fork 子 Agent 模式。当需要并行处理多个子任务时，系统会完整复制父 Agent 的 assistant message，将所有 `tool_use` 的结果替换为**相同的占位符文本**，只在最后追加每个子 Agent 各自不同的指令。结果是：所有子 Agent 的 API 请求前缀在**字节级别完全一致**，最大化 prompt cache 命中。

姑且把这个现象叫做**"单线程红利"**：单线程不只是架构简洁，它是 prompt cache 经济模型的最优解。一旦切换到多线程/多 Agent 作为默认范式，这笔红利就消失了。

## 三套多 Agent 系统：为什么都不是默认

既然单线程这么好，为什么还做了三套多 Agent 系统？

因为单线程有天花板。超大型任务（全仓库重构、跨模块并行开发）需要真正的多 Agent 协作。但 Anthropic 的回答不是"用一套通用的多 Agent 框架解决所有问题"，而是**针对不同场景精确设计了三套系统**：

### 1. Fork 子 Agent：缓存优先的轻量并行

最轻量的多 Agent 方案。子 Agent 共享父 Agent 的 prompt cache 前缀，独立执行后返回结果。适用于"同时搜 5 个文件然后汇总"这类扇出型任务。

不是独立运行的 Agent，更像是主循环 while(true) 的"分身术"——做完就收回，不维护独立状态。

### 2. Swarm/Teammate：文件邮箱团队系统

一个基于文件邮箱的 Agent 团队系统，代码在 `src/utils/swarm/` 目录下（20+ 个文件）。每个 teammate 有一个 JSON 邮箱文件，Agent 之间通过读写邮箱通信，文件锁保证并发安全。

Teammate 可以运行在两种后端：
- **同进程模式**（InProcess）：通过 `AsyncLocalStorage` 实现上下文隔离，共享 API 客户端和 MCP 连接。
- **分屏模式**：在 tmux 或 iTerm2 中启动独立的 Claude CLI 进程，每个 teammate 一个终端 pane。

权限管理是最精巧的部分——Worker 遇到需要审批的操作时，通过邮箱向 team leader 发送权限请求，leader 的 UI 上弹出审批对话框，审批结果再通过邮箱回传。整个权限同步、关机协调、计划审批都复用同一套邮箱基础设施。

源码中 teammate 的系统提示词追加了一条硬约束：

> "Just writing a response in text is not visible to others on your team - you MUST use the SendMessage tool."

teammate 的普通文本输出对队友不可见，必须通过 SendMessage 工具显式通信。这不是 bug，是设计——**强制结构化通信，杜绝无效闲聊**。

### 3. Coordinator：不许偷懒的项目经理

这是三套系统中最重的一个。通过环境变量 `CLAUDE_CODE_COORDINATOR_MODE` 开启后，Claude 从"执行者"变成"项目经理"，只剩 3 个工具：`Agent`（派活）、`SendMessage`（追加指令）、`TaskStop`（叫停）。

Coordinator 的系统提示词定义文件 coordinatorMode.ts 共 369 行，其中的四阶段工作流：

| 阶段 | 谁来做 | 目的 |
|------|--------|------|
| Research | Workers（可并行） | 调查代码库，理解问题 |
| Synthesis | **Coordinator 自己** | 读取 findings，**自己理解问题**，写出具体方案 |
| Implementation | Workers | 按方案执行，提交代码 |
| Verification | Workers | 测试变更是否生效 |

其中第二阶段 Synthesis 有一条铁律，值得单独拿出来看：

> "Never write 'based on your findings' or 'based on the research.' These phrases delegate understanding to the worker instead of doing it yourself."

翻译成大白话：**Coordinator 必须自己读完研究结果，自己理解问题，然后写出包含具体文件路径、行号和修改方案的指令。不能说"根据你的发现去修 bug"——这是把理解这个最关键的步骤外包出去了。**

源码中给出了正反例对比：

```
// 反面教材——懒委派
Agent({ prompt: "Based on your findings, fix the auth bug" })

// 正面教材——自己理解后给出精确指令
Agent({ prompt: "Fix the null pointer in src/auth/validate.ts:42. 
  The user field on Session is undefined when sessions expire but 
  the token remains cached. Add a null check before user.id access 
  — if null, return 401 with 'Session expired'." })
```

这条规则的本质不是代码规范，是管理哲学。用 rumor 的总结：**最差的 PM 是传话筒，最好的 PM 是自己理解技术细节后再做决策。Anthropic 把这个管理哲学写进了 prompt。**

姑且把这个设计原则叫做**"认知不可委派原则"（Non-Delegable Understanding）**：在 Agent 编排中，理解问题这一步永远不能外包给子 Agent。Coordinator 可以委派执行，但不能委派理解。

![Coordinator 四阶段工作流](material/pngs/03_coordinator_workflow.png)

## 一场安静的路线之争

回到开头的问题：为什么 Claude Code 不用 Swarm？

OpenAI 的 Swarm 框架代表了一种思路——**编排优先**：用外部框架定义 Agent 之间的 handoff 规则、routine 流程、状态转移。Agent 是棋子，框架是棋手。

Claude Code 代表了另一种思路——**模型优先**：让模型自己决定何时需要帮手、需要几个、给它们什么任务。模型是棋手，工具是棋子。

这两条路线的分歧不是技术实现上的——两者都能跑起来。分歧在于一个根本性的判断：**你相信当前的模型已经足够聪明，能自己当调度器吗？**

Anthropic 的答案显然是"相信"。源码中的隐含假设清单：

1. **模型本身足够聪明**，可以充当自己的调度器——不需要外部编排框架替它决定"下一步做什么"
2. **单线程 + prompt cache 的经济效益**优于多线程并行的吞吐量优势
3. **可调试性和可预测性比并行加速更重要**——用户需要看到 AI 在做什么
4. **大多数编程任务本质上是串行的**：理解问题 → 定位代码 → 修改 → 验证

第四点特别值得展开。编程不像数据处理可以轻松并行化。一个 bug 修复的典型流程是：先理解报错信息，再定位可疑代码，再分析上下文确认根因，最后修改并验证。每一步都依赖上一步的结果。强行并行化，要么信息冗余（多个 Agent 重复读同一段代码），要么信息不足（分头行动后需要大量同步开销）。

但这个判断不是绝对的。Coordinator 模式仍在灰度测试（`feature('COORDINATOR_MODE')`），三套多 Agent 系统并存而非统一，说明 Anthropic 自己也在探索单线程与多 Agent 的边界。

数据层面目前没有公开的 benchmark 对比单线程 vs 多 Agent 在不同任务类型上的效率。但从源码架构可以推断：Anthropic 的判断是——**对 80% 的日常编程任务，单线程是最优解；对 20% 的超大型任务，按需启用多 Agent**。这比"所有任务都用多 Agent"或"所有任务都用单线程"都更务实。

## 盲区与开放问题

单线程 + 可选多 Agent 的架构并非没有代价：

**性能天花板。** 全仓库重构、跨模块并行开发这类任务，单线程意味着 Agent 要串行地一个文件一个文件改。即使工具层有并发，主循环的串行瓶颈仍然存在。

**三套系统并存的认知负担。** Fork、Swarm、Coordinator 三套多 Agent 系统，分别解决缓存效率、团队通信、任务编排三个层面的问题，但对使用者和维护者来说，三套系统意味着三套学习成本和三套 bug surface。没有找到统一范式本身就是一个信号——这个领域还没有"最终答案"。

**Coordinator 的 Synthesis 瓶颈。** Coordinator 要求自己理解所有 Worker 的研究结果再做决策。当 Worker 数量增多、研究范围扩大时，Coordinator 自身的上下文窗口会成为瓶颈。这可能是 Coordinator 仍在灰度测试的原因之一。

**没有公开的效率对比数据。** 单线程 vs 多 Agent 在不同任务类型上的效率差距，目前没有 Anthropic 官方的 benchmark。这让架构选择更多依赖直觉而非数据。

## 对 AI 产品实践者意味着什么

三条可执行的判断：

**1. 默认单线程，按需多 Agent。** 这是 Claude Code 源码给出的最清晰的架构指南。不要因为"多 Agent 听起来更先进"就默认选择多 Agent 架构。先问自己：你的任务本质上是串行的还是可并行的？如果大多数情况是串行的，单线程 + 工具层并发就够了。

**2. 如果做多 Agent，先想清楚"理解"在哪个层级发生。** Claude Code 的 Coordinator 铁律——"Never write 'based on your findings'"——不只是代码规范。它指出了多 Agent 系统中最容易犯的错误：把理解问题这一步也委派出去。编排层（无论是框架还是 coordinator agent）必须自己理解全局状态，才能给出有效的任务分配。

**3. 关注 prompt cache 经济学。** 架构选择会影响 API 成本。单线程架构天然适合 prompt cache（92% 命中率）。如果切换到多 Agent，要算清楚 cache 命中率下降带来的成本增加，是否被并行加速的收益覆盖。Fork 子 Agent 的"字节级前缀对齐"设计提供了一个折中方案——并行但共享缓存。

---

## 本期关键词

**Model-as-Scheduler（模型即调度器）** —— 不用外部编排框架，让模型自己决定下一步做什么。Claude Code 的 while(true) 循环就是这个理念的极致体现。和 OpenAI Swarm 的"编排优先"形成对比。值得关注因为这可能是 Agent 架构的路线之争。

**StreamingToolExecutor（流式工具执行器）** —— Claude Code 在单线程内实现工具级并发的核心组件。读操作并行、写操作串行，并发安全性根据实际输入动态判断。投机执行让安全分类和模型输出并行进行。值得关注因为它证明了"单线程"不等于"不并发"。

**Coordinator Mode（协调者模式）** —— Claude Code 最重的多 Agent 模式。通过 feature flag 控制，Claude 变成只有 3 个工具的项目经理。coordinatorMode.ts 共 369 行，定义了 Research → Synthesis → Implementation → Verification 四阶段工作流。值得关注因为它的"认知不可委派"铁律是多 Agent 架构设计的核心原则。

**Non-Delegable Understanding（认知不可委派原则）** —— Coordinator 系统中的铁律：理解问题这一步永远不能外包给子 Agent。可以委派执行，但不能委派理解。本质上是管理哲学的代码化。值得关注因为这条原则适用于所有多 Agent 系统的设计。

**单线程红利** —— 单线程架构下 prompt cache 命中率高达 92%，API 调用成本大幅降低。一旦切换到多 Agent 默认模式，前缀重叠率下降，这笔红利消失。值得关注因为架构选择直接影响运营成本。

**Fork 子 Agent** —— Claude Code 最轻量的多 Agent 方案。通过字节级前缀对齐，让所有子 Agent 共享 prompt cache。不是独立 Agent，更像主循环的"分身术"。值得关注因为它是"并行但不牺牲缓存"的工程范例。

## 原文关键引用

> "Never write 'based on your findings' or 'based on the research.' These phrases delegate understanding to the worker instead of doing it yourself."（不要写"根据你的发现"或"根据研究结果"。这些措辞把理解委派给了 worker，而不是你自己去理解。）—— Claude Code Coordinator System Prompt

> "Parallelism is your superpower. Workers are async. Launch independent workers concurrently whenever possible — don't serialize work that can run simultaneously."（并行是你的超能力。Workers 是异步的。尽可能并发启动独立的 Workers——不要把能同时跑的工作串行化。）—— Claude Code Coordinator System Prompt

> "Just writing a response in text is not visible to others on your team - you MUST use the SendMessage tool."（直接写文本回复对队友不可见——必须使用 SendMessage 工具。）—— Claude Code Teammate Prompt Addendum

## 引用

1. [Claude Code Behind the Scenes of the Master Agent Loop](https://blog.promptlayer.com/claude-code-behind-the-scenes-of-the-master-agent-loop/) —— 本期拆解核心参考，PromptLayer 对 Agent Loop 的深度分析
2. [Claude Code's Secret Sauce](https://sebastianraschka.com/blog/2026/claude-code-secret-sauce.html) —— Sebastian Raschka 提出"harness > model"论点，prompt cache 经济学分析
3. [Context Engineering Reuse Pattern Under the Hood of Claude Code](https://blog.lmcache.ai/en/2025/12/23/context-engineering-reuse-pattern-under-the-hood-of-claude-code/) —— LMCache 团队分析 Claude Code 的上下文复用模式，92% cache 命中率数据来源
4. [从 Claude Code 源码看 Anthropic 的产品野心](https://rumor.top) —— rumor 对三套多 Agent 系统的深度分析
5. [Claude Code 源码泄露全面剖析](https://mp.weixin.qq.com/) —— 完整架构拆解，"一个带权限系统的流式工具执行循环"定义
6. [Claude Code 源码架构深度分析](https://onefly.top/posts/claude-code-leaked-source-architecture-deep-analysis.html) —— onefly.top 对 Coordinator 和 Swarm 的详细分析
7. [OpenAI Swarm](https://github.com/openai/swarm) —— OpenAI 的多 Agent 编排框架，本文对比参照
