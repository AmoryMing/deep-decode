---
title: 微软把员工的 Claude Code 砍了：当 token 太贵，就自己造一个"够用"的模型
date: 2026-06-04
type: decode
slug: 2026-06-04-microsoft-self-model-vs-anthropic
style: default
reader: default
sources: ["https://www.bloomberg.com/news/newsletters/2026-06-04/microsoft-says-anthropic-models-are-too-expensive", "https://microsoft.ai/news/introducing-mai-thinking-1/", "https://www.semafor.com/article/06/02/2026/microsofts-ai-chief-on-the-greatest-game-of-catchup-ever-played", "https://fortune.com/2026/05/22/microsoft-ai-cost-problem-tokens-agents/"]
distribute: [email, xiaohongshu]
---

# 微软把员工的 Claude Code 砍了：当 token 太贵，就自己造一个"够用"的模型

微软给自家员工开通 Claude Code 六个月，然后把它砍了。Bloomberg 6 月 4 日报道，微软 AI 部门负责人 Mustafa Suleyman 直言 Anthropic 的模型"太贵"，公司已开始取消大部分直接采购的 Claude Code 许可，把内部数千名工程师、产品经理、设计师推回自家的 Copilot。理由一半是 token 成本压不住，一半是想练自己的技术。

这件事单看像一次普通的内部采购调整，但和两天前微软 Build 2026 上发布的首款自研推理模型 MAI-Thinking-1 摆在一起看，它讲的是同一个故事：当模型公司的本质是一门按 token 计费的生意，体量足够大的买家迟早会算明白——继续买别人最贵的前沿模型，不如自己造一个"够用且便宜"的。这一篇拆给所有要为 AI 支出做预算、要为产品选模型的人。

![封面](assets/gpt-img/00_cover.png)

## 本期看点

- **token 经济学** —— 大模型按输入输出的"词元"（token）计费，单价在跌，但用量涨得更快，账单反而越用越贵。
- **去依赖（self-sufficiency）** —— 微软从"买 OpenAI 和 Anthropic 的前沿模型"转向"自己造模型"，目标是不被任何一家卡脖子。
- **够用就好（good-enough）** —— 不追榜单第一，而是造一个在自家场景里跑得动、单位成本低一个量级的模型。
- **MoE（混合专家）** —— 一种模型架构，总参数上万亿但每次只激活一小部分，用更小的推理成本换接近大模型的能力。

## 一、被砍的不是工具，是账单

先把事实链摆清楚。微软大约半年前向内部开放 Claude Code——Anthropic 那款让人用自然语言写代码的命令行工具——鼓励员工大胆试。结果是员工用得太凶。Bloomberg 的原话是，微软"已开始取消大部分直接采购的 Claude Code 许可"，把这些人推向 Copilot，**决定一部分基于 token 的高昂成本，一部分出于打磨自家技术的意愿**。

这里的关键不是"Claude 不好用"——恰恰相反，是太好用。微软自己的工程师用上瘾了，用量起来之后账单也起来了，于是公司在一个员工已经离不开的工具上反向操作。这正是当下 AI 成本问题最反直觉的地方：不是没人用所以贵，是用得越好账单涨得越快。

Fortune 5 月的一篇报道点出了同一组现象的两个邻居：微软因员工用量超预期砍掉 Claude Code 许可；Uber 的 2026 年 AI 编程预算，四个月就花光了。两家公司都不是付不起，是低估了"好用"会带来多大的消耗。报道里一位英伟达高管的话更直白："对我的团队来说，算力成本远超员工成本。"当用 AI 比雇人还贵，账单就成了无法回避的决策项。

还有一层时间因素。当下的 token 单价里，有相当一部分是模型公司用融资补贴出来的——靠低价换增长、抢占心智。Bloomberg 把这层点破：随着模型公司纷纷走向 IPO，这种补贴换增长的定价时代会落幕，最贵的前沿模型只会回归甚至高于真实成本。微软现在动手，是趁补贴还在、自研还来得及，提前把成本结构换到自己能控制的轨道上。

![被砍的不是工具，是用量起来后压不住的账单](assets/gpt-img/01_cutoff.png)

## 二、token 经济学：单价在跌，账单在涨

为什么大公司会在 AI 支出上接连"翻车"？答案在 token 经济学里，而且是一个剪刀差。

一边，单价确实在跌。Gartner 预测到 2030 年推理成本会下降近 90%。另一边，用量涨得更猛。高盛预测，到 2030 年 agentic AI（能自己拆任务、自己调工具、多步执行的智能体）会带来 token 消耗 **24 倍**的增长，每月达到 120 quadrillion（12 亿亿）个 token。单价跌 90%，用量涨 24 倍，两者相乘，总账单不降反升。

更要命的是结构性的：agentic 模型每完成一个任务要烧的 token，远多于过去"问一句答一句"的标准模型。一个会自己反复思考、反复调用工具的智能体，背后是成倍的 token。所以你以为买的是"更便宜的单价"，实际买到的是"更贵的总任务成本"。Gartner 的分析师有一句提醒值得抄下来：别把"token 变便宜"等同于"前沿推理能力的普及"——供应商不会把降本全让给你。

对微软这种体量的买家，这道算术尤其残酷。它不是一个团队偶尔调几次 API，而是成千上万人每天高频使用。在这个规模上，单位 token 贵一点点，乘以海量调用，就是一笔压不住的开支。**规模越大，自研省下的边际成本越值钱**——这是微软选择自己造模型最朴素的财务动机。

![单价跌 90% 撞上用量涨 24 倍，剪刀差让总账单不降反升](assets/gpt-img/02_token_economics.png)

## 三、MAI-Thinking-1：不追第一，追"够用且便宜"

砍掉 Claude Code 的同一周，微软在 Build 2026 上给出了替代品的样子。6 月 2 日发布的 MAI-Thinking-1，是微软**首款从零自研的高级推理模型**，几个特征都对准了"够用且便宜"这条线。

它是一个**混合专家（Mixture of Experts，MoE）**模型：总参数约 1 万亿，但每次推理只激活 350 亿。MoE 的意思是模型内部分成许多"专家"子网络，每次只调用其中相关的几个，而不是让全部参数都参与计算。这样一来，模型纸面上很大、能力够强，但实际每次推理的算力成本接近一个中型模型——省的正是规模化推理的钱。上下文窗口 25.6 万 token，够塞一份 600 页的文档。

能力上微软给的口径是"不追绝对第一，但够打"：AIME 2025 数学竞赛 97.0%、AIME 2026 94.5%；在软件工程基准 SWE-Bench Pro 上，尽管体量小得多，它**追平了 Claude Opus 4.6**；1276 个任务的盲测里，用户更偏好它而非 Claude Sonnet 4.6。这些数字要等独立实验室复现才算数，但方向很清楚——微软不需要造出世界第一，只需要造出一个在自家场景里"和最好的差不多、但便宜一个量级"的模型。

训练上它还划了一条线：**全程用企业级、干净、商业授权的数据从零训练，不蒸馏第三方模型**（蒸馏指用别家大模型的输出来"教"自己的小模型，是行业里抄近路的常见做法）。Suleyman 在 Semafor 的访谈里明说拒绝走蒸馏这条捷径，还强调"模型必须和它运行的工具链（harness）调到一起"——翻译过来就是：自己的模型，长在自己的产品里，才省得彻底。

![不追榜单第一，只要在自家场景便宜一个量级](assets/gpt-img/03_mai_thinking.png)

## 四、Suleyman 的算盘：最低成本，加自家芯片

把这两步连起来，微软 AI 负责人 Suleyman 的战略就清楚了。

他给微软的定位不是"最强"，而是**"前沿上成本最低的玩家"**——靠自研模型搭配自家芯片，把单位成本压到底。他在 Semafor 给的最硬一个数字：在为咨询公司麦肯锡定制调优后，微软的模型表现超过了 OpenAI 的 GPT-5.5，且**成本效率好 10 倍**。这个 10x 才是整套打法的核心——不是能力上甩开对手，是同样的活儿用十分之一的钱干完。

Suleyman 对追赶进度毫不遮掩："我们用六个月走到这里，这本身就是了不起的成就"，公司已经"和几个月前的业界最高水平打得不相上下"。对外界的质疑，他的回应是体量论："我们是世界上最大的科技公司之一，有资源确保自己追上来。"

这套叙事的时机也耐人寻味。Anthropic 6 月 1 日刚保密递交了 IPO 申请，OpenAI 同样在冲上市。模型公司一旦走进公开市场的财报视野，烧钱补贴的空间会被压缩，定价只会更贴近真实成本——微软选在这个节点高调宣布"去依赖"，等于在补贴退潮前给自己的成本结构提前上了保险。

![Suleyman 的算盘：自研模型 + 自家芯片 = 前沿上成本最低](assets/gpt-img/04_strategy.png)

## 对从业者意味着什么

微软这步棋给整个行业立了一个样板：**当 AI 用量大到一定规模，"自己造一个够用的"会从奢侈变成省钱**。它不是不认 Claude 强，是算明白了在自己的体量上，前沿能力的溢价付不起。

对企业采购方：选模型别只盯榜单分。真正该算的是"单位任务成本"——同一个活儿，A 模型单价低但要烧三倍 token，B 模型单价高但一步到位，谁更便宜要拿你自己的真实任务跑出来才知道。尤其是上 agentic 智能体的场景，先做一轮 token 消耗的压力测试，再签预算，别等四个月烧光了才发现低估了用量。Uber 和微软都已经替你交过学费。

对一线工程师：你日常依赖的那个"最好用的工具"，可能哪天就因为账单被换掉。把工作流建在能力上、而不是绑死某一家模型的 API 上——同样的提示词和评测集，留好能在多家模型间切换的口子。微软自己都在做"去依赖"，个人和团队更该有 Plan B。

对创业者：微软证明了"够用且便宜"是一条独立赛道，不必什么都追第一。麦肯锡那个案例值得记住——针对单一客户场景调优后，微软的模型成本效率做到了通用前沿模型的十分之一。如果你的产品场景固定、用量可观，一个针对性调优的中型模型，单位成本完全可能打得过通用前沿模型。前沿能力和单位成本之间的张力，就是留给后来者的缝。

## 引用

1. Bloomberg《微软 AI 负责人称 Anthropic 模型太贵》（Microsoft's AI Chief Says Anthropic Models Are Too Expensive，2026-06-04，付费墙，经多家媒体转述交叉核实）：https://www.bloomberg.com/news/newsletters/2026-06-04/microsoft-says-anthropic-models-are-too-expensive
2. Microsoft AI《推出 MAI-Thinking-1》（Introducing MAI-Thinking-1，2026-06-02）：https://microsoft.ai/news/introducing-mai-thinking-1/
3. Semafor《微软 AI 负责人谈史上最大的一场追赶》（Microsoft's AI chief on the greatest game of catchup ever played，2026-06-02）：https://www.semafor.com/article/06/02/2026/microsofts-ai-chief-on-the-greatest-game-of-catchup-ever-played
4. Fortune《微软的报告暴露了 AI 真实的成本问题》（Microsoft reports are exposing AI's real cost problem，2026-05-22）：https://fortune.com/2026/05/22/microsoft-ai-cost-problem-tokens-agents/
5. CNBC《微软发布新 AI 模型以减少对 OpenAI 依赖、降低开发者成本》（2026-06-02）：https://www.cnbc.com/2026/06/02/microsoft-unveils-new-ai-models-lessen-reliance-on-openai-lower-costs.html
