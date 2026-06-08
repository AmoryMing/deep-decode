---
title: 双模型经济学（Opus + Haiku）
type: concept
created: 2026-04-13
updated: 2026-04-13
tags: [architecture, economics, optimization]
---

# 双模型经济学

Claude Code 不只用一个模型。重活用 Opus（贵），杂活用 Haiku（便宜）。

| 模型 | 用途 | 成本 |
|---|---|---|
| Opus | 核心推理、代码生成、复杂判断 | $15/$75 per M |
| Haiku | 元数据提取、网页摘要、Bash 分类 | $0.25/$1.25 per M |

**Fork 模式的经济性**：子 Agent 继承父 Agent 的 prompt 前缀，字节级相同 → prompt cache 命中 → 实际成本远低于两次独立调用。

## 产品启示

不是所有 AI 任务都需要最强模型。分级调度是成本控制的核心手段。

## 相关概念

- [[harness-engineering]] -- 模型调度是 Harness 的经济层
- [[context-compression]] -- 压缩减少 token 消耗
- [[multi-agent]] -- Fork 模式最大化缓存复用

## 出处

6 个信源提及
