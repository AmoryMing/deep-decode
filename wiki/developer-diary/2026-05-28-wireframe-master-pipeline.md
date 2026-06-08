---
title: 从“模板好不好看”到“母版如何被选择”
type: source
format: developer_diary
created: 2026-05-28
updated: 2026-05-28
tags: [developer-diary, xiaohongshu, html-template, wireframe-master, content-pipeline]
related:
  - [[2026-05-23-generative-visual-identity-system]]
---

# 从“模板好不好看”到“母版如何被选择”

今天小红书图卡流程暴露了一个关键问题：单张模板不好看，往往不是 CSS 不够细，而是上游没有把内容分型。

同一篇文章里至少有七种页面任务：

- 封面负责停留率；
- 数字段负责规模感；
- 解释段负责连续阅读；
- 流程段负责动作链；
- 对比段负责冲突和转折；
- 从业者段负责行动菜单；
- 关键词段负责收藏和复习。

如果这些内容都被塞进同一个“正文卡模板”，结果必然像把 Markdown 贴在漂亮背景上。它可读，但没有海报式排版，也没有内容节奏。

## 关键转向

真正要做的不是“设计一个万能模板”，而是建立一套类似 PPT master 的母版系统：

```text
article.md block
→ semantic block type
→ wireframe master
→ art slot fill
→ HTML render
→ PNG QA
```

这里的 `wireframe master` 不是低级草图，而是内容生产里的版式本体。它规定：

- 这一页为什么存在；
- 读者第一眼应该看哪里；
- 正文是否需要连续读；
- 美术资产承担氛围、角色还是解释功能；
- 这一页是否适合收藏、转发或停留。

## 和 PPT master 的相似点

PPT master 解决的是跨页一致性：同一个品牌、同一组字体、同一套页码和组件，在不同页面任务中稳定复用。

小红书图卡母版解决的是跨文章一致性：每篇文章都能根据内容结构选择相同的几类母版，同时让 Romi、纹理、玻璃碎片、页码、水印保持统一。

二者的区别在于，PPT master 通常由人来选；这里可以由 `semantic_paginator.py + master_selector.py` 自动选。

## 为什么这比直接做最终视觉更稳

先做最终视觉容易把注意力放在单张图是否漂亮。但内容生产管线需要的是批量稳定：

- 不能每篇都靠手工排；
- 不能让 imggen 生成长中文正文；
- 不能为了美观删改 article；
- 不能让封面和 card_01 重复；
- 不能每次换一种审美。

母版系统的价值是先锁住信息结构，再让美术层填槽位。这样“Romi 半身”“日间纸张纹理”“holographic UI fragments”都是可替换资产，而不是每次重写页面逻辑。

## 可以变成内容的标题方向

- 为什么 AI 图文不是生图问题，而是母版选择问题
- 我把小红书图卡做成了 PPT master
- 生成式内容工作流里，wireframe 比 prompt 更重要
- 一篇文章如何自动变成 9 张小红书卡片
- 让 AI 设计稳定的办法：先做版式本体

