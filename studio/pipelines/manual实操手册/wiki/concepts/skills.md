---
title: Skills（技能）
type: concept
sources: [../../context/claude-code-best-practice/best-practice/claude-skills.md]
created: 2026-04-10
updated: 2026-04-10
tags: [skills, 扩展层, 核心概念]
---

# Skills（技能）

## 一句话定义

Skills 是注入到 Claude 上下文中的知识包——一个文件夹，里面放着 SKILL.md 和参考资料，告诉 Claude "遇到这类事该怎么做"。

## 大白话解释

把 Skill 想象成一本操作手册。你不需要每次都口头教 Claude 怎么做某件事，而是把步骤写在 SKILL.md 里，Claude 需要的时候自动翻出来看。用户可以通过 `/技能名` 手动触发，也可以让 Claude 根据描述自动判断何时使用。

## 核心机制

### 文件结构
```
.claude/skills/<技能名>/
├── SKILL.md          # 主文件（必须）
├── reference/        # 参考资料（可选）
├── examples/         # 示例（可选）
└── scripts/          # 脚本（可选）
```

子文件夹实现**渐进式信息披露**（progressive disclosure）：SKILL.md 先加载，子目录的内容按需读取，避免一次塞满上下文。

### Frontmatter 字段（13 个）

| 字段 | 作用 | 关键用法 |
|------|------|---------|
| `name` | 显示名 + `/slash` 命令名 | 不填则用目录名 |
| `description` | 触发条件描述 | **写给模型看的**，不是给人看的摘要 |
| `context` | 设为 `fork` 可隔离运行 | 主上下文只看到最终结果 |
| `agent` | fork 时用的 subagent 类型 | 配合 context: fork 使用 |
| `allowed-tools` | 激活时免确认的工具 | 减少交互打断 |
| `model` | 指定运行模型 | 简单任务用 haiku 省钱 |
| `effort` | 模型努力程度 | low/medium/high/max |
| `hooks` | 技能级别的 hooks | 只在这个技能激活时生效 |
| `paths` | 文件匹配 glob | 限定自动激活范围 |
| `user-invocable` | 设 false 隐藏菜单 | 用于 agent 预加载的背景知识 |
| `disable-model-invocation` | 禁止自动触发 | 只能手动 `/调用` |
| `argument-hint` | 自动补全提示 | 如 `[issue-number]` |
| `shell` | shell 类型 | bash（默认）或 powershell |

### 官方内置 Skill（5 个）

| 技能 | 功能 |
|------|------|
| `/simplify` | 审查代码质量，消除重复 |
| `/batch` | 批量对多文件执行命令 |
| `/debug` | 调试失败的命令或代码 |
| `/loop` | 定时循环执行（最长 3 天） |
| `/claude-api` | 用 Claude API / Anthropic SDK 构建应用 |

## 与其他概念的关系

- **vs [[Commands]]**：Commands 也注入上下文，但 Skills 更强——有文件夹结构、渐进披露、context fork、agent 预加载
- **vs [[Subagents]]**：Subagents 是独立执行体，Skills 是知识包。Subagents 可以预加载 Skills（通过 `skills:` 字段）
- **与 [[Hooks]] 配合**：Skills 可以定义自己的 hooks，只在技能激活时生效

## 实操要点

1. **description 是触发器**：写"什么时候该用"，不是"这个技能是什么"
2. **别写废话**：只写能让 Claude 偏离默认行为的内容
3. **别写死步骤**：给目标和约束，不是逐步指令
4. **建 Gotchas 章节**：记录 Claude 容易犯的错，随时间补充
5. **嵌入脚本和库**：让 Claude 组合而非重建样板代码
6. **`!`command``** 可在 SKILL.md 中嵌入动态 shell 输出，加载时自动执行

## Monorepo 中的 Skills 发现

**Skills 的发现机制和 CLAUDE.md 不同**——CLAUDE.md 向上遍历祖先目录，Skills 是从嵌套的 `.claude/skills/` 目录自动发现。

### 发现规则

| 位置 | 何时发现 |
|------|---------|
| 项目根 `.claude/skills/` | 启动时立即加载 |
| 子目录 `packages/frontend/.claude/skills/` | 编辑该子目录文件时才发现 |
| 全局 `~/.claude/skills/` | 始终可用 |
| Plugin 提供的 skills | plugin 启用时可用 |

### Monorepo 示例

```
/mymonorepo/
├── .claude/skills/shared-conventions/   ← 启动就加载
├── packages/
│   ├── frontend/.claude/skills/react-patterns/  ← 碰 frontend 文件才发现
│   └── backend/.claude/skills/api-design/       ← 碰 backend 文件才发现
```

和 [[Memory]] 的 CLAUDE.md 行为对比：CLAUDE.md 是祖先加载 + 后代延迟加载；Skills 是根目录 + 嵌套目录延迟发现。
