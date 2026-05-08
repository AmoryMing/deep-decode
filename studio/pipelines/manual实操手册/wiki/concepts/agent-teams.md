---
title: Agent Teams（多智能体团队）
type: concept
sources:
  - ../../context/claude-code-best-practice/implementation/claude-agent-teams-implementation.md
created: 2026-04-10
updated: 2026-04-10
tags: [agent-teams, 工作流层, 核心概念]
---

# Agent Teams（多智能体团队）

## 一句话定义

Agent Teams 是多个独立 Claude Code 会话通过共享任务列表并行协作——每个 teammate 有自己的完整上下文窗口，各自独立工作，通过任务列表同步进度。

## 大白话解释

Subagent 是"你的分身"——从你的会话里分出去干活。Agent Team 是"一个团队"——每个成员都是独立的 Claude 实例，有自己的 CLAUDE.md、MCP、Skills，通过一个共享看板协作。

类比：Subagent 像你自己开了个新标签页；Agent Team 像你拉了 3 个同事一起干活。

## 核心机制

### 与 Subagent 的关键区别

| | Subagent | Agent Team |
|---|---------|------------|
| 上下文 | 从主会话 fork 的子上下文 | 各自完整的独立上下文 |
| CLAUDE.md | 不加载 | 自动加载 |
| MCP/Skills | 需在 frontmatter 指定 | 自动加载项目配置 |
| 协作方式 | 返回结果给主会话 | 共享任务列表 |
| 运行方式 | 主会话进程内 | tmux 独立窗格 |

### 启动方式

```bash
# 1. 安装 tmux
brew install tmux  # macOS
sudo apt install tmux  # Linux

# 2. 启动 tmux 会话
tmux new -s dev

# 3. 启用实验特性并启动 Claude
CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1 claude
```

### 团队协作流程

```
Lead（你）
  ├── 提示："用 agent team 构建 X"
  │
  ├── spawns ──→ Teammate A（Command 架构师）
  ├── spawns ──→ Teammate B（Agent 工程师）
  └── spawns ──→ Teammate C（Skill 设计师）
                    │
                    ▼
              共享任务列表
              ☐ 约定数据契约
              ☐ 各自实现组件
              ☐ 集成测试
```

### 实际示例

仓库中的 time orchestrator 工作流完全由 Agent Team 构建——3 个 teammate 并行工作，分别负责 Command、Agent、Skill 三个组件，通过共享任务列表同步数据契约。

## 与其他概念的关系

- **[[Subagents]]**：单会话内的子任务派发。Agent Teams 是多会话的并行协作
- **[[Orchestration]]**：Agent Teams 可以并行构建 Command → Agent → Skill 流水线的各个组件
- **Git Worktrees**：配合 `--worktree` 使用，每个 teammate 在独立分支工作，避免冲突

## 实操要点

1. **需要 tmux**——Agent Teams 通过 tmux 窗格管理多个 Claude 实例
2. **提前约定数据契约**——团队成员并行开发，接口格式必须提前对齐
3. **当前仍是实验特性**——需设置 `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1`
4. **配合 git worktree 做并行开发**——各 teammate 在独立分支，最后合并
