---
title: Harness（编码 agent 外壳）
type: concept
created: 2026-05-27
updated: 2026-05-27
tags: [agent, harness, tooling, prompt-engineering]
---

# Harness（编码 agent 外壳）

## 定义

Harness 是 LLM 模型外面那一层。它不训练模型，不改模型权重，只决定**怎么和模型对话**——包括：

- 上下文怎么组织（system prompt / tool schema / history）
- 工具怎么暴露（function calling 的 JSON schema）
- 回路怎么跑（一轮还是多轮 / 失败怎么重试 / 上下文压缩）
- 成本怎么控制（缓存命中策略 / 模型切换）

代表产品：Claude Code、Cursor、aider、Cline、Continue、Reasonix。

## 为什么 harness 现在变重要

2025 年下半年开始，主流模型（Claude 4.5+、GPT-5、DeepSeek V4、Qwen 3.7 Max）能力开始**收敛**——基础 codegen 水平拉不开本质差距。

差距开始在 harness 层显现：
- 同一个 Claude 4.5，套 Claude Code 和套裸 API，工程产出差 3-5 倍
- 同一个 DeepSeek V4，套 Reasonix（99.82% 命中）和套通用 IDE 插件（30-60% 命中），单月账单差 5 倍

## 设计哲学的两条路

| 路线 | 代表 | 主张 | 取舍 |
|---|---|---|---|
| 模型无关 | Claude Code / Cursor / aider | 一套 harness 适配 N 家模型 | 抽象层多，每个模型都吃不到极致 |
| 模型专用 | Reasonix | 一个 harness 只绑一家 | 抽象层少，把单一模型的特性榨到极致 |

Reasonix 是第一个公开宣布"我就是绑定 DeepSeek"的 harness。

## 相关
- [[prefix-cache]]
- [[deepseek-v4]]
- [[claude-code]]
