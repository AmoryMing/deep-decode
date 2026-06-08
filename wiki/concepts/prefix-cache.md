---
title: Prefix Cache（前缀缓存）
type: concept
created: 2026-05-27
updated: 2026-05-27
tags: [llm-infra, cache, cost-optimization]
---

# Prefix Cache（前缀缓存）

## 一句话

把 LLM 推理时的 **KV cache**（每个 token 在 attention 里算出来的 key/value 向量）按"前缀"持久化，下次同样的前缀直接复用，省掉重新计算。

## 触发条件

**字节级完全匹配前缀**——不是语义匹配，是 token id 序列严格相等。

举例：
- 请求 A：`[sys prompt] [tool schema] [user1] [assistant1] [user2]`
- 请求 B：`[sys prompt] [tool schema] [user1] [assistant1] [user2'(改一个字)]`
- A 和 B 共享前 4 段的前缀 → 这部分命中
- 第 5 段不同 → 这部分 miss

如果改的是中间某段（比如 user1 里改一个字），后面所有内容都 miss——因为前缀断了。

## 经济学

DeepSeek V4 的 cache hit 价格是 miss 的 1/10。
4 亿输入 token：
- 全 miss：4 亿 × 2.5 元/M = 1000 元
- 90% 命中：3.6 亿命中 + 4000 万 miss = 90 + 100 = 190 元
- 99% 命中：3.96 亿命中 + 400 万 miss = 99 + 10 = 109 元
- 99.82% 命中：3.993 亿命中 + 72 万 miss = 99.8 + 1.8 = 101.6 元

从 90% 到 99% 命中，账单从 190 元降到 109 元（再省 43%）。从 99% 到 99.82%，再省 7%。

## Append-Only 是命中率的护城河

harness 想拉满命中率，必须做两件事：
1. **前缀不可变**：system prompt / tool schema / 长期记忆一次写定，整 session 不改
2. **只追加，不修改**：每轮新对话只往末尾 append，不重写历史

任何对中间历史的修改（编辑、删除、压缩、重排序）都会让后面所有 token 失效。

## 谁先发现这件事

Anthropic 的 Claude 早期版本就有 prefix cache（叫 prompt caching），需要显式标记 cache breakpoint。
DeepSeek 把它做成默认开启 + 自动检测公共前缀，对开发者更友好。
Reasonix 是第一个把这件事做到字节级稳定的开源 harness。

## 相关
- [[harness-cache-tool]]
- [[deepseek-v4]]
