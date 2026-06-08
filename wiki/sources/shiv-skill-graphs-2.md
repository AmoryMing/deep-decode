---
title: Shiv Sakhuja — Skill Graphs 2.0
type: source
created: 2026-04-29
updated: 2026-04-29
tags: [claude-skills, skill-graph, agent-orchestration, leverage]
source: https://x.com/shivsakhuja/status/2047124337191444844
raw: raw/2026-04-29-skill-graphs-2/source.md
---

# Skill Graphs 2.0（Shiv Sakhuja，2026-04-29）

## 一句话核心

Skill graph 1.0 在依赖深度大于 2~3 层时会塌；解法是把 skill 切成三层 atoms / molecules / compounds（他们公司内部叫 capabilities / composites / playbooks），人在 compound 层驾驶。

## 决策链

1. **失败现象**：Obsidian 式深度依赖图，agent 在多层链路下不可靠（reddit / X 实测验证）。
2. **失败根因**：每层调用都是一次 LLM 决策，决策概率独立相乘 → 端到端可靠性指数衰减。原文未明说，但属于推论闭环。
3. **重构方向**：不是更聪明的图算法，而是分层 — 把 LLM 不擅长的"深度依赖判断"换成人脑擅长的"三层抽象"。
4. **杠杆论证**：5 个 compound 并行 = 500 个 atom 工作量，前提是每层 10× 可靠展开。
5. **作者承认的边界**：compound 上限 8-10 个 molecule；测试成本仍然非线性增长；autoresearch 是未验证假设。

## 金句

> Why are you sitting in the driver's seat when your car has full self-driving?

> Each level is an order of magnitude of leverage higher.

> The reliability / consistency of the skills at every level is non-trivial to get right and testing the skills takes a lot of time.

> Your brain's RAM is actually the limiting resource now.

## 可写角度（候选）

1. **概率衰减视角**：用数学解释为什么 1.0 必塌（90%^5 = 59%），引出三层切法的统计必然性。
2. **历史镜像**：函数→模块→服务、IC→经理→CTO、指令→子程序→进程，三层是人类抽象稳定上限。Shiv 的发现不是创造而是复用。
3. **本工厂自审**：把 `.claude/skills/` 现有 8 个 skill 重新归档（capabilities / composites / playbooks），暴露漏洞。
4. **公式有水分**：100x 是上限不是常态，当前 LLM 在 compound 层做不到稳定 10× 展开。

## 关联 wiki

- [[skill-graphs-2]]（topic）
- [[shiv-sakhuja]]（concept）
- [[claude-skills]]（concept）
- [[harness-engineering]]（已有 concept，可交叉引用）

## 与已有素材的关系

- 与 wiki/sources/playbook-archive-v1.md 互补：那篇讲单一 skill 内部 v1 的迭代，这篇讲多个 skill 的组合架构。
- 与 wiki/sources/harness-design-patterns.md 互补：harness 是单 agent 边界，这篇是 skill 层级。
