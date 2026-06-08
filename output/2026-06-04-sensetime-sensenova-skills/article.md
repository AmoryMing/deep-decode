---
title: 商汤把办公能力做成了「技能包」：SKILL.md 正在变成 Agent 的通用货币
date: 2026-06-04
type: decode
slug: 2026-06-04-sensetime-sensenova-skills
style: default
reader: default
sources:
  - https://x.com/SenseTime_AI/status/2061822148076093625
  - https://github.com/OpenSenseNova/SenseNova-Skills
  - https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills
distribute: [email, xiaohongshu]
---

# 商汤把办公能力做成了「技能包」：SKILL.md 正在变成 Agent 的通用货币

商汤这次开源的不是模型，是四个「技能包」。6 月初，商汤（SenseTime）在官方 X 账号放出 SenseNova-Skills，称它是「一套面向任何技能兼容智能体的开源 AI 办公技能套件」（an open-source AI office skill suite for any skills-compatible agent），并点名两个运行时——OpenClaw 和 HermesAgent。值得拆的不是这四个功能本身有多强，而是它选择的封装形式：每个技能都是一个带 `SKILL.md` 的目录，遵循 Anthropic 半年前开源的 Agent Skills 规范。

这意味着一件事：去年底还只是 Anthropic 一家提案的「技能即文件夹」格式，正在被一家中国头部模型公司当成默认的能力分发单位。技能（skill）正在从某个产品的内部功能，变成跨 agent 复用的通用货币。下面把这件事拆给做 AI 产品和做垂直能力的人。

![封面](assets/gpt-img/00_cover.png)

## 本期看点

- **Agent Skills 规范** —— Anthropic 2025 年 12 月开源、捐给 Linux 基金会旗下 AAIF 的开放标准。一个技能就是一个文件夹，里面放一个 `SKILL.md` 声明触发条件和用法，agent 按需加载。
- **SKILL.md** —— 技能的"说明书"，YAML 头部 + Markdown 正文，告诉 agent 这个技能干什么、什么时候触发、怎么执行、依赖哪些脚本和资源。
- **技能兼容（skill-compatible）** —— 一个 agent 运行时只要认 `SKILL.md` 这套格式，就能直接装别人写的技能，不必为每个能力重写一遍胶水代码。
- **agent 运行时（runtime）** —— 真正执行任务的壳，比如 OpenClaw、HermesAgent、Claude Code。运行时负责"读技能、调模型、跑脚本"，技能负责"提供具体能力"。

## 一、商汤开源的到底是什么

先把东西看清楚，再谈趋势。SenseNova-Skills 的 GitHub 仓库（OpenSenseNova/SenseNova-Skills，MIT 协议）里是四组技能，按目录前缀分：

图像与可视化（`sn-image-*`）——文生图、图像识别、信息图自动生成与质检，能镜像参考图的风格。PPT（`sn-ppt-*`）——快速 / 标准 / 创意三种模式，支持多文件输入，生成大纲后做智能排版，渲染图表，最后用视觉语言模型（VLM）做一遍质检，产出可编辑文件。数据分析（`sn-da-*`）——Excel 多表读取、清洗、聚合，针对一万行以上的大文件做了优化，还能 OCR 图片里的表格再解读。深度研究（`sn-deep-research`）——规划、分维度取证、综合、成稿的全流程，跨维度交叉验证证据，支持断点续跑。

这四样拆开看都不新鲜，市面上单点工具一大把。新鲜的是封装方式。仓库 README 写得很直白：每个技能放在独立目录，遵循 Agent Skills 规范，在 `SKILL.md` 里声明触发条件、能力边界、执行方式，再带上 `references/`、`scripts/`、`prompts/` 这些支撑资源。安装路径直接对齐运行时——OpenClaw 装到 `~/.openclaw/skills/`，Hermes 装到 `~/.hermes/skills/`。底层视觉能力跑在商汤自家的 SenseNova U1 模型上，但仓库推荐的搭配 LLM 是 SenseNova 平台 API，并不强制。

![SenseNova-Skills 四大技能模块](assets/gpt-img/01_four_skills.png)

## 二、为什么"做成 SKILL.md"比"做成产品"重要

关键的判断在这里：商汤大可以把这四个功能做进自家 App，做成一个「日日新办公助手」。它没有，它把能力拆成符合开放标准的技能包，扔到 GitHub 上，明说支持 OpenClaw 和 Hermes 这些**别家的**运行时。

这背后是 Agent Skills 规范在解决的那个真问题。Anthropic 在 2025 年 12 月把这套格式开源时讲得很清楚，它的工程博客把技能定义成「组织好的指令、脚本和资源的文件夹，agent 能动态发现并加载，从而在特定任务上表现更好」（organized folders of instructions, scripts, and resources that agents can discover and load dynamically）。一个技能最简形态就是一个含 `SKILL.md` 的目录。

这个格式刻意做得很薄。它只规定"足够让技能可被发现、可移植"的结构，不限制 agent 拿技能去干什么。薄，是为了可移植。结果是同一个技能文件夹，能在认这套格式的任何运行时里跑——Anthropic 自己列过采纳方：OpenClaw、Codex CLI、Cursor、Gemini CLI。商汤现在把"办公能力"也塞进了这个口子。

对比一下没有标准的世界：每家 agent 自定义一套插件接口，你写一个 PPT 生成能力，要给 Claude Code 写一遍、给 Cursor 写一遍、给某国产 agent 再写一遍，每次都是重造同一个轮子的胶水层。`SKILL.md` 把这层抽走了。能力写一次，所有兼容运行时通用。这就是"技能兼容"四个字真正的分量——它不是营销词，是省掉 N 倍重复集成工作的工程承诺。

![有标准 vs 无标准：能力分发的两种世界](assets/gpt-img/02_standard_vs_silo.png)

## 三、三家指向同一个标准，这才是信号

单看商汤一家，是一次开源动作。把时间线拉开看，是一条清晰的收敛曲线。

2025 年 12 月，Anthropic 把 Agent Skills 作为开放标准发布，并捐给 Linux 基金会背书的 Agentic AI Foundation（AAIF）——捐出去，是为了让它不属于任何一家，从而摆脱"围墙花园"。这一步把标准从"Anthropic 的格式"变成"行业的格式"。

接着是垂直领域的填充。Google DeepMind 开源了 science-skills，用同一套 `SKILL.md` 格式把 AlphaGenome、UniProt 等 30 多个科学数据库和工具打包成技能，目标是给科研 agent 提供"更好的事实接地和更高的 token 效率"。社区里 K-Dense 的 scientific-agent-skills 走得更远，号称被十六万科学家使用、兼容 Cursor / Claude Code / Codex 和开放 Agent Skills 标准。

现在轮到办公场景，由一家中国模型公司补上。三件事——Anthropic 定标准、DeepMind 填科研、商汤填办公——用的是同一个文件格式，瞄的是同一种东西：把领域能力打包成可移植的 skill，跨 agent 运行时复用。

这条曲线像极了别的基础设施标准成型的路径。当年容器格式从 Docker 私有走向 OCI 开放标准，能力（镜像）就和运行时解绑了；模型上下文用 MCP 把"接外部数据"标准化，工具调用就和具体 agent 解绑了。Agent Skills 干的是第三件——把"领域能力"和运行时解绑。商汤这次入场，等于在中国生态这一侧给这个标准投了一票。

![技能标准化的收敛时间线](assets/gpt-img/03_timeline.png)

## 对从业者意味着什么

做垂直能力的团队，这是最直接的一条：把你的核心能力做成 skill，而不是做成封闭产品。如果你手上有一个特别能打的单点能力——某行业的合同审查、某类数据的清洗、某种报告的自动生成——过去你得自己做一个 App 去获客、去留存，跟所有超级 agent 抢入口。现在有第二条路：把它写成符合 `SKILL.md` 规范的技能包，让它在 OpenClaw、Claude Code、Cursor 这些运行时里被调用。你不再跟 agent 抢用户，你成为 agent 的一块能力拼图。分发逻辑从"做流量"变成"做被集成"。

做 agent 平台 / 运行时的团队，"是否技能兼容"正在从加分项变成入场券。商汤明确支持 OpenClaw 和 Hermes，等于反向给这两个运行时背书。一个不认 `SKILL.md` 的运行时，意味着用户没法直接装别人写好的几千个技能，得等你自己一个个复刻。标准这边的网络效应一旦转起来，孤立的私有插件体系会越来越难。

做企业 AI 选型的人，评估一个 agent 方案时多问一句：它认不认开放技能标准。认，你以后能从 GitHub 上一键加装社区和厂商的技能，能力会随生态自动增长；不认，你被锁死在这家厂商自己开发的功能清单里，它做多少你用多少。这一条决定的不是今天好不好用，是两年后还能不能扩。

## 引用

1. SenseTime 官方推文：「Power smarter AI agents with #SenseNova-Skills——一套面向任何技能兼容智能体（含 OpenClaw 和 HermesAgent）的开源 AI 办公技能套件」：https://x.com/SenseTime_AI/status/2061822148076093625
2. SenseNova-Skills GitHub 仓库（OpenSenseNova/SenseNova-Skills，MIT 协议）：https://github.com/OpenSenseNova/SenseNova-Skills
3. Anthropic 工程博客《为真实世界装备 agent：Agent Skills》（Equipping agents for the real world with Agent Skills）：https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills
4. Google DeepMind science-skills 仓库：https://github.com/google-deepmind/science-skills
5. Agent Skills 开放标准主页：https://agentskills.io/home
