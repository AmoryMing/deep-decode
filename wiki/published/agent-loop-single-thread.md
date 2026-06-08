---
title: 单线程 Agent Loop——为什么 Claude Code 不用 Swarm
type: published
status: published
created: 2026-04-03
updated: 2026-04-25
tags: [agent-loop, swarm, single-thread, claude-code]
mode: source-code-decode
series: claudecode_deep_decode
---

# 单线程 Agent Loop

## 摘要

Series 第五篇（核心引擎）。论点：Claude Code 默认单线程，多 Agent 系统全部 feature-flagged 可选层。

钩子用代码片段 + 反差：「`while (true)` —— 51 万行代码的 AI 编程工具，心脏只有这四个单词。」第 14 种钩子方式：代码片段反差。

对照：2024-10 OpenAI 开源 Swarm，社区一片"多 Agent 是未来"。2026-03 Claude Code 源码摊开，三套多 Agent 系统都是 feature flag 后的可选层。**Anthropic 把多 Agent 当作特定场景的解决方案，而非通用范式**。

核心心跳在 `query.ts` 第 307 行的 while 循环。

## 写作特点

- **第 14 种钩子方式：代码片段反差**。`while(true)` 是入门级代码 ↔ 51 万行复杂工程，反差就立钩子
- **路线之争视角**：把 Claude Code 选择放进"多 Agent vs 单线程"的行业路线之争里
- **feature flag 当证据**：指出"是有多 Agent 系统的，但是默认关的"——这个细节比直接说"不用多 Agent"更有说服力

## 关联概念

- [[multi-agent]] —— 主概念（已存在）
- [[harness-engineering]] —— Loop 是 harness 核心
- [[sub-agent-coordinator]] —— wiki/topics 关联

## 复盘备注

- 钩子方式 #14：代码片段反差
- "默认 vs feature flag" 是工程意图的精确表达，比单纯"用了 X"更准
