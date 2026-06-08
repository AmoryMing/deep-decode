---
title: 1.6 万亿参数砸进 HuggingFace 那一刻，闭源派的定价权听见了第一声脆响
date: 2026-04-25
tags: [DeepSeek V4, 范式之争, 开源模型, AI 定价权]
---

# 1.6 万亿参数砸进 HuggingFace 那一刻，闭源派的定价权听见了第一声脆响

上周还在 Claude Max 跑 agent 的人，本周需要重写一份成本表。

DeepSeek 在 4 月 24 日把 V4-Pro 的权重、模型卡、技术报告一起放上了 HuggingFace。1.6 万亿参数总量，49B 激活，MIT 协议，1M 上下文默认开启。SWE-bench Verified 拿到 80.6%，比 Claude Opus 4.6 的 80.8% 低 0.2 个百分点。LiveCodeBench 93.5%，反超 Opus 4.6 的 88.8%。Codeforces Rating 3206，比 GPT-5.4 的 3168 高 38 分。Terminal-Bench 2.0 拿到 67.9%，反超 Opus 4.6 的 65.4%。

这几个数字配在一起的结果，是过去三年"开源和闭源还差几代"的默认假设，被压缩成了一道纯粹的数学题：每百万输出 token 的价格差是 $25 减 $3.48 等于 $21.52，性能差是 0.2 个百分点。

而这道数学题落在 Anthropic 头上的时机，比题目本身更尖锐——过去 9 天里，Anthropic 自己已经在三个不同方向暴露过订阅模型、能力分级、稳定性边界的裂缝。V4 不是从天上落下来砸到一块完整的护城河，是落到了一块已经裂了三道缝的护城河上。

## 本期关键词

**0.2 个百分点（The 0.2 Gap）**——V4-Pro 在 SWE-bench Verified 上和 Opus 4.6 的差距。统计噪声级别，重测可能翻盘。它的意义不是技术差异，是开源闭源同代性能拐点的象征。

**14% 输出价（14% Pricing）**——V4-Pro 输出 $3.48/MTok，是 Opus 4.6 输出价 $25/MTok 的 14%。V4-Flash 进一步压到 1.1%。决定 agent loop 长跑场景下真实的成本曲线。

**mHC（Manifold-Constrained Hyper-Connections，流形约束超级连接）**——DeepSeek V4 训练稳定性的核心机制。把神经网络层间信号放大从 3000 倍压到 1.6 倍，让 1.6 万亿参数模型不在训练过程中崩塌。据 DeepSeek tech report，是行业首次公开 1T+ 模型训练稳定性的工程方案。

**DSA（DeepSeek Sparse Attention）**——让 1M 上下文相比 V3.2 节约 73% FLOPs、90% KV cache 的注意力压缩。和 Moonshot 4 月 16 日发的 PrfaaS 在同一个月把 KV 这件事从两个方向各压一刀。

**三叉发布范式（Three-Fork Release）**——Anthropic 的 Tiered（最强不公开）、OpenAI 的 $20 锚定（性价比兜底）、DeepSeek 的 Open（最强直接给）。9 天内三种姿势同台亮相，每一种都是对未来 12 个月谁能定价的不同押注。

## 一、0.2 个百分点为什么不能再被忽略

把四列模型的七项指标摆齐看。

V4-Pro 在四项 coding 类 benchmark 上要么领先要么贴近闭源最强：SWE-bench Verified 80.6% 对 Opus 4.6 的 80.8%，差 0.2 点；LiveCodeBench 93.5% 高于 Opus 4.6 的 88.8% 和 GPT-5.4 的 91.7%；Codeforces Rating 3206 高于 GPT-5.4 的 3168；Terminal-Bench 2.0 67.9% 高于 Opus 4.6 的 65.4%。这组数字来自 Buildfastwithai 的独立横评，DeepSeek tech report 与 HuggingFace 模型卡交叉对应。

弱项也不藏。SimpleQA-Verified 57.9%，比 Gemini-3.1-Pro 的 75.6% 低近 18 个百分点。HLE 37.7%，比 Gemini 的 44.4% 低 6.7 点。HMMT 2026 Math 95.2%，比 GPT-5.4 的 97.7% 低 2.5 点。这是一个代码强、数学贴近、知识弱的偏科模型——DeepSeek 官方公告对这条短板用一句外交辞令带过：trails only Gemini-3.1-Pro。

但偏科不是这次发布的重点。重点在于：四列模型里只有 V4-Pro 是开源的。

Anthropic 9 天前（4 月 16 日）发布 Opus 4.7，把更强的 Mythos Preview 锁进 Project Glasswing 联盟——AWS、Apple、Google、Microsoft、NVIDIA、JPMorgan、Cisco、CrowdStrike、Broadcom、Palo Alto Networks、Linux Foundation 共 11 家。"模型分级发布"在那一周第一次被作为一种正式的发布姿态展示给整个行业看：Tier 0 内部不发布，Tier 1 联盟限制，Tier 2 公开商用，Tier 3 专业豁免。最强模型从那时起被 Anthropic 当成一项分级访问的资产来管理。

DeepSeek V4-Pro 的姿势是反过来的。1.6 万亿参数权重、训练稳定性细节、注意力压缩论文，一起 MIT 扔到 HuggingFace。没有 Tier 1，没有联盟，没有"未手术版只给特定客户"。

两种发布姿态在同一周内出现在同一个性能等级上。0.2 个百分点把两者的技术差距推到统计噪声里，剩下的全是范式选择的差异。

## 二、$3.48 vs $25：定价权的转移

技术追平只是上半场。

V4-Pro 输入 $1.74、输出 $3.48，每百万 token。V4-Flash 输入 $0.028、输出 $0.28。Opus 4.6 输入 $5、输出 $25。GPT-5.4 输入 $2.5、输出 $15。

V4-Pro 的输出价是 Opus 4.6 的 14%。V4-Flash 直接低到 1.1%。

Buildfastwithai 给了一个具体场景：一条生产环境 agent coding 流水线，每月输出 5000 万 token。V4-Pro 月成本 $174，Opus 4.6 月成本 $1250。差额 $1076，一年 $12912，一个 50 人团队一年差 $645600。

这件事的真实分量要回到上周 Anthropic 自己说过的话来读。Anthropic 增长主管 Amol Avasare 4 月 21 日在 X 上这样说：

> "Usage has changed a lot and our current plans weren't built for this."
> 「使用模式变化很大，我们现有的计划方案并不是为此设计的。」

> "Per-subscriber usage has increased significantly, and our current plan architecture was not designed for this scale."
> 「每个订阅用户的使用量显著增加，我们现有的计划架构不是为这种规模设计的。」

Avasare 同一组帖子里还提到 Claude Code 的消耗集中在大约 2% 的 prosumer 用户身上。这是 Anthropic 自己暴露出来的 agent 时代订阅架构裂缝——agent 长跑（数小时无人值守的后台执行）让单席位实际算力消耗从聊天量级跳到持续算力量级，按席位计费的订阅在这种使用模式下会出现结构性瑕疵。Anthropic 4 月 21 日把 Claude Code 从 Pro 计划悄悄移除，做的是 2% 测试，开发者社区当天就发现并反弹。

DeepSeek V4 在这条裂缝上落了一锤。当 agent loop 长跑变成主流使用模式，决定经济账的不是 benchmark 上 0.2 个百分点的高低，是每百万 token 多少钱。Opus 4.6 那 0.2 点优势能撑多少钱？$25 减 $3.48 = $21.52，每百万输出 token。这是闭源在性能差落入误差范围之后还能维持的溢价空间——一道闭源派现在必须自己算清楚的题。

这不是降价竞争。是定价权易手。过去三年闭源派一直在用"我们更强所以更贵"建立锚点，V4 用 0.2 个百分点把这个锚点的合理性踩碎了。

## 三、技术暗线：1.6 万亿参数怎么训稳定

看完前两节再回头看技术，会发现 V4 的几个架构选择不是孤立的工程优化——是专门拆闭源派护城河的几根关键钢筋。

第一根是 mHC——Manifold-Constrained Hyper-Connections。听起来玄，做的事情很具体：把神经网络层之间信号传播的放大倍数从 3000 倍压到 1.6 倍。

这件事为什么重要？千亿参数以上的 Dense 模型训练里，信号在层间放大失控是 collapse 的主要触发器。Anthropic、OpenAI 在万亿级别训练的稳定性曾经是闭源大厂的核心壁垒之一——大家心里都清楚怎么把模型做大，但谁都不公开怎么把大模型训稳。DeepSeek V4 tech report 把 mHC 当成方法论展开。据 tech report 自述，这是行业首次有 1T+ 模型公开训练稳定性的工程解法。

第二根是 DSA——DeepSeek Sparse Attention。第三方评测把它拆解成两段混合架构：CSA（Compressed Sparse Attention）加 HCA（Heavily Compressed Attention）。1M token 上下文设置下，V4-Pro 相比 V3.2 单 token 推理 FLOPs 27%（节约 73%），KV cache 10%（节约 90%）。

这个数字配合 Moonshot 4 月 16 日发布的 *Prefill-as-a-Service* 论文一起读才完整。PrfaaS 把 prefill 和 decode 分到不同数据中心跑，证明 KVCache 可以跨数据中心调度。DSA 证明 KVCache 自己可以再被压一个数量级。两条线并行——模型架构压缩 KV，基础设施压缩 KV 传输——同月汇在同一个目标上：让 1M 上下文从研究指标变成商业可行。

第三根是 Muon 优化器替代 AdamW。声称收敛更快、训练更稳。这一项相对小，但和 mHC 一起构成 V4 训练栈的两个非主流选择——这家中国团队没有沿用美国大厂的默认配方。

三根钢筋加起来传递一个信号：1.6 万亿参数训练稳定性曾经是闭源派最深的壁垒之一，DeepSeek 把这个壁垒的工程方案放进了一份开源 tech report。下一代开源模型不需要从零摸索这条路。

## 四、不会被官方主动说的偏科

把官方叙事和独立评测放一起看，V4 是一个代码强、数学贴近、知识弱的偏科模型。

LiveCodeBench 93.5% 是 V4 第一，Codeforces 3206、Terminal-Bench 67.9% 都在领先位。而 SimpleQA-Verified 57.9%，比 Gemini 75.6% 低近 18 点；HLE 37.7%，比 Gemini 44.4% 低 6.7 点；HMMT 95.2%，比 GPT-5.4 97.7% 低 2.5 点。

SimpleQA-Verified 测的是模型记住多少世界事实。V4-Pro 在这一项上的差距对应一个具体的产品判断：写代码场景 V4 接近最优解，问"X 公司 2024 年财报营收多少"这种事实问题 V4 显著落后。一个团队上来就用 V4 做事实查询助手，体验会和 benchmark 表给的整体印象不一样。

还有几条不会被官方主动说但读者必须自己加上的——

第一，据 DeepSeek tech report 声称的 33 万亿 token 训练数据来源没公开。DeepSeek 历史上有过 OpenAI 控诉"蒸馏 GPT-4"的事件未结案。33 万亿这个量级，纯靠合规公开数据加开源数据集是非常紧的。版权、合成数据、竞品 distill 的混合占比，外人看不到。

第二，"Preview" 标签在传话。模型卡里写 "preview release—further post-training refinements are expected"。和 Anthropic 给 Mythos / Claude Design 加 "Research Preview" 是同一种话术——能力天花板可以发布，稳定性边界场景没保证。production agent 场景下，版本锁定是值得纳入风险预案的项。

第三，API 在中国基础设施。这条对中国从业者无影响，对要做美国、欧盟 enterprise 客户的开发者是硬约束。开源权重可以本地部署，但调 API 走 chat.deepseek.com 时，数据出了境内基础设施。Western 媒体在 4 月 24 日发布稿后已经开始追问，国内媒体几乎不提。

第四，价格的可持续性。V4-Pro 1.6T 参数推理成本不会真的只有 $3.48/MTok 那么低——这个价格能撑多久 DeepSeek 没说。一个团队 all-in 押注 V4 成本结构时，"价格政策可能调整"是要进财务模型分母的风险变量。

## 五、Tier、Open、$20：9 天三种范式同台

把过去 9 天发生的事按时间线串起来，会看到一个比单次发布更密的剧情。

4 月 16 日，Anthropic 发布 Claude Opus 4.7（Tier 2 公开商用）+ 锁 Mythos Preview 进 Project Glasswing 联盟（Tier 1 联盟限制）。范式立场——Tiered Release，最强不公开。

4 月 17 日，Anthropic 发布 Claude Design + 同日 Mike Krieger 辞 Figma 董事。应用层扩张，往设计和开发工具的产品线伸手。

4 月 21 日，Anthropic 把 Claude Code 从 Pro 计划悄悄移除，做 2% 测试。开发者社区当天反弹。Avasare 那组承认订阅架构问题的推文就发在这一天。订阅架构裂缝第一次被自己人公开承认。

4 月 22 日，OpenAI Codex 团队公开声明：

> "Codex will remain available in both the free and Plus ($20/month) plans."
> 「Codex 将在免费版和 Plus（$20/月）计划中继续开放。」

范式立场——$20 Tier 锚定。把低价档位的可用性作为差异化卖点钉死。

4 月 23 日，OpenAI 发布 GPT-5.5。同一天 Anthropic 主动披露 Claude Code 三次降智事件——主动披露的目的是夺回叙事主动权。两家在分叉领先的两端继续往前走。

4 月 24 日，DeepSeek V4-Pro + V4-Flash MIT 开源。范式立场——Open Release，最强直接给。

9 天三种发布范式同台亮相。

Tiered（Anthropic）的逻辑是把"能力"作为可分级访问的资产。最强模型只给联盟，公开版是经过差异化训练削弱的。维持高价靠能力稀缺性。

$20 锚定（OpenAI Codex）的逻辑是把"性能/价格比"押在订阅档位的可达性上。守住开发者基本盘，靠生态而非靠模型代差。

Open（DeepSeek）的逻辑是把"开放性 + 价格"作为护城河。1.6T 权重 MIT 扔出来，价格降到闭源 14%。直接把对手的定价空间压缩。

三种范式不是互斥的产品策略选择，是对未来 12 个月谁能定价这件事的三种不同押注。Anthropic 押能力稀缺性，OpenAI 押价格档位加生态，DeepSeek 押性能追平加开源完整性。

上周用来形容 GPT-5.5 vs Opus 4.7 的"分叉领先"框架（一家在 A 类任务领先，另一家在 B 类任务领先），本周需要扩成三叉——加上 V4 这条开源轨。

## 六、对从业者意味着什么

对 AI 应用开发者。把 V4-Pro 加进路由层做 A/B 测试是本周值得排进迭代周期的事。具体动作是选 3 到 5 个核心 agent 任务（多文件 bug 修复、code review、文档查询、终端脚本生成），用相同 prompt 同时跑 V4-Pro、Opus 4.6、GPT-5.4，对比通过率和成本。V4-Pro 在核心任务上通过率不输 Opus 4.6 的 95% 时，切换是值得的——70% 的成本节约会直接落到财务报表。事实查询类任务（agent 长跑里需要查事实的子任务）保留闭源模型做兜底，是更稳的姿势。

对 AI 创业者和 CTO。成本模型可能需要重写。过去六个月假设的"模型成本占比 30 到 40%"现在有机会压到 5 到 10%。省下来的钱用来扩团队还是扩并发，是一道战略选择题——同样预算下 agent 同时跑的并发数从 100 提到 1000，意味着 SLA 和定价层都要重新设计。模型供应商分散是值得在这一波纳入架构原则的，开源加闭源至少各两家，避免被任何单家定价权劫持。

对企业 IT 决策者。之前因为合规没法用 DeepSeek API（数据出境、监管）的团队，现在 MIT 开源权重打开了本地部署通路。V4-Flash 284B / 13B active 在 4 张 H100 80GB 上可推理——这条路径之前需要 H100 集群门槛已被打破。本地部署 + 开源权重 + 同等性能 = 一条之前不存在的合规通路，值得纳入供应商评估表。

对中国 AI 从业者。这是 Moonshot PrfaaS 和 DeepSeek V4 同月双发的第二刀。中国团队同时在系统层和模型层输出，Western 媒体的"中国 AI 在追赶"叙事过时了。把这两条线连起来读，下一波"中国 AI"叙事会是基础设施加模型双轮——这个判断值得记入路线图。

对投资人。据公开融资文件，Anthropic 在 2026 年 2 月完成 Series G $30B 融资 @ $380B post-money 估值，行业分析师预期 2026 年 10 月 IPO（目标 $60B 融资）。V4 把 Anthropic 闭源最强模型的边际溢价从"无限大"压到"$21.52 per MTok"。这个数字会进所有专业 AI 投资人的估值模型分母。Anthropic 的 IPO pitch 里"我们的模型能力领先 X 代"这种话不能再用——领先维度要换成 RSP（Responsible Scaling Policy）、Glasswing 联盟、Anthropic Labs 应用矩阵。估值锚从模型稀缺性换到政策护城河加应用生态，是 Anthropic 接下来 6 个月叙事的必修课。

## 七、收尾：定价权易手不是终点

9 天三种范式同期登台。0.2 个百分点和 7 倍价差让闭源派的能力溢价进入收敛期。

但收敛不等于结束。

闭源派还有几张牌没出——RSP 制度化和监管标准、应用层 bundle 战略（Claude Design、数字员工、企业上下文工程）、深度模型（如 Mythos）保留作 Tier 1 资产、以及未来差异化训练（在训练阶段精确削弱某些能力同时保留其他）做行业专版。这些都不是 V4 一次发布能压塌的护城河。

但有一件事是这一周确认下来的：模型权重本身不再是护城河。能让 1.6 万亿参数训稳定的工程方案进了开源 tech report，能让 1M 上下文成本下降一个数量级的注意力压缩进了开源权重，价格降到闭源 14% 的同等性能也进了开源权重——三个维度同时开源。

护城河被迫迁移。从"我们手上有更强的模型"迁移到"我们手上有更深的安全合规护栏 + 更广的产品生态 + 更稳定的企业部署"。这个迁移过程会塑造未来 12 个月所有头部 AI 厂商的对外叙事。

读懂这件事，比追每周的 benchmark 数字有用得多。

---

## 原文关键引用

> "Usage has changed a lot and our current plans weren't built for this." —— Amol Avasare, Anthropic 增长主管（X，2026-04-21）
> 「使用模式变化很大，我们现有的计划方案并不是为此设计的。」

> "Per-subscriber usage has increased significantly, and our current plan architecture was not designed for this scale." —— Amol Avasare, Anthropic
> 「每个订阅用户的使用量显著增加，我们现有的计划架构不是为这种规模设计的。」

> "Codex will remain available in both the free and Plus ($20/month) plans." —— OpenAI Codex 团队公开声明（2026-04-22）
> 「Codex 将在免费版和 Plus（$20/月）计划中继续开放。」

> "trails only Gemini-3.1-Pro" —— DeepSeek V4 官方发布稿（在知识领域选择对手时的措辞）

## 引用

1. https://api-docs.deepseek.com/news/news260424 —— DeepSeek V4 官方发布稿
2. https://huggingface.co/deepseek-ai/DeepSeek-V4-Pro —— V4-Pro 模型权重 + 模型卡 + Tech Report PDF
3. https://www.buildfastwithai.com/blogs/deepseek-v4-pro-review-2026 —— 第三方独立横向评测，含完整 benchmark 表 + 价格对比 + 月度成本计算
4. https://www.theregister.com/2026/04/22/anthropic_removes_claude_code_pro/ —— Avasare 公开承认订阅架构问题的来源
