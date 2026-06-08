---
title: GBrain 没有 8 层——它只改了记忆该长什么样（复盘）
type: published
created: 2026-05-18
updated: 2026-05-18
tags: [Agent记忆, 个人AI, 知识系统, RAG, GBrain, Garry-Tan]
---

# 复盘：[[2026-05-18-gbrain-personal-ai-memory]]

## 主判断

GBrain 真正的突破不在"8 层架构"或"自我进化"，而在一个被忽视的数据模型决策——把"真相会变"（compiled truth）和"时间"（timeline）写进记忆结构；但旗舰能力在实现层是 markdown 指令脚手架而非引擎，叙事跑在了代码前面。

## 角度选择

AIHOT 给的框架是"8 层捅破天花板"。一手核查（README + GitHub 评测）发现原项目是**三层**，"8 层"是中文二次概括把检索流水线步骤数成层。决定不顺着错误前提写，而是先拆框架错位，再指出真正可抄的是数据模型。这是本篇最关键的角度判断——避免在错误前提上建全文。

## 证据链

- 三层 vs 八层：github README + vectorize-review + 二次搜索交叉确认
- compiled truth + timeline：README/SKILLPACK 一手
- RAG 三宗罪：arxiv 记忆综述 + medium beyond-rag
- +31.4 P@5：vectorize BrainBench 评测
- 三旗舰功能无可执行代码 + 12 并发 bug：dev.to 独立代码审查（与 vectorize review 交叉一致）
- X 原帖 402 付费墙未取，5 家转述交叉，文中注明转引

## 流水线记录

- 字数：article body ~3000 字，全文（含关键词+引用）16.7K 字符
- polish：structural 4 grep atom **首轮全 PASS（0 hits）**；prose 1 轮改 2 段（去重 + 全角逗号修复）。无补丁、无第二轮
- factcheck：11 条，10 PASS + 1 MINOR_VARIANCE（发布日期 04-10 vs 04-05，取多数口径），0 unresolved
- 视觉：5 SVG + 5 PNG（cairosvg scale=2）。踩坑：standalone `→` 在 cairosvg+PingFang SC 下渲染成方框（与 gotchas 说"→ 安全"矛盾），改用 `<line>+<path>` 画箭头，已 Read PNG 自验证
- 播客：10.33 min，19 段。**VoxCPM2 内网（10.12.16.11:49002）curl exit 28 不可达**（VPN/网络，同 2026-05-18 批次其他自动选题），降级 edge-tts（zh-CN-XiaoxiaoNeural +8%），loudnorm -16.5 dBFS。脚本口语二次表达非逐字

## 自检

- 每段判断+证据：通过
- 本期关键词完整段落：通过（10 个，每个整段）
- 播客非逐字朗读：通过（3 承诺框架重构）

## 待改进 / 留尾

- VoxCPM2 恢复后可重生高质量播客（同 gowers / 2026-05-18 批次）
- gotchas 第 27 条只记 qlmanage 方框，应补充：standalone `→` 在 cairosvg 也渲染方框，箭头一律用 `<line>+<path>` 画
- 发布日期信源轻微出入已在 factcheck.json 记录，不影响主判断

## 分发

- 邮件：草稿（未发，等用户审）
- 其余渠道：本次仅做邮件草稿（spec_lock channels=[email]）
