---
title: SaaS-Bench 3.8% — Computer-Use 神话被一份基准击穿
type: topic
created: 2026-05-27
updated: 2026-05-27
slug: 2026-05-27-saas-bench-claude-3-8-percent
style: default
reader: default
domains: [agent-eval, computer-use, china-ai]
voice: doubao
status: in-progress
tags: [saas-bench, computer-use, unipat, anthropic, benchmark]
---

# 选题

UniPat AI 2026 年 5 月发布 SaaS-Bench：把 23 套真实开源 SaaS 装进 Docker，让 agent 干 106 道跨应用工作流。最强 Claude Opus 4.7 端到端通过率 3.8%，做完 4/106。GPT-5.5 High 1.9%，Kimi K2.5 / Gemini 3.1 Pro 0%。

## 主判断

3.8% 这个数字击穿了 Computer-Use 的全自动办公叙事。不是"AI 还不够好"——是 checkpoint 43.9% 和 end-to-end 3.8% 之间 11 倍的落差，揭示了一个工程量级问题：**单步对≠整条流程能跑通**。Long-Horizon Fragility 是这一代 agent 的天花板。

## 反判断 / 盲区

- 3.8% 也许已经够某些"半自动办公"场景用了（人审 + AI 跑流程），不能直接外推到"AI 没用"
- benchmark 总是落后于真实生产环境的工程化补丁（重试、人在回路、verifier 链）
- UniPat 是一家中国创业公司，他们自家也有商业利益——评测设计有没有偏向放大缺陷？需要看复现

## 一手素材

- 量子位 2026-05-25 报道
- UniPat AI 官方 leaderboard
- arxiv 论文 2605.15777
- GitHub UniPat-AI/SaaS-Bench
- 36kr 英文交叉验证

## 产物清单

decode 全套：article.md（4000-7000 字）+ 5 SVG/PNG + 视频脚本 + scene_plan_v3 + 豆包 TTS + email 草稿。
