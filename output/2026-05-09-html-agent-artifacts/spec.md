---
title: Markdown 退回草稿层：HTML 成为 Agent 的工作界面
type: project-spec
created: 2026-05-09
updated: 2026-05-09
slug: 2026-05-09-html-agent-artifacts
content_type: decode
input_mode: decode-url
status: confirmed
---

# Strategy Spec: Markdown 退回草稿层

## 1. 主判断

这不是 HTML 对 Markdown 的格式胜利，而是 Agent 输出从“人类手改的文本”转向“人类参与的工作界面”。

Thariq 的关键洞察不在“HTML 更好看”，而在用户行为变了：人类越来越少直接编辑 Agent 生成的文件，更多是在读、评审、调整参数、把结果再喂回 Agent。Markdown 的最大优势是人类易编辑；当编辑动作迁移给 Agent 后，这个优势会缩水。HTML 的价值则在另一边放大：它能承载表格、CSS、SVG、代码高亮、交互控件、canvas、绝对定位、移动端适配和静态链接分享。

## 2. 反判断 / 盲区

HTML 不会替代 Markdown 成为所有长期知识和工程文档的源格式。它生成更慢，token 更贵，diff 噪声更大，版本控制更难审。企业里真正稳的形态，很可能不是“HTML 取代 Markdown”，而是“结构化源文件负责可追溯，HTML artifact 负责阅读、协作和操作”。

## 3. 目标读者

- primary: 重度使用 Claude Code / Codex / Cursor 的 AI 工程师、产品经理、架构师
- secondary: 正在设计企业内部 Agent 工作流、PR 说明、设计 spec、研究报告的人
- 读者读完应该改变的判断：不要再把 Agent 输出格式理解成“文档格式选择”，而要理解成“协作界面设计”。

## 4. 一手素材

| 素材 | 路径 / URL | 是否已读全文 | 用途 |
|---|---|---:|---|
| Berryxia 中文转述长推 | https://x.com/berryxia/status/2052884681193144743 | 是 | 中文语境入口，提炼传播框架 |
| Thariq X Article | https://x.com/trq212/status/2052809885763747935 | 是 | 主原文，判断必须回到这里 |
| HTML examples | https://thariqs.github.io/html-effectiveness | 待补读 | 验证“HTML artifact”实际长什么样 |

## 5. 证据缺口

- 补读 Thariq 的 examples 页面，挑 3-5 个具体 artifact 做证据，不只引用抽象观点。
- 交叉验证 Claude Code 团队内部是否已有类似 HTML artifact 使用趋势。
- 找一个反面信号：Markdown 在工程仓库、版本控制、知识库中的不可替代性。
- 对照本内容工厂刚引入的 `spec_lock.yaml`，说明“结构化源 + HTML/图文界面”不是矛盾。

## 6. 内容结构

1. 钩子：Markdown 没死，但它正在退回“源文件层”；Agent 真正需要的是可操作界面。
2. 第一段论证：Thariq 为什么说 Markdown 限制 Agent 表达能力。
3. 第二段论证：HTML 的核心优势不是美观，是信息密度、分享、交互、上下文摄入后的可视化。
4. 第三段论证：这件事反映的是人机协作方式变化——人类从编辑者变成审阅者、调参者、决策者。
5. 盲区：HTML 的 diff、成本、可维护性问题，决定它更像 artifact，不像 canonical source。
6. 对从业者意味着什么：以后写 Agent 任务，不只要写“输出 markdown”，而要明确 artifact 的阅读者、操作、导出和回流路径。
7. 关键词：HTML artifact、source of truth、human-in-the-loop UI、spec lock、rendered interface。

## 7. 产物清单

- article.md
- assets/svg/00_系列封面.svg + PNG
- assets/svg/01_format_shift.svg + PNG
- assets/svg/02_source_vs_artifact.svg + PNG
- assets/svg/03_human_loop.svg + PNG
- assets/svg/04_enterprise_pattern.svg + PNG
- podcast_script.txt
- podcast.mp3
- polish_report.json
- factcheck.json
- 渠道草稿：email preview / xiaohongshu assets / wechat draft only

## 8. 风格红线

- 不写成“HTML 彻底取代 Markdown”。
- 不把 Berryxia 的中文总结当成唯一信源。
- 不做工具教程，写成输出格式背后的人机协作范式变化。
- 不从 wiki 摘要写正文。
- 不用“我认为”。
- 英文引用必须翻译。
- 禁止 emoji、"让我们"、"值得注意的是"。

## 9. 确认

确认后进入连续执行：证据 → 正文 → 视觉 → 播客 → QA → 草稿分发。
