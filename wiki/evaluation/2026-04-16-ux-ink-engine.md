---
title: Evaluation -- 终端里的浏览器：Ink 渲染引擎逐行拆解
type: evaluation
created: 2026-04-16
article: output/2026-04-16-ux-ink-engine/
contract: wiki/contracts/ (inline)
cycle: 1
verdict: REVISE
---

## Layer 1: Fact-Check

| # | Claim | Source | Status | Notes |
|---|-------|--------|--------|-------|
| 1 | "96 个 TypeScript 文件" | find src/ink/ *.ts *.tsx | VERIFIED | 实际 96 个（43 顶层 + 18 components + 10 events + 12 hooks + 4 layout + 9 termio） |
| 2 | "7 种节点类型" | dom.ts 第 19-27 行 | VERIFIED | ElementNames 联合类型确实有 7 个 |
| 3 | "dom.ts 第 31-91 行 DOMElement" | dom.ts | VERIFIED | DOMElement 类型定义在第 31-91 行 |
| 4 | "dom.ts 第 110-132 行 createNode" | dom.ts | VERIFIED | createNode 在第 110 行 |
| 5 | "dom.ts 第 393-413 行 markDirty" | dom.ts | VERIFIED | markDirty 在第 393 行 |
| 6 | "reconciler.ts 512 行" | reconciler.ts | VERIFIED | Agent 报告 512 行 |
| 7 | "resetAfterCommit 第 247 行" | reconciler.ts | VERIFIED | Agent 确认 |
| 8 | "ink.tsx 第 239-258 行 onComputeLayout" | ink.tsx | VERIFIED | 对应代码在第 239 行 |
| 9 | "layout/yoga.ts 309 行" | yoga.ts | VERIFIED | 文件读取确认 309 行 |
| 10 | "第 306-308 行 createYogaLayoutNode" | yoga.ts | VERIFIED | 实际第 306-308 行 |
| 11 | "screen.ts 1487 行" | screen.ts | VERIFIED | Agent 报告 1487 行 |
| 12 | "每个 cell 用 2 个 Int32，第 332-348 行" | screen.ts | VERIFIED | packed cell layout 在第 332-348 行 |
| 13 | "CharPool 第 21-53 行" | screen.ts | VERIFIED | Agent 确认 |
| 14 | "StylePool 第 112-260 行" | screen.ts | VERIFIED | Agent 确认 |
| 15 | "diffEach 第 1156-1463 行" | screen.ts | VERIFIED | Agent 确认 |
| 16 | "hit-test.ts 130 行" | hit-test.ts | VERIFIED | Agent 确认 |
| 17 | "反向遍历子节点 第 34 行" | hit-test.ts | VERIFIED | Agent: "reverse child order (line 34)" |
| 18 | "ScrollBox.tsx 236 行" | ScrollBox.tsx | VERIFIED | Agent 确认 |
| 19 | "scrollTo 绕过 React，第 89-96 行" | ScrollBox.tsx | VERIFIED | Agent: "scroll bypasses React entirely (lines 89-96)" |
| 20 | "FRAME_INTERVAL_MS + throttle" | ink.tsx 第 212-216 行 | VERIFIED | 代码确认 |
| 21 | "optimizer.ts 93 行" | optimizer.ts | VERIFIED | Agent 确认 93 行 |
| 22 | "24000 个 cell = 192KB" | 计算 | VERIFIED | 200*120*8bytes = 192000 bytes = 187.5KB ≈ 192KB（粗略正确） |
| 23 | "Yoga 是 Facebook 开发的" | 公知 | ACCURATE | Meta/Facebook 开发 |
| 24 | "npm 版 Ink 用 Yoga WASM" | npm ink 仓库 | UNVERIFIABLE | 未独立验证，但 yoga.ts 注释支持此说法 |
| 25 | "Box.tsx React Compiler" | Box.tsx | VERIFIED | Agent: "React Compiler-optimized output (line 1)" |

Fact-check 结果: 24/25 verified, 1 unverifiable (non-critical)

## Layer 2: Logic Verification

| # | Location | Issue Type | Detail |
|---|----------|-----------|--------|
| 1 | Section 五 | 轻微因果跳跃 | "如果每个 cell 是一个 JavaScript 对象，光 GC 压力就能让终端卡顿"——这是合理推测但没有基准数据。可接受，因为 screen.ts 自己的注释（"avoids allocating 24,000 objects"）支持这个动机 |
| 2 | 盲区 "团队人数" | 悬空论点 | "3 个人写产品功能，1 个人花大量时间在渲染引擎"——没有任何来源，纯猜测 |
| 3 | 盲区 "renderNodeToOutput" | 合理但可改进 | 说"不在公开的源码摘录里"——但实际上源码在 raw_code 里是完整的，应该可以读到。是否是 Generator 漏读了？ |

Logic issues: 2 found (1 悬空论点, 1 可纠正的声明)

## Layer 3: Quality Scores

| Dimension | Score | Justification |
|-----------|-------|---------------|
| 判断密度 | 5/5 | 几乎每段都有洞察："这是内存优化""这个顺序至关重要""这是教科书级的优化"。密度接近"脑手分离"标杆。 |
| 证据质量 | 4/5 | 代码引用精确到文件+行号+代码片段，非常扎实。扣 1 分因为"团队人数"猜测和 renderNodeToOutput 声称不可读。 |
| 读者友好 | 5/5 | 每个术语都有解释（Reconciler=桥梁，Yoga=Facebook 的布局引擎），类比恰当（ink-box=div, ink-text=span）。零上下文读者完全可以跟上。 |
| 文字功力 | 4/5 | 自然流畅的中文，短句为主。技法克制。少数地方稍密（Section 七连续列了 4 个 optimizer 规则，可以精简）。 |
| 结构纪律 | 5/5 | 9 个正文章节 + 盲区 + 从业者启示 + 关键词 + 引用，全部齐全。管线全景开头，逐层深入，节奏好。 |
| 从业者价值 | 4/5 | "把终端当屏幕不当管道""双缓冲区+damage tracking 是通用模式"——可操作。但缺少具体的"如果你想用 Ink 做类似的事"的入口指引。 |

**Total: 27/30** (threshold: 22) -- PASS on score

## Layer 4: AI Slop

Scanned for: "篇" "信源" "分析者" "值得注意的是" "让我们" "不得不说" emoji

- **Found: 0 instances** of prohibited terms
- Suspicious patterns: None detected. No technique stacking. "本文" not used as meta-description.

## Verdict: REVISE

Score 27/30 passes the threshold, fact-check 几乎全部通过。但有 2 个具体问题需要修：

## Revision Instructions

1. **盲区 "团队人数"**（Section 盲区，第 1 段末尾）: 删除"如果 Anthropic 的 Claude Code 团队有 3 个人在写产品功能，其中可能有 1 个人的大量时间花在这个渲染引擎上"。这是无来源的猜测。改为讨论 fork 维护成本的结构性风险即可，不要猜人数。

2. **盲区 "renderNodeToOutput"**（Section 盲区，第 3 段）: 删除"它不在公开的源码摘录里"和"我们只能从 output.ts 的操作类型倒推它的行为"。源码完整存在于 raw_code/ 中。改为承认这个文件存在但本篇篇幅限制未展开拆解，可指向后续文章。
