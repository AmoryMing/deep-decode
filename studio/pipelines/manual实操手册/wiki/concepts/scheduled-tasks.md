---
title: Scheduled Tasks（定时任务）
type: concept
sources:
  - ../../context/claude-code-best-practice/implementation/claude-scheduled-tasks-implementation.md
created: 2026-04-10
updated: 2026-04-10
tags: [scheduled-tasks, loop, schedule, 工作流层, 核心概念]
---

# Scheduled Tasks（定时任务）

## 一句话定义

Scheduled Tasks 让 Claude 定时执行任务——`/loop` 在本地循环执行（最长 3 天），`/schedule` 在云端按 cron 调度（即使机器关了也能跑）。

## 大白话解释

`/loop` 就像你设了个闹钟，每隔 N 分钟提醒 Claude 做一件事。`/schedule` 像云端的定时任务，哪怕你关了电脑它也在跑。

## 核心机制

### /loop（本地循环）

```bash
/loop 1m "tell current time"     # 每 1 分钟报时
/loop 5m /simplify               # 每 5 分钟跑一次代码简化
/loop 10m "check deploy status"  # 每 10 分钟检查部署状态
```

特性：
- 最小粒度 **1 分钟**（cron 限制）
- **3 天自动过期**
- **会话级**——Claude 退出就停
- 底层用 CronCreate/CronList/CronDelete 工具
- 每次触发走 UserPromptSubmit → Stop 的完整 [[Hooks]] 流程

### /schedule（云端调度）

- 在 Anthropic 云基础设施上运行
- 即使本地机器关了也能执行
- 需要 claude.ai 订阅
- 用 `/web-setup` 连接 GitHub 账户

### 对比

| | /loop | /schedule |
|---|-------|----------|
| 运行位置 | 本地 | 云端 |
| 存活条件 | Claude 会话存在 | 独立于本地 |
| 最长时间 | 3 天 | 无限制 |
| 需要订阅 | 否 | 是 |

## 与其他概念的关系

- **[[Hooks]]**：每次 loop 触发都走完整的 hook 流程
- **[[Commands]]**：`/loop` 可以定时执行任何 `/命令`
- **[[Skills]]**：`/loop` 本身就是内置 skill

## 实操要点

1. **用 /loop 做本地自动化**：定时简化代码、检查状态、运行测试
2. **用 /schedule 做离线任务**：每日报告、定时清理
3. **取消用 `cron cancel <job-id>`**
