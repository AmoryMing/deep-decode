---
title: Memory（记忆系统）
type: concept
sources: [../../context/claude-code-best-practice/best-practice/claude-memory.md]
created: 2026-04-10
updated: 2026-04-10
tags: [memory, claude-md, 配置层, 核心概念]
---

# Memory（记忆系统）

## 一句话定义

Memory 是 Claude 的持久化上下文系统——通过 CLAUDE.md 文件和 auto memory，让 Claude 在不同会话间记住项目规则、用户偏好和工作约定。

## 大白话解释

每次你打开 Claude Code，它都是"失忆"的——不记得上次说了什么。CLAUDE.md 就是你提前写好的"备忘录"，Claude 启动时自动读取。这样它一开口就知道你的项目怎么运行、你喜欢什么风格、什么事不能做。

## 核心机制

### 记忆来源

| 来源 | 位置 | 何时加载 |
|------|------|---------|
| 全局 CLAUDE.md | `~/.claude/CLAUDE.md` | 每次启动 |
| 项目 CLAUDE.md | 项目根目录 `CLAUDE.md` | 启动时（祖先加载） |
| Rules 目录 | `.claude/rules/*.md` | 按 glob 匹配延迟加载 |
| Auto Memory | `~/.claude/projects/<project>/memory/` | 自动 |
| CLAUDE.local.md | 项目根目录 | 启动时（不提交 git） |

### 两种加载机制

**祖先加载（向上）**：启动时从当前目录向上遍历，加载路径上所有 CLAUDE.md。**立即加载**。

**后代加载（向下）**：子目录的 CLAUDE.md 只在 Claude 读写该目录文件时才加载。**延迟加载**。

### Monorepo 示例

```
/mymonorepo/
├── CLAUDE.md          ← 启动时加载（共享规则）
├── frontend/
│   └── CLAUDE.md      ← 碰到 frontend/ 文件才加载
├── backend/
│   └── CLAUDE.md      ← 碰到 backend/ 文件才加载
```

关键规则：
- **祖先总加载**：向上遍历找到的都加载
- **后代延迟加载**：不碰不加载
- **兄弟不加载**：在 frontend/ 工作时看不到 backend/ 的 CLAUDE.md

## 与其他概念的关系

- **[[Settings]]**：Settings 控制行为（权限、模型），Memory 传递知识（规则、约定）
- **[[Skills]]**：Skills 是按需注入的专业知识，Memory 是始终在场的基础知识
- **[[Subagents]] 的 memory 字段**：agent 可以有自己的持久记忆（user/project/local 范围）

## 实操要点

1. **每个 CLAUDE.md 控制在 200 行以内**——超了 Claude 会忽略后面的
2. **domain rule 用 `<important if="...">` 标签包裹**——防止被忽略
3. **共享规则放根目录，组件规则放子目录**
4. **个人偏好用 CLAUDE.local.md**——加到 .gitignore
5. **用 `.claude/rules/` 拆分大型指令**——按 glob 匹配只加载相关的
6. **"任何开发者都能启动 Claude，说 'run the tests' 就成功"**——这是检验 CLAUDE.md 质量的标准
7. **保持代码库干净**：未完成的迁移会让模型选错模式
