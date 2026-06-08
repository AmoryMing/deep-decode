---
title: 15 条"小技巧"背后的大图景 -- Claude Code 创建者揭示的三层架构
type: published
status: published
created: 2026-03-31
updated: 2026-04-13
tags: [AI产品, Claude Code, 开发工具, Agent, 自主编程, 三层金字塔, intent-orchestration]
source_url: https://x.com/bcherny/status/2038454336355999749
---

# 15 条"小技巧"背后的大图景 -- Claude Code 创建者揭示的三层架构

## 摘要

拆解 Claude Code 创建者 Boris Cherny 分享的 15 条隐藏功能。文章将零散 tips 重新组织为三层金字塔：对话界面（手机/Chrome/语音） → 开发基础设施（Hooks/Worktree/多仓库） → 自主运行（/loop/schedule/batch/bare SDK）。每层用户数约是上一层的 10%，但 Boris 本人最高频使用的恰恰在第二三层。三个关键信号：/batch 支持上千个并行 Agent、Hooks 是操作系统级扩展点、Cowork Dispatch 让 Agent 走出 IDE 操作邮件和浏览器。

## 写作特点

- 结构化重组能力强：把 15 条散装 tips 按三层金字塔重新编排，比原帖更有洞察力
- 盲区分析到位：点出成本问题（/batch 千 Agent 的 token 开销）、质量控制、学习曲线断崖、安全边界四个未说之事
- 每张信息图对应一个核心论点（冰山/三阶段/batch/hooks/cowork/盲区），图文配合好

## 关联概念

- [[harness-engineering]] -- Boris 的使用方式就是 Harness Engineering 的活教材
- [[multi-agent]] -- /batch 和 Worktree 是多 Agent 并行的工程实现
- [[buddy-system]] -- 未在本文展开，但 Boris 的 tips 中隐含了 Buddy 系统的入口
- [[multi-model-strategy]] -- Codex 插件（/codex:review）是多模型策略的实战案例

## 关联选题

- [[pm-ai-exponential]] -- "意图编排取代写代码"与 Cat Wu 的"原型吃掉文档"同源
- [[managed-agents-architecture]] -- /batch 的并行 Agent 调度与 Managed Agents 的多 Agent 层对应
