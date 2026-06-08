---
title: 三层上下文压缩
type: concept
created: 2026-04-13
updated: 2026-04-13
tags: [architecture, memory, optimization]
domains: [ai-infra]
---

# 三层上下文压缩

上下文窗口有限（200K token），Claude Code 用三层压缩逐级降本：

| 层 | 名称 | API 调用 | 触发条件 |
|---|---|---|---|
| 1 | Micro-compact | 零 | 工具结果超预算（~2KB 预览） |
| 2 | Session memory | 零 | 结构化压缩，保留骨架 |
| 3 | Full compress | 需要 LLM | 最后手段，生成摘要 |

**设计原则**：先用最便宜的。只有前一层不够了才触发下一层。

**生产事故教训**：1,279 个会话出现 50+ 次连续压缩失败，全球每天浪费约 25 万次 API 调用。因此加入熔断器：`MAX_CONSECUTIVE_AUTOCOMPACT_FAILURES = 3`。

System Prompt 分为 static（全局缓存）+ dynamic（每用户）两段，用 `SYSTEM_PROMPT_DYNAMIC_BOUNDARY` 标记分界，最大化缓存命中。

## 相关概念

- [[harness-engineering]] -- 压缩是 Harness 的记忆层
- [[memory-system]] -- 持久化层（跨会话）
- [[multi-model-strategy]] -- 用 Haiku 做便宜的摘要

## 出处

7 个信源提及
