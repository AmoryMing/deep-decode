---
title: 80 年后，Memex 终于可以兑现
type: published
status: published
created: 2026-04-21
updated: 2026-04-25
tags: [LLMWiki, Memex, Karpathy, hot-history, 知识管理, 维护税]
source_event: Karpathy llm-wiki.md gist (2026-04-04)
source_history: Vannevar Bush "As We May Think" (1945-07)
mode: hot-history
---

# 80 年后，Memex 终于可以兑现

## 摘要

hot-history pair：把 Karpathy 2026-04-04 的 `llm-wiki.md` gist（48 小时 5000 star + 4851 fork + 1200 万阅读）和 Bush 1945 的《As We May Think》拉直成一条 80 年的时间线。

钩子用具体动作 + 时间跨度："一条 gist，把 80 年拉直"——第 8 种钩子方式：动作压缩 + 大时间跨度。

核心论点：Bush 1945 设想的 Memex（"奥多分身记忆延伸"——微缩胶片+投影屏+按钮+杠杆）80 年里 Nelson / Engelbart / Berners-Lee 接力失败 4 次。这一次成了，成的方式和所有人预想的都不一样。Karpathy 在 gist 末尾的关键句被反复引用：

> "The part he couldn't solve was who does the maintenance. The LLM handles that."

**核心命名：维护税（Maintenance Tax）**——80 年里所有知识管理工具失败的共同原因，是用户付不起整理/分类/链接/更新的人工税。Karpathy 的方法论让 LLM 替用户交这笔税。

反对意见段：「税没消失，只是换了形式」——LLM 整理的内容仍需用户校验、纠错、决定保留什么。

## 写作特点

- **第 8 种钩子方式：动作压缩 + 大时间跨度**：「一条 gist，把 80 年拉直」。一个动作（gist）+ 一个时间长度（80 年）+ 一个动词（拉直）。极简但全息
- **hot-history 模式**：把当下事件配一段被遗忘的历史。结构是**当代爆款 → 历史血缘 → 失败继承人队列 → 反例 → 维护税框架 → 当代解法 → 反对意见 → 落地**。这是一个独立的 mode，比 event-decode 多一条历史线
- **抓 Karpathy 一句话作支点**：和 #6 「differentially reduce」、#9 「reckless」是同种技法——抓原作者的一句话反复挖
- **polish_report 暴露的删除段**：原稿里有一节"《写这篇文章的过程本身就在吃自己的狗粮》"暴露了作者 vault / CLAUDE.md / schema / subagent 等知识库内部结构 → polish 阶段**整节删除**，理由 "违反 writing-style.md 第四忌与 polish-7steps.md Step 6.5"。**这是企媒 polish 标准的 acid test：哪怕"狗粮叙事"在 AI 圈是流行写法，在企媒是禁忌**
- **polish 7 步骤的具体应用**：polish_report.json 列出了 4 处具体改写（Step 3 去冗余 / Step 4 抽象→具体 / Step 5 动词加画面）——这是云端 polish 流程的颗粒度证据

## 关联概念

- [[maintenance-tax]] —— 维护税（核心命名，待补独立 concept）
- [[memory-system]] —— Karpathy llm-wiki.md 与 Claude Code memory 的同向
- [[context-constitution]] —— Letta 同期方向
- [[memex-lineage]] —— Bush 1945 → Nelson → Engelbart → Berners-Lee → Karpathy 80 年血缘（待补）

## 关联选题

- [[letta-context-constitution]] —— 都是关于 AI 时代知识/记忆的产品哲学
- [[your-harness-your-memory]] —— memory 主权的另一战线

## 复盘备注

- **第 8 种钩子方式**：动作 + 时间跨度。"一条 X，把 N 年/M 件事 Y" 这种结构有强压缩感
- **hot-history 是独立 mode**：与 event-decode / meta-decode / paper-decode / talk-decode / entity-decode 并列。结构稳定（当代 → 历史 → 失败队列 → 框架 → 落地）。值得记入 playbook
- **polish 删除整节的标准**：暴露 AI 辅助写作痕迹（vault、CLAUDE.md、schema 这些词）→ 整节删，不重写。**这是 voice.md 第四忌（不暴露加工）的硬执行**
- **polish_report.json 的 7 步骤**：在 hot-history bundle 里被显式记录每条修改的"Step X"。下一篇要去找 polish-7steps.md 的原始定义并写入 playbook
