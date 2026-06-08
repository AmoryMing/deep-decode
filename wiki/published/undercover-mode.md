---
title: Undercover Mode——Anthropic 员工的隐身衣
type: published
status: published
created: 2026-04-03
updated: 2026-04-25
tags: [undercover, anthropic, internal, claude-code]
mode: source-code-decode
series: claudecode_deep_decode
---

# Undercover Mode

## 摘要

Series 第二十二篇。论点：Claude Code 内置 ~90 行代码的隐身系统——公开 GitHub 操作时自动抹除所有 AI 痕迹（commit message 不能写 "Claude Code"、不能 Co-Authored-By、不能提内部模型代号）。

钩子用内部数据 vs 公开缺失的反差：「'93% 3-shotted by claude-opus-4-5, 2 memories recalled.' 这行字出现在 Anthropic 内部仓库的 PR 描述里。但你永远不会在任何公开仓库里看到这行字。」第 18 种钩子方式：内部 vs 公开的隐藏对比。

源码注释里有句**"There is NO force-OFF."**——无法确认是内部仓库时默认隐身。这是单向开关设计。

## 写作特点

- **第 18 种钩子方式：内部 vs 公开的隐藏对比**。展示一行只在内部出现的字，立刻产生"为什么外面看不到"的悬念
- **抓源码 critical 关键词当解剖刀**：和 #6 「differentially reduce」、#9 「reckless」是同种技法。"There is NO force-OFF" 是源码里的 emphatic 表达，作者放大它
- **单向开关的工程意图**：把"无法关闭"作为工程组织对"AI 痕迹外泄"恐惧的硬编码证据

## 关联概念

- [[undercover-mode]] —— 已存在 concept 页
- wiki/topics/2026-04-03-undercover-mode.md（已存在）

## 复盘备注

- 钩子方式 #18：内部 vs 公开的隐藏对比
- "There is NO force-OFF" 是源码注释级 critical 表达——和官方公告的"differentially reduce"同等抓力
