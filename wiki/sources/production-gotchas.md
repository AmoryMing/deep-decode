---
title: 内容生产踩坑录（40 条）
type: source
created: 2026-04-15
updated: 2026-04-15
tags: [踩坑, SVG, DOCX, 播客, 微信, 小红书, 工程经验]
---

# 内容生产踩坑录

来源：`raw/content-production-bundle/.claude/skills/deep-decode/references/gotchas.md`

40 条实战踩坑经验，按类别整理。每条都是花了时间才找到的根因和解法。

## SVG 渲染（#1-7）

- **中文字体顺序**：`font-family="PingFang SC, Inter, sans-serif"` 中文必须在前，否则 cairosvg 渲染中文为方框
- **特殊 Unicode**：`✕✓√☑` 全渲染为方框，用文字替代；`→` 安全
- **foreignObject**：cairosvg 不支持，不要用
- **scale=2**：SVG→PNG 转换必须双倍，否则公众号模糊
- **长文本换行**：必须手动用 `<tspan>` 换行，SVG 不自动折行

## DOCX 生成

- python-docx 的 `add_picture` 需要文件路径或 BytesIO，不接受 URL
- 表格 cell 内不能直接插图片，需要先获取 cell 的 paragraph 再 add_run

## 播客生产（#20-30）

- **时长公式**：中文朗读速度 ~300 字/分钟，10 分钟播客 = 2500-3000 字脚本（不是 6000+）
- **品牌 intro 性别**：必须匹配主播音色性别，否则违和
- **豆包 TTS v2 时间戳**：参数必须放 `request["request"]` 不是 `request["audio"]`，后者被静默忽略
- **双重 JSON**：豆包返回的 frontend 字段是 JSON 字符串，需要解析两次
- **字幕分句**：句号断句，逗号仅在超 25 字时断句，保证语义完整
- **多段拼接偏移**：每段 TTS 时间戳从 0 开始，全局偏移需计算 intro + 段间静音（200ms）+ 翻页音效（500ms）
- **替代 Whisper**：旧方案 Whisper 识别 + DeepSeek 纠错，误差 0.5-2 秒且专有名词乱码；新方案用豆包原生时间戳，精度 10ms

## 微信公众号（#31-36）

- **`<style>` 标签全剥离**：微信删除所有 `<style>` 和 class 属性，全部改内联 CSS
- **外链被拒**：errcode 45166，`<a>` 标签只保留文本内容
- **图片上传双 API**：`uploadimg`（内嵌图，无限额）vs `add_material`（封面，限 5000）
- **Token 有效期**：2 小时，提前 5 分钟刷新

## 小红书（#37-40）

- **图片数量上限 9 张**，不是 18
- **标题上限 20 字**，截断找标点自然断点
- **标签不能含空格**
- **3:4 比例**：2160x2880px，Playwright 视口 1080x1440 @2x

## 编辑政策（#18-19）

- **禁止贩卖焦虑**：标题和正文不使用恐吓性语言
- **AI 味检查清单**：搜索"篇""信源""分析者""发现""总结"，每处检查"这是在说观点还是在说过程"

## 使用建议

写作和分发前先扫一眼对应类别。特别是 SVG 字体顺序和微信内联 CSS 这两条，每次都会忘。
