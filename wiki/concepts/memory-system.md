---
title: 记忆系统（不记代码，只记人）
type: concept
created: 2026-04-13
updated: 2026-04-13
tags: [architecture, memory, philosophy]
---

# 记忆系统

Claude Code 的记忆系统有一个反直觉的设计哲学：**不记代码，只记人**。

不持久化代码片段或实现细节，只存：用户偏好、行为模式、项目上下文、外部引用。代码每次实时读取，代码模式会过时所以不记。

**大白话**：AI 记住"你喜欢简洁风格"，不记住"你上次写了个 for 循环"。

## 7 层记忆架构

| 层 | 功能 | 成本 |
|---|---|---|
| 1 | 工具结果存储（预览在上下文，全文在磁盘） | 零 |
| 2 | Micro-compact（轻量压缩） | 零 |
| 3 | Session memory（结构保留压缩） | 零 |
| 4 | Full compress（LLM 生成摘要） | 高 |
| 5 | Auto-memory（fork 子 Agent 提取 4 类记忆） | 中 |
| 6 | [[autodream]]（空闲时 4 阶段记忆巩固） | 低 |
| 7 | 跨 Agent 通信（fork Agent 模式） | 中 |

4 类记忆：user（用户画像）、feedback（行为偏好）、project（项目上下文）、reference（外部引用）。

MEMORY.md 是索引文件（200 行限制），具体记忆存独立 .md 文件。

## 相关概念

- [[autodream]] -- 第 6 层：空闲时记忆巩固
- [[context-compression]] -- 第 1-4 层的压缩机制
- [[kairos]] -- 记忆系统的终极形态：24/7 后台守护

## 出处

5 个信源提及
