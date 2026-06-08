---
title: Karpathy 加入 Anthropic：明星个体迁徙作为路线信号
author: Maxwell Zeff / TechCrunch
date: 2026-05-20
type: decode
slug: 2026-05-20-karpathy-joins-anthropic
source: https://techcrunch.com/2026/05/19/openai-co-founder-andrej-karpathy-joins-anthropics-pre-training-team/
tags: [Karpathy, Anthropic, OpenAI, pre-training, Eureka Labs, scaling laws, talent migration]
---

# Karpathy 加入 Anthropic：明星个体迁徙作为路线信号

![Karpathy joins Anthropic pre-training](cover.png)

AI 圈个人流量最大的研究员，刚刚走进了一家比 OpenAI 还小的对家，做的还是最重的活——pre-training。

不是顾问，不是 advisor，不是 board observer。Anthropic 发言人对 TechCrunch 说得很直：Andrej Karpathy 加入预训练团队，向 Nick Joseph 汇报，"start a team focused on using Claude to accelerate pre-training research"——组一支用 Claude 加速预训练研究的小队。本周报到。

Karpathy 本人在 X 上的话同样克制：

> "I've joined Anthropic. I think the next few years at the frontier of LLMs will be especially formative. I am very excited to join the team here and get back to R&D."
>
> "我加入了 Anthropic。我认为接下来这几年是大语言模型前沿最关键的几年。很激动重新回到 R&D。"

注意"get back to R&D"。他不是说回到 OpenAI 那种产品和研究混在一起的状态，是说回到研究本身。一个连续两年公开做"AI-native 教育"创业、刚把 nanochat 这种从零训小模型的开源项目推到 GitHub trending 的人，回头去坐 pre-training 的工位。这件事本身就是一个判断。

![Anthropic 路线的人事化签名](02_anthropic_pretraining.png)

## 这是 Anthropic 路线的人事化签名

预训练在 2026 年是个尴尬的词。一边是"scaling laws 撞墙"的叙事，一边是 GPT-5、Claude Opus 4.5、Gemini 3 这些新模型证明 scaling 还有空间。多数大厂在两头下注，但对外讲故事时都会强调 post-training、RLHF、agent、推理时计算这些更性感的方向。

Anthropic 挑了一个最反潮流的人事动作：把 Karpathy 放进 pre-training，让他组一支用 Claude 加速预训练研究的小队。这句话翻一下，就是 AI-assisted research——让模型帮研究员做实验设计、跑 ablation、读 log、写 kernel。TechCrunch 在报道里直接把这件事解释成 Anthropic 的差异化路线：

> "AI-assisted research, rather than pure compute, is how it stays competitive with OpenAI and Google."
>
> "比起纯堆算力，AI 辅助研究才是 Anthropic 跟 OpenAI、Google 竞争的方式。"

这话听上去像 PR，但人事是有说服力的证据。Anthropic 招的不是一个会跑分布式训练的工程师，是一个把"从零写 GPT"做成全球开源教材的人。他的强项不是开新前沿，是把已经存在的训练流水线压成更小、更快、更可被理解的形态。

这种工程审美正好对应"AI-assisted research"的需要。让 Claude 加速 pre-training，要先把 pre-training 的工作流拆成 Claude 能消化的颗粒度——可测、可重放、可解释的实验单位。这件事 Karpathy 大概是 LLM 圈里最适合做的一个。

![Karpathy 11 年五跳轨迹](01_career_timeline.png)

## OpenAI 联创第二次离开，第二次去对家

把履历拉直看：

- 2015 联合创办 OpenAI
- 2017 离开 OpenAI 去 Tesla，做 Director of AI
- 2022 离开 Tesla
- 2023 回 OpenAI，约一年
- 2024 二次离开 OpenAI，创办 Eureka Labs
- 2026 加入 Anthropic

五跳，两次离开 OpenAI，两次去了 OpenAI 的对手——Tesla 当年是 Musk 跟 OpenAI 分家的载体，Anthropic 是 Amodei 兄妹跟 OpenAI 分家的载体。两次都不是去 Google，不是去 Meta，不是自己彻底创业到底，是去那个跟 OpenAI 有过组织级冲突、且仍在做基础模型的下家。

第一次走的时候，Ilya Sutskever 还在 OpenAI；第二次走的时候，Sutskever 已经离开。Karpathy 这次进 Anthropic 预训练，坐的就是 Sutskever 那种位置——不是一线写代码的研究员，但也不是脱离技术的高管，是能影响路线的资深研究 lead。这个位置 OpenAI 自己很缺。

Sam Altman 这次没有公开表态。这跟 2024 Karpathy 上次离开时还互相说几句感谢的氛围不同。沉默通常比反应更有信息量。

![明星个体迁徙作为路线信号](04_industry_signal.png)

## 明星个体迁徙作为路线信号

研究员跳槽这件事，在 AI 圈被过度解读，也被低估。过度解读的是"某某加入某厂等于某厂赢了"——研究员一个人改变不了什么。低估的是"研究员选哪家，比那家公司自己说的路线更准"。

公司自己讲路线，要兼顾投资人、客户、招聘、媒体，必然糊。研究员选下家，只兼顾一件事——他在哪里能做他想做的科研问题。所以他选的方向，等于他用自己未来三五年时间下注的方向。

这就是**明星个体迁徙作为路线信号**：当一个研究员可以选任何顶级实验室时，他选的那家在做的那件事，就是他判断未来三五年最重要的事。

把这个框架套到 Karpathy 这次：

- 他没去 SSI。Sutskever 的 Safe Superintelligence 拿了百亿估值，外界吹得最响的就是"纯 pre-training 路线"。Karpathy 不去，等于他不认为 SSI 那种"只做 pre-training、不做产品"的押法是最优解。
- 他没去 Google DeepMind。Gemini 3 出来后 DeepMind 是技术上离 OpenAI 最近的对手，资源最多。他不去，等于他认为大厂研究院的 overhead 让自己想做的东西更难做。
- 他没自己继续做 Eureka Labs。教育向、个人英雄主义、小团队、长周期的故事最性感，但他选择中断。这意味着他自己也认为：当下的预训练前沿是教育内容追不上的速度，参与前沿比解释前沿更紧迫。
- 他选了 Anthropic 的 pre-training。这是在告诉所有人：pre-training 的高度还没到顶，且最值得做的不是堆更多 GPU，是让模型自己来加速这件事。

研究员的脚比研究员的嘴更值钱。这次他的脚走到了 Anthropic 预训练。

![OpenAI 的叙事裂缝](05_openai_narrative_crack.png)

## 对 OpenAI 意味着什么

OpenAI 不缺人。Mira Murati 那批走了一拨之后，又招了新一拨。这次 Karpathy 离开的杀伤力不在头数，在叙事。

OpenAI 过去两年的对外故事是：基础模型由我们定义，所有人在追我们。但当 OpenAI 的联合创始人之一第二次离开、且去的是直接竞争对手做基础模型最核心的预训练，这个故事就出现了一道裂缝。裂缝不是"OpenAI 不行了"，是"OpenAI 不再是基础模型唯一最有意思的地方"。

裂缝一旦在叙事层出现，会影响下一批顶级 PhD 的 offer 选择，会影响投资人对"基础模型只剩 OpenAI 一家有戏"那套估值逻辑的耐心，也会影响内部研究员"我能不能在这里做我想做的"那种隐性判断。这种二阶效应比 Karpathy 个人代码贡献大得多。

![Scaling vs. Efficiency 两条路线](03_scaling_vs_efficiency.png)

## 对 scale-vs-efficiency 路线之争意味着什么

过去两年圈子吵的事很简单：scaling 还行不行？

一边 OpenAI / xAI / SSI 大体押 scaling，押更多数据、更大集群、更长上下文。一边 DeepMind / Anthropic / 一群学术派押效率——同样算力下结构改进、数据质量、训练方法、推理时计算。Karpathy 自己过去两年的公开发言和开源项目（nanoGPT, llm.c, nanochat, LLM101n），全部站在"小模型也能学到很多""数据效率被低估"的那一边。

他这次进的不是 Anthropic 的 Claude product，不是 alignment，是 pre-training。他要做的是用 Claude 自己加速预训练研究——这本质上是个效率工具，不是 scale 工具。

这就是这次跳槽最被低估的信号：押效率路线的代表性个体，进了押效率路线的代表性公司，去做一个最纯粹押效率的项目。三层重合。

如果他在 Anthropic 真的做出来"用模型加速模型训练"这件事，意味着 pre-training 的边际成本会被模型自己拉下来。那一刻"scaling 还有没有空间"这个问题会被改写成"AI-assisted research 能不能让 scaling 的边际收益重新上扬"——这是一个完全不同的提问方式。

## 盲区：Eureka Labs / nanochat / "回大厂是认输吗"

TechCrunch 自己也承认 Eureka Labs 的未来不清楚：

> "Karpathy hasn't shared many updates on Eureka Labs since its launch, and it's not clear if the renowned researcher will continue with the startup."
>
> "自从 Eureka Labs 上线后，Karpathy 几乎没更新动态，也不清楚他会不会继续这家创业公司。"

Karpathy 自己只说了一句："I remain deeply passionate about education and plan to resume my work on it in time."——"我仍然热爱教育，会在适当时候继续。"这话很轻。"in time"是个没有时间表的承诺。

更现实的解读是：Eureka Labs / nanochat / LLM101n 这类作品在过去 18 个月已经把"个人能做的最有影响力的 AI 教育产品长什么样"做到了它能到的位置。再往前走，不是产品力问题，是基础模型本身能不能做出新的东西支撑教育。如果基础模型那一层不再前进，教育层就只能复读旧能力。

所以"回大厂是认输还是新故事"这个二选一可能本身是错的题目。更可能的版本是：他判断自己继续在外面做教育，会被基础模型的进展节奏卡住，倒不如回到节奏的源头。等基础模型出现新一轮跃迁，教育层可以重启。

但这只是一个可能的解读。也存在另一种现实——nanochat 那种从零训练的极简栈不再是前沿，需要更大的工业基础设施才能再做出有影响力的东西，Eureka Labs 那种小团队跑不动。无论哪种，结论都是一样的：当下最值钱的工位回到了前沿实验室内部。

![Eureka 中断与五类从业者的提取](06_eureka_takeaways.png)

## 对 AI 从业者意味着什么

**对求职者**：人才流向是一种慢信号，但比 leaderboard 更准。盯三个数据点——顶级研究员去了谁家，顶级研究员离开谁家，顶级研究员公开站哪条路线但实际选了哪条。三个加起来，比读十篇估值新闻有用。

**对内容创作者 / 教育者**：Karpathy 自己用脚承认了一件事——基础模型前沿移动得比教育内容快。如果你做的是"解释前沿"，要做好被前沿本身甩开的准备；要么参与前沿，要么把内容做到"解释清楚原理之后还能复用"的层次。

**对 Anthropic 的客户和合作方**：Anthropic 在押"AI-assisted research"。这意味着未来一两年它最重要的内部产品可能不是给你用的，是给它自己研究员用的 Claude。外部能感知到的，是模型迭代速度变快、新能力以更不可预测的方式出现。

**对 OpenAI**：联创二次离开 + 资深 IC 流失 + Sutskever 走后的空位至今没人填——这三件事合起来比单独任何一件都更值得关注。叙事裂缝一旦扩大，影响的是下一轮顶级招聘和下一轮估值故事，不是当下的产品。

**对模型路线判断者**：把这次跳槽放进一个更大的图——过去 12 个月明星研究员的流向。如果"押效率路线 + 押 AI 辅助研究"这条线在 12 个月内吸走的明星比"押更大 scale"那条多，路线判断就该跟着走。

## 本期关键词

**pre-training（预训练）** —— 模型在大语料上自监督学习的阶段，决定了模型的基础能力。之后的 post-training / RLHF / 微调都基于 pre-training 输出的"底子"。Karpathy 加入的就是 Anthropic 这一层。

**AI-assisted research（AI 辅助研究）** —— 让现有模型帮研究员设计实验、跑 ablation、读 log、写训练 kernel 的方式。Anthropic 把这件事押成对 OpenAI 和 Google 的差异化。

**scaling laws（扩展定律）** —— 模型性能随参数量、数据量、算力近似幂律提升的经验规律。过去三年圈子分歧的是这条规律还有多少空间，以及边际收益在哪一段。

**data efficiency（数据效率）** —— 在同样数据量或更少数据量下提升模型能力的方向。Karpathy 过去几年的开源项目（nanoGPT, llm.c, nanochat）几乎都站在数据效率这边。

**Eureka Labs** —— Karpathy 2024 创办的 AI-native 教育公司，目标是用 AI 重做编程和 AI 教学。自上线以来更新很少，未来去向官方未表态。

**nanochat** —— Karpathy 2025 公开的从零训练一个小型 ChatGPT 的开源项目，几千行代码跑完整个 pre-training + SFT 流水线，被广泛用作教学和最小可行栈参考。

## 引用

1. [TechCrunch: OpenAI co-founder Andrej Karpathy joins Anthropic's pre-training team](https://techcrunch.com/2026/05/19/openai-co-founder-andrej-karpathy-joins-anthropics-pre-training-team/) — Maxwell Zeff, 2026-05-19。本文一手来源。
2. [Andrej Karpathy on X](https://x.com/karpathy) — Karpathy 个人账号，加入公告原文出处。
3. [Eureka Labs](https://eurekalabs.ai/) — Karpathy 2024 创办的 AI 教育公司官网。
4. [nanochat on GitHub](https://github.com/karpathy/nanochat) — Karpathy 公开的最小可行 LLM 训练栈，对应"data efficiency"路线的代表作。
