---
title: "微交互在 AI 产品里失效了：从一道稳定边界算法看新设计语言"
type: published
created: 2026-04-30
updated: 2026-04-30
tags: [microinteraction, streaming-ui, agent-ui, claude-code, saffer, material-3-expressive]
slug: 2026-04-30-microinteraction-ai-era
---

## 出口

- 文章：`output/2026-04-30-microinteraction-ai-era/article.md`
- 图：5 张 SVG + 5 张 PNG（00 封面 + 4 章节图）
- 播客：`podcast.mp3`，11 分 45 秒
- polish_report：structural PASS（2 处「不是X而是Y」否定阶梯改成单边肯定），prose 0 改

## 选题决策链

| # | 决策点 | 选项 | 选择 | 依据 |
|---|---|---|---|---|
| 1 | 微交互这个选题走哪条路线 | A 通用科普 / B AI 时代专属 / C Saffer 框架配案例 | B | 中文圈通用科普已饱和；AI 时代切入差异化最大，且匹配 CLAUDE.md 铁律 #7（源码拆解） |
| 2 | 对标产品要不要实测 | A 公开资料+源码 / B 仅 Claude Code 源码 | A | 流式 UI / agent UI 是行业现象，不是 Anthropic 一家；公开博客 + 源码组合证据强度合适 |
| 3 | 章节如何排 | 4 章 / 5 章 | 4 章（Saffer 边界 → 流式边界 → Agent 中断 → 信息论选择） | decode 模板 4-6 章，4 章紧凑、每章一个核心论点 |

## 论点

1. Saffer 2013 那套针对确定性界面，AI 产品的不确定性反馈是新主战场
2. 流式 Markdown 抖动问题在数据流层解决（StreamingMarkdown 稳定边界算法）
3. Agent 中断不是「关闭」，是分层协作信号（Esc 三种语义）
4. Skeleton 屏在 AI 场景下会变成说谎；Spinner + token 计数器是不确定性场景的信息密度最优解

## 一手证据来源

- `src/components/Markdown.tsx:186-235` — StreamingMarkdown 稳定边界算法
- `src/components/Markdown.tsx:30-65` — LRU 缓存 + 快速通道
- `src/hooks/useBackgroundTaskNavigation.ts:149-167` — Esc 三层中断
- `src/components/FallbackToolUseRejectedMessage.tsx` — InterruptedByUser 占位
- 前作 `output/2026-04-20-ux-spinner-animation/article.md` — Spinner 12 文件作为 Ch4 案例

## 二手交叉

- Smashing Magazine 2026-02 "Designing For Agentic AI"
- thefrontkit "What Is Streaming UI in AI Applications"
- Material 3 Expressive 官方 motion 文档（Google I/O 2025）

## 风险与盲区

- ChatGPT / Cursor 的流式 markdown 实现没源码可读，只能从公开博客推断
- "4× 识别速度"（Material 3）和 "30% 等待感降低"（Skeleton）数据出处不一，文中已诚实标注盲区
- 复用了 [[2026-04-20-ux-spinner-animation]] 一些片段（stalled 渐变那段），但视角换成「信息论」框架，不是简单复制

## 关联

- [[microinteraction-ai-era]] — 概念页
- [[stable-boundary]] — 算法概念
- [[collaborative-abort]] — Agent 中断概念
- [[2026-04-20-ux-spinner-animation]] — 系列前作（Ch4 复用其 stalled 渐变片段）

## 待复盘字段（用户读后填）

- 用户反馈：
- 标杆候选：
- 改进点：
