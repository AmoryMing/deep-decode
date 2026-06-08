---
title: Harness Engineering（脚手架工程）
type: concept
created: 2026-04-13
updated: 2026-04-13
tags: [core-philosophy, architecture, moat]
domains: [ai-infra, methodology]
---

# Harness Engineering

Claude Code 的竞争优势不是 Claude 模型本身，而是围绕模型的 50 万行基础设施——工具系统、权限架构、记忆管理、上下文压缩、多 Agent 编排。

Sebastian Raschka 将其概括为 **"Harness > Model"**：模型贡献约 60% 的产品质量，Harness 贡献约 40%。但 40% 的 Harness 是可工程化、可积累的，而模型能力在竞品间趋同。

**大白话**：模型是发动机，Harness 是整台车。发动机大家差不多，车的操控、安全带、仪表盘决定了谁卖得好。

## 核心证据

- System Prompt 只有 20 个词，复杂度全在执行层
- 代码搜索用 grep 而不是向量检索——刻意选择可靠性而非花哨
- Anthropic 自己是 Claude Code 最重度的用户（dogfooding）

## 相关概念

- [[permission-pipeline]] -- Harness 的安全层
- [[context-compression]] -- Harness 的记忆层
- [[memory-system]] -- Harness 的持久化层
- [[multi-agent]] -- Harness 的协作层

## 出处

6 个信源提及（源码泄露全面剖析、价值亿元公开课、中国AI公司如何学、架构全解密、产品野心、源码深度解读）
