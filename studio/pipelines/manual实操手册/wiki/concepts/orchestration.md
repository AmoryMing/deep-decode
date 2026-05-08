---
title: Orchestration（编排模式）
type: concept
sources:
  - ../../context/claude-code-best-practice/implementation/claude-commands-implementation.md
  - ../../context/claude-code-best-practice/implementation/claude-subagents-implementation.md
  - ../../context/claude-code-best-practice/implementation/claude-skills-implementation.md
  - ../../context/claude-code-best-practice/orchestration-workflow/orchestration-workflow.md
created: 2026-04-10
updated: 2026-04-10
tags: [orchestration, 工作流层, 核心概念, 架构模式]
---

# Orchestration（编排模式）

## 一句话定义

Command → Agent → Skill 是 Claude Code 推荐的多步骤任务编排模式——Command 做入口和协调，Agent 做独立执行，Skill 提供专业知识。

## 大白话解释

想象一个餐厅：
- **Command**（前台经理）：接待客人、协调流程、决定做什么
- **Agent**（厨师）：独立工作、有自己的工具和食谱
- **Skill**（食谱本）：告诉厨师怎么做一道菜

客人说"来份牛排"→ 前台安排厨师 → 厨师翻食谱做菜 → 上菜。

## 核心机制

### 三层架构

```
Command（入口 + 编排）
  ├── Step 1: AskUserQuestion → 获取用户输入
  ├── Step 2: Agent(...) → 派 agent 执行任务
  │     └── agent 内部使用预加载的 Skill（agent skill）
  └── Step 3: Skill(...) → 直接调用 skill 生成产出
```

### 实际示例：天气工作流

| 组件 | 角色 | 文件 |
|------|------|------|
| `/weather-orchestrator` | Command：问用户要摄氏还是华氏，协调后续步骤 | `.claude/commands/weather-orchestrator.md` |
| `weather-agent` | Agent：用预加载的 weather-fetcher skill 调 API 获取温度 | `.claude/agents/weather-agent.md` |
| `weather-fetcher` | Agent Skill（预加载）：Open-Meteo API 调用指令 | `.claude/skills/weather-fetcher/SKILL.md` |
| `weather-svg-creator` | Skill（直接调用）：用温度数据生成 SVG 卡片 | `.claude/skills/weather-svg-creator/SKILL.md` |

### 两种 Skill 调用模式

| 模式 | 调用方式 | 用途 | 示例 |
|------|---------|------|------|
| **Skill**（直接调用） | `Skill(skill: "name")` | Command 或用户直接触发 | weather-svg-creator |
| **Agent Skill**（预加载） | agent frontmatter 的 `skills:` 字段 | 注入 agent 上下文作为背景知识 | weather-fetcher |

Agent Skill 通常设置 `user-invocable: false`，隐藏在 `/` 菜单中。

### 数据流

```
用户 → Command（收集输入）
         ↓ Agent tool
       Agent（执行任务，用预加载 Skill 的知识）
         ↓ 返回结果
       Command（拿到数据）
         ↓ Skill tool
       Skill（生成最终产出）
         ↓
       输出文件
```

## 与其他概念的关系

- **[[Commands]]**：编排的入口点，负责用户交互和流程协调
- **[[Subagents]]**：编排的执行层，独立上下文完成任务
- **[[Skills]]**：编排的知识层，可预加载也可直接调用
- **[[Agent-Teams]]**：并行版的编排——多个 agent 通过共享任务列表协作

## 实操要点

1. **Command 做编排，不做执行**——收集输入、派任务、汇总结果
2. **Agent 做执行，不做交互**——独立干活，返回结果
3. **Skill 做知识，不做决策**——提供"怎么做"的指令
4. **数据契约先定**：agent 返回什么格式的数据，skill 期望什么输入，提前约定好
5. **Agent 不能通过 bash 调 agent**——必须用 Agent tool
