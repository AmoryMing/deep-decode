---
title: Model Tiering（模型分级发布）
type: concept
created: 2026-04-25
updated: 2026-04-25
tags: [ai-governance, release-strategy, anthropic]
---

# Model Tiering

把同一底座模型的不同能力版本分层发布，**最强的不公开，能公开的是被刻意削弱过的版本**。Anthropic 在 2026-04 的 Opus 4.7 发布事件中开创的新范式。

## 四层结构

| Tier | 形态 | 实例 | 特征 |
|---|---|---|---|
| **Tier 0** | 内部不发布 | （目前无公开案例，但 RSP 框架有对应描述） | 能力过强但风险不可控 |
| **Tier 1** | 联盟限制发布 | Mythos Preview（[[project-glasswing]]） | 能力最强，仅给 vetted consortium |
| **Tier 2** | 广泛商业发布 | Claude Opus 4.7 | 经差异化降能 + 安全护栏，公开卖 API |
| **Tier 3** | 专业豁免 | Cyber Verification Program | 持证安全研究者解锁部分被默认关闭的能力 |

## 推动技术：差异化训练

[[differential-training]]——训练阶段外科手术式削弱某些能力，保留其他。Anthropic 在 Mythos → Opus 4.7 这一步用此技术专门削减攻击性网络能力。

## 解决的矛盾（同时多个）

- 既向投资人展示前沿能力，又向监管者展示克制
- 既保留商业化广泛可及，又满足安全关键场景的专业需求
- 既不放出可被滥用的最强模型，又不浪费已经训练出的能力

## 为什么这是 precedent

- 过去默认假设：最新即最强即面向公众
- Model Tiering 第一次系统性打破这个假设
- OpenAI / Google 目前都没有类似公开结构。如果未来出现"GPT-X 有限释放版"或"Gemini X Limited Preview"，剧本是 Anthropic 这次写的
- 监管侧（AISI / EU AI Office）有可能把这种分层写进合规模板——一旦写进，所有 foundation model 厂商都得照做

## 副产品 capability signaling

把 Mythos 分数公布在对比表里，但产品线买不到——是一种 **capability signaling + restraint signaling 的组合拳**：让对手知道实力，让监管者看见克制。

## 关联

- [[differential-training]] —— 实现技术
- [[project-glasswing]] —— Tier 1 实体
- [[claude-opus-4-7]] —— Tier 2 当前实体

## 出处

[[claude-opus-4-7]]
