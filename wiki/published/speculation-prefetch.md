---
title: 推测执行——当 AI 编程助手学会了 CPU 的老把戏
type: published
status: published
created: 2026-04-03
updated: 2026-04-25
tags: [speculation, prefetch, intent-pipeline, tengu]
mode: source-code-decode
series: claudecode_deep_decode
---

# Speculation 推测执行

## 摘要

Series 第六篇（性能黑科技）。论点：Claude Code 借用 1969 年 CPU 推测执行思路，预测用户下一步操作并预先在沙箱执行。

钩子用历史类比：「57 年后，Claude Code 的源码里出现了同样的逻辑。」第 16 种钩子方式：跨界历史类比开场。

泄露的 992 行 `speculation.ts` 揭示**意图流水线（Intent Pipeline）**：预测你要输什么 → 沙箱替你先做了 → 你按回车确认就用结果，改主意就全丢。

内部代号 **Tengu（天狗）**，仅限 Anthropic 内部员工使用，但所有基础设施已就位。

核心命题：**AI 工具的下一个竞争维度不是更聪明，而是更快——不是模型推理更快，而是让人感觉更快**。

## 写作特点

- **第 16 种钩子方式：跨界历史类比**。CPU 推测执行（1969）→ AI 推测执行（2026），57 年的时间锚 + 跨学科类比
- **原创命名 + 内部代号双锚**：意图流水线（Intent Pipeline）是作者命名，Tengu 是 Anthropic 内部代号——两层都给
- **预测维度切换**：CPU 预测的是机器指令跳转方向；AI 预测的是人类开发者下一步——同一逻辑不同对象，是这篇的核心比喻

## 关联概念

- [[intent-pipeline]] —— 意图流水线（待补独立 concept）
- wiki/topics/2026-04-03-speculation-prefetch.md（已存在）
- [[harness-engineering]] —— Speculation 是 harness 性能层

## 复盘备注

- 钩子方式 #16：跨界历史类比开场
- "感觉更快"vs"实际更快"的区分是产品体验设计的核心命题
