---
title: AI 攻防没有军备竞赛，差速窗口已经开了
type: published
slug: 2026-05-15-ai-security-real-battle
created: 2026-05-15
updated: 2026-05-15
style: default
reader: default
tags: [ai-security, agent, big-sleep, exploitgym, supply-chain]
---

# 复盘

## 选题来源
AIHOT 自动选题。5 月 11 日 Google GTIG 首次披露 AI 协助制造的真实 zero-day，5 月 13 日 Berkeley 联合 5 家机构发 ExploitGym 898 题 benchmark。两件事 48 小时之内、同主题、攻守两侧，第一次握手。

## 主判断
AI 安全过去 18 个月跑两套独立赛道（研究端 benchmark vs 企业端红队）。这周第一次握手——benchmark 用真实漏洞、真实攻击在野发生。下半年看的不是模型能不能找漏洞，是 agent 发现/利用速度 vs 修复/部署速度的差速。

## 原创命名（5 个）
- 差速窗口（Speed Delta Window）
- LLM 指纹（LLM Fingerprint）
- 研究协同 ≠ 商业协同
- 内场视野（Insider Vision）
- Attestation 失守

## 一手素材
- https://rdi.berkeley.edu/blog/exploitgym
- https://arxiv.org/abs/2605.11086
- The Register / CNBC / Bloomberg 关于 GTIG 披露
- npm Mini Shai-Hulud 多家二手报道（The Hacker News / SecurityWeek / Snyk / Wiz）

## 产出物
- article.md（3402 中文字）
- 4 张 SVG/PNG（封面 + 攻方现状 + ExploitGym 数据 + 差速窗口）
- podcast.mp3（7 分 31 秒，edge-tts Xiaoxiao + loudnorm -16 LUFS）
- 三平台分发草稿

## 自检结论
- 不出现"我"
- 五段齐全（开篇 / 盲区 / 对从业者 / 关键词 / 引用）
- 关键词为完整段落
- 数据归属显式（GTIG / Hultquist / Berkeley / 具体来源）

## 待后续观察
- ExploitGym leaderboard 后续更新（哪家先把分数写进 system card）
- Big Sleep 公开的真实 CVE 厂商披露窗口
- npm 生态对 SLSA attestation 失守的下一代防御提案
