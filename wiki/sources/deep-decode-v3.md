---
title: Deep Decode v3 技能规范
type: source
created: 2026-04-15
updated: 2026-04-15
tags: [工作流, Claude Code Skill, 深度拆解, 内容生产]
---

# Deep Decode v3 技能规范

来源：`raw/content-production-bundle/.claude/skills/deep-decode/SKILL.md`

## 定位

Claude Code 技能，输入 AI 博客/推文 URL，产出四件套：
1. 知识节点（.md）
2. 概念可视化（SVG + PNG）
3. 排版 Word 文档（.docx）
4. 播客音频（.mp3 + .srt）

## 七个阶段

| 阶段 | 名称 | 核心动作 |
|------|------|---------|
| 0 | 获取 | WebFetch 原文 + 截图关键图表 |
| 1 | 拆解 | 结构性解读，提取论点/证据/判断 |
| 2 | 交叉验证 | 最少 3 个外部信源补充（tavily 搜索） |
| 3a | 写作+可视化 | 正文 + SVG 概念图，图文穿插 |
| 3b | 事实核查 | 调用 fact-checker 技能，强制质量门 |
| 4 | 打包 | MD→DOCX + SVG→PNG + 播客脚本→TTS |
| 5 | 日志 | 更新知识库索引和操作日志 |
| 6 | 分发 | 微信/小红书/邮件（可选） |

## 运行模式

| 模式 | 耗时 | 产出 |
|------|------|------|
| `--quick` | 15min | 仅 MD，跳过事实核查 |
| `--md-only` | 40min | MD + SVG + PNG |
| `--deep`（默认） | 55min | 四件套全产出 |
| `--podcast` | 70min | 四件套 + 单人播客 |
| `--podcast --dual` | 80min | 四件套 + 双人播客 |
| `--cc-source` | 按队列 | 批量 Claude Code 源码分析 |

## 七条铁律

1. **重构不翻译**：读完消化后用自己的判断重组
2. **观点密度 > 信息密度**：每段必须有判断，判断必须有证据
3. **敢造概念**：发现无名现象就命名，但不宣布"原创"
4. **三源交叉**：至少 3 个外部信源验证/补充核心论点
5. **说人话**：简明中文，读出来不像翻译
6. **证据驱动**：不用"我认为"，用"数据表明""代码显示"
7. **图文一体**：概念图嵌入正文，不堆在末尾

## `--cc-source` 队列机制

批量处理 Claude Code 源码分析时：
- 每篇有独立检查点文件，记录当前阶段
- 严格顺序执行，不跳阶段
- 支持中断后从检查点恢复

## 与当前 content-factory 的关系

content-factory 的 `templates/decode.md` 是 deep-decode v3 SKILL.md 的精简版——保留了写作规范和产出物定义，但去掉了自动化管线（TTS、分发、队列）。两者核心写作理念一致，factory 版更侧重人工审核。
