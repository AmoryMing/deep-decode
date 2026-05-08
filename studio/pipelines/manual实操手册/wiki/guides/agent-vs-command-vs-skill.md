---
title: 选择指南：Agent vs Command vs Skill
type: guide
sources:
  - ../../context/claude-code-best-practice/reports/claude-agent-command-skill.md
created: 2026-04-10
updated: 2026-04-10
tags: [guide, 选择指南, agent, command, skill]
---

# Agent vs Command vs Skill — 什么时候用哪个

## 一张表看懂

| | Agent（子智能体） | Command（命令） | Skill（技能） |
|---|---|---|---|
| **文件位置** | `.claude/agents/<名>.md` | `.claude/commands/<名>.md` | `.claude/skills/<名>/SKILL.md` |
| **运行上下文** | 独立新上下文 | 主对话内 | 主对话内（除非 `context: fork`） |
| **用户可通过 `/` 触发** | 不行 | 可以 | 可以 |
| **Claude 自动触发** | 可以（通过 description） | 不行 | 可以（通过 description） |
| **有自己的工具限制** | `tools:` / `disallowedTools:` | `allowed-tools:` | `allowed-tools:` |
| **有自己的记忆** | `memory:` 字段 | 无 | 无 |
| **可预加载 Skills** | `skills:` 字段 | 无 | 无 |
| **可配 MCP Server** | `mcpServers:` 字段 | 无 | 无 |
| **支持 Hooks** | `hooks:` 字段 | 无 | `hooks:` 字段 |
| **动态 shell 注入** | 无 | `` !`cmd` `` | `` !`cmd` `` |

## 三句话决策

1. **需要独立干活、不污染主对话？** → Agent
2. **需要用户手动触发一个工作流？** → Command
3. **需要 Claude 自动识别场景并应用？** → Skill

## 详细选择标准

### 用 Agent 当：
- 任务是**多步骤自治**的——agent 要自己探索、决策、执行
- 需要**上下文隔离**——工作不应污染主对话
- agent 需要**跨会话记忆**（`memory:` 字段）
- 需要**预加载专业知识**（`skills:` 字段）
- 需要**后台运行**或在 **git worktree** 中隔离工作
- 需要**不同权限模式**（如 acceptEdits、plan）

### 用 Command 当：
- 需要用户**主动触发**的入口点
- 工作流需要**编排其他 agent 和 skill**
- 希望**不触发就不占上下文**

### 用 Skill 当：
- 希望 Claude **自动根据意图触发**
- 是**可复用的流程**，多个地方都可能调用
- 需要**预加载到特定 agent** 作为背景知识

## 推荐编排模式

```
Command（入口 + 编排）
  → Agent（独立执行，预加载 agent skill）
  → Skill（生成产出）
```

**Command 做编排，Agent 做执行，Skill 做知识。**

Boris Cherny 的建议：**用 Commands 做工作流，不是 Agents。** Command 负责流程编排，Agent 负责具体任务执行。

## 常见错误

| 错误 | 正确做法 |
|------|---------|
| 用 Agent 做简单的知识注入 | 用 Skill |
| 用 Skill 做需要隔离的复杂任务 | 用 Agent |
| 用 Agent 做需要用户交互的流程 | 用 Command 编排，Command 调 Agent |
| 建通用的 "qa-agent"、"backend-agent" | 建功能专精的 agent，预加载对应 Skill |
