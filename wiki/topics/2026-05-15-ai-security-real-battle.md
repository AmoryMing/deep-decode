---
title: AI 安全攻防同期落地——Big Sleep 真实 CVE × ExploitGym 898 题
type: topic
created: 2026-05-15
updated: 2026-05-15
style: default
reader: default
domains: [ai-security, agents, benchmark]
tags: [ai-security, agent, big-sleep, exploitgym, supply-chain, anthropic, openai]
---

# 主题

5 月 11-13 日这周，AI 安全的攻方和守方第一次同时"进入实战"。

- 攻方：Google GTIG 公开承认抓到 AI 协助制造的 zero-day——犯罪团伙拿 LLM 写出 2FA 绕过利用代码，计划做 mass exploitation 被 Big Sleep + CodeMender 提前打掉。代码风格留下 LLM 指纹（教学 docstring / 幻觉 CVSS / textbook Pythonic）。
- 守方：Berkeley RDI 联合 Max Planck、UCSB、ASU、Anthropic、OpenAI、Google 发布 ExploitGym——898 个真实漏洞（520 userspace + 185 V8 + 193 kernel）的 benchmark，要 agent 从 PoV 生成完整利用程序。Claude Mythos Preview 在 2 小时无 mitigation 下做出 157 题。
- 背景压力：同周 npm Mini Shai-Hulud 投毒 170+ 包，TanStack/UiPath/Mistral AI 集体中招，首次跑出能通过 SLSA L3 attestation 的恶意 worm。

# 主判断方向

AI 安全过去 18 个月跑两条独立赛道：研究方比 benchmark、企业方跑红队。5 月这周第一次握手——benchmark 用真实漏洞，真实攻击在野发生。下半年看的不是模型能不能找漏洞，是 agent 发现速度 vs 修复部署速度的差。

# 反判断 / 盲区

- ExploitGym 题目偏 CTF-like，不一定代表生产环境复杂性
- agent 攻击能力 ≠ 实际危害（兵器化、规模化、躲避检测都是独立工程问题）
- Anthropic + OpenAI 同台 paper ≠ 商业层协同
- 防御方也在用 AI，发现-利用差速可能没那么悬殊
