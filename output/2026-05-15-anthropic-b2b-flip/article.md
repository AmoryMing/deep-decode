---
title: B2B 调头 — Anthropic 一年里把 9% 干到 34.4%
source: https://the-decoder.com/anthropic-overtakes-openai-in-b2b-adoption-for-the-first-time-according-to-ramp-spending-data
author: The Decoder / Ramp AI Index
date: 2026-05-13
type: decode
---

![封面](assets/png/00_cover.png)

5 月 13 日，Ramp 发布 5 月 AI Index：34.4% 的美国企业在为 Anthropic 付费，32.3% 在为 OpenAI 付费。两条曲线第一次交叉。同一天，Bloomberg 给出另一条新闻——Anthropic 正在谈 300 亿美元融资，估值 9000 亿。

两条新闻看起来是两件事。放在同一张表上看，是同一件事的两个截面：企业市场默默换了队，资本市场紧跟着重新定价。

## 34.4 比 32.3：曲线第一次交叉

Ramp 的口径很窄——只看通过自家支付平台付费的公司，5 万多家，绝大多数在美国。**它测的是"付费家数的份额"，不是用量，也不是单位 token 价值。** 这条说明放在前面，是为了不让后面所有数字自己变重。

5 月单月，Anthropic 采用率涨 3.8 个百分点，OpenAI 跌 2.9 个百分点。这是 Anthropic 第一次拿到首位。

放回十二个月的窗口看更刺眼：去年 5 月 Anthropic 占 9%，今年 5 月 34.4%。同期 OpenAI 大致原地踏步，微跌 1 个百分点。**Anthropic 不是从 OpenAI 手里抢的市场，是从"还没开始付费"的企业里抢的——同时段使用任意 AI 产品的企业占比涨了 9 个百分点。** 也就是说，新进入 AI 市场的企业，绝大多数第一笔订单签给了 Anthropic。

Ramp 经济学家 Ara Kharazian 在报告里给了一句直白的话：

> "The truth is we have never seen a software industry as dynamic, where newcomers can disrupt market leaders in a matter of months."
> （"我们从没见过哪个软件行业像现在这么动荡——新玩家几个月就能颠覆领导者。"）

软件分发圈里上一次出现这种增速的曲线，是 SaaS 早期 Slack 对邮件、Zoom 对 Webex。区别在那两次都打了三到五年。Anthropic 这条曲线，是十二个月。

![曲线交叉](assets/png/01_curve_crossover.png)

## 卖工作流的赢了卖 API 的

数字背后的动作并不神秘。把 Anthropic 这个月做的事按日期摆开：

- 5/12 推 Claude for Financial Services——金融行业打包的 agent 工作流
- 5/12 推 Claude for Legal Industry——法律行业打包的工作流
- 5/13 推 Claude for Small Business——15 个开箱即用的 agent workflow 加 15 个可复用 task skill，对接 QuickBooks、PayPal、HubSpot、Canva、DocuSign、Google Workspace、MS 365
- 5/13 Claude Code 周限额提升 50%——Pro / Max / Team / Enterprise 全档生效
- 5/12 Claude Opus 4.7 快速模式开放预览

**五件事一起发。这不是"模型更强了"的叙事，是"我们替你把 80% 的部署工作做完了"的叙事。** 卖给企业的是 Excel 自动化、月度财务对账、营销 campaign 管理这种本来要小企业花三个月找咨询公司搭的东西。它们不需要 RAG 是怎么做的、不需要选 embedding 模型，连 prompt 都不用调。打开就用。

OpenAI 同期在卖什么？API。Function calling、Realtime API、agents SDK、Codex 跨应用任务调度——给的是工具箱。工具箱面向的是有研发团队、能自己拼装的客户。问题是 Ramp 的 5 万家公司里，绝大多数没有研发团队。

这是行业第一次明确分层：**一头卖给"会自己造轮子的公司"，一头卖给"只要轮子能转的公司"。** 后一头的家数远大于前一头，而且每家每年只要付几百美元就值得签下来。34.4 vs 32.3 这两个百分点，是这条分层结果的第一次读数。

5 月 12 日和 13 日的 Anthropic 新闻稿放在一起读会发现一个口径上的小心思。Financial Services 用的词是 "industry workflow"，Legal Industry 用的是 "ready-to-run agents"，Small Business 直接喊 "15 ready-to-run agentic workflows"。词在变，骨架是同一套——把行业 know-how 灌进 agent 默认结构，作为产品卖。模型只是地基。

![工作流卖法](assets/png/02_workflow_layer.png)

## 钱也跟上了

如果 Ramp 数据是市场用脚投票，Bloomberg 5 月 12 日的稿子是资本市场跟着投票。

Anthropic 正在谈一轮至少 300 亿美元的融资，估值 9000 亿美元以上（不含本轮）。月底前可能 close，term sheet 还没签。底层数字让这个估值站得住：

- 2025 年底 Anthropic ARR 约 90 亿美元
- 2026 年 5 月 ARR 超 440 亿美元
- 半年里 ARR 翻了将近 5 倍
- 企业客户贡献超过 80% 的营收

440 亿 ARR、9000 亿估值，PS 约 20 倍。对比 OpenAI 上一轮 1220 亿融资、8520 亿后估，Anthropic 这一轮如果 close，估值首次超过 OpenAI。

跟进的钱也已经排好队。Alphabet 承诺再投 300 亿（绩效达标后释放）。Amazon 已在 3500 亿估值上投了 50 亿，承诺再加 200 亿。这两家加起来的承诺额度，本身就接近一个 OpenAI 的体量。

**资本市场对 Anthropic 的重新定价，跟 Ramp 5 月数据完全同步——这种同步不是巧合，是同一种判断在两个市场上的体现：企业默认 AI 厂商正在换人。**

![估值同步](assets/png/03_capital_sync.png)

## 盲区：我们不知道的

不能只看 34.4 这个数字开庆功宴。三件事 Ramp 数据不能告诉你。

**第一，付费家数不等于使用量。** 一家 Fortune 500 给 OpenAI 一年烧 5000 万和 1000 家 5 人小公司各给 Anthropic 付 300 美元一年，前者在 Ramp 数据里算一票，后者算一千票。后者的"票数"赢了不代表前者的"金额"输了。Anthropic 半年 ARR 翻 5 倍说明金额这边也在涨，但 Ramp 不直接告诉你两家在金额上的对比。

**第二，地域偏向。** Ramp 的客户绝大多数在美国，中国、欧洲、日本、中东都不在数据里。Anthropic 在中文市场几乎没有动作，OpenAI 的国际化布局也复杂。"全球 AI 老大"这种话，单靠 Ramp 是说不出来的。

**第三，VentureBeat 列了三个可能让 Anthropic 领先迅速被抹平的因素**——这是同篇报道里被引用最多的一段：

- **成本压力**：Anthropic 在用昂贵模型挣钱，但这也在推动企业去找更便宜的方案。一旦小模型在企业场景里追上 Claude 的工作质量，价格敏感的企业会快速迁移。
- **服务质量抱怨增多**：Claude 近期在 outage 频率和质量稳定性上有公开抱怨。VentureBeat 原话："users have been vocal about outages and declining quality with Claude"。一个企业默认选项最怕的不是不够强，是不够稳。
- **关键能力涨价**：Opus 4.7 模型的图片处理成本是 Claude 4.6 系列的三倍。如果 vision 工作流是企业最常用的场景之一，三倍意味着大量原本能跑的 case 突然不划算了。

这三件事如果叠在一起兑现，下半年 Ramp 数据可能就翻回去。但反过来想，这三件事是"被防御者抓的稳固性问题"，不是"产品方向选错"的根本性问题。一家公司从 9% 涨到 34% 这种速度上车，再被对手抓住稳固性问题打回来——历史上不少见。Anthropic 接下来六个月是守势比攻势更难的窗口。

![三威胁](assets/png/04_three_threats.png)

## 对从业者意味着什么

——————————

- **企业 AI PM**：本周回去把团队 stack 列一遍，OpenAI 和 Anthropic 各占多少。如果两家都在用，问自己一个具体问题——如果有一家明天涨价 30%，迁移成本是几人天？把这个数算清楚，比押注哪家赢更值得做。
- **架构师**：本周把"工作流默认结构"这层抽象抓出来。Anthropic 在卖的不是 prompt，是行业 workflow 模板。回去看你的 stack 里有没有可以用同样思路打包的内部工具——比如把"销售线索筛选"打成 ready-to-run agent，让业务部门点开就用。这是行业从 API 卖到 workflow 卖的连带迁移机会。
- **CTO / 创始人**：本周和团队对一次行业渗透曲线。十二个月从 9% 到 34.4% 这种速度，如果发生在你所在的细分市场——医疗、法律、设计、教育、制造——意味着今年定下来的"默认厂商"明年不见得还是默认。提前给替换厂商留接口，比锁定 vendor 划算。
- **工程师（Claude Code / Cursor 用户）**：本周看一下 Claude Code 周限额 +50% 后你的实际使用余量。Anthropic 给 Pro/Max/Team 都加了配额，说明它在保 dev 这一头的体验——Opus 4.7 涨价 + outage 抱怨的同时给开发者补血，是它"先稳住核心圈"的动作。利用窗口期。
- **投资人 / 战略**：本周读 Bloomberg 那篇 9000 亿估值的稿子全文。注意"还没签 term sheet"——估值是新闻，钱到账才是事实。同时关注 Alphabet 300 亿和 Amazon 200 亿的"绩效达标后释放"条款细节。这些是后面六个月真信号的位置。

## 本期关键词

- **B2B 调头**——企业市场上后发厂商的份额曲线第一次超过既有领导者的瞬间。重点不在百分比，而在它和资本市场重新定价是否同步。同步出现意味着市场和资金两套独立判断都翻了，单独出现一边可能只是噪音。
- **工作流默认结构**——把行业 know-how（"月度财务对账""营销 campaign 管理"）灌进 agent 默认骨架，作为产品卖。模型只是地基。Anthropic 5 月连发三个行业包是这种卖法的具体实现，跟 OpenAI 的"卖 API 工具箱"思路是分层而非竞争。
- **付费家数 ≠ 使用量**——Ramp 类口径只看"哪家公司给哪个厂商付了钱"，不看付多少、用多少。读这种数据时第一步必须问"这测的是什么单位"，否则容易把份额和价值划等号。
- **稳固性窗口**——一个新晋领导者拿到首位之后六到十二个月最容易被对手抓的位置。成本、稳定性、关键能力定价这三个维度，是企业用户从"试用"切到"默认"过程中最先被检验的。Anthropic 接下来要过的就是这道关。
- **十二个月窗口**——Ramp 显示 Anthropic 一年从 9% 涨到 34.4%，是 SaaS 史上少见的速度。Slack 对邮件、Zoom 对 Webex 那两次都打了三到五年。十二个月窗口意味着行业默认厂商的迁移已经从年度节奏切到季度节奏。

## 引用

1. [Anthropic overtakes OpenAI in B2B adoption for the first time according to Ramp spending data](https://the-decoder.com/anthropic-overtakes-openai-in-b2b-adoption-for-the-first-time-according-to-ramp-spending-data) — The Decoder 核心报道（2026-05-13）
2. [Ramp AI Index — May 2026](https://ramp.com/leading-indicators/ai-index-may-2026) — 数据原始来源
3. [Anthropic finally beat OpenAI in business AI adoption — but 3 big threats could erase its lead](https://venturebeat.com/technology/anthropic-finally-beat-openai-in-business-ai-adoption-but-3-big-threats-could-erase-its-lead) — VentureBeat 三威胁分析
4. [Anthropic Now Has More Business Customers Than OpenAI, According to Ramp Data](https://techcrunch.com/2026/05/13/anthropic-now-has-more-business-customers-than-openai-according-to-ramp-data/) — TechCrunch 复述与交叉验证
5. [Anthropic In Talks to Raise $30 Billion at $900 Billion Valuation](https://www.bloomberg.com/news/articles/2026-05-12/anthropic-in-talks-to-raise-30-billion-at-900-billion-valuation) — Bloomberg 9000 亿估值报道
6. [Introducing Claude for Small Business](https://www.anthropic.com/news/claude-for-small-business) — Anthropic 官方小企业 Claude 发布
