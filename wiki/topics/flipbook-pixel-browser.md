---
title: flipbook.page —— 像素流浏览器
type: topic
created: 2026-04-27
updated: 2026-04-27
tags: [生成式UI, AI浏览器, LTX, Modal, 视频扩散模型]
---

## 选题角度

flipbook.page 不是 Gamma/Tome 类的 AI 演示工具，而是一个把"浏览器渲染层"整个换成视频扩散模型的实验。每个像素都从模型实时流式生成 —— 没有 HTML、没有 DOM、没有 CSS，文字也是模型画出来的像素。点击坐标喂回模型生成下一帧。

中文圈普遍把它当成另一个 AI 创作工具理解，错位严重。这篇拆解的核心命题是：**生成式 UI 作为计算原语**。HTML/CSS/JS 这条三十年的管线第一次出现"被取代"的可信原型。

## 论点

1. **品类拆错位**：Gamma/Tome 是 AI 填模板（HTML 没动），flipbook 是 AI 取代渲染层
2. **像素即一切的代价**：无 SEO、无可访问性、无复制粘贴、幻觉极隐蔽（Roon 用户 Dadoo 已警告）
3. **技术栈**：LTX Studio DiT 视频模型 + Modal Labs serverless GPU + WebSocket 1080p/24fps（不是 SDXL 类图像模型，必须是视频模型才能保证连续帧一致 + 点击响应延迟）
4. **创始人在赌的不是产品，是命题**：Shah 推文 4/5 明说 — 当模型更准更有状态，连"应该用结构化 UI 的编码工具"都可能改成像素流
5. **对从业者意味着什么**：短期玩具 / 中期吃掉低 IA 信息浏览（百科、说明、教育） / 长期 HTML 不死但"应用 UI 必须由人类工程师设计"这个假设松动；金融/医疗/审计追溯永远不会被替换

## 一手素材

- [[zain-shah-launch-thread]] —— 5 条发布推文（manifesto）
- [[zain-shah-houseofcards-thread]] —— 4/26 自承"house of cards"
- [[eddiejiao-iteration-thread]] —— hundreds of iterations
- [[roon-dadoo-critique]] —— 用户批评：幻觉极隐蔽

## 关联概念

- [[zain-shah]] —— 创始人
- [[ltx-studio]] —— 底层模型
- [[generative-ui]] —— 命题
- [[modal-labs]] —— 算力赞助方

## 可对标的标杆

[[2026-04-09-managed-agents-architecture]] —— 同样是"重命名现象 + 拆架构 + 落到从业者视角"的结构
