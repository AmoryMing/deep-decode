---
title: 你上周押的那个赌，现在该怎么看
source:
  - https://api-docs.deepseek.com/news/news260424
  - https://huggingface.co/deepseek-ai/DeepSeek-V4-Pro
  - https://www.buildfastwithai.com/blogs/deepseek-v4-pro-review-2026
date: 2026-04-25
mode: event-decode
tags: [DeepSeek, 开源模型, 范式之争, 企业AI, 成本结构, AI编程]
---

# 你上周押的那个赌，现在该怎么看

周三中午，HuggingFace 多了一个 1.6 万亿参数的权重文件，MIT 协议，下载键大大方方挂在那儿。同一个下午，几个我认识的 AI 架构师在群里转同一张图——Buildfastwithai 整理的横评表——不发评论，只发图。

这张图把过去三年的一句行话压坏了。那句行话是：闭源 SOTA 比开源领先 6 到 12 个月。上个季度的 OKR 里，多少团队是用这句话立的论。

V4-Pro 在 SWE-bench Verified 上拿了 80.6，Claude Opus 4.6 是 80.8。差 0.2 个百分点。LiveCodeBench V4-Pro 93.5，Opus 4.6 88.8——这次反过来了。Codeforces Rating V4-Pro 3206，GPT-5.4 是 3168。Terminal-Bench 2.0 V4-Pro 67.9，Opus 4.6 是 65.4。

不是开源追平了。是开源在四列里有三列已经走到了前面。

剩下一列差 0.2 个百分点。0.2 在测评行业里叫"统计噪声"。这个差距不取决于模型谁更聪明，取决于这次跑测试的随机种子。

把数字摆完，再看价格。V4-Pro 输出每百万 token 3.48 美元。Opus 4.6 是 25 美元。差 7.2 倍。

如果你上周还在跟老板说"闭源贵是因为它更强"，这周需要想清楚两件事：你的"更强"还剩多少证据，你的"贵"还能解释多久。

## 一、那 0.2 个百分点到底是什么

先把噪声和信号分开。

测评行业有个不成文的规矩——SWE-bench Verified 这种主观打分类的 benchmark，重测一次抖动 1 到 2 个百分点是常态。今天 80.6 明天可能 81.1，后天可能 80.2。这不是模型变聪明了或变笨了，是用例采样和打分员判断的随机性。0.2 个百分点远远落在这个区间内。

所以 V4-Pro 和 Opus 4.6 在 SWE-bench 上的差距，技术上等同于"打平"。再跑一次实验，谁赢谁输都说不准。

LiveCodeBench 上 V4-Pro 反超 Opus 4.6 4.7 个百分点。这个差距已经超出噪声范围，是真实差距。Codeforces Rating V4-Pro 比 GPT-5.4 高 38 分，Codeforces 这种 ELO 体系的题目对推理质量极敏感，38 分等同于一个稳定的等级差。

四个核心代码 benchmark，三项 V4-Pro 领先，一项打平。这是数据的事实。

但读者必须知道 V4-Pro 不是全能。SimpleQA-Verified 这个测"模型记得多少世界事实"的题目，V4-Pro 只有 57.9%，Gemini-3.1-Pro 是 75.6%。差距快 18 个百分点。HLE（人类终极考试）V4-Pro 37.7%，Gemini 44.4%。HMMT 数学竞赛 V4-Pro 95.2%，GPT-5.4 是 97.7%。

读出来的画像很清楚——V4-Pro 是一个**代码强、数学贴近、知识弱**的偏科模型。它在你写代码时几乎可以平替 Opus 4.6，但你让它回答"X 公司 2023 年财报营收多少"这类问题，会比 Gemini 差一截。

DeepSeek 官方公告对这条短板的措辞很有意思——"trails only Gemini-3.1-Pro"（仅次于 Gemini-3.1-Pro）。这是把对手范围从所有模型缩成"只输给一个人"，落点是好看的。但翻成实操语言：知识查询任务请绕开 V4-Pro。

## 二、价差 7.2 倍意味着什么

技术追平是上半场，价格暴力压制是下半场。

把四家旗舰摆齐。V4-Pro 输入 1.74 美元/百万 token，输出 3.48 美元。V4-Flash 输入 0.028 美元，输出 0.28 美元。Opus 4.6 输入 5 美元，输出 25 美元。GPT-5.4 输入 2.5 美元，输出 15 美元。

V4-Pro 输出价格是 Opus 4.6 的 14%。V4-Flash 是 1.1%。

Buildfastwithai 给了一个具体场景——一条生产环境的 agent coding 流水线，每月输出 5000 万 token。V4-Pro 月成本 174 美元。Opus 4.6 月成本 1250 美元。差额 1076 美元。一年差 12912 美元。一个 50 人团队差 645600 美元。

645600 美元在什么概念。是再招两个高级工程师的预算。是一年两次品牌赞助大会的预算。是 CFO 季度评审表里"AI infrastructure"那一行从绿变红的原因。

这件事的真实分量必须和上周 Anthropic 自己说过的话放一起读。4 月 21 日，Anthropic 增长主管 Amol Avasare 在 X 上有这么两句话：

> "Usage has changed a lot and our current plans weren't built for this."
> 「使用模式变化很大，我们现有的计划方案并不是为此设计的。」

> "Per-subscriber usage has increased significantly, and our current plan architecture was not designed for this scale."
> 「每个订阅用户的使用量大幅增加，我们现有的计划架构不是为这种规模设计的。」

这两句话是 Anthropic 自己暴露的——agent loop 长跑（一个任务在后台跑数小时，无人值守）让单席位实际算力消耗从聊天量级跳到持续算力量级。按席位计费的订阅模型，在 agent 时代有结构性瑕疵。

DeepSeek V4 在这个裂缝上落了一锤。当 agent 长跑变成主流使用模式，决定经济账的不再是 benchmark 高出来的那 0.5 个百分点，是输出每百万 token 多少钱。Opus 4.6 在 0.2 个百分点优势上能维持多少溢价？答案是 25 减 3.48，等于 21.52 美元每百万 token。在性能差距没大于噪声的前提下。

这不是降价竞争。是**定价权易手**。过去三年闭源派一直在用"我们更强所以更贵"建立锚点，V4 用 0.2 个百分点的差距把这个锚点的合理性踩碎了。

剩下的争论会是：V4-Pro 1.6 万亿参数推理成本能不能撑住 3.48 美元这个价格多久。这件事 DeepSeek 自己没说。一个团队 all-in 押注 V4 价格结构时，"政策可能调整"是要进财务模型分母的风险变量。但这个风险变量的形状已经不是"是否调整"，是"调整后还会不会比 Opus 便宜五倍"。

## 三、能让 1.6 万亿参数训稳的工程方案，被白送了

回到上半场。前两节看了能力和价格的事实，第三节看技术暗线——V4 这次开源开的不是模型权重，是**怎么把这种规模的模型训得稳**。

千亿参数以上的 Dense 模型训练里有一个工程难题，叫"训练不稳定"。具体表现是 loss 在某个 step 突然飞到无穷大，整个训练崩盘——重启从最近 checkpoint 续，运气不好整个实验报废。Anthropic、OpenAI、Google 这些大厂在 1T+ 模型上的训练稳定性，是闭源最深的护城河之一。大家心里都清楚怎么把模型做大，但谁都不公开怎么把大模型训稳。

DeepSeek V4 tech report 里把这件事公开了。

核心方法叫 mHC（Manifold-Constrained Hyper-Connections，流形约束超级连接）。它做的事情很具体——把神经网络层之间信号传播的放大倍数从 3000 倍压到 1.6 倍。

3000 倍是什么意思。深层网络里前一层的微小数值波动，传到几十层之后被放大几千倍，就是一次"训练崩盘"的导火索。把放大倍数压到 1.6 倍，等于给每一层加了一个限流阀。1.6 万亿参数能在这个限流阀下稳定收敛。

第二项是 DSA（DeepSeek Sparse Attention）。在 1M token 上下文设置下，V4-Pro 相比 V3.2，单 token 推理 FLOPs 是 27%，KV cache 是 10%。换句话说，1M 上下文的成本被压缩了一个数量级。

第三项是用 Muon 替代 AdamW 做优化器。这一项相对小，但和前两项一起，意味着 DeepSeek 在训练栈的三个层面都做了非主流选择。这家中国团队没有沿用美国大厂的默认配方。

三项加起来传递一个信号：1.6 万亿参数的训练稳定性曾经是闭源派最深的护城河之一，DeepSeek 把这个护城河的工程方案放进了一份开源 tech report。下一代开源模型不需要从零摸索这条路。

护城河的深度不是被攻破的——是被填平的。任何后续团队，只要肯读 tech report 复现，就能站在 V4 已经填好的那一半坑上继续。

## 四、不会被 DeepSeek 主动说的几件事

把官方话和独立证据对齐看，有几件事必须自己加上去。

**33 万亿训练 token 来源没公开**。DeepSeek tech report 声称用了 33T tokens 做预训练。这是厂方声称的数字。33 万亿 token 这个量级，纯靠合规公开数据加开源数据集是非常紧的。版权数据、合成数据、竞品 distill 的混合占比，外人看不到。DeepSeek 历史上有过 OpenAI 控诉"蒸馏 GPT-4"的事件未结案。这条悬而未决的合规风险，在企业部署评估表里要进"数据来源"那一栏。

**"Preview" 标签在传话**。模型卡里写着 "preview release—further post-training refinements are expected"（预览版，后续训练阶段调优可期）。和 Anthropic 给 Mythos / Claude Design 加的 "Research Preview" 是同种话术——能力天花板可以发布，稳定性边界场景没保证。生产环境上线请把"版本锁定"作为风险预案。Anthropic 上周三连降智事件（默认推理被偷偷调低、缓存逻辑写错、prompt 字数被加限制）就是这种"边界场景没保证"在用户那一端的实际体感。

**API 在中国基础设施**。开源权重可以本地部署。但调 chat.deepseek.com 走 API 的开发者，数据出境到中国境内基础设施。这条对中国境内从业者无影响，对要服务美国/欧盟 enterprise 客户的开发者是硬约束。Western 媒体在发布稿后两小时已经在追问，国内媒体几乎不提。这个差异本身就值得记一下——同一个事实，不同读者的实际后果不一样。

**3.48 美元的可持续性没有保证**。DeepSeek 没承诺这个价格不会调整。1.6 万亿参数推理的 GPU 占用决定了真实算力成本。如果 V4-Pro 的 3.48 美元/百万 token 是 DeepSeek 在补贴市场份额，那调整时间窗是写在他们融资节奏里的，不是写在公告里的。压价格的下界值得做一次粗算——同等架构在 H100 集群上的推理成本理论下界，Buildfastwithai 没给，但有公开经验数字大约在 1.5 美元/百万 token 量级。3.48 离这个下界已经不远，所以"调整空间"不一定大。但"会不会调整"和"什么时候调整"还是企业财务模型里需要单列的不确定项。

这四件事官方不会说，但读到这一节的人必须自己加上。

## 五、9 天里出现的三种范式

把过去 9 天发生的事情按时间轴串起来——

| 日期 | 事件 |
|---|---|
| 4-16 | Anthropic 发布 Opus 4.7（Tier 2 公开版）+ 锁 Mythos Preview 进 Project Glasswing 联盟（Tier 1） |
| 4-17 | Anthropic 发布 Claude Design + Mike Krieger 辞 Figma 董事 |
| 4-21 | Anthropic 把 Claude Code 从 Pro 计划悄悄移除（2% 测试），开发者社区反弹 |
| 4-22 | OpenAI Codex 团队公开声明 "Codex stays in Plus ($20/month)" |
| 4-23 | OpenAI 发布 GPT-5.5 + Anthropic 主动披露 Claude Code 三次降智事件 |
| 4-24 | DeepSeek 发布 V4-Pro 和 V4-Flash，MIT 开源 |

9 天内三种发布范式同台亮相。

**Tiered**（Anthropic 的姿势）。最强模型只给联盟，公开版是经过差异化训练削弱后的安全版。逻辑是把"能力"作为可分级访问的资产管理。

**$20 锚定**（OpenAI Codex 的姿势）。保留低价档位的可用性作为差异化卖点。逻辑是把"性能/价格比"押在订阅档位的可达性上——20 美元能用最好的 Codex，是写给开发者的承诺。

**Open**（DeepSeek 的姿势）。直接把 1.6 万亿参数 MIT 协议扔出来，价格降到闭源 14%。逻辑是把"开放性 + 价格"作为护城河——既然你打不过我们的能力，那你也付不起对应的代价。

三种范式不是互斥的产品策略选择，是对"未来 12 个月谁能定价"这件事的三种押注。Anthropic 押"能力稀缺性"，靠 Tiered 维持高价。OpenAI 押"价格档位 + 生态"，靠 20 美元守住开发者基本盘。DeepSeek 押"性能追平 + 开源完整性"，直接把对手的定价空间压缩。

上周用来形容 GPT-5.5 vs Opus 4.7 的"分叉领先"框架——一家在 A 类任务领先，另一家在 B 类任务领先——本周需要扩成三叉。第三叉不在 benchmark 上，在 license 和定价上。

更值得停下来的是这一周的次序。Anthropic 4-21 流程失控暴露订阅架构问题，OpenAI 4-22 当天反击，DeepSeek 4-24 把整张牌桌掀了。前两家在打"哪种订阅档位最划算"，DeepSeek 的回答是：你不需要订阅。

## 六、对从业者意味着什么

这一节按身份拆开。

**对 AI 应用开发者**。把 V4-Pro 加进路由层做 A/B 测试，是本周值得排进迭代的事。具体动作：选 3 到 5 个核心 agent 任务（多文件 bug 修复、code review、文档查询、终端脚本生成），用相同 prompt 同时跑 V4-Pro / Opus 4.6 / GPT-5.4，对比通过率和成本。V4-Pro 在核心任务上通过率不输 Opus 4.6 的 95% 时，切换是值得做的——70% 的成本节约会直接落到 P&L 表上。事实查询类任务（agent 长跑里需要查事实的子任务）保留闭源模型做兜底，是更稳的姿势。

**对 AI 创业者和 CTO**。成本模型可能需要重写。过去六个月假设的"模型成本占比"如果还是 30% 到 40%，现在有机会压到 5% 到 10%。省下来的钱是用来扩团队还是扩并发，是一道战略选择题——同样预算下 agent 同时跑的并发数从 100 提到 1000，意味着 SLA 和定价层都要重新设计。"模型供应商分散"是值得在这一波纳入架构原则的——开源加闭源至少各两家，避免被任何单家定价权劫持。

**对企业 IT 决策者**。之前因为合规没法用 DeepSeek API（数据出境、监管）的团队，现在 MIT 开源权重打开了本地部署通路。V4-Flash 284B 参数 / 13B active，在 4 块 H100 80GB 上可推理——这条路径之前需要 H100 集群门槛，现在被打破。本地部署 + 开源权重 + 同等性能，是一条之前不存在的合规通路，值得纳入供应商评估表。如果你过去 6 个月一直在做"敏感数据不能出境"的部署架构，这周的供应商清单上多了一行新选项。

**对中国 AI 从业者**。Moonshot PrfaaS（Prefill-as-a-Service，把 prefill 和 decode 拆到不同数据中心跑）4 月 16 日发论文。DeepSeek V4 4 月 24 日发模型。两条线一条在系统层一条在模型层，同月双发。Western 媒体过去三年的"中国 AI 在追赶"叙事在这周看着已经过时。把这两条线连起来读，下一波"中国 AI"叙事会是基础设施 + 模型双轮——这个判断值得记入路线图。

**对投资人**。据公开融资文件，Anthropic 在 2026-02 完成 Series G 30 亿美元 @ 380 亿美元 post-money，行业分析师预期 2026-10 IPO（目标 60 亿融资）。V4 把 Anthropic 闭源最强模型的边际溢价从"无限大"压到"21.52 美元每百万输出 token"。这个数字会进所有专业 AI 投资人的估值模型分母。Anthropic 的 IPO pitch 里"我们的模型能力领先 X 代"这种话不能再用——领先维度要换成 RSP（Responsible Scaling Policy）、Glasswing 联盟、Anthropic Labs 应用矩阵。估值锚从"模型稀缺性"换到"政策护城河 + 应用生态"，是 Anthropic 接下来 6 个月叙事的必修课。

**对你这周还在续 Claude Max 的人**。续，是可以的。Opus 4.6/4.7 在多文件代码工程、IDE 嵌入精度、严谨推理上仍然是更稳的选择。但请把"我每月花 100 美元买的是什么"这件事重新写一遍——不是"最强模型"，是"在某个被 Anthropic 选定的能力赛道上仍然领先"。你在为那个特定赛道的领先付钱。如果你的工作 80% 都在这个赛道里，钱花得值。如果不是，把 V4-Pro 接进路由层做兜底，是这周可以排进迭代的优化。

## 七、护城河被迫迁移

这一周确认的事情是：**模型权重本身不再是护城河**。

能让 1.6 万亿参数训稳定的工程方案进了开源 tech report。能让 1M 上下文成本下降一个数量级的注意力压缩进了开源权重。价格降到闭源 14% 的同等性能也进了开源权重。三个维度同时开源。

闭源派护城河被迫迁移。从"我们手上有更强的模型"，迁移到"我们手上有更深的安全合规护栏 + 更广的产品生态 + 更稳定的企业部署 + 更绑定的政策影响力"。

这个迁移过程不是这周完成的。是这周开始的。Anthropic 还有几张牌没出——RSP 制度化为美国 / 欧盟监管标准、应用层 bundle 战略（Claude Design 和数字员工和企业上下文工程）、深度模型（如 Mythos）继续作为 Tier 1 资产保留、未来差异化训练做行业专版。这些都不是 V4 一次发布能压塌的护城河。但它们都不在"模型能力本身"这一维度上。

读到这里你可能想问一句：那我下个季度的押注要换吗。

答案分两层。技术押注层面，"开源 vs 闭源"已经不是一个有意义的二选一——双轨同时押注是这周的新基准。商业押注层面，闭源派的故事正在从"能力领先"切到"生态领先"，能不能接住这个切，看 Anthropic / OpenAI 接下来 6 个月的应用层动作而不是模型层动作。

如果你上周还在 Q1 OKR 里写"采用闭源 SOTA 是因为它领先 6-12 月"，这周需要把这句话改写成"采用闭源 SOTA 是因为它在合规 / 生态 / 部署稳定性上领先"。改这句话的过程，比追这周的 benchmark 数字有用得多。

---

## 本期关键词

**0.2 个百分点（The 0.2 Gap）** —— DeepSeek V4-Pro 与 Claude Opus 4.6 在 SWE-bench Verified 上的差距。统计噪声级。象征意义远超技术差异——开源和闭源同代性能拐点的标记数字。

**14% 定价** —— V4-Pro 输出价格 3.48 美元/百万 token 相对 Opus 4.6 25 美元的比例。决定 agent loop 长跑场景下的真实成本边界。

**mHC（Manifold-Constrained Hyper-Connections，流形约束超级连接）** —— DeepSeek V4 训练稳定性的核心创新。把神经网络层间信号放大从 3000 倍压到 1.6 倍，让 1.6 万亿参数训练不崩。是行业首次公开 1T+ 模型训练稳定性的工程解法。

**DSA（DeepSeek Sparse Attention）** —— V4 在 1M 上下文下相比 V3.2 节约 73% FLOPs / 90% KV cache 的注意力机制。和 Moonshot PrfaaS 同月发布，构成 KVCache 压缩的两条并行路径。

**三叉发布范式** —— 2026-04 同周出现的三种最强模型发布姿势：Anthropic 的 Tiered（最强不公开）、OpenAI 的 $20 锚定（性价比兜底）、DeepSeek 的 Open（最强直接给）。三种范式对未来定价权的不同押注。

**护城河迁移（Moat Migration）** —— 当模型权重本身不再是壁垒，闭源派护城河被迫从"模型稀缺性"迁移到"政策合规 + 应用生态 + 企业部署稳定性"。是未来 12 个月头部 AI 厂商对外叙事的隐藏主线。

## 原文关键引用

> "Usage has changed a lot and our current plans weren't built for this." —— Amol Avasare, Anthropic 增长主管（X, 2026-04-21）
> 「使用模式变化很大，我们现有的计划方案并不是为此设计的。」

> "Per-subscriber usage has increased significantly, and our current plan architecture was not designed for this scale." —— Amol Avasare
> 「每个订阅用户的使用量大幅增加，我们现有的计划架构不是为这种规模设计的。」

> "Codex will remain available in both the free and Plus ($20/month) plans." —— OpenAI Codex 团队声明（2026-04-22）
> 「Codex 将在免费版和 Plus（20 美元/月）计划中继续开放。」

> "trails only Gemini-3.1-Pro" —— DeepSeek V4 官方发布稿，知识领域对手选择措辞。

## 引用

1. [DeepSeek V4 Preview Release](https://api-docs.deepseek.com/news/news260424) —— DeepSeek 官方发布稿
2. [DeepSeek-V4-Pro on Hugging Face](https://huggingface.co/deepseek-ai/DeepSeek-V4-Pro) —— 模型权重 + 模型卡 + Tech Report PDF
3. [DeepSeek V4-Pro Review: Benchmarks, Pricing & Architecture](https://www.buildfastwithai.com/blogs/deepseek-v4-pro-review-2026) —— 第三方独立横向评测
4. [Anthropic tests reaction to yanking Claude Code from Pro](https://www.theregister.com/2026/04/22/anthropic_removes_claude_code_pro/) —— Avasare 公开承认订阅架构问题的来源
