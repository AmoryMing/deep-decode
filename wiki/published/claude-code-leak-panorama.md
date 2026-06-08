---
title: 1902 个文件里藏了什么——Claude Code 源码泄露全景
type: published
status: published
created: 2026-04-03
updated: 2026-04-25
tags: [Claude Code, 源码泄露, harness, 全景]
source_url: https://cybernews.com/security/anthropic-claude-code-source-leak/
mode: source-code-decode
series: claudecode_deep_decode
---

# Claude Code 源码泄露全景

## 摘要

Series 第一篇（全景概述）。2026-03-31 npm 包 `@anthropic-ai/claude-code` v2.1.88 含 59.8MB sourcemap，解压出 1906 个 TypeScript 文件、512,685 行代码。Chaofan Shou 首发 X 帖 2880 万阅读，GitHub 镜像两小时 5 万 star（平台史上最快）。

钩子用反问 + 多选项 + 反预期揭晓：「世界上最赚钱的 AI 编程工具，用什么搜代码？向量数据库？Embedding？语义检索？都不是。grep 和 ripgrep。」第 11 种钩子方式：连环排除 + 反预期答案。

核心论点：技术先进性不等于工程正确性。Anthropic 顶尖团队在最核心功能（搜索）上选最不"AI"的方案——因为想清楚了什么在这个场景下最可靠。

## 写作特点

- **第 11 种钩子方式：连环排除 + 反预期答案**。三连否（向量DB？Embedding？语义检索？）+ 一句揭晓（grep）。让读者跟着否定了三个候选，再被反预期答案打中
- **以小驳大**：用 grep 这个最朴素的工具反驳"AI 必须先进"的预设，是企媒"工程务实主义"的核心姿态
- **泄露事件本身的细节叙事**：59.8MB / 2880 万阅读 / 5 万 star / 14 个月前的同源事故——每个数字都是新闻级证据

## 关联概念

- [[harness-engineering]] / [[two-leaks-evolution]] / [[memory-system]]

## 关联选题

- [[harness-greater-than-model]] —— 同 series 第 2 篇
- [[two-leaks-evolution]] —— 同 series 第 3 篇

## 复盘备注

- 钩子方式 #11 累入观察样本
- "工程务实主义"姿态是 Claude Code 源码系列的整体基调
