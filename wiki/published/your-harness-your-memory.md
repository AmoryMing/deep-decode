---
title: Your Harness, Your Memory：AI 时代的主权让渡之战
type: published
status: published
created: 2026-04-17
updated: 2026-04-25
tags: [agent架构, harness, memory, langchain, letta, anthropic, 平台战略]
source_urls:
  - https://x.com/hwchase17/status/2042978500567609738
  - https://x.com/sarahwooders/status/2040121230473457921
mode: meta-decode
---

# Your Harness, Your Memory

## 摘要

12 天 6 个动作连成一条线——

- 3/31 Claude Code v2.1.88 npm 包 `.map` 文件未 gitignore，512K 行 TS 源码被扒，研究者发现"Self-Healing Memory"
- 4/2 Letta 发布 [[context-constitution]] + Letta Code（memory-first harness）
- 4/3 Sarah Wooders 推文《Why memory isn't a plugin (it's the harness)》131K 阅读
- 4/8 Anthropic 发布 *Scaling Managed Agents: Decoupling the Brain from the Hands* + [[managed-agents-architecture]] 公测，$0.08/session-hour
- 4/10 LangChain 发布 *Deep Agents Deploy*——博客标题"an open alternative to Claude Managed Agents"
- 4/11 Harrison Chase 发长推《Your Harness, Your Memory》1.8M 阅读

核心论点：**这不是各自为战的技术博客，是 LangChain + Letta 对 Anthropic 发起的联合商业战**。Harrison 长推是炮兵观测员的开火信号，文末致谢 Sarah Wooders 是协同信号。

三大命题：
1. **Harness 不会消失**——Claude Code 512K 行源码证明连头部模型公司都在猛投 harness。Web search 本质也是 harness
2. **Memory = Harness 本身**（Sarah 框架）——7 个 memory 相关决策无法外部化为 plugin。"插记忆 ≈ 插开车"
3. **三级 Lock-in 阶梯**（Harrison 框架）——轻 / 中 / 重三档，从模型 lock-in 到状态 lock-in（Stateful Lock-in）

## 写作特点

- **钩子用结构性时间线，不是单个时间压缩**：12 天 6 个动作排成清单做开场。比 #1 #2 的"X 天 Y 件事"更具体——把每件事的日期 + 内容 + 阅读量都放出来。**这是时间压缩钩子的进化变体**
- **舆论战视角拆开同期动作**：把 Anthropic / LangChain / Letta 的同期博客视为协同动作，不是孤立内容。这种"先当营销物料读，再当技术思辨读"的双视角法是企媒拆解的高阶技法
- **盲区段直击开源派痛处**：4 条盲区里 3 条反驳 Harrison/Sarah 自己——「LangChain 也有 lock-in（Deep Agents 生态）」「企业要 memory 主权但没资源自运营」「LangChain 从 v1→LangGraph→Deep Agents 三次架构换血」。这种"反驳作者"的盲区比"补充作者"值钱十倍
- **职业映射读者落地段**：把 muming 的"数字员工 MCP APP / 企百科 / Amory PM 替身"具体场景映射到三大命题，不写抽象的"产品经理可以...."

## 关联概念

- [[memory-as-moat]] —— Memory 作为护城河（待补 concept 页）
- [[stateful-lock-in]] —— 状态锁定，Harrison 原创命名（待补）
- [[managed-agents-architecture]] —— Anthropic 同期动作（已存在）
- [[context-constitution]] —— Letta 同期动作（已建）
- [[harness-engineering]] —— Harness 这个概念底盘（已存在）

## 关联选题

- [[letta-context-constitution]] —— Letta 阵营的另一战线
- [[managed-agents-architecture]] —— Anthropic 阵营的对位
- [[claude-opus-4-7]] —— 同窗口 Anthropic 的产品动作

## 复盘备注

- **结构性时间线钩子**：6 个事件全列表 + 阅读量数字。这是时间压缩的进化变体——不只是"时间长度"还有"事件密度 + 影响力数字"
- **协同动作识别能力**：本篇成功的关键是**识别出三家公司同期动作不是巧合**。这种能力需要：a) 关注一周时间内多家公司的发声 b) 看 Harrison 末尾致谢这种细节 c) 把博客标题的措辞（"open alternative to..."）当宣战书读
- **拆穿开源派也是营销**：盲区段把 LangChain/Letta 自身 lock-in 拆开——这种"两边都不信"的中立视角是企媒拆解能立得住的核心
