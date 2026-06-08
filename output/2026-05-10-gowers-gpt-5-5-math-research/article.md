---
title: 17 分 5 秒——菲尔兹奖得主把数学博士论文的下限交给了 GPT-5.5 Pro
slug: 2026-05-10-gowers-gpt-5-5-math-research
date: 2026-05-10
reader: default
style: default
domains: [ai-product, ai-infra]
type: decode
---

# 17 分 5 秒——菲尔兹奖得主把数学博士论文的下限交给了 GPT-5.5 Pro

2026 年 5 月 8 日，菲尔兹奖得主 Timothy Gowers 把数论学者 Mel Nathanson 论文里的一个开放问题喂给 GPT-5.5 Pro。模型思考 17 分 5 秒，把 Nathanson 的指数上界改成了二次上界——他自己评价"相当于组合数学博士论文的一章"。这不是 AI 又强了一点，是 AI 数学第一次从"做题"跨到"做研究"。Gowers 在博客末尾给了一句结论："以后做数学的下限，是证明 LLM 证不出来的东西。"

**本期关键词**

- **FrontierMath**：研究级数学基准，分 1-4 级难度。GPT-5.5 Pro 在 Tier 1-3 达到 51.7%，Tier 4 达到 35.4%
- **Lean**：形式化数学语言。AlphaProof 路线需要把题翻译成 Lean 才能跑
- **Nathanson 问题**：本次实验的来源——*Diversity, Equity and Inclusion for Problems in Additive Number Theory* 里的开放问题
- **能力悬置**（Aaron Levie 提出）：模型已经能干的事 vs 用户实际在用的事的差距
- **Deep Think**：Gemini 的并行思考模式。IMO 2025 金牌得分 35/42

![17:05 — 菲尔兹奖得主把数学博士论文的下限交给了 GPT-5.5 Pro](assets/00_cover.png)

---

## AI 数学的三阶段

把过去 22 个月拉成一条时间轴。

2024 年 7 月，DeepMind 公布 AlphaProof + AlphaGeometry 2 的 IMO 2024 结果——4 道题做出 3 道，加上几何题，达到银牌水平。最难的一道数论题只有 5 名人类选手解出，AlphaProof 解出来了。代价是：题目要先由专家翻译成 Lean 这种形式化语言，模型再去搜索证明，每道题跑 2 到 3 天计算。

2025 年 7 月，Gemini Deep Think 拿了 IMO 2025 金牌。6 道题做出 5 道完美，35/42 分。关键变化是丢掉了 Lean 翻译这一步——端到端读自然语言题面，并行探索多个解，4.5 小时竞赛时限内完成。从"形式化 + 几天"到"自然语言 + 几小时"，约束在被一层层撕掉。

2026 年 5 月 8 日，Gowers 把 Nathanson 论文里的开放问题给 GPT-5.5 Pro。前两次还在解 IMO（题目有答案，比拼速度和准确率），这次跨到开放研究——没有人知道最优解是什么，模型直接给出新结果。17 分钟。Gowers 自己说"没用聪明的 prompt"。

每一阶段都打掉了上一阶段的限制条件。AlphaProof 限制在形式化语言、IMO 限制在已知答案、Gowers 这次限制在 Gowers 本人——但前两个限制已经死了，第三个限制正在松动。

![三阶段对照：AlphaProof / Gemini Deep Think / GPT-5.5 Pro × Gowers](assets/01_three_stages.png)

---

## Gowers 让 GPT-5.5 Pro 干了什么

Nathanson 那篇论文里挑的第一个问题，原版给的是一个**指数上界**。模型思考 17 分 5 秒，给出**二次上界**，而且 clearly best possible——也就是不可能再改进了。模型动作不是暴力搜索：它替换掉 Nathanson 证明中的一个关键组件，换成"组合学里大家都知道但不明显适用于这道题"的技巧。这是数学家做研究时的标准动作。

接着 Gowers 让模型处理推广版变种。这道题 MIT 学生 Isaac Rajagopal 之前证过指数依赖。GPT-5.5 Pro 思考 31 分 40 秒，把指数依赖改成多项式依赖。Rajagopal 本人公开点评："这个想法相当 ingenious，我自己要花一两周思考才能想出来，想出来会很自豪。"

最后 Gowers 要求模型把答案写成数学预印本风格的 LaTeX。2 分 23 秒完成。

整个过程 Gowers 几乎没干预数学内容。他自己在博客里写："I didn't even do anything clever with the prompts." 给的提示完全没有数学输入——就是把题面贴上去，让模型自己选技术。

这三个数字放在一起——17 分 5 秒、31 分 40 秒、2 分 23 秒——重新定价了"组合数学博士论文里的一章"。

![三个时间戳：17:05 / 31:40 / 02:23，以及 Rajagopal 1-2 周对照](assets/02_three_timestamps.png)

---

## "下限"那句话拆开看

Gowers 在博客末尾的原话是：The lower bound for contributing to mathematics will now be to prove something that LLMs can't prove.

中文直译——以后做数学的下限，是证明 LLM 证不出来的东西。

"下限"这个词是关键。

以前一个数学博士论文，写得漂亮、技术干净、结果正确，就够拿学位——哪怕结果本身不"惊艳"。Nathanson 这道题就是个典型例子：开放问题，但解出来的难度在博士工作量范围内，是个合格的 PhD 论文章节。

现在 Gowers 那句话的意思是：这样的工作 LLM 17 分钟能做。如果你的博士论文整章可以被 LLM 17 分钟做出来，这章的存在价值就被打折。不是 0，但被打折。

往下推一步：现有数学博士论文里，到底多少比例的章节是"漂亮但不困难"的工作？没人公开估算过，但从 Gowers 的话和 Rajagopal 的反应推断——大概 30% 到 50%。这是未来 5 年要重新定价的工作量。

Rajagopal 的对照值得注意。MIT 学生，能想出来这个 ingenious 想法是因为他做的就是这块研究。他自评 1-2 周思考。GPT-5.5 Pro 31 分 40 秒。差距 200-500 倍。这不是"AI 比 MIT 学生聪明"——是"AI 把这类问题的解决路径压缩了 200 倍"。

Gowers 顺手做了一个 2029 年预测：那年毕业的博士，会看到数学研究 changed out of all recognition。

![下限那句话拆开看：2026 之前 vs 之后，Rajagopal 1-2 周 vs 模型 31:40，2029 预测](assets/03_lower_bound_unpacked.png)

---

## 没被替代的部分

Gowers 自己选了适合的题。Nathanson 那篇论文在组合数学里属于"结构清晰、技术成熟"的类——已有人证了一个上界，问能不能改进。这种题适合喂模型，因为方向明确。换成 Riemann Hypothesis、Hodge Conjecture、BSD 猜想这种结构不清晰的核心难题，GPT-5.5 Pro 17 分钟啥也证不出来。

Gowers 本人就是 prompt。他知道哪个开放问题在合适的难度区间、答案大致是什么形态、模型给出结果时如何判断正确——这都不是"没干预"。普通数学博士拿到 GPT-5.5 Pro 不会有同样效果，因为他没有 Gowers 30 年组合数学直觉来选题和验证。

成本不便宜。OpenAI 没公开 Pro 模式单次 thinking 的算力开销。社区估算 17 分钟 thinking 大约 $5-50 推理成本（按 token 单价 + 思考长度推算）。$200/月 ChatGPT Pro 订阅意味着即便订了，也不可能毫无限制地反复跑。

数学界本身评价分化。abvx Substack 上数学家社区的标题是 "AI Has Reached Research Mathematics. Not as a Genius. As a Very Strange Junior Collaborator." 大家承认它能用，但定位是 "奇怪的初级合作者"，不是替代。

能力悬置在这块特别强。Aaron Levie 2026 年 3 月的那条推文——"模型已经能干的事和用户实际在用的事差距巨大"——在数学领域更夸张。GPT-5.5 Pro 能做 PhD 章节，但全球 99% 的数学博士现在没在用，也不打算用。这个差距要 3-5 年才能填上。

![5 条反判断：选题偏向 / Gowers 是 prompt / 成本 / 评价分化 / 能力悬置 + FrontierMath 基准](assets/04_blind_spots.png)

---

## 对从业者意味着什么

研究者本周打开自己正在写的 paper，问一个问题：哪一节如果让 GPT-5.5 Pro 17 分钟做，会做出 60% 以上质量。那一节的存在价值正在下降。不是马上要删——是接下来 12 个月要重新设计你的工作分配。

教育决策者本周看你机构的 PhD 训练大纲。技术型章节（"应用某技巧证某结果"）正在被 AI 接管，原创判断型章节（"找一个值得问的新问题"）正在变得更宝贵。课程设计需要往后者倾斜。这件事不是 5 年后的题，是 2026-2027 年新生入学时就该改。

AI 创业者本周问自己一个问题：你的产品是 AI 上限的应用还是 AI 下限的应用。Gowers 那句话定义了下限——"LLM 证不出来的"。如果你的产品建在"LLM 能做到的事"上，下一代模型出来你就被吃掉了。建在"LLM 做不到的事"上的产品反而更稳。

CTO 本周对照 FrontierMath 51.7% 这个数字。这是研究级数学的基准。如果你公司的核心推理任务复杂度低于这个水平，那 GPT-5.5 Pro 已经能做。如果高于，还有 12-18 个月的窗口。这个基准会成为接下来一年所有"复杂推理"产品的事实参考线。

---

## 引用

- Timothy Gowers，*A recent experience with ChatGPT 5.5 Pro*（个人博客），2026-05-08，<https://gowers.wordpress.com/2026/05/08/a-recent-experience-with-chatgpt-5-5-pro/>
- The Decoder，*Fields Medalist says ChatGPT 5.5 Pro delivered "PhD-level" math research in under two hours with zero human help*，2026-05，<https://the-decoder.com/fields-medalist-says-chatgpt-5-5-pro-delivered-phd-level-math-research-in-under-two-hours-with-zero-human-help>
- DeepMind，*AI achieves silver-medal standard solving International Mathematical Olympiad problems*，2024-07，<https://deepmind.google/blog/ai-solves-imo-problems-at-silver-medal-level/>
- DeepMind，*Advanced version of Gemini with Deep Think officially achieves gold-medal standard at the IMO*，2025-07，<https://deepmind.google/blog/advanced-version-of-gemini-with-deep-think-officially-achieves-gold-medal-standard-at-the-international-mathematical-olympiad/>
- DeepMind 论文，*Olympiad-level formal mathematical reasoning with reinforcement learning*，Nature 2025-09，<https://www.nature.com/articles/s41586-025-09833-y>
- OpenAI，*Introducing GPT-5.5*，2026-04-23，<https://openai.com/index/introducing-gpt-5-5/>
- abvx Substack（数学家社区），*AI Has Reached Research Mathematics. Not as a Genius. As a Very Strange Junior Collaborator.*，<https://abvx.substack.com/p/ai-has-reached-research-mathematics>
