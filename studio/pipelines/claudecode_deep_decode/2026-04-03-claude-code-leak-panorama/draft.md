---
title: 1902个文件里藏了什么：Claude Code 源码泄露全景
source: https://36kr.com/p/3747481076417289
author: 多信源交叉验证（CyberNews, VentureBeat, Engineer's Codex, Zscaler, The Guardian 等）
date: 2026-03-31
decoded: 2026-04-06
tags: [Claude Code, 源码泄露, AI工程架构, 安全, Anthropic]
---

# 1902个文件里藏了什么：Claude Code 源码泄露全景

59.8 MB。这是一个 source map 文件的大小。

2026 年 3 月 31 日，Solayer Labs 研究员 Chaofan Shou 在 npm 包 `@anthropic-ai/claude-code` 的 v2.1.88 中发现了这个异常文件。解压后是 1,902 个 TypeScript 源码文件，512,000 行代码——Anthropic 最赚钱的产品之一，Claude Code 的完整实现，就这么躺在了全世界每一个开发者的 `node_modules` 里。

GitHub 镜像仓库在 48 小时内拿到了 30,000 颗星、40,200 次 fork（CyberNews 数据）。Anthropic 官方回应只有两个词：「human error」（The Guardian 报道）。

但这不是一篇关于"某公司出了安全事故"的文章。事故本身只是一扇窗。透过这 1,902 个文件，能看到的是：当今最复杂的 AI 编程助手到底长什么样，以及——它的竞争力到底在哪里。

## 同一个坑，摔了两次

先说让人不舒服的部分。

这不是 Anthropic 第一次因为 source map 泄露源码。2025 年 2 月，v0.2.8 版本就出过一次——当时的代码量小得多，base64 反混淆后能看到的信息有限，行业没当回事。

16 个月后，同一类错误以更大规模重演。dev.to 作者 Varshith Hegde 在复盘文章中提到了一个关键细节：Anthropic 2025 年收购了 Bun（Claude Code 的 JavaScript runtime），而 Bun 的 source map 生成 bug 在事发 20 天前就被社区报告了，但没有修复。

![泄露时间线](material/pngs/06_泄露时间线.png)

这暴露了什么？不是某个工程师的疏忽——这种说法太轻了。数据表明这是 **CI/CD 流水线的系统性缺陷**：从代码构建到 npm 发布的链路上，没有一个环节检测到一个 59.8MB 的异常文件混进了分发包。对比 axios 同日被发现的供应链攻击（RAT 木马在 00:21-03:29 UTC 窗口内分发，Zscaler ThreatLabz 报告），Claude Code 的泄露虽然不涉及恶意代码，但暴露的流程漏洞性质相同：**发布前的完整性校验缺失**。

Varshith Hegde 还提出了一个更尖锐的问题：事发日是 3 月 31 日，愚人节前夜；源码中发现的 Buddy 宠物系统原定 4 月 1-7 日上线。真的是意外？还是一次精心设计的 PR 事件？

Anthropic 不太可能故意泄露自己的安全架构细节和未发布功能。但这个质疑之所以值得记录，是因为它指向了一个更深层的问题：**当一家以安全著称的公司连续犯同类错误，行业对它的信任评估需要重新校准。**

## 六层自研：不是"模型加壳"

拆开这 512,000 行代码，第一个感受是：这不是大多数人想象中的"聊天机器人加个终端壳"。

Engineer's Codex 的分析最直观——整个代码库按功能分为 7 大类、40 个工具模块、184 个文件，仅工具系统就有约 50,800 行代码（Randal Olson 统计）。而这只是冰山水面上的部分。

![六层架构](material/pngs/01_六层架构.png)

从底层到顶层，整套系统可以归纳为六层架构：

**L1 运行时层**。Bun 作为 JavaScript runtime，负责启动和底层 I/O。这是 Anthropic 收购 Bun 后的直接产物——自己控制运行时，不受 Node.js 生态的节奏约束。

**L2 核心引擎层**。QueryEngine 是整个系统的大脑中枢，仅这一个模块就有 13,000 行代码，负责对话编排、Prompt 组装、工具调度、上下文压缩（Snip 机制）和 Token 追踪。PromptLayer 的技术分析用"master agent loop"来描述这个引擎——单线程循环，不用 Swarm 多 Agent 架构，所有决策在一个循环里完成。

这个设计选择值得停下来说一下。行业里有一股明显的趋势是用多 Agent 编排（如 AutoGen、CrewAI）来处理复杂任务。但 Claude Code 选择了相反的路：**单线程、单循环、所有工具平等接入**。这意味着什么？意味着它赌的是单个模型足够强，不需要多个弱模型协调。从当前 Opus 的能力来看，这个赌注是成立的——但它也意味着这套架构对模型能力有硬性下限要求。

**L3 工具层**。45 个内置工具，每个工具都是一等公民——有独立的描述、参数 schema、权限声明。Randal Olson 把它们分成 7 类：File IO、Shell、Web、Multi-Agent、Planning、MCP/Skills、Internal。值得注意的是 MCP（Model Context Protocol）的接入——这意味着 Claude Code 的工具系统不是封闭的，任何人可以通过 MCP 协议扩展它的能力边界。

**L4 安全层**。下面单独说，这是整个系统最值得深挖的部分。

**L5 记忆层**。四分类记忆系统（user/feedback/project/reference），加上 Snip 压缩机制处理长对话的上下文衰减。LMCache 的分析提到了一个惊人的数据：**92% 的缓存复用率**——意味着 Claude Code 在多轮对话中，有超过九成的 prompt 前缀是从缓存读取而非重新计算的。这直接决定了响应速度和 API 成本。

**L6 终端 UI 层**。用 Ink（React for CLI）搭建，80+ 个组件文件。这一层经常被忽视，但它决定了用户体验的"手感"——187 个 spinner 动词（Wes Bos 发现的彩蛋）、Vim 模态编辑器、全键盘操作……这些细节说明 Claude Code 的目标用户画像非常明确：重度终端用户，不是鼠标流。

![记忆系统](material/pngs/04_记忆系统.png)

这六层架构有一个共同特征：**核心链路零外部依赖**。不用 LangChain，不用 AutoGen，不用 Semantic Kernel。对比市面上大多数 AI 编码工具（底层几乎都依赖 LangChain 或类似框架），Anthropic 选择全栈自研的成本极高，但换来的是对每一层行为的完全控制。

这里可以给一个更结构化的判断：把这个现象命名为 **「自研溢价」**。当产品的核心竞争力是"可靠性"时（AI 编码工具的核心诉求），每一层外部依赖都是一个不可控的风险源。自研的成本在前期是负担，但在产品成熟期会变成护城河——因为竞品要么也走自研（需要同等的工程投入），要么走依赖路线（需要承受框架升级带来的兼容性风险）。

## 双 AI 制衡：安全不是功能，是地基

如果只看一层，看安全层。

Claude Code 的安全架构不是"在执行前加一道审核"这么简单。它本质上是一个 **双 AI 制衡系统**：主 AI（Opus/Sonnet）负责执行任务，一个独立的 Sonnet 分类器（Temperature=0，确保确定性输出）负责判断每一步操作的风险等级。

![双AI安全架构](material/pngs/02_双AI安全架构.png)

每一条 bash 命令在执行前，要过四道门：

1. **bashClassifier**——用 LLM 判断命令的风险类别（只读/写入/破坏性/网络访问）
2. **yoloClassifier**——在用户开启"自动模式"时做二次确认（自动模式不等于无限制模式）
3. **权限网关**——根据用户设定的权限等级（从 default 到 auto，共 6 级）决定是放行、提示确认还是直接拒绝
4. **熔断机制**——累计异常达到阈值后自动中断会话

Engineer's Codex 的分析中提到了一个有趣的细节：代码中存在用正则表达式检测用户情绪的逻辑——脏话、负面情绪关键词会被捕获（Hacker News 讨论中有人注意到了这个 swear words regex filter）。这不是审查，更可能是安全系统的一部分：当用户情绪激动时，破坏性操作的确认阈值会提高。

VentureBeat 引用 CrowdStrike CTO 的话：「Don't give agent access to everything just because you're lazy.」这句话精确描述了 Claude Code 安全架构的设计哲学——**信任不是开关，是阶梯**。6 级权限不是 6 个选项，而是信任从零到最大的连续光谱。

但也要看到边界。Zscaler ThreatLabz 的安全分析指出，源码泄露后，两个已知漏洞（CVE-2025-59536、CVE-2026-21852）的利用门槛显著降低——攻击者现在不需要黑箱试探，可以直接对着源码找安全检查的绕过路径。GitGuardian 的数据更值得警惕：**Claude Code 辅助的代码提交中，密钥泄露率为 3.2%，是行业平均水平 1.5% 的两倍多。**

这个数据意味着什么？安全架构再精密，如果用户在使用过程中把 API 密钥、数据库密码写进了代码（然后被 Claude Code 帮忙提交了），整个安全设计的价值会被终端用户行为稀释。这是所有 AI 编码工具共同面对的 **「信任传递悖论」**：你越信任工具、越频繁地让它自动执行，它帮你犯错的概率就越高。

## 四个隐藏功能：泄露的不是代码，是路线图

源码泄露最让竞品工程师兴奋的部分，不是已上线的功能，而是 Feature Flags 后面藏着的未发布功能。

![隐藏功能矩阵](material/pngs/03_隐藏功能矩阵.png)

**KAIROS**——7x24 后台 Daemon。源码注释显示原计划 4 月 1 日上线。这不是"后台跑个任务"这么简单——Daemon 意味着 Claude Code 可以在用户不操作时持续监控代码仓库、自动处理 CI/CD 失败、主动发起 PR review。如果上线，Claude Code 就不再是"你问它答"的工具，而是一个**始终在线的工程搭档**。

**Buddy 系统**——18 个物种、5 级稀有度、1% 闪光率、RPG 属性……这是一个完整的电子宠物系统，藏在 AI 编码工具里。Engineer's Codex 的拆解显示，这个模块用了代码混淆来躲过内部代码扫描。

为什么一个正经的开发工具要做电子宠物？这个问题本身就是答案。**Buddy 系统是用户留存机制。** 编码工具的使用黏性天然比社交产品低——用户只在编码时才打开它。宠物系统创造了一个与编码任务无关的"每天打开"理由。这是从游戏行业搬来的 daily login 机制，被包装成了开发者文化能接受的形态。

**Undercover Mode**——约 90 行代码，功能是抹除所有 AI 辅助痕迹。代码注释、提交信息、文件头中的 AI 标记都会被清除。讽刺的是，这个用来"反泄露"的功能本身被泄露了。

**Anti-Distillation**——这个最值得关注。`ANTI_DISTILLATION_CC` 标志背后的逻辑是：当检测到输出可能被用于训练竞品模型时，注入虚假的 tool definitions（fake_tools）。本质上是**数据投毒**——如果竞品拿 Claude Code 的输出做训练数据，会学到错误的工具定义。

这四个功能放在一起看，能拼出一张清晰的产品路线图：KAIROS 是**使用深度**的延伸（从按需到常驻），Buddy 是**使用频度**的延伸（从工作时到每天），Undercover 是**企业客户需求**的回应（合规场景），Anti-Distillation 是**竞争防御**。每一个都不是拍脑袋做的功能，而是商业目标的直接映射。

## 屎山也在：3167 行的单函数

在赞叹架构精密的同时，源码也暴露了工程质量的另一面。

Engineer's Codex 提到了一个让所有工程师倒吸凉气的数据：`print.ts` 文件总计 5,594 行，其中一个单独的函数就有 **3,167 行**，嵌套深度达到 12 层。

这不是一个可以用"技术债"轻描淡写的数字。3,167 行的函数意味着：没有人能不借助搜索完整理解这个函数在做什么；任何修改都有不可预测的副作用；单元测试几乎无法覆盖所有分支。

但更有趣的是 Engineer's Codex 的另一个发现：代码中充满了**写给 AI 而不是人类的注释**。「LLM-oriented comments throughout, written for AI agents not humans.」这意味着 Claude Code 的代码库本身就是被 AI 辅助编写和维护的——它在用自己来开发自己。

Gartner 的判断在这里找到了注脚：Claude Code 的源码被评估为 **90% 由 AI 生成**，这在美国版权法下意味着大部分代码可能不受 IP 保护。这个法律灰区对 Anthropic 的影响尚不明确，但它指向了一个行业级问题：**当 AI 工具开发 AI 工具时，代码的知识产权归属需要新的法律框架。**

![遥测三通道](material/pngs/05_遥测三通道.png)

源码还揭示了完整的遥测架构：Datadog（实时监控）+ BigQuery（数据分析）+ GrowthBook（A/B 测试），三个通道覆盖了从系统健康到用户行为到功能实验的全链路。这不意外——任何成熟的 SaaS 产品都有类似架构——但它确认了 Claude Code 不只是一个工程项目，而是一个被严肃运营的商业产品，有完整的数据驱动决策体系。

## 护城河评估：被削弱的和没被动摇的

最后回到核心问题：源码泄露后，Claude Code 的竞争优势还在吗？

![护城河矩阵](material/pngs/07_护城河矩阵.png)

**被削弱的：**

- **安全架构的隐蔽性**。四道安全门的具体实现、分类器的判断逻辑、熔断阈值——这些以前是黑箱，现在是白箱。攻击者的试错成本大幅降低。
- **未发布功能的先发优势**。KAIROS、Buddy 的设计思路被公开，竞品可以提前布局类似功能。
- **代码实现的独占性**。竞品工程师可以直接参考 QueryEngine、Snip、权限系统的实现方式。

**没被动摇的：**

- **工程判断力**。知道"怎么做"不等于知道"为什么这么做"。六层架构中的每一个设计取舍——为什么单线程不用 Swarm、为什么全栈自研不用 LangChain、为什么 6 级权限不是 3 级——这些判断力存在于团队的认知中，不在源码里。
- **模型-工具协同调优**。Claude Code 的工具描述、Prompt 模板、参数默认值，都是针对 Claude 模型特性调优的结果。即使竞品拿到了代码，换一个模型底座（GPT、Gemini），同样的架构不会有同样的效果。
- **迭代速度**。源码是某个时间点的快照。以 Anthropic 当前的迭代速度（v2.1.88 本身就说明了版本推进的频率），公开的代码很快就会过时。
- **92% 缓存复用率**。这个数据背后是 prompt engineering 和缓存策略的长期打磨，不是看了代码就能复制的。

APIYI 的分析做了一个类比：Claude Code 源码泄露之于 AI 编码工具行业，就像 Android 开源之于移动行业——代码公开推动了整个生态进步，但 Google 通过掌控 GMS 和 Play Store 始终保持了核心控制力。

这个类比有启发性但不完全对。Android 的开源是主动的战略选择，Claude Code 的泄露是被动事故。但结果可能殊途同归：行业整体的工程水平会因为这次泄露而提高，但 Anthropic 的优势会从"我有而你没有"转向"我做得比你好"。

这里不妨给出一个更凝练的判断——称之为 **「护城河迁移」**。源码泄露把 Claude Code 的护城河从"代码壁垒"迁移到了"能力壁垒"。代码壁垒是静态的、可复制的；能力壁垒是动态的、需要持续投入的。从长期看，这反而可能是更健康的竞争态势。

## 对 AI 从业者和实践者意味着什么

三条可执行的判断：

**第一，harness > model 已被实证。** 如果你在做 AI 编码工具或任何 AI 辅助产品，这 512,000 行代码最大的启示不是"Anthropic 好厉害"，而是：**围绕模型的工程体系决定产品天花板**。模型能力是基础设施（infrastructure），工程体系才是产品（product）。这对技术选型的启示是：与其花时间对比哪个模型 benchmark 高 2%，不如花时间打磨你的 Agent loop、安全机制和上下文管理。

**第二，供应链安全需要从"做了"升级到"持续做"。** Anthropic 不是没有安全意识——恰恰相反，他们的产品安全架构是行业标杆。但发布流程的安全检查漏了。这说明产品安全和发布安全是两个独立的问题，不能用同一套团队和流程覆盖。对于任何通过 npm/PyPI/Docker 分发的 AI 产品，source map、env 文件、内部配置的排除检查应该是 CI/CD 的必选项，不是可选项。

**第三，AI 生成代码的 IP 归属是悬而未决的风险。** Gartner 对 Claude Code 源码 90% AI 生成的评估，加上目前美国版权法对 AI 生成内容的暧昧态度，意味着依赖 AI 大量生成核心代码的团队需要评估法律风险。至少在法律框架明确之前，关键的架构决策和核心算法应该保留人工编写的记录。

---

## 本期关键词

**Source Map** —— JavaScript 构建工具生成的映射文件，用来把压缩混淆后的代码还原成原始源码。本来只在开发调试时用，正式发布包不应该包含。Claude Code 两次泄露都是因为 source map 被意外打包进了 npm 分发包。

**Harness** —— 直译是"马具"，在 AI 工程语境里指围绕 LLM 模型构建的整套工程体系——包括 prompt 管理、工具调度、上下文压缩、安全机制、缓存策略等。Claude Code 的源码证明了 harness 的复杂度和重要性远超模型本身。

**Agent Loop** —— AI Agent 的核心执行循环：接收指令 → 思考 → 选择工具 → 执行 → 观察结果 → 决定下一步。Claude Code 选择了单线程 Agent Loop 而非多 Agent 协作（Swarm），赌的是单一强模型比多个弱模型协调更可靠。

**Feature Flag** —— 代码中的功能开关，允许在不部署新版本的情况下开启或关闭特定功能。Claude Code 源码中发现了 44 个 Feature Flags，揭示了大量未发布功能。

**Anti-Distillation** —— 防蒸馏。蒸馏是用大模型的输出训练小模型的技术。Anti-Distillation 是反制措施——Claude Code 的 fake_tools 机制会在检测到输出被用于训练竞品时注入虚假数据，污染训练集。

**Loudnorm** —— 音频响度标准化处理，确保播客/视频在不同设备和平台上听起来音量一致。-16 LUFS 是播客行业的通用标准。（此词与源码无关，但出现在本系列的播客产出管线中。）

## 引用

1. [CyberNews: Anthropic Claude Code Source Leak](https://cybernews.com/security/anthropic-claude-code-source-leak/) —— GitHub 镜像数据（30K stars/40K forks）
2. [VentureBeat: Claude Code 512,000-Line Source Leak](https://venturebeat.com/security/claude-code-512000-line-source-leak-attack-paths-audit-security-leaders) —— GitGuardian 密钥泄露率、Gartner AI 生成比例评估
3. [Engineer's Codex: Diving into Claude Code's Source Code](https://read.engineerscodex.com/p/diving-into-claude-codes-source-code) —— print.ts 3167 行函数、Buddy 系统细节、LLM 导向注释
4. [dev.to - Varshith Hegde: Accident, Incompetence, or Best PR Stunt?](https://dev.to/varshithvhegde/the-great-claude-code-leak-of-2026-accident-incompetence-or-the-best-pr-stunt-in-ai-history-3igm) —— Bun bug 20 天未修、愚人节时机质疑
5. [The Guardian: Anthropic's Claude Code Leaks](https://www.theguardian.com/technology/2026/apr/01/anthropic-claudes-code-leaks-ai) —— Anthropic 官方确认「human error」
6. [Zscaler ThreatLabz: Claude Code Leak Analysis](https://www.zscaler.com/blogs/security-research/anthropic-claude-code-leak) —— CVE 漏洞信息、axios 供应链攻击并发
7. [Randal Olson: Claude Code Leak - Four Charts](https://www.randalolson.com/2026/04/02/claude-code-leak-four-charts/) —— 40 工具模块/184 文件/50,800 行统计
8. [APIYI: Impact on AI Agent Industry](https://help.apiyi.com/en/claude-code-source-leak-march-2026-impact-ai-agent-industry-en.html) —— Android 类比分析
9. [PromptLayer: Behind the Scenes of the Master Agent Loop](https://blog.promptlayer.com/claude-code-behind-the-scenes-of-the-master-agent-loop/) —— QueryEngine 单线程 Agent Loop 分析
10. [LMCache: Context Engineering Reuse Pattern](https://blog.lmcache.ai/en/2025/12/23/context-engineering-reuse-pattern-under-the-hood-of-claude-code/) —— 92% 缓存复用率数据
