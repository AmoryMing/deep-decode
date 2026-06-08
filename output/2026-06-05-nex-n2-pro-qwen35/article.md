---
title: 一个开源模型在 Terminal Bench 上追到 Opus 前面，它没自己训底座
slug: 2026-06-05-nex-n2-pro-qwen35
type: decode
created: 2026-06-05
updated: 2026-06-05
style: default
reader: default
distribute: [email, xiaohongshu]
tags: [开源模型, Qwen3.5, MoE, 推理模型, token经济, 国产模型]
source: https://x.com/SiliconFlowAI/status/2062549952266723493
---

# 一个开源模型在 Terminal Bench 上追到 Opus 前面，它没自己训底座

neolab（Nex AGI）这周放出 Nex-N2-Pro。一句话说清它干了什么：拿阿里今年 2 月开源的 Qwen3.5-397B-A17B 当底座，只做后训练（post-training），就把一个开源权重模型推到了"GPT-5.5 和 Claude Opus 4.7 级"的位置。SiliconFlow 当天 T+0 上线，头两周免费。

值得盯住的不是"又一个号称对标 Opus 的模型"。是它在 Terminal-Bench 2.1 上拿到 75.3，把 Claude Opus 4.7 的 69.7 甩在了后面——而 Terminal-Bench 测的恰恰是这一年最烧钱、闭源厂商最想守住的那块地：让模型在真实终端里自己跑命令、修代码、把一个多步骤任务办完。一个谁都能下载、Apache 2.0 授权、还不用自己训底座的模型，在这块地上反超了前沿闭源模型之一。

![封面](assets/gpt-img/00_cover.png)

## 本期看点

- neolab 没训底座。Qwen3.5 这个 397B 的 MoE 大模型是阿里 2 月开源的，neolab 只在上面做后训练，就把它调到了前沿水平——这是"后训练当道"最直接的证据。
- 它在 Terminal-Bench 2.1（75.3）上超过 Opus 4.7（69.7），SWE-Bench Pro（58.8）压过 GPT-5.5（58.6）。这些是 agent 干活的实测场，不是刷榜题。
- MoE 的账：397B 总参数，每次只激活 17B。你拿到的是大模型的知识量，付的是小模型的推理成本。
- "Adaptive Thinking"——模型自己决定要不要想、想多深。简单动作直接做，关键决策才深推。这条直接砍的是推理 token，也就是你的账单。

## neolab 这次没造车，只调了引擎

先把"谁做了什么"分清楚，这是整件事的关键。

底座是 Qwen3.5-397B-A17B，阿里 2026 年 2 月开源的旗舰多模态模型。架构是混合专家（Mixture-of-Experts，MoE）：总共 397B 参数，但每处理一个 token 只激活其中约 17B，靠 512 个"专家"子网络里的路由机制挑出一小撮干活。这是 Qwen3.5 自己的工程，跟 neolab 无关。

neolab（Nex AGI）做的是后训练（post-training）——在已经预训练好的底座上，用偏好对齐、agent 任务数据、工具调用轨迹这些手段去"调教"模型的行为，不重新预训练。打个不那么严谨但好懂的比方：阿里造好了一台 397B 排量的引擎，neolab 没碰引擎本身，只重调了点火、变速和油门响应，让它在"自己跑终端、自己调工具"这类活上表现得像台赛车。

为什么这件事值得单独拎出来讲。"Post-training is having a moment"——SiliconFlow 那条推文的原话，翻成中文是"后训练正当道"。它的潜台词是：预训练这条最烧钱、最需要万卡集群的路，已经被几家开源底座（Qwen、DeepSeek、GLM 这些）趟出来并公开了；后来者不必再砸几亿美金从零训一个 400B 模型，只要拿开源底座做后训练，就能摸到前沿。前沿模型的"护城河"从"谁有最大的预训练"，正在往"谁的后训练数据和方法更好"挪。而后者的门槛，比前者低一个数量级。

![neolab 只做后训练](assets/gpt-img/01_posttrain.png)

## Terminal-Bench 上反超 Opus，意味着什么

光说"对标 Opus"是营销话术，得看它在哪块地上对标。

neolab 公布的对比里，最硬的一组是 Terminal-Bench 2.1：Nex-N2-Pro 拿 75.3，GPT-5.5 是 83.4，Claude Opus 4.7 是 69.7。它没追上 GPT-5.5，但确实越过了 Opus 4.7。

Terminal-Bench 测什么，得讲清楚，否则这个数字没有重量。它把模型扔进一个真实的命令行环境，给一个多步骤任务——比如"在这个仓库里把这个失败的测试修好""配好这套环境并跑通"——然后看模型能不能自己敲命令、读报错、改文件、再跑、直到任务真的完成。它不是选择题，不是补全代码片段，是端到端把活干完。这正是过去一年 Claude Code、Codex 这类终端 agent 产品的核心战场，也是闭源厂商最舍不得开放的能力。

再看两条 SWE-Bench（在真实 GitHub issue 上修 bug 的测试）：SWE-Bench Verified，Nex-N2-Pro 80.8；SWE-Bench Pro（更难的一档），它 58.8，GPT-5.5 是 58.6——这一项它略微压过了 GPT-5.5。通用推理上，GPQA Diamond（博士级科学难题）它 90.7，离 GPT-5.5 的 93.6、Opus 的 94.2 还差一截，但已经在第一梯队的下沿。

把这些数字摆一起看到的不是"开源全面碾压闭源"。是"在 agent 干活这块具体的地上，开源已经追到能跟最强闭源同台报价的程度"。差距还在，但已经不是代差，是分差。对一个不用自己训底座的开源模型，这个分差小得让人意外。

![基准对照](assets/gpt-img/02_benchmark.png)

## MoE 的账，和省 token 的账

把成本这条线讲透，因为这才是开源模型真正的杀招。

第一笔账是 MoE 本身。稠密（dense）模型每处理一个 token，整个网络都要参与计算——一个 400B 的稠密模型，每个 token 都在烧 400B 参数的算力。MoE 不一样：397B 是它"知道"的总量，但每个 token 只点亮其中约 17B 个参数干活。你拿到的是一个 397B 模型的知识广度，付的却是接近 17B 模型的推理算力。这就是为什么 Qwen3.5 这类"大总参、小激活"的模型能在保持能力的同时，把每 token 的服务成本压到远低于同等能力的稠密模型。

第二笔账是 neolab 后训练加进去的"Adaptive Thinking"（自适应思考）。模型卡的原话：让模型自己决定何时思考、思考多深——简单动作快速执行，关键决策才彻底推理。

要理解这条为什么重要，得先知道推理模型的成本结构。推理模型（reasoning model）在给出答案前会先生成一长串"思考"内容（reasoning tokens），这些 token 你看不到最终结果里，但每一个都按 token 计费、都占推理时间。问题是绝大多数推理模型一视同仁：问它"1+1 等于几"，它也可能先想三百个 token。Adaptive Thinking 要做的就是让模型学会"看人下菜"——琐碎的事直接做，难的事才动用深推理。这条直接砍的是那串看不见的思考 token，也就是你为"模型在想"这件事付的钱。

两笔账叠起来，开源模型在"够用且便宜"这个坐标上的位置就清楚了。它不一定在每个榜单的最高分上压过闭源前沿，但它把"达到前沿八九成能力"的单位成本，压到了闭源厂商很难跟的地步——你能自己部署、能按 token 谈价、底座还是 Apache 2.0。本周我们一直在讲的 token 经济，到这里收口：当能力追平到"分差"级别，比的就不再是谁更强，是谁每办成一件事更便宜。

![两笔成本账](assets/gpt-img/03_cost.png)

## 还有几件事没追平

不把短板说清，前面的判断就站不住。

GPDval（一个衡量经济价值产出的综合指标）上，Nex-N2-Pro 是 1585，GPT-5.5 是 1769，Opus 4.7 是 1753——这一项差得不小，说明在"端到端完成有经济价值的复杂工作"这种最综合的考法上，它还落在闭源前沿后面一档。GPQA、Terminal-Bench 的总分也都还没追上 GPT-5.5。

部署门槛也是真实的。397B 的模型要跑起来，通常得多张 H100、多机部署；neolab 还建议用它定制的 sglang 分支来服务，才能拿到最佳性能。"开源免费"不等于"零成本运行"——你省的是 API 调用费和厂商锁定，付的是自己那套推理基础设施的钱和工程量。对没有 GPU 集群的团队，更现实的路是走 SiliconFlow 这类托管服务，那又回到了按 token 付费的逻辑，只是单价更低、可迁移性更强。

所以准确的说法是：开源国产模型在"够用且便宜"这条线上追平了闭源前沿，不是在"最强"这条线上。但对绝大多数实际场景，"够用且便宜"恰恰是更重要的那条线。

![尚未追平的几项](assets/gpt-img/04_gaps.png)

## 对从业者意味着什么

选型时，开源国产模型已经不是"预算不够时的备胎"，是一个需要认真评估的正选。下次做模型选型，别默认"要 agent 能力就只能上 GPT-5.5 / Opus"——把 Nex-N2-Pro 这类基于 Qwen3.5 后训练的模型放进对比清单，在你自己的真实任务上跑一遍 Terminal-Bench 式的端到端评测，再算单位成本。很可能发现，那点分差换来的成本下降，对你的业务是划算的。

如果你在做 agent 产品，盯住"后训练正当道"这个信号。它意味着你不必等闭源厂商开放能力，也不必自己训底座——拿一个强开源底座，在你的垂直场景数据上做后训练，就有机会做出在该场景里不输前沿的模型。护城河正在从"谁的预训练大"挪到"谁的后训练数据和方法好"，而后者是你能下场竞争的。

如果你在算 AI 账单，把"推理 token 成本"单列出来盯。MoE 的小激活 + Adaptive Thinking 这类自适应推理深度，正在把推理模型那串看不见的思考 token 变成一个可优化项。模型选型不该只比能力分，得比"每办成一件事花多少钱"——而省 token 这件事，开源这边正在卷得很凶。

## 关键词

- **后训练（Post-training）**：在已经预训练好的底座模型上，用对齐、agent 任务数据、工具调用轨迹等手段调教模型行为，不重新从零预训练。门槛远低于预训练。
- **MoE（混合专家）**：模型由很多"专家"子网络组成，每个 token 只激活其中一小部分。Qwen3.5-397B-A17B 即 397B 总参数、每 token 激活约 17B，512 个专家。好处是知识量按总参数算、算力成本按激活参数算。
- **推理 token（Reasoning tokens）**：推理模型在给最终答案前生成的一长串"思考"内容。它不出现在结果里，但按 token 计费、占用推理时间。是推理模型成本的主要来源之一。
- **Adaptive Thinking（自适应思考）**：neolab 后训练加入的能力，让模型自己判断该不该深想、想多深——简单任务快速执行，关键决策才彻底推理，从而压低推理 token 消耗。
- **Terminal-Bench**：把模型扔进真实命令行环境、给多步骤任务、看它能否自己敲命令把活端到端干完的基准。测的是终端 agent 的真实干活能力，不是选择题。

## 引用

- SiliconFlow 官方推文（主信源）："Post-training is having a moment — Nex-N2-Pro from neolab @NexEcosystem proves it. Built on Qwen3.5-397B-A17B, delivers GPT-5.5 and Claude Opus 4.7–level performance."（后训练正当道——neolab 的 Nex-N2-Pro 证明了这点。基于 Qwen3.5-397B-A17B，达到 GPT-5.5 和 Claude Opus 4.7 级性能。）https://x.com/SiliconFlowAI/status/2062549952266723493
- Nex-N2-Pro 模型卡（Hugging Face，nex-agi）：Apache 2.0 授权；基准成绩 Terminal-Bench 2.1 = 75.3、SWE-Bench Verified = 80.8、SWE-Bench Pro = 58.8、GPQA Diamond = 90.7、GDPval = 1585；"Adaptive Thinking lets the model decide on its own when to think and how deeply."（自适应思考让模型自己决定何时思考、思考多深。）https://huggingface.co/nex-agi/Nex-N2-Pro
- Qwen3.5-397B-A17B 模型卡与技术资料：397B 总参数 / 17B 激活、512 专家、262K 上下文、原生多模态（VLM），2026 年 2 月开源。https://huggingface.co/Qwen/Qwen3.5-397B-A17B
