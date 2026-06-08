---
title: Claude computer-use 工程实践 decode 复盘
type: published
slug: 2026-05-15-claude-computer-use-best-practices
created: 2026-05-15
style: default
tags: [Anthropic, Claude, computer-use, browser-use, agent, engineering]
---

# 复盘 — 2026-05-15

## 产出

- article.md（约 3200 中文字）
- assets/svg/{00_cover,01_demo_to_manual,02_four_pillars,03_tried_didnt_work}.svg → assets/png/*.png
- podcast_script.txt + podcast.mp3（9:25, edge-tts XiaoxiaoNeural + loudnorm）
- spec.md + spec_lock.yaml + polish_report.json
- raw/2026-05-15-claude-computer-use-best-practices/sources.md（一手素材摘录）

## 主判断

Anthropic 2026-05-13 这篇 Best Practices 是 computer-use 从"能力 demo"转向"工程文档"的拐点信号。四件套（分辨率 / token 预算 / context 三层 / 八段 compaction）构成第一版可工程化实践。signal 不在能力新，在叙事姿态切换——Anthropic 终于愿意把客户踩坑数据沉淀成 manual。

## 复盘

- 文章结构按 Anthropic 原文 11 个 section 反推，但把"四件套"作为统一框架——比逐章翻译密度高
- 关键钩子："试过没用"披露段，自家文档里见到这种主动认怂少见；可作为日后复用的"厂商成熟度"判别指标
- 盲区段着重列了五项官方没说的数（success rate / 横向对比 / hallucinated click 率 / injection 漏报率 / preview 状态）—— 给读者保留判断空间
- 多身份落地段保持 4 类（PM / 架构师 / CTO / 工程师），延续 default 套件惯例
- polish 一轮 PASS，无返工
