---
title: Harness > Model：51 万行代码揭示的 AI 产品真相
type: published
status: published
created: 2026-04-03
updated: 2026-04-25
tags: [harness, model, AI产品, claude-code]
mode: source-code-decode
series: claudecode_deep_decode
---

# Harness > Model

## 摘要

Series 第二篇（核心论点）。论点：同一个 Opus 模型，换 harness 效果天差地别。

钩子用数学题反问：「剩下的 50 万行在干什么？」一句承接全 series 第一篇 1902 文件 / 512K 行 → 直接立第二篇核心论点。

强证据来自 Sebastian Raschka（Lightning AI 研究工程师）：

> "I suspect that if we dropped one of the latest, most capable open-weight LLMs, such as GLM-5, into a similar harness, it could likely perform on par with GPT-5.4 in Codex or Claude Opus 4.6 in Claude Code."

Coding harness 六大核心组件：repo context / prompt shaping + cache / structured tools / context reduction / transcripts + memory / subagent delegation。

## 写作特点

- **第 12 种钩子方式：数学题反问 + series 串联**。承接上一篇的 1902 文件数字，留一道减法（50 万行 - 模型 = 什么？）
- **借权威 ML 老兵建立 credibility**：不是匿名"业内人士"，是 Lightning AI Sebastian Raschka 24 小时内写的具体文章 + 4 天后的系统分析
- **可验证的反事实**：Raschka 的"if we dropped GLM-5 into..."是 testable hypothesis，比纯立场陈述强

## 关联概念

- [[harness-engineering]] —— 主概念
- [[your-harness-your-memory]] —— 主权战的延伸
- [[multi-model-strategy]] —— 双模型经济学

## 关联选题

- [[claude-code-leak-panorama]] —— series 第 1 篇前置
- [[managed-agents-architecture]] —— harness 商业化

## 复盘备注

- 钩子方式 #12：数学题反问 + series 内承接
- 引权威老兵作为可验证假设的提出者，是企媒拆解的高级技法
