---
title: 分叉领先（Forked Leadership）
type: concept
created: 2026-04-25
updated: 2026-04-25
tags: [methodology, ai-models, benchmark]
domains: [ai-product]
---

# 分叉领先

前沿模型在不同任务类别上的能力分布呈**分叉**而非总体领先：一家在 A 类任务上领先，另一家在 B 类任务上领先，双方在各自选定的赛道上刷新 SOTA。

## 当期实例（2026-04）

| Benchmark 类别 | GPT-5.5 优 | Opus 4.7 优 |
|---|---|---|
| Agent 型任务（Terminal、OSWorld、长上下文 MRCR、长程数学） | ✓ |  |
| 代码工程任务（SWE-bench Pro、CursorBench、GPQA Diamond） |  | ✓ |

最具数量级差距的一项：**MRCR v2 长上下文 74.0% vs 32.2%**（绝对差 41.8 个百分点）——意味着"将中等规模代码仓库整体放入 prompt"在 GPT-5.5 边界内进入可行区间。

## 框架由来

来自 Ethan Mollick 的 **jagged frontier**（锯齿形前沿）观察："the jagged frontier continues to hold"——前沿模型能力在不同任务上的表现差异较大，难以从单一指标推断整体水平。

[[forked-leadership]] 是 jagged-frontier 在"两家 SOTA 厂商对比"场景下的具体投影。

## 推论：任务路由（Task Routing）

在多工具并存环境下，按任务类型选择对应工具。MindStudio 给的路由建议：

| 任务 | 推荐 | 理由 |
|---|---|---|
| 多文件 bug 修复 | Claude Code | SWE-bench Pro 优势 |
| DevOps 自动化 | Codex/GPT-5.5 | Terminal-Bench 主导 |
| 电脑操控 / UI 自动化 | Codex/GPT-5.5 | 原生多模态 |
| IDE 集成（Cursor） | Claude Code | CursorBench 70% |
| 并行任务执行 | Codex | 云沙箱天然优势 |

## 关联

- [[jagged-frontier]] —— 上位框架
- [[task-routing]] —— 推论模式
- [[gpt-5-5]] / [[claude-opus-4-7]] —— 当期实体
- [[20-dollar-tier]] —— 价格层差异化的具体战场

## 出处

[[codex-5-5-roundup]]
