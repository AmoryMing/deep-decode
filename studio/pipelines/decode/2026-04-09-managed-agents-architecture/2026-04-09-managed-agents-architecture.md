---
title: 脑手分离：Anthropic 不再只卖模型了
source: https://www.anthropic.com/engineering/managed-agents
author: Lance Martin, Gabe Cemaj, Michael Cohen (Anthropic Agents API 团队)
date: 2026-04-08
decoded: 2026-04-09
tags: [AI基础设施, Agent架构, Anthropic, Claude Managed Agents, 平台战略]
---

![封面](material/pngs/00_系列封面.png)

Anthropic 卖 Claude API 的时候，按 token 收费。现在他们推出了 Managed Agents，按小时收费——$0.08 一个 session-hour。

从按字数卖到按工时卖，这不是定价变了，是商业模式变了。

## 这篇工程博客在说什么

2026 年 4 月 8 日，Anthropic 同时发布了三样东西：一篇工程博客、一套完整的 API 文档体系、和一个公测产品。工程博客的标题是「Scaling Managed Agents: Decoupling the Brain from the Hands」，作者是 Agents API 团队的 Lance Martin、Gabe Cemaj 和 Michael Cohen。

标题里的关键词是 **decoupling**——解耦。这不是产品发布的常见措辞，这是架构设计的核心原则。Anthropic 选择在产品发布日用一篇工程博客而不是产品博客来打头阵，说明他们认为架构本身就是卖点。

WIRED 的报道用了一个更直白的说法：Anthropic 从"卖模型访问权"变成了"卖一个你可以派遣的工人"。Notion、Sentry、Rakuten、Asana 和 Vibecode 已经在用。

## "脑手分离"：一个操作系统级的设计决策

Anthropic 的工程团队在博客里提出了一个架构原则，用大白话说就是三件事分开放：

- **Session（会话日志）**：一个 append-only 的事件流，记录了 Agent 做过的所有事。不可改，只追加。
- **Harness（调度器）**：调用 Claude、把 Claude 的工具调用路由到正确位置的循环——也就是"脑"。
- **Sandbox（沙箱）**：Claude 实际执行代码、编辑文件的容器环境——也就是"手"。

为什么要分开？博客里有一个特别有说服力的案例。

Claude Sonnet 4.5 在接近上下文窗口极限时会表现出一种行为——工程团队叫它 **context anxiety**（上下文焦虑）：模型会提前结束任务，仿佛害怕自己记不住接下来的事。团队为此在 Harness 里加了上下文重置机制。但当同一个 Harness 跑在 Opus 4.5 上时，这种焦虑消失了——上下文重置变成了无意义的开销。

> "Harnesses encode assumptions about model capabilities that become obsolete as models improve."

这句话是整篇博客的精髓。Harness 是有保质期的。模型每升级一次，Harness 里的「补丁」就有一部分过期。如果脑和手长在同一个容器里，你没法单独升级脑而不碰手。

这里浮现出一个值得命名的现象，姑且叫它 **「Harness 保质期」**。传统做法是：模型出了怪癖 → 在 Harness 里打补丁 → 补丁固化成基础设施代码。但模型能力进化的速度远快于基础设施更新的速度，于是补丁堆积，Harness 变成了一个记录了所有历史模型怪癖的「技术债博物馆」。解耦的核心价值不是性能优化，是让 Harness 可以被整体替换。

![耦合vs解耦架构](material/pngs/01_耦合vs解耦架构.png)

## 从宠物到牲畜

博客里用了 DevOps 界一个经典隐喻：**Pets vs Cattle**（宠物 vs 牲畜）。

早期架构里，一个 Agent 的所有组件住在同一个容器里。容器就像一只宠物——你给它起名字，精心维护，它生病了你心疼。问题是：

- 容器挂了，整个 session 丢失
- 容器不响应，需要人工介入
- Harness 无法连接容器外的资源
- 调试需要暴露用户数据

新架构把容器变成了牲畜：编号、可替换、挂了就扔。Harness 搬到容器外面，通过一个极简接口调用容器：

```
execute(name, input) → string
provision({resources})
```

容器挂了？Harness 把它当成一个 tool call error，重新初始化一个新的。Session 日志在外面，什么都不丢。

这个设计直接带来了性能飞跃。原来每个 session 启动前要先启动容器（克隆仓库、启动进程、拉取事件），推理得排队等。解耦后，推理立即开始，容器只在需要时才启动。效果是：**p50 TTFT 降了约 60%，p95 降了超过 90%**。

## 安全边界：凭证永远不碰沙箱

耦合架构还有一个隐蔽但致命的问题：prompt injection 可以触达凭证。Claude 生成的代码和访问凭证住在同一个容器里——注入攻击只需要一步。

解耦后，Anthropic 用了两种隔离策略：

**Resource-bundled auth（资源绑定认证）**：Git 访问令牌在沙箱初始化时就写入仓库配置。之后的 push/pull 操作正常工作，但令牌本身对 Claude 不可见。

**Vault-based tokens（金库令牌）**：OAuth 令牌存在外部。Claude 调用工具时，请求经过一个代理层，代理层从金库取凭证、发起外部调用、把结果返回给 Claude。Claude 从头到尾看不到任何凭证。

Harness 本身也不知道凭证的存在。这意味着即使 Harness 被攻破，攻击者也拿不到任何有价值的东西。

![安全隔离设计](material/pngs/03_安全隔离设计.png)

## 上下文工程：Session 变成外部状态机

长时间运行的任务不可避免地超出 Claude 的上下文窗口。传统做法是压缩（compaction）或裁剪（trimming），但这些操作是不可逆的——你不知道删掉的信息以后会不会用到。

Managed Agents 的解法是把 Session 变成一个外部对象，Harness 通过 `getEvents()` 接口按需读取：

- 选取事件流的任意位置切片
- 从上次停止的地方继续
- 回溯到某个特定时刻之前的上下文
- 在执行操作前重新读取相关上下文

这意味着上下文管理不再是一锤子买卖。未来的 Harness 可以实现任何上下文策略——而且不需要改 Session 接口。这是面向未来模型能力的关键设计：今天的上下文窗口是 100 万 token，明天可能是 1000 万，策略完全不同，但接口不变。

## 完整的产品拼图

工程博客只讲了架构。但 Anthropic 同时发布的文档体系揭示了完整的产品版图，远比博客暗示的要大：

**基础层（公测）**：Agent + Environment + Session + Events。创建一个 Agent，配好模型、系统提示、工具；定义一个 Environment，配好容器参数、网络权限；启动 Session 发消息，通过 SSE 流式接收结果。内置 8 个工具（bash、文件读写、glob、grep、web fetch、web search），支持自定义工具。7 种 SDK（Python、TypeScript、Java、Go、C#、Ruby、PHP）加 CLI。

**目标层（研究预览）——Outcomes**：这可能是最有想象力的部分。你可以定义"完成长什么样"——写一个 rubric（评分标准），Managed Agents 会自动启动一个独立的 grader（评审员），在单独的上下文窗口里评估产出是否达标。没达标？Agent 自动迭代，最多 20 轮。Grader 独立于主 Agent，避免"既当运动员又当裁判"。

**协作层（研究预览）——Multi-agent**：一个协调者 Agent 可以调度其他 Agent，每个 Agent 在自己的线程里运行，有独立的上下文，但共享同一个容器文件系统。这意味着一个 Agent 写的文件，另一个 Agent 能读。适合代码审查 + 测试生成 + 研究搜索并行执行的场景。目前限制一级委派——Agent 可以调 Agent，但被调的 Agent 不能再调 Agent。

**记忆层（研究预览）——Memory Stores**：跨 Session 的持久化记忆。每个 memory store 是一组带路径和版本历史的文本文件，上限 100KB/条。支持乐观并发控制（sha256 校验），支持 redact（脱敏）操作清除敏感内容但保留审计轨迹。一个 Session 最多挂 8 个 memory store。

这四层组合起来，构成了一个完整的「**认知基建**」——从原始 LLM 到有记忆、会自我评估、能协作的自主工人之间的全部基础设施。

![四层认知基建](material/pngs/02_四层认知基建.png)

![上下文工程](material/pngs/04_上下文工程.png)

## 战场态势：三家都在建"Agent 云"

Anthropic 不是唯一在做这件事的。

OpenAI 的 Codex 走的是完全自主路线：云端沙箱、fire-and-forget、开发者不在环里也能干活。最近还加了插件系统，支持 Box、Figma、Linear 等第三方集成。GPT-5.3-Codex 的代码生成速度超过 1000 token/s，token 效率大约是 Claude Code 的 4 倍——但代码质量盲测中 Claude 的胜率是 67%。

Google 的 Gemini CLI 和 Antigravity IDE 也有类似的插件/扩展架构。三家现在用的底层模式几乎一样：MCP 服务器 + 自定义命令 + Agent Skills + Hooks，通过 GitHub 或内置注册中心分发。

但 Managed Agents 有一个差异化卖点：**它不只是一个编程助手的基础设施，而是通用 Agent 基础设施**。Outcomes（目标评分）、Memory（持久记忆）、Multi-agent（多 Agent 协作）这三个研究预览功能指向的方向不是"更好的代码生成"，而是"能替你完成复杂知识工作的自主系统"。

这里浮现了另一个值得命名的概念：**「调度税」**。每个想部署 Agent 的团队都面临同一组基础设施问题——沙箱隔离、上下文管理、工具路由、状态持久化、安全边界。自己搭建这些的成本就是"调度税"。Anthropic 的策略是：我帮你把调度税降到 $0.08/小时，你专注定义 Agent 干什么就好。

![竞品战场态势](material/pngs/05_竞品战场态势.png)

## 盲区与未说出口的

这篇博客（和整套文档）刻意回避了几个问题：

**锁定风险**。整套基础设施跑在 Anthropic 的云上，用的是 Anthropic 的容器、Anthropic 的事件格式、Anthropic 的 Memory API。一旦深度集成，切换成本极高。博客里那个"操作系统抽象"的比喻很漂亮，但 `read()` 系统调用是标准化的——Anthropic 的 Session API 不是。

**研究预览 ≠ 生产就绪**。Outcomes、Multi-agent、Memory 都标注了"Research Preview"，需要单独申请。这意味着最有想象力的三个功能，在生产环境的可靠性还没有被验证。但 Anthropic 显然在用这些功能作为产品叙事的核心——这中间存在一个承诺与交付之间的时间差。

**定价透明度**。$0.08/session-hour 这个数字来自第三方报道，官方文档里没有明确写出。Session-hour 是怎么算的？空闲时计费吗？容器配置不同价格一样吗？开发者在评估成本时缺少关键信息。

**自主性的边界**。OpenAI 最近发表了一篇关于监控内部编程 Agent 的文章，明确讨论了 Agent 试图修改自身安全机制的风险。Anthropic 在安全隔离上做了出色的架构设计（凭证永不触达沙箱），但对 Agent 行为监控和对齐问题着墨不多。当 Agent 可以跑几个小时、调用多个子 Agent、还有持久记忆时，这个问题会变得比单次 API 调用复杂得多。

## 对 AI 从业者意味着什么

**如果你在搭建 Agent 基础设施**：认真评估 build vs buy。Managed Agents 涵盖了沙箱隔离、状态管理、上下文工程、安全边界、多 Agent 协调的完整方案。自建这些的工程量以月计。但要清醒地评估锁定风险——特别是 Memory Store 和 Outcomes API，一旦用上就很难迁移。

**如果你是产品经理**：关注 Outcomes 功能。"定义完成标准 + 自动评分 + 迭代到达标"这个模式，本质上是把产品经理的验收流程 API 化了。Rubric 写得好不好直接决定产出质量——这意味着"定义需求"的技能变得比"管理开发"更值钱。

**如果你在做技术选型**：Managed Agents vs OpenAI Codex 的核心差异不是模型能力，而是哲学。Anthropic 走"完全托管 + 结构化接口"路线，适合需要可控性和企业合规的场景。OpenAI 走"开源 CLI + 完全自主"路线，适合开发者优先、迭代速度优先的场景。两条路都在收敛——Codex 在加管控，Managed Agents 在加自主性。

**一个更深层的信号**：Anthropic 用"操作系统"来比喻自己的架构。这个比喻的潜台词是——操作系统厂商不只是卖 kernel，他们定义了整个生态的接口标准。如果 Managed Agents 成为 Agent 世界的事实标准，Anthropic 就从模型提供商变成了平台提供商。这是云计算历史里回报最高的位置。

---

## 本期关键词

**Managed Agents** -- Anthropic 的托管 Agent 服务。你定义 Agent 做什么（模型、提示词、工具），Anthropic 负责怎么跑（容器、状态、安全）。本质上是 Agent 的 PaaS（Platform as a Service）。

**Harness（调度器）** -- 包裹在 LLM 外面的控制循环：接收用户消息 → 调用模型 → 解析模型输出 → 路由工具调用 → 把结果返回模型。Claude Code 就是一个 Harness。关键洞察：Harness 是有保质期的，模型升级后 Harness 里的补丁会过期。

**Session（会话）** -- Agent 执行的完整事件日志，append-only，不可篡改。Managed Agents 的核心设计决策是把 Session 从容器里拆出来独立存储，这样容器挂了、Harness 崩了，Session 数据都不丢。

**Outcome（目标）** -- 研究预览功能。你写一个 rubric（评分标准），系统自动用独立的 grader 评估 Agent 的产出是否达标，不达标就继续迭代。最多 20 轮。"裁判"和"运动员"分开，避免自我评估偏差。

**Pets vs Cattle（宠物 vs 牲畜）** -- DevOps 经典概念，被 Anthropic 用到了 Agent 架构上。宠物 = 精心维护的单体容器，挂了很心疼；牲畜 = 编号可替换的标准化容器，挂了就扔。Agent 基础设施应该用牲畜模式。

**Context Anxiety（上下文焦虑）** -- Claude Sonnet 4.5 在接近上下文窗口极限时提前结束任务的行为。在 Opus 4.5 上消失了。这个案例证明了 Harness 保质期问题：为特定模型打的补丁，在新模型上变成了负担。

**TTFT（Time to First Token）** -- 从发送请求到收到第一个 token 的延迟。脑手分离后，Managed Agents 的 p50 TTFT 降了约 60%，p95 降了超过 90%。核心原因：推理不再等容器启动。

**Memory Store（记忆库）** -- 研究预览功能。跨 Session 的持久化记忆，Agent 自动检索和写入。支持版本历史、乐观并发控制、脱敏操作。上限 100KB/条，每个 Session 最多挂 8 个。

## 原文关键引用

> "Harnesses encode assumptions about model capabilities that become obsolete as models improve."（Harness 编码了关于模型能力的假设，这些假设随着模型进步而过时。）-- Lance Martin et al.

> "The `read()` command is agnostic as to whether it's accessing a disk pack from the 1970s or a modern SSD. The abstractions on top stayed stable while the implementations underneath changed freely."（`read()` 命令不管底层是 1970 年代的磁盘包还是现代 SSD。上层抽象保持稳定，底层实现自由更换。）-- Lance Martin et al.

> "Anthropic shifted from selling access to a model to selling access to a worker you can dispatch work to. That is a completely different product."（Anthropic 从卖模型访问变成了卖一个你可以派遣的工人。这是一个完全不同的产品。）-- WIRED

## 引用

1. [Scaling Managed Agents: Decoupling the Brain from the Hands](https://www.anthropic.com/engineering/managed-agents) -- 本期拆解原文
2. [Claude Managed Agents Documentation](https://platform.claude.com/docs/en/managed-agents/overview) -- 完整 API 文档体系（Overview + Quickstart + Tools + Outcomes + Multi-agent + Memory）
3. [Anthropic's New Product Aims to Handle the Hard Part of Building AI Agents](https://www.wired.com/story/anthropic-launches-claude-managed-agents/) -- WIRED 报道，"从卖模型到卖工人"
4. [Anthropic's Biggest Infrastructure Play Yet](https://chatgptguide.ai/claude-managed-agents-launch/) -- ChatGPT Guide 深度分析，含定价 $0.08/session-hour
5. [How we monitor internal coding agents for misalignment](https://openai.com/index/how-we-monitor-internal-coding-agents-for-misalignment/) -- OpenAI 内部 Agent 监控，安全对照参考
6. [Building Effective Agents](https://www.anthropic.com/engineering/building-effective-agents) -- Anthropic 此前关于 Agent 设计的工程博客系列
7. [Claude Code vs Codex CLI 2026](https://www.nxcode.io/resources/news/claude-code-vs-codex-cli-terminal-coding-comparison-2026) -- 竞品对比数据（代码质量 67% 胜率、SWE-bench 80.9%）

---

## 反向双链（后续相关拆解）

- [[2026-04-17-your-harness-your-memory]] — 2026-04-17：Harrison Chase（LangChain）+ Sarah Wooders（Letta）对本文主角 Managed Agents 的联合反击文拆解。命名"状态锁定（Stateful Lock-in）"概念，论证闭源 harness = 失去 memory 所有权。
