---
title: Commands（命令）
type: concept
sources: [../../context/claude-code-best-practice/best-practice/claude-commands.md]
created: 2026-04-10
updated: 2026-04-10
tags: [commands, 扩展层, 核心概念]
---

# Commands（命令）

## 一句话定义

Commands 是用 `/` 触发的 prompt 模板——把一段写好的指令注入当前对话上下文，不创建新上下文。

## 大白话解释

想象一个快捷键：你每天要跟 Claude 说 10 遍同样的话，不如写成一个 `/命令`。输入 `/deploy` 就自动注入 "检查测试→构建→推送→创建 PR" 的完整指令。

关键区别：Commands 注入当前对话，不开新窗口；Subagents 开新窗口独立干活。

## 核心机制

### 文件位置
```
.claude/commands/<名字>.md
```
支持嵌套目录：`.claude/commands/workflow/deploy.md` → `/workflow/deploy`

### Frontmatter 字段（13 个）

和 Skills 几乎相同（name、description、argument-hint、context fork、allowed-tools、model、effort、hooks、paths 等）。

### 官方内置命令（68 个）

按功能分 9 类：

| 类别 | 代表命令 | 数量 |
|------|---------|------|
| Auth 认证 | `/login`、`/logout`、`/upgrade` | 4 |
| Config 配置 | `/config`、`/theme`、`/voice`、`/statusline` | 11 |
| Context 上下文 | `/context`、`/cost`、`/usage`、`/stats` | 7 |
| Debug 调试 | `/doctor`、`/help`、`/powerup`、`/tasks` | 5 |
| Export 导出 | `/copy`、`/export` | 2 |
| Extensions 扩展 | `/agents`、`/hooks`、`/mcp`、`/skills`、`/plugin` | 8 |
| Model 模型 | `/model`、`/effort`、`/fast`、`/plan`、`/ultraplan` | 6 |
| Project 项目 | `/diff`、`/init`、`/memory`、`/security-review` | 6 |
| Remote 远程 | `/remote-control`、`/teleport`、`/schedule`、`/autofix-pr` | 10 |
| Session 会话 | `/clear`、`/compact`、`/resume`、`/rewind` | 8 |

## 与其他概念的关系

- **vs [[Skills]]**：Commands 更轻量（单文件 vs 文件夹），但 Skills 支持渐进披露和 agent 预加载
- **Boris 的建议**："用 Commands 做工作流，不是 Subagents"——Commands 编排，Agents 执行
- **[[Orchestration]]**：Command 是编排的入口点
- **与 [[Hooks]] 的区别**：Commands 由用户触发，Hooks 由事件自动触发

## 实操要点

1. **一天做两次以上的事 → 写成命令**
2. **Commands 做编排，Agents 做执行**
3. **Commands 可以 context fork**：加 `context: fork` 就能像 subagent 一样隔离运行
4. **内置 bundled skills（如 /debug）也出现在 `/` 菜单中**，但它们不是 built-in commands
