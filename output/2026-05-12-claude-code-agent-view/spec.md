---
title: Claude Code v2.1.139：从单会话助手到任务调度台
type: decode-spec
created: 2026-05-12
updated: 2026-05-12
style: default
---

# Strategy Spec

- 输入模式：decode-url / release-decode
- 内容类型：decode
- 主判断：Claude Code v2.1.139 的核心不是小功能更新，而是把 AI coding 从单会话助手推向任务调度台。agent view 管横向并发，`/goal` 管纵向续航，两者合起来改变的不是按钮，而是人和 coding agent 的分工边界。
- 反判断 / 盲区：agent view 仍是 research preview，`/goal` 依赖模型判断完成条件，二者都不能等同于企业级自动化闭环；权限、安全、成本和结果合并仍需要人类决策。
- 目标读者：
  - primary：已经在团队里使用 Claude Code / Cursor 的 AI PM、架构师、CTO、技术负责人。
  - secondary：一线工程师、agent 工具链研究者。
- 一手素材：
  - GitHub release v2.1.139
  - Claude Code changelog 2.1.139
  - Claude Code agent view docs
  - Claude Code `/goal` docs
  - Claude Code agents / overview / hooks 相关官方资料
- 需要补证据：agent view 的后台 session、工作区隔离、状态管理；`/goal` 的 evaluator 机制、非交互运行、限制条件；release 中和 agent 化相关的配套改动。
- 产物清单：`spec.md`、`spec_lock.yaml`、`phase0_sources.json`、`phase1_strategy.md`、`phase2_evidence.json`、`draft_v1.md`、`article.md`、`polish_report.json`、`factcheck.json`、`run_log.md`。
- 风格红线：中文深拆；评论员不是翻译；判断必须有证据；不用 emoji；不用“我认为”“让我们”“值得注意的是”；不做视觉和 podcast。
