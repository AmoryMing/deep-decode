---
title: 9 天里的四把锤子——把 V4 放进这场定价权拍卖会，比读 benchmark 表有用得多
date: 2026-04-25
mode: event-decode
tags: [DeepSeek V4, 定价权, Anthropic, Codex, 开源, 拍卖]
---

# 9 天里的四把锤子

如果你这一周在朋友圈刷到第 5 篇 V4 评测，每一篇都在罗列 SWE-bench Verified 80.6% / LiveCodeBench 93.5% / Codeforces 3206——那你已经看不到这件事真正发生了什么。

把视角抬一格。

过去 9 天，AI 编程工具圈在公开举行**一场定价权拍卖会**。四把锤子敲下来，每一把都在喊一个不同的价。

- **第一把锤子**：4 月 16 日，Anthropic 发布 Opus 4.7。手上更强的 Mythos Preview 锁进 Project Glasswing 联盟（AWS / Apple / Google / Microsoft / NVIDIA / JPMorgan 等 11 家），公开版加上 Auto Mode + Task Budget 这两个 Max 专享按钮。这一槌喊的价是——**稀缺性。最强模型不公开，公开的版本你按月包年付。**

- **第二把锤子**：4 月 21 日，Anthropic 把 Claude Code 从 Pro $20 计划悄悄移除，文档从"Pro 或 Max"改成"仅 Max"。开发者社区当晚刷上 HN 首页。增长主管 Amol Avasare 公开承认："我们现有的计划架构不是为这种规模设计的。" 这一槌的意思是——**第一把锤子敲下去之后，发现这把锤子的价值表已经撑不住了。**

- **第三把锤子**：4 月 22 日，OpenAI Codex 团队发声明——"Codex 留在免费版和 Plus $20 计划里。我们有算力支持。" 距离 Anthropic 的动作不到 24 小时。这一槌喊的价是——**可达性。$20 的档位我守住，争夺百万开发者的日常选择。**

- **第四把锤子**：4 月 24 日，DeepSeek 把 V4-Pro（1.6T 总参数 / 49B 激活）和 V4-Flash（284B / 13B）扔到 HuggingFace，MIT 协议，权重直接给。API 输出价 $3.48/MTok，是 Opus 4.6 $25 的 14%。这一槌喊的价是——**零摩擦。最强模型直接给你，价格压到对手的 14%。**

四把锤子，三家公司，三个完全不同的拍价机制。读者真正要回答的问题不是"V4 多强"——是**"未来 12 个月谁来定价"**。这个答案直接决定你下个季度的 token 预算、你 agent 产品的对外报价表、你给老板写的供应商评估文档。

下面把这 9 天拍卖现场逐槌拆开。

![插图 01：9 天四把锤子时间线](visual/01_timeline.svg)

## 一、第一把锤子：稀缺性的最高出价

Opus 4.7 发布那天，Anthropic 做了一件之前没有任何头部 AI 厂商做过的事——**把"最强模型"作为一种分级访问的资产**。Mythos Preview（SWE-bench Verified 93.9% vs 公开版的 87.6%）锁进 Glasswing 联盟，普通开发者拿不到。这不是产品决策，是范式决策。

拆开看，Anthropic 这把锤子背后的拍价模型是这样的——

- **价格层**：$5 输入 / $25 输出，per MTok。token 单价没动。
- **效率层**：Opus 4.7 xhigh @ 100k 上下文 ≈ Opus 4.6 max @ 200k——同等任务消耗 token 折半。这是**隐性降价**，账单数字降一半但 list price 没动。
- **包月层**：Auto Mode + Task Budget 把"按 token 计费"包装成"按任务计费"。Max 用户买的不再是 token 池，是**任务完成度**。
- **稀缺层**：最强模型 Tier 1 锁联盟、Tier 2 公开商用、Tier 3 专业豁免。把"能力"切片成可分级访问的资产。

这套机制对应到拍卖理论里，是一种**保留价 + 限定竞拍人**的模式：底价不降，但给特定买家（联盟）保留特殊席位。这是 18 世纪苏富比拍古董画的玩法——稀缺性自己就是定价的一半。

问题是，AI 编程工具不是古董画。

## 二、第二把锤子：第一把锤子敲不下去

第一槌之后第 5 天，第二槌就来了。这一槌不是 Anthropic 主动打出来的，是被市场打回来的。

4 月 21 日，Pro 计划的 Claude Code 被悄悄从定价页拿掉。1 小时内 HN 帖子上首页。当晚 Avasare 在 X 发文，三句话拼起来读：

> "Usage has changed a lot and our current plans weren't built for this."
> "Per-subscriber usage has increased significantly, and our current plan architecture was not designed for this scale."
> "We're testing this with about 2% of new users."

「使用模式变化很大」——不是用户多了，是**使用方式变了**。Opus 4.7 发布后，社区里反馈单次会话能跑几个小时。开发者用 Claude Code 不再是聊天，是 **agent loop 后台长跑**——白天写完任务规则，晚上让它自己跑，第二天早上看 PR。

按聊天次数定价的订阅模型，撑不住 agent 长跑。一个重度用户的算力消耗等于 100 个普通用户。Anthropic 2 月刚和 Amazon 签下 250 亿美元的 Trainium 协议，但产能要今年晚些时候才上量。Pro 订阅每多一个 agent 长跑用户，毛利就少一截。

把这条放回拍卖叙事里看——**第一把锤子（Auto Mode 包月）想把"任务完成度"打包卖，但底层算力账还没算清就先把锤子敲了**。第二把锤子是同一只手把第一把锤子收回来重新校准。Anthropic 在公开承认：稀缺性的拍价机制，没法在订阅档位上简单复制。

后来定价页悄悄恢复了，但部分文档变更保留。Avasare 那句"下次有变化会先从我们这里听到，不是从 X 截图上"——等于公开承认流程失控。

这一槌没产生新产品，但把第一槌的**承重边界**画了出来：Anthropic 的稀缺性叙事在企业 / 联盟侧能立得住，在 $20 / $100 的开发者订阅档位上立不住。

## 三、第三把锤子：可达性的反向出价

Avasare 文章发出来不到 24 小时，OpenAI Codex 团队就把第三把锤子敲下去了。

声明只有一句话的核心——"Codex stays in Plus ($20/month). We have the compute and efficient models to support it." 这一槌看似温和，实则锋利。它没有提 Anthropic 一个字，但每一个开发者读到这句话第一反应都是——**Anthropic 把 Claude Code 从 Pro 拿掉的时候，OpenAI 在这里没动。**

Codex 团队选择把"留在 $20"作为正面叙事来打，等于把这条**$20 战线**从隐性变量提到了显性变量。模型选型的决策权第一次从架构师手里挪到了**付账的开发者**手里。

这背后是两家完全不同的成本结构。NVIDIA 4 月一篇博客披露 GB200 NVL72 比上代每百万 token 成本降低 35 倍、每兆瓦每秒 token 输出提升 50 倍。Codex 全量跑在这套基础设施上，1 万名 NVIDIA 员工内部用。OpenAI 的成本曲线已经把"$20 守住"做成了一个可执行的动作，不是营销口号。

第三把锤子对应到拍卖理论里，是**二价拍卖**——胜者付出的价等于第二高的出价。OpenAI 用"$20"这个数字告诉所有竞争对手——你可以喊高于 $20 的价，但你必须解释**为什么读者要付溢价**。

两天后，4 月 23 日，OpenAI 发布 GPT-5.5，Terminal-Bench 82.7% / OSWorld 78.7% / MRCR v2 长上下文 74%——分叉领先 Anthropic 在 agent / 终端 / 长上下文三条线。但这次发布的真正叙事不是"我们更强了"，是"**我们更强且 $20 还能用得上**"。

## 四、第四把锤子：把整张拍卖桌掀掉

4 月 24 日凌晨，DeepSeek 在 HuggingFace 上传 V4-Pro 和 V4-Flash 权重。MIT 协议。1.6T 总参数 / 49B 激活。SWE-bench Verified 80.6%，比 Opus 4.6 的 80.8% 低 0.2 个百分点。

![插图 02：四把锤子的拍价机制对照](visual/02_three_mechanisms.svg)

这一槌之前，拍卖现场是 Anthropic（稀缺性）vs OpenAI（可达性）的**两种闭源出价**。这一槌之后，DeepSeek 直接把整张拍卖桌掀了——

- **不在 $20 那档抢**：API 输出价 $3.48 / MTok，是 Opus 4.6 的 14%。开源权重可本地部署，连订阅都跳过。
- **不靠稀缺性**：1.6T 参数权重直接 MIT 给。没有 Glasswing，没有"Tier 1 联盟版"，没有"未手术的最强模型留给我自己"。
- **不在性能溢价那档抢**：在 4 个 benchmark 上贴近或反超闭源最强（LiveCodeBench 93.5% vs Opus 88.8% / Codeforces 3206 vs GPT-5.4 3168 / Terminal-Bench 67.9% vs 65.4%），这意味着**性能溢价的锚点失灵了**。

这种出价方式在拍卖学里叫**「破坏性进入」**（disruptive entry）——新玩家不去和老玩家在同一个机制里竞争出价，而是改变拍卖的规则本身。1978 年美国航空业去管制后，西南航空（廉价航空）就是这么入场的——它不在 hub-and-spoke 模型里和泛美 / 美航抢头等舱，它直接重定义"飞机是什么"。

DeepSeek 这一槌的破坏性来自三个维度同时开源——

第一，**1.6T 训练稳定性的工程方案进了开源 tech report**。Manifold-Constrained Hyper-Connections（mHC，流形约束超级连接）把神经网络层间信号传播放大倍数从 3000x 压到 1.6x。这是**行业首次有 1T+ 模型公开"训练稳定性"的工程解法**——闭源大厂的核心壁垒之一被掀开了一条缝。

第二，**1M 上下文的成本结构进了开源权重**。DeepSeek Sparse Attention（DSA）在 1M token 上下文设置下，单 token 推理 FLOPs 27%（节约 73%）/ KV cache 10%（节约 90%）。这意味着 1M 上下文从"研究指标"变成"商业可行"。

第三，**价格政策进了开源权重**。$3.48 输出价让 Buildfastwithai 算的那个例子掷地有声——一条月输出 5000 万 token 的 agent 流水线，V4-Pro 月成本 $174，Opus 4.6 月成本 $1,250。差额 $1,076。一年差 $12,912。一个 50 人团队差 $645,600。

把这三个维度合起来，第四把锤子敲下去的不是"V4 比 Opus 强 0.2 个百分点"，是——**模型权重本身不再是护城河**。

## 五、四把锤子合起来：这场拍卖到底在拍什么

把四把锤子叠起来看一张全景图——

| 锤子 | 日期 | 出价者 | 价码 | 拍价机制 |
|---|---|---|---|---|
| 1 | 4-16 | Anthropic | Opus 4.7 + Auto Mode + Glasswing | 稀缺性（保留价拍卖） |
| 2 | 4-21 | Anthropic | Pro 档撤回 + Avasare 公开承认 | 第一把锤子敲不下去 |
| 3 | 4-22 | OpenAI Codex | "$20 留住" | 可达性（二价拍卖） |
| 4 | 4-24 | DeepSeek | V4-Pro/Flash + MIT + 14% 价 | 零摩擦（破坏性进入） |

这张表里**没有谁在拍 benchmark**。GPT-5.5 / Opus 4.7 / V4-Pro 在不同 benchmark 上互有胜负——分叉领先在上周已经讲过，本周不是续集。

本周拍的是**"未来 12 个月谁来定价"**。

- 如果**稀缺性**赢了——AI 编程工具会像云计算的 reserved instance 一样，最强能力靠合同 / 联盟 / 长期承诺锁定。Anthropic 走 IPO 故事讲"我们的政策护城河 + 应用生态"。Glasswing 11 家联盟成为标配。
- 如果**可达性**赢了——AI 编程工具变成"按月订阅的 office 365"。$20 / $100 / $200 三档，分级清晰。OpenAI 用百万开发者基本盘 + Codex 桌面 agent + iOS 生态做矩阵。
- 如果**零摩擦**赢了——AI 编程工具变成 Linux。模型权重免费、训练方法公开、性能贴近闭源。商业模式从"卖模型 token"迁移到"卖部署 / 调优 / 行业垂直微调 / 企业级合规打包"。

三种机制不是互斥。但**底层定价权只能落在一种机制上**。这场拍卖的终局会在 2026 下半年逐步显性——Anthropic 的 IPO（据公开融资文件 Series G $30B @ $380B post-money / 行业分析师预期 2026-10 融资 $60B）、OpenAI 的下一轮模型 + 价格政策、DeepSeek 的 V4 商业化路径，都是后续观察点。

但这一周已经确认了一件事——**Anthropic 不能再用"我们的模型领先 X 代"作为唯一估值锚**。第四把锤子已经把这条话剪断了。

## 六、不会被任何一家主动说的偏科和盲区

四把锤子各有各的话术，也各有各没说的话。

**Anthropic 没说的**：第一把锤子的 Auto Mode + Task Budget 在 $200 Max 档运行，但 Pro $20 档撑不住——意味着稀缺性叙事在企业侧能讲，在开发者侧讲不通。这是它正在调价格架构的根本原因。第二把锤子打回来后，Anthropic 主动披露过去两个月 Claude Code 三次降智事件（推理档位 3-4 到 4-7 / 缓存 bug 3-26 到 4-10 / 字数限制 4-16 到 4-20）——这是危机公关的时间管控，把信任成本一次性出清。

**OpenAI 没说的**：GPT-5.5 API 定价 $5/$30，比 5.4 翻了一倍。Simon Willison 实测一张 SVG 鹈鹕骑车图，xhigh 模式 9322 推理 token 出好结果，默认模式 39 token 出来"不如 5.4"。"$20 留住"这个叙事只覆盖 Codex 一条产品线——API 那一侧已经在涨价。两条线的价差是一种**双轨定价**，对外讲第一条线讲到耳熟，第二条线藏在 dev console 里。

**DeepSeek 没说的**：33T tokens 训练数据来源未公开。历史上 OpenAI 控诉"蒸馏 GPT-4"事件未结案。模型卡写 "preview release—further post-training refinements are expected"——和 Anthropic 给 Mythos / Claude Design 加 "Research Preview" 是同种话术，能力天花板可以发布，稳定性边界场景没保证。SimpleQA-Verified 57.9% vs Gemini 75.6%，**事实查询任务上 V4 显著落后**——agent 长跑里那些需要查事实的子任务，V4 不是好选择。API 在中国基础设施这件事对中国从业者无影响，对要做 US / EU enterprise 客户的开发者是硬约束。

**所有三家都没说的**：定价权拍卖的真正结果不会在 6 个月内见分晓。开发者付费习惯的迁移以季度为单位，企业供应商决策以年为单位，监管环境以多年为单位。这场拍卖的"成交价"不会在 4 月 25 日这天定下来——但**报价系统已经亮牌了**。

## 七、对从业者意味着什么——4 周行动指南

四把锤子敲完，下面这周到下个月该做什么。按身份切——

**对 AI 应用工程师（你手上有一个生产环境 agent）**——本周拿出 1.5 天做 V4-Pro 的 A/B 接入。具体动作：选 5 个核心任务（多文件 bug 修复、code review、文档查询、终端脚本生成、单元测试生成），同样的 prompt 同时跑 V4-Pro / Opus 4.6 / GPT-5.5，记录通过率 + 平均成本。V4-Pro 在核心任务通过率不输 Opus 4.6 的 95% 时，切换是值得的——70% 的成本节约会直接落进财务报表。事实查询类子任务保留闭源做兜底。**关键判断**：不用 all-in 切换，做混合路由层——把 V4 加进去就是给自己保留议价空间。

**对 AI 产品 PM**——给老板写一页纸的"模型供应商再评估"。三个核心数据点：当前模型成本占 P&L 的百分比（如果 30%+，重排理由充分）、迁移到 V4 的工程量估计（按 SDK / harness / prompt 调试三块给天数）、风险预案（V4 价格政策可能调整 / API 数据出境 / preview 版本稳定性）。**关键判断**：不要让老板做"换还是不换"的二元选择，要让他做"分散到几家"的连续选择。Anthropic + DeepSeek + OpenAI 三家各承担一类任务的混合架构，是这一波最稳的姿势。

**对中型公司 CTO**——成本模型可能需要重写。过去六个月假设的"模型成本占 30-40%"如果不变，现在有机会压到 5-10%。省下来的钱用来扩并发还是扩团队，是一道战略选择题。**模型供应商分散**应该作为这一波的架构原则——开源 + 闭源各两家，避免被任何单家定价权劫持。同时保留对**单家锁定收益**的清醒——分散有协调成本，不是免费的。

**对企业 IT / 架构师（合规优先）**——之前因数据出境合规没法用 DeepSeek API 的团队，MIT 开源权重打开了**本地部署**通路。这条路径之前需要 H100 集群门槛，但 V4-Flash 284B / 13B active 在 4×H100 80GB 上可推理。本地部署 + 开源权重 + 同等性能 = 一条之前不存在的合规通路，值得纳入下半年供应商评估表。但要提前评估三件事：一、tech report 提到的 mHC / DSA 实现是否会随后续版本变化（preview 标签的含义）；二、本地推理的运维 / 监控 / 安全栈是否就绪；三、权重 MIT 但服务条款是否对衍生品有限制。

**对投资人 / 战略分析师**——把 V4 的 4 月 24 日记进估值模型。Anthropic 闭源最强模型的边际溢价从"无限大"压到"21.52 美元 per MTok"（$25 - $3.48）。Anthropic IPO pitch 里"我们的模型能力领先 X 代"这条故事失灵——领先维度要换成 RSP（Responsible Scaling Policy）+ Glasswing 联盟 + Anthropic Labs 应用矩阵 + 数字员工产品线。**估值锚从"模型稀缺性"换到"政策护城河 + 应用生态"**，是 Anthropic 接下来 6 个月叙事的必修课。这个迁移做得好，IPO 估值不打折；做不好，二级市场会按 21.52 美元这个数字反推 Anthropic 的可持续 ARR。

## 八、收尾：拍卖会还没散场

四把锤子敲完，没有人现场宣布赢家。

这场拍卖的真正特性是——**没有终局裁判**。开发者付费习惯、企业采购周期、监管框架、训练成本曲线、半导体供应链——五条独立时间线交织在一起，定价权的归属会在 2026 后半年到 2027 上半年逐步显性。

但有一件事这一周已经确认——**模型权重不再是护城河**。

闭源派还有几张牌没出。差异化训练（在训练阶段精确削弱某些能力同时保留其他）做行业专版、RSP 制度化和监管标准、应用层 bundle 战略（Claude Design / 数字员工 / 企业上下文工程）、深度模型保留作 Tier 1 资产。这些都不是 V4 一次发布能压塌的护城河。

但护城河被迫迁移。从"我们手上有更强的模型"迁移到"我们手上有更深的安全合规护栏 + 更广的产品生态 + 更稳定的企业部署 + 更长的政策资本积累"。这个迁移过程会塑造未来 12 个月所有头部 AI 厂商的对外叙事，也会塑造你下一年的预算表、组织架构、技术选型。

读懂这场拍卖，比追每周的 benchmark 数字有用得多。

四把锤子敲完，灯亮，散场——但每个还在用 Claude Max 跑 agent 的开发者、每个 AI 产品 PM、每个中型公司 CTO，下周一早上都要继续工作。这场拍卖不会停。

只是从这一周起，规则改了。

![插图 03：定价权迁移路径](visual/03_pricing_migration.svg)

---

## 本期关键词

**定价权拍卖（Pricing Auction）** —— 9 天内三家 AI 厂商在公开市场用四把锤子（Opus 4.7 / Pro 撤回 / Codex $20 留守 / V4 MIT 开源）公开竞争"未来 12 个月谁来定价"的现象。本质上是闭源稀缺性 vs 闭源可达性 vs 开源零摩擦三种范式的同期出价。

**Tiered Release（分级发布）** —— Anthropic 4-16 Opus 4.7 发布配套机制：Tier 0（内部不发布）/ Tier 1（联盟限制 Mythos）/ Tier 2（公开商用 Opus 4.7）/ Tier 3（专业豁免）。把"模型能力"切成可分级访问的资产。

**Agent Loop 消耗模型** —— Anthropic 4-21 Avasare 公开承认的使用模式断层：开发者用 Claude Code 不再是聊天，是后台数小时无人值守的 agent 长跑。一个重度用户算力消耗等于 100 个聊天用户。订阅模型按席位计费在这个使用模式下结构性瑕疵。

**$20 战线** —— 模型竞争主战场从 benchmark 挪到月度订阅档位的现象。OpenAI Codex 4-22 公开声明"留在 $20"把这条战线从隐性变量提到显性变量。每月 $20 能用上什么 Agent 直接决定百万开发者的日常选择。

**破坏性进入（Disruptive Entry）** —— DeepSeek V4 选择的拍卖出价方式：不在闭源派现有的两种机制（稀缺性 / 可达性）里竞争，而是改变拍卖规则本身——开源权重 + MIT 协议 + 14% 价格 + 1M 上下文同时成本压一个数量级。类比 1978 年美国航空业去管制后西南航空入场，重定义"飞机是什么"。

**mHC / DSA / Muon 三件套** —— DeepSeek V4 tech report 公开的训练栈：Manifold-Constrained Hyper-Connections（流形约束超级连接，把信号放大从 3000x 压到 1.6x）/ DeepSeek Sparse Attention（1M 上下文 FLOPs 27%、KV cache 10%）/ Muon 优化器（替代 AdamW）。三项加起来传递一个信号——闭源派的"训练稳定性 / 上下文成本 / 优化器配方"三层护城河同时被开源 tech report 拆开。

**护城河迁移（Moat Migration）** —— 模型权重本身不再是护城河之后，闭源派的价值锚从"模型能力领先 X 代"被迫迁移到"政策护城河 + 应用生态 + 企业部署稳定性 + 政策资本积累"。Anthropic 接下来 6 个月叙事的必修课。

---

## 原文关键引用

> "Usage has changed a lot and our current plans weren't built for this." —— Amol Avasare, Anthropic Growth, 2026-04-21
> 「使用模式变化很大，我们现有的计划方案并不是为此设计的。」

> "Per-subscriber usage has increased significantly, and our current plan architecture was not designed for this scale." —— Amol Avasare, 2026-04-21
> 「每个订阅用户的使用量大幅增加，我们现有的计划架构不是为这种规模设计的。」

> "Codex stays in Plus ($20/month). We have the compute and efficient models to support it." —— OpenAI Codex Team, 2026-04-22
> 「Codex 留在 Plus（每月 $20）。我们有算力和高效模型撑住它。」

> "trails only Gemini-3.1-Pro" —— DeepSeek V4 官方公告对 SimpleQA-Verified 偏科的措辞，2026-04-24

> "Constrains signal amplification from exceeding 3,000x to 1.6x, enabling stable training at 1.6 trillion parameters." —— DeepSeek V4 tech report on mHC

---

## 引用

1. [DeepSeek V4 官方发布公告](https://api-docs.deepseek.com/news/news260424) —— V4-Pro / V4-Flash 发布说明，2026-04-24
2. [Buildfastwithai DeepSeek V4-Pro 横评](https://www.buildfastwithai.com/blogs/deepseek-v4-pro-review-2026) —— benchmark 数据 / 价格表 / 月成本算例的主要数据来源
3. [HuggingFace DeepSeek V4-Pro Model Card](https://huggingface.co/deepseek-ai/DeepSeek-V4-Pro) —— 权重 + MIT 协议 + preview 标签
4. [Claude Opus 4.7 GA on GitHub Models](https://github.blog/changelog/2026-04-16-claude-opus-4-7-is-generally-available/) —— 第一把锤子时间线
5. [The Register: Anthropic says it has fixed Claude Code](https://www.theregister.com/2026/04/23/anthropic_says_it_has_fixed/) —— 三次降智事件 + Pro 计划撤回报道
6. [Simon Willison: GPT-5.5 first impressions](https://simonwillison.net/2026/Apr/23/gpt-5-5/) —— xhigh 模式 9322 token 实测
7. [Amol Avasare X 推文系列](https://x.com/amolavasare) —— Anthropic Growth 主管的三段公开承认
8. [OpenAI: Introducing GPT-5.5](https://openai.com/index/introducing-gpt-5-5/) —— 第三 / 第四把锤子之间的 GPT-5.5 发布
9. [NVIDIA GB200 NVL72 性能博客](https://blogs.nvidia.com/blog/blackwell-platform-introduces-gb200-nvl72/) —— 35x token 成本降低数据
10. 上周拆解：[分叉领先：GPT-5.5 与 Claude Opus 4.7 的一周战事](../../wiki/published/codex-5-5-roundup.md)
11. 同期拆解：[Claude Opus 4.7 不是顶配](../../wiki/published/claude-opus-4-7.md) —— Tiered Release 范式首次拆解
12. 同期拆解：[脑手分离：Anthropic 不再只卖模型了](../../raw/published-articles/2026-04-09-managed-agents-architecture.md) —— Managed Agents 架构作为本文 Auto Mode 的源流
