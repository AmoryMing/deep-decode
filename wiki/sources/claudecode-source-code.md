---
title: Claude Code 完整源码（v2.1.88 泄露版）
type: source
created: 2026-04-16
updated: 2026-04-16
tags: [Claude Code, 源码, Anthropic, 一级信源]
---

# Claude Code 完整源码

来源：`raw/claudecodesources/raw_code/claude-code/`

## 规模

- **1856 个 TypeScript 源文件**
- 完整 git 仓库（含历史）
- 版本：v2.1.88（2026-03-31 泄露）

## 目录结构（按文件数排序）

| 目录 | 文件数 | 职责 |
|------|--------|------|
| utils/ | 554 | 工具函数库 |
| components/ | 388 | **UI 组件（UX 核心）** |
| tools/ | 182 | 内置工具（Bash/Read/Write/Grep 等） |
| commands/ | 175 | 用户命令（/help /clear /compact 等） |
| services/ | 130 | 后台服务 |
| hooks/ | 104 | 生命周期钩子 |
| ink/ | 96 | **终端渲染引擎（Ink/React）** |
| bridge/ | 31 | 远程连接 |
| skills/ | 20 | 技能系统 |
| screens/ | ? | **屏幕/页面（UX 核心）** |
| outputStyles/ | ? | **输出样式（UX 核心）** |
| vim/ | 7 | Vim 模态编辑 |
| buddy/ | 6 | 电子宠物 |
| voice/ | ? | 语音输入 |
| keybindings/ | 14 | 快捷键 |
| query/ | ? | QueryEngine 核心 |

## 附带信息源

`raw/claudecodesources/information_sources/` 包含：
- 2 篇中文深度分析文章
- `claude-source-leaked-main/` 开源分析仓库：architecture/ + analysis/ + comparison/ + practical/ + 部分源码摘录

## UX 相关核心文件（深度拆解用）

写 Claude Code UX 拆解时，必须逐行读以下目录：
- `src/components/` -- 388 个 UI 组件文件
- `src/ink/` -- 96 个终端渲染引擎文件
- `src/screens/` -- 屏幕/页面组件
- `src/outputStyles/` -- 输出格式和样式
- `src/vim/` -- Vim 模态交互
- `src/keybindings/` -- 快捷键映射
- `src/buddy/` -- 电子宠物系统
- `src/hooks/` -- 交互钩子

## 写作铁律

**所有 Claude Code 源码系列文章必须对源码逐行拆解**——不是从二手分析文章写，是从 .ts/.tsx 文件里找证据。二手分析只用于交叉验证和补充视角。
