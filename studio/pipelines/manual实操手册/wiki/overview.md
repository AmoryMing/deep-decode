---
title: Claude Code 实操手册 — 全局综述
type: overview
sources: [../context/claude-code-best-practice/README.md, ../context/claude-code-best-practice/CLAUDE.md]
created: 2026-04-10
updated: 2026-04-10
tags: [overview, claude-code]
---

# Claude Code 实操手册

## 这是什么

一份基于 claude-code-best-practice 开源仓库（shanraisshan）构建的结构化知识库，覆盖 Claude Code 从入门到高级编排的全部实操知识。

## 知识域全景

Claude Code 的能力可以分为三个层次：

### 配置层 — 让 Claude 知道"怎么做"
- **[[Settings]]**：分层配置系统（managed → CLI → local → team → global）
- **[[Memory]]**：CLAUDE.md + .claude/rules/ + auto memory，持久化上下文
- **[[CLI-Flags]]**：启动参数和环境变量

### 扩展层 — 给 Claude 加能力
- **[[Skills]]**：可发现、可配置的知识注入单元（文件夹结构，支持 context fork）
- **[[Commands]]**：用户可调用的 slash 命令（prompt 模板，注入主上下文）
- **[[Subagents]]**：独立上下文的自治执行体（自带工具、权限、模型、记忆）
- **[[Hooks]]**：事件驱动的外部脚本（PreToolUse、PostToolUse、Stop 等）
- **[[MCP]]**：Model Context Protocol，连接外部工具和数据
- **[[Plugins]]**：Skills + Agents + Hooks + MCP 的打包分发单元

### 工作流层 — 让多个能力协同
- **[[Orchestration]]**：Command → Agent → Skill 编排模式
- **[[Agent-Teams]]**：多 agent 并行协作（tmux + git worktree）
- **[[Scheduled-Tasks]]**：定时任务（/loop 本地、/schedule 云端）
- **[[Development-Workflows]]**：Research → Plan → Execute → Review → Ship

## 关键人物

- **Boris Cherny**：Claude Code 创始人，贡献了大量 tips 和视频访谈
- **Thariq**：Anthropic 工程师，Skills 系统设计者
- **Dex**（HumanLayer）：RPI 工作流和 CLAUDE.md 最佳实践
- **Lydia Hallie**：Skills 高级用法（context fork、动态 shell 注入）

## 关键开发工作流项目

| 项目 | 星数 | 特色 |
|------|------|------|
| Everything Claude Code | 148k | instinct scoring、AgentShield |
| Superpowers | 143k | TDD-first、Iron Laws |
| Spec Kit (GitHub) | 87k | spec-driven、constitution |
| gstack | 68k | role personas、/codex review |
| oh-my-claudecode | 27k | teams orchestration、tmux workers |

## 源材料分布

| 目录 | 文件数 | 内容 |
|------|-------|------|
| best-practice/ | 8 | 核心概念最佳实践指南 |
| implementation/ | 5 | 具体实现示例 |
| reports/ | 9 | 深度专题报告 |
| tips/ | 7 | Boris 等人的实操 tips 合集 |
| videos/ | 6 | 播客/访谈笔记 |
| development-workflows/ | ~10 | 开发工作流模板 |
| tutorial/ | 4 | Day 0 安装教程 |
| .claude/ | ~50 | agents/commands/skills/hooks 配置示例 |
| orchestration-workflow/ | 2 | Command→Agent→Skill 示例 |
