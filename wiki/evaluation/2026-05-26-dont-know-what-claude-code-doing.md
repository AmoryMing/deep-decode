---
title: 评审 · dont-know-what-claude-code-doing
type: evaluation
slug: 2026-05-26-dont-know-what-claude-code-doing
created: 2026-05-26
reviewer: Evaluator（独立审稿，没参与写作）
verdict: REVISE
---

# 评审报告

## Layer 1 · 事实核查

| 索赔 | 出处 | 核查方法 | 结果 |
|---|---|---|---|
| `REDACT_THINKING_BETA_HEADER = 'redact-thinking-2026-02-12'` 在 betas.ts:20 | constants/betas.ts | grep 验证 | ✅ 逐字符匹配 |
| utils/betas.ts:264-277 的 if (...) push REDACT 块及注释 | utils/betas.ts | sed -n 抽取原文 | ✅ 注释逐字符匹配，包括 "ctrl+o display, which interactive users rarely open" |
| services/api/claude.ts:1611-1613 `thinking = { type: 'adaptive' }` | claude.ts | sed -n 抽取 | ✅ 字面匹配，请求体确实只有 type 无 display |
| utils/betas.ts:279-298 connector-text summarization POC 注释含 "anti-distillation" 和 "same mechanism as thinking blocks" | utils/betas.ts | 已读 | ✅ 两条短语都是字面存在 |
| utils/thinking.ts:146-162 IMPORTANT 注释 + return true | thinking.ts | 已读 | ✅ 字面匹配 |
| utils/thinking.ts:137-144 "DO NOT default to false for first party, otherwise we may silently degrade model quality" | thinking.ts | 已读 | ✅ 引用准确 |
| utils/settings/types.ts:960 描述明文写 "ctrl+o" 和 "Default: false" | types.ts | sed -n | ✅ 字面匹配 |
| AssistantThinkingMessage.tsx:33-58 的 UI 逻辑 | 已读 | 注 1 | ⚠️ 见说明 |
| Issue #8477 标题、作者 janbam、81 楼评论、area:tui + enhancement 标签 | gh issue view | ✅ 全部匹配 |
| janbam 原话英文引用 | gh 直读 issue body | ✅ 逐字符匹配 |
| hifihedgehog 的「Thought for 376s 是个时长，不是信号」段 | gh 直读 comments | ✅ 翻译准确，attribution 正确 |
| anthrotype 反编译的 S8() 代码块 | gh 直读 comments | ✅ 字面匹配 |
| betovildoza 的 env-var 副作用（CLAUDE_CODE_EXTRA_BODY 让 Haiku subagent 400） | gh 直读 | ✅ 内容匹配 |
| jmac122 的 CLI flag 跟 setting 互相破坏 + binary patch 步骤 | gh 直读 | ✅ 完整匹配 |
| a-connoisseur 维护 patch-claude-code repo | gh 直读 | ✅ |
| hifihedgehog 列的 9 个 related issue 编号 | gh 直读 | ✅ 全部匹配 |
| jmac122 的反蒸馏反驳：「真要蒸馏的人不会通过 $20/月的 Max 订阅做」 | gh 直读 | ❌ **FACT ERROR** |

注 1：AssistantThinkingMessage.tsx 文件第 33-58 行的字面代码是 react-compiler 编译后的形式（含 `_c(9)`、`Symbol.for("react.memo_cache_sentinel")`）。文章里展示的是 sourcemap 解码后的原始 .tsx 源（即文件末尾 base64 sourcemap 里的 `sourcesContent`）。两者逻辑等价、但呈现给读者的不是文件字面内容。文章用了「把核心决策写得很清楚」这种措辞而没说「逐字摘抄」，可以接受，但严格读会有歧义。**判定：不强制 revise，但下次最好显式注明「以下为 sourcemap 解码版」**。

## 核心错误（必须改）

### Error 1: $20/月 的 Max 订阅 — 价格张冠李戴

**位置**：article.md 第 239 行。

**原文**：
> jmac122 反驳得也很硬：「真要蒸馏的人不会通过 $20/月的 Max 订阅做。他们会用 OpenRouter 或 Cursor 当中间人...」

**事实**：
- jmac122 的英文原话是 "they wouldn't do it through a Claude Max subscription" —— 没说 $20。
- hifihedgehog 在另一条评论里说 "Pro at $20/month, Max at $100–$200/month"。
- 所以 $20 是 Pro 的价格，Max 是 $100–$200。文章把两个事实合在一起，且放进 jmac122 的口里。

**修复**：删掉 "$20/月的"。改成 "通过 Max 订阅做"。

## Layer 2 · 逻辑核查

| 检查项 | 结果 |
|---|---|
| 悬空论点（判断无证据） | 无。每个判断段都跟着代码引用或评论引用。 |
| 因果跳跃 | 「服务端默认改 omitted → 客户端拿空 thinking」的因果链清晰且有评论交叉验证。 |
| 偷换概念 | 「思考开」vs「思考可见」在「看不见思考的二阶代价」一节里被显式区分，没偷换。 |
| 遗漏反例 | jmac122 的反蒸馏反驳被引用并保留，没被压下去。 |
| 假盲区 | 盲区一节列了三个真问题（设计 vs 漏洞、ToS 合法性、未来轨迹），不是 praise from another angle。 |

## Layer 3 · 质量评分

| 维度 | 分 | 理由 |
|---|---|---|
| 判断密度 | 5 | 每节都有判断 + 证据，没有"描述但不判断"的段 |
| 证据质量 | 4 | 代码引用全部有 file+line，issue 引用全部有 attribution；扣分给 $20/月 那处 fact error |
| 读者友好 | 4 | 对完全没碰过 Claude Code 的读者门槛偏高（thinking blocks / display 字段等需要前置知识）；但每个术语在关键词节有完整段落解释 |
| 文字功力 | 4 | 整体清晰，没有翻译腔；少数句子偏长，比如「合起来就是一个不传 display、依赖服务端默认、又把服务端默认从 summarized 改成 omitted 的故事」可以再砍短 |
| 结构纪律 | 5 | 钩子、三层默认值、UI 假设、自救工具链、二阶代价、反蒸馏、盲区、从业者意味、关键词、引用全部到位 |
| 从业者价值 | 5 | "这周就该做" 后面跟 4 个具体动作，每个都带条件和坑 |

**总分：27/30**（fact error 没扣很多是因为它不是核心论点的错误，但仍必须修）

## Layer 4 · AI Slop 检查

- 「篇」「信源」「分析者」「值得注意的是」「让我们」「不得不说」—— 全文 0 次 ✅
- 自问自答（"这是什么意思？"）—— 0 次 ✅
- emoji —— 0 个 ✅
- 「本文原创」「我命名为」—— 0 次 ✅
- 元叙述（"写到这里必须承认..."）—— 0 次 ✅
- 技法堆砌：少数段同时上加粗 + 概念 + 类比（比如「把方向盘装在后视镜上」+「把方向盘装到后视镜上」重复出现 2 次）—— 这是个微小冗余，不算 slop 但可以避免。

## Verdict: REVISE

唯一硬要求：修复 jmac122 引用里的 "$20/月" 价格错误（删掉这三个字）。

可选改进（不强制）：
- 「挂了好几个月的 issue」语气太肯定，建议改成 「持续累积评论的 issue」或保留 81 楼数字让读者自己判断时长。
- 「这是楼里 hifihedgehog 在第 60+ 楼写的」改成 「这是 hifihedgehog 在 issue 后期的一条长评论里写的」更安全（楼号没核实）。
- 「把方向盘装在后视镜上」/「把方向盘装到后视镜上」出现两次，第二次可以删或换。

按最低要求只改 fact error 即可放行。
