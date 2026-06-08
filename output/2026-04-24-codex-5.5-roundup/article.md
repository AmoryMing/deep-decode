---
title: 分叉领先：GPT-5.5 与 Claude Opus 4.7 的一周战事
date: 2026-04-24
author: AI Force 情报组
tags: [AI编程, GPT-5.5, Claude, Codex, 行业观察]
---

# 分叉领先：GPT-5.5 与 Claude Opus 4.7 的一周战事

过去一周，AI 编程工具领域集中发生了几件值得记录的动态。4 月 16 日 Claude Opus 4.7 正式 GA；4 月 21 日 Anthropic 修改 Pro 计划定价页，Claude Code 的勾选从 $20/月档位中移除；4 月 22 日 OpenAI Codex 团队就此公开说明；4 月 23 日 GPT-5.5 正式发布，同日 Anthropic 披露了 Claude Code 过去两个月的三次系统调整。几件事首尾相接，出现在不足 60 小时的窗口里。

这份观察整理这一周的公开信息，聚焦两个维度：一是 GPT-5.5 与 Claude Opus 4.7 在 benchmark 上的能力分布，二是订阅档位层面的定价与产品形态调整。结论以公开数据和第三方评测为依据，不做推演外的判断。

## 一、能力分布：分叉而非总体领先

Greg Brockman 在 Fortune 采访中的表述是：「It's a faster, sharper thinker for fewer tokens compared to something like 5.4.」相较 5.4，思考更快更准，消耗 token 更少。同一采访中，BNY Mellon CIO Leigh-Ann Russell 给出的评价是「An impressive hallucination resistance... a step change with this model.」一次抗幻觉能力上的质变。

将 GPT-5.5 与 Claude Opus 4.7 的公开 benchmark 放在一起，两者的能力分布呈现出明显的分叉特征：

| Benchmark | GPT-5.5 | Claude Opus 4.7 | 胜者 |
|-----------|---------|-----------------|------|
| Terminal-Bench 2.0（终端任务） | **82.7%** | 69.4% | GPT-5.5 |
| Expert-SWE（20 小时级任务） | **73.1%** | —— | GPT-5.5 |
| GDPval（知识工作） | **84.9%** | ~78% | GPT-5.5 |
| OSWorld-Verified（电脑操控） | **78.7%** | ~65% | GPT-5.5 |
| MRCR v2（512K–1M 长上下文） | **74.0%** | 32.2% | GPT-5.5 |
| FrontierMath Tier 4 | **35.4%** | 22.9% | GPT-5.5 |
| SWE-bench Pro（多文件代码修复） | 58.6% | **64.3%** | Opus 4.7 |
| SWE-bench Verified | ~85% | **87.6%** | Opus 4.7 |
| CursorBench（IDE 集成） | ~65% | **70%** | Opus 4.7 |
| GPQA Diamond（科学推理） | ~93% | **94.2%** | Opus 4.7 |

数据来源：the-decoder.com、lushbinary.com、marktechpost.com。

左半栏集中在 Agent 型任务——终端执行、电脑操控、长上下文检索、长程推理；右半栏集中在代码工程任务——多文件修改、IDE 集成、科学严谨性。GPT-5.5 在前一组上的领先较为明显，Opus 4.7 在后一组上保持优势。

两家近半年的发版节奏与 benchmark 重点也呈现相应分布。OpenAI 持续在 Terminal-Bench、OSWorld、Codex App 内嵌浏览器等方向加注；Anthropic 的更新更多集中在 SWE-bench 相关指标。独立评测站 MindStudio 在其 2026 年系统对比中给出的任务路由结论与这一分布一致：终端脚本、DevOps 自动化、跨 app GUI 任务中，Codex 体验较快；多文件代码仓库修改场景中，Claude Code 结果更稳。

## 二、长上下文上的一处数量级差距

benchmark 对比中一处较突出的差距出现在 MRCR v2 长上下文：74.0% 与 32.2%，绝对差 41.8 个百分点。MRCR v2 测试的是 512K 到 1M token 长上下文的多轮检索能力。

相关参数：GPT-5.5 的 API 上下文窗口为 1M token，Codex App 内为 400K；Claude Opus 4.7 的上下文未同步扩展至同一量级。这一差距所对应的工程语义是，"将中等规模代码仓库整体放入 prompt、由模型一次性处理"这一用法，在 GPT-5.5 的产品边界内进入了可行区间。

定价方面，GPT-5.5 API 为 $5 输入 / $30 输出（每百万 token），较 GPT-5.4 的 $2.5 / $15 翻倍；与 Claude Opus 4.7 的 $5 / $25 输入持平、输出略高。OpenAI 的表述是"等效任务消耗 token 更少"。Simon Willison 在 4 月 23 日发布的独立实测中提供了另一组数据：默认推理模式下（39 reasoning tokens），GPT-5.5 在 Pelican SVG 基准上的结果「I've seen better from GPT-5.4」；开启 xhigh 推理模式后（9,322 reasoning tokens，耗时约 4 分钟），结果有明显提升。默认与高推理模式之间的推理 token 消耗比约为 1:239。

Ethan Mollick 对这一分布给出的框架是「the jagged frontier continues to hold」——前沿模型能力在不同任务上的表现差异较大，难以从单一指标推断整体水平。

## 三、订阅档位层面的一次调整

4 月 16 日 Claude Opus 4.7 GA。SWE-bench Pro 较 4.6 提升 11 个百分点至 64.3%，SWE-bench Verified 提升 6.8 个百分点至 87.6%。Anthropic 官方表述为「A notable improvement on Opus 4.6 in advanced software engineering, with particular gains on the most difficult tasks.」相较 Opus 4.6 的一次显著提升，尤其在最困难的任务上。

4 月 21 日下午，Pro 计划定价页中的 Claude Code 勾选项被移除，相关文档同步从"Pro or Max"调整为"Max only"。该调整未附公告。开发者社区先在 Hacker News 和 X 上发布截图，随后 Anthropic 增长主管 Amol Avasare 在 X 发布说明：

> "For clarity, we're running a small test on ~2 percent of new prosumer signups."
>
> "Usage has changed a lot and our current plans weren't built for this."
>
> "Per-subscriber usage has increased significantly, and our current plan architecture was not designed for this scale."

三段表述拼起来，对外说明了两件事：一是此次变更为 2% 范围内的 A/B 测试，老用户不受影响；二是 Claude Code 当前的使用模式（社区反馈包含数小时会话、后台长跑的 agent workflow）与订阅架构的原始设计假设不完全吻合。

4 月 22 日，Pro 定价页的勾选恢复，部分文档变更保留。Avasare 同日发文表示下次调整会预先沟通。时间线与 Anthropic 在 2 月签订的 $250 亿 Amazon Trainium 算力协议同期出现；该协议的产能按公开报道将在今年稍晚进入可用状态。

## 四、OpenAI 侧在同一窗口的对应表态

在 Anthropic 定价页调整的同一天，OpenAI Codex 团队发布公开说明：

> "Codex will remain available in both the free and Plus ($20/month) plans. We have the compute capacity and efficient models to support it."

4 月 23 日 GPT-5.5 随即发布。两家在订阅档位上的表态差异在这一周内被公开呈现，$20 层级的产品体验首次成为 AI 编程工具叙事中的显性变量。

底层成本结构方面，NVIDIA 在 4 月发布的官方博客披露，GB200 NVL72 相较上代在每百万 token 成本上降低约 35 倍，每兆瓦每秒 token 输出提升约 50 倍；Codex 全量运行在 GB200 基础设施上，NVIDIA 内部有 10,000+ 员工已使用搭载 GPT-5.5 的 Codex。Codex 周活跃用户数在 4 月 8 日为 300 万，4 月 23 日前后的公开报道更新为 400 万。

## 五、Codex 产品形态的一次扩展

4 月 16 日的 Codex 更新（"Codex for almost everything"）在产品形态上呈现出一次扩展：

- **电脑操控（Computer Use）**：Codex 获得独立光标，可点击、输入、操控 macOS 应用。适用场景包括前端回归测试、操作无 API 的工具、GUI bug 修复、iOS 模拟器工作流。限定 macOS，EEA、英国、瑞士暂不可用。
- **内置浏览器**：支持打开 localhost dev server 与基于文件的页面，允许在渲染后的页面上直接评论与反馈。
- **记忆系统（Memory Preview）**：跨会话保留上下文和用户偏好。
- **自动化与调度**：支持未来任务排定，agent 自动唤醒继续执行，支持跨天跨周长期任务。
- **90+ 新插件**：覆盖 Atlassian Rovo、CircleCI、CodeRabbit、GitLab Issues、Microsoft Suite、Neon by Databricks、Render 等。
- **iOS 上线**：ChatGPT iOS app 中集成 Codex，支持发起任务、查看 diff、请求改动、提交 PR，锁屏 Live Activities 显示任务进度。

XDA Developers 4 月的一篇切换测评中作者将 Claude Code 的交互模式描述为「Claude Code's habit of asking questions, explaining trade-offs, and walking you through options is a genuinely educational experience」，并在一周试用后回到 Claude Code。文章同时指出 Codex 在沙箱并行执行与免费层可用性上具备差异化优势。两者的产品形态在此期间呈现出较为清晰的错位：Codex 偏云原生、异步、并行；Claude Code 偏终端原生、本地、交互式对齐。

## 六、Claude Code 近两月的三次系统调整

4 月 23 日，Anthropic 就 Claude Code 近期社区反馈主动披露了三次系统调整：

1. **3 月 4 日至 4 月 7 日**：Claude Code 默认推理档位由 high 调整为 medium，以降低延迟。4 月 7 日 v2.1.118 版本回滚至 xhigh 默认。官方表述为「This was the wrong tradeoff.」
2. **3 月 26 日至 4 月 10 日**：一处缓存清理逻辑被误配置为每次 prompt-response 循环清除，影响 Sonnet 4.6 与 Opus 4.6 上下文保持。4 月 10 日修复。
3. **4 月 16 日至 4 月 20 日**：系统 prompt 中加入的字数限制（工具调用间 25 词、最终回应 100 词）在内部消融测试中观察到 Opus 4.6 与 4.7 能力下降约 3%。4 月 20 日回滚。

三次调整的覆盖期与 Opus 4.7 发布前的时间窗基本重合。披露时点选择在 GPT-5.5 发布同日，属于主动沟通范畴。

同期值得记录的另一点是，4 月 Anthropic 对外声音的构成。Dario Amodei 在此期间的公开活动主要在政策层面，技术层面就 GPT-5.5 未见定向回应；对比 OpenAI 高管在同期的公开发声频次，两者在技术叙事密度上存在差异。

## 七、几个值得记录的公开信号

以下信号基于本周公开信息，仅作记录：

- benchmark 维度上，GPT-5.5 与 Claude Opus 4.7 呈现明确的分叉分布，"总体更强"类的单一比较在当前数据下已不易成立；按任务路由的工具选型在公开评测文献中逐步成为主流表述。
- $20 订阅档位上的产品可用性在本周首次进入公开讨论。Claude Code 相关档位调整与 Codex 同期表态构成了这一变量的首次集中显性化。
- Agent loop 长时间后台运行是 Anthropic 官方沟通中多次出现的使用模式描述。订阅定价与单用户实际算力消耗之间的关系，在公开沟通中被首次承认存在架构层面的不匹配。
- Codex 在 4 月 16 日的更新将能力范围从代码编辑扩展至电脑操控、本地浏览器、跨天调度与移动端；Claude Code 在同期保持终端原生的产品路线。两者的产品形态差异在本周进一步明确。
- 长上下文 benchmark（MRCR v2）上的差距为 41.8 个百分点，API 上下文窗口对比为 1M 对当前未扩展。相关工程模式（整仓放入 prompt）的可行区间在 GPT-5.5 的边界内发生变化。
- 4 月期间 OpenAI 与 Anthropic 在高管层面的公开发声频次存在差异，技术叙事密度上的这一差异本身在部分分析文章中被提及。

## 本期术语

**分叉领先（Forked Leadership）** —— 指前沿模型在不同任务类别上的能力分布呈分叉而非总体领先，一家在 A 类任务上领先，另一家在 B 类任务上领先，双方在各自选定的赛道上刷新 SOTA。

**锯齿形前沿（Jagged Frontier）** —— Ethan Mollick 提出的框架，描述前沿模型能力边界呈锯齿状——同一模型在不同任务上表现差异较大，难以从单一指标推断整体水平。

**20 美元档位（$20 Tier）** —— AI 编程工具订阅架构中的一个关键价格层级。本周公开动态显示，该层级的产品可用性首次在两家头部厂商的对外沟通中成为显性变量。

**Agent loop 消耗模型** —— 订阅定价的一种新场景。用户对模型的消耗方式从"对话次数"转向"后台 agent 持续运行小时数"，单用户实际算力消耗与原始订阅架构假设出现偏差。

**桌面 Agent（Desktop Agent）** —— 指具备电脑操控、本地文件与浏览器访问、跨会话记忆、自动调度能力的产品形态。Codex 在 4 月 16 日更新后接近这一形态。

**任务路由（Task Routing）** —— 在多工具并存环境下，按任务类型选择对应工具的使用模式。公开评测中这一模式在 2026 年呈现增强趋势。

## 原文引用

> "A new class of intelligence for real work." —— Greg Brockman / OpenAI

> "It's a faster, sharper thinker for fewer tokens compared to something like 5.4." —— Greg Brockman / Fortune

> "For clarity, we're running a small test on ~2 percent of new prosumer signups." —— Amol Avasare / Anthropic

> "Usage has changed a lot and our current plans weren't built for this." —— Amol Avasare / Anthropic

> "Codex will remain available in both the free and Plus ($20/month) plans." —— OpenAI Codex team

> "This was the wrong tradeoff." —— Anthropic

> "the jagged frontier continues to hold" —— Ethan Mollick

> "Claude Code's habit of asking questions, explaining trade-offs, and walking you through options is a genuinely educational experience." —— XDA Developers

## 公开信源

1. [Introducing GPT-5.5](https://openai.com/index/introducing-gpt-5-5/) —— OpenAI 官方发布页
2. [OpenAI unveils GPT-5.5 at double the API price](https://the-decoder.com/openai-unveils-gpt-5-5-claims-a-new-class-of-intelligence-at-double-the-api-price/) —— The Decoder
3. [GPT-5.5 vs Claude Opus 4.7 comparison](https://lushbinary.com/blog/gpt-5-5-vs-claude-opus-4-7-comparison-benchmarks-pricing/) —— Lushbinary 系统对比
4. [GPT-5.5 独立实测](https://simonwillison.net/2026/Apr/23/gpt-5-5/) —— Simon Willison
5. [I ditched Claude Code for Codex](https://www.xda-developers.com/ditched-claude-code-for-codex/) —— XDA Developers 切换测评
6. [Codex vs Claude Code 2026](https://www.mindstudio.ai/blog/codex-vs-claude-code-2026) —— MindStudio
7. [Anthropic tests reaction to yanking Claude Code from Pro](https://www.theregister.com/2026/04/22/anthropic_removes_claude_code_pro/) —— The Register
8. [Anthropic admits it dumbed down Claude](https://www.theregister.com/2026/04/23/anthropic_says_it_has_fixed/) —— The Register
9. [Codex for (almost) everything](https://openai.com/index/codex-for-almost-everything/) —— OpenAI
10. [Codex + GPT-5.5 on NVIDIA Infrastructure](https://blogs.nvidia.com/blog/openai-codex-gpt-5-5-ai-agents/) —— NVIDIA Blog
11. [Claude Opus 4.7 GA](https://github.blog/changelog/2026-04-16-claude-opus-4-7-is-generally-available/) —— GitHub Changelog
12. [Sam Altman Codex 300 万周活 + usage 重置](https://www.businesstoday.in/technology/story/openai-codex-celebrates-3-million-weekly-users-ceo-sam-altman-resets-usage-limits-524717-2026-04-08)
