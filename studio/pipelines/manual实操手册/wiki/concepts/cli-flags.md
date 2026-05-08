---
title: CLI Flags（命令行参数）
type: concept
sources: [../../context/claude-code-best-practice/best-practice/claude-cli-startup-flags.md]
created: 2026-04-10
updated: 2026-04-10
tags: [cli, flags, 配置层, 核心概念]
---

# CLI Flags（命令行参数）

## 一句话定义

CLI Flags 是启动 Claude Code 时的命令行参数——控制会话管理、模型选择、权限、输出格式等，属于单次会话覆盖。

## 大白话解释

就像启动一个程序时加开关。`claude --model opus` 就是这次用 Opus 模型，下次不带这个开关就回到默认。

## 核心分类

### 会话管理
| 参数 | 作用 |
|------|------|
| `--continue` / `-c` | 继续最近一次对话 |
| `--resume` / `-r` | 恢复指定会话（ID/名字/交互选择） |
| `--worktree` / `-w` | 在独立 git worktree 中启动 |
| `--remote` | 创建云端 web 会话 |
| `--teleport` | 把云端会话拉到本地终端 |

### 模型与配置
| 参数 | 作用 |
|------|------|
| `--model <NAME>` | 指定模型（别名或完整 ID） |
| `--agent <NAME>` | 使用特定 agent |
| `--agents <JSON>` | 动态定义 subagents |

### 权限与安全
| 参数 | 作用 |
|------|------|
| `--permission-mode <MODE>` | default/plan/acceptEdits/bypassPermissions |
| `--allowedTools <TOOLS>` | 免确认的工具列表 |
| `--dangerously-skip-permissions` | 跳过所有权限确认（危险） |

### 非交互模式（SDK/CI 用）
| 参数 | 作用 |
|------|------|
| `--print` / `-p` | 打印模式，不进入交互 |
| `--output-format` | text/json/stream-json |
| `--max-turns` | 限制执行轮数 |
| `--max-budget-usd` | 限制最大花费 |
| `--json-schema` | 强制输出匹配指定 JSON Schema |

### 系统提示词
| 参数 | 作用 |
|------|------|
| `--system-prompt` | 替换整个系统提示词 |
| `--append-system-prompt` | 追加到默认提示词 |

## 与其他概念的关系

- **[[Settings]]**：CLI Flags 是 Settings 的单次覆盖，优先级在 Managed 和 Local 之间
- **[[Subagents]]**：`--agent` 可以指定会话使用的 agent
- **[[MCP]]**：`--mcp-config` 可以临时加载额外的 MCP 配置

## 实操要点

1. **`-p` 模式用于 CI/CD 和脚本**——非交互，输出可解析
2. **`--worktree` 做隔离开发**——不影响主分支
3. **`--max-budget-usd` 控成本**——防止 agent 跑飞
4. **别用 `--dangerously-skip-permissions`**——除非你知道自己在干什么
