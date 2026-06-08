---
title: QueryEngine——13000 行代码的大脑中枢
type: published
status: published
created: 2026-04-03
updated: 2026-04-25
tags: [queryengine, claude-code, agent-loop]
mode: source-code-decode
series: claudecode_deep_decode
---

# QueryEngine

## 摘要

Series 第四篇（核心引擎之一）。论点：Claude Code 的"大脑"是 query.ts + QueryEngine.ts + processUserInput.ts 三个文件串起来的脊椎。

钩子用对比反问：「88 行和 13000 行之间，隔着什么？」第 15 种钩子方式：极端数字对比 + 设问。

对照：有人用 Rust 重写 Claude Code 核心循环到 88 行；真实 Claude Code 三文件合计 >13000 行。**差出来 12900 行不是冗余，是从"能跑"到"能用"的全部距离**。

三文件脊椎设计：把 Agent Loop 切成"接收/编排/执行"三段，每段一个文件。

## 写作特点

- **第 15 种钩子方式：极端数字对比 + 设问**。88 vs 13000 反差悬殊，留一道"差什么"的设问
- **类比生理结构**：用"脊椎"形容三文件串联，比"流水线"具体
- **驳斥简化主义**：「Agent Loop 是接收信号→处理→输出动作」的描述"正确而无用"——直接驳斥常见简化叙事

## 关联概念

- [[harness-engineering]] —— QueryEngine 是 harness 大脑
- [[context-compression]] —— Snip 在 QueryEngine 内
- wiki/topics/2026-04-03-queryengine-brain.md（已存在）

## 复盘备注

- 钩子方式 #15：极端数字对比 + 设问
- "正确而无用"是企媒驳斥简化叙事的高密度短语
