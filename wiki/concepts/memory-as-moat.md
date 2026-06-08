---
title: Memory as Moat（Memory 作为护城河）
type: concept
created: 2026-04-25
updated: 2026-04-25
tags: [agent-memory, platform-strategy, moat]
domains: [ai-product, business]
---

# Memory as Moat

AI 产品时代的真正护城河不是模型能力，是 memory。这是 Sarah Wooders（Letta CTO）+ Harrison Chase（LangChain CEO）2026-04 联合发声的核心命题。

## 论证逻辑

1. **模型能力会继续趋同**——切换模型的成本越来越低（API 抽象、价格战、benchmark 接近）
2. **Memory 不会趋同**——切换 harness = 丢 memory = 业务级痛苦
3. **模型厂商有巨大动机把 memory 收进 API 后面**——Anthropic Managed Agents 把 Session 数据、Memory Store 全存自己服务器
4. 因此：**memory 的归属决定产品主权**

## Stateful Lock-in（状态锁定）

Harrison 提出的原创命名。三级阶梯——

| 级别 | 形态 | 切换成本 |
|---|---|---|
| **轻** | 模型 lock-in | 改 API endpoint 即可，几小时 |
| **中** | Tool / harness lock-in | 重写工具调用层，几周 |
| **重** | **Stateful lock-in（状态锁定）** | memory 在对方手里，重建 = 业务级痛苦 |

Harrison 的人肉证据：他的 Fleet 邮件 Agent memory 被误删，重建体验断崖式下跌。

模型时代的切换成本是软的，agent 时代的切换成本是硬的——一旦启动 memory 就很难回头。

## Memory ≠ Plugin

Sarah 原创框架："插记忆 ≈ 插开车"。memory 不是可以独立外挂的插件，因为它涉及 7 个无法外部化的决策：

1. 什么进 memory（filtering）
2. 什么时候进（write trigger）
3. 怎么组织（index / schema）
4. 什么时候读（retrieval trigger）
5. 多大权重（priority）
6. 什么时候忘（forget policy）
7. 跨会话怎么继承（session transfer）

这 7 个决策深度耦合 harness 的其他部分——任务规划、工具调用、对话管理。把 memory 切出来当 plugin 等于把方向盘切出来当 USB 设备。

## 反向修正（盲区）

memory 主权论也有自己的 lock-in：

- **LangChain 生态** Deep Agents 也有自己的格式锁定
- **Letta 自有格式** Context Constitution 是 Letta 专属
- **企业自托管成本** memory 自托管需要 DB 备份 / 多租户 / 向量库 / 权限管控——大多数企业没这资源
- 最终很多企业还是会买托管版

## 关联

- [[stateful-lock-in]] —— Harrison 原创命名（核心子概念）
- [[managed-agents-architecture]] —— 被反对的对象
- [[context-constitution]] —— Letta 阵营的同向产品
- [[harness-engineering]] —— Memory 嵌入的载体

## 出处

[[your-harness-your-memory]]
