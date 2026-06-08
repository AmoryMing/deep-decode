---
title: DeepSeek V4 + Reasonix 99.82% 缓存命中
type: source
created: 2026-05-27
updated: 2026-05-27
tags: [deepseek, cache, harness, cost-engineering, agent-tooling]
---

# 量子位 / Reasonix 信源摘要

## 元信息
- 主源：量子位 2026-05-25 鱼羊《DeepSeek V4 还能更省》https://www.qbitai.com/2026/05/424552.html
- 项目：https://github.com/esengine/DeepSeek-Reasonix
- 背景：DeepSeek V4 2026-04-27 永久降价 + cache hit 折上折

## 主要论点

1. 一个**只为 DeepSeek 一家模型打造**的开源 coding harness（Reasonix），把缓存命中率从 DeepSeek 自家 91-96% 推到 **99.82%**，单日 4.35 亿 token 账单从 61 美元降到 12 美元。
2. 不通用，不抽象——三层抽象都绑死 DeepSeek 的 prefix cache、tool calling、模型梯度特性。
3. 设计哲学的反面：Claude Code / Cursor / aider 都追求"模型无关"，Reasonix 反过来追求"模型专用"。
4. 关键技术：append-only 运行循环 + 字节稳定前缀 + 工具调用修复 + V4 Flash/Pro 自动切换。

## 关键金句

- "Reasonix 只为 DeepSeek 打造，每一个抽象层级都基于 DeepSeek 的 feature 构建，完全不通用，也不会发布通用功能。"——esengine
- "435M input tokens, 99.82% cache hit, ~$12 instead of ~$61"（README 原文）

## 角度（可以怎么写）

1. **反通用化叙事**：垂直绑定单一模型，反而比通用框架便宜 5 倍。
2. **价格发现机制**：模型降价 + 缓存折上折 + harness 优化三重叠加，AI 编程成本第一次进入"白菜区间"。
3. **harness 才是真正的价值层**：模型趋同 → 价值往上层 harness 跑（参考 Claude Code 的工具调用框架）。
4. **国产模型生态位**：DeepSeek 给了官方 cache API，社区拿出 99.82% 命中的 harness，国产 agent 工具链开始内卷。

## 相关 wiki 概念

- [[deepseek-v4]]
- [[harness-cache-tool]]
- [[prefix-cache]]
- [[claude-code]]
