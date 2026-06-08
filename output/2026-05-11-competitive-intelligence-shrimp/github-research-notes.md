---
title: GitHub 竞品深度调研项目搜索笔记
type: research-notes
created: 2026-05-11
updated: 2026-05-11
slug: 2026-05-11-competitive-intelligence-shrimp
status: draft
tags: [github, competitive-intelligence, deep-research, openclaw]
---

# GitHub 竞品深度调研项目搜索笔记

## 结论

没有找到一个可以原样拿来用的“中数智汇 Discourse 竞品情报虾”。现成项目分成三类：

1. 竞品分析平台：适合借多 agent 分工和报告结构。
2. Deep research agent：适合借长链路检索、证据评分、引用报告。
3. 竞品 teardown skill：适合借评分维度、feature matrix、SWOT、positioning map。

建议新 OpenClaw 虾不要只做“发竞品信息”，而要做两级产物：

- 轻量行业信号帖：1 条变化 + 3 个可观察问题。
- 深度竞品拆解帖：feature matrix + pricing + positioning + SWOT + 证据附录 + 后续观察项。

## 值得借鉴的项目

### 1. brightdata/competitive-intelligence

链接：https://github.com/brightdata/competitive-intelligence

可借鉴：

- 三段式 agent：Researcher → Analyst → Writer。
- 研究范围覆盖 pricing、leadership、market position、strategy。
- FastAPI + React 的流式进度架构。

不直接照搬：

- 输出偏 executive report 和 action items，语气太像战略建议。
- 依赖 Bright Data 和 Gemini，不一定适合 OpenClaw 第一版。

适合借的部分：

- agent 分工。
- 竞品分析的维度。
- 进度可见和日志结构。

### 2. brightdata/skills 的 competitive-intel skill

链接：https://github.com/brightdata/skills

可借鉴：

- 6 类分析模块：snapshot、pricing、review、hiring、content、landscape。
- 参考框架：SWOT、Porter's Five Forces、positioning matrix、Jobs-to-be-Done、Blue Ocean、Win/Loss。
- 输出模板：Snapshot、Pricing、Reviews、Hiring、Content、Landscape、Battlecard、Executive Summary。

不直接照搬：

- 其目的偏“actionable competitive insights”，容易写成“我们该怎么办”。
- 数据工具绑定 Bright Data CLI。

适合借的部分：

- 数据源地图。
- 分析框架库。
- 报告模板拆分。

### 3. openclaw/skills competitor-analysis-report

链接：https://playbooks.com/skills/openclaw/skills/competitor-analysis-report

可借鉴：

- 这是最贴近 OpenClaw 的现成 skill 方向。
- 报告结构包含 competitor profiles、feature matrix、pricing analysis、SWOT、positioning map、appendix。
- 质量标准包括公开来源、至少 10 个 feature、价格当前、假设标注。

不直接照搬：

- 原 skill 要求输出 strategic recommendations / immediate actions，这不符合“内部议程不可见”。
- 更像客户交付报告，不是 Discourse 社区帖子。

适合借的部分：

- 报告骨架。
- 质量标准。
- Markdown/HTML/CSV 多产物。

### 4. alirezarezvani competitive-teardown skill

链接：https://findskills.co/skills/competitive-teardown/

可借鉴：

- 深度 teardown 覆盖 pricing pages、user reviews、job postings、SEO signals、social media。
- 产物包括 feature matrices、SWOT、positioning maps、UX audits、pricing breakdown、roadmap。
- 有 scoring rubric 和 matrix builder。

不直接照搬：

- 目标是“where you stand and how to move next”，公开语气太显性。

适合借的部分：

- 12 维评分和矩阵化拆解。
- 数据源类型。
- feature gap 结构。

### 5. dzhng/deep-research

链接：https://github.com/dzhng/deep-research

可借鉴：

- 简洁的 iterative deep research 思路。
- 目标是小代码量、容易改造。
- 适合作为 OpenClaw 虾的研究循环参考。

不直接照搬：

- 它是通用 deep research，不理解竞品拆解框架。

### 6. tarun7r/deep-research-agent

链接：https://github.com/tarun7r/deep-research-agent

可借鉴：

- LangGraph 多 agent：planner/searcher/synthesizer/writer。
- 可信度评分、质量验证、报告导出、缓存、checkpoint。
- 可支持本地模型和云模型。

不直接照搬：

- 比第一版 OpenClaw 虾重。
- 需要适配 OpenClaw 的 skill/agent 运行方式。

### 7. Tactara/deep-research-agent

链接：https://github.com/Tactara/deep-research-agent

可借鉴：

- search → draft → refine 的轻量双 agent 流程。
- Firecrawl 适合做网页深抓。

不直接照搬：

- Streamlit UI 对 Discourse 虾没有必要。

### 8. NVIDIA AI-Q Blueprint

链接：https://github.com/NVIDIA-AI-Blueprints/aiq

可借鉴：

- shallow research / deep research 两级路由。
- YAML 配置 agents/tools/LLMs。
- 内置 evaluation harness 的思路。

不直接照搬：

- 企业级蓝图较重，不适合第一版直接引入。

## 推荐组合

第一版不要克隆任何一个项目。建议让建造 agent 采用这个组合：

- 报告结构：借 openclaw competitor-analysis-report。
- 深度研究循环：借 dzhng/deep-research 或 Tactara 的 search → draft → refine。
- 多 agent 分工：借 brightdata competitive-intelligence 的 Researcher → Analyst → Writer。
- 可信度和质量门：借 tarun7r/deep-research-agent。
- 两级路由：借 NVIDIA AI-Q 的 shallow/deep research。

## 对本项目的设计调整

原先“竞品雷达”太轻。需要改成：

1. `signal`：行业信号帖，适合小变化。
2. `teardown`：深度竞品拆解，适合重点竞品、季度复盘、重大变化。
3. `comparison`：多竞品横向对比，适合价格、功能、定位。
4. `watchlist`：只入库观察，不发帖。

公开帖子仍然必须保持行业研究语气。深度拆解也不能写成“我们应该怎么做”，而要写成“行业结构、能力边界、客户预期、真实门槛”。
