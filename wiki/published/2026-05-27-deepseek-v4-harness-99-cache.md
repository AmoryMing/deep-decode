---
title: 12 美元 vs 61 美元 — DeepSeek V4 + Reasonix
type: published
slug: 2026-05-27-deepseek-v4-harness-99-cache
created: 2026-05-27
updated: 2026-05-27
style: default
reader: default
voice: default-doubao
tags: [deepseek, harness, prefix-cache, agent-tooling]
---

# 12 美元 vs 61 美元 — 复盘

## 主判断

模型层趋同后，差距迁移到了 harness 层。Reasonix 用一个公开放弃通用性、只为 DeepSeek 打造的开源 harness，把缓存命中率从 DeepSeek 自家服务的 91-96% 推到 99.82%。单日 4.35 亿 token 账单从 61 美元降到 12 美元。这是对 Claude Code / Cursor "模型无关"哲学的一次直接挑战——垂直绑定一家模型，反而比通用框架便宜五倍。

## 关键证据

- Reasonix README 自述："435M input tokens, 99.82% cache hit, ~$12 instead of ~$61"
- DeepSeek 官方命中率基线：V4 Pro 96% / V4 Flash 91%（量子位 2026-04-27）
- DeepSeek V4 定价：cache hit 0.25 元/M vs cache miss 2.5 元/M（hit 是 miss 的 1/10）
- esengine 声明："完全不通用，也不会发布通用功能"
- 三大支柱：cache-first loop（byte-stable prefix） / tool-call repair（四轮）/ cost control（默认 Flash 难任务才上 Pro）

## 产物清单

- article.md（约 4900 字）
- cover.png + 01_cache_economics.png + 02_three_regions.png + 03_tool_repair.png + 04_two_philosophies.png
- video_script.txt + scene_plan_v3.json + tts_script.txt
- podcast.mp3 + captions.json + podcast_meta.json（豆包 zh_female_shuangkuaisisi_moon_bigtts，388s，69 段，2520 词）
- email_video.mp4（65MB Remotion 渲染）+ email_video_compressed.mp4（8.6MB，1280×720，crf=32）
- email_body.html（5 张 CID 内联图，奶油纸主题）
- IMAP Drafts: 已 append（收件人 xuehongtao@chinadaas.com）

## QA gate

- polish_grep 四项 PASS（ai-signature / translation / abstract-noun / hook）
- factcheck.json PASS（6 条全部一手源交叉）
- AV sync gate PASS（每 scene |duration_s - sum(caps)| < 0.2s，总时长 388.0s vs podcast 388.1s 差 0.1s）

## 复盘

- 信源链：量子位 + GitHub README + DeepSeek 官方 API 文档 + 量子位降价旧文，四源交叉。
- 钩子选定 "12 美元 vs 61 美元"——具体数字 + 对比，符合"反直觉数据"模式。
- 关键词 4 个均为完整段落解释：harness / prefix cache / append-only loop / tool call repair。
- 风险：99.82% 是单日实测，已经在"盲区"章节明确标注。
- 落款：chinadaas-internal（不出现 Amory 字样）。

## 分发状态

| 平台 | 状态 | 日期 |
|---|---|---|
| 邮件 | draft saved (IMAP) | 2026-05-27 |
| 公众号 | 待发 | — |
| 小红书 | 待发 | — |
| 视频号 | 待发 | — |
| 抖音 | 待发 | — |
