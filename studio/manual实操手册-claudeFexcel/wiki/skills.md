---
title: Skills 技能系统
sources:
  - Anthropic 官方文档 — Skills
  - Claude for Excel 帮助中心
links_to:
  - "[[Excel核心功能]]"
  - "[[PowerPoint核心功能]]"
  - "[[连接器MCP]]"
linked_from:
  - "[[产品全景]]"
  - "[[场景化Prompt大全]]"
last_updated: 2026-04-10
---

# Skills 技能系统

## Skills 是什么

Skills（技能）是 Claude 的能力扩展包。每个 Skill 给 Claude 注入一套专业知识和工作流程，让它在特定场景下表现更好。你可以把它理解成"给 Claude 装上专业插件"。

所有付费计划（Pro / Max / Team / Enterprise）都可以使用 Skills，但需要先启用代码执行功能。

## 启用步骤

1. 进入 **Settings > Capabilities** → 打开 **"Code execution and file creation"**（代码执行和文件创建）
2. 进入 **Customize > Skills** → 用开关启用/禁用各个技能

第一步是前提条件，不开代码执行，Skills 功能整体不可用。

## 内置技能

以下技能是系统自带的，满足条件后自动触发，不需要手动调用：

| 技能 | 作用 |
|------|------|
| Excel 增强 | 增强 Excel 表格的创建和操作能力 |
| Word 文档 | 专业 Word 文档创建 |
| PowerPoint | 演示文稿生成 |
| PDF 处理 | PDF 创建和处理 |

## 自定义技能

你可以创建自己的 Skill，把特定的工作流程封装起来复用：

1. **创建技能文件** — 核心是一个 `Skill.md` 文件，定义技能的指令和行为
2. **打包为 ZIP** — 文件夹名必须和技能名一致，把整个文件夹压缩成 ZIP
3. **上传** — 进入 **Customize > Skills** → 点 **"+"** → **"Create skill"** → **"Upload a skill"**
4. **上传 ZIP 文件**，完成

## 分享技能（Team / Enterprise）

团队版和企业版支持技能分享：

- **分享给特定人** — 输入对方姓名或邮箱，定向分享
- **发布到组织** — 全组织成员都能发现和使用
- 共享的技能是**只读**的，接收方不能修改，但会自动接收创建者的更新

## 在 Excel / PPT 中使用

- 已启用的 Skills 在加载项中**自动可用**，不需要额外配置
- 在聊天框输入 **"/"** 可以查看当前可用的 Skills 列表
- Claude 会根据你的请求内容**自动判断**该用哪个技能，输出也会自动适配当前应用（Excel 里就输出表格，PPT 里就输出幻灯片）

## 故障排除

| 问题 | 解决方法 |
|------|----------|
| 看不到 Skills 选项 | 检查 **Settings > Capabilities** 是否启用了代码执行 |
| Claude 不使用技能 | 检查技能是否已启用；技能描述是否清晰；指令结构是否合理 |
| 上传技能报错 | 检查 ZIP 大小限制；确认文件夹名 = 技能名；确认包含 `Skill.md` 文件 |
| 技能选项灰显不可点 | 检查代码执行是否开启；联系组织管理员确认权限 |

## 安全提醒

自定义技能本质上是给 Claude 注入指令，来源不可信的技能可能包含恶意指令。建议：

- **安装前审查技能内容** — 打开 ZIP 看看 `Skill.md` 里写了什么
- **只安装可信来源的技能** — 组织内部分享的、官方推荐的优先

> 相关页面：[[Excel核心功能]]、[[PowerPoint核心功能]]、[[连接器MCP]]
