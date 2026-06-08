---
title: DeepSeek V4 不是开源追赶——它是把闭源派的定价锚撬出地基
source:
  - https://api-docs.deepseek.com/news/news260424
  - https://huggingface.co/deepseek-ai/DeepSeek-V4-Pro
  - https://www.buildfastwithai.com/blogs/deepseek-v4-pro-review-2026
author: DeepSeek 官方公告 + 第三方评测
date: 2026-04-24
decoded: 2026-04-25
tags: [DeepSeek, 开源模型, MoE, 1M上下文, 范式之争, 定价权, AI编程]
---

# DeepSeek V4 不是开源追赶——它是把闭源派的定价锚撬出地基

**4 月 24 日，DeepSeek 把 1.6 万亿参数的 V4-Pro 扔到 HuggingFace，MIT 协议。SWE-bench Verified 80.6%，比 Claude Opus 4.6 的 80.8% 低 0.2 个百分点。LiveCodeBench 反超 4.7 点。Codeforces Rating 比 GPT-5.4 高 38 分。每百万输出 token 价格 $3.48——是 Opus 4.6 的 14%。**

这不是又一个开源模型在追赶闭源最强。这是一次范式回应——9 天前 Anthropic 用 Project Glasswing 把"最强模型只给联盟"立成新规矩，DeepSeek 用同代性能 + MIT 权重把那条规矩撬出地基。这件事比 0.2 个百分点本身更值得拆开看。

![封面](00_cover.png)

## 一、开场：DeepSeek 发了一个"刻意贴着对手"的版本

先看官方公告里那一句不起眼的措辞。DeepSeek 在发布稿里描述 V4-Pro 在知识类基准上的表现，用了一个外交辞令：

> "trails only Gemini-3.1-Pro"
>
> （仅次于 Gemini-3.1-Pro）

请注意 "trails only" 这个用法。它不是"我们没追上"，而是"在所有非 Gemini 的对手里我们最强"。一句话同时完成了承认弱项和锚定第二名。把 Anthropic Opus、OpenAI GPT、Meta Llama、Mistral 全部排在 V4 之后，只用一个词。

这不是营销话术。这是定位话术。

配合另一个事实一起看：V4-Pro 在 SWE-bench Verified 上比 Claude Opus 4.6 低 0.2 个百分点，在 LiveCodeBench 上反超 4.7 个百分点，在 Codeforces 上比 GPT-5.4 高 38 分。DeepSeek 选择把发布日期定在 4-24，正好压在 Anthropic 4-16 发 Opus 4.7、OpenAI 4-23 发 GPT-5.5 之后的第二天。这不是巧合排片。

把两件事串起来，你会发现 DeepSeek 在做一件比"开源追赶"更精准的事：**贴着闭源最强的性能曲线走，把每一项指标的差距压到统计噪声范围里，然后用 MIT 协议把这条等价曲线整体公开**。这篇拆解要讲的第一件事是：V4-Pro 不是 DeepSeek 的下一代——它是 DeepSeek 愿意让闭源派看见的那条"我们和你齐平"的等价线。

![同代性能 vs 价格断崖](01_parity_vs_price.png)

## 二、三个转向：为什么 0.2 个百分点值得写篇公告

把性能贴近放一边，单看 V4 相对 V3.2 的提升，主线并不是 benchmark 峰值。值得从业者盯住的是三个非常具体的方向转变。

### 转向一：从"参数规模"到"训练稳定性"

DeepSeek V4 tech report 里有一段措辞冷静但杀伤力巨大的话——他们把 mHC（Manifold-Constrained Hyper-Connections，流形约束超级连接）作为方法论展开，描述这套机制把神经网络层间信号放大从 3,000 倍压到 1.6 倍。

换句话说，**同样要训 1.6T 参数，过去训不稳的关键变量被压成了原来的二千分之一**。对任何一家想训万亿参数模型的团队，这意味着 collapse 的概率从"工程冒险"降到"工程可控"。

这里面有一个没说出口的假设：过去三年，能否把模型训到 1T+ 是闭源大厂的核心壁垒之一。Anthropic、OpenAI、Google 都训得动，但谁都没公开怎么把大模型训稳。Buildfastwithai 在评测里把这一点说得很直白——mHC 是"行业首次"看到 1T+ 模型把训练稳定性的工程解法写进公开 tech report。

这个转向背后是行业阶段的切换。万亿参数训练的竞争焦点正在从"谁能训出来"切到"谁能让训出来的过程被复用"。开源 tech report 把曾经的"配方专利"变成了"基础设施"。下一代开源团队不需要从零摸索这条路。

### 转向二：从"长上下文"到"上下文成本"

DSA（DeepSeek Sparse Attention）在 1M token 上下文设置下，相对 V3.2，把单 token 推理 FLOPs 压到 27%，KV cache 压到 10%。

90% 的 KV cache 节约——这个数字在 1M 上下文场景里不是优化，是重新定价。过去半年里，agentic AI 的最大成本黑洞从来不是"模型不够强"，而是"上下文越长越烧钱"。处理 50 页文档，KV cache 撑爆显存；agent 跑 30 轮工具调用，每轮重算让响应延迟翻倍；多文件 codebase 全量上下文，每次 attention 计算都在为不会再读到的 token 付费。

V4 给这个问题发了两个并行武器。第三方评测把 DSA 拆成了 CSA（Compressed Sparse Attention）+ HCA（Heavily Compressed Attention）的混合架构。CSA 处理近端高频信号，HCA 处理远端稀疏信号，两段不同压缩比并行运行，让 1M 上下文从"研究指标"变成"商业定价的一项"。

这两段架构合起来说明一件事：**DeepSeek 在把 1M 上下文产品化的颗粒度从"能跑"推到"算得清"**。过去 1M 是给厂商写发布稿用的展示数字，现在它要走进定价表。

![DSA 双段压缩示意](02_dsa_compression.png)

### 转向三：从"权重发布"到"训练栈发布"

V4 的 Muon 优化器是这一转向最明显的信号。这不是模型升级——这是**把整个训练栈的非主流选择一并公开**。

Muon 替代 AdamW，配合 mHC 的层间稳定方案，构成了 V4 训练栈的两个关键非默认选择。这家中国团队没有沿用美国大厂的默认配方，而且把这套自选配方作为方法论一并公开。

有意思的地方在于 Muon 这一项相对其他两项创新而言收益小很多——它单独不会让人写头条。但 DeepSeek 仍然把它写进 tech report 并展开。这是一个极具信号的工程动作：他们在发布一份"完整可复现的训练栈"，而不是发布"我们训完之后的成果"。如果一个开源团队用 V4 同款 mHC + DSA + Muon 训出第二个 1T 模型，DeepSeek 不损失什么——损失的是闭源派的"训练栈是黑箱"这层叙事。

这一转向的隐含判断是：**模型权重的差异化红利在变薄，训练栈的可复现性在变厚**。同一套权重，谁把它的训练过程组织成更可复制的工程方案，谁就赢得开源生态的下一棒。Llama 3、Qwen3、Mistral 都在做这件事；DeepSeek 这次直接亮底牌，意味着它认为这个战场重要到不能藏着掖着。

## 三、Benchmark 真相：亮眼数字背后的偏科

V4 公布的 benchmark 数字确实好看：

| 指标 | DeepSeek V4-Pro | Claude Opus 4.6 | GPT-5.4 | Gemini-3.1-Pro |
|---|---|---|---|---|
| SWE-bench Verified | 80.6% | 80.8% | — | — |
| LiveCodeBench | **93.5%** | 88.8% | 91.7% | — |
| Codeforces Rating | **3206** | — | 3168 | 3052 |
| Terminal-Bench 2.0 | **67.9%** | 65.4% | — | — |
| HMMT 2026 Math | 95.2% | 96.2% | **97.7%** | — |
| HLE | 37.7% | 40.0% | 39.8% | **44.4%** |
| SimpleQA-Verified | 57.9% | — | — | **75.6%** |

数据来自 Buildfastwithai 的独立横向评测，DeepSeek 官方 tech report 与 HuggingFace 模型卡交叉验证。

看起来是和闭源最强齐平。但如果你把分项拆开看，故事就不一样了：

![Benchmark 偏科地图](03_benchmark_skew.png)

> V4 是一个**代码强、数学贴近、知识弱**的偏科模型。LiveCodeBench 第一、Codeforces 第一、Terminal-Bench 第一——这三项是 agent coding 场景的核心指标，V4 全部领先。HMMT Math 95.2%，比 GPT-5.4 的 97.7% 低 2.5 点；HLE 37.7%，比 Gemini 的 44.4% 低 6.7 点；SimpleQA-Verified 57.9%，比 Gemini 的 75.6% 低 17.7 点。SimpleQA 测的是"模型记住多少世界事实"——V4 在这一项上的差距已经超出"统计噪声"，进入"产品体验差异"。

这带来一个很有意思的变化：**benchmark 榜单不再是单纯的能力展示，它成了一个范式选择工具**。DeepSeek 把 V4 的强项集中在 agent coding，知识类弱项用一句 "trails only Gemini-3.1-Pro" 包过去——这是一种 capability targeting + restraint signaling 的组合拳。既让闭源派在他们最赚钱的代码场景里被同代追平，又把"知识深度"这个 V4 暂时打不动的战场让出去。

发布稿里没把 SimpleQA-Verified 的 17.7 点差距放在显眼位置——他们更关心的不是跟 Gemini 比知识深度，而是强调"代码场景我们和闭源最强齐平"这个叙事。这条叙事如果成立，对靠代码场景吃饭的 Anthropic 和 OpenAI 来说，护城河被动一根钢筋。

## 四、定价权：一个被轻描淡写的范式转折

回到价格表。V4-Pro 输出 $3.48/MTok，Opus 4.6 输出 $25/MTok。这是整个发布里商业密度最高的一组数字，但 DeepSeek 把它放在公告中段，没展开讲。

定价权易手意味着什么？意味着一个开源模型可以在同代性能下，把闭源派的边际溢价从"无限大"压到"21.52 美元每百万输出 token"。这在过去是非常难做的——开源和闭源之间通常隔着一代到两代性能差距，溢价怎么定都说得通。V4 在这里宣称他们做到了精准对齐：SWE-bench 差 0.2 点（统计噪声）、LiveCodeBench 反超、Codeforces 反超、Terminal-Bench 反超。代码场景下，"更强所以更贵"这个锚点失去了基础。

这件事的副作用已经显现。一周前，Anthropic 增长主管 Amol Avasare 在 X 上有过一段相当诚实的承认：

> "Usage has changed a lot and our current plans weren't built for this."
>
> （使用模式变化很大，我们现有的计划方案并不是为此设计的。）

> "Per-subscriber usage has increased significantly, and our current plan architecture was not designed for this scale."
>
> （每个订阅用户的使用量大幅增加，我们现有的计划架构不是为这种规模设计的。）

这是 Anthropic 自己暴露出来的 agent loop 消耗模型架构裂缝——agent 长跑（数小时无人值守的后台执行）让单席位实际算力消耗从聊天量级跳到持续算力量级，按席位计费的订阅模型在 agent 时代有结构性瑕疵。同一周内，Anthropic 把 Claude Code 从 Pro 计划悄悄移除（4-21），OpenAI Codex 团队公开声明 "Codex stays in Plus ($20/month)"（4-22），开发者社区两边都炸了。

这是一个被低估的 AI 商业节点。如果 V4 的定价能维持，未来可能看到的模式是：**一个底座模型，开源 + 同代性能 + 14% 价格，三件套同时压在闭源派的定价表上**。一条具体的算账线就摆在工程师桌上——一条月输出 5000 万 token 的 agent 流水线，V4-Pro 月成本 $174，Opus 4.6 月成本 $1,250，差额 $1,076。一年差 $12,912。一个 50 人团队差 $645,600。

DeepSeek 没明说，但这组算式的存在本身就是范式的一次预演——对内部代码场景，给的是"开源同代版"（V4-Pro）；对需要事实查询深度的场景，给的是"专项闭源版"（Gemini / Opus）。同一份模型选型清单，两种定价逻辑。

![定价权易手算式](04_pricing_math.png)

## 五、一个新概念：定价权易手（Pricing Anchor Drift）

把同代性能 + MIT 权重 + 14% 价格 + agent loop 消耗模型这几件事串起来看，DeepSeek 实际上完成了一个可以叫做 **Pricing Anchor Drift（定价权易手）** 的范式动作。

过去三年 LLM 行业的默认假设是"闭源最强 = 闭源定价锚"。GPT-4 比 GPT-3.5 强所以更贵，Opus 比 Sonnet 强所以更贵，闭源最强比开源最强强所以更贵。强即贵，贵即合理。

定价权易手打破了这个假设。它把定价拆成四个层级：

**Layer 0 — 能力锚消失**：当开源在核心场景（agent coding）和闭源差距压进统计噪声，"更强所以更贵"失去了锚点（V4-Pro vs Opus 4.6 的 0.2 点差距即是此层）。

**Layer 1 — 价格锚下沉**：开源价格成为新的市场参考价。$3.48/MTok 的输出价格不是 V4 的卖点——它是闭源派下一次定价时的天花板。

**Layer 2 — 溢价范围被压扁**：闭源能维持的边际溢价从"无限大"压到"21.52 美元每百万输出 token"。这个数字会进所有专业 AI 投资人的估值模型分母。

**Layer 3 — 护城河被迫迁移**：闭源派的护城河叙事必须从"模型能力领先 X 代"换成"安全合规护栏 + 应用生态 + 企业部署稳定性"——能力维度的护城河被开源强行展平。

这个四层结构让 DeepSeek 一次性解决了几个矛盾：**既能向开源生态展示完整训练栈，又能向闭源派展示同代等价；既能用 MIT 协议保留开放性，又能用 14% 价格直接压定价权**。这是一个精巧的产品分层。

OpenAI 和 Anthropic 目前都还没有对应这种结构的反制方案。这可能意味着两种解读：要么它们准备硬扛能力溢价直到下一代模型断层式领先；要么它们正在筹划新的定价结构（按席位 + 按 token 复合定价、agent loop 专项定价、Tier 1 联盟豁免定价）但还没找到对外陈述的框架。无论哪种，DeepSeek 的这次发布都在行业里立了一个 precedent——未来如果 Llama 5 或 Qwen 4 发了一个"性能贴近 + MIT + 价格再低一档"的版本，我们知道它的剧本是谁写的。

## 六、盲区：这次发布没说的事

有几件事值得专门拎出来看 DeepSeek **没说**的部分。

**第一，33T tokens 训练数据的来源没公开**。DeepSeek tech report 里声称的 33 万亿 token 训练数据，没给出版权来源 / 合成数据 / 第三方蒸馏的占比。DeepSeek 历史上有过 OpenAI 控诉"蒸馏 GPT-4"事件未结案。33T 这个量级，纯靠合规公开数据 + 开源数据集是非常紧的。版权官司一旦推进，"训练数据来源"是技术之外的 wildcard。这是 DeepSeek 有意保留的信息暗场。

**第二，"Preview" 标签在传话**。模型卡里写 "preview release—further post-training refinements are expected"。和 Anthropic 给 Mythos / Claude Design 加 "Research Preview" 是同种话术——能力天花板可以发布，稳定性边界场景没保证。production agent 场景下，版本锁定是值得纳入风险预案的项。具体的边界：连续工作 4 小时后任务完成度下降多少？多步工具调用失败率？这些运营级指标都没公布。这让 V4 的"agent coding 第一"听起来更像是 benchmark 瞬时分数，而不是工程级 SLA 指标。

**第三，价格的可持续性**。$3.48/MTok 是当前定价，不是承诺定价。1.6T 参数推理成本不会真的只有这么低——这个价格能撑多久 DeepSeek 没说。2024 年 V3 发布时 DeepSeek 也曾有过把价格压到对手 1/10 的动作，半年后部分场景定价回调过。"价格政策可能调整"是要进财务模型分母的风险变量。一个团队 all-in 押注 V4 成本结构时，至少要预留闭源兜底的开关位。

**第四，API 在中国基础设施**。这条对中国从业者无影响，对要做美国 / 欧盟 enterprise 客户的开发者是硬约束。开源权重可以本地部署绕过这条，但调 chat.deepseek.com API 时数据出了境内基础设施。这条 Western 媒体在 4 月 24 日发布稿后已经在追问，国内媒体几乎不提。

**第五，差异化训练的反应没出**。Anthropic 4-16 在 Opus 4.7 公告里展开过 differential training 的方法论——在训练阶段精确削弱某些能力同时保留其他。V4 tech report 里完全没回应这条技术路径。这个可能是 DeepSeek 接下来一年最值得观察的方向：开源派会跟进 differential training，还是反过来用 MIT 协议把"无差异化"作为反向护城河？这个问题 V4 没给答案。

## 七、对 AI 从业者意味着什么

把以上都整理完，对不同角色的从业者有具体的判断提示：

**对 AI 应用开发者**。把 V4-Pro 加进路由层做 A/B 测试是本周值得排进迭代周期的事。具体做法：选 3-5 个核心 agent 任务（多文件 bug 修复、code review、文档查询、终端脚本生成），用相同 prompt 同时跑 V4-Pro / Opus 4.6 / GPT-5.4，对比通过率和成本。当 V4-Pro 在核心任务上通过率不输 Opus 4.6 的 95% 时，切换是值得的——70% 的成本节约会直接落到财务报表。事实查询类子任务（agent 长跑里需要查事实的环节）保留闭源模型做兜底，是更稳的姿势。

**对 AI 创业者 / CTO**。成本模型可能需要重写。过去六个月假设的"模型成本占比"如果还是 30-40%，现在有机会压到 5-10%。省下来的钱用来扩团队还是扩并发，是一道战略选择题——同样预算下 agent 同时跑的并发数从 100 提到 1000，意味着 SLA 和定价层都要重新设计。模型供应商分散是值得在这一波纳入架构原则的——开源 + 闭源至少各两家，避免被任何单家定价权劫持。

**对企业 IT 决策者**。之前因为合规没法用 DeepSeek API（数据出境、监管）的团队，MIT 开源权重打开了本地部署通路。V4-Flash 284B / 13B active 在 4×H100 80GB 上可推理——这条路径之前需要 H100 集群门槛已被打破。本地部署 + 开源权重 + 同等性能的合规通路，是供应商评估表里值得加列的一项。

**对中国 AI 从业者**。这是 Moonshot PrfaaS（4-16 发布的相位地理解耦论文，把 prefill 和 decode 分到不同数据中心跑）和 DeepSeek V4 同月双发的第二刀。中国团队同时在系统层和模型层输出，Western 媒体的"中国 AI 在追赶"叙事过时了。把这两条线连起来读，下一波"中国 AI"叙事会是基础设施 + 模型双轮——这个判断值得记入路线图。

**对 AI 投资人**。据公开融资文件，Anthropic 在 2026-02 完成 Series G $30B @ $380B post-money，行业分析师预期 2026-10 IPO（目标 $60B 融资）。V4 把闭源最强模型的边际溢价从"无限大"压到"21.52 美元 per MTok"。这个数字会进所有专业 AI 投资人的估值模型分母。Anthropic 的 IPO pitch 里"我们的模型能力领先 X 代"这种话不能再用——领先维度要换成 RSP / Glasswing 联盟 / 应用生态。**估值锚从"模型稀缺性"换到"政策护城河 + 应用生态"**，是 Anthropic 接下来 6 个月叙事的必修课。

**对行业观察者**。Pricing Anchor Drift 是未来 12 个月的核心看点。观察 Llama 5、Qwen 4、Mistral 下一代会不会跟进类似定价（同代性能 + 更低价格），以及监管者（特别是 AISI、欧盟 AI Office）会不会把"开源同代等价"写进合规模板做反垄断参考。如果写进去了，那闭源派的能力溢价空间会被进一步合规压缩。

## 八、本期关键词

**0.2 个百分点（The 0.2 Gap）** —— DeepSeek V4-Pro 与 Claude Opus 4.6 在 SWE-bench Verified 上的差距（80.6% vs 80.8%），位于统计噪声范围内。为什么值得知道：这是开源和闭源在 agent coding 核心场景上同代等价的物理证据，是定价权易手的起点。

**14% 定价（14% Pricing）** —— V4-Pro $3.48/MTok 输出价格相对 Opus 4.6 $25/MTok 的比例。为什么值得知道：决定 agent loop 长跑场景下的真实成本边界，未来 12 个月所有 AI 厂商定价时的隐藏天花板。

**Manifold-Constrained Hyper-Connections（mHC，流形约束超级连接）** —— DeepSeek V4 的训练稳定性核心创新。把神经网络层间信号放大从 3,000 倍压到 1.6 倍，让 1.6 万亿参数训练不崩。为什么值得知道：这是行业首次有 1T+ 模型把训练稳定性的工程方案放进开源 tech report，下一代开源团队不需要从零摸索。

**DeepSeek Sparse Attention（DSA，稀疏注意力）** —— 让 1M 上下文相比 V3.2 节约 73% FLOPs / 90% KV cache 的注意力机制。第三方评测拆解为 CSA（Compressed Sparse Attention）+ HCA（Heavily Compressed Attention）的混合架构。为什么值得知道：和 Moonshot PrfaaS 同月发布构成 KVCache 压缩的两条并行路径——模型架构压 KV，基础设施压 KV 传输——让 1M 上下文从研究指标变成商业定价的一项。

**Muon 优化器（Muon Optimizer）** —— V4 用来替代 AdamW 的训练优化器。和 mHC 一起构成 V4 训练栈的两个非主流选择。为什么值得知道：这一项单独看收益有限，但它的存在标志着 DeepSeek 公开的不是模型权重而是完整可复现的训练栈——训练栈可复现性正在成为开源生态新一轮的差异化维度。

**Pricing Anchor Drift（定价权易手）** —— 当开源在核心场景和闭源差距压进统计噪声，闭源派"更强所以更贵"的能力锚失去基础，开源价格成为新的市场参考价。为什么值得知道：可能成为未来 12 个月所有前沿 AI 厂商商业策略的隐藏主线，是估值锚从"模型稀缺性"迁移到"政策合规 + 应用生态"的触发器。

**三叉发布范式（Three-Fork Release）** —— 2026-04 同周出现的三种最强模型发布姿势：Anthropic 的 Tiered（最强不公开，给 Glasswing 联盟）、OpenAI Codex 的 $20 锚定（性价比兜底）、DeepSeek 的 Open（最强直接给 + 14% 价格）。为什么值得知道：这是 LLM 行业第一次三种发布范式在 9 天内同台亮相，三种范式对"未来 12 个月谁定价"的不同押注会塑造下一个产品周期。

**护城河迁移（Moat Migration）** —— 当模型权重本身不再是壁垒，闭源派护城河从"模型稀缺性"被迫迁移到"政策合规 + 应用生态 + 企业部署稳定性"。为什么值得知道：是未来 12 个月所有头部 AI 厂商对外叙事的隐藏主线，也是 IPO pitch 必须重写的部分。

## 原文关键引用

> "trails only Gemini-3.1-Pro"
>
> （仅次于 Gemini-3.1-Pro。）—— DeepSeek V4 官方发布稿（在知识领域的对手选择措辞）

> "Constrains signal amplification from exceeding 3,000x to 1.6x, enabling stable training at 1.6 trillion parameters."
>
> （把信号放大倍数从超过 3000 倍约束到 1.6 倍，让 1.6 万亿参数稳定训练成为可能。）—— DeepSeek tech report，经 Buildfastwithai 引述

> "Usage has changed a lot and our current plans weren't built for this."
>
> （使用模式变化很大，我们现有的计划方案并不是为此设计的。）—— Amol Avasare, Anthropic 增长主管（X, 2026-04-21）

> "Codex will remain available in both the free and Plus ($20/month) plans."
>
> （Codex 将在免费版和 Plus（$20/月）计划中继续开放。）—— OpenAI Codex 团队声明（2026-04-22）

## 引用

1. [DeepSeek V4 Preview Release](https://api-docs.deepseek.com/news/news260424) —— 本期拆解原文（DeepSeek 官方公告，2026-04-24）
2. [DeepSeek-V4-Pro on Hugging Face](https://huggingface.co/deepseek-ai/DeepSeek-V4-Pro) —— 模型权重 + 模型卡 + Tech Report PDF
3. [DeepSeek V4-Pro Review: Benchmarks, Pricing & Architecture](https://www.buildfastwithai.com/blogs/deepseek-v4-pro-review-2026) —— 第三方独立横向评测，含完整 benchmark 表 + 价格对比 + 月度成本计算
4. [Anthropic tests reaction to yanking Claude Code from Pro](https://www.theregister.com/2026/04/22/anthropic_removes_claude_code_pro/) —— Avasare 公开承认订阅架构问题的来源
5. [Introducing Claude Opus 4.7](https://www.anthropic.com/news/claude-opus-4-7) —— 9 天前 Tiered Release 范式发起者，本文是其在开源轨上的反向回应
6. [Moonshot PrfaaS: Prefill-as-a-Service](https://moonshot.cn/research/prfaas-2026) —— 同月中国系统层另一刀，和 V4 构成基础设施 + 模型双轮输出
