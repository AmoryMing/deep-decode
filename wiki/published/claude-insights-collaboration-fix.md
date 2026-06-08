---
title: 七成对话在跑偏——我用 Claude Code Insights 报告修好了人机协作
type: published
status: published
created: 2026-03-29
updated: 2026-04-25
tags: [Claude Code, CLAUDE.md, Hooks, 人机协作, Insights, 实操]
mode: practice
---

# 七成对话在跑偏

## 摘要

实操手册 mode（不是 decode）：作者亲历的人机协作问题诊断 + 修复全过程。

钩子用第一人称数据告白：「一个月，111 次对话，499 小时。其中 79 次 AI 跑偏了方向，55 次 AI 理解错了意图。」第 10 种钩子方式：第一人称使用数据 + 反差揭示。

核心论点：**问题不在 AI 能力，在人和 AI 说话的方式不匹配**。

诊断工具：Claude Code 内置 `/insights` 命令——扫描过去所有对话记录，生成 HTML 报告，含交互画像、摩擦点统计、改进建议、可粘贴配置代码。

诊断发现：
- AI 系统性"过度工程化"倾向——模糊需求 → 最完整最复杂方案
- 抽象层级不匹配——PM 说"帮我看看 X"重心在"看看"，AI 把重心放在 X
- LLM 训练目标决定的——"尽可能完整回答"≠"用最小成本验证方向"
- 感知偏差：感觉 AI 帮了大忙，数据说 71% 对话需要纠正（与 METR 研究吻合：经验工程师用 AI 实际慢 19% 但自己感觉快 20%）

三层修复：
1. **CLAUDE.md 加沟通规则**：把"先小步验证"显式写进 system prompt
2. **加 Hook 自动化**：UserPromptSubmit hook 在每次提示前注入"先确认理解再行动"
3. **调行为**：人改自己说话方式（明确边界 / 给抽象层级提示）

## 写作特点

- **第 10 种钩子方式：第一人称使用数据 + 反差揭示**：「111 次对话 / 499 小时 / 79 次跑偏 / 55 次理解错」——纯用户私域数据，比公开 benchmark 更有可信度。"反差揭示"指 71% 需纠正 vs 感觉 AI 帮了大忙
- **practice mode**：与 decode 不同——不拆解外部源，写自己的实操经验。结构是 **症状 → 工具 → 诊断 → 解法（三层）→ 一周后效果**。这是企媒 practice 类的标准骨架
- **METR 研究做交叉验证**：把私域数据（71% 跑偏）和公开研究（METR 慢 19% / 感觉快 20%）配对——证明这不是个案，是普遍规律
- **AI bug 不是 bug 是训练目标**：「这不是 AI 的 bug，是 LLM 的训练目标决定的」——把现象归因到机制层级，不停留在抱怨
- **抽象层级不匹配**：把"重心在动词还是名词"作为分析框架。「'帮我看看回答质量'重心在'看看'不在'回答质量'」——这种细颗粒度的语言学分析是 practice 类的密度来源

## 关联概念

- [[abstract-level-mismatch]] —— 抽象层级不匹配（待补独立 concept）
- [[overengineering-bias]] —— AI 过度工程化倾向（待补）
- [[claude-code-insights]] —— /insights 命令实体（待补）
- [[memory-system]] —— CLAUDE.md 是 Claude Code memory 系统的人机契约层
- [[harness-engineering]] —— Hook 自动化是 harness 的延伸

## 关联选题

- [[managed-agents-architecture]] —— Anthropic 同期 agent 产品化
- [[your-harness-your-memory]] —— Hook 自动化是用户侧的 harness
- [[context-constitution]] —— Letta 同方向产品哲学

## 复盘备注

- **practice mode 是独立类别**：不是拆解，不是研究，是亲历经验。骨架更短直（症状→工具→诊断→解法→效果），不需要 7 段思考骨架（playbook A.3.1）和 8 章模板（B.1）那么完整。值得在 playbook B.2 mode 表里补充
- **第 10 种钩子方式：私域数据告白**。第一人称数据带"我做了什么得到什么"的真实感，比第三方数据更打动有相同处境的读者
- **公开研究做交叉验证**：私域数据 + 公开研究配对（METR）——这是 practice mode 的可信度技法
- **细颗粒度语言学分析**：「'帮我看看 X' 的重心在动词」是 practice 类区别于普通"Claude Code 教程"的密度差。值得记入 playbook
