---
title: 生成式视觉识别系统：不只是存几条 prompt
type: source
format: developer_diary
created: 2026-05-23
updated: 2026-05-23
tags: [developer-diary, generative-visual-identity-system, character-bible, controlled-vocabulary, prompt-engineering, xiaohongshu]
related:
  - [[generative-ui]]
  - [[html-artifact]]
  - [[visual-pipeline]]
---

# 生成式视觉识别系统：不只是存几条 prompt

今天做小红书个人品牌资产时，一个看起来像“UI 库”的文件，其实同时踩进了四个行业的术语系统。

它表面上是 `prompt-atoms.yaml`：Romi 的外观、面具、眼睛、斗篷、配色、mood、禁用项。实际做的不是“存 prompt”，而是把一个虚拟人格在不同语境下的视觉呈现标准化，让多次 AI 生成保持品牌一致性。

最准确的单一术语可以叫：

**Generative Visual Identity System**，生成式视觉识别系统。

更工业一点的说法是：

**Character Bible + Mood Taxonomy for Generative Media**，面向生成式媒体的角色圣经与情绪分类系统。

## 为什么不是 changelog

changelog 会写：

- 新增 `styles/_shared/visual/prompt-atoms.yaml`
- 新增 Romi 美术资源包
- 新增 mood 词库
- 新增小红书 HTML 卡片原型脚本

developer diary 要写的是另一件事：

**把 developer diary 和 changelog 分开，本身就是内容生产系统升级。**

因为具体改动只能证明今天做了事；抽象实践才能变成下一篇内容、下一套方法、下一个产品化判断。对外传播时，读者不关心我改了哪个文件，读者关心的是：为什么一个 AI 内容创作者需要像游戏公司一样维护角色圣经，像品牌公司一样维护视觉识别系统，像图书情报系统一样维护受控词表。

## 四个行业同时出现

### 1. 动画、影视、游戏

这里最接近的是 **Character Bible / Style Bible**。

Romi 的名字、外观、面具、异瞳、斗篷、宠物态和禁区，组成了角色设计的权威文档。它定义的不是一张图，而是这个角色在多次生产中的一致性。

`model sheet`、`turnaround`、`style guide` 是相邻概念。后续要补齐的人形三视图、宠物态三视图、表情、动作、局部 callout，都属于这一套工业方法。

### 2. 品牌与设计

整体最贴近 **Visual Identity System**。

品牌手册做的也是这件事：角色规范、配色、应用场景、禁用项。`palette` 是 design tokens；`atoms` 借用了 Atomic Design 的最小单元思想。

区别在于，传统 VIS 面向人类设计师和固定媒介；这里的 VIS 面向生成模型和自动化内容管线。

### 3. 知识工程与图书情报学

`prompt-atoms.yaml` 本质上是 **Controlled Vocabulary**。

“白发”“银发”“long silver hair”不能每次随口换说法，否则生成会漂。受控词表的价值，就是把同义词收敛成稳定术语。

`moods` 是 taxonomy / ontology：每个 mood 有名字、有 `use_when`、有适用场景和禁区。YAML 结构本身就是 schema。

### 4. AI 与 Prompt Engineering

这又是一个 **Prompt Atom Library**。

`negative_atoms` 是 Stable Diffusion 以来的负向提示传统。`core_atoms + mood atoms + negative_atoms` 是 compositional prompting。再往技术上看，这份 YAML 已经是一个很薄的 DSL：为视觉生成设计的领域特定语言。

## 核心 insight

这个文件之所以看着像 UI 库，是因为它和 UI 库共享同一个底层心智模型：

**用最小可复用单元 + 组合规则，实现跨场景一致性。**

设计系统、品牌手册、prompt 库、character bible，本质都是同一个抽象的不同实例。Atomic Design 是前端组件世界里的说法；动画行业更早用 `model sheet + style guide` 做过几十年。现在生成式 AI 把这些方法重新拉到同一个工作台上。

真正发生的事是：

**把品牌设计的方法论（VIS）、动画产业的方法论（Character Bible）、知识工程的方法论（Controlled Vocabulary）三者合流，适配到生成式 AI 的现实。**

大部分 AI 内容创作者停留在“存几条 prompt 模板”。这套做法往前走了一步：它把 prompt 变成一套品牌安全的生成式管线。

## 对小红书内容的价值

这可以成为一类新的小红书内容：不是“我今天做了什么工具”，而是“我如何把 AI 内容工作流产品化”。

可转成的标题方向：

- 我给自己的 AI 账号做了一套角色圣经
- 为什么 AI 创作者不该只存 prompt
- 让 AI 生图不跑偏：我用了游戏行业的方法
- 小红书封面变稳定，靠的不是审美，是受控词表
- prompt 模板不够用，你需要的是生成式视觉识别系统

## 以后继续追踪的问题

- Romi 的 Character Bible 是否足够稳定，能不能跨 20 次生成保持识别度？
- Mood taxonomy 是否会变成真正的内容分类器，而不是审美标签？
- HTML 模板里的 design tokens 能否直接读取同一套 YAML？
- 参考图入库应该保存原图、摘要图，还是只保存可借鉴原子？
- 这套系统能不能反过来生成一篇“开发者日记型”小红书笔记？
