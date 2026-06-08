---
title: 英伟达 Nemotron 3 Ultra：当 agent 跑得越久越烧钱，它把单位成本砍了三成
date: 2026-06-04
type: decode
slug: 2026-06-04-nvidia-nemotron3-ultra-agents
style: default
reader: default
sources: [https://developer.nvidia.com/blog/nvidia-nemotron-3-ultra-powers-faster-more-efficient-reasoning-for-long-running-agents]
distribute: [email, xiaohongshu]
---

# 英伟达 Nemotron 3 Ultra：当 agent 跑得越久越烧钱，它把单位成本砍了三成

这一周 AI 圈的主线是 token 经济学——投资人 Tomasz Tunguz 在算每千 token 的边际成本，微软在抱怨 agent 调用太贵。这些声音都站在买方一侧喊"太贵了"。英伟达这篇博客站到了卖方一侧，给出的不是抱怨而是一个解法：发布 Nemotron 3 Ultra，一个 5500 亿参数的开放权重模型，专门为"长时间运行的智能体"（long-running agents）优化推理效率。它的核心卖点只有一句话——同样跑完一套 agent 任务，它用更少的 token、更快的吞吐、更低的总成本。

判断先放这里：agent 时代真正的瓶颈，不是模型聪不聪明，而是一个任务跑得越久、调用越多，token 就累积得越快、成本就涨得越凶。谁能把"长任务的单位成本"压下来，谁就能让一批今天因为太贵而做不起的 agent 产品变得可行。Nemotron 3 Ultra 是从模型与硬件这一侧给出的答案，下面把英伟达的具体取证拆给做 agent 产品和平台的人。

![封面](assets/gpt-img/00_cover.png)

## 本期看点

- **长时运行智能体（long-running agent）** —— 不是问一句答一句的聊天机器人，而是能跨几十轮持续规划、调工具、派子智能体、读取结果再接着干的 AI，一个任务可能跑几分钟到几小时。
- **混合 Mamba-Transformer 架构** —— 一种把"状态空间层"和传统注意力层混搭的设计，目的是让模型在处理超长上下文时不至于算力爆炸。
- **MoE（混合专家）** —— 模型总参数很大，但每个 token 只激活其中一小部分"专家"参与计算，用大模型的脑容量换小模型的运行成本。
- **NVFP4** —— 英伟达的一种 4 比特浮点量化格式，把模型权重压到极小，在同一张卡上换来更高吞吐。

## 一、为什么"长任务"对推理效率格外敏感

要看懂这个发布，先得看懂它针对的是什么问题。英伟达在博客里把 agent 的工作方式描述得很直白：

> "Agents plan, call tools, invoke sub-agents, receive information, and then pass history, outputs, and reasoning steps back into the model continuously. As tasks run longer, this constant communication increases costs and the risk of goal drift."（智能体会规划、调用工具、唤起子智能体、接收信息，然后把历史、输出和推理步骤不断地传回模型。任务跑得越久，这种持续的来回通信就越推高成本，也越容易跑偏目标。）

这段话点破了长任务推理为什么是个独立难题。一次普通对话，输入几百 token、输出几百 token 就结束了。一个 agent 任务不是这样：它每走一步都要把"到目前为止发生的一切"重新塞回模型——之前的规划、调用工具拿到的返回、每一轮的推理草稿。这些东西像滚雪球一样累积，到第二十轮时，单次调用要处理的上下文可能已经是第一轮的几十倍。

成本就是这么涨上来的。token 计费是线性的，但 agent 任务里 token 的累积接近平方级——轮数越多，每一轮要重读的历史越长。这就是为什么微软那边会嫌 agent 贵：不是单价高，是多 agent 协作把调用次数和上下文长度同时拉爆了。Nemotron 3 Ultra 瞄准的正是这个累积曲线，而不是单次对话的基准分。

![长任务里 token 如何随轮数累积](assets/gpt-img/01_token_growth.png)

## 二、架构：用 Mamba 和 MoE 同时压住两个成本来源

长任务的成本压力来自两处：上下文太长（每轮重读历史），调用太多（轮数堆叠）。Nemotron 3 Ultra 的架构设计就是分别对付这两处。

总参数 5500 亿，但每个 token 只激活 550 亿——这是 MoE 的标准打法，用十分之一的激活量跑出大模型的能力。激活越少，每个 token 的计算越便宜，这直接压低了"调用多"那一侧的成本。

对付"上下文长"那一侧，靠的是混合 Mamba-Transformer 架构。传统 Transformer 的注意力机制成本随上下文长度呈平方增长，上下文翻倍、算力涨四倍，长任务里这是致命的。Mamba 这类状态空间层的成本接近线性，代价是记忆精度不如全注意力。把两者混搭，意思是用 Mamba 层扛住长度、用少量注意力层保住精度。结果是 100 万 token 的上下文窗口，且在 Ruler @1M 这个长上下文基准上拿到 95%——英伟达说这是唯一在 100 万 token 长度上接受测试的模型。一个 agent 跑几十轮也填不满这个窗口，意味着它不必中途丢弃历史、不必因为"忘了前面"而跑偏。

还有两个细节服务于 agent 场景：LatentMoE 负责专家路由的效率，多 token 预测（multi-token prediction）让模型一次生成多个 token 而非逐字蹦，多轮任务里这直接转化为吞吐提速。

![Nemotron 3 Ultra 架构分层](assets/gpt-img/02_architecture.png)

## 三、硬数字：5 倍吞吐与 30% 成本下降

架构讲完，看英伟达摆出的效率数字，这才是给采购方看的。

吞吐方面，博客原话是"5x higher throughput compared to other open models in its class"（相比同级别的其他开放模型，吞吐高出 5 倍）。这个 5 倍来自 NVFP4 量化——博客进一步说明，在 Blackwell 架构上，NVFP4 相比 BF16 精度"在同等交互速度下，每张 GPU 的吞吐最高提升 5 倍"。把模型权重从 16 比特压到 4 比特，同一张卡能塞下更多、算得更快，这是吞吐倍数的来源。

成本方面，最硬的一个数字落在 SWE-bench Verified 这个软件工程基准上：跑完同一套题，Nemotron 3 Ultra 比同类模型"节省 30% 的成本"，且用"更少的总 token、每轮更少的 token"完成。这句话把前两节连了起来——架构上省下来的 token，最终兑现成账单上少掉的三成。对一个每天跑成千上万次 agent 任务的平台，30% 不是优化，是生死线。

性能没有为省钱而牺牲：SWE-bench Verified 在五个不同框架下稳定拿到 65% 到 70.4%；衡量 agent 完成生产力任务的 PinchBench 拿到 91%，是参与对比的模型里最高；指令遵循基准 IFBench 是 82%。对 agent 而言，跨不同框架的稳定性比单点高分更要紧——agent 产品往往架在五花八门的 harness 上，模型在哪个框架里都掉不了链子，才敢拿去跑长任务。

![5 倍吞吐与 30% 成本下降](assets/gpt-img/03_throughput_cost.png)

## 四、一份权重跑三代卡，与一种新训练法

两个容易被吞吐数字盖过、但对落地很关键的点。

其一是部署的灵活性。NVFP4 量化让同一个 checkpoint 能在 Hopper、Blackwell、Ampere 三代 GPU 上跑，不必为每种架构单独出权重。对自建推理的团队，这意味着手里的旧卡（Ampere）和新卡（Blackwell）能共用一份模型，不被锁死在最新硬件上。

其二是训练方法，英伟达叫多教师在线蒸馏（Multi-Teacher On-Policy Distillation, MOPD）：Ultra 在训练中一边生成自己的尝试，一边向十多个各有专长的"教师模型"学习，每个教师配一条领域专属的训练管线。配套的数据也很具体——2120 亿新 token 用于领域预训练，其中 40 亿法律 token 把 LegalBench 从 64.6% 拉到 74.7%，350 亿维基 token 把 SimpleQA 从 40.2% 拉到 50.2%，1730 亿刷新到 2025 年 9 月 30 日的 GitHub token。这套打法的指向很清楚：让一个通用大模型在多个专业领域同时变强，正好对应 agent 任务横跨写代码、查事实、读法条的现实。

许可证转向 OpenMDW-1.1——Linux 基金会为开放 AI 模型分发专门做的宽松许可。模型可经 Perplexity、OpenRouter、build.nvidia.com、Hugging Face 取用，外加 AWS、Google Cloud、Microsoft Foundry、DeepInfra、Together AI 等 30 多个部署伙伴。开放权重加上跨平台可取用，是英伟达在跟那些只能调 API 的闭源模型抢 agent 这块地。

## 对从业者意味着什么

这个发布把一句话钉死了：在 agent 时代，模型选型的基准从"短对话跑分"换成了"长任务单位成本"。

对做 agent 产品和平台的人：别再拿一句话问答的 benchmark 去选模型。你真正要算的是一个完整任务从头跑到尾——几十轮规划、调工具、派子智能体——总共烧多少 token、花多少钱、跑多久。Nemotron 3 Ultra 把这三个数都标出来了（少 30% 成本、更少 token、5 倍吞吐），下一个你评估的模型如果只给你 MMLU 分数而不给长任务的端到端成本，就是没回答真正的问题。把"完成一个标准任务的单位成本"做成你自己的选型指标。

对自建推理的团队：NVFP4 让一份权重跑 Hopper、Blackwell、Ampere 三代卡，这在硬件采购上给了你回旋空间——手里的旧卡不必立刻淘汰，新任务也不必为换模型重买卡。这是省下来的真金白银。

对所有人：本周买方喊贵、卖方给解法，这是同一枚硬币的两面。token 经济学的压力是真实的，但它正在把整条供应链——模型架构、量化格式、硬件设计——往"长任务更便宜"的方向逼。今天因为太贵而做不起的长链路 agent，过几个版本可能就划算了。把那些"算下来不划算"的产品想法先记下来，成本曲线在往你这边走。

## 引用

1. 英伟达技术博客《NVIDIA Nemotron 3 Ultra Powers Faster, More Efficient Reasoning for Long-Running Agents》（英伟达 Nemotron 3 Ultra 为长时运行智能体带来更快、更高效的推理）：https://developer.nvidia.com/blog/nvidia-nemotron-3-ultra-powers-faster-more-efficient-reasoning-for-long-running-agents
2. NVIDIA Nemotron 3 模型家族页（架构与基准佐证）：https://research.nvidia.com/labs/nemotron/Nemotron-3/
