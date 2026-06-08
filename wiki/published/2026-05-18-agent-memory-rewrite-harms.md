---
title: 记忆越改越坏：自进化 Agent 的压缩陷阱
type: published
created: 2026-05-18
updated: 2026-05-18
slug: 2026-05-18-agent-memory-rewrite-harms
style: default
tags: [Agent记忆, LLM研究, memory-consolidation, ARC-AGI, 自进化Agent, AIHOT自动选题]
---

# 复盘：记忆越改越坏

## 选题来源

AIHOT 2026-05-18 自动选题（category=paper）。转发源 [Rohan Paul 推文](https://x.com/rohanpaul_ai/status/2055919204591902771)（付费墙抓不到），定位到一手论文 arXiv 2605.12978v1。

## 主判断

行业默认的「蒸馏经历 → 存文字 → 不断重写」自进化记忆配方不是免费的自我提升引擎；每次重写是有损操作，错误按复利累积，干净数据也救不回——GPT-5.4 在它原本 100% 能解的 19 道 ARC-AGI 题上，被自己的流式重写记忆拖到第 10 轮 52.6%。

## 关键产出

- `article.md` ~7000 中文字，5 章 + 盲区 + 四身份落地 + 8 关键词段
- 5 张 SVG/PNG（封面 + 抛物线 + 100%→52.6% 数据对比 + 三失败机理 + 双存储修法）
- `podcast.mp3` 8.16 分钟，edge-tts（VoxCPM2 内网无网降级，待 VPN 恢复可重生）
- polish_report.json（structural PASS 3 edits / prose 1 轮 2 段）+ factcheck.json（15 条全 PASS，0 硬伤）

## 一手素材修正

AIHOT 摘要两处错误，已按论文原文修正并在文中用准确数据：
- 模型：GPT-4 → **GPT-5.4**
- 机构：清华等 → **UIUC + 清华 IIIS（work done at UIUC）**
- 数字：正文用精确的 Stream R10 = 52.6%（Fig.2），引文区段保留论文原话「fails on 54%」并翻译，二者不矛盾。

## 失败机理（论文 §6）

| 机理 | 触发 | 证据 |
|---|---|---|
| 错分组 misgrouping | 输入变宽 | Force regime 频繁跨类合并；Auto 自主权下 71 步分清 6 类 |
| 干扰 interference | 过泛化 | ScienceWorld 15-task：Cumulative 落后 Fresh +203；过泛化 5×、垃圾 20× |
| 过拟合 overfit | 输入变窄 | 50 轮重写："max size" → "数值属性"，丢失可计算特征 |

修法：Complementary Learning Systems 双存储——first-class 原始经历缓冲 + agent-gated 抽象，绝不塌进单一重写循环。Auto / Episodic-Mgmt-Only 均 ≥ Force（400 步累计 43.2% vs ~22-35%）。

## 写作记录

- 钩子用「反直觉数据」：100% → 52.6%，开篇即抛核心冲突，无八股开头
- grep 抓到并修：换句话说 ×1、某个 ×2（其中两处是论文转述，改为忠实但具体的措辞）
- prose 1 轮改 2 段（动词强化：要→烧；重写表述更清晰）
- 标杆对标 2026-04-09 脑手分离：判断密度、证据具体性、四身份落地一致

## 分发进度

见 `schedule/published.md`。邮件草稿已存（未发），等用户在邮件客户端审阅后再 --send。公众号/小红书/视频号/抖音未做（spec_lock channels 仅 email）。

## 关联

- [[2026-05-13-useful-memories-become-faulty]]（source）
- [[memory-as-moat]] / [[context-compression]]
- 同期对照：2026-05-15-tencent-agent-memory-token-61
