---
title: Hooks（钩子）
type: concept
sources:
  - ../../context/claude-code-best-practice/CLAUDE.md
  - ../../context/claude-code-best-practice/best-practice/claude-settings.md
created: 2026-04-10
updated: 2026-04-10
tags: [hooks, 扩展层, 核心概念]
---

# Hooks（钩子）

## 一句话定义

Hooks 是事件驱动的外部脚本——在 Claude 执行特定操作（如调用工具、提交代码、结束会话）的前后自动触发，运行在 agentic 循环之外。

## 大白话解释

就像"监控摄像头"。你在 Claude 的各个关键动作点安装 hook，它做某件事之前/之后自动执行你的脚本。比如每次 git commit 前播放提示音，每次编辑文件后自动格式化代码。

和 Skill 的区别：Skill 是 Claude 主动看的操作手册；Hook 是外部强制执行的自动化脚本，Claude 控制不了。

## 核心机制

### 支持的事件（16 种）

| 事件 | 触发时机 |
|------|---------|
| `PreToolUse` | 工具调用前（可拦截） |
| `PostToolUse` | 工具调用后 |
| `UserPromptSubmit` | 用户提交消息时 |
| `Notification` | 通知事件 |
| `Stop` | 会话结束时 |
| `SubagentStart` | 子 agent 启动时 |
| `SubagentStop` | 子 agent 结束时 |
| `PreCompact` | 上下文压缩前 |
| `SessionStart` | 会话开始时 |
| `SessionEnd` | 会话结束时 |
| `Setup` | 初始化时 |
| `PermissionRequest` | 权限请求时 |
| `TeammateIdle` | Agent Team 成员空闲时 |
| `TaskCompleted` | 任务完成时 |
| `ConfigChange` | 配置变更时 |

### 配置位置

在 `.claude/settings.json` 的 `hooks` 字段中定义。

### 拦截机制

- 脚本 `exit 0` = 放行
- 脚本 `exit 2` = 拦截（阻止操作并把输出注入对话）
- 其他退出码 = 报错但不拦截

### 作用域

| 范围 | 生效场景 |
|------|---------|
| settings.json 中的全局 hooks | 所有操作 |
| [[Skills]] 的 `hooks:` 字段 | 只在该 skill 激活时 |
| [[Subagents]] 的 `hooks:` 字段 | 只在该 agent 运行时 |

## 与其他概念的关系

- **[[Settings]]**：Hooks 配置在 settings.json 中
- **[[Skills]]**：Skills 可以定义自己的 hooks（on-demand hooks），如 /careful 拦截危险命令
- **[[Subagents]]**：Agents 可以有自己的 hooks
- **[[Scheduled-Tasks]]**：/loop 每次触发走完整 hook 流程

## 实操要点（来自 Tips）

1. **PostToolUse hook 做自动格式化**：Claude 生成 90% 好的代码，hook 处理剩下 10%
2. **PreToolUse hook 做安全拦截**：如 /careful 拦截 rm -rf、DROP TABLE
3. **在 Skill 中定义 on-demand hooks**：/freeze 限制编辑范围
4. **用 hook 测量 skill 使用率**：PreToolUse hook 记录哪些 skill 被触发
5. **git commit 可以触发专属音效**：PreToolUse 检测到 git commit 操作时播放音频
