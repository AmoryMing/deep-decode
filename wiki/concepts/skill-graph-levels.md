---
title: Skill Graph Levels — atoms / molecules / compounds
type: concept
created: 2026-04-29
updated: 2026-04-29
tags: [claude-skills, agent-orchestration]
domains: [dev-ux, methodology]
---

# Skill Graph Levels

## 定义

Shiv Sakhuja 提出的 skill 三层抽象，用于替代深度依赖图（skill graph 1.0）。

| 层级 | 别名 | 工程类比 | 组织类比 | 操作语义 |
|---|---|---|---|---|
| atoms | capabilities | 函数 | IC | 单一动作，几乎确定 |
| molecules | composites | 模块 | 经理 | 2-10 个 atom 的显式编排 |
| compounds | playbooks | 服务 | CTO | 多个 molecule 的判断驱动编排 |

## 核心论断

1. 深度 > 3 的 skill 链不可靠（每层 LLM 决策独立相乘）。
2. 人不应在 atom 层驾驶，应在 compound 层。脑 RAM 是稀缺资源。
3. compound 上限 ≈ 8-10 个 molecule。

## 与本工厂的对应

- atoms：`send_email.py`、`md2xhs.py`、tavily 搜索、读源码、单图渲染。
- molecules（已有）：`distribute`、`polish-pipeline`、`visual-pipeline`、`podcast-pipeline`。
- compounds（已有）：`deep-decode`（吃→写→评的全流程）。

## 边界 / 待解

- compound 之上的层未命名。
- 多 compound 共享同一 capability 池时的冲突未讨论。
- 测试成本随层级非线性上升，作者寄望 autoresearch 但未验证。

## 关联

- [[harness-engineering]]
- [[../sources/shiv-skill-graphs-2]]
- [[../topics/2026-04-29-skill-graphs-2]]
