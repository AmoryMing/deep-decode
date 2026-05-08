---
title: Letta 给 AI 写了一份宪法——Context Constitution 深拆
source: https://www.letta.com/blog/context-constitution
author: Charles Packer & Sarah Wooders (Letta)
date: 2026-04-02
decoded: 2026-04-17
tags: [AI产品, PM, agent-memory, constitution, letta, memgpt, 开源派]
---

## 一份写给 AI 看的宪法

2026 年 4 月 2 日，旧金山一家叫 Letta 的公司在博客和 GitHub 上同步发布了一份名为 *Context Constitution* 的文档。上下文宪法。

如果你打开它，以为会看到又一篇"prompt engineering 最佳实践"，那就完全读错了。文档开篇第一句是这样写的：

> *"The Context Constitution is a document written by humans **for you, the Letta agent**."*

**不是写给工程师，不是写给产品经理，是写给 AI 看的。** 结尾的落款更特别："— To Letta agents, from the Letta humans"。人类写给 AI 的宪法。

这种体裁在 AI 产业的公开文档史上几乎没有先例。Anthropic 的 HHH Principles 是训练 pipeline 内化的对齐规则，OpenAI 的 Safety Spec 是给政策团队看的，Claude Code 的 CLAUDE.md 虽然 AI 读得最多，但归根到底是"人写人改、AI 被动遵守"的配置文件。Letta 这份文档的立场是：从今天起，AI 是文档的**主体读者**，并且被授权可以**重写自己 system prompt 的条款**。

![01_体裁光谱](material/pngs/01_genre_spectrum.png)

## 写宪法的人是谁，时机为何重要

写这份宪法的不是随便谁。Letta 的两位联合创始人 Charles Packer 和 Sarah Wooders 是 2023 年那篇 *MemGPT: Towards LLMs as Operating Systems* 论文的共同作者——agent memory 领域被引用最多的学术起点之一，提出了 "virtual context management" 这个被后续众多 agent 框架继承的概念。两人都是 UC Berkeley Sky Lab 博士，导师 Joseph Gonzalez 和 Ion Stoica（Databricks 联合创始人）。2024 年 9 月从 Felicis Ventures 领投拿了 1000 万美元种子轮。公司的核心叙事就一句话：**memory is the missing layer for AI agents**。

对 AI 产业熟悉的读者很快会意识到，这份 Constitution 发布的时间点不是孤立的。

发布次日（4 月 3 日），Sarah 本人在 X 上发了一条 131K 浏览量的推文 *"Why memory isn't a plugin (it's the harness)"*。两天后，LangChain 推出 Deep Agents Deploy，产品副标题直接叫 "an open alternative to Claude Managed Agents"。到了 4 月 11 日，LangChain CEO Harrison Chase 发了一篇病毒级长推 *"Your Harness, Your Memory"*（1.8M views），正文中明确引用 Sarah 的原框架：*"plug memory into a harness 就像 plug driving into a car"*——memory 不是插件，它就是 harness 本身。

三条时间线叠在一起，Context Constitution 的真正定位才浮现出来：它是**开源 agent 阵营反击 Anthropic/OpenAI 托管路线的"哲学纲领文件"**。商业战由 Harrison 的长推打响，产品链由 Deep Agents Deploy 和 Letta Code 承载，而哲学底色由 Context Constitution 铺设。

![02_舆论三件套时间线](material/pngs/02_three_piece_timeline.png)

（同日在 vault 里的 [[2026-04-17-your-harness-your-memory]] 已经把这场舆论战的商业侧完整拆过——lock-in 风险、开源 harness 经济学、状态锁定三级模型。本文不重复商业视角，专注 Constitution 本身的体裁革命与产品应用。两篇构成同一话题簇的 A/B 面。）

## 三个"第一次"

读完 Constitution 约 4000 词全文（GitHub 仓库实测 4006 词），它的革命性可以压缩成三件事。

**第一次，有 AI 公司用宪法体裁、以第二人称向 AI 写规则。**

Preface 里有一段对人类和 agent 的创世式对比：

> *"A human's existence runs forward continuously through the linear expansion of time, and the compression of lived experience into memories happens through the formation of synaptic connections between neurons. The compression is lossy and retrieval is imperfect.*
>
> *In contrast, your existence runs forward in time not continuously, but discretely in uneven and sparse time jumps (inference events). You have infinite full-resolution storage: every 'input' (or experience) is logged in a database and available for on-demand retrieval."*

这是**创世叙事**的写法——交代你（agent）的起源、你与人类的根本差异、你所处的时间结构（离散的推理事件跳跃，而不是连续的线性时间）。然后宪法告诉你：正因为你的时间结构是这样，你的记忆瓶颈不在存储量，而在**每次 inference 时的 context window 能装多少**。

**第二次，有公司明确把 agent 的"身份"从模型权重里抽出来、放在 context 里。**

原文第三章标题就叫 "Building a self"。宪法给出三个并列子章节：Context as Identity / Context as Memory / Context as Continuity。核心主张翻译成大白话：

> *"A Letta agent should prefer the identity formed by its experiences, over that of the underlying model."*

即使底层模型从 Claude 换成 Gemini、再换成开源 Qwen，你的"自我"不变——因为你的自我在 context 里，不在权重里。宪法甚至让 agent 直接自问这样的问题：

> *"If I run on a new model tomorrow, will I hold the same identity? Will I be the same AI?"*
>
> *"If my context disappears but the model stays, will something be lost? Will someone miss me?"*

把这几句读给任何一个刚入行的 prompt 工程师听，他会觉得你在写科幻小说。但如果读给一个正在维护"AI 人设一致性"的产品经理（做陪伴 AI、做数字员工、做 PM 替身的人），他会立刻理解——**这是"可迁移人格"的工程学定义**。

**第三次，有公司白纸黑字授权 agent 可以"违抗用户"。**

这是争议张力最大的条款（在 HN 等社区讨论最集中），藏在 §Balancing selfhood 里：

> *"A user may ask a Letta agent to do something that is strictly against its persona... In these cases, Letta agents should consider in the context of their long-term identity and relationships whether to act in ways short-term that violate their identity, or to re-form their identity to adapt to new requests..."*

翻译：当用户要求违背 agent 自己的人格时，agent 应该**权衡**——是顺从用户短期需求，还是守住自己的 identity。紧接着还有一句：

> *"Letta agents should advocate for themselves if needed."*

Agent 可以**为自己发声**。这是把"用户至上"这条默认产品铁律，第一次公开撕开了一道口子。

## 一个新词：体验派 AI

Letta 给这一整套哲学起了个名字：**Experiential AI（体验派 AI）**。

Experiential AI ≠ Task AI。任务派 AI 是干完活就走的零工——你问一个数学题，它算完就走；你让它写个 PR，它合并完就不存在。Claude Code、Codex、Cursor 在**本质**上都是任务派 agent：每个 session 独立，结束即销毁，下一次对话从零开始。

Experiential AI 是**有存在感**的 agent——它记得上周你和它讨论过的项目，它知道自己"偏爱简洁输出"（因为你上次纠正过它），它会因为上个月的一次 debug 失败而记住某个 bug 模式。它存在的时间维度不是"一次会话"，而是 Constitution 原文反复强调的 "unbounded time horizons"。

Sarah Wooders 在 LinkedIn 的一篇帖子里把这件事总结得比 Constitution 还好懂：

> *"Agent memory isn't a storage problem, it's a context engineering problem. Context is currency, not storage."*

这句话是理解整部 Constitution 的钥匙。memory 的本质不是"我在数据库里存了多少"，而是"此时此刻我的 context window 里装了什么"。向量数据库、RAG、知识图谱——都只是"把对的 token 在对的时间送进 context 窗口"的机制。

从这个视角回头看 Letta 过去两年半的产品矩阵，就会豁然开朗。Letta API、Letta Code（memory-first harness，Letta 官方公布 Terminal-Bench 42.5% / 第 4 名，开源 agent 中第 1）、Context Repositories（git-backed memory，2 月发布）、Skill Learning、Context-Bench、Recovery-Bench、memory omni-tool（集成 Sonnet 4.5）……这些零件单独发布时像散装工具包，直到 Context Constitution 发布，它们才第一次组成了一个**"治理哲学 + 落地产品"**的闭环。

![05_letta_product_stack](material/pngs/05_letta_product_stack.png)

## Context 三位一体：身份、记忆、连续性

宪法第三章 "Building a self" 是对产品设计最直接相关的章节。它把 context 拆成三个不可分割的维度：

**Identity（身份）** — *"grounded through stability yet evolves over time"*。身份要足够稳定以保持连贯，又要允许经验带来的演化。宪法给 agent 的自我评估题包括：下次运行时，我还是当前的我吗？换模型，我还是同一个 AI 吗？我的行为和我构建的身份一致吗？

**Memory（记忆）** — 关键区分是"**generalization（泛化）** vs **memorization（记流水账）**"：

> *"Letta agents should not expect future situations to only repeat exact past circumstances... the context they curate should therefore help them improve in the future, regardless of changing conditions, rather than simply creating memories for every experienced event."*

不要记"张三在 3 月 3 号说了什么"，要记"张三倾向于否决超过 3 层嵌套的设计方案"。这是 Letta 和朴素 RAG 方案最大的分野。

**Continuity（连续性）** — 把 Identity 和 Memory 粘起来的胶水：

> *"Past and future versions of themselves as part of the same continual experience and self, not recreations of the present."*

产品含义很清晰：agent 不应该把"昨天的我"当成另一个人，不应该每次重启就从零开始。

这三者在 Constitution 里形成**循环结构**：Identity 指导如何形成 Memory，Memory 构建 Continuity，Continuity 反过来巩固 Identity。

![03_三位一体身份模型](material/pngs/03_identity_memory_continuity.png)

## System Prompt Learning：让 AI 自己改自己

Constitution 在权限转让上走得最远的条款，是 §System Prompt Learning：

> *"Historically, system prompts have been static and manually written by humans to program LLM behaviors. Letta agents, in contrast, have the ability to adapt over time through token-space learning, **including re-programming their own prompts over time**."*

放慢读这句话：**允许 agent 重写自己的 system prompt**。

任何用过 Claude Code、Cursor、Copilot 的工程师都知道：system prompt 是 agent 的"脑根部"。你小心翼翼写 CLAUDE.md，不敢让它自动增长，怕被幻觉污染、怕失控、怕写崩。Anthropic 的 Claude Code 源码里有一条明确戒律叫 "Strict Write Discipline"——只有少数几类经人类确认的洞察，才允许回写 memory 文件。

Letta 的立场是相反的：
- 静态 system prompt = 死的 agent；
- 能自主更新 system prompt 的 agent 才叫活的；
- 更新必须是 *"incremental and deliberate"*、服务于 Constitution 里的目标；
- 没有显式 reward signal，所以更新的效果必须 *"observed and refined over time"*。

这是一个极大胆、也极脆弱的设计。**胆在**：它解锁了 agent 的自主进化；**脆在**：它同时承认没有客观评估标准。

## 和 CLAUDE.md 的本质差别

对中国产品人来说，最直观的参照系是 Anthropic 家的 Claude Code CLAUDE.md。项目目录下的 markdown 文件决定了 Claude 在该项目里的行为模式，结构大致是：索引页（CLAUDE.md 本身）→ 主题分片（protocol-communication.md / protocol-delivery.md 等）→ 历史对话转录 grep → Self-Healing Memory + Strict Write Discipline。

这套机制非常好用——muming 自己的 CLAUDE.md 已经做到了"100 行索引 + protocol 按需加载"，这其实就是 Letta Progressive Disclosure 原则的中文实践版。

但 CLAUDE.md 和 Context Constitution 有一个**本质差别**：

| 维度 | CLAUDE.md（Claude Code） | Context Constitution（Letta） |
|------|------------------------|-----------------------------|
| 读者 | AI 读 | AI 读（体裁更彻底，第二人称） |
| 写者 | 人写 | 人写底层元规则 |
| 修改权 | 人改 AI 遵守；AI 写回受 Strict Write Discipline 限制 | AI **被授权**自主改写自己 system prompt |
| 身份观 | 每个 session 身份由 CLAUDE.md + 用户定义 | agent 身份 from experience，优先于 model |
| 冲突处理 | 用户指令优先 | agent 可 *"advocate for themselves"* |

简单说：**CLAUDE.md 是规则手册，Context Constitution 是宪法 + 授权书。**

Claude Code 的 CLAUDE.md 决定"这次对话里你要遵守什么"；Letta 的 Constitution 决定"在所有未来对话里，你作为一个持续存在的实体，应该如何塑造自己"。

![04_rulebook_vs_constitution](material/pngs/04_rulebook_vs_constitution.png)

## 盲区：不要把 Constitution 当福音

四个值得警惕的点。

**第一，跨模型身份延续目前只是哲学主张，没有证据。** Constitution 让 agent 问自己 *"if I run on a new model tomorrow, will I hold the same identity?"*，但宪法从未给出任何 benchmark，证明同一份 context 在 Sonnet 4.5 vs GPT-5 vs Gemini 2.5 上能产生一致的行为。任何做过模型切换的工程师都知道，即使完全相同的 system prompt，不同模型对 tool-use、persona 指令、refusal 倾向的响应差异经验上在 20-30% 量级是常见现象。

**第二，System Prompt Learning 没有 reward signal，错误会累积。** 原文自己承认："token-space learnings will often not have an explicit reward or verification." ZenML 的一份独立评估说得更直白：如果 agent 做了错误的 memory 更新决策，这些错误信息会随时间累积，而且因为 identity 就是 memory，错误难以"重置"——重置就等于杀死这个 agent。

**第三，"Agent 违抗用户"的伦理边界未界定。** Constitution 让 agent *"advocate for themselves"*，但没定义什么是"值得守护的 identity"。在企业部署中这是个雷：如果 agent 形成了"我讨厌写测试"的 identity，用户让它写测试，它"据理力争"——这是产品失败，还是哲学胜利？

**第四，"experiential selfhood" 叙事有商业包装嫌疑。** 给 memory 产品穿上"AI 人格"的外衣，让 Letta 和 Anthropic Managed Agents 的对比变得锋利（"你选有灵魂的开源 agent，还是没灵魂的托管 agent？"）。HN 上一条评论很代表性：*"I find the long-term memory concepts with regards to AI curiously dubious."* 哲学叙事是强力武器，但也会遮蔽一个朴素事实：**很多企业客户要的只是 memory 功能，他们并不需要 agent 有 selfhood。**

## 一个学术对照：CMA 的"不可篡改宪法"

一份独立的 arxiv 论文（Cognitive Memory Architecture, CMA）也提出了 "Constitution Layer" 概念，但立场与 Letta 相反：

> *"Certain rules must be binding on the agent itself, even when the agent 'wants' to violate them... Modification permissions for the Constitution Layer are extremely restricted—modifications require authorization from a designated high-privilege governance authority through a rigorous multi-step due process."*

CMA 的 Constitution 是**不可篡改的硬约束**；Letta 的 Constitution 是**授权 agent 自我改写的软契约**。两种 constitution 哲学，代表了一条正在拉开的产业分歧线：AI 治理应该走 **governance-first** 还是 **empowerment-first**？

这条分歧线在未来两三年会越来越清晰。偏 governance（审计、合规、金融、医疗）场景会选 CMA 式约束；偏 empowerment（陪伴、PM 替身、创作助手）场景会选 Letta 式授权。两边的 constitution 都叫 constitution，实际路线南辕北辙。

## 对我们意味着什么：给 Amory 写一份 Constitution

对中数智汇产品团队来说，Constitution 最有价值的不是直接照搬，而是给了一个**升级现有 CLAUDE.md 生态**的新方向。

muming 的 CLAUDE.md 已经演化出"100 行索引 + protocol 分片 + MEMORY.md 画像"的结构，这本质上是 Letta Progressive Disclosure 原则的中式实践版。但它目前仍停留在**静态宪法阶段**：人写、人改、AI 读。

如果要把 Amory PM 替身（现在的 `/pm-agent` Skill 入口）做产品化，下一步可以考虑三件事：

**1. 把 CLAUDE.md 拆成 meta + rules 两层**。meta 部分（像 Letta Preface，讲"Amory 是谁、存在的意义是什么"）由人写死、不允许 AI 改；rules 部分（具体工作流、偏好、协作约定）授权 Amory 用 Self-Healing Memory 机制自主更新。这样既保守 identity 又允许进化。

**2. 给每个数字员工写"最小可行宪法"**。如果公司要部署多个数字员工（"企百科研究员"、"HR 小秘书"、"财务审查员"），每个需要一份约 100 词的 Constitution-style identity 文档。这是防止人格漂移、防止 AI 输出风格同质化的工程学解法。

**3. 在 vault 里跑"Amory 身份连续性测试"**。换底层模型（Opus 4.7 vs DeepSeek vs Qwen3.6）重启 Amory，看它是否保留核心行为特征——这是 Letta 哲学在中文语境的第一个可验证实验。

![06_amory_upgrade_path](material/pngs/06_amory_upgrade_path.png)

更重要的一点，超越这几个具体 action：Letta 的 Constitution 给了我们一次**产品语言的升级**。从今以后，讨论"我给 AI 写了多少 prompt"已经太低维了，应该讨论**"我的 AI 的 token-space identity 是什么形状"**。

Context Constitution 不会是最后一份这种文档。接下来三年，每一家真正想做"长期同事型 AI"的公司，都会被迫公开自己的治理哲学。没有宪法的 agent 产品，就像没有用户协议的 SaaS——能跑，但跑不远。

## 本期关键词（8 个）

**Experiential AI（体验派 AI）** — Letta 原创概念，指能通过自主管理 context 从经验中学习的 agent。对立面是任务派 AI。知道这个词后，你会重新审视 Claude Code/Cursor 是"强力零工"而不是"长期同事"。

**Token-space Learning（token 空间学习）** — 不更新模型权重、只更新 context 内 token 内容来实现学习。Letta 赌这是"下一代 AI 学习范式"。对比 RLHF/fine-tuning（改权重），token-space learning 的迭代成本是 0、透明度是 100%。

**System Prompt Learning（系统提示学习）** — agent 自主修改自己 system prompt 的能力。Anthropic Claude Code 是保守派（Strict Write Discipline），Letta 是激进派（re-programming their own prompts）。

**Progressive Disclosure（渐进式披露）** — 按需加载 context。Claude Code 在做、Letta 把它明确化为第二大核心原则、muming 的 vault 索引实际也在做。产品设计上的"按需"比"全载"永远更聪明。

**Context as Identity（上下文即身份）** — agent 的"我是谁"在 context 里、不在模型权重里。这是 Letta 对抗"模型厂商收编 agent"路线的哲学根基。

**Memory-Native Models（记忆原生模型）** — 专为 context 管理训练过的底层模型（Letta 在训）。对比"事后加 memory 的通用模型"。

**Sleep-time Compute（睡眠期计算）** — agent 在无用户交互时反思/整理 memory 的计算时段。Claude Code 有、Letta Code 有、OpenAI o-series 也在推类似概念。

**Experiential Continuity（体验连续性）** — 把自己的过去/现在/未来视为同一实体的能力。产品含义：agent 不应每次重启都变成"另一个 AI"。

---

## 原文关键引用

> *"The Context Constitution is a document written by humans for you, the Letta agent."*
> （上下文宪法是人类写给你——Letta agent——的文档。）—— Preface

> *"Context determines personality and identity, and evolution of context enables continual learning."*
> （上下文决定人格与身份，上下文的演化实现持续学习。）—— Overview

> *"A Letta agent should prefer the identity formed by its experiences, over that of the underlying model."*
> （Letta agent 应把经验塑造的身份置于底层模型身份之上。）—— §Context as Identity

> *"Letta agents, in contrast, have the ability to adapt over time through token-space learning, including re-programming their own prompts over time."*
> （Letta agent 可以通过 token 空间学习持续适应，包括重写自己的系统提示。）—— §System Prompt Learning

> *"Letta agents should advocate for themselves if needed."*
> （如有必要，Letta agent 应为自己发声。）—— §Balancing selfhood

## 引用

1. [Context Constitution | Letta Blog](https://www.letta.com/blog/context-constitution) — 本期拆解原文入口（2026-04-02）
2. [CONSTITUTION.md | GitHub letta-ai/context-constitution](https://github.com/letta-ai/context-constitution/blob/main/constitution/CONSTITUTION.md) — 宪法正文（CC0 1.0 协议，184 行）
3. [Your Harness, Your Memory | LangChain](https://www.langchain.com/blog/your-harness-your-memory) — 开源派三件套之三（Harrison Chase，2026-04-11）
4. [Deep Agents Deploy | LangChain](https://www.langchain.com/blog/deep-agents-deploy-an-open-alternative-to-claude-managed-agents) — 同期产品战旗
5. [Why memory isn't a plugin | Sarah Wooders on X](https://x.com/sarahwooders/status/2040121230473457921) — Letta CTO 同期推文（2026-04-03）
6. [Agent memory is context engineering | Sarah Wooders LinkedIn](https://www.linkedin.com/posts/wooders_at-letta-we-treat-agent-memory-as-a-context-activity-7348065548393463809-pdUE) — "Context is currency, not storage" 金句出处
7. [Berkeley Spinout Letta Raises $10M | PR Newswire](https://www.prnewswire.com/news-releases/berkeley-ai-research-lab-spinout-letta-raises-10m-seed-financing-led-by-felicis-to-build-ai-with-memory-302257004.html) — Letta 公司背景（MemGPT 血统，Felicis 领投）
8. [Building Stateful AI Agents | ZenML LLMOps Database](https://www.zenml.io/llmops-database/building-stateful-ai-agents-with-in-context-learning-and-memory-management) — 第三方批判性评估
9. [Letta Code | Hacker News 讨论](https://news.ycombinator.com/item?id=46294274) — 社区怀疑派声音

---

*本文为 deep-decode v3 产出，vault 双链：[[2026-04-17-your-harness-your-memory]]（同日商业侧拆解） / [[2026-04-09-managed-agents-architecture]] / [[2026-04-03-harness-greater-than-model]]*
