---
title: AI 时代的微交互（Microinteraction in AI products）
type: concept
created: 2026-04-30
updated: 2026-04-30
tags: [microinteraction, streaming-ui, agent-ui, claude-code, saffer]
domains: [creative-tools, dev-ux]
---

## 一句话

Saffer 2013 那套确定性界面的微交互框架在 AI 产品里失效；新一代微交互的主战场从「装饰」转成「不确定性的可视化」，工程量下沉到数据流处理层。

## 范式转移

| 维度 | Saffer 1.0（2013） | AI 时代（2026） |
|---|---|---|
| 对象 | 离散事件（按钮、开关、归档） | 持续生成过程（流式 token、tool use、思考链） |
| 时长 | < 100ms 可枚举 | 3-30s 未知 |
| 反馈层级 | 已发生事件的视觉化 | 正在发生过程的状态建模 |
| 工程位置 | CSS transition / Framer Motion | lexer 边界、ref、abort signal、hash cache |

## 三条新主战场

1. **流式渲染抗抖动** — 见 [[stable-boundary]]，Claude Code `Markdown.tsx` 的 StreamingMarkdown 算法
2. **Agent 协作中断** — 见 [[collaborative-abort]]，Esc 三层语义、InterruptedByUser 写进对话历史
3. **不确定性反馈** — Spinner + token 计数 + stalled 渐变；Skeleton 屏在 AI 场景下会变成「说谎」

## 关联实现

- [[stable-boundary]] — 流式 Markdown 稳定边界算法
- [[collaborative-abort]] — Esc 中断分层
- [[uncertainty-feedback]] — 不确定性反馈三通道
- [[2026-04-20-ux-spinner-animation]] — Spinner 12 文件原型

## 引用

- [Microinteractions, Dan Saffer (2013)](https://www.oreilly.com/library/view/microinteractions/9781449342760/)
- [Designing For Agentic AI, Smashing Magazine 2026-02](https://www.smashingmagazine.com/2026/02/designing-agentic-ai-practical-ux-patterns/)
- [Material 3 Expressive Motion](https://m3.material.io/blog/m3-expressive-motion-theming)
