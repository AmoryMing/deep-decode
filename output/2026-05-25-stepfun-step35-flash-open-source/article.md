---
title: 阶跃把旗舰送了出去：开源不是慈善，是 100 亿美元估值的入场券
source: https://x.com/StepFun_ai/status/2058303294544425197
author: StepFun（阶跃星辰）
date: 2026-05-25
type: decode
reader: default
style: default
tags: [开源模型, MoE, 中国AI, IPO, StepFun, 阶跃星辰, 大模型商业化]
---

5 月 8 日，阶跃星辰刚关上一轮近 25 亿美元的 Pre-IPO 融资，估值 100 亿美元，投资人名单里既有华勤、立讯、韦尔、中兴这种 A 股代工巨头，也有港府背景的 Hong Kong Investment Corporation。同一时间窗口，StepFun 在 X 上继续把自己今年初开源的 Step 3.5 Flash 摆到 timeline 顶部——总参数 196B、激活 11B、Apache 2.0、SWE-bench Verified 74.4%。

这两件事不是巧合。阶跃正在做一件中国大模型公司很少明说但都在干的事：**把旗舰开源模型当成 IPO 叙事资产用**。模型不直接产生收入，但模型的"被使用"——HuggingFace 下载、GitHub Star、第三方 benchmark 站点的排名——是它在港交所讲故事的估值锚。

![阶跃 Step 3.5 Flash × IPO 入场券](assets/png/00_cover.png)

## 11B 激活跑出 GPT-5.2 同档分数：阶跃在卖什么

先把模型数字摆清楚。Step 3.5 Flash 是稀疏 MoE，288 个路由专家加 1 个共享专家，每个 token 走 Top-8，结果是"用 196B 的记忆、跑 11B 的速度"。第三方平台 artificialanalysis.ai 给它打出的整体智能均值是 81.0，对面 GPT-5.2（xhigh compute）82.2，Claude Opus 4.5 80.6，Gemini 3.0 Pro 80.7（[awesomeagents 报道](https://awesomeagents.ai/news/stepfun-step-3-5-flash-open-source-agent-model/)）。

更要命的是成本。在 Hopper GPU 上跑 128K 上下文解码，Step 3.5 Flash 是基准 1.0x、100 tok/s；DeepSeek V3.2 是 6.0x、33 tok/s；Kimi K2.5 是 18.9x、33 tok/s（数字来自 HuggingFace 模型卡）。同样的活，阶跃自家测算便宜 6 倍。

这套组合不是随机的。它精准对应一句话定位——"开源里能跟前沿闭源模型贴脸打、价格还便宜一个数量级"。这条赛道 DeepSeek V3 已经走通过一次，整个行业知道这个故事能换成什么：模型 API 价格全行业雪崩、应用层接入数量爆炸、模型本身成为云厂商不得不上架的标配。阶跃要的就是这套外溢效应，而且时机选在 IPO 之前。

![整体智能 81.0 对照 GPT-5.2 / Claude / Gemini](assets/png/01_benchmark.png)

## 时机：从 2 月开源到 5 月递表前夜

Step 3.5 Flash 不是 5 月才出现的模型。HuggingFace 模型卡写明 release date 是 2026-02-11，4 月 2 日又上线 2603 优化版，加了 low think mode 给 Step Plan 用户。但在 5 月这个时点重新被推到 X 顶部，是因为阶跃刚把上市路径上的所有前置条件凑齐：

- 4 月：完成股份制改造，拆掉红筹结构（[CnTechPost](https://cntechpost.com/2026/05/08/chinese-ai-startup-stepfun-nears-2-5-billion-funding-ahead-hong-kong-ipo/)）
- 5 月初：Pre-IPO 25 亿美元落定，估值 100 亿美元
- 6 月 30 日前：计划递表港交所，年底前完成上市（[Bloomberg 2 月报道](https://www.bloomberg.com/news/articles/2026-02-25/tencent-backed-ai-startup-stepfun-is-said-to-plan-hong-kong-ipo)）

港股投资人和 A 股代工巨头看不懂 MoE 路由策略，但他们看得懂"对标 GPT-5.2"、看得懂"开源 Apache 2.0"、看得懂"中国六小虎之一"。模型卡和 GitHub README 现在不只是给开发者看的文档，是给券商研究员、给基石投资人、给港交所聆讯材料里的"技术领先性"举证材料。

![阶跃从 2 月开源到 6 月递表的时间线](assets/png/02_timeline.png)

这件事和闭源路线最大的区别在于：闭源模型的能力声明只有自家 demo 和官方 benchmark 能证；开源模型一上 HuggingFace，artificialanalysis.ai、OpenRouter、SiliconFlow、NVIDIA NIM 这些第三方平台立刻有独立分数和价格数据。**开源是把估值故事的可信度外包给生态。** 对一家准备上市的公司，这种背书比自家 PR 稿值钱得多。

## 路线对照：StepFun 不是另一个智谱

这周智谱 GLM-5.1 估值也跳了一档，但两家公司打的是完全不同的牌。

智谱的路线是闭源 + 高定价 + 重 B 端集成。它在政企客户那里靠的是"私有化部署 + 定制 + 合规"这一套传统软件叙事，估值锚是合同金额和客户名单。StepFun 这次选择把旗舰直接 Apache 2.0 开放出去——意味着任何人都可以拿这个权重去做商业化，阶跃不收钱。

那阶跃靠什么赚钱？答案藏在 GitHub README 一句不显眼的描述里：模型"集成了 Claude Code、Codex、Step-DeepResearch"。Step-DeepResearch 是阶跃自家的闭源 Agent 产品。**开源底模、闭源产品**，这是 Meta Llama 玩过、Mistral 在玩、DeepSeek 也在玩的双轨——底模负责拉流量和心智，上层产品和云 API 负责收钱。

但和 DeepSeek 不一样的是，DeepSeek 走的是"私募基金孵化、不上市、靠模型 API 现金流"，阶跃走的是"VC + 产业资本 + 上市"。这条路要求模型必须看得见摸得着的"被使用"——下载量、第三方接入数、benchmark 排名都是定价输入。这就是为什么阶跃在 5 月这个节点要反复把 Step 3.5 Flash 推到 X 顶部，而不是憋一个 4.0 版本到上市那天。

中国 AI 六小虎现在事实上分化成两组：智谱、月之暗面走的是闭源 + 高客单价 + 估值千亿；StepFun、MiniMax 走的是开源 + 效率叙事 + 估值百亿。**两组不是水平差距，是商业模型差距。** 港股能不能给开源那一组合理定价，是接下来一年最值得看的实验。

![六小虎两条路：闭源高客单 vs 开源效率](assets/png/03_two_paths.png)

## 盲区：Apache 2.0 这块招牌的折扣

阶跃的开源策略有几个值得质疑的地方。

第一，**Apache 2.0 没有意味着"人人能用"**。HuggingFace 模型卡明写：llama.cpp INT4 量化下最低 120GB VRAM。这个门槛把"自由"基本限制在云厂商、大企业和有 8 张 H100 的研究机构。普通开发者只能在 OpenRouter / SiliconFlow 上付费调用，本质上还是 SaaS。开源在这里更接近一个分销渠道，而不是社区共享。

第二，**整体智能 81.0 是单一第三方口径**。artificialanalysis.ai 是一家独立 benchmark 平台，但它的评估集和加权方式有自己的偏好。Step 3.5 Flash 在 AIME 2025 拿 97.3% 这种近天花板分数，常被解读为"数学接近 frontier"，但 AIME 题目结构和真实工程问题之间的距离，benchmark 是不告诉你的。

第三，**IPO 之后开源策略是否延续，没有任何公开承诺**。OpenAI 从 GPT-2 开源到 GPT-4 闭源花了 4 年，理由是"安全和商业"。阶跃如果上市成功，董事会里坐进基石投资人后，Step 4 系列还会不会维持 Apache 2.0 是开放问题。投资人付 100 亿美元买的，是阶跃未来的现金流，不是它继续做慈善的承诺。

![Apache 2.0 招牌的三处折扣](assets/png/04_blind_spots.png)

## 对 AI 从业者意味着什么

如果你在中国做 AI 应用，今年要决定的是**赌哪条供应链**。

闭源那一组（智谱、Kimi）给你深度集成、合规背书、SLA 保障，但锁定成本高，模型迭代节奏被对方控制。开源这一组（StepFun、DeepSeek、Qwen）给你权重和推理灵活性，但要自己解决部署、运维、安全的全栈问题，或者绑定 OpenRouter 这类聚合平台。

Step 3.5 Flash 之后，一个具体的判断点出现了：**11B 激活、Mac Studio 能跑的模型**，意味着推理成本曲线又向下断了一档。两年前花 100 万跑大模型的中型公司，现在花 10 万可以跑同档智能。这不是渐进改善，是赛道边界重新划——之前不能用 AI 的工作流，现在能用了。

如果你在做投资判断，StepFun 这次开源是一个清晰信号：**中国大模型公司正在分裂成两种估值故事**。闭源那一组对标 OpenAI，估值锚是私有化合同金额；开源那一组对标 Meta + DeepSeek，估值锚是生态规模和云分销。港交所如何给后者定价，会决定接下来 12 个月有多少家公司跟着 StepFun 走开源路线。

阶跃这一步走完，行业看的是结果：能不能用开源换到 100 亿美元的二级市场估值。能，则是中国 Llama 时刻；不能，则是又一个"为了上市开源、上市后回收"的故事。

## 本期关键词

**MoE（Mixture of Experts）混合专家** — 一种把神经网络切成多个"专家"子网络的架构。每个 token 进来时，路由器只挑少数几个专家做计算，其他专家不激活。Step 3.5 Flash 总参 196B 但每个 token 只激活 11B，意思是模型记忆容量按 196B 算，单次推理算力按 11B 算。这是当前开源大模型对抗闭源模型的主要架构选择。

**Apache 2.0 许可证** — 开源世界最宽松的协议之一。任何人可以拿权重做商业化、闭源二次开发、嵌入产品里销售，不需要回报给原作者。和 Meta Llama 的"月活 7 亿以下才能商用"附加条款不同，Apache 2.0 没有规模门槛。这是 StepFun 这次开源最激进的部分。

**SWE-bench Verified** — 真实 GitHub issue 改 bug 的评测集，由 Princeton + OpenAI 联合维护。Verified 版本经过人工筛掉模糊和不可解的样本，是目前 Agentic Coding 能力最被认可的基准之一。74.4% 意味着模型独立解决了将近四分之三的真实开源 issue。

**MTP（Multi-Token Prediction）多 token 预测** — 一次前向传播预测多个 token，而不是传统的一次一个。Step 3.5 Flash 用 MTP-3，一次预测 4 个 token。这是它能把吞吐量推到 300 tok/s 的关键技术之一，也是 DeepSeek V3 之后开源模型的标配优化。

**SWA（Sliding Window Attention）滑动窗口注意力** — 注意力机制的简化变体。不让每个 token 看完整上下文，只看一个固定窗口内的近邻。Step 3.5 Flash 用 3:1 SWA 比例（3 层滑动窗口配 1 层全注意力），换来 256K 长上下文的成本可控。

**Pre-IPO 轮** — 公司在递交上市申请之前最后一轮私募融资。这轮的定价通常和上市发行价直接挂钩，投资人接的是"上市后能高位退出"的预期。StepFun 这轮 25 亿美元、100 亿美元估值，意味着上市发行估值大概率不低于此。

## 引用

1. [StepFun on X（任务源推文）](https://x.com/StepFun_ai/status/2058303294544425197) — X 反爬，本文未引用推文措辞，仅作事件背景
2. [Step 3.5 Flash 模型卡](https://huggingface.co/stepfun-ai/Step-3.5-Flash) — 架构、benchmark、解码成本对照表的一手来源
3. [Step 3.5 Flash GitHub](https://github.com/stepfun-ai/Step-3.5-Flash) — README 标语 + 集成产品清单
4. [Chinese AI startup StepFun nears $2.5 billion funding ahead of Hong Kong IPO](https://cntechpost.com/2026/05/08/chinese-ai-startup-stepfun-nears-2-5-billion-funding-ahead-hong-kong-ipo/) — 5 月 8 日融资公告
5. [Tencent-Backed AI Startup StepFun Is Said to Plan Hong Kong IPO](https://www.bloomberg.com/news/articles/2026-02-25/tencent-backed-ai-startup-stepfun-is-said-to-plan-hong-kong-ipo) — Bloomberg 关于 IPO 计划的首次报道
6. [StepFun's Step 3.5 Flash 评测](https://awesomeagents.ai/news/stepfun-step-3-5-flash-open-source-agent-model/) — 整体智能 81.0 vs GPT-5.2 / Claude Opus / Gemini 3.0 Pro 的二手对照
7. [Stepfun finishes US$2.5b funding round for HK IPO](https://www.thestandard.com.hk/finance/article/331515/Stepfun-Chinas-AI-Six-Tigers-finishes-new-US25b-funding-round-for-HK-IPO) — 港媒"六小虎"定位
8. [Step 3.5 Flash vs Claude 4.5 Sonnet](https://artificialanalysis.ai/models/comparisons/step-3-5-flash-0202-vs-claude-4-5-sonnet) — 第三方 benchmark 平台对照口径
