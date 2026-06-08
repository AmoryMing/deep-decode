---
title: 1475 分的中国闭源最高位：Qwen3.7-Max 不是新模王，是阵营换挡
author: 内容工厂
date: 2026-05-21
type: decode
slug: 2026-05-21-qwen-3-7-max-china-king
source:
  - https://x.com/Alibaba_Qwen/status/2056403591464984753
  - https://www.donews.com/news/detail/4/6563723.html
  - https://www.ithome.com/0/952/041.htm
  - https://www.ithome.com/0/952/670.htm
  - https://www.buildfastwithai.com/blogs/qwen3-7-max-preview-alibaba-2026
  - https://www.scmp.com/tech/tech-trends/article/3354087/alibaba-teases-new-qwen-previews-highest-ranking-chinese-ai-models-arena
  - https://decrypt.co/368499/alibaba-qwen-3-7-max-preview-review
  - https://benchlm.ai/blog/posts/best-chinese-llm
  - https://codersera.com/blog/kimi-k2-6-vs-deepseek-v4-vs-glm-5-1-2026/
  - https://artificialanalysis.ai/models/qwen3-7-max
  - https://www.163.com/dy/article/KTCLAR620511AQHO.html
tags: [Qwen, Alibaba, LMArena, ChineseLLM, Benchmark]
---

# 1475 分的中国闭源最高位：Qwen3.7-Max 不是新模王，是阵营换挡

把 5 月 20 日阿里云峰会的发布稿压成两个数字：LM Arena 文本盲测 1475 分，全球第 13 名。这是中国闭源模型在这张表上拿过的最高位置——比半年前 Qwen3.5-Max 的 1464 分高 11 分，比目前居首的 claude-opus-4-6-thinking 的 1501 分低 26 分。

机器之心的标题用了「新模王」三个字。这话准确一半。准确在「国产维度」上，Qwen3.7-Max 确实是 Arena 这张榜上中国厂商第一次进入前 15。另一半不准，是因为同一周里 DeepSeek-V4 Pro 在 BenchLM 综合榜上仍是 87 分的中国第一，Kimi K2.6 在 Code Arena WebDev 上拿到 1529 Elo 紧追 Claude Opus 4.7。**单榜冠军不是综合冠军**。这场发布会真正值得拆的，不是分数，是中国 AI 厂商整体从「开源换地位」切到「闭源换毛利」的阵营换挡，被阿里用一个 1475 分公开承认了。

![Qwen3.7-Max 1475 分与全球头部的位置对比](cover.png)

## 1475 分到底是什么水平

Elo 这种相对评分有个反直觉的特点：分差越往榜单顶部走，越难拉开。LM Arena 头部六个月里从大约 1494 涨到 1501，只动了 7 分。同一时间 Qwen-Max 从 1464 涨到 1475，动了 11 分。看相对速度，阿里在追近。看绝对差距，26 Elo 没缩小，反而比半年前更清楚地摆出来——头部慢、追赶者得跑得更快才看出动静。

细分子榜把这件事讲得更清楚。Buildfastwithai 拆出的 Qwen3.7-Max 类目排名是：数学 #7、Expert Prompts #9、Software/IT #9、Coding #10。一份「每个子类都进前 10、但每个子类都不是冠军」的成绩单。Artificial Analysis 给的 Intelligence Index 是 57（行业平均 14），放进头部梯队没争议；但具体子项 MMLU、GPQA、SWE-bench 的对位分数，阿里没公布，Artificial Analysis 也只挂了综合指数没拆细。

Decrypt 上周做了一次实测，结论同样克制：在 19 度 Dickson 多项式做了七组模算交叉验证、代码生成行数比 Claude 短 30% 但功能等价；但在叙事推理任务里「忽略时间线、得出结构正确事实错误的结论」。这是当下推理模型共同的失败模式，不独属于 Qwen——但发布会用编程和数学 demo 而不用跨段叙事 demo，这个选择已经是表态。

**追近不追平**。这是给 1475 分最准确的注脚。

![Qwen 半年涨 11 分、头部涨 7 分：相对差缩、绝对差未缩](01_elo_gap.png)

## 「中国闭源最高位」的真正含义

要看懂阿里这次发布会，得把它放进中国 AI 厂商当下的五条路线里。

阿里的 Qwen3.7-Max 不开源，走阿里云百炼 API 收费。同一周 Qwen3.6-27B 和 Qwen3.6-35B-A3B 仍然开源、登顶 HuggingFace，Qwen3.6-Plus 在 OpenRouter 单日调用量突破 1.4 万亿 token，是中国模型在海外开发者社区的最高纪录。**旗舰闭源，中段开源，长尾蒸馏**——阿里在做模型分层闭源，把流量产品留给开源、把毛利产品留给 API。

字节豆包走的是同型路线，从来没真正开过源，2026 年 Doubao Seed 1.6 仍只在自家火山引擎上对外，不进阿里云、腾讯云。DeepSeek 两条腿走，V4 开源、V4 Pro 走 API。智谱 GLM-5 和 Moonshot Kimi K2.6 是开源派——K2.6 在 Code Arena 上拿到 1529 Elo，距 Claude Opus 4.7 的 1565 只差 36 Elo，是开源模型在编码 niche 上离前沿最近的位置。

把这五家放在一起，2026 年中国 AI 厂商的真实分布是这样：旗舰闭源的两家（阿里、字节）、开源 + API 双轨的一家（DeepSeek）、旗舰开源的两家（智谱、Moonshot）。一年前的格局是反过来的——那时 DeepSeek-V3 用开源把 OpenAI 的定价权拉低，全行业押注开源换地位；现在阿里 Qwen3.7-Max 这次发布，相当于给「开源换地位」叙事画了句号。**地位换到了，下一轮要换毛利**。

判断一家中国 AI 厂商商业化决心的方法，已经从「有没有开源模型」变成「有没有把旗舰从开源里拿走」。阿里这次拿走了。

![五家中国 AI 厂商的开源 vs 闭源、旗舰 vs 中段分布](02_camp_matrix.png)

## 520 不是巧合：先挂榜，后发布

5 月 14 日凌晨，LM Arena 上无声出现两个新模型条目：`qwen3.7-max-preview` 和 `qwen3.7-plus-preview`。没有官博，没有 GitHub release，没有 API 入口。Qwen 官方推特账号同一天发了一句：「Qwen3.7 Preview lands on Arena. Alibaba now #6 lab in Text, #5 in Vision. Can't wait to release Qwen3.7 series models!」（Qwen3.7 预览版上 Arena 了。阿里现在是文本第 6 实验室、视觉第 5。等不及要发整个 Qwen3.7 系列。）

6 天后，5 月 20 日，2026 阿里云峰会正式宣布 Qwen3.7-Max。Decrypt 在前一晚 19 号发出实测稿。这段时间窗口里，Arena 上已经有几千次盲测对决支撑 1475 这个数字。**先用真实盲测背书，再开发布会**，等于把 LM Arena 当成自家发布会前的 demo room。

这套打法不新。4 月的 Qwen3.6-Max 用过一字不差的剧本：先静默上 Arena，等分数稳了再官宣。Mistral 在欧洲也这么做。区别是这次时间点卡得特别紧——Google I/O 2026 在 5 月 14 日发完 Gemini 3.5 Flash 和 TPU 8t/8i，Anthropic Opus 4.7 在 5 月上旬发，OpenAI 在准备 GPT-5.5。阿里挤在两场美国发布会之间发，目的是让企业 CTO 在 Q3 模型选型周期之前把 Qwen 列进考虑清单。**520 是营销日期，5/14-5/20 是攻防档期**。

被低估的一点是，「先挂榜后发布」正在变成非美 AI 厂商的标配。下一年里几乎可以预期，凡是不打算 OpenAI 式「发布即默认 SOTA」豪赌的厂商，都会先静默上 Arena 攒分。

![5/14 静默挂榜到 5/20 官宣的两步走时间线](03_timeline.png)

## 35 小时智能体不是模型 demo，是三件套发布

阿里这次发布会上最被反复引用的画面，是 Qwen3.7-Max 连续编程 35 小时、调用工具 1158 次、做了 432 次内核评估，最终在平头哥真武 M890 训推一体 AI 芯片上把注意力内核优化到比官方参考实现快 10 倍。

把这段拆开来看，**它演的不是模型，是三件套**。模型是 Qwen3.7-Max，芯片是平头哥 M890，云是阿里云百炼——这是阿里第一次把这三件东西捆成一个公开的卖品。对标的是 Google I/O 上 Pichai 演的「Gemini + TPU 8t/8i + GCP」，对标的是 OpenAI 长期在做的「GPT + NVIDIA + Azure」。

2026 年的企业 AI 销售，单卖模型 API 的窗口在快速关闭。Google 上周说 3.5 Flash 比同档 frontier 便宜一半、80% workload 切过来一年省 10 亿美元——这不是模型故事，是 TPU 自研的折现。阿里走的是同型逻辑：35 小时长任务能跑稳、1158 次工具调用不掉链、10x 加速能复现，前提是模型、芯片、推理框架同源调优。这事在 NVIDIA 主导的通用栈上做不出来。

**三件套绑定**才是这次发布会真正的产品发布。Qwen3.7-Max 只是这个产品的封面。阿里押注的是未来 2-3 年央国企、金融、能源采购的 AI 系统，会从「选模型 + 自建推理 + 跑 GPU」切到「买阿里云一体套餐」。35 小时 demo 是这条路径的施工预告片。

这次发布会刻意没碰的两件事：M890 实际产能、Qwen3.7-Max API 价格。前者决定阿里云能不能在 2026 下半年把推理产能交付给企业客户，后者决定企业 CFO 怎么算账。Qwen3-Max 输入 2.5 元/百万 token 起，换算约 $0.34，是 Claude Opus 同档（约 $15）的 1/40。如果 3.7 延续同价位，API 价格比 Arena 分数更值得企业认真看——但发布会主线没把这条放在前面。

![Qwen 3.7-Max + 平头哥 M890 + 阿里云百炼：三件套绑定](04_three_piece.png)

## 盲区：Arena 不告诉你的四件事

第一件，LM Arena 的中文样本偏置。Arena 用户里中文 prompt 比例在过去一年明显上升，但具体比例不公开。中文为母语训练的模型在盲测里有系统性优势，1475 分里几分来自构成偏移、几分来自真实能力，外部无法分离。

第二件，preview 版屏蔽工具。Atal Upadhyay 在 5/19 的评测里指出，Qwen3.7-Max-Preview 在 Arena 上跑的时候 code interpreter 和 web search 都禁用，1475 分代表的是「裸模型对话」表现。等 GA 版本接入工具后，分数会变——可能更高（工具补足短板），也可能更低（工具引入新失败模式）。

第三件，Arena 国产第一 ≠ 综合国产第一。BenchLM 同期综合榜上 DeepSeek V4 Pro 87 分仍是中国第一，Kimi K2.6 84 分第二，GLM-5.1 / GLM-5 Reasoning 83 分并列第三。**Qwen3.7 在 Arena 这一个维度夺冠，不是「打败了所有国产对手」，是「在 Arena 这条赛道上排到了第一」**。机器之心的「国产第一」是省略了维度的口号。

第四件，长链推理失败模式。Decrypt 测出的「叙事推理忽略时间线」问题在所有大模型里都有，但 Qwen 这次发布会演的是 35 小时编程 + 数学奥赛，没有公开演示跨段叙事一致性任务。这两类任务在企业落地里都常见——客服会话维持上下文、法律文书梳理时间线，都是叙事推理任务。**Arena 的 1475 不能直接外推到这些场景**。

![单榜冠军 vs 多榜中位：Arena 与 BenchLM 上的中国第一不是同一个](05_two_kings.png)

## 对从业者意味着什么

**模型选型负责人**：把 Qwen3.7-Max 放进中文场景 + 数学/编码任务的备选清单，但不要在长链叙事推理任务里替换 Claude Opus。等 GA 版本上线、code interpreter 与 web search 接回，再做一次端到端测试。

**国产化合规团队**：通义旗舰留在百炼意味着央国企采购可以继续走阿里云通道。如果项目要求模型本地化部署，开源中段 Qwen3.6-27B 和 Qwen3.6-35B-A3B 可以做兜底——这一层阿里这次没动。

**应用开发者**：preview 版 1475 分不代表 GA 版稳定性。Arena 上预览模型在正式发布后掉 10-20 Elo 是常态。建议等阿里云百炼 7-8 月给出 Qwen3.7-Max 正式 API 定价和 SLA 后再决定切换。

**创业团队**：35 小时智能体 demo 跑在平头哥 M890 + 阿里云百炼上。除非整套栈用阿里云，单买 API 拿到的能力会有差距。不要被发布会数字带跑——发布会演的是三件套，单卖模型不是同一个产品。

**国际市场负责人**：这次发布没有英文官博、没有出海宣发。Qwen 3.7-Max 是面向国内企业的发布会，「国产第一」是国内叙事。不要把它当作 Qwen 进入北美/欧洲市场的信号——那条线仍由开源 Qwen3.6 系列承担。

## 本期关键词

**追近不追平**。指相对差距在缩小、绝对差距没缩小的状态。Qwen 半年涨 11 分、LM Arena 头部涨 7 分，名次往前推、Elo 差仍维持 26 分。过去六个月中国旗舰模型整体处于这个状态。

**模型分层闭源**。旗舰留 API、中段做开源、长尾走蒸馏的产品线分层。阿里把 Qwen3.7-Max 留闭源、Qwen3.6-27B 留开源、Qwen3.6-Plus 走 OpenRouter，是这种分层的完整样本。OpenAI、Anthropic 多年前用过，2026 年阿里、字节移植到中国市场。

**先挂榜后发布**。先在 LM Arena 静默上线一个 preview 版本攒分，等真实盲测数据稳了再开发布会。阿里 Qwen3.6-Max、Qwen3.7-Max 连续用过，Mistral 在欧洲也在用。这套打法把 Arena 变成发布会的预 demo 场。

**三件套绑定**。模型 + 自研芯片 + 自家云的捆绑销售。Google 是「Gemini + TPU + GCP」，OpenAI 是「GPT + NVIDIA + Azure」，阿里这次第一次公开演「Qwen + M890 + 百炼」。未来 2-3 年中国央国企 AI 采购的主要交付形态。

**单榜冠军 vs 多榜中位**。在一个 benchmark 上夺冠，不等于在多个 benchmark 上综合最强。Qwen3.7-Max 是 LM Arena 国产第一、BenchLM 综合榜上 DeepSeek 才是国产第一。选型不看单榜，看多榜交集。

## 引用

1. [Qwen 官方推文 — Qwen3.7 Preview lands on Arena](https://x.com/Alibaba_Qwen/status/2056403591464984753)
2. [阿里发布新一代千问旗舰模型 Qwen3.7-Max，登顶最佳国产模型 — DoNews](https://www.donews.com/news/detail/4/6563723.html)
3. [阿里云千问大模型 Qwen3.7-Max-Preview 首发亮相 Arena AI — IT之家](https://www.ithome.com/0/952/041.htm)
4. [阿里千问最强智能体模型 Qwen3.7-Max 发布 — IT之家](https://www.ithome.com/0/952/670.htm)
5. [Qwen3.7 Max Preview: Arena Ranks, Features & What's Next — Buildfastwithai](https://www.buildfastwithai.com/blogs/qwen3-7-max-preview-alibaba-2026)
6. [Alibaba teases new Qwen previews, highest-ranking Chinese AI models on Arena — South China Morning Post](https://www.scmp.com/tech/tech-trends/article/3354087/alibaba-teases-new-qwen-previews-highest-ranking-chinese-ai-models-arena)
7. [Qwen 3.7 Max Preview: What Alibaba's New AI Gets Right and Where It Falls Short — Decrypt](https://decrypt.co/368499/alibaba-qwen-3-7-max-preview-review)
8. [Best Chinese LLMs in 2026: DeepSeek V4, Kimi K2.6, GLM-5, Qwen — BenchLM](https://benchlm.ai/blog/posts/best-chinese-llm)
9. [Kimi K2.6 vs DeepSeek V4 vs GLM-5.1: The Open-Weights Coding Verdict — Codersera](https://codersera.com/blog/kimi-k2-6-vs-deepseek-v4-vs-glm-5-1-2026/)
10. [Qwen3.7 Max — Intelligence, Performance & Price Analysis — Artificial Analysis](https://artificialanalysis.ai/models/qwen3-7-max)
11. [520，遇见国产「新模王」Qwen3.7-Max！— 机器之心（网易转载）](https://www.163.com/dy/article/KTCLAR620511AQHO.html)
