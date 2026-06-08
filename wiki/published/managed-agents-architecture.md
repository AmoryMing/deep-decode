---
title: 脑手分离：Anthropic 不再只卖模型了
type: published
status: published
created: 2026-04-09
updated: 2026-04-13
tags: [AI基础设施, Agent架构, Anthropic, Managed Agents, 平台战略, 脑手分离, harness保质期]
source_url: https://www.anthropic.com/engineering/managed-agents
---

# 脑手分离：Anthropic 不再只卖模型了

## 摘要

拆解 Anthropic Agents API 团队的工程博客"Scaling Managed Agents: Decoupling the Brain from the Hands"。核心架构决策：Session（会话日志，append-only）、Harness（调度器，"脑"）、Sandbox（沙箱，"手"）三者解耦。关键洞察是"Harness 保质期"——Harness 编码了对模型能力的假设，模型升级后假设过期（如 Sonnet 4.5 的 context anxiety 在 Opus 4.5 上消失）。解耦后 p50 TTFT 降 60%、p95 降 90%+。完整产品拼图包含四层：基础层（Agent+Environment+Session）、目标层（Outcomes 自动评分）、协作层（Multi-agent）、记忆层（Memory Stores）。商业模式从按 token 卖变成按 session-hour 卖（$0.08/h）。

## 写作特点

- 信息密度极高：工程博客 + API 文档 + WIRED 报道 + 竞品对比，四层信源压缩成一篇，是 deep-decode 系列写作风格标杆（feedback 已标记）
- 原创概念命名精准："Harness 保质期""调度税""认知基建"，每个都可独立使用
- 竞品分析不偏不倚：Claude vs Codex 的质量胜率 67% 和速度劣势都写了，可信度高
- 盲区章节力度强：锁定风险、研究预览与生产就绪的差距、定价不透明、自主性边界

## 关联概念

- [[harness-engineering]] -- 整篇文章就是 Harness Engineering 的架构级阐述
- [[context-compression]] -- Session 变成外部状态机，上下文管理从不可逆压缩变成可回溯切片
- [[memory-system]] -- Memory Stores 是跨 Session 持久化记忆的 API 化
- [[multi-agent]] -- 协作层的一级委派模型（Agent 调 Agent，被调者不能再调）
- [[permission-pipeline]] -- Vault-based tokens 和 Resource-bundled auth 是权限管道的安全实现

## 关联选题

- [[capability-overhang]] -- Managed Agents 就是 Levie 说的"接线"基础设施，缩短上下文债
- [[boris-claude-code-tips]] -- Claude Code 本身就是一个 Harness，Managed Agents 让任何人都能建自己的 Harness
