---
title: Vercel 开源了 eve——但"开源"和"离不开它"，是同一枚硬币的两面
type: published
created: 2026-06-22
updated: 2026-06-22
style: default
voice: doubao-shuangkuaisisi
tags: [Vercel, eve, AI智能体框架, 开源, 文件系统优先, Apache-2.0, Mastra, 锁定]
---

# Vercel 开源了 eve——但"开源"和"离不开它"，是同一枚硬币的两面

**本期关键词:文件系统优先 / 目录即配置 / 开源与锁定是同一枚硬币**

2026 年 6 月 17 日，做网页部署起家的云平台 Vercel（前端框架 Next.js 就是它家的）在伦敦的发布会上开源了一个 AI 智能体框架，名字全小写，叫 **eve**。它的设计很反直觉:**把一个 AI 智能体（agent，能自己干活的程序）就当成你电脑硬盘上的一个文件夹**——文件叫什么名、放在哪个子目录，就决定了这个 agent 是什么、会做什么，不用额外写注册代码。

新闻通稿都在夸它"文件系统优先"多优雅、内部跑了上百个 agent 多能打。但这篇要讲的判断不在那:**eve 真正值得琢磨的，是它把"开源"和"离不开 Vercel"打包成了同一笔交易。** 代码是真开源（Apache-2.0 许可），可让那几个漂亮数字成立的核心部件，恰恰是你搬不走的。先从"agent 框架到底解决什么"讲起。

---

## 第零步:先把"agent 框架"这四个字讲清

要懂 eve 的新，先得知道"以前做一个能干活的 agent 有多麻烦"。

你把它想成**装修房子**:以前做 agent，像拿到一套毛坯房——你得自己买水管电线（拼一堆零散的工具库:管模型、管记忆、管监控、管"崩了能续上"……），一根根接起来，费时还容易接错。**所谓"框架"，就是精装样板间**:水电管线都预埋好了，你只管摆家具（写你的业务逻辑）。

eve 就属于"精装"这一类，而且它主打一点:**精装的同时，连"生产级能力"也帮你配齐了**（后面第二步细讲）。Vercel 给它的自我定位是一句话——"Next.js for agents"（agent 界的 Next.js）。Next.js 当年让"做网页"有了一套现成脚手架，eve 想让"做 agent"也这样。一个提醒:它现在是**公开测试版（public beta），不是正式版**，尝鲜可以，上生产要留个心眼。

---

## 第一步:一个 agent 就是一个文件夹

eve 最反直觉、也最核心的设计，官方一句话:

> "A file's name and place in the tree are its definition."
>
> （一个文件的名字、以及它在目录树里的位置，就是它的定义。）
>
> 来源:Vercel Blog（Introducing eve），2026-06-17，https://vercel.com/blog/introducing-eve

翻成人话:你不用写代码去"声明"这个 agent 有什么能力，而是**靠文件叫什么名、放在哪个文件夹，来决定它是什么**。GitHub 仓库对它的定义是:"eve is a filesystem-first framework for durable AI agents. Core agent capabilities live in conventional locations."（eve 是一个面向持久化 AI agent 的"文件系统优先"框架，核心能力都放在约定好的固定位置。）

你把它想成**整理书桌**:你不用写张说明书告诉别人"这是笔筒"——把笔插进那个筒、放在桌角，它就是笔筒。在 eve 里，放一个文件决定"用哪个模型"，放一个文件夹决定"它能调哪些工具""会哪些技能""住在哪个聊天软件里""连哪些外部服务"。约定好位置，放对就生效。

这个设计的好处官方也点了:项目因此"easier to inspect, extend, and operate"（更容易检查、扩展和运维）——因为一切都摊在文件夹里，看得见、改得动，不藏在代码深处。

---

## 第二步:一整套"开箱即用"的生产能力

光有优雅的目录不值钱，真正值钱的是 eve 把一堆"上生产才需要、自己拼很痛苦"的能力做成了内置。挑几个关键的，用大白话讲:

- **持久执行:** agent 干活的每一步都像游戏存档，中途崩了或重新部署，能从断点接着干，不用从头来。
- **沙箱:** 给 agent 一个隔离的小黑屋去跑它自己生成的代码，把这些代码当"不可信"的关起来，伤不到正经系统。
- **人机审批:** 某些关键动作设成"必须人点头才能做"，agent 走到那一步就停下等人，等多久都行、等待时不烧算力。
- **安全连接:** 这点很妙。官方说"A connection is a file pointing at an MCP server or an OpenAPI-compatible API. eve brokers the auth, and the model never sees the URL or credentials."（一个"连接"就是一个指向 MCP 服务器或 OpenAPI 接口的文件，由 eve 替你管鉴权，模型永远看不到网址和密码。）——**等于 eve 当了个保管密码的管家。**（MCP 是让 AI 连外部工具的一种"标准插头"协议。）
- **多通道:** 同一个 agent 能同时上多个地方。这里要纠正一个常见的少报——不只是 Slack/Discord/Teams 三个，完整清单是 **HTTP 接口（默认开）外加 Slack、Discord、Teams、Telegram、Twilio、GitHub、Linear**。
- **追踪评估:** 每次运行都按业界通用标准（OpenTelemetry，相当于给程序装行车记录仪）留下轨迹，能导出到 Datadog 这类监控平台复盘。

你把它想成**外卖平台的后厨**:你只管出菜谱（写指令），冷链、保温箱、骑手、监控摄像头，平台都给你配好了。

---

## 第三步:三个数字背后的真 agent

eve 不是 demo，Vercel 用自家的真实使用来自证。官方说:"We run more than a hundred agents in production at Vercel."（我们在 Vercel 的生产环境里跑着超过一百个 agent。）其中三个最有说服力:

- **d0(数据分析 agent):** 官方原话"The most-used internal tool at Vercel is an agent, handling more than 30,000 questions a month."（Vercel 内部使用最频繁的工具就是一个 agent，每月处理超过 3 万个**问题**。）注意是"问题"不是"查询"。
- **Lead Agent(自动销售):** 把顶尖销售的打法全天候自动跑。官方给了一组很狠的账:"It costs about $5,000 a year to run, returns 32 times that, and one engineer maintains it part-time."（一年运行成本约 5000 美元，回报是这个数字的 32 倍，且只需一名工程师兼职维护。）——最后那句"一名工程师兼职"，比"32 倍"更能说明问题。
- **Vertex(客服 agent):** "solving 92% of tickets on its own and escalating the rest to the support team."（自主解决 92% 的工单，剩下的升级给支持团队。）

> "eve is the framework that we build and run our own agents on."
>
> （eve 就是我们用来构建和运行自己 agent 的那个框架。）
>
> 来源:Vercel Blog，2026-06-17，https://vercel.com/blog/introducing-eve

这就是"吃自己的狗粮"——把内部跑了上百个 agent 攒下的经验，压缩成一套框架对外开源。**这三个数字是 eve 最强的卖点。但记住它们，因为下一章要揭一个被这三个数字盖住的真相。**

---

## 第四步:放进货架——eve 和别人差在哪

把 eve 放进 agent 框架的货架上比一比，位置就清楚了:

- 对照 **LangChain/LangGraph:** 业界最成熟，但偏 Python;eve 是 TypeScript 优先、走"目录即配置"。两者都主打持久执行，但 LangGraph 能自己部署在任何地方。
- 对照 **OpenAI Agents SDK:** 那是个极简的轻量工具，绑 OpenAI 的模型;eve 是"重型生产全家桶"。
- 对照 **Mastra（最直接的对手）:** 同样是 TypeScript、同样"电池全配齐"，但 Mastra **平台无关、可以自己托管**;eve 默认且实质绑定 Vercel。

你把它想成**选车**:LangGraph 像能改装、能上任何路的老炮;OpenAI SDK 像买菜小车;Mastra 像能去任何地方的越野车;**eve 像一辆只在自家高速上跑得最快、但开不下高速的电车。** 这个"开不下高速"，就是下一章的题眼。

---

## 第五步:开源与锁定，是同一枚硬币

这是全篇的落点，也是通稿不会强调、但你最该知道的一点。

eve 的代码确实是 Apache-2.0 开源的——这是真的，不是噱头。**但"开源的代码"和"让那三个数字成立的东西"，是两回事。** 让 Lead Agent 崩了能续、让 Vertex 7×24 跑、让 agent 在沙箱里安全跑代码的那套**持久运行时、沙箱、模型网关，全是 Vercel 专有的，无法自己托管。** 有对比评测把话挑明了:在主流 agent 框架里，eve 是**唯一一个你无法自托管的**——Apache-2.0 只允许你把目录约定和 SDK 那层代码搬走，但每一项生产能力，都得用 Vercel 平台的等价物来替换。

换句话说:**你拿到的"开源"，是"目录约定 + SDK";真正让它跑起来、跑得稳的那部分，锁在 Vercel 云上。** 官方 changelog 自己也说了句大实话:"An agent is an ordinary Vercel project."（一个 agent 就是一个普通的 Vercel 项目。）

你把它想成**健身房的年卡**:器材免费随便用（开源代码），但你只能在这一家店练，搬家就带不走（运行时锁定）。开源和锁定，在这里不是矛盾，是同一枚硬币的正反面。

---

## 对从业者意味着什么

1. **想用 eve 的人，先问自己一个问题:你愿意为"最短的 idea→上线路径"，付出"以后搬家难"的代价吗?** 如果你已经在用 Vercel、追求最快把 agent 跑起来，eve 的体验大概率是同类里最顺的——但要清醒地知道你在签一张"年卡"。如果你怕被锁定、要能随处部署，那 **Mastra（可自托管、同为 TypeScript）或 LangGraph** 是更该看的选项。

2. **这其实是"当年 Next.js + Vercel 那笔交易"的 agent 版。** Vercel 的一贯打法就是:把开发体验做到极致顺滑，用"省时间"换"你长在它的平台上"。当年锁的是你的网站，这次锁的是你的 agent。**认得出这个套路，比纠结"eve 好不好用"更重要**——好不好用几乎不用问，Vercel 的东西向来好用;要问的是退出成本。

3. **对所有人的通用提醒:看到"开源"二字，别停在许可证。** 真正决定你自由度的，不是代码挂的是不是 Apache-2.0，而是"让它跑起来的关键部件，你能不能自己拿到、自己托管"。eve 是个教科书级的例子:**许可证开放 ≠ 你能独立运行。** 下次评估任何"开源 AI 工具"，把这句话当第一道筛子。

---

## 引用与信源

1. Vercel Blog:Introducing eve（"文件名与位置即定义"、上百个 agent、d0/Lead Agent/Vertex 三组数字）（2026-06-17）:https://vercel.com/blog/introducing-eve
2. vercel/eve GitHub 仓库（"文件系统优先"定义、Apache-2.0、npm 包名 eve）:https://github.com/vercel/eve
3. Vercel Changelog:Introducing eve（"agent 就是一个普通的 Vercel 项目"、公开 beta）（2026-06-17）:https://vercel.com/changelog/introducing-eve-an-open-source-agent-framework
4. MarkTechPost:Vercel releases eve（连接机制 MCP/OpenAPI、代理鉴权、完整通道清单、OpenTelemetry 导出目标）（2026-06-17）:https://www.marktechpost.com/2026/06/17/vercel-releases-eve/
5. Speakeasy:AI agent framework 对比（eve 是唯一无法自托管的框架，运行时/沙箱/模型网关专有）:https://www.speakeasy.com/blog/ai-agent-framework-comparison
6. The New Stack:Vercel 以"Next.js for agents"自我定位、把 agent 当目录:https://thenewstack.io/vercel-launches-eve-an-open-source-framework-that-treats-agents-as-directories/
