---
title: 多 Agent 架构
type: concept
created: 2026-04-13
updated: 2026-04-13
tags: [architecture, agent]
---

# 多 Agent 架构

Claude Code 不用 Swarm，用三种 Agent 原语解决不同问题：

| 类型 | 隔离度 | 上下文 | 适用场景 |
|---|---|---|---|
| **SubAgent** | 完全隔离 | 独立上下文 | 重大子任务 |
| **Fork** | 共享前缀 | 继承父上下文 + system prompt | 后台工作，缓存命中率最高 |
| **Teammate** | 异步通信 | 各自独立 | 跨进程协作（tmux/iTerm2） |

**Fork 最精妙**：字节级相同的 prompt 前缀 → 最大化 prompt cache 命中率。后台运行，输出不混入主对话。

三种运行后端：
- InProcess（AsyncLocalStorage 隔离）
- Tmux（终端多窗格）
- iTerm2（macOS 原生）

**Coordinator 模式**：规划者分发任务给执行者，共享 scratchpad。

## 相关概念

- [[harness-engineering]] -- 多 Agent 是 Harness 的协作层
- [[kairos]] -- 多 Agent 的终极形态
- [[ultraplan]] -- 用 Opus 4.6 做远程规划的 30 分钟会话

## 出处

5 个信源提及
