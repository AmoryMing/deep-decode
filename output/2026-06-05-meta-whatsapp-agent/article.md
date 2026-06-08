---
title: Meta 把客服 agent 铺向全球 20 亿商家——而账单按 token 算
type: published
created: 2026-06-05
updated: 2026-06-05
style: default
tags: [Meta, WhatsApp, AI-agent, token计费, 出海电商, 客服]
distribute: [email, xiaohongshu]
---

# Meta 把客服 agent 铺向全球 20 亿商家——而账单按 token 算

过去十年，WhatsApp 对全世界的小店主来说是一个免费的对话框：顾客来问"还有货吗"，老板手动回。Meta 6 月 3 日宣布的事情，是把这个对话框里的"老板"换成一个 AI agent，并且向商家收钱——大企业按用掉多少 token 结账。这不是又一个聊天机器人发布会。这是迄今为止把 agent 装进超级 App 商业入口、并且想清楚了怎么收钱的最大一次实验：渠道有几十亿人的体量，计费随用量走。谁先跑通这条路，谁就拿到了 agent 规模化变现的样板。

![封面](assets/gpt-img/00_cover.png)

## 本期看点

- Meta 把测试两年的客服机器人正式命名为 **Meta Business Agent**，全球开放，同时进 WhatsApp 和 Instagram 私信。
- 这个 agent 不只是答疑：它能推荐商品、预约、筛销售线索、判断不了就转人工——是一条能闭环到下单的客服流水线。
- 收费方式是关键判断点：小商家打包进 WhatsApp Business Premium 订阅，**大企业按 token 用量付费**。
- 渠道体量决定了这事的分量：超过 2 亿商家每月在用 WhatsApp Business，每天 1.75 亿人给商家账号发消息。

## agent 能干的，是一整条客服流水线，不是答疑机器人

先看 Meta 自己列的能力清单，因为"AI 客服"这四个字在过去三年被用滥了，绝大多数只是把 FAQ 套了层对话皮。

Meta 说 Business Agent 能"回答顾客问题、推荐商品、预约、筛选销售线索（qualify sales leads），需要时把对话转给真人"。把这几件事连起来看：顾客进来问，agent 答；答完顺手推荐相关商品；顾客有意向就帮约时间或往下走；agent 判断这是个值钱的线索就标记出来；遇到搞不定的再交给人。这是一条从"招呼"到"成交前一步"的链路，不是一个孤立的问答框。

还在测试里的能力把这条链路又往前推了一步。Meta 正在让 agent 提供"隔夜对话的每日简报"——你早上打开，agent 把昨晚顾客聊了什么、有什么值得跟进的，整理成一段给你。这个功能在 WhatsApp Business、Instagram Pro、Messenger 和 Meta Business Suite 的部分账号上测。再往后，Meta 列的路线图包括让 agent 做市场调研、突出产品卖点、管日历、接外部工具拉竞品情报。

把这些拼起来，Meta 想做的不是一个客服插件，而是"让 WhatsApp 变成中小企业能用的工作流软件（workflow software）"——这是 Meta 在公告里的原话。对一个连官网都没有、全部生意跑在一个聊天 App 里的小店主来说，这意味着他的"系统"第一次有了一个会自己干活的角色。

![能力清单](assets/gpt-img/01_capabilities.png)

## 渠道的体量，是这件事真正的分母

同样的 agent，装在一个无人问津的 App 里，是 demo；装在 WhatsApp 里，是基础设施。差别全在分母。

超过 2 亿商家每月在用 WhatsApp Business，每天有 1.75 亿人给某个商家账号发消息，商家与顾客之间每天交换的消息超过 22 亿条（数据来自第三方 WhatsApp 统计汇总，与 Meta 历年公开口径一致）。这意味着 agent 一旦铺开，要处理的不是某个垂直 SaaS 几万家客户的工单，而是全球小商业对话的主干道。在印度、巴西、墨西哥、印尼这些市场，WhatsApp 实际上就是商业的默认入口——很多生意从询价到付款全在聊天里完成，没有独立网站，没有 App，没有 CRM。

Meta 为什么现在动手，公告最后一句说得很直白："这对 WhatsApp 至关重要，它一直依赖商家为消息和'点击直达 WhatsApp'广告付费。"翻成人话：WhatsApp 现有的赚钱方式是收商家的消息费和导流广告费，这两条都接近天花板了。agent 是一条新的收入线，而且它绑定的是商家最舍不得砍的环节——和顾客的每一次对话。

Meta 测了将近两年才敢全球开。客服测试先在印度和墨西哥跑——这两个市场不是随便选的，它们是 WhatsApp 商业最成熟、最不可替代的地方。在这里跑通，意味着 agent 经受了真实高频商业对话的压力测试。

![渠道体量](assets/gpt-img/02_scale.png)

## 按 token 收费，把"客服"变成了一条随用量增长的收入线

这是整件事最该被 AI 从业者盯住的地方：收费模式。

Meta 的安排是两层。小商家，agent 打包进 WhatsApp Business Premium 订阅的某些档位——付固定订阅费，agent 是档位里的一项权益。大企业，"按用掉多少 token 付费"。token 是大模型处理文字的计费单位，一次对话来回消耗的输入和输出文字越多，token 越多，账单越高。

为什么这个设计重要？因为它把客服从一项成本，变成了一条会自己长大的收入线。传统 SaaS 卖坐席数或卖订阅，收入和客户数挂钩，客户用得多用得少都付一样的钱。按 token 计费不一样——商家生意越火、顾客聊得越多、agent 干得越多，Meta 收得越多。收入直接咬住了使用量（usage-priced），随对话量线性增长，而不是随广告位增长。对一个几十亿人体量的渠道来说，这条曲线的上限远高于卖订阅。

按 token 收费正在成为 agent 时代变现的默认形态，但它有刺。就在 TechCrunch 报道这条新闻的同一天，另一条热门是 GitHub Copilot 上线按 token 计费引发开发者大面积不满——核心抱怨是账单不可预测，你写代码时根本不知道这次会烧掉多少钱。Meta 把同一套逻辑搬到商家身上，商家也会面对同样的问题：一个爆款帖子带来一波咨询潮，agent 自动应答，月底账单可能让小老板心惊。Meta 用"小商家走订阅、大企业走 token"来缓冲——拿不准账单的人付固定费，扛得起波动的大企业才上浮动计费。这个分层不是产品细节，是 Meta 在用量计费这把双刃剑上找的平衡点。

![token计费](assets/gpt-img/03_token_billing.png)

## Meta 在搭的不止一个 agent，而是一个 agent 平台

公告里藏了一句容易被略过、但分量最重的话：Meta"正在搭建一个平台，让更大的企业创建能连接 Shopify、Zendesk、Shopee 等系统的自定义 agent"。

这句话把这次发布的天花板抬高了一个量级。一个内置客服机器人，是 Meta 自己的产品；一个能接 Shopify（独立站电商）、Zendesk（客服工单系统）、Shopee（东南亚电商平台）的 agent 平台，是让第三方在 WhatsApp 上搭自己业务逻辑的地基。Shopify 接进来，意味着 agent 能查真实库存、真实订单；Zendesk 接进来，意味着它能接管真实工单流；Shopee 接进来，意味着它直插东南亚电商的主战场。

这是从"我提供一个机器人"到"我提供一个让你造机器人的渠道"的转变。前者卖的是功能，后者卖的是入口和分成。一旦商家在 WhatsApp 上把自己的 Shopify 库存、Zendesk 工单都接进了 agent，迁移成本就锁死了——这正是平台的护城河。Meta 同时在 Instagram 私信里上线同一个 agent，等于把 Instagram 这个种草入口和 WhatsApp 这个成交入口，用同一个 agent 缝在了一起。

![agent平台](assets/gpt-img/04_platform.png)

## 对从业者意味着什么

**做出海电商和跨境的**：WhatsApp 是印度、巴西、东南亚、中东市场的商业默认入口，你的海外客服正在被 Meta 原生 agent 化。短期要做的不是观望，是算账——你现在的人工客服或第三方机器人，对比 Meta Business Agent 的覆盖和成本，哪个更划算。中长期要警惕：当 agent 平台能接 Shopify、Shopee，你的客服能力会越来越像 Meta 渠道里的一个默认选项，议价权在往 Meta 手里走。

**做 AI 客服、对话产品的**：你的护城河不能是"我能接对话框做问答"——Meta 用免费打包把这个能力变成了水电。值钱的是 Meta 暂时做不好或不愿做的：深度行业知识、复杂工单的人机协同、跨平台的数据沉淀。盯住 Meta 那个 agent 平台的开放程度，如果它开 API，你的机会是在平台上做垂直 agent，而不是和 Meta 拼通用客服。

**所有在用或将用 token 计费的**：Meta 的分层是个可抄的样板——给怕账单的人固定订阅，给扛得住波动的大客户上 token 浮动。GitHub Copilot 同周的翻车说明，把不可预测的用量账单直接甩给用户，会激起强烈反弹。计费透明度和预算上限（budget cap）不是锦上添花，是 agent 商业化能不能落地的前提。

**判断**：agent 进入超级 App 的商业入口，加上按 token 收费，这是 agent 规模化变现迄今最真实的样板——几十亿用户的渠道乘以用量计费。Meta 测了两年、绑住最大的商业消息流、用订阅和 token 双轨收钱，这套组合拳的样本价值，远大于又一个客服机器人本身。接下来值得跟的，是那个 agent 平台开到什么程度，以及第一批商家的 token 账单会不会把它劝退。

## 关键词

- **Meta Business Agent**：Meta 给 WhatsApp/Instagram 商家提供的 AI 客服 agent，测试两年后于 2026 年 6 月全球开放，能答疑、荐品、预约、筛线索、转人工。
- **token 计费**：按大模型处理的文字量（token 数）收费的模式。一次对话消耗的输入输出文字越多，token 越多，账单越高。和按订阅、按坐席收费相对，收入随使用量增长。
- **WhatsApp Business**：WhatsApp 面向商家的版本，全球超过 2 亿商家每月在用，在印度、巴西、东南亚等市场是商业的默认对话入口。
- **qualify sales leads（筛选销售线索）**：从一堆咨询里识别出真正有购买意向、值得跟进的潜在客户。agent 把这一步自动化，等于替商家做了初筛。
- **workflow software（工作流软件）**：帮企业把日常业务流程跑起来的软件。Meta 想把 WhatsApp 从一个聊天工具变成中小企业的工作流软件。
- **click-to-WhatsApp 广告**：Meta 投放的、点击后直接跳进 WhatsApp 对话的广告，是 WhatsApp 现有主要收入来源之一。

## 引用

1. Ivan Mehta, "Meta's AI agent for WhatsApp Business is now available globally", TechCrunch, 2026-06-03. https://techcrunch.com/2026/06/03/metas-ai-agent-for-whatsapp-business-is-now-available-globally/
   原文要点："Meta said the AI agent can answer customer questions, recommend products, book appointments, qualify sales leads, and reroute queries to a person if needed."（Meta 称该 AI agent 能回答顾客问题、推荐商品、预约、筛选销售线索，并在需要时把咨询转给真人。）
   "The company noted that large businesses will pay for the agent based on how many tokens they use."（公司指出，大企业将按其使用的 token 数量为该 agent 付费。）
2. WhatsApp 商业体量数据（2 亿+ 商家月活、1.75 亿人日均联系商家、22 亿条日均商家消息）交叉引自第三方 WhatsApp 统计汇总（Infobip / Backlinko / Demandsage，2026），与 Meta 历年公开口径一致。
3. Lucas Ropek, "'What a joke': GitHub Copilot's new token-based billing spurs consternation among devs", TechCrunch, 2026-06（同期报道，作为按 token 计费引发用户不满的对照案例）。
