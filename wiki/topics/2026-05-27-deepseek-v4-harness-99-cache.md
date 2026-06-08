---
title: DeepSeek V4 + Reasonix：把缓存命中率推到 99.82% 之后
type: topic
slug: 2026-05-27-deepseek-v4-harness-99-cache
created: 2026-05-27
updated: 2026-05-27
style: default
reader: default
voice: default-doubao
tags: [deepseek, harness, prefix-cache, agent-tooling]
status: in-progress
---

# 选题

## 主判断

模型趋同之后，差距迁移到了 harness 层。一个**只为 DeepSeek 一家打造**的开源 coding harness（Reasonix），把缓存命中率从 DeepSeek 自家服务的 91-96% 推到 99.82%，单日 4.35 亿 token 账单从 61 美元降到 12 美元。Reasonix 公开宣称"完全不通用"——这是对 Claude Code / Cursor 这类"模型无关"哲学的一次直接挑战。

## 反判断 / 盲区

- 99.82% 是单日单工作流的实测数字，不代表所有用例。
- DeepSeek API 不保证缓存命中率，best-effort，可能波动。
- 模型专用 harness 的迁移成本（换模型 = 重写 harness）vs 通用 harness 的低锁定，长期博弈未明。

## 角度

1. 反通用化叙事
2. 价格发现机制（降价 + 折上折 + harness 三叠加）
3. harness 层价值
4. 国产 agent 工具链内卷
