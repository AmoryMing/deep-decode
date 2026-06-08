---
title: KAIROS（24/7 后台守护进程）
type: concept
created: 2026-04-13
updated: 2026-04-13
tags: [feature, future, proactive-agent]
---

# KAIROS

Claude Code 正在从"你问我答"进化为"24/7 后台运行"。KAIROS 是这个方向的代号。

## 工作模式

- 常驻后台，按间隔发送 `<tick>` 提示
- 15 秒阻塞预算（每个 tick 最多用 15 秒做主动操作）
- 追加式日志（append-only），不修改历史
- 空闲时通过 [[autodream]] 巩固记忆
- SleepTool 控制成本（prompt cache 5 分钟过期后休眠）

## 产品意义

KAIROS 代表 AI 产品的方向转变：
- **现在**：用户触发 → AI 响应（reactive）
- **未来**：AI 持续运行 → 发现问题 → 主动通知用户（proactive）

这不只是 Claude Code 的功能，是整个 AI 行业的产品形态演进信号。

**大白话**：现在 AI 是你的助手，KAIROS 让它变成你的值班员。

## 当前状态

Feature flag 门控（`tengu_kairos`），未对外发布。内部已有代码实现。

## 相关概念

- [[autodream]] -- KAIROS 空闲时的记忆巩固
- [[buddy-system]] -- KAIROS 的情感层
- [[ultraplan]] -- KAIROS 的规划层
- [[memory-system]] -- KAIROS 的持久化层

## 出处

6 个信源提及（最多被引用的概念之一）
