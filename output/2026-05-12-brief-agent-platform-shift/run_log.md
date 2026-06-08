## 2026-05-12 | brief-agent-platform-shift

### 决策链

| # | 决策点 | 选项 | 选择 | 依据 |
|---|---|---|---|---|
| 1 | 输入路由 | decode-url / brief | brief | 用户一次给 3 条短动态，三条共享同一平台竞争信号 |
| 2 | 主编判断 | 分开三篇 / 合成日报 | 合成日报 | Claude Code、Anthropic 金融仓库、OpenAI Developers plugin 都在讲 agent 工作入口 |
| 3 | 产物范围 | md-only / full | md-only + QA | brief 模板不要求视觉/播客；仍补 phase0_sources、polish_report、factcheck |

### 产出

- article.md
- phase0_sources.json
- polish_report.json
- factcheck.json
