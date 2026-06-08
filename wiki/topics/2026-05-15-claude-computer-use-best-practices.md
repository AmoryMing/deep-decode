---
title: Claude computer-use 工程实践指南
type: topic
created: 2026-05-15
updated: 2026-05-15
style: default
reader: default
tags: [Anthropic, Claude, computer-use, browser-use, agent, engineering]
---

# 选题：Claude 把 computer-use 写成了工程说明书

## 主判断

Anthropic 第一次把 computer-use 从能力 demo 转向工程文档。截图分辨率、token 预算、context 管理、prompt 模板四件套构成第一版可工程化的实践。signal 不在功能新，在于 Anthropic 承认这事终于到了写 manual 的阶段——意味着企业可以照着造 agent，不必再自己摸黑。

## 反判断 / 盲区

- 没披露 task success rate 具体数字
- 没跟 OpenAI Operator、Google Project Mariner 横向比较
- 没说 hallucinated click 发生率
- prompt injection 分类器漏报率不公开
- 仍是 preview 状态——不等于生产 SLA

## 一手素材

- https://claude.com/blog/best-practices-for-computer-and-browser-use-with-claude（主源）
- raw/2026-05-15-claude-computer-use-best-practices/sources.md（摘录）

## 产物

decode（article + 4-5 图 + podcast）→ 邮件/公众号/小红书 draft
