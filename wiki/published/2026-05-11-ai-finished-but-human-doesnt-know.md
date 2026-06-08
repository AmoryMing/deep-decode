---
title: "thinking 默认隐身——issue #8477 不是 UX bug，是 Anthropic 写在源码里的取舍"
type: published
created: 2026-05-11
updated: 2026-05-11
tags: [claude-code, thinking, transcript, beta-header, agent-ux, github-issue, observability]
slug: 2026-05-11-ai-finished-but-human-doesnt-know
status: review-ready
score: 27/30
revised: yes
---

## 出口

- 文章：`output/2026-05-11-ai-finished-but-human-doesnt-know/article.md`
- 图：4 张 SVG + 4 张 PNG（00 封面 + 3 章节图）
- 播客：未做（pipeline 已规定 decode 必产，作为后续步骤）
- 评估：`wiki/evaluation/2026-05-11-ai-finished-but-human-doesnt-know.md`，27/30，cycle 1 REVISE → cycle 2 PASS（2026-05-11 重新评审，21 条事实点全过）

## 一句话

GitHub issue #8477 表层是 UX 改进诉求，源码里则是两次方向一致的隐藏：v2.0.0 砍主屏渲染，2026-02-12 的 `redact-thinking` beta header 砍 API 摘要返回——理由是 Anthropic 自己写在 `betas.ts:265` 注释里的 "interactive users rarely open ctrl+o"。

## 论点

1. issue #8477 的真问题不是按键太多，是"steer Claude thinking" 这种 use case 在被默认设置悄悄取消
2. v2.0.0 的 UI 隐藏 + 2026-02-12 的 API redact，是两个时间点、两个层、同一个方向
3. `showThinkingSummaries` opt-in 存在，但即便开启，访问路径仍是 ctrl+o → ctrl+e — 默认的"主屏不见 thinking"没改
4. 默认隐身是 Agent 工具行业 2025-2026 共同方向；issue #8477 是这个方向的临床切片

## 一手证据来源（全部带 file:line）

- `src/utils/betas.ts:264-277` — REDACT_THINKING_BETA_HEADER 推送条件 + 决策注释
- `src/constants/betas.ts:20` — `'redact-thinking-2026-02-12'` 字面值
- `src/utils/settings/types.ts:956-961` — `showThinkingSummaries` schema
- `src/components/messages/AssistantRedactedThinkingMessage.tsx` — 30 行占位组件全文
- `src/components/Messages.tsx:229` — `hidePastThinking` prop 注释
- `src/components/Spinner/SpinnerAnimationRow.tsx:171-214` — Spinner thinking 字符串渲染
- `src/keybindings/defaultBindings.ts:44, 72, 163` — ctrl+o / meta+t / ctrl+e
- `src/keybindings/schema.ts:46, 86, 113-114` — Transcript 上下文 + actions
- `src/screens/REPL.tsx:4980-4988` — `summarize-ctrl-o-hint` 通知
- `src/components/PromptInput/PromptInput.tsx:1401-1407` — `chat:thinkingToggle` handler（验证它切的是模式不是显示）

## 二手 / 交叉

- GitHub Issue #8477（janbam，2025-09-30，状态 open）— 直接 WebFetch 验证
- `src/constants/betas.ts:4-5` — `interleaved-thinking-2025-05-14` 作为 SDK 路径补充

## 修订记录

Evaluator 触发 REVISE 的三处事实/措辞问题：

1. **时间错算**："半年" → "七个多月"（issue 2025-09-30 → 今 2026-05-11，实为 7 月 11 日）
2. **v2.0.0 因果链软化**：删除"Anthropic 在 v2.0.0 前后连下两刀做出的产品判断"这种暗示有 changelog 的措辞，改为"v2.0.0 让 janbam 第一次注意到 thinking 不在主屏；七个月后的 2026-02-12，Anthropic 又在 API 层加了一刀"
3. **删 Cursor / Windsurf / Claude.ai 三个具体产品名**：改为更软的"任何用过主流 Agent 类编辑器的人都知道..."，避免无独立验证的产品对比

## 复盘要点

- **强**：所有源码论断都带 file:line，且文章里直接引用了关键源代码段（包括 14 行的 betas.ts 决策注释）
- **强**：盲区段是真盲区——三条 Anthropic 反论 + 一条反驳，不是变相赞美
- **弱**：v2.0.0 的归因依赖 janbam 的报告（无独立 changelog 验证），通过软化措辞规避
- **弱**：5 行落地建议中"个人 Claude Code 用户"段最有价值，其他角色段略偏抽象（架构师的 5% 阈值是文章里捏的，不是 Anthropic 数据）

## 待办

- [ ] 播客（pipeline 规定 decode 必产，后续补）
- [ ] 公众号 / 小红书 / 视频号 / 抖音分发
- [ ] 用户审阅 → 反馈追加 styles/default/feedback.md
