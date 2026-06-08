---
title: DeepSeek V4
type: concept
created: 2026-05-27
updated: 2026-05-27
tags: [model, deepseek, china, llm]
---

# DeepSeek V4

## 基本信息

- 厂商：DeepSeek（深度求索）
- 发布：2026 年 Q1 预览版，Q2 正式开源（1.6 万亿参数 MoE）
- 定位：国产开源旗舰，对标 Claude 4.6 / GPT-5

## 两个版本

| 版本 | 用途 | 缓存命中率（官方公布） |
|---|---|---|
| V4 Pro | 难任务，深度推理 | 约 96% |
| V4 Flash | 日常对话、轻量编码 | 约 91% |

## 定价（2026-04-27 永久降价后）

| 项目 | 价格（元/百万 tokens） |
|---|---|
| 输入（cache hit） | 0.25 |
| 输入（cache miss） | 2.5 |
| 输出 | （未列具体数字） |

cache hit 价格 = cache miss 的 1/10（折上折）。

## 上下文缓存机制

- 默认开启，无需代码改动
- 命中条件：当前请求必须完全匹配一个 cache prefix unit
- prefix unit 切分点：用户输入/模型输出末尾、跨请求公共前缀、长输入固定 token 间隔
- TTL：几小时到几天
- 服务等级：best-effort，不保证

API 响应 `usage` 字段返回：
- `prompt_cache_hit_tokens`
- `prompt_cache_miss_tokens`

## 相关
- [[harness-cache-tool]]
- [[prefix-cache]]
