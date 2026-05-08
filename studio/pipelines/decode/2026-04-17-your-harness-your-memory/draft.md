---
title: Your Harness, Your Memory：AI 时代的主权让渡之战
source:
  - https://x.com/hwchase17/status/2042978500567609738
  - https://x.com/sarahwooders/status/2040121230473457921
author: Harrison Chase (LangChain CEO) + Sarah Wooders (Letta CTO, MemGPT 作者)
date: 2026-04-11 / 2026-04-03
decoded: 2026-04-17
tags: [AI基础设施, Agent架构, Memory, Harness, LangChain, Letta, Anthropic, 平台战略]
---

![封面](material/pngs/00_系列封面.png)

## 0. 先看这条时间线

- **3 月 31 日**，Claude Code v2.1.88 npm 包一个 `.map` 文件没被 gitignore，51.2 万行 TypeScript 源码被人扒了出来。研究者发现 Anthropic 用三层索引+主题文件+grep 做 memory，被称作"Self-Healing Memory"。
- **4 月 2 日**，Letta 公开 Context Constitution——写给 agent 的"上下文宪法"，配套产品是 Letta Code（memory-first coding harness）。
- **4 月 3 日**，Sarah Wooders 发推《Why memory isn't a plugin (it's the harness)》。131K 阅读。
- **4 月 8 日**，Anthropic 在官方工程博客发《Scaling Managed Agents: Decoupling the Brain from the Hands》，同步发布 Claude Managed Agents 公测——把 agent 基础设施整体托管，按 $0.08/session-hour 收费。Notion、Asana、Rakuten、Sentry、Atlassian 首批客户。
- **4 月 10 日前后**（与 Harrison 长推同周），LangChain 发布 Deep Agents Deploy，博客标题一刀见血：**"an open alternative to Claude Managed Agents"**。
- **4 月 11 日**，Harrison Chase 发长推《Your Harness, Your Memory》。1.8M 阅读，3.8K 点赞。文末致谢 Sarah Wooders。

十二天里 6 个动作，两家公司一个立场。**这不是各自为战的技术博客，是 LangChain + Letta 对 Anthropic 发起的联合商业战，Harrison 那篇长推是炮兵观测员的开火信号。** 要读懂这两篇东西，先把它们当成营销物料，再当技术思辨。

![推文封面对比](screenshots/01_harrison_cover.jpg)

## 1. 两位作者，两家公司，一个立场

| 作者 | 职位 | 产品立场 | 本次动作 |
|------|------|---------|---------|
| Harrison Chase | LangChain CEO | 开源 agent 基础设施 | 推 Deep Agents Deploy |
| Sarah Wooders | Letta CTO（前 UC Berkeley + MIT，MemGPT 论文一作） | 开源 memory-first harness | 推 Context Constitution + Letta Code |

两个人都没资格说自己"中立观察"。但也恰恰因为他们在战场上，他们说的话比学术论文更值得看——**他们赌上了自己公司的存亡在推这个命题**。

Sarah 的 MemGPT 是 2023 年那篇 arxiv 论文的工程化版本，Letta 就是从 MemGPT 进化过来的。她本次发文的潜台词是："被你们当成 RAG 插件的东西，从一开始就不该这么理解。"

Harrison 是 Python AI 圈最高流量的创业者之一，LangChain 三年换过三次主架构（chains → LangGraph → Deep Agents），他对"harness 保质期"这个词有切肤之痛。

## 2. 核心命题：Agent Harness 不会消失

这是整套论述的第一块砖，也是反直觉的第一刀。

AI 圈 2024-2025 年有个主流观点：**模型会吸收 scaffolding**。意思是随着模型变强，原先需要外部代码做的事——规划、工具路由、上下文管理——会被模型内化。LangChain 这类基础设施公司会被"模型吸收"。

Harrison 的反驳证据很硬：

> "When Claude Code's source code was leaked, there was 512k lines of code. That code is the harness. Even the makers of the best model in the world are investing heavily in harnesses."

翻译：**"Claude Code 源码泄漏时，有 51.2 万行代码。那就是 harness。连做世界最好模型的人，都在疯狂投资 harness。"**

VentureBeat 和 WaveSpeed 的独立分析交叉验证了这个数字（约 1900 文件、>512K 行 TypeScript，核心 QueryEngine.ts 一个文件 4.6 万行）。Harrison 用这个数字要论证的不是"Anthropic 的工程量大"，而是**harness 的复杂度正在变得和模型本身一样重**。

他进一步给了一个微观证据：OpenAI 和 Anthropic API 里的 web search 功能，看起来是"模型能力"，**实际上是 API 后面一个轻量 harness 在做 tool calling**。"模型内置能力"这个叙事本身是营销话术，背后永远是一个系统在做编排。

![Harrison 的 Harness 架构图](screenshots/02_harrison_harness_diagram.png)

Harrison 承认："2023 年需要的那一类 scaffolding——简单 RAG chain——确实被模型吸收了。" 但新的 scaffolding 出现了：agent harness，比旧的更重、更复杂、更绑定业务逻辑。

这里藏着一个**反常识推论**：**模型每升级一次，harness 反而变得更重要，不是更轻。** 因为模型越强，能做的 agent 任务越复杂，harness 要管理的状态、工具、多 agent 协作、长期记忆也越多。Claude Code 的 51.2 万行就是这个推论的实物证据。

## 3. Sarah 的原创框架："Memory 不是插件，Memory 就是 harness"

这是全场最核心的一个概念重构。

过去三年，"Agent Memory"市场里涌现过一批初创公司——Mem0、Zep、Letta 早期版本、LangMem 等——他们都在做一件事：**把 memory 做成独立服务，通过 API 插到任意 agent 里**。Sarah 说这条路从根上就是错的。

她的原话是全文最精辟的一句：

> "Asking to plug memory into an agent harness is like asking to plug driving into a car. Managing context, and therefore memory, is a core capability and responsibility of the agent harness. If a harness isn't managing context, what is it doing?"

翻译：**"把 memory 插进 agent harness，就像把'开车'插进汽车里。管理 context、因此也就是管理 memory，本来就是 harness 的核心能力与责任。如果一个 harness 不管 context，那它在做什么？"**

为什么外部 memory plugin 不够？Sarah 列了 **7 个只有 harness 能回答的问题**：

1. AGENTS.md 或 CLAUDE.md 文件如何被加载进 context？
2. Skill 的 metadata 怎么展示给 agent？（放在 system prompt？还是 system message？）
3. Agent 能否修改自己的 system instructions？
4. Compaction（上下文压缩）发生时，什么留下、什么丢失？
5. 交互记录是否被存储、能否查询？
6. Memory metadata 以什么形式呈现给 agent？
7. 当前工作目录如何被表达？文件系统暴露多少？

**每一个问题都是 harness 在做决策，而且决策链互相耦合——你不可能替换其中一个而不影响其他。** 所谓"独立 memory 服务"只能处理这 7 个问题之外的残渣（比如跨 session 的事实存取），而那部分其实用 `grep` 就够了（Letta 自己的 benchmark 显示 RAG 相比 grep 优势不大）。

![Sarah 的 Memory=Harness 框架](screenshots/07_sarah_cover.jpg)

`★ Insight ─────────────────────────────────────`
这个概念重构的商业含义极大：**"memory 赛道"其实不存在**，存在的是"harness 赛道"。Mem0 这种公司做的事最多只能是辅助层，核心话语权在 harness 那边。这也解释了为什么 LangChain 和 Letta 要同期发声——两家本质都在做 harness，都不想让 memory 被看作可以外采的组件。
`─────────────────────────────────────────────────`

## 4. Harrison 的三级风险阶梯：Lock-in 的解剖

Sarah 把概念建立起来了，Harrison 负责把它"武器化"成一张给 CTO 看的风险评估图。

| 级别 | 场景 | 代价 |
|------|------|------|
| **轻度坏** | 用 OpenAI Responses API / Anthropic server-side compaction。状态在对方服务器。 | 想换模型续会话？不行。想导出历史做分析？看 API 开放程度。 |
| **坏** | 用 Claude Agent SDK（底层是闭源的 Claude Code）。harness 如何读写 memory 是黑盒。 | 你不知道 agent 到底怎么记东西，也不知道怎么把记忆迁移到别的 harness。 |
| **最坏** | Anthropic Managed Agents——整个 harness + long-term memory 都在 API 后。 | 零可见、零控制、零迁移。你的 agent 和用户磨合出的所有模式，都是 Anthropic 的资产。 |

Harrison 的原话："**这就是人们说'模型会吸收 harness'时真正的意思——memory 相关的部分会全部搬到 API 后面。**"

![Harrison 的三级 lock-in 图](screenshots/05_harrison_closed_harness.jpg)
![完整锁定场景](screenshots/06_harrison_api_lockin.jpg)

VentureBeat 在独立报道里给了一个直接的引用，把这个命题坐实了：

> "Session data is stored in a database managed by Anthropic, increasing the risk that enterprises become locked into a system run by a single company."

翻译：**"Session 数据存在 Anthropic 管理的数据库里，增加了企业被锁定到单一厂商系统的风险。"**

这句话不是 LangChain 说的，是主流科技媒体说的。说明 Harrison 指出的风险不是自家推销话术，而是企业 IT 决策者已经感知到的真实担忧。Claude Managed Agents 的发布文档里能看到，Memory Store 限制是 100KB/条、8 个 store/session——这个架构本身就不鼓励你把 memory 存在别处。

## 5. 一个原创概念：状态锁定（Stateful Lock-in）

综合两篇文章，有一个现象值得单独命名，这也是本次拆解的原创提法：

**状态锁定（Stateful Lock-in）**——**模型时代的切换成本低，因为 API 是 stateless 的；Agent 时代的切换成本断崖式上涨，因为 memory 是 stateful 的。** 前者是"换个品牌的 USB 线"，后者是"换个银行户头"。

过去两年 LLM 市场的切换频率之高，说明了 stateless API 有多脆弱。企业从 OpenAI 迁到 Anthropic 用了几周，从 Anthropic 迁到开源模型也就几个月。Harrison 说得很坦白：**"It's been relatively easy to switch model providers to date. They have similar, if not identical, APIs."**

但 memory 一旦进场，切换成本的性质就变了。它不是"代码重写"这种可以估算的工程成本，是"agent 和用户磨合出的模式"这种无法用工时估值的资产——Harrison 亲历了这件事：

> "我的邮件助手基于 Fleet 模板搭了几个月，累积了很多 memory。前几周误删了，我气疯了。用同样的模板重建后，体验差了一大截——我得从头教它我的偏好、语气、一切。"

这是一个典型的**经验难以言说**的资产。你问用户"你的 agent 现在比刚用的时候好在哪里？"——他答不上来，但他知道差很多。这种无法显式表达、只能在交互中体现的资产，就是**状态锁定**的真正重量。

![状态锁定的商业含义](screenshots/04_harrison_stateful_api.jpg)

## 6. 开源派的反击矩阵

理解了命题本身，就能理解这场协同的商业操作：

| 公司 | 同期动作 | 目标 |
|------|---------|------|
| **Letta** | Context Constitution（4/2）+ Letta Code 推广 | 把 memory-first harness 立为原则 |
| **LangChain** | Deep Agents Deploy（约 4/10）+ Harrison 长推（4/11） | 把 Deep Agents 推为开源替代品 |
| 两家联动 | Harrison 推文第 2 章专门引用 Sarah 博客 | 构建"开源派共识"叙事 |

LangChain 博客《Deep Agents Deploy: an open alternative to Claude Managed Agents》里的这段话，和 Harrison 长推几乎是一字不差的双语版：

> "Harnesses are intimately tied to memory, which means that by choosing an open harness you are choosing to own your memory, and not have it be locked into a proprietary harness or tied to a single model."

翻译：**"Harness 与 memory 紧密绑定，选择开源 harness 就是在选择拥有自己的 memory，而不是被锁进专有 harness 或绑在单一模型上。"**

Deep Agents Deploy 用开放标准（[agents.md](https://agents.md/)、[skills](https://agentskills.io/home)、MCP、A2A、Agent Protocol）、支持 Mongo/Postgres/Redis 作为 memory store、支持自托管 LangSmith Deployment。每一个设计点都在对标 Managed Agents 并反着做。

Letta Code 则是 memory-first 的 CLI 工具——`npm install -g @letta-ai/letta-code`——对标的是 Claude Code。同一个产品形态，memory 从"隐式的黑盒"改成"git-backed filesystem + background memory subagent"的显式系统，让开发者看得见、碰得着。

**这是典型的"议题设置先行，产品落地跟上"的营销范式。** 先把 harness-memory 绑定的叙事立起来，再把自家产品做成这个叙事的最佳载体。

## 7. 盲区：Harrison 没说出来的话

但这是一场战争，战争里有视角差。Harrison 的文章有两个重要盲区。

**盲区一：开源 harness 也有 lock-in，只是换了一种形式。**

Deep Agents 有 deepagents.toml、专用的 AGENTS.md 结构、LangSmith 部署生态。Letta Code 有 .af 文件格式、memory block 结构、Context Constitution 规范。这些都是**生态锁定**，比 API 锁定弱，但不是零。一个团队用 LangGraph 三年后想迁到纯 Python agent，同样要重写半个业务系统。

LangChain 自己这几年也经历了 chains → LangGraph → Deep Agents 的架构换血。每次换血都有用户被甩下船。**"Harness 保质期"这个问题，Anthropic 有，LangChain 自己也有，而且可能比 Anthropic 更严重——因为 Anthropic 至少有模型迭代红利遮盖架构换血的阵痛。**

**盲区二：自托管 memory 的运维复杂度。**

Managed Agents 用户愿意付 $0.08/session-hour 的根本原因，不是贪懒，是**orchestration 负担压死了工程团队**。VentureBeat 另一段报道里承认：

> "Claude Managed Agents aims to organize that effort into a managed layer. Developers define tasks, tools and guardrails, while Anthropic handles execution, including orchestration, error recovery and context management."

对中小团队而言，自己维护 Postgres/Mongo/Redis 三件套存 memory、做版本控制、做多租户隔离、做备份恢复——这不是"加个数据库"的工作，是一整个平台工程团队的长期任务。**开源 harness 的"你拥有 memory"承诺，背后是"你要养得起 DevOps"的隐形条件。**

Harrison 在推文里没提这些。这是可以理解的——软文不讲自家短板。但读者要心里有数。

## 8. 对我们（中数智汇做数字员工的人）意味着什么

这篇拆解对 muming 当前在做的事有三条直接可执行的判断：

**判断 1：数字员工 MCP APP 的 memory 层必须抽到自己 DB。**

如果底层用 Claude Agent SDK 或 Managed Agents，三年后的所有客户对话数据、用户偏好、agent 个性化反馈，都是 Anthropic 的资产。现在看不出差别，三年后你想换模型、想导出数据做训练、想把 agent 卖给另一个客户做白标——全卡住。可执行 action：**把短期 memory（对话 state）留在 Anthropic，长期 memory（用户画像、行为偏好、历史决策）落自己的 PG**。接口层用 LangMem 这类抽象或直接自写。

**判断 2：企百科对话质量评估项目，对话历史 = memory，不能只从 Anthropic API 查。**

企百科正在做"对话质量评估面板"。如果面板依赖从 Anthropic conversation state 读历史，一旦需要聚合分析（比如"过去 30 天所有涉及股东查询的对话"），API 会慢到不可用，且成本线性放大。可执行 action：**落盘自己的 conversation 表结构，Anthropic 只作为实时调用通道**。面板基于自己的 DB 查询。

**判断 3：做 AI 产品，架构选型比模型选型重要 10 倍。**

模型可以每半年评估一次，今天用 Claude 明天用 Qwen3，成本和体验差异都是可衡量的。但 harness 一旦选定，业务积累就开始单向沉淀到那个架构里。**选型决策清单的优先级应该是：架构 > memory 策略 > 模型**，而不是反过来。中数智汇现在多个项目（企百科、数字员工、大禹）如果各自选型各自做，三年后会形成一堆互不兼容的 memory silos，横向复用基本不可能。

`★ Insight ─────────────────────────────────────`
对产品经理的核心启示：你过去五年做产品的脑子里有"前端+后端+数据库"这套结构。AI 产品时代要在这三层之外加一层 **memory architecture**——而且它不是数据库层的改名，它是一整个新的设计维度，决定了 agent 会不会随用户一起成长。这一层今天没做好，就是三年后的技术债 + 客户流失风险。
`─────────────────────────────────────────────────`

## 9. 本期关键词

**Agent Harness（智能体脚手架）** —— 包裹在 LLM 外面的控制循环：接收用户消息 → 调用模型 → 解析输出 → 路由工具调用 → 把结果回喂给模型。Claude Code 的 51.2 万行代码本质就是一个 harness。"模型内置能力"这个说法是营销话术，背后永远是一个系统在做编排。

**Memory-first Harness** —— Sarah 造的词：把 memory 作为一等公民设计的 harness，不是后期加插件。Letta Code 是标准样板。对应地，"memory-plugin"路线被她判了死刑。

**Managed Agents** —— Anthropic 2026 年 4 月推出的 agent PaaS。定义 agent 做什么交给你，怎么跑全交给 Anthropic。按 $0.08/session-hour 收费。Harrison 把它评为"最坏"级锁定。

**Compaction（上下文压缩）** —— 对话历史太长时压缩摘要的动作。谁来做、用什么算法、存哪里，直接决定 memory 命运。Anthropic server-side compaction 把这个权力握在自己手里。

**状态锁定（Stateful Lock-in）** —— 本次拆解的原创命名。模型时代 stateless API 切换容易，Agent 时代 memory 让切换成本断崖式上涨。是 Harrison 论述的隐藏核心。

**Context Constitution（上下文宪章）** —— Letta 2026 年 4 月发布的原则集，定义 agent 该如何管理 context/state。配合 Letta Code 推出，是 memory-first 路线的"立宪"动作。

**Data Flywheel（数据飞轮）** —— 用户用得越多，memory 越丰富，agent 越懂用户，用户越离不开。Memory 是飞轮的燃料，这也是为什么模型厂商想抢。

**AGENTS.md / CLAUDE.md** —— 开放标准（agents.md）。写给 agent 看的项目说明，类似 README 之于人。Deep Agents 的整个 memory 体系以 AGENTS.md 为中心组织。

## 10. 原文关键引用

> "If you use a closed harness, especially if its behind an API, you don't own your memory." —— Harrison Chase

> "Asking to plug memory into an agent harness is like asking to plug driving into a car." —— Sarah Wooders

> "Your proprietary dataset allows you to provide a differentiated and increasingly intelligent experience. ... Without memory, your agents are easily replicable by anyone who has access to the same tools." —— Harrison Chase

> "Session data is stored in a database managed by Anthropic, increasing the risk that enterprises become locked into a system run by a single company." —— VentureBeat 报道

## 11. 引用

1. [Harrison Chase - Your harness, your memory](https://x.com/hwchase17/status/2042978500567609738) —— 本期拆解原文
2. [Sarah Wooders - Why memory isn't a plugin](https://x.com/sarahwooders/status/2040121230473457921) —— 本期拆解原文
3. [LangChain Blog - Your harness, your memory](https://www.langchain.com/blog/your-harness-your-memory) —— Harrison 文章的博客版本
4. [LangChain Blog - Deep Agents Deploy: an open alternative to Claude Managed Agents](https://www.langchain.com/blog/deep-agents-deploy-an-open-alternative-to-claude-managed-agents) —— 配套产品发布
5. [Letta - Context Constitution](https://www.letta.com/blog/context-constitution) —— Sarah 同期推出的配套"宪法"
6. [Anthropic - Scaling Managed Agents: Decoupling the Brain from the Hands](https://www.anthropic.com/engineering/managed-agents) —— 本次被攻击的靶子
7. [VentureBeat - Claude Managed Agents raises vendor lock-in risk](https://venturebeat.com/orchestration/anthropics-claude-managed-agents-gives-enterprises-a-new-one-stop-shop-but) —— 主流媒体交叉验证锁定风险
8. [The Register - Anthropic will let your agents sleep on its couch](https://www.theregister.com/2026/04/09/anthropic_offers_to_host_ai/) —— 英国媒体戏谑报道
9. [DataCenterKnowledge - Anthropic Targets Data Center Bottleneck](https://www.datacenterknowledge.com/data-center-software/anthropic-targets-ai-data-center-bottleneck-with-claude-managed-agents) —— 客户名单
10. [VentureBeat - Claude Code source code appears to have leaked](https://venturebeat.com/technology/claude-codes-source-code-appears-to-have-leaked-heres-what-we-know) —— 51.2 万行代码的源头
11. [[2026-04-09-managed-agents-architecture]] —— 本 vault 对 Managed Agents 的独立拆解，已命名"Harness 保质期"、"脑手分离"、"调度税"概念

---

**总结判断：** 这场由 Harrison 和 Sarah 发起的"主权让渡之战"，本质是**开源 agent 基础设施派向模型厂商开的第一枪**。枪声响在 Managed Agents 发布后的一周内不是巧合。对做 AI 产品的人而言，这不是站队投票，是架构决策：今天你的 agent 把 memory 存在谁家服务器、用谁家格式、被谁家 harness 读写，决定了三年后你的业务资产归谁。
