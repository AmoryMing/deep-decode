---
title: AutoDream（AI 做梦系统）
type: concept
created: 2026-04-13
updated: 2026-04-13
tags: [feature, memory, future]
---

# AutoDream

用户空闲时，Claude Code 会"做梦"——自动巩固记忆。

## 4 阶段

1. **Orient** -- 扫描最近会话，确定有什么新信息
2. **Gather** -- 收集相关记忆片段
3. **Consolidate** -- 合并、去重、建立关联
4. **Prune** -- 清理过时或低价值记忆

## 触发条件（三门控）

三个条件同时满足才触发：
- 距上次做梦 > 24 小时
- 新增 > 5 个会话
- 获得锁文件（防并发，含 PID + 时间戳崩溃恢复）

## 产品意义

传统 AI 每次对话从零开始。AutoDream 让 AI 在你不用的时候自我整理，下次对话"记性更好"。

**大白话**：人睡觉时大脑整理白天的记忆。AutoDream 就是 AI 的"睡眠整理"。

## 相关概念

- [[kairos]] -- AutoDream 是 KAIROS 的记忆子系统
- [[memory-system]] -- AutoDream 是 7 层记忆的第 6 层

## 出处

5 个信源提及
