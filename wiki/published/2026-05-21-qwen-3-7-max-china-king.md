---
title: 1475 分的中国闭源最高位：Qwen3.7-Max 不是新模王，是阵营换挡
type: published
created: 2026-05-21
updated: 2026-05-27
tags: [Qwen, Alibaba, LMArena, ChineseLLM, Benchmark, ClosedSource]
---

# 1475 分的中国闭源最高位：Qwen3.7-Max 不是新模王，是阵营换挡

## 产物

- 正文：`output/2026-05-21-qwen-3-7-max-china-king/article.md`（2841 字）
- 图：6 张 SVG + 6 张 PNG（cover / 01_elo_gap / 02_camp_matrix / 03_timeline / 04_three_piece / 05_two_kings）
- 播客：`podcast.mp3`（10m03s，VoxCPM2 内网原生服务 48kHz）
- Phase 文件齐：phase0_sources.json / phase1_strategy.md / phase2_evidence.json / polish_report.json
- 信源：11 条（阿里通义官方 + 机器之心 + IT 之家 ×2 + Buildfastwithai + SCMP + Decrypt + benchLM.ai + codersera + Artificial Analysis + 网易科技）

## 主判断

Qwen3.7-Max 在 LM Arena 拿到 1475 分（中国闭源最高位）不是新王座，而是中国 AI 阵营从「开源换地位」切换到「闭源换毛利」的公开换挡。阿里把旗舰从开源里拿走，是商业化决心的真实信号。半年涨 11 分，头部同期涨 7 分——相对差缩、绝对差未缩（仍差 Claude Opus 4.6 Thinking 26 分）。5/14 静默挂榜 → 5/20 官宣是先挂榜后发布的剧本，三件套绑定（Qwen + 平头哥 M890 + 阿里云百炼）才是真正的发布主体。

## 原创命名

5 个 4-6 字内行词，未自封原创：
- 追近不追平（相对差 vs 绝对差）
- 模型分层闭源（旗舰闭、中段开）
- 先挂榜后发布（5/14 → 5/20 节奏）
- 三件套绑定（模型 + 芯片 + 云）
- 单榜冠军 vs 多榜中位（Arena 中国第一 ≠ BenchLM 中国第一）

## 复盘

- 数字核查链：SCMP / Buildfastwithai / Artificial Analysis 三方交叉确认 1475 / 第 13 / Index 57；SCMP 写"#13 个体"与官方推文"#6 lab"做了区分。Qwen3.5-Max 历史 1464 来自阿里云官方博客。
- 盲区一节明确点出 LM Arena 中文样本偏置 / 不同 benchmark 分歧（BenchLM 上国产第一是 DeepSeek-V4 87 分）。
- 4 grep 仅"本身就是"命中 1 处，已修。prose 11 段重写，0 删除。
- 流水线：sub-agent Phase 0-3 → sub-agent polish → sub-agent visual + sub-agent podcast 并行，4 段全部 OK；VoxCPM2 一次跑通未触发降级。

## v3 script-driven 视频管线复盘（2026-05-27 补）

- 重做了视频版（旧版 podcast.mp3 + 视觉是 v2 路径），按 `modules/script-driven-video-spec.md` 走脚本驱动管线
- 8 个 scene（cover + hook + 5 chapter + outro），总时长 568s（9 分 28 秒）
- TTS 换成豆包 `zh_female_roumeinvyou_emo_v2_mars_bigtts`（项目当前默认）
- **踩坑**：长脚本（2460 中文字符）一次喂豆包 TTS 会触发时间戳截断，只返回前一半字级 timestamps，捕捉到 31 个 0ms 时长 segment。改成按 `[转场]` 分 8 块逐段合成 → ffmpeg concat → 手工 offset 拼 captions 的方案后通过。这条经验值得反推 `captions_from_doubao.py`：长脚本必须自动分块
- AV 同步门：scene duration_s sum = 568.080s = podcast 实际时长（diff < 0.001s），PASS
- 旧 podcast.mp3 改名为 `podcast_legacy.mp3` 保留（"播客单独发布"渠道仍可用）
- 视频已附入 IMAP 草稿，签名按 spec 改为 `AI Force · 智能体研究员 · 慕铭`（旧版倒置写法已废弃）
