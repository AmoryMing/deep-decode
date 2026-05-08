---
title: 操作日志
type: overview
created: 2026-04-10
updated: 2026-04-10
---

# 操作日志

## [2026-04-10] init | 知识库初始化

- 创建三层目录结构：context（已有106个md）/ wiki / deliverable
- 编写 CLAUDE.md Schema
- 创建 index.md、log.md、overview.md
- Raw Sources：claude-code-best-practice 仓库（shanraisshan），106 个 md 文件
- 主题域：Claude Code 实操最佳实践
- 下一步：开始逐批 ingest 源材料

## [2026-04-10] ingest-batch-1 | best-practice 目录（8 篇）

- 读取：claude-skills.md、claude-subagents.md、claude-commands.md、claude-mcp.md、claude-memory.md、claude-settings.md、claude-cli-startup-flags.md、claude-power-ups.md
- 产出 8 个 concept 页：skills、subagents、commands、mcp、memory、settings、cli-flags、power-ups
- 每个 concept 页包含：一句话定义、大白话解释、核心机制、与其他概念的关系、实操要点
- 建立了概念间的双链网络（[[Skills]] ↔ [[Subagents]] ↔ [[Commands]] ↔ [[Hooks]] 等）
- 更新 index.md
- 下一步：第 2 批 ingest — implementation 目录（5 篇）

## [2026-04-10] ingest-batch-2 | implementation 目录（5 篇）

- 读取：claude-skills-implementation.md、claude-subagents-implementation.md、claude-commands-implementation.md、claude-agent-teams-implementation.md、claude-scheduled-tasks-implementation.md
- 核心发现：Command → Agent → Skill 是贯穿所有实现的编排模式
- 新建 3 个 concept 页：orchestration（编排模式）、agent-teams（多智能体团队）、scheduled-tasks（定时任务）
- orchestration 页合成了 3 篇实现文档 + orchestration-workflow 目录
- 两种 Skill 模式：Skill（直接调用）vs Agent Skill（预加载到 agent 上下文）
- 更新 index.md
- 知识库现有 11 个 concept 页
- 下一步：第 3 批 ingest — reports 目录（9 篇）

## [2026-04-10] ingest-batch-3 | reports 目录（9 篇）

- 读取 9 篇深度报告：advanced-tool-use、agent-command-skill、agent-memory、agent-sdk-vs-cli、global-vs-project-settings、chrome-browser-mcp、skills-monorepo、usage-rate-limits、llm-degradation
- 新建 1 个 concept 页：hooks（钩子，16 种事件）
- 新建 1 个 guide 页：agent-vs-command-vs-skill 选择指南（极高价值，从 report 合成）
- 更新 concepts/subagents.md：补充 Agent Memory 持久记忆机制（3 种范围、工作方式、与其他记忆系统对比）
- 更新 concepts/skills.md：补充 Monorepo Skills 发现机制（与 CLAUDE.md 加载的区别）
- 关键洞察：frozen weights ≠ frozen behavior（LLM 推理栈有 9 层可变因素）
- 关键洞察：Global vs Project 的设计原则——个人状态放全局，团队配置放项目
- 知识库现有 12 个 concept 页 + 1 个 guide 页
- 下一步：第 4 批 ingest — tips 目录（7 篇）
