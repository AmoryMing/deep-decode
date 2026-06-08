---
title: 0.2 个百分点和 7 倍价差——DeepSeek V4 把范式之争压成一道数学题
source:
  - https://api-docs.deepseek.com/news/news260424
  - https://huggingface.co/deepseek-ai/DeepSeek-V4-Pro
  - https://www.buildfastwithai.com/blogs/deepseek-v4-pro-review-2026
author: DeepSeek（官方）+ 第三方评测
date: 2026-04-24
decoded: 2026-04-25
tags: [DeepSeek, 开源模型, MoE, 1M上下文, 范式之争, AI编程]
mode: event-decode
---

# 0.2 个百分点和 7 倍价差

**80.6 vs 80.8。$3.48 vs $25。**

开源和闭源在 SWE-bench Verified 上只差 0.2 个百分点，在每百万输出 token 价格上差 7 倍。

如果只看一个数字，看 0.2。如果只看一种姿势，看 MIT 协议。

2026 年 4 月 24 日，DeepSeek 在 HuggingFace 上传了 V4-Pro——1.6 万亿参数，开源，MIT。SWE-bench Verified 80.6%，比 Claude Opus 4.6 的 80.8% 低 0.2 个百分点。LiveCodeBench 93.5% 反超 Opus 4.6 的 88.8%。Terminal-Bench 2.0 67.9% 反超 65.4%。Codeforces Rating 3206 略高于 GPT-5.4 的 3168。

就是这几个数字，把过去三年"开源和闭源之间还差几代"的默认假设压成了一道数学题。

而那道数学题的答案不在 benchmark 表里——在过去 9 天 Anthropic 自己被迫承认的三处架构裂缝里。

## 一、0.2 个百分点为什么不能再被忽略

先把对比放齐。

| Benchmark | DeepSeek V4-Pro | Claude Opus 4.6 | GPT-5.4 | Gemini-3.1-Pro |
|---|---|---|---|---|
| SWE-bench Verified | **80.6%** | 80.8% | — | — |
| LiveCodeBench | **93.5%** | 88.8% | 91.7% | — |
| Codeforces Rating | **3206** | — | 3168 | 3052 |
| Terminal-Bench 2.0 | **67.9%** | 65.4% | — | — |
| HMMT 2026 Math | 95.2% | 96.2% | **97.7%** | — |
| HLE | 37.7% | 40.0% | 39.8% | **44.4%** |
| SimpleQA-Verified | 57.9% | — | — | **75.6%** |

数据来自 Buildfastwithai 的独立横向评测，DeepSeek 官方 tech report 与 HuggingFace 模型卡交叉验证。

四列模型，七项指标，**V4-Pro 在 4 项上要么领先要么贴近闭源最强**。SWE-bench Verified 和 Opus 4.6 差 0.2 点已经在统计噪声范围里——每次重测都可能翻盘。LiveCodeBench 反超 4.7 点是真实差距。Codeforces Rating 比 GPT-5.4 高 38 分。

但更关键的不是哪个分数高。是**这四列里只有 V4-Pro 是开源的**。

Anthropic 9 天前（4-16）发布 Opus 4.7，把更强的 Mythos Preview 锁进 Project Glasswing 联盟（AWS / Apple / Google / Microsoft / NVIDIA / JPMorgan 等 11 家），开创**模型分级发布**（Model Tiering）模式——Tier 0 内部不发布、Tier 1 联盟限制、Tier 2 公开商用、Tier 3 专业豁免。这是把"最强模型"作为一个分级访问的资产来管理。

DeepSeek V4-Pro 的发布姿态是反过来的——直接把 1.6T 参数权重 MIT 协议扔到 HuggingFace。**没有 Tier 1，没有 Glasswing，没有"未手术版只给联盟"**。

两种范式在同一周内出现在同一性能等级上。这不是"OpenAI vs Anthropic"那种功能差异，是**对"最强模型应该怎么发"这件事本身的两种结构性回答**。0.2 个百分点把这两个回答的技术差距清零了，剩下的全是范式选择。

## 二、$3.48 vs $25：定价权的转移

技术追平只是上半场。下半场更暴力。

| 模型 | 输入 $/MTok | 输出 $/MTok |
|---|---|---|
| DeepSeek V4-Pro | $1.74 | **$3.48** |
| DeepSeek V4-Flash | $0.028 | **$0.28** |
| Claude Opus 4.6 | $5 | $25 |
| GPT-5.4 | $2.5 | $15 |

V4-Pro 输出价格是 Opus 4.6 的 **14%**。V4-Flash 直接低到 **1.1%**。

Buildfastwithai 给了一个具体场景：一条生产环境 agent coding 流水线，每月输出 5000 万 token——

- V4-Pro 月成本：**$174**
- Opus 4.6 月成本：**$1,250**

差额 $1,076。一年差 $12,912。一个 50 人团队差 $645,600。

这件事的真实分量要回到上周 Anthropic 自己说过的话来读。Anthropic 增长主管 Amol Avasare 4 月 21 日在 X 上承认订阅架构和实际使用不匹配：

> "Usage has changed a lot and our current plans weren't built for this."
> 「使用模式变化很大，我们现有的计划方案并不是为此设计的。」

> "Per-subscriber usage has increased significantly, and our current plan architecture was not designed for this scale."
> 「每个订阅用户的使用量大幅增加，我们现有的计划架构不是为这种规模设计的。」

这是被 Anthropic 自己暴露出来的**Agent Loop 消耗模型**架构裂缝——agent 长跑（数小时无人值守的后台执行）让单席位实际算力消耗从聊天量级跳到持续算力量级，按席位计费的订阅模型在 agent 时代有结构性瑕疵。

DeepSeek V4 在这个裂缝上落了一锤。当 agent loop 长跑变成主流使用模式，**真正决定经济账的不是 benchmark 高低，是每百万 token 多少钱**。Opus 4.6 在 80.8% 那个 0.2 点优势上能撑多少钱？$25 减 $3.48 就是答案——闭源能维持的溢价空间，是 21.52 美元每百万输出 token，在性能差异收敛到误差范围的前提下。

这不是"降价竞争"。是**定价权易手**。过去三年闭源派一直在用"我们更强所以更贵"建立锚点，V4 用 0.2 点差距把这个锚点的合理性踩碎了。

## 三、技术暗线：怎么把 1.6 万亿参数训练稳定

看完前两节再回头看技术，会发现 V4 的几个架构创新不是孤立的工程优化——是**在专门拆"闭源派护城河"的几根关键钢筋**。

### mHC：让 1.6T 训练稳定的工程解法

Manifold-Constrained Hyper-Connections（流形约束超级连接）。听起来玄，做的事情很具体——把神经网络层之间信号传播的放大倍数从「3,000 倍」压到「1.6 倍」。

为什么这件事重要？因为千亿参数以上的 Dense 模型训练里，**信号在层间放大失控是 collapse 的主要触发器**。Anthropic、OpenAI 在万亿级别训练上的稳定性是闭源大厂的核心壁垒之一——大家心里都清楚怎么做大，但谁都不公开怎么把大模型训稳。

DeepSeek V4 tech report 里把 mHC 当成方法论展开。**这是行业首次有 1T+ 模型公开"训练稳定性"的工程解法**。

### DSA：1M 上下文的成本重构

DeepSeek Sparse Attention。第三方评测把它拆成两段——CSA（Compressed Sparse Attention）+ HCA（Heavily Compressed Attention）的混合注意力。

数据：在 1M token 上下文设置下，V4-Pro 相比 V3.2——

- 单 token 推理 FLOPs：**27%**（节约 73%）
- KV cache：**10%**（节约 90%）

这个数字配合上一节的 Mooncake / PrfaaS 看才完整。Moonshot 8 天前发的 *Prefill-as-a-Service* 论文（**相位地理解耦**——把 prefill 和 decode 分到不同数据中心跑）证明了 KVCache 可以跨数据中心调度。DeepSeek V4 的 DSA 证明了 KVCache 自己可以再被压一个数量级。**两条线并行：模型架构压缩 KV，基础设施压缩 KV 传输**。两条线汇在同一个目标——让 1M 上下文从"研究指标"变成"商业可行"。

### Muon 优化器

替代标准 AdamW。声称收敛更快、训练更稳。这一项相对小，但和 mHC 一起构成 V4 训练栈的两个非主流选择——这家中国团队没有沿用美国大厂的默认配方。

三项加起来传递一个信号：**1.6T 参数的训练稳定性曾经是闭源派最深的壁垒之一，DeepSeek 把这个壁垒的工程方案放进了一份开源 tech report**。下一代开源模型不需要从零摸索这条路。

## 四、不会被 DeepSeek 主动说的偏科

把官方叙事和独立评测放一起看，V4 是一个**代码强、数学贴近、知识弱**的偏科模型。

| 强项 | 数据 | 弱项 | 数据 |
|---|---|---|---|
| LiveCodeBench | 93.5%（V4 第一） | SimpleQA-Verified | 57.9%（vs Gemini 75.6%） |
| Codeforces Rating | 3206 | HLE | 37.7%（vs Gemini 44.4%） |
| Terminal-Bench | 67.9% | HMMT 2026 Math | 95.2%（vs GPT-5.4 97.7%） |

SimpleQA-Verified 测的是"模型记住多少世界事实"。V4-Pro 比 Gemini-3.1-Pro 低近 18 个百分点。这意味着——

- 写代码场景：V4 是接近最优解
- 问"X 公司 2024 年财报营收多少"这种事实问题：V4 显著落后

DeepSeek 官方公告对这条短板一笔带过——只用了 "trails only Gemini-3.1-Pro" 这一句外交辞令把整条短板包过去了。如果一个用户上来就用 V4 做事实查询助手，体验会和 benchmark 表给的印象不一样。

还有几条不会被官方主动说但读者必须知道的——

**第一，据 DeepSeek tech report 声称的 33T tokens 训练数据来源没公开**。DeepSeek 历史上有过 OpenAI 控诉"蒸馏 GPT-4"的事件未结案。33 万亿 token 这个量级，纯靠合规公开数据 + 开源数据集是非常紧的。版权 / 合成数据 / 竞品 distill 的混合占比，外人看不到。

**第二，"Preview" 标签在传话**。模型卡里写 "preview release—further post-training refinements are expected"。和 Anthropic 给 Mythos / Claude Design 加 "Research Preview" 是同种话术——能力天花板可以发布，稳定性边界场景没保证。production agent 场景下，版本锁定是值得纳入风险预案的项。

**第三，API 在中国基础设施**。这条对中国从业者无影响，对要做美国 / 欧盟 enterprise 客户的开发者是硬约束。开源权重可以本地部署，但调 API 走 chat.deepseek.com 时数据出了境内基础设施。这一条 Western 媒体在 4 月 24 日发布稿后已经在追问，国内媒体几乎不提。

**第四，价格的可持续性**。V4-Pro 1.6T 参数推理成本不会真的只有 $3.48 / MTok 那么低——这个价格能撑多久 DeepSeek 没说。一个团队 all-in 押注 V4 成本结构时，"价格政策可能调整"是要进财务模型分母的风险变量。

这些信息官方不会说，但企媒读者必须自己加上。

## 五、范式之争：Tier、Open、$20 同周三连击

把过去 9 天发生的事情按时间线串起来——

| 日期 | 事件 | 范式立场 |
|---|---|---|
| 4-16 | Anthropic 发布 Claude Opus 4.7（Tier 2）+ 锁 Mythos Preview 进 Project Glasswing 联盟（Tier 1） | **Tiered Release**：最强不公开 |
| 4-17 | Anthropic 发布 Claude Design + 同日 Mike Krieger 辞 Figma 董事 | 应用层扩张 |
| 4-21 | Anthropic 把 Claude Code 从 Pro 计划悄悄移除（2% 测试），开发者社区反弹 | 订阅架构裂缝暴露 |
| 4-22 | OpenAI Codex 团队公开声明"Codex stays in Plus ($20/month)" | **$20 Tier 锚定** |
| 4-23 | OpenAI 发布 GPT-5.5 + Anthropic 主动披露 Claude Code 三次降智事件 | 分叉领先升级 |
| 4-24 | DeepSeek 发布 V4-Pro + V4-Flash，MIT 开源 | **Open Release**：最强直接给 |

9 天内三种发布范式同台亮相。

**Tiered**（Anthropic）：最强模型只给联盟，公开版是经过 [[differential-training]] 削弱的。逻辑是把"能力"作为可分级访问的资产。

**$20 锚定**（OpenAI Codex）：保留低价档位的可用性作为差异化卖点。逻辑是把"性能/价格比"押在订阅档位的可达性上。

**Open**（DeepSeek）：直接把 1.6T 参数 MIT 扔出来，价格降到 14%。逻辑是把"开放性 + 价格"作为护城河。

三种范式不是互斥的产品策略选择，是对"未来 12 个月谁能定价"这件事的三种不同押注。Anthropic 押"能力稀缺性"——靠 Tiered 维持高价。OpenAI 押"价格档位 + 生态"——靠 $20 守住开发者基本盘。DeepSeek 押"性能追平 + 开源完整性"——直接把对手的定价空间压缩。

上周用来形容 GPT-5.5 vs Opus 4.7 的"**分叉领先**"框架（一家在 A 类任务领先，另一家在 B 类任务领先），本周需要扩成三叉——加上 V4 这条开源轨。

## 六、对从业者意味着什么

**对 AI 应用开发者**。把 V4-Pro 加进路由层做 A/B 测试是本周值得排进迭代周期的事。具体动作：选 3-5 个核心 agent 任务（多文件 bug 修复、code review、文档查询、终端脚本生成），用相同 prompt 同时跑 V4-Pro / Opus 4.6 / GPT-5.4，对比通过率和成本。V4-Pro 在核心任务上通过率不输 Opus 4.6 的 95% 时，切换是值得的——70% 的成本节约会直接落到财务报表。事实查询类任务（agent 长跑里需要查事实的子任务）保留闭源模型做兜底，是更稳的姿势。

**对 AI 创业者 / CTO**。成本模型可能需要重写。过去六个月假设的"模型成本占比"如果还是 30-40%，现在有机会压到 5-10%。省下来的钱用来扩团队还是扩并发，是一道战略选择题——同样预算下 agent 同时跑的并发数从 100 提到 1000，意味着 SLA 和定价层都要重新设计。"模型供应商分散"是值得在这一波纳入架构原则的——开源 + 闭源至少各两家，避免被任何单家定价权劫持。

**对企业 IT 决策者**。之前因为合规没法用 DeepSeek API（数据出境、监管）的团队，现在 MIT 开源权重打开了**本地部署**通路——这条路径之前需要 H100 集群门槛，但 V4-Flash 284B / 13B active 在 4×H100 80GB 上可推理。本地部署 + 开源权重 + 同等性能 = 一条之前不存在的合规通路，值得纳入供应商评估表。

**对中国 AI 从业者**。这是 Moonshot PrfaaS（**相位地理解耦**——把 prefill/decode 分到不同数据中心）和 DeepSeek V4 同月双发的第二刀。中国团队同时在系统层和模型层输出，Western 媒体的"中国 AI 在追赶"叙事过时了。把这两条线连起来读，下一波"中国 AI"叙事会是基础设施 + 模型双轮——这个判断值得记入路线图。

**对投资人**。据公开融资文件，Anthropic 在 2026-02 完成 Series G $30B @ $380B post-money，行业分析师预期 2026-10 IPO（目标 $60B 融资）。V4 把 Anthropic 闭源最强模型的边际溢价从"无限大"压到"21.52 美元 per MTok"。这个数字会进所有专业 AI 投资人的估值模型分母。Anthropic 的 IPO pitch 里"我们的模型能力领先 X 代"这种话不能再用——领先维度要换成 RSP（Responsible Scaling Policy）/ Glasswing 联盟 / Anthropic Labs 应用矩阵。**估值锚从"模型稀缺性"换到"政策护城河 + 应用生态"**，是 Anthropic 接下来 6 个月叙事的必修课。

## 七、收尾：定价权易手不是终点

8 天三种范式同期登台。0.2 个百分点和 7 倍价差让闭源派的能力溢价进入收敛期。

但收敛不等于结束。

闭源派还有几张牌没出——RSP 制度化和监管标准、应用层 bundle 战略（Claude Design / 数字员工 / 企业上下文工程）、深度模型（如 Mythos）保留作 Tier 1 资产、以及未来**差异化训练**（在训练阶段精确削弱某些能力同时保留其他）做行业专版。这些都不是 V4 一次发布能压塌的护城河。

但有一件事是这一周确认的：**模型权重本身不再是护城河**。能让 1.6T 参数训稳定的工程方案进了开源 tech report，能让 1M 上下文成本下降一个数量级的注意力压缩进了开源权重，价格降到闭源 14% 的同等性能也进了开源权重——三个维度同时开源。

护城河被迫迁移。从"我们手上有更强的模型"迁移到"我们手上有更深的安全合规护栏 + 更广的产品生态 + 更稳定的企业部署"。这个迁移过程会塑造未来 12 个月所有头部 AI 厂商的对外叙事。

读懂这件事，比追每周的 benchmark 数字有用得多。

---

## 本期关键词

**0.2 个百分点（The 0.2 Gap）** —— DeepSeek V4-Pro 与 Claude Opus 4.6 在 SWE-bench Verified 上的差距。统计噪声级。象征意义远超技术差异——开源和闭源的同代性能拐点。

**14% 定价（14% Pricing）** —— V4-Pro $3.48/MTok 输出价格相对 Opus 4.6 $25/MTok 的比例。决定 agent loop 长跑场景下的真实成本边界。

**Manifold-Constrained Hyper-Connections（mHC，流形约束超级连接）** —— DeepSeek V4 的训练稳定性核心创新。把神经网络层间信号放大从 3000 倍压到 1.6 倍，让 1.6 万亿参数训练不崩。是行业首次公开 1T+ 模型训练稳定性的工程解法。

**DSA（DeepSeek Sparse Attention）** —— 让 1M 上下文相比 V3.2 节约 73% FLOPs / 90% KV cache 的注意力机制。第三方评测拆解为 CSA + HCA 的混合架构。和 Moonshot PrfaaS 同月发布，构成 KVCache 压缩的两条并行路径。

**三叉发布范式（Three-Fork Release）** —— 2026-04 同周出现的三种最强模型发布姿势：Anthropic 的 Tiered（最强不公开）、OpenAI 的 $20 锚定（性价比兜底）、DeepSeek 的 Open（最强直接给）。三种范式对"未来定价权"的不同押注。

**护城河迁移（Moat Migration）** —— 当模型权重本身不再是壁垒，闭源派护城河被迫从"模型稀缺性"迁移到"政策合规 + 应用生态 + 企业部署稳定性"。这是未来 12 个月所有头部 AI 厂商对外叙事的隐藏主线。

## 原文关键引用

> "Usage has changed a lot and our current plans weren't built for this." —— Amol Avasare, Anthropic 增长主管（X, 2026-04-21）
> 「使用模式变化很大，我们现有的计划方案并不是为此设计的。」

> "Per-subscriber usage has increased significantly, and our current plan architecture was not designed for this scale." —— Amol Avasare, Anthropic
> 「每个订阅用户的使用量大幅增加，我们现有的计划架构不是为这种规模设计的。」

> "Codex will remain available in both the free and Plus ($20/month) plans." —— OpenAI Codex 团队声明（2026-04-22）
> 「Codex 将在免费版和 Plus（$20/月）计划中继续开放。」

> "trails only Gemini-3.1-Pro" —— DeepSeek V4 官方发布稿（在知识领域的对手选择措辞）

## 引用

1. [DeepSeek V4 Preview Release](https://api-docs.deepseek.com/news/news260424) —— DeepSeek 官方发布稿
2. [DeepSeek-V4-Pro on Hugging Face](https://huggingface.co/deepseek-ai/DeepSeek-V4-Pro) —— 模型权重 + 模型卡 + Tech Report PDF
3. [DeepSeek V4-Pro Review: Benchmarks, Pricing & Architecture](https://www.buildfastwithai.com/blogs/deepseek-v4-pro-review-2026) —— 第三方独立横向评测，含完整 benchmark 表 + 价格对比 + 月度成本计算
4. [DeepSeek V4 (2026): 1T Parameters, 81% SWE-bench, $0.30/MTok](https://www.nxcode.io/resources/news/deepseek-v4-release-specs-benchmarks-2026) —— 发布前的市场预期分析（注：此源为发布前推测，部分数字与最终发布版不一致）
5. [Anthropic tests reaction to yanking Claude Code from Pro](https://www.theregister.com/2026/04/22/anthropic_removes_claude_code_pro/) —— Avasare 公开承认订阅架构问题的来源

## 相关拆解

- [[claude-opus-4-7]] —— [[model-tiering]] 范式发起者，本文是其在开源轨上的反向回应
- [[codex-5-5-roundup]] —— 同周分叉领先框架的扩展
- [[your-harness-your-memory]] —— 主权让渡战的另一战线
- [[prfaas-prefill-as-a-service]] —— 中国系统层另一刀，和 V4 同月构成基础设施 + 模型双轮输出
- [[agent-loop-usage-model]] —— 价格震动的真实经济基础
