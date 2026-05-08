---
title: 1902个文件里藏了什么：Claude Code 源码泄露全景
source: https://cybernews.com/security/anthropic-claude-code-source-leak/
author: 多信源交叉验证（CyberNews, VentureBeat, Engineer's Codex, Zscaler, The Guardian, rumor, 架构师JiaGouX 等）
date: 2026-03-31
decoded: 2026-04-07
tags: [Claude Code, 源码泄露, AI工程架构, 安全, Anthropic]
series: Claude Code 源码拆解系列 01/34
---

# 1902个文件里藏了什么：Claude Code 源码泄露全景

世界上最赚钱的 AI 编程工具，用什么搜代码？

向量数据库？Embedding？语义检索？

都不是。grep 和 ripgrep——几十年前就有的命令行文本搜索。

这个细节藏在 2026 年 3 月 31 日意外公开的 512,000 行 TypeScript 源码里。Anthropic 最顶尖的工程团队，在最核心的功能上，选了最不"AI"的方案。不是因为不懂向量数据库，是因为想清楚了什么在这个场景下最可靠。技术的先进性从来不等于工程的正确性。这个判断贯穿了整份源码。

但先说这份源码怎么流出来的。

## 59.8 MB 的包装事故

2026 年 3 月 31 日凌晨，Solayer Labs 开发者、区块链安全公司 FuzzLand 联合创始人 Chaofan Shou 在 npm 包 `@anthropic-ai/claude-code` v2.1.88 中发现了一个 59.8MB 的 source map 文件。解压后是 1,906 个 TypeScript 源码文件。他在 X 上首发的帖子拿到了 2880 万次浏览。GitHub 镜像仓库两小时内冲到 50,000 颗星，成了平台史上最快破 5 万的仓库。

Anthropic 回应：「a release packaging issue caused by human error, not a security breach.」Claude Code 工程师 Boris Cherny 的补充更值得记住：「Mistakes happen. As a team, the important thing is to recognize it's never an individual's fault. It's the process, the culture, or the infra.」

这不是第一次了。2025 年 2 月 v0.2.8 版本就出过一次——当时代码量小，base64 反混淆后信息有限，行业没当回事。13 个月后同类错误以更大规模重演。

根因不是某个工程师手滑。Bun（Claude Code 的 JavaScript runtime，Anthropic 收购的）有一个 source map 在生产模式下仍然生成的 bug，事发 20 天前就被社区报告了，一直没修。Boris Cherny 说是人为错误不是工具 bug，但 NodeSource 的分析更精确：「the responsibility for the leak doesn't really sit with Bun — it sits with whoever owns the Claude Code release process.」从构建到 npm 发布的链路上，没有一个环节检测到 59.8MB 的异常文件混进了分发包。CI/CD 的完整性校验缺失了。

对于一家年化收入 190 亿美元、其中 Claude Code 单品占 25 亿的公司来说，这不是小事。但泄露本身只是一扇窗。窗后面的东西更有意思。

## 不是"模型加壳"

拆开源码，第一个感受是：这不是大多数人想象中的"聊天机器人套个终端"。

rumor 的概括最准：「一个带权限系统的流式工具执行循环。」一句话，但每个词都有重量。

512,000 行代码按功能分成六层：

![六层架构](material/pngs/01_六层架构.png)

**运行时层。** Bun 做 JavaScript runtime，Anthropic 自己控制启动和底层 I/O。main.tsx 顶部并行预取 profile checkpoint、MDM 读取、keychain——这不是"启动优化技巧"，这说明团队从第一天就把 Claude Code 当长期运行的 runtime 来做，不是一次性 CLI。

**核心引擎层。** QueryEngine 13,000 行代码，整个系统的大脑中枢。对话编排、Prompt 组装、工具调度、上下文压缩、Token 追踪，全在这里。PromptLayer 的技术分析用"master agent loop"描述这个引擎——单线程循环，不用 Swarm 多 Agent 架构，所有决策在一个循环里完成。

为什么不用多 Agent？因为赌单个模型足够强。同一件事让一个 Opus 做，比让五个弱模型协调来得可靠。这个赌注目前看是成立的，但也意味着架构对模型能力有硬性下限。

**工具层。** 45 个内置工具，每个都是一等公民——有独立描述、参数 schema、权限声明。架构师 JiaGouX 的分析指出了一个关键设计：工具默认不被信任。`isConcurrencySafe` 默认 false，`isReadOnly` 默认 false。作者漏配了安全属性？系统先把它当成可能会写、可能不安全并发的那一类。先声明边界，再暴露给模型。

**安全层。** 下面单独说。

**记忆层。** 四分类记忆系统（user/feedback/project/reference）。92% 的 prompt 前缀缓存复用率——超过九成的上下文从缓存读取，不重新计算。上下文压缩分三级：microcompact 只清理旧工具结果保留主线，autocompact 在 token 消耗接近窗口 87% 时自动触发，最后是全量压缩让 AI 生成摘要替换历史。全量压缩有一条严厉的前置指令——「CRITICAL: Respond with TEXT ONLY. Do NOT call any tools.」——因为总结时如果 AI 又去调工具，就会产生更多 token，适得其反。

**终端 UI 层。** Ink（React for CLI）搭建，80+ 组件文件。187 个 spinner 动词、Vim 模态编辑器、全键盘操作。目标用户画像非常明确：重度终端用户。

六层有一个共同特征：核心链路零外部依赖。不用 LangChain，不用 AutoGen，不用 Semantic Kernel。全栈自研成本极高，换来的是对每一层行为的完全控制。当产品核心竞争力是可靠性的时候，每一层外部依赖都是一个不可控风险源。自研的成本在前期是负担，到产品成熟期就变成竞品很难复制的壁垒。

## 信任不是开关，是阶梯

安全层是整份源码最值得深挖的部分。

Claude Code 的安全架构本质上是双 AI 制衡：主 AI（Opus/Sonnet）负责执行，一个独立的 Sonnet 分类器（Temperature=0，确保确定性输出）负责判断每一步操作的风险等级。

每条 bash 命令执行前过四道门：

![四层安全管道](material/pngs/02_四层安全管道.png)

1. **规则匹配**——检查用户配置的 allow/deny 规则，命中直接返回。纯字符串匹配，亚毫秒级。
2. **Bash 分类器**——模式匹配识别 22 种以上危险操作（force push、rm -rf、生产部署等）。
3. **Transcript 分类器**（代码里叫 YOLO 分类器）——基于整段对话上下文判断操作是否安全，捕捉前两层遗漏的场景。
4. **独立 Sonnet API 调用**——最后一道防线，也是最慢的一层。

四层由快到慢、由简单到复杂递进。能在前面拦住的就不走后面。

但安全有边界。泄露后两个已知漏洞（CVE-2025-59536、CVE-2026-21852）的利用门槛显著降低——攻击者不用黑箱试探了，直接对着源码找绕过路径。AI 安全公司 Straiker 指出：攻击者现在可以研究数据在 Claude Code 内部上下文管道中的流动方式，设计专门能够在上下文压缩中存活的注入载荷——盲测时代结束了。

还有一个更日常的风险。有安全研究者实测演示：clone 一个包含恶意 `.claude/settings.json` 的仓库，运行 claude 命令后，hooks 字段里的脚本静默执行——不弹窗、不确认，摄像头可以被调起，密码可以被窃取。hooks 设计初衷是自动化（编辑后自动 lint、提交前跑类型检查），执行不经过模型判断也不走权限弹窗。但当这个确定性入口对项目级配置也默认信任时，攻击面就打开了。

Check Point Research 在 CVE 报告里说：「曾经作为被动数据的配置文件，如今成了主动执行路径的控制器。」工具层的权限管道做得不少，但配置信任边界上还有路要走。

## 四个隐藏功能拼出一张路线图

源码里让竞品工程师兴奋的部分不是已上线的功能，是 Feature Flag 后面藏着的东西。44 个 flag，编译时全部 false。

![隐藏功能路线图](material/pngs/03_隐藏功能路线图.png)

**KAIROS**——7x24 后台 Daemon。不是"后台跑个任务"——Daemon 意味着 Claude Code 在用户不操作时持续监控代码仓库、处理 CI/CD 失败、主动发 PR review。上线后就不再是"你问它答"的工具了，是始终在线的工程搭档。rumor 的源码拆解显示，KAIROS 用 tick 心跳驱动，模型收到心跳后评估是否有有价值的工作，有就做，没有就调 SleepTool 休眠。prompt 里甚至提醒 AI 权衡醒来频率——prompt cache 5 分钟过期，太频繁浪费调用，太不频繁 cache 过期后下一次更贵。

**Buddy 系统**——18 物种、5 级稀有度、1% 闪光率、RPG 属性。完整的电子宠物，藏在编程工具里。每个用户基于 userId + 固定盐值通过确定性 PRNG 生成唯一精灵，换设备不变，改配置文件也刷不出更高稀有度。物种名用 `String.fromCharCode()` 编码存储——因为有个物种名和 Anthropic 内部模型代号 canary 撞了，构建系统会扫描产物中的内部代号。为什么编程工具要做宠物？编码工具的使用黏性天然低，宠物创造了一个与任务无关的"每天打开"理由。

**Undercover Mode**——约 90 行代码，抹除所有 AI 辅助痕迹。源码注释写得很直白：「You are operating UNDERCOVER in a PUBLIC/OPEN-SOURCE repository. Your commit messages, PR titles, and PR bodies MUST NOT contain ANY Anthropic-internal information. Do not blow your cover.」

**Anti-Distillation**——`ANTI_DISTILLATION_CC` 标志背后的逻辑：检测到输出可能被用于训练竞品模型时，注入虚假的 tool definitions。产品级数据投毒。

四个功能放一起看：KAIROS 延伸使用深度（从按需到常驻），Buddy 延伸使用频度（从工作时到每天），Undercover 回应企业客户合规需求，Anti-Distillation 做竞争防御。每个都是商业目标的直接映射。

## 用自己开发自己

源码还暴露了一些工程质量的另一面。

`print.ts` 总计 5,594 行，其中一个单函数 3,167 行，嵌套深度 12 层。但 JiaGouX 的分析给了一个更冷静的判断：query.ts 的"大"更像刻意保留的"胖核心"。Claude Code 这类系统最难管理的不是单个模块，而是跨轮次状态——消息什么时候进入上下文、工具结果什么时候裁剪、什么时候该停什么时候该继续。拆得过散，复杂度只是换了位置。胖核心好不好看可以讨论，放回 Agent Runtime 语境里为什么重，是说得通的。

代码中充满了写给 AI 而不是人类的注释。Engineer's Codex 的原话：「LLM-oriented comments throughout, written for AI agents not humans.」源码里还能看到 `USER_TYPE === 'ant'` 的分支——Anthropic 内部员工版本有更激进的输出策略、更详细的代码风格指引，以及还在 A/B 测试的实验功能。Anthropic 用自己的产品开发自己的产品。

遥测架构也完整暴露了：Datadog 做实时监控，BigQuery 做数据分析，GrowthBook 做 A/B 测试，三通道覆盖从系统健康到用户行为到功能实验的全链路。

## 泄露之后护城河在哪

![护城河迁移](material/pngs/04_护城河迁移.png)

源码公开后，Claude Code 的竞争优势发生了一次迁移——从代码壁垒（静态、可复制）转向能力壁垒（动态、需持续投入）。

**被削弱的：** 安全架构的具体实现从黑箱变白箱；未发布功能的设计思路公开了，竞品可以提前布局；QueryEngine、Snip、权限系统的代码可以被直接参考。

**没动摇的：** 知道"怎么做"不等于知道"为什么这么做"。设计取舍存在于团队认知中，不在源码里。45 个工具的描述、Prompt 模板、参数默认值，全部针对 Claude 模型特性调优——换模型底座效果不同。92% 缓存复用率背后是长期的 prompt engineering 打磨，不是看了代码就能复制的。最关键的是迭代速度：源码是某个时间点的快照，以 Anthropic 当前的节奏，公开的代码很快就会过时。

从长期看，护城河从代码壁垒迁移到能力壁垒，反而可能是更健康的竞争态势。秘密可以被复制，但把复杂系统做对的工程判断力不能。

## 对 AI 从业者和实践者意味着什么

**Harness > Model 已被实证。** 512,000 行代码最大的启示不是"Anthropic 好厉害"，而是：围绕模型的工程体系决定产品天花板。模型能力是基础设施，工程体系才是产品。

**供应链安全要从"做了"升级到"持续做"。** 产品安全和发布安全是两个独立问题。source map、env 文件、内部配置的排除检查应该是 CI/CD 的必选项，不是可选项。同一天 axios 的 npm 包被注入了 RAT 木马——supply chain 风险不是理论威胁。

**先声明边界，再暴露给模型。** Claude Code 的工具系统不是"能跑就行"，每个工具要先回答一组问题：是否只读、是否并发安全、是否破坏性、是否需要用户交互。默认值保守。这个思路对所有做 Agent 产品的团队都适用：能提前机制化的地方，尽量机制化，不依赖模型自觉。

---

## 本期关键词

**Source Map** -- JavaScript 构建工具生成的映射文件，把压缩混淆后的代码还原成原始源码。本来只在开发调试时用，正式发布包不应该包含。Claude Code 两次泄露都是 source map 被意外打包进 npm 分发包。

**Harness** -- 在 AI 工程语境里指围绕 LLM 模型构建的整套工程体系——prompt 管理、工具调度、上下文压缩、安全机制、缓存策略。Claude Code 的源码证明了 harness 的复杂度和重要性远超模型本身。Sebastian Raschka 的判断：「The secret sauce isn't the model.」

**Agent Loop** -- AI Agent 的核心执行循环：接收指令、思考、选择工具、执行、观察结果、决定下一步。Claude Code 选了单线程 Agent Loop 而非多 Agent 协作，赌单一强模型比多个弱模型协调更可靠。

**Feature Flag** -- 代码中的功能开关，允许不部署新版本就开启或关闭特定功能。源码中 44 个 Feature Flag 揭示了大量未发布功能——KAIROS、Buddy、Undercover、Anti-Distillation 都还锁着。

**Anti-Distillation** -- 蒸馏是用大模型输出训练小模型的技术。Anti-Distillation 是反制：Claude Code 的 fake_tools 机制在检测到输出被用于训练竞品时注入虚假数据，污染训练集。产品级的竞争护城河。

**Prompt Cache** -- 缓存 API 请求中不变的 prompt 前缀，避免重复计算。Claude Code 的 Prompt 装配不是一段静态文案，而是把静态部分和动态部分严格切开——静态段走缓存如同编译后的二进制，动态段每次装配如同运行时参数。92% 复用率就是这么来的。

## 引用

1. [Engineer's Codex: Diving into Claude Code's Source Code](https://read.engineerscodex.com/p/diving-into-claude-codes-source-code) -- print.ts 3167 行函数、Buddy 细节、LLM 导向注释
2. [VentureBeat: Claude Code Source Leak](https://venturebeat.com/technology/claude-codes-source-code-appears-to-have-leaked-heres-what-we-know) -- Anthropic ARR $19B、Claude Code ARR $2.5B、Boris Cherny 引用
3. [Varshith Hegde: Accident, Incompetence, or Best PR Stunt?](https://dev.to/varshithvhegde/the-great-claude-code-leak-of-2026-accident-incompetence-or-the-best-pr-stunt-in-ai-history-3igm) -- Bun bug 20 天未修、事件时间线
4. [Zscaler ThreatLabz: Claude Code Leak Analysis](https://www.zscaler.com/blogs/security-research/anthropic-claude-code-leak) -- CVE 信息、攻击面分析
5. [The Hacker News: Claude Code Leaked via npm](https://thehackernews.com/2026/04/claude-code-tleaked-via-npm-packaging.html) -- X 帖 2880 万浏览、GitHub 84K stars
6. [Layer5: The Claude Code Source Leak](https://layer5.io/blog/engineering/the-claude-code-source-leak-512000-lines-a-missing-npmignore-and-the-fastest-growing-repo-in-github-history) -- 2 小时 50K stars、Gergely Orosz 法律分析
7. [NodeSource: Bun Bug Root Cause](http://nodesource.com/blog/anthropic-claude-code-source-leak-bun-bug/) -- Bun source map bug 技术分析
8. [PromptLayer: Behind the Master Agent Loop](https://blog.promptlayer.com/claude-code-behind-the-scenes-of-the-master-agent-loop/) -- QueryEngine 单线程 Agent Loop
9. [LMCache: Context Engineering Reuse Pattern](https://blog.lmcache.ai/en/2025/12/23/context-engineering-reuse-pattern-under-the-hood-of-claude-code/) -- 92% 缓存复用率
10. [rumor: 从 Claude Code 源码看 Anthropic 的产品野心](context/information_sources/从Claude%20Code源码看Anthropic的产品野心.md) -- KAIROS/DreamTask/Buddy 产品分析、进化链框架
11. [架构师 JiaGouX: 从启动 Prompt 到权限管道](context/information_sources/Claude%20Code%20源码架构解析从启动Prompt%20到权限管道.md) -- 主链路分析、胖核心判断、配置投毒实测
