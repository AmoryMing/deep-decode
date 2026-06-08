---
title: "UI 不会消失，只是变成了可塑材料"
source: https://tomtunguz.com/plastic-user-interfaces
author: Tom Tunguz
date: 2026-05-22
type: decode
slug: 2026-05-25-tunguz-plastic-ui
---

# UI 不会消失，只是变成了可塑材料

Tom Tunguz 这周写了一篇短到只有十几段的博客，标题三个词：Plastic User Interfaces。Theory Ventures 创始合伙人，前 Redpoint，看 SaaS 投了二十年。他每次写得越短，越值得抓住——他不写综述，只把那个还没被命名的趋势先安一个词上去。

这次他要安的词是 **plastic**——可塑的、可捏的、塑料一样的。直译成"塑料界面"会丢掉关键意思。Tom 想说的是：SaaS 这两年喊的 **headless**（去掉前端、只留 API）并不是把 UI 砍掉，而是把"那个唯一的页面"砍掉。UI 没有死，它只是被加热软化，可以根据用户、设备、任务的不同被现场捏出新的形状。

![封面](assets/png/00_series_cover.png)

这篇博客本身判断密度不高，引用密度倒不小。它的价值不在论证，在命名。AI 时代 UI 这件事，Anthropic 在做 HTML artifact，Claude Code 在让模型直出可交互页面，AirBNB 的 Brian Chesky 在公开场合反复说 iMessage 那种纯文本界面卖不动机票，但中文圈一直缺一个把它们打包起来的词。Tom 把这个词补上了。

下面把这件事拆给中国 B 端 SaaS 的产品经理、设计师和服务采购方。

## 一、从 headless 到 plastic：UI 不是被砍掉，是被融化

Tom 开篇用了一个具体例子。Salesforce 已经 headless 了——销售人员可以通过 AI 更新他的 deal sheet（销售单），不需要再打开 salesforce.com。MCP（Model Context Protocol）让越来越多公司这么干。英语作为复杂系统的接口，是一项了不起的创新。

这是 Tom 自己 2023 年写的另一篇文章的延续。那篇叫《What If Every SaaS App Had an LLM》，论点是：HubSpot、Zendesk、Salesforce、Adobe 在发布"英语 API"——任何人写英语就能输入、得到答案。三年过去，这件事真的发生了，于是 Tom 写出了这一篇，问下一步：那 UI 呢？

按照 headless 的字面读法，UI 应该被砍掉——既然能用英语指挥系统，谁还要点按钮。但 Tom 引了两个反方证据：

> "想象一下用 iMessage 做所有事情——但事实上别的每一个 app 都有它自己独特的界面……做电商，你要的是非常丰富的用户界面。" —— Brian Chesky, AirBNB CEO

> "我要更丰富的可视化、颜色、图表，而且能轻松分享。我开始更喜欢 HTML 作为输出格式，而不是 Markdown，越来越看到 Claude Code 团队也这么用——这就是原因。" —— Thariq Shihipar, Claude Code 工程师

两段引言指向同一件事：当 AI 真的能为每个任务定制一个 UI，"只用文字"反而成了刻意的简陋。看邮件，AI 直接生成音频摘要；改营销文案，AI 给你一个交互式 web app；做明年预算，AI 给你一个带图表的交互式表格。

所以 Tom 的命名是这样：headless 不是斩首，而是让头变得可塑。"Headless systems don't decapitate the system; they enable many user interfaces."（无头系统不是把系统斩首，而是让一个系统拥有许多界面。）

![从 headless 到 plastic](assets/png/01_headless_to_plastic.png)

这件事的精确度高于"AI 生成 UI"这类提法。Plastic 强调的不是"UI 由 AI 写"，而是"UI 在使用现场被加工"。它可以被加热、捏出形状、用完冷却归档，也可以再次被加热改形。同一个销售人员，在车上要的是语音播报的摘要，在客户会议室里要的是可点击的 deal sheet 表格，在月底总结时要的是带图表的回顾页面——这三个 UI 是同一个 Salesforce 系统的三种"头"，它们之间不冲突，因为底层数据没动。

这恰好是 [[2026-05-09-html-agent-artifacts]] 那篇里讨论过的同一件事的更上游版本。当时 Thariq 在讨论 HTML 是不是 Markdown 的替代品，结论是：**Markdown 没死，只是退回到草稿层；HTML 抢走的，是"给人看的 Agent 输出界面"那一层**。Tom 这篇则把视角抬高了一格——不光 HTML，所有形态（音频、表格、图表、文本、3D 模型、AR）都在变 plastic。

## 二、Plastic UI 有两种形态：一次性脚手架 vs 半永久新头

Tom 在文章后半段加了一句关键判断，但他没展开：

> "Software systems need to decide which of these to keep over time & which are disposable; those newer semi-permanent artifacts will become the new heads."（软件系统需要决定哪些 UI 留下来、哪些是一次性的；那些半永久的新产物会变成新的头。）

这是整篇博客最值得抓的一句。它隐含一个分层，工厂里这几个月写过的相关概念可以拿来对齐：

第一种是 **一次性脚手架**。对应工厂概念页 [[html-artifact]]：Agent 为一个具体任务临时生成的工作界面。把 30 个 Linear ticket 拖成 Now/Next/Later/Cut 四列；做一个 feature flag 编辑器；给一份 PR 做一个带模块图的解说页。这些 UI 用完就丢，不进 git 仓库，不长期维护。它的价值不是成为产品的一部分，是把人类从一大段抽象文本拉回循环。

第二种是 **半永久新头**。这是 Tom 真正押注的部分。某些临时 UI 用着用着发现每周都在重新生成，结构稳定，操作模式重复，团队开始把它当成"非官方功能"用。这时它就从塑料状态冷却下来，变成一个新的、长期维护的界面入口。Tom 说软件系统的下一项核心能力，是判断什么时候该让它冷却、什么时候该让它再被融化。

![两种形态](assets/png/02_two_forms.png)

为什么这种分层重要？因为它直接对应 SaaS 公司的产品组织成本。今天一个 SaaS 团队为一个新功能立项要做 PRD、设计、开发、QA、发布、文档、培训，至少八周。Plastic UI 的世界里，前期的"探索性界面"由 AI 现场捏，不进官方产品；只有少数被高频使用、结构稳定下来的 UI 才走完整产品化流程。

这是个组织层面的范式转移。过去 PM 要在两条腿之间走平衡——做不做这个功能、做了多少人用。Plastic UI 之后这个判断变成可以观察的：先让 AI 现场捏，观察使用频次和稳定性，再决定要不要工程化。需求验证从"事前决策"变成"事后归纳"。

## 三、新护城河：harness + 知识库

Tom 在末尾给了软件公司一个新方向的提示：

> "This dynamic UI management is the future of software value: the harness to control the interface/ensure it's correct & the knowledge management to rationalize all the AI products over time as a context database & library of artifacts."（这种动态 UI 管理是软件价值的未来：用 harness 控制界面、确保它是正确的，加上知识管理把所有 AI 产物随时间整理成一个上下文数据库和产物库。）

这句话埋了两个新护城河。

第一个是 **harness**——这个词工厂在 [[2026-04-09-managed-agents-architecture]] 那篇里讨论过。Anthropic 把 Managed Agents 设计成"脑（模型）+ 手（沙箱）+ Session 日志 + Harness"四层结构。Harness 是调度器，负责把模型的工具调用路由到正确位置，也负责接住模型的怪癖、决定上下文何时重置。

Tom 这里把 harness 的角色延展到 plastic UI 的管控：当 UI 是 LLM 现场捏的，你怎么保证它（a）不展示错的数字（b）不暴露不该看的字段（c）不让 prompt injection 改掉提交按钮的行为？这些不是模型本身能保证的，是 harness 这一层要兜的。一家 SaaS 公司未来卖给企业的"产品"，可能不再是那个特定的页面，而是"我们保证你公司任何 AI 生成的界面都不会泄密、不会算错、不会越权"这件事。

这正好接住了工厂前几天写过的 [[2026-05-19-cheap-software-trust-gap]] 的论点：**AI 让软件功能成本塌缩之后，企业真正付费购买的是可信执行——来源可验证、链路可审计、结果可追责**。Plastic UI 让"可信执行"的范畴从后端数据扩展到前端界面：你不能只保证数据库写对了，你要保证那个 LLM 临时捏出来的界面没有骗销售人员去点错按钮。

第二个是 **知识库**。Tom 用了一个新说法："context database & library of artifacts"（上下文数据库 + 产物库）。这指的是把所有那些一次性的 plastic UI、它们承载过的数据、用户在上面做过的操作，沉淀成一份可被未来 AI 重新调用的上下文。

![harness 与知识库](assets/png/03_harness_knowledge.png)

这件事在中文圈被 [[2026-04-30-microinteraction-ai-era]] 那篇间接讨论过——AI 时代的微交互从"装饰已发生事件"变成"建模正在发生的过程"。Tom 这里把它再往上推一格：不光是建模单次过程，是把过程本身存成可复用资产。下次同类用户、同类任务，AI 不用从头捏 UI，可以从产物库里挑一个相似的回炉。

合起来看，Tom 描述的是这样一个 SaaS 公司未来的形态：**核心数据层 + harness 管控层 + 知识沉淀层**，三层之上是 plastic UI——根据上下文动态生成、有些用完即弃、有些长期固化为新的"头"。

## 四、盲区：plastic UI 走不动的几个地方

Tom 的文章短，没有讨论边界。我们要补：

**第一，强合规场景走不动**。金融、医疗、法律、能源——任何需要审计追溯的领域，UI 必须是确定性的。一个理赔员看到的字段、字段顺序、文案措辞，需要能在三年之后复现给监管看。Plastic UI 在这些场景至多用于"工作准备阶段"，最终决策界面仍然要回到固定页面。这点在 [[generative-ui]] 概念页讨论过同样的边界。

**第二，运行时成本曲线还没浮现**。每次生成 UI 等于一次 LLM 推理调用 + 渲染层算力 + 可能的工具调用链。如果一个销售每天打开 deal sheet 二十次，每次都重新生成，单用户的 token 成本可能比订阅费高一个数量级。Tom 没算这笔账，企业 PoC 阶段才会浮现。

**第三，设计师角色重塑没有答案**。如果 UI 是 LLM 现场捏的，B 端设计师从"画页面"退到哪里？Tom 一句话没提。从工厂在 [[2026-05-09-html-agent-artifacts]] 与 [[2026-04-30-microinteraction-ai-era]] 的讨论看，可能的方向是设计师退到"约束系统"那一层——给 LLM 提供组件库、视觉规则、可访问性约束、品牌色彩、交互模式语料，让模型在围栏里捏。但谁来做这个 design harness、谁付费、行业惯例怎么形成，这些都还空白。

![plastic UI 的边界](assets/png/04_where_plastic_breaks.png)

## 对中国 B 端 SaaS 设计师 / PM 意味着什么

**产品经理**：盘点你现在 backlog 上的功能。哪些是"用户偶尔需要、形态各异、做成固定页面也用不爽"的？这些是 plastic UI 的最佳候选。先用 Claude Code / 飞书多维表格 + 智能体 / 自研模型这类工具，让 AI 现场捏，观察使用频次和形态稳定性，再决定是不是要工程化。这比每次都从 PRD 走全流程便宜十倍。

**设计师**：开始为你的设计系统建立"机器可读"版本。组件库不只是 Figma 文件，要带元数据——这个组件用在什么场景、什么输入、什么禁用规则。把它喂给团队的 LLM。你未来的产出物不一定是"那个页面的最终稿"，而是"那套约束 + 一个最佳实践范例"。

**SaaS 服务采购方（甲方 IT 决策者）**：你下一个采购周期，问厂商三个新问题。第一，你们的产品是 headless 的吗？我们能用 MCP / API 直接接吗？第二，如果我们的 AI 在你们的系统上面生成界面，你们 harness 这一层提供什么保证（审计日志、权限隔离、数据不外泄）？第三，我们能把那些临时界面沉淀回你们的知识库吗？知识库归我还是归你？

**所有人**：plastic 这个词比 generative UI、headless UX、agent UI 这些词都更准确。下次开会想说"AI 动态生成界面"的时候，可以直接用它。能用一个词把一类现象打包，本身就是一种生产力。

## 本期关键词

- **Plastic UI**：UI 在使用现场被 AI 加工的状态。可以加热、捏出形状、用完冷却归档，也可以再次被加热改形。Tom Tunguz 2026-05-22 命名，对应 SaaS 进入 headless 阶段之后"UI 没死、只是变形"的现象。

- **Headless**：原指 CMS 把内容层和展示层拆开。在 SaaS 语境里指把系统的 API 和默认前端拆开——后端可以独立存在，前端可以被任意替换或现场生成。Salesforce、HubSpot 这几年都在往这个方向走。

- **Harness**：Anthropic 在 Managed Agents 架构里推广的术语。指调度器——把模型的输出路由到正确位置、决定上下文何时压缩、保证工具调用安全。在 plastic UI 的语境里，harness 的作用扩展到管控 LLM 生成的界面的正确性。

- **Context database / Library of artifacts**：上下文数据库 + 产物库。指把所有 AI 生成过的临时界面、它们承载的数据、用户在上面的操作，沉淀成可被未来 AI 重新调用的资产。和 [[memory-as-moat]] 的判断同向。

- **MCP（Model Context Protocol）**：Anthropic 推动的开放协议，让大模型可以接入企业的外部系统（CRM、数据库、文件系统等）。Tom 在文中举了 Salesforce 通过 MCP 实现 headless 操作的例子。

## 引用

1. [Plastic User Interfaces](https://tomtunguz.com/plastic-user-interfaces) — Tom Tunguz, 2026-05-22, 原文
2. [What If Every SaaS App Had an LLM](https://tomtunguz.com/what-if-every-saas-app-had-an-llm/) — Tom Tunguz, 2023-06-11，本文的前奏
3. [Using Claude Code: The Unreasonable Effectiveness of HTML](https://www.lennysnewsletter.com/p/html-is-the-new-markdown-how-anthropic) — Thariq Shihipar 在 Lenny's Newsletter 的访谈，2026-05-18
4. [[2026-05-09-html-agent-artifacts]] — Markdown 没死，只是退回草稿层（工厂前作）
5. [[2026-05-19-cheap-software-trust-gap]] — 软件免费之后，贵的是信任（工厂前作）
6. [[2026-04-09-managed-agents-architecture]] — 脑手分离：Anthropic 不再只卖模型了（工厂前作）
7. [[2026-04-30-microinteraction-ai-era]] — 微交互在 AI 产品里失效了（工厂前作）
8. [[html-artifact]]、[[generative-ui]]、[[microinteraction-ai-era]] — 工厂概念页
