---
title: Subagents（子智能体）
type: concept
sources: [../../context/claude-code-best-practice/best-practice/claude-subagents.md]
created: 2026-04-10
updated: 2026-04-10
tags: [subagents, agents, 扩展层, 核心概念]
---

# Subagents（子智能体）

## 一句话定义

Subagent 是在独立上下文中运行的自治执行体——有自己的工具、权限、模型和记忆，完成任务后把结果返回给主对话。

## 大白话解释

把 Subagent 想成你派出去的一个"分身"。你告诉它"去调研一下 XX"，它就带着自己的记忆和工具去干活，干完把结论交回来。它看不到你的主对话历史，你也不会被它的中间过程打扰。

关键区别：Skills 是"给 Claude 一本手册"，Subagent 是"派一个人去干活"。

## 核心机制

### 定义方式
```
.claude/agents/<名字>.md
```
用 YAML frontmatter 定义配置，正文写角色描述和行为指令。

### Frontmatter 字段（16 个）

| 字段 | 作用 | 关键用法 |
|------|------|---------|
| `name` | 唯一标识符 | 小写+连字符 |
| `description` | 何时调用 | 写 "PROACTIVELY" 会被自动触发 |
| `tools` | 工具白名单 | 不填则继承全部工具 |
| `disallowedTools` | 工具黑名单 | 从继承列表中移除 |
| `model` | 运行模型 | sonnet/opus/haiku/inherit |
| `permissionMode` | 权限模式 | acceptEdits/auto/bypassPermissions/plan |
| `maxTurns` | 最大执行轮数 | 防止无限循环 |
| `skills` | 预加载技能 | 技能内容在启动时注入上下文 |
| `mcpServers` | MCP 服务器 | 可以给特定 agent 配专属工具 |
| `hooks` | 生命周期钩子 | PreToolUse/PostToolUse/Stop 最常用 |
| `memory` | 持久记忆范围 | user/project/local |
| `background` | 后台运行 | 不阻塞主对话 |
| `effort` | 努力程度 | 仅 Opus 4.6 支持 max |
| `isolation` | 设为 worktree | 在独立 git 分支工作 |
| `initialPrompt` | 初始提示 | 作为 --agent 启动时的第一条消息 |
| `color` | 显示颜色 | 视觉区分不同 agent |

### 官方内置 Agent（5 个）

| Agent | 模型 | 用途 |
|-------|------|------|
| `general-purpose` | inherit | 通用多步骤任务（默认） |
| `Explore` | haiku | 快速代码搜索（只读） |
| `Plan` | inherit | 规划模式下的预研（只读） |
| `statusline-setup` | sonnet | 配置状态栏 |
| `claude-code-guide` | haiku | 回答 Claude Code 使用问题 |

### 调用方式
```
Agent(subagent_type="agent-name", description="...", prompt="...", model="haiku")
```
**注意**：Subagent 不能通过 bash 命令调用其他 subagent，必须用 Agent 工具。

## 与其他概念的关系

- **预加载 [[Skills]]**：通过 `skills:` 字段给 agent 注入专业知识
- **vs [[Commands]]**：Boris 建议用 Commands 做工作流编排，Commands 调 Agent 做执行
- **[[Orchestration]] 模式**：Command → Agent → Skill 是推荐的编排路径
- **[[Agent-Teams]]**：多个 agent 通过 tmux + git worktree 并行工作

## Agent Memory（持久记忆）

v2.1.33 引入。通过 `memory:` frontmatter 给 agent 持久化记忆能力。

### 三个记忆范围

| 范围 | 存储位置 | 提交 git？ | 用途 |
|------|---------|-----------|------|
| `user` | `~/.claude/agent-memory/<agent>/` | 否 | 跨项目个人知识（推荐默认） |
| `project` | `.claude/agent-memory/<agent>/` | 是 | 团队共享的项目知识 |
| `local` | `.claude/agent-memory-local/<agent>/` | 否 | 项目级个人知识 |

### 工作方式

1. 启动时：MEMORY.md 前 200 行注入 agent 系统提示
2. 运行中：agent 可自由读写自己的记忆目录
3. 超 200 行：agent 自动分拆到 topic-specific 文件

### 与其他记忆系统的区别

| 系统 | 谁写 | 谁读 |
|------|------|------|
| CLAUDE.md | 你 | 主 Claude + 所有 agent |
| Auto-memory | 主 Claude | 仅主 Claude |
| Agent memory | agent 自己 | 仅该 agent |

**互补关系**：agent 同时读 CLAUDE.md（项目上下文）和自己的 memory（agent 专属知识）。

### 最佳实践

- 在 agent 指令中写明："开始前检查你的记忆，完成后更新记忆"
- 配合 `skills:` 使用：skills 提供静态知识，memory 积累动态经验

## 实操要点

1. **做专不做杂**：按功能域建 agent（如 code-reviewer、doc-writer），不建通用 agent
2. **用 test time compute**：独立上下文本身就能提升质量——一个 agent 写代码，另一个审查
3. **用 "use subagents" 甩计算量**：保持主上下文干净
4. **maxTurns 防失控**：给定上限避免 agent 无限循环
5. **description 写 PROACTIVELY**：让 Claude 自动判断何时需要派出 agent
