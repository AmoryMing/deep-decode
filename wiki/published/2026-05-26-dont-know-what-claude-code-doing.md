---
title: 复盘 · 思考被默认藏起来了：Claude Code v2 把可观测性押给了反蒸馏
slug: 2026-05-26-dont-know-what-claude-code-doing
type: published
created: 2026-05-26
updated: 2026-05-26
style: default
status: review-ready
tags: [Claude Code, 思考链, 反蒸馏, UX 退步, GitHub issue 拆解]
---

## 选题来源

- 主信源：[anthropics/claude-code Issue #8477 — Add Option to Always Show Claude's Thinking](https://github.com/anthropics/claude-code/issues/8477)（81 楼评论，标签 area:tui + enhancement，open）
- 一手代码：`raw/claudecodesources/raw_code/claude-code/src/` 1856 个 .ts/.tsx 中的 6 个文件（`constants/betas.ts`、`utils/betas.ts`、`utils/thinking.ts`、`services/api/claude.ts`、`components/messages/AssistantThinkingMessage.tsx`、`utils/settings/types.ts`）
- 交叉验证：jmac122、hifihedgehog、anthrotype、betovildoza、AndASM、a-connoisseur 6 位 issue 评论者的具体技术陈述

## 主判断

把思考链从 Claude Code v2 默认显示拿走，不是单点 UX 改动，而是叠了三层默认值——服务端 redact header、客户端不传 display、`!isInteractive` gate 排除非交互调用——合成出来「设置打开了也没用」的静默坏掉行为。源码里 `// the summary is only used for ctrl+o display, which interactive users rarely open` 这条注释是错误的承重假设，它把"事后视图打开率低"作为"用户不关心思考"的证据，但真相是 ctrl+o 是事后视图，steering 要的是实时。

## 主要论点

1. 三层默认值：betas.ts:264-277 加 REDACT header + claude.ts:1611 不传 display + betas.ts:273 的 `!getIsNonInteractiveSession()` gate。
2. ctrl+o 哲学的错误：CtrlOToExpand 组件挂在 thinking、FileWriteTool、Grep、AgentTool 各处；toggle 的是 transcript 模式不是局部展开；事后查看不能 steer。
3. 用户自救工具链：UI 切换 → env var → CLI flag → binary patch，代价递增，每个都有副作用（开关 UX 坏、subagent 400、setting 互相破坏、minify 变量名每版本变）。
4. 二阶代价：失去前提偏差捕获、CLAUDE.md 内化验证、长任务 assumption audit。
5. 反蒸馏假设：源码里 `utils/betas.ts:279` 的 connector-text summarization POC 直接以 anti-distillation 命名，机制描述 "same mechanism as thinking blocks"——thinking 的同款机制是不是同款理由，源码没明说，但叠在一起读最有解释力。

## 风格自查

- 写给没碰过 Claude Code 的读者：thinking blocks / display 字段 / adaptive thinking 在关键词节有完整段落解释 ✅
- 每个判断有证据：所有代码论断有 file:line 引用，所有评论引用有 attribution ✅
- 没有翻译腔、自问自答、emoji、自命原创 ✅
- 没有"让我们""值得注意的是""不得不说" ✅

## Evaluator 评分

总分 27/30。Fact-check 抓出 1 处错误（jmac122 引用里把 $20/月 加在 Max 上，实际 $20 是 Pro），已在 revision 中修复。同时软化了"挂了好几个月" 和 "第 60+ 楼" 两处过自信的措辞。

## 产出物

- `output/2026-05-26-dont-know-what-claude-code-doing/article.md`
- `00_系列封面.svg/.png`、`01_三层默认值.svg/.png`、`02_用户工具链谱系.svg/.png`
- `wiki/evaluation/2026-05-26-dont-know-what-claude-code-doing.md`

## 待办

- [ ] 用户审核 article.md
- [ ] polish-pipeline（可选）
- [ ] visual-pipeline 补图（如果需要更多章节图）
- [ ] podcast-pipeline 产出 podcast_script.txt + podcast.mp3
- [ ] 分发（邮件 / 公众号 / 小红书 / 视频号 / 抖音）
