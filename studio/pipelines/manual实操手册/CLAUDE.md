# Claude Code 实操手册 — LLM Wiki Schema

本文件定义知识库的结构、约定和工作流。AI 必须严格遵守。

## 架构

三层结构：

```
manual实操手册/
├── context/                    # 第一层：Raw Sources（不可修改）
│   └── claude-code-best-practice/  # 106 个 md 文件
├── wiki/                       # 第二层：Wiki（AI 维护）
│   ├── index.md                # 内容索引（按分类）
│   ├── log.md                  # 操作日志（按时间）
│   ├── overview.md             # 全局综述
│   ├── concepts/               # 概念页（Claude Code 核心概念）
│   ├── entities/               # 实体页（人物、项目、工具）
│   ├── guides/                 # 实操指南（合成页，面向读者）
│   └── sources/                # 源材料摘要页（每篇 raw 一个）
├── deliverable/                # 产出物（从 wiki 派生的文章、PPT 等）
└── CLAUDE.md                   # 第三层：本文件（Schema）
```

## 规则

### Raw Sources
- `context/` 下的文件是不可变的原始材料，AI 只读不写
- 这是 source of truth，wiki 中的所有声明必须可追溯到 raw source

### Wiki 页面格式
每个 wiki 页面必须包含 YAML frontmatter：

```yaml
---
title: 页面标题
type: concept | entity | guide | source | overview
sources: [相对路径列表，指向 context/ 下的原始文件]
created: YYYY-MM-DD
updated: YYYY-MM-DD
tags: [标签列表]
---
```

### 链接约定
- wiki 内部用 `[[页面名]]` Obsidian 双链格式
- 引用 raw source 用相对路径 `../context/claude-code-best-practice/...`
- 每个概念首次出现时必须链接到对应的 concept 页

### 页面类型

**concept**：Claude Code 的一个核心概念（如 Skills、Hooks、Subagents）
- 必须包含：定义、工作原理、关键配置、与其他概念的关系、实操要点
- 面向：不了解 Claude Code 的产品人

**entity**：人物（如 Boris Cherny）、项目（如 Superpowers）、工具
- 必须包含：是谁/是什么、与 Claude Code 的关系、关键贡献/特点

**guide**：面向实操的合成页（如"如何设计一个 Skill"）
- 必须包含：目标、步骤、示例、常见坑、参考链接
- 从多个 source 合成，不是单篇摘要

**source**：单篇原始材料的摘要页
- 必须包含：来源信息、核心观点（3-5 条）、与 wiki 中其他页面的关联
- 文件名：`s-<原始文件名>.md`

## 操作流程

### Ingest（摄入新源材料）
1. 读原始文件全文
2. 提取核心信息和关键观点
3. 创建/更新 source 摘要页
4. 创建/更新相关的 concept、entity、guide 页
5. 更新 index.md（添加新页面条目）
6. 追加 log.md（记录本次操作）

单次 ingest 可能触及 5-15 个 wiki 页面。

### Query（查询）
1. 读 index.md 定位相关页面
2. 读取相关 wiki 页面
3. 合成回答（附引用）
4. 有价值的回答可存为新 guide 页

### Lint（健康检查）
定期检查：
- 概念页之间是否有矛盾
- 是否有孤立页面（无入链）
- 是否有被提及但没有独立页面的概念
- 是否有缺失的交叉引用

## 分类体系

### 概念分类（concepts/）
按 Claude Code 功能域分：
- **配置层**：Settings、Memory/CLAUDE.md、CLI Flags
- **扩展层**：Skills、Commands、Subagents、Hooks、MCP、Plugins
- **工作流层**：Orchestration、Agent Teams、Git Worktrees、Scheduled Tasks
- **新特性**：Power-ups、Auto Mode、Channels、Computer Use、Voice

### 实体分类（entities/）
- **人物**：Boris Cherny、Thariq、Dex 等
- **项目**：Superpowers、gstack、oh-my-claudecode、Spec Kit 等
- **工具**：Obsidian、Marp、Dataview 等

### 指南分类（guides/）
按实操场景分：
- 入门配置、Skill 开发、Agent 编排、工作流设计、调试技巧等
