---
title: Settings（配置系统）
type: concept
sources: [../../context/claude-code-best-practice/best-practice/claude-settings.md]
created: 2026-04-10
updated: 2026-04-10
tags: [settings, 配置层, 核心概念]
---

# Settings（配置系统）

## 一句话定义

Settings 是 Claude Code 的分层配置系统——60+ 个设置项和 170+ 个环境变量，通过 5 层优先级控制 Claude 的行为、权限和模型选择。

## 大白话解释

就像手机的"设置"——你可以调模型、设权限、配工具。特殊之处在于它有 5 层，企业管理员设的规则最大，你本地的设置最小，冲突时高层覆盖低层。

## 核心机制

### 5 层优先级（高→低）

| 层级 | 位置 | 谁管 | 能覆盖？ |
|------|------|------|---------|
| 1. Managed | managed-settings.json / MDM / Registry | IT/组织 | 不能被覆盖 |
| 2. CLI 参数 | `claude --model opus` | 用户（单次） | 被 Managed 覆盖 |
| 3. Local | `.claude/settings.local.json` | 个人（git-ignored） | 被上层覆盖 |
| 4. Team | `.claude/settings.json` | 团队（提交 git） | 被上层覆盖 |
| 5. Global | `~/.claude/settings.json` | 个人全局 | 最低优先级 |

**重要**：`deny` 规则具有最高安全优先级，不能被任何层的 allow/ask 覆盖。数组类设置（如 permissions.allow）**跨层合并**而非替换。

### 核心设置分类

| 类别 | 代表设置 | 作用 |
|------|---------|------|
| 模型 | `model`、`availableModels`、`alwaysThinkingEnabled` | 选择和限制可用模型 |
| 权限 | `permissions.allow/deny/ask` | 控制工具的自动执行权限 |
| Hooks | `hooks.PreToolUse` 等 | 事件驱动的外部脚本 |
| MCP | `enableAllProjectMcpServers` | MCP 服务器审批 |
| 归属 | `attribution.commit/pr` | 自定义 commit/PR 归属信息 |
| Worktree | `worktree.symlinkDirectories/sparsePaths` | 优化大仓库的 worktree |
| Agent | `agent` | 设置默认 agent |
| 显示 | `theme`、`language`、`voiceEnabled` | 界面和语言 |

### 关键经验

**用 settings.json 而不是 CLAUDE.md 做强制行为**：比如不要在 CLAUDE.md 写 "NEVER add Co-Authored-By"，用 `attribution.commit: ""` 是确定性的。CLAUDE.md 的指令可能被忽略，settings.json 是硬性的。

## 与其他概念的关系

- **[[Memory]]**：Memory 传递"知识"，Settings 控制"行为"
- **[[Hooks]]**：定义在 settings.json 中
- **[[MCP]]**：MCP 服务器审批由 settings 控制
- **[[CLI-Flags]]**：CLI 参数是 settings 的单次覆盖

## 实操要点

1. **确定性行为用 settings**，建议性行为用 CLAUDE.md
2. **deny 规则不可覆盖**——用于安全关键限制
3. **env 字段可以设环境变量**——避免写 wrapper 脚本
4. **settings.local.json 放个人偏好**——不影响团队
