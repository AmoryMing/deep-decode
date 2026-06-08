---
title: 契约 - AI 干完活，人却不知道怎么干的
type: contract
slug: ai-finished-but-human-doesnt-know
created: 2026-05-11
suite: default
---

# Sprint Contract

## Topic Brief

GitHub Issue [anthropics/claude-code#8477](https://github.com/anthropics/claude-code/issues/8477)（janbam，2025-09-30）。
表层诉求：v2.0.0 后 verbose 模式不再显示 thinking，开发者要按 ctrl+o → ctrl+e → 滚动才能看；请求加一个"始终显示思考过程"的开关。
深层议题：当 Agent 跑得快、声音小，人到底有没有能力修正它？这是 #8477 的真问题，也是 2026 年 AI Coding 的共同处境。

## Source Contract（必读，按优先级）

1. **GitHub #8477 issue 原文**（已 WebFetch）— janbam 的诉求 + 关键词 ctrl+o / ctrl+e
2. **`raw/claudecodesources/raw_code/claude-code/src/utils/betas.ts:260-277`** — Anthropic 在源码注释里直接写出"interactive users rarely open ctrl+o"的判断 + 默认推送 `REDACT_THINKING_BETA_HEADER`
3. **`raw/claudecodesources/raw_code/claude-code/src/constants/betas.ts:20`** — `redact-thinking-2026-02-12` 这个 beta header 的具体值
4. **`raw/claudecodesources/raw_code/claude-code/src/utils/settings/types.ts:956-961`** — `showThinkingSummaries` 设置项，default false，描述写得极冷淡
5. **`raw/claudecodesources/raw_code/claude-code/src/components/messages/AssistantRedactedThinkingMessage.tsx`** — 30 行的组件，全部内容是 `✻ Thinking…`
6. **`raw/claudecodesources/raw_code/claude-code/src/keybindings/defaultBindings.ts:44, 72, 163`** — ctrl+o（Global）→ 进 Transcript context → ctrl+e（Transcript）→ toggleShowAll；meta+t = thinkingToggle 是另一条路
7. **`raw/claudecodesources/raw_code/claude-code/src/keybindings/schema.ts:46`** — Transcript 是独立 keybinding context
8. **`raw/claudecodesources/raw_code/claude-code/src/components/Messages.tsx:229-230`** — 注释明写"In transcript mode, hide all thinking blocks except the last one"
9. **`raw/claudecodesources/raw_code/claude-code/src/screens/REPL.tsx:4980-4988`** — `summarize-ctrl-o-hint` notification，承认 ctrl+o 是用户找历史的唯一入口
10. **`raw/claudecodesources/raw_code/claude-code/src/components/Spinner/SpinnerAnimationRow.tsx:171-214`** — Spinner 也只渲染 `thinking`/`thought for Ns` 两种字符串，没有内容

## Hard Requirements

- 标题钩子用"造新词"或"反直觉措辞"，不是疑问句
- 每段必须有判断 + 证据，每个代码论断必须带文件路径 + 行号
- 至少 4 张 SVG（封面 + 3 章），转 PNG，嵌入正文每章
- 关键词 5-7 个，每条完整段落解释
- 落地段必须给出 ≥ 3 个角色 × 1 个本周动作
- 必须有"盲区"章节，且不能是变相赞美
- 字数 2500-3500（avoid 翻译腔的话密度更高）

## Quality Dimensions（自检清单）

| 维度 | 通过标准 |
|---|---|
| 判断密度 | 每段一个观点，不是描述 |
| 证据质量 | 所有源码论断有 file:line，所有引用有原文 URL |
| 读者友好 | 零上下文读者能跟上：thinking、verbose、redacted_thinking、beta header 都解释 |
| 文字功力 | 读出来不像翻译，禁用"值得注意的是""让我们""不得不说" |
| 结构纪律 | 钩子 + 关键词 + 4-5 章 + 盲区 + 落地 + 引用 |
| 从业者价值 | 给具体配置项 + 命令，不是"建议关注" |

## 反 AI Slop 红线

- 不出现"篇""信源""分析者""值得注意的是""让我们""本文""分析者发现"
- 不堆"加粗 + 类比 + 命名"在同一段
- 不要"这意味着什么？意味着..." 句式

## 主判断（写之前钉死）

> Anthropic 在 v2.0.0 把 thinking 默认隐藏，不是 UX 失误，是源码里直接写明的成本/噪音权衡。issue #8477 的真痛点不是按键太多，而是"想 steer Claude 的 thinking"这件事在被默认设置悄悄取消。

## 反判断 / 盲区

- 也许 Anthropic 是对的：90% 用户从不开 ctrl+o，给所有人推送 thinking summary 是浪费
- 也许 janbam 才是 outlier：他的工作（steering thinking）不是主流 use case
- 也许重要的不是显示 thinking，是事后能 grep。`-p` print mode 仍带 summary，opt-in 路径已经存在

## 风格红线

- 不能做成"评测 ctrl+o 好不好用"——这是 UX 改进建议，不是深度拆解
- 不能滑向"AI 黑盒"老调——必须把 v2.0.0 的具体决策、具体 beta header、具体源码段落摆出来
- 不能给读者灌鸡汤——给配置项、给行号、给 setting key
