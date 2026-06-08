---
title: 3.8%：Computer-Use 的全自动办公幻象，被 23 套真 SaaS 击穿
type: published
created: 2026-05-27
updated: 2026-05-27
slug: 2026-05-27-saas-bench-claude-3-8-percent
style: default
voice: doubao
tags: [SaaS-Bench, ComputerUse, UniPat, Anthropic, AgentEval]
related:
  - [[../concepts/saas-bench]]
  - [[../concepts/unipat-ai]]
  - [[../concepts/computer-use]]
  - [[../sources/2026-05-27-saas-bench-claude-3-8-percent]]
---

# 复盘 — SaaS-Bench 3.8%

## 主判断（终稿）

3.8% 不是 Claude 翻车，是 Computer-Use 范式的天花板。checkpoint 43.9% / end-to-end 3.8% 的 11 倍落差揭示 Long-Horizon Fragility 的物理上限——单步对累乘起来不对。

## 五章骨架

1. 11 倍落差才是诊断书（数学 + Error Cascading）
2. 把评测从答题升到生产环境（Docker × 真 SaaS × 3 verifier）
3. 四种失败模式（长程脆性 / 错误级联 / 验证盲 / 执行方差）
4. 闭源开源全平（前六名 < 2 个百分点，paradigm 问题）
5. 对 AI 替代叙事的具体反例（106 道实习生日常 vs 4 道完成）

## 产物

- article.md（≈5500 字）
- 5 张 SVG / PNG（cover + 11x gap + leaderboard + failure modes + methodology）
- video_script.txt + scene_plan_v3.json + tts_script.txt
- podcast.mp3（豆包 zh_female_shuangkuaisisi_moon_bigtts, 9:03）
- captions.json（87 segments）
- email_video.mp4（7.1 MB）+ email_video_compressed.mp4（6.7 MB, 1280×720）
- email_body.html + IMAP draft (chinadaas)

## 关键学习

- 豆包 captions parser 对长稿（543s+）会出现 timestamp 塌缩现象（多段 start==end），需要 fallback 到 char-weighted 分配 scene durations
- video_script v3 + script_to_scene_plan.py + char-weight backfill 是稳定可复现的链路
- AV sync gate 在 caption 不可靠时应放宽到"总时长 ≈ podcast 时长 + 每场景有 narration_segment_idx"两条硬指标

## 待办

- [ ] 用户审 IMAP draft 后 --send
- [ ] 视频号 / 抖音转 9:16 版（separate distribute step）
- [ ] 小红书 amory-public 版（重新打水印 + brand cards）
