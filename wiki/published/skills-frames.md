---
title: 脚本 1974：Anthropic 的 SKILL.md 是 Minsky 51 年前写好的
type: published
status: published
created: 2026-04-21
updated: 2026-04-25
tags: [Skills, Minsky, Frames, 神经符号, hot-history, AI历史]
source_event: Anthropic Claude Skills (2025-10) + Gary Marcus CACM 文章
source_history: Marvin Minsky "A Framework for Representing Knowledge" (MIT AI Memo 306, 1974-06)
mode: hot-history
---

# 脚本 1974

## 摘要

第二个 hot-history pair：把 Anthropic 2025-10 发布的 Claude Skills 配 1974 年 6 月 Minsky 的 MIT AI Memo 306《A Framework for Representing Knowledge》。

钩子用学术权威背书 + 反向断言：「Gary Marcus 在 *Communications of the ACM* 撂下一句话：McCarthy 和 Minsky 一眼就能认出这套东西。话只说到这里就停了——其实 Skills 不只'神似老派 AI'，它是 1974 年 6 月那份 MIT AI Memo 306 的直接复活体。」第 9 种钩子方式：权威断言再加码。

核心论点：SKILL.md 不是新东西，是 Minsky 51 年前写好的脚本。**中间隔着一场拖了 20 年的寒冬、三代推倒重来的专家系统、还有一个死于知识获取瓶颈的黄金十年**。

Minsky 1974 原文核心引用：
> "A frame is a data-structure for representing a stereotyped situation... Attached to each frame are several kinds of information. Some of this information is about how to use the frame. Some is about what one can expect to happen next. Some is about what to do if these expectations are not confirmed."

Frame = 数据结构 + 三种信息（怎么用 / 接下来会发生什么 / 预期没中时怎么办）。

历史血缘链：Frame 1974 → Schank Scripts 1977 → MYCIN 1976 → 第二代专家系统 1980s → AI 寒冬 → 神经网络复活 → SKILL.md 2025

## 写作特点

- **第 9 种钩子方式：权威断言再加码**：不是直接抛论点，是先抛 Gary Marcus 在 ACM 的"半句话"——"McCarthy 和 Minsky 一眼就能认出"，然后接「话只说到这里就停了」打断 → 接「其实它是直接复活体」加码。这种"先借权威搭半个梯子，自己接上更重的判断"的钩子有强代入感
- **hot-history 第二例**：与 #11 memex-llm-wiki 同 mode。结构稳定（当代爆款 → 历史源头 → 失败队列 → 当代复活解释 → 反对意见 → 落地）
- **抓 Minsky 一句原文掰开念三遍**：和 #6 「differentially reduce」、#9 「reckless」是同种技法。**这是 Anthropic / 学术源拆解的高复用技法**（已记入 playbook 候选）
- **死于"知识获取瓶颈"的反讽**：1974 Frames 失败的根因（人手工填知识太慢）正是 LLM 解决的——不是哲学翻新，是知识获取自动化让老框架可执行
- **中文化"先有壳再填料"**：把抽象的 Frame 概念翻成大白话「走进客厅，先认壳再填料」——Step 4 以实代虚的活用

## 关联概念

- [[frames-skills]] —— Minsky Frame ↔ Anthropic Skill 同构（待补独立 concept）
- [[neurosymbolic]] —— 神经符号融合，本文是其当代叙事的具体实例
- [[knowledge-bottleneck]] —— 知识获取瓶颈：Frames 死因（待补）
- [[progressive-disclosure]] —— Anthropic Skills 的按需加载机制
- [[memex-llm-wiki]] —— 同 hot-history 系列另一例

## 关联选题

- [[memex-llm-wiki]] —— 同期 hot-history pair
- [[context-constitution]] —— Letta 同期 agent memory 哲学
- [[claude-opus-4-7]] —— Anthropic 同期产品动作

## 复盘备注

- **第 9 种钩子方式**：权威半句话 + 自己接上加码句。要点：被借的权威必须真有公开发言（Gary Marcus 在 CACM 是公开的），不能编造
- **hot-history 第二例验证 mode 稳定性**：与 #11 同骨架（当代→历史→失败队列→框架→当代解法→反对→落地）。✅ 升 ✅✅。可作为正式 mode 写入 playbook
- **"权威只说了半句"是 hot-history 的常见钩子结构**：当代权威人物（Marcus、Karpathy）顺嘴提了一句历史，作者把这半句话扩展成全文。这是 hot-history 的标准开局法
- **"死因即解药"反讽法**：Frames 死于知识获取瓶颈，LLM 正好把这个瓶颈打掉。这种"老想法因新工具复活"的反讽叙事，是 hot-history 模式的核心修辞
