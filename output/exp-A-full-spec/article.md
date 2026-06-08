---
title: 把 0.2 分给 7 倍价差——DeepSeek V4 给闭源派算的一道分配题
source:
  - https://api-docs.deepseek.com/news/news260424
  - https://huggingface.co/deepseek-ai/DeepSeek-V4-Pro
  - https://www.buildfastwithai.com/blogs/deepseek-v4-pro-review-2026
author: DeepSeek（官方）+ 第三方评测
date: 2026-04-24
decoded: 2026-04-25
tags: [DeepSeek, 开源模型, MoE, 1M上下文, 范式之争, AI编程]
mode: event-decode
branch: exp-A-full-spec
---

# 把 0.2 分给 7 倍价差

**0.2 ÷ 7 = 0.0286。**

把性能差均匀分配到价格差里，闭源每多收的一美元，能买到的相对优势是百分之 2.86。换算成单价：每多领先一个百分点，闭源派要花 21.52 美元——精确到每百万输出 token。

这道分配题是 DeepSeek 在 2026 年 4 月 24 日上传到 HuggingFace 时一并出的。SWE-bench Verified 80.6 vs 80.8，差 0.2 个百分点。每百万输出 token $3.48 vs $25，差 7 倍多一点。把后者除以前者，得到的就是闭源每个百分点优势的真实单价。

这个单价以前是没有的。三年里"闭源 = 更强 = 更贵"是同一回事，没人单独为"领先"标价。V4 把这件事摆到了报价单上。

![封面：0.2 与 21.52 的报价单](00_cover.png)

## §一 0.2 个百分点为什么不能再被忽略

把四列模型摆齐看。

| Benchmark | DeepSeek V4-Pro | Claude Opus 4.6 | GPT-5.4 | Gemini-3.1-Pro |
|---|---|---|---|---|
| SWE-bench Verified | **80.6%** | 80.8% | — | — |
| LiveCodeBench | **93.5%** | 88.8% | 91.7% | — |
| Codeforces Rating | **3206** | — | 3168 | 3052 |
| Terminal-Bench 2.0 | **67.9%** | 65.4% | — | — |
| HMMT 2026 Math | 95.2% | 96.2% | **97.7%** | — |
| HLE | 37.7% | 40.0% | 39.8% | **44.4%** |
| SimpleQA-Verified | 57.9% | — | — | **75.6%** |

数据来自 Buildfastwithai 的独立横评，DeepSeek 官方 tech report 与 HuggingFace 模型卡交叉验证。

七项指标里 V4-Pro 拿下四项第一。SWE-bench Verified 最贴的那一项差距 0.2 个百分点——这是 benchmark 重测翻盘的常见波动幅度。LiveCodeBench 反超 4.7 点是真实差距。Codeforces 高 GPT-5.4 整整 38 分。Terminal-Bench 反超 Opus 4.6 2.5 点。

但比哪一项第一更关键的是另一件事：**这四列模型，只有 V4-Pro 是开源的**。

![四列模型横评：V4 拿下四项第一](01_benchmark_matrix.png)

闭源派三年里的默认假设——"开源至少落后一两代"——在 2026-04-24 这天被踩出第一道清晰的裂痕。不是"接近"，是 SWE-bench Verified 这条最权威的代码 benchmark 上同代咬合，且其他三项反超。

这一天 9 天前，Anthropic 发布 Opus 4.7，把更强的 Mythos Preview 锁进 Project Glasswing 联盟（AWS / Apple / Google / Microsoft / NVIDIA / JPMorgan / Cisco / CrowdStrike / Broadcom / Palo Alto Networks / Linux Foundation 共 11 家）。这套发布姿势叫 **Tiered Release**——最强模型不进市场，按联盟分级访问。

DeepSeek V4-Pro 反过来。1.6T 参数权重 MIT 协议直接扔上 HuggingFace。没有 Tier 1，没有 Glasswing，没有"未阉割版只给联盟"。

两种范式在同一周的同一性能等级上同台。0.2 个百分点把技术差距清零了，剩下的全是范式选择题。

## §二 $3.48 vs $25：定价权易手

技术追平只是上半场。下半场更暴力。

| 模型 | 输入 $/MTok | 输出 $/MTok |
|---|---|---|
| DeepSeek V4-Pro | $1.74 | **$3.48** |
| DeepSeek V4-Flash | $0.028 | **$0.28** |
| Claude Opus 4.6 | $5 | $25 |
| GPT-5.4 | $2.5 | $15 |

V4-Pro 输出价是 Opus 4.6 的 **13.92%**——四舍五入 14%。V4-Flash 直接低到 **1.12%**。

![价格阶梯与月成本对比](02_price_ladder.png)

Buildfastwithai 给了一个具体场景：一条生产环境 agent coding 流水线，每月输出 5000 万 token——

- V4-Pro 月成本：**$174**
- Opus 4.6 月成本：**$1,250**

月差 $1,076。年差 $12,912。50 人团队年差 $645,600。

这个数字的真实分量要回到上周 Anthropic 自己说过的话来读。Anthropic 增长主管 Amol Avasare 在 4 月 21 日 X 上承认订阅架构和实际使用不匹配——

> "Usage has changed a lot and our current plans weren't built for this."
> 「使用模式变化很大，我们现有的计划方案并不是为此设计的。」

> "Per-subscriber usage has increased significantly, and our current plan architecture was not designed for this scale."
> 「每个订阅用户的使用量大幅增加，我们现有的计划架构不是为这种规模设计的。」

两段坦白合起来传出一个信号：**agent loop 长跑**（数小时无人值守的后台执行）让单席位实际算力消耗从聊天量级跳到持续算力量级。按席位计费的订阅模型在 agent 时代有结构性瑕疵。

DeepSeek V4 在这道裂缝上落了一锤。当 agent loop 长跑变成主流使用形态，**真正决定钱花到哪里的不是 benchmark 高几位，是每百万 token 多少钱**。Opus 4.6 在 80.8% 那个 0.2 点优势上能撑多少钱？$25 减 $3.48 就是答案——闭源每百万输出 token 能撑住的溢价空间，是 21.52 美元，前提条件是性能差异保持在统计噪声范围。

这不是降价竞争，是**定价权易手**。闭源派三年里一直拿"我们更强所以更贵"做锚。V4 用 0.2 个百分点的差距把这个锚的合理性踩在脚下。报价单上多了一行明码——"领先一个百分点 $21.52"。

## §三 mHC：把闭源派最深的钢筋拔出来开源

看完前两节再回头看技术，会发现 V4 的几个架构创新不是孤立的工程优化——是**在专门拔闭源派护城河的几根关键钢筋**。

### Manifold-Constrained Hyper-Connections（mHC）

中文译"流形约束超级连接"。做的事情很具体——把神经网络层之间信号传播的放大倍数从「3,000 倍」压到「1.6 倍」。

千亿参数以上的 Dense 模型训练里，**信号在层间放大失控是 collapse 的主要触发器**。Anthropic、OpenAI 在万亿级别训练上的稳定性是闭源大厂的核心壁垒之一——大家心里都清楚怎么把模型做大，但谁都不公开怎么把大模型训得撑得住。

DeepSeek V4 tech report 里把 mHC 当作方法论展开。**这是行业首次有 1T+ 量级模型公开"训练稳定性"的工程解法**。

> "Constrains signal amplification from exceeding 3,000x to 1.6x, enabling stable training at 1.6 trillion parameters."
> 「把信号放大倍率从超过 3000 倍约束到 1.6 倍，让 1.6 万亿参数规模下稳定训练。」

—— DeepSeek tech report（经 Buildfastwithai 引述）

![mHC：3000x → 1.6x 信号放大被压缩](03_mhc_signal_compression.png)

### DSA：1M 上下文的成本重构

DeepSeek Sparse Attention。第三方评测拆为两段——CSA（Compressed Sparse Attention）+ HCA（Heavily Compressed Attention）的混合注意力。

数据：1M token 上下文设置下，V4-Pro 相比 V3.2——

- 单 token 推理 FLOPs：**27%**（节约 73%）
- KV cache：**10%**（节约 90%）

这个数字配合 Moonshot 8 天前发的 *Prefill-as-a-Service* 论文（**相位地理解耦**——把 prefill 和 decode 分到不同数据中心跑）看才完整。Moonshot 证明 KVCache 可以跨数据中心调度。DeepSeek V4 的 DSA 证明了 KVCache 自己可以再被压一个数量级。**两条线并行：模型架构压 KV，基础设施压 KV 传输**。汇向同一目标——让 1M 上下文从研究指标变成商业可行。

### Muon 优化器

替代标准 AdamW。声称收敛更快、训练更稳。和 mHC 一起构成 V4 训练栈的两个非主流选择——这家中国团队没有沿用美国大厂的默认配方。

三项加起来传递一个信号：**1.6T 参数训练稳定性曾经是闭源派最深的壁垒之一，DeepSeek 把它的工程方案放进了一份开源 tech report**。下一代开源模型不需要从零摸索这条路。这根钢筋被搬到了地上。

## §四 偏科状元——V4 不会主动说的事

把官方叙事和独立评测放一起看，V4 是个**代码强、数学贴近、知识弱**的偏科状元。

| 强项 | 数据 | 弱项 | 数据 |
|---|---|---|---|
| LiveCodeBench | 93.5%（V4 第一） | SimpleQA-Verified | 57.9%（vs Gemini 75.6%） |
| Codeforces Rating | 3206 | HLE | 37.7%（vs Gemini 44.4%） |
| Terminal-Bench | 67.9% | HMMT 2026 Math | 95.2%（vs GPT-5.4 97.7%） |

SimpleQA-Verified 测的是模型记住多少世界事实。V4-Pro 比 Gemini-3.1-Pro 低 17.7 个百分点。直白翻译——

- 写代码场景：V4 是接近最优解
- 问"X 公司 2024 年财报营收多少"这种事实：V4 显著落后

DeepSeek 官方公告把这条短板用一句外交辞令包过去——"trails only Gemini-3.1-Pro"。一笔带过。如果一个团队上来就用 V4 做事实查询助手，体验会和 benchmark 表给的总体印象不一样。

还有几条不会被官方主动说但读者必须自己加上的——

**第一，据 DeepSeek tech report 声称的 33T tokens 训练数据来源没公开**。DeepSeek 历史上有过 OpenAI 控诉"蒸馏 GPT-4"的事件未结案。33 万亿 token 这个量级，纯靠合规公开数据 + 开源数据集是非常紧的。版权 / 合成数据 / 竞品 distill 的混合占比，外人看不到。

**第二，"Preview" 标签在传话**。模型卡里写 "preview release—further post-training refinements are expected"。和 Anthropic 给 Mythos / Claude Design 加 "Research Preview" 是同种话术——能力天花板能发布，稳定性边界场景没保证。production agent 部署里，版本锁定是值得纳入风险预案的项。

**第三，API 在中国基础设施**。这条对中国从业者无影响，对要做美国 / 欧盟 enterprise 客户的开发者是硬约束。开源权重可本地部署，但调 API 走 chat.deepseek.com 时数据出了境内基础设施。

**第四，价格的可持续性**。V4-Pro 1.6T 参数推理成本不会真的只有 $3.48 / MTok 那么低——这个价格能撑多久 DeepSeek 没说。一个团队 all-in 押注 V4 成本结构时，"价格政策可能调整"是要进财务模型分母的风险变量。

报价单上的 $21.52 / point 漂亮，但背后这四条是要写进合同附件的小字。

## §五 三叉范式：Tier、$20、Open 同周登台

把过去 9 天串起来——

| 日期 | 事件 | 范式立场 |
|---|---|---|
| 4-16 | Anthropic 发布 Opus 4.7（Tier 2）+ 锁 Mythos Preview 进 Project Glasswing 联盟（Tier 1） | **Tiered Release**：最强不公开 |
| 4-17 | Anthropic 发布 Claude Design + Mike Krieger 辞 Figma 董事 | 应用层扩张 |
| 4-21 | Anthropic 把 Claude Code 从 Pro 计划悄悄移除（2% 测试），开发者社区反弹 | 订阅架构裂缝暴露 |
| 4-22 | OpenAI Codex 团队公开声明"Codex stays in Plus ($20/month)" | **$20 锚定** |
| 4-23 | OpenAI 发布 GPT-5.5 + Anthropic 主动披露 Claude Code 三次降智事件 | 分叉领先升级 |
| 4-24 | DeepSeek 发布 V4-Pro + V4-Flash MIT 开源 | **Open Release**：最强直接给 |

9 天内三种发布范式同台亮相，挤在同一性能等级。

![三叉范式：Tier / $20 / Open 同周登台](04_three_fork_paradigm.png)

**Tiered Release**（Anthropic）：最强模型只进联盟，公开版是经过差异化训练削弱的。逻辑是把"能力"作为可分级访问的资产。

**$20 锚定**（OpenAI Codex）：保留低价档位的可用性作为差异化卖点。逻辑是把"性价比"押在订阅档位的可达性上。

**Open Release**（DeepSeek）：1.6T 参数 MIT 直接给，价格降到 14%。逻辑是把"开放性 + 价格"作为护城河。

这三种范式不是互斥的产品策略选择，是对"未来 12 个月谁能定价"这件事的三种结构性押注。Anthropic 押"能力稀缺"——靠 Tier 维持高价。OpenAI Codex 押"档位 + 生态"——靠 $20 守住开发者基本盘。DeepSeek 押"性能追平 + 开源完整"——直接把对手的定价空间踩薄。

上周给 GPT-5.5 vs Opus 4.7 总结的"分叉领先"框架——一家在 A 类任务领先，另一家在 B 类任务领先——本周需要扩成三叉。第三叉是开源的全维度同代。

## §六 对从业者意味着什么

![5 类身份决策路径](05_landing_paths.png)

**对 AI 应用开发者**。把 V4-Pro 加进路由层做 A/B 测试是本周值得排进迭代周期的事。具体动作：选 3-5 个核心 agent 任务（多文件 bug 修复、code review、文档查询、终端脚本生成），用相同 prompt 同时跑 V4-Pro / Opus 4.6 / GPT-5.4，对比通过率和成本。V4-Pro 在核心任务上通过率不输 Opus 4.6 的 95% 时，切换是值得的——70% 的成本节约会直接落到财务报表。事实查询类任务（agent 长跑里需要查事实的子任务）保留闭源做兜底，是更稳的姿势。

**对 AI 创业者 / CTO**。成本模型可能需要重写。过去六个月假设的"模型成本占比"如果还是 30-40%，现在有机会压到 5-10%。省下来的钱用来扩团队还是扩并发，是一道战略选择题——同样预算下 agent 同时跑的并发数从 100 提到 1000，意味着 SLA 和定价层都要重新设计。"模型供应商分散"是值得在这一波纳入架构原则的——开源 + 闭源至少各两家，避免被任何单家定价权锁死。

**对企业 IT 决策者**。之前因为合规没法用 DeepSeek API（数据出境、监管）的团队，现在 MIT 开源权重打开了**本地部署**通路——这条路径之前需要 H100 集群门槛，但 V4-Flash 284B / 13B active 在 4×H100 80GB 上可推理。本地部署 + 开源权重 + 同等性能 = 一条之前不存在的合规通路。值得纳入供应商评估表。

**对中国 AI 从业者**。Moonshot PrfaaS（**相位地理解耦**——把 prefill / decode 分到不同数据中心）和 DeepSeek V4 同月双发是基础设施 + 模型的双轮输出。Western 媒体的"中国 AI 在追赶"叙事在这两条线汇合后过时了。把这两条线连起来读，下一波"中国 AI"叙事会是基础设施 + 模型双轮——这个判断值得记入 12 个月路线图。

**对投资人**。据公开融资文件，Anthropic 在 2026-02 完成 Series G $30B @ $380B post-money，行业分析师预期 2026-10 IPO（目标 $60B 融资）。V4 把 Anthropic 闭源最强模型的边际溢价从"无限大"压到"21.52 美元 per MTok"——这个数字会进所有专业 AI 投资人的估值模型分母。Anthropic 的 IPO pitch 里"我们的模型能力领先 X 代"这种话不能再用——领先维度要换成 RSP（Responsible Scaling Policy）/ Glasswing 联盟 / Anthropic Labs 应用矩阵。**估值锚从"模型稀缺性"换到"政策护城河 + 应用生态"**，是 Anthropic 接下来 6 个月叙事的必修课。

## §七 护城河迁移不是终点

9 天三种范式同期登台。0.2 个百分点和 7 倍价差让闭源派的能力溢价进入收敛期。

但收敛不等于结束。闭源派还有几张牌没出——RSP 制度化和监管标准、应用层 bundle 战略（Claude Design / 数字员工 / 企业上下文工程）、深度模型（如 Mythos）保留作 Tier 1 资产、以及未来**差异化训练**（在训练阶段精确削弱某些能力同时保留其他）做行业专版。这些都不是 V4 一次发布能压塌的护城河。

但有一件事是这一周确认的：**模型权重本身不再是护城河**。能让 1.6T 参数训得撑得住的工程方案进了开源 tech report。能让 1M 上下文成本下降一个数量级的注意力压缩进了开源权重。价格降到闭源 14% 的同等性能也进了开源权重。三个维度同时开源。

护城河被迫迁移。从"我们手上有更强的模型"迁移到"我们手上有更深的安全合规护栏 + 更广的产品生态 + 更稳定的企业部署"。这个迁移过程会塑造未来 12 个月所有头部 AI 厂商的对外叙事。

报价单上"领先一个百分点 $21.52"这一行明码，是这次迁移开始的信号。CTO 的财务模型从此多一个可比变量。读懂这件事比追每周的 benchmark 数字有用得多。

---

## 本期关键词

**0.2 ÷ 7 等式（The 0.2-over-7 Equation）** —— DeepSeek V4-Pro 与 Claude Opus 4.6 的性能差除以价格差。这道分配题的解（0.0286）量化了闭源每多收一美元能买到的相对优势。一旦这个数字被算出来，"更强所以更贵"的等号就被拆成了报价单上的明码。

**$21.52 单价（The $21.52 Unit Price）** —— 闭源派每多领先一个 SWE-bench 百分点的精确单价（每百万输出 token）。是 0.2 ÷ 7 的逆运算结果。CTO 的财务模型从此多一个可比变量。

**Manifold-Constrained Hyper-Connections（mHC，流形约束超级连接）** —— DeepSeek V4 的训练稳定性核心创新。把神经网络层间信号放大从 3000 倍压到 1.6 倍，让 1.6 万亿参数训练撑得住。是行业首次有 1T+ 模型公开训练稳定性的工程解法。

**DSA（DeepSeek Sparse Attention）** —— 让 1M 上下文相比 V3.2 节约 73% FLOPs / 90% KV cache 的注意力机制。第三方评测拆解为 CSA + HCA 的混合架构。和 Moonshot PrfaaS 同月发布，构成 KVCache 压缩的两条并行路径。

**三叉范式（Three-Fork Release）** —— 2026-04 同周出现的三种最强模型发布姿势：Anthropic 的 Tiered Release（最强不公开）、OpenAI Codex 的 $20 锚定（性价比兜底）、DeepSeek 的 Open Release（最强直接给）。三种范式对"未来 12 个月谁能定价"的不同押注。

**偏科状元（Lopsided Top Student）** —— 一种性能形态：在某些 benchmark 上世界第一，在另一些 benchmark 上显著落后。V4 是代码强、知识弱的典型——LiveCodeBench 93.5% 第一，SimpleQA 比 Gemini 低 17.7 个百分点。官方话术常用"trails only X"把这类偏科外交辞令化。

**护城河迁移（Moat Migration）** —— 当模型权重本身不再是壁垒，闭源派护城河被迫从"模型稀缺性"迁移到"政策合规 + 应用生态 + 企业部署稳定性"。这是未来 12 个月所有头部 AI 厂商对外叙事的隐藏主线。

## 原文关键引用

> "Constrains signal amplification from exceeding 3,000x to 1.6x, enabling stable training at 1.6 trillion parameters." —— DeepSeek tech report
> 「把信号放大倍率从超过 3000 倍约束到 1.6 倍，让 1.6 万亿参数规模下稳定训练。」

> "Usage has changed a lot and our current plans weren't built for this." —— Amol Avasare, Anthropic 增长主管（X, 2026-04-21）
> 「使用模式变化很大，我们现有的计划方案并不是为此设计的。」

> "Per-subscriber usage has increased significantly, and our current plan architecture was not designed for this scale." —— Amol Avasare
> 「每个订阅用户的使用量大幅增加，我们现有的计划架构不是为这种规模设计的。」

> "Codex will remain available in both the free and Plus ($20/month) plans." —— OpenAI Codex 团队（2026-04-22）
> 「Codex 将在免费版和 Plus（$20/月）计划中继续开放。」

> "trails only Gemini-3.1-Pro" —— DeepSeek V4 官方发布稿
> 「仅次于 Gemini-3.1-Pro」

## 引用

1. [DeepSeek V4 Preview Release](https://api-docs.deepseek.com/news/news260424) —— DeepSeek 官方发布稿
2. [DeepSeek-V4-Pro on Hugging Face](https://huggingface.co/deepseek-ai/DeepSeek-V4-Pro) —— 模型权重 + 模型卡 + Tech Report PDF
3. [DeepSeek V4-Pro Review: Benchmarks, Pricing & Architecture](https://www.buildfastwithai.com/blogs/deepseek-v4-pro-review-2026) —— 第三方独立横向评测，含完整 benchmark 表 + 价格对比 + 月度成本计算
4. [Anthropic tests reaction to yanking Claude Code from Pro](https://www.theregister.com/2026/04/22/anthropic_removes_claude_code_pro/) —— Avasare 公开承认订阅架构问题的来源
5. [DeepSeek V4 (2026): 1T Parameters, 81% SWE-bench, $0.30/MTok](https://www.nxcode.io/resources/news/deepseek-v4-release-specs-benchmarks-2026) —— 发布前的市场预期分析
