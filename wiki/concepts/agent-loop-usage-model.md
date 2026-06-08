---
title: Agent Loop 消耗模型
type: concept
created: 2026-04-25
updated: 2026-04-25
tags: [pricing, infrastructure, agent]
domains: [ai-infra]
---

# Agent Loop 消耗模型

订阅定价的一种新场景。用户对 AI 编程工具的消耗方式从"对话次数"转向"后台 agent 持续运行小时数"——单用户实际算力消耗与原始订阅架构假设出现量级偏差。

## 触发事件（2026-04-21）

Anthropic 把 Claude Code 从 Pro 计划悄悄移除（实际 ~2% 测试），用户社区捕获截图发酵后，Anthropic 增长主管 Amol Avasare 公开承认：

> "Usage has changed a lot and our current plans weren't built for this."
> "Per-subscriber usage has increased significantly, and our current plan architecture was not designed for this scale."

## 架构不匹配的本质

订阅原始假设：单用户每次 ≈ 几十次对话、每次几分钟。

agent loop 实际形态：
- 单次会话长达数小时
- 后台 agent 持续运行（"长跑"）
- 跨天/跨周自动化工作流（Codex 也支持，4-16 更新加入未来任务调度）
- Opus 4.7 发布后会话时长再剧增

订阅定价 = 按席位计费，但单席位实际消耗已经从聊天量级变成持续算力量级。这是按席位计费的根本性失效。

## 行业对照

OpenAI Codex 团队在 Anthropic 移除同日发文："Codex will remain available in both the free and Plus ($20/month) plans. We have the compute capacity and efficient models to support it."——精准的竞争补刀，时点不像巧合。

底层成本支撑：NVIDIA GB200 NVL72（Codex 全量运行平台）相比上代每百万 token 成本降低 35x，每兆瓦每秒 token 输出提升 50x。

## 推论

按席位订阅模型在 agent 时代有结构性瑕疵。下一阶段竞争会同时在两个维度展开：
1. **底层算力成本**——谁能撑得起 agent loop 长跑
2. **$20 价格档**——首次成为头部厂商对外沟通中的显性变量（[[20-dollar-tier]]）

## 关联

- [[20-dollar-tier]] —— 价格档显性化
- [[forked-leadership]] —— 同期事件
- [[managed-agents-architecture]] —— Anthropic 自己之前提出的 agent 架构

## 出处

[[codex-5-5-roundup]]
