---
title: GBrain 没有 8 层——它只改了记忆该长什么样
source: https://github.com/garrytan/gbrain
author: Garry Tan (Y Combinator 总裁兼 CEO)
date: 2026-04-10
decoded: 2026-05-18
type: decode
status: ready-to-distribute
tags: [Agent记忆, 个人AI, 知识系统, RAG, GBrain]
---

![封面](assets/png/00_系列封面.png)

Y Combinator 总裁 Garry Tan 在 4 月 10 日开源了 GBrain，12 天写成，24 小时拿到 5,400 多个 GitHub star，X 上触达 150 万人。中文圈给它的标题是"8 层架构捅破个人 AI 天花板"。

打开仓库，里面只有三层。"8 层"是转译时加的。

这个偏差不是小事。一个项目最被传播的卖点如果是别人替它总结出来的，真正值得抄的东西很可能就不在那部分。GBrain 确实改了一件事，改的不是"层数"，是记忆该长什么样。

## "8 层"是怎么变出来的

GBrain 的 README 和 GitHub 上的第三方评测口径一致：三层。最底下是一个装满 markdown 文件、用 git 做版本控制的 Brain Repo，这是唯一的事实来源。中间是检索层，Postgres 加 pgvector，也可以用嵌入式的 PGLite——一个跑在 WebAssembly 里的 Postgres 17.5，两秒起库，不用单独装数据库服务。最上面是 34 个（一处文档写 40 多个）markdown 写的 agent skill 文件。

中文摘要把"前 4 层升级检索、后 4 层实现终身记忆和自我进化"说成 8 层，是把检索流水线里的几个步骤（向量、关键词、融合、去重）和几个维护任务分别数成了"层"。这是阅读理解，不是项目设计。Garry Tan 自己的措辞是另一句话：**"Thin harness, fat skills: the intelligence lives in the skills, not the runtime."**（薄壳，厚技能：智能住在技能文件里，不在运行时引擎里。）项目文档里更直白的一句是 **"markdown is code and your agent is a package manager"**（markdown 就是代码，你的 agent 是包管理器）。

把这两句话放在一起，GBrain 的设计哲学就清楚了：它刻意不在代码里实现复杂逻辑，而是把逻辑写成 markdown 指令，交给模型去执行。这决定了它的全部优点和全部风险，下面会反复回到这一点。

![三层不是八层](assets/png/01_三层不是八层.png)

## 真正改掉的那一件事

普通的 RAG（Retrieval-Augmented Generation，检索增强生成——先从外部文档库里捞出相关片段，再塞给大模型生成回答）作为 Agent 记忆有三个结构性毛病，学界 2026 年的记忆综述讲得很清楚：它不能更新状态，它按相似度而不是按真相检索，它没有时间感。会话一结束，它什么都不记得。RAG 本质是无状态检索，每次都把外部索引当成临时书架。

GBrain 在数据模型这一层动了刀。它的每一个 markdown 页面强制分成两段。横线以上叫 **compiled truth**（编译后的真相）：对这个人、这家公司、这件事当前的综合理解，证据一变就整段重写。横线以下叫 **timeline**（时间线）：append-only 的证据流，只追加，永不修改。

这个两段式直接对着 RAG 的三宗罪打。"不能更新状态"——compiled truth 就是可被重写的状态。"按相似度而非真相检索"——agent 先读 compiled truth，那是被显式维护过的结论，不是一堆相似度高的碎片。"没有时间感"——timeline 本身就是时间轴。

值得抄的就是这个决策，而不是它的层数或代码量。把"结论"和"证据"在存储结构上物理分开，让结论可以被推翻、证据永远可追溯，这是大多数往 Agent 上贴向量库的团队没做的事。GBrain 公布的 BrainBench 数字也指向这里：开启图层（结构化的实体关系查询）相比只用向量检索，P@5（前 5 个检索结果里相关的比例）高出 31.4 个百分点。评测方的原话是 **"The published BrainBench numbers describe what the code actually does."**（公布的 BrainBench 数字描述的是代码实际做到的事。）这句话本身是个信号——它特意强调"实际做到"，因为有别的部分没做到。

![RAG三宗罪对照](assets/png/02_RAG三宗罪.png)

## "自我进化"在代码里是什么

GBrain 最被津津乐道的功能叫 dream cycle（梦境周期）：cron 定时任务在用户睡觉时跑一条 11 阶段的维护链，从 lint、同步、综合、抽取、找模式、重算情绪权重，一路到合并、嵌入、清孤儿、清垃圾。Garry Tan 说他醒来时"系统比我睡前更聪明"。中文摘要把这叫"自我进化"。

一份独立代码审查把这层叙事拆开了。审查者去源码里搜 dream cycle、compiled truth 重写、实体识别这三个旗舰功能的实现，结论是这三个**全部以 markdown 指令文档的形式存在，不是可执行代码**。源码里搜不到 `rewrite`、`schedule`、`setInterval`、`timer` 这些关键字。审查的原话是 **"no rewrite logic, no scheduling mechanisms, no entity detection implementation"**（没有重写逻辑，没有调度机制，没有实体识别的实现）。同一份审查还在 MCP server 集成里找出 12 个严重问题，包括并发竞态和 NULL embedding 覆盖——多个 agent 同时写，可能把已算好的向量冲成空值。

这不等于 GBrain 是空壳。同一批审查者承认它的基础设施"reasonably competent"（相当称职）：Postgres 加 pgvector 的存储层、用倒数排名融合（RRF，把多路检索结果按排名加权合并）的混合搜索、分块流水线，这些是真代码。它的实体识别甚至有个反直觉的优点——零 LLM 调用，纯 regex 加字符串匹配，大批量灌数据时"$0 in tokens"（不烧一分钱 token）。

所以准确的说法是：GBrain 的检索和存储是工程，它的"记忆""进化""学习"是写给模型看的操作手册。"自我进化"能不能发生，取决于背后那个模型听不听话，不取决于 GBrain 的代码。

![指令不是引擎](assets/png/03_指令不是引擎.png)

## 把智能押在指令遵循上，是一笔赌注

"Thin harness, fat skills"不是缺陷，是一个明确的工程下注。它赌的是：模型的指令遵循能力会一直变强，所以与其用代码把逻辑焊死，不如用自然语言把逻辑写成 skill，让逐月变强的模型去解释执行。这套思路和 Anthropic 在托管 Agent 里讲的"Harness 有保质期"是同一个方向——为特定模型行为打的硬补丁会过期，留接口比留实现更耐用。

赌注的另一面是确定性。一段 Python 写的重写逻辑，输入相同输出就相同，可测试、可回滚、可审计。一段 markdown 写的"请把矛盾的证据综合进 compiled truth"，结果取决于当时哪个模型、什么版本、什么上下文。学界记忆研究里最硬的几个问题——巩固新知识时不灾难性遗忘旧知识、按因果而不是相似度检索、反思时不把错误固化进去——GBrain 没有在代码层解决，它把这些问题转写成 markdown 指令转交给了模型。compiled truth 的"证据变了就重写"恰恰正面撞上"反思时不固化错误"：重写就是一次反思，而除了 timeline 里的原始证据，没有第二个真值源去校验这次重写有没有把错误写得更牢。

对企业来说，这是 build-vs-buy 之外的第三个问题：buy 进来的到底是引擎还是手册。如果是手册，那它的可靠性上限就是你自己那个模型的指令遵循上限，而不是 GBrain 项目的工程质量。

![薄壳厚技能的赌注](assets/png/04_薄壳厚技能赌注.png)

## 盲区：单人脑，不是团队脑

GBrain 是 Garry Tan 为自己一个人造的。这句话不是修辞，是架构事实。它的检索器不做多跳图遍历——"我在 YC 见过的人创办的公司里，谁投过其中某一家"这种需要顺着关系链跳两三步的查询，它答不了。第三方评测在这一项只给 2 分（架构本身给了 5 分）。它的默认形态是单运营者：PGLite 跑在一台机器上，多人协作要迁到正经 Postgres，还要处理 brain repo 跨机器的 git 操作。它要求运营者自己手写 schema 和 workflow，不像一些竞品能自动从对话里合成结构。

还有数字本身的不一致。README 写 17,888 页、4,383 人、723 家公司、21 个 cron；skillpack 文档写 14,700 多个文件、40 多个 skill、20 多个 cron。两份官方文档对不上，说明项目本身在快速变动，引用单一数字的判断都该打折。最初那条发布推文挂在付费墙后面，本文关于发布反响的数字来自五家第三方转述的交叉，不是原文。

这些都不是 bug，是定位。GBrain 证明的是一个人可以为自己造一个很好的记忆系统，没有证明这套东西能直接搬给一个团队用。

## 对 AI 从业者意味着什么

- **PM**：本周别把"YC 总裁开源了终身记忆系统"写进任何路线图。值得进路线图的是 compiled truth + timeline 这个数据模型——回去 review 你产品里存"用户画像"的地方，问自己：结论和证据是不是混在一张表里，结论能不能被推翻，证据是不是 append-only。
- **架构师**：本周做一次 build-vs-buy 之外的第三轮评估——把候选的 Agent 记忆方案按"引擎还是指令手册"重新分类。凡是核心能力靠 markdown 指令实现的，它的可靠性上限等于你自己模型的指令遵循上限,把这条写进选型表。
- **CTO**：本周和团队复盘一个问题——如果给内部 Agent 上记忆层，团队接受"自我进化是 prompt 脚手架、不是确定性引擎"这个事实吗。接受，GBrain 的数据模型可以直接抄；不接受，需要的是带回滚和审计的确定性重写逻辑，那要自己写。
- **工程师**：本周把 compiled-truth + timeline 用最小代价实现一遍——一个 markdown 文件，横线上一段可重写的结论，横线下 append-only 的证据流，git 管版本。不用 Postgres，先验证这个数据模型对你的场景成不成立，再决定要不要上检索层。

GBrain 最有价值的地方，是它用一个被广泛传播的项目证明了：Agent 记忆的瓶颈很多时候不在检索算法，在你有没有把"真相会变"和"时间"写进存储结构。它最容易被误读的地方，是把一份写给模型看的操作手册当成了会自己进化的引擎。这两件事之间的距离，就是叙事跑在代码前面的那段距离。

---

## 本期关键词

**RAG（检索增强生成）** -- Retrieval-Augmented Generation。先从外部文档库按相似度捞出相关片段，再把片段塞进大模型的上下文里生成回答。它是目前给 LLM 接外部知识最主流的做法，但作为 Agent 的长期记忆有三个结构性毛病：不能更新已存的状态、按相似度而非真相检索、没有时间感。会话结束即遗忘。GBrain 的整套设计就是冲着补这三个毛病去的。

**向量检索** -- 把文本转成一串数字（嵌入向量），用向量之间的距离衡量语义相似度来做检索。它能找到"意思相近"的内容，但找不到"哪个是对的"，也不知道"哪个是后来更新的"。GBrain 的混合检索在向量之外又叠了关键词匹配和图查询，BrainBench 上开启图层比纯向量的 P@5 高 31.4 个百分点。

**compiled truth + timeline（编译后的真相 + 时间线）** -- GBrain 的核心数据模型，也是本文判断它真正突破所在。每个 markdown 页面强制分两段：横线以上是当前的综合结论，证据一变就整段重写；横线以下是只能追加、永不修改的证据流。结论可被推翻，证据永远可追溯，二者在存储结构上物理分开。大多数往 Agent 贴向量库的团队没做这一步。

**dream cycle（梦境周期）** -- GBrain 里被叫作"自我进化"的功能。cron 定时任务在用户睡觉时跑一条 11 阶段维护链（lint、同步、综合、抽取、找模式、重算情绪权重、合并、嵌入、清孤儿、清垃圾等）。独立代码审查发现它以 markdown 指令文档形式存在，源码里没有调度逻辑——它能不能"进化"取决于背后模型听不听指令。

**thin harness, fat skills（薄壳，厚技能）** -- GBrain 的设计哲学。刻意不在代码里实现复杂逻辑，而是把逻辑写成 markdown 技能文件交给模型解释执行，项目文档原话是"markdown 就是代码，你的 agent 是包管理器"。它赌模型指令遵循能力持续变强，代价是放弃了代码逻辑的确定性、可测试性和可回滚性。

**RRF（倒数排名融合）** -- Reciprocal Rank Fusion。把多路检索（向量、关键词等）各自的结果列表按排名位置加权合并成一个总榜的算法，名次越靠前权重越大。GBrain 用它把向量检索和关键词检索的结果融成一个列表，是它混合检索里的真代码部分。

**entity detection（实体识别）** -- 从每条消息里自动识别出人名、公司、概念等实体，挂进知识图谱。GBrain 的实体识别有个反直觉的优点：零 LLM 调用，纯正则加字符串匹配，大批量灌数据时不烧 token。但独立审查指出它和 dream cycle、compiled truth 重写一样，旗舰描述与可执行代码之间有差距。

**终身记忆 / 自我进化** -- 让 Agent 跨会话、跨年持续积累并自动整理知识，越用越懂你。这是 GBrain 叙事的核心卖点，也是学界尚未解决的硬问题。GBrain 没有在代码层解决，而是把它转写成 markdown 指令交给模型，可靠性上限因此等于使用者那个模型的指令遵循上限。

**灾难性遗忘** -- 长期学习系统的经典难题：吸收新知识时把旧知识覆盖掉。学界记忆研究的几个硬骨头——巩固时不灾难性遗忘、按因果而非相似度检索、反思时不固化错误——GBrain 都没在代码层解决。它的 compiled truth 重写恰恰正撞"反思时不固化错误"：重写本身可能把错误写得更牢，而没有第二个真值源去校验。

**MCP（Model Context Protocol）** -- 让 Agent 以统一协议调用外部工具和数据源的接口标准。GBrain 通过 MCP server 暴露 30 多个工具，让 OpenClaw、Hermes 之外的 Claude Code、Cursor 等也能接它。但独立审查在这个 MCP 集成里找出 12 个严重问题，含并发竞态和 NULL embedding 覆盖——多 agent 并发写记忆时的可靠性还没被验证。

## 原文关键引用

> "Thin harness, fat skills: the intelligence lives in the skills, not the runtime."（薄壳，厚技能：智能住在技能文件里，不在运行时引擎里。）-- GBrain README

> "markdown is code and your agent is a package manager"（markdown 就是代码，你的 agent 是包管理器。）-- GBRAIN_SKILLPACK.md

> "no rewrite logic, no scheduling mechanisms, no entity detection implementation"（没有重写逻辑，没有调度机制，没有实体识别的实现。）-- 独立代码审查

> "The published BrainBench numbers describe what the code actually does."（公布的 BrainBench 数字描述的是代码实际做到的事。）-- vectorize.io GBrain 评测

## 引用

1. [garrytan/gbrain](https://github.com/garrytan/gbrain) -- 本期拆解原项目（README + docs）
2. [GBRAIN_SKILLPACK.md](https://github.com/garrytan/gbrain/blob/master/docs/GBRAIN_SKILLPACK.md) -- skills 本质与架构哲学一手文档
3. [GBrain Review: An Honest Assessment](https://vectorize.io/articles/gbrain-review) -- 量化评分（架构 5/5、集成 2/5）、+31.4 P@5、短板
4. [What Is GBrain?](https://vectorize.io/articles/what-is-gbrain) -- 三层架构与生产规模交叉验证
5. [One Open Source Project a Day No.46（独立代码审查）](https://dev.to/wonderlab/one-open-source-project-a-day-no46-the-y-combinator-ceo-wrote-his-own-ai-brain-and-open-sourced-2ib5) -- 三旗舰功能无可执行代码 + 12 个并发问题
6. [YC President Garry Tan Open-Sources GBrain](https://noqta.tn/en/news/garry-tan-gbrain-open-source-ai-agent-memory-2026) -- 发布日期、star 轨迹、X 触达
7. [Garry Tan's GBrain Leverages Git and Postgres](https://fenado.ai/news/technology/garry-tans-gbrain-leverages-git-and-postgres-for-robust-multi-agent-ai-memory) -- git+postgres 多 agent 记忆
8. [Memory for Autonomous LLM Agents: A Survey](https://arxiv.org/html/2603.07670v1) -- 学界记忆研究对照（RAG 三宗罪、巩固、因果检索）
9. [AIHOT 中文 tip 摘要](https://x.com/AYi_AInotes/status/2055954675526934642) -- "8 层"框架来源（转引，原 X 帖付费墙）
