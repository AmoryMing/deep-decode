---
title: Skill Graph 1.0 必塌：人为什么不该在原子层驾驶 Agent
type: published
created: 2026-04-29
updated: 2026-04-29
status: awaiting-evaluation
output_dir: output/2026-04-29-skill-graphs-2/
source: https://x.com/shivsakhuja/status/2047124337191444844
tags: [claude-skills, skill-graph, agent-orchestration, leverage]
---

# 复盘：Skill Graphs 2.0 拆解

## 选题来源

用户直接给了 Shiv Sakhuja 的推文 URL，触发 deep-decode。属于"用户直推选题"，不是从 topic-queue 排产。

## 角度策略

四问结构（不复述三层模型，直接打质疑）：
1. **概率衰减**：补 1.0 必塌的数学证明（90%^5=59%）
2. **抽象稳定上限**：三层是工程史共识，不是 Shiv 发明
3. **公式有水分**：100x 是上限，实测 3-5×，剪刀差是测试成本
4. **本工厂自审**：把现有 8 个 skill 重新归档，暴露 capability 层为空

## 产出物清单

- article.md（约 3500 字）
- 00_cover.svg/png — 三层概览
- 01_probability_decay.svg/png — 衰减曲线
- 02_three_layers.svg/png — 工程史同源对照
- 03_leverage_vs_testing.svg/png — 杠杆与测试成本剪刀差
- 04_factory_audit.svg/png — 工厂自审矩阵
- article.docx — Word 版
- podcast_script.txt + podcast.mp3（4分54秒，4.7MB，11 段）
- email_preview.html — 邮件 HTML（5 张 CID 内联 + podcast 附件）
- send_email.py / build_podcast.py — 复用脚本

## 关联 wiki

- [[../sources/shiv-skill-graphs-2]]
- [[../topics/2026-04-29-skill-graphs-2]]
- [[../concepts/skill-graph-levels]]
- [[../concepts/shiv-sakhuja]]

## 自检结果

- [x] 钩子标题（反直觉判断 + 锋利动词："必塌"）
- [x] 关键词在文末，6 个，每个完整段落
- [x] 5 张图嵌入对应章节，图文穿插
- [x] 引用第一条是原文 URL
- [x] 无 emoji / "我认为" / "让我们" / "值得注意的是"
- [x] 盲区段独立成章，列出 4 条 Shiv 未答的问题
- [x] "对从业者意味着什么"段给出 3 条具体动作（audit / 砍深度 / 暴露判断点）
- [x] 概率衰减一段补了原文没有的数学论证（83%→81%→73%→59%→48%）
- [x] 工厂自审段直接点名 deep-decode 是工厂里失败率最高的 skill —— 自我批评

## 风险 / 待评

- 文章对工厂自身 deep-decode skill 的批评是否过度？等用户读完反馈。
- 100x 公式的"水分"分析用了 SWE-bench/MLE-bench/Tau-bench 作为旁证，但未引用具体分数 —— 如果用户要求精确化，需补 fact-check。
- compound 上限 8-10 的"7±2 chunk 上限吻合"是修辞类比，不是严证。可能被挑剔。

## 分发状态

未分发。停在 output/ 草稿态，等用户读完发"评"再走 distribute。
