---
title: Vault 消化队列
type: queue
created: 2026-04-25
updated: 2026-04-25
---

# Vault 消化队列

> raw/vault/ 共 1116 个文件。过滤 node_modules 和构建产物后，按"decode/article 包"为单位逐个消化。每包产出 wiki/published/ 复盘页 + 关联 wiki/concepts/。

## 已存在 wiki/published 的（跳过或仅校验）

- [x] 2026-03-29-levie-capability-overhang → capability-overhang.md
- [x] 2026-03-29-pm-ai-exponential → pm-ai-exponential.md
- [x] 2026-03-31-boris-claude-code-tips → boris-claude-code-tips.md
- [x] 2026-04-09-managed-agents-architecture → managed-agents-architecture.md
- [?] 2026-04-13-tedx-fractal-minds → claude-code-addiction.md (待校验)
- [?] 2026-04-03-* (8 个 claudecode 系列) → ux-ink-engine.md / buddy-pet.md (待校验，wiki/topics/ 已有 30+ 条)
- [x] 2026-04-20-ux-spinner-animation → 2026-04-20-ux-spinner-animation.md (但日期可能匹配 2026-04-16 ux 系列)

## 待消化（按时间倒序，最新优先）

### A. 主 decode pipeline（13 个）

1. [x] 2026-04-24-ai-design-replaces-designer → wiki/published/ai-design-three-layer.md（2026-04-25 完成）
2. [x] 2026-04-24-codex-5.5-roundup → wiki/published/codex-5-5-roundup.md（2026-04-25 完成 + playbook v1）
3. [x] 2026-04-22-entity-claude-design → wiki/sources/horizontal-vertical-analysis.md（未成稿 bundle，发现实体拆解骨架，写入 playbook A.3.2）
4. [x] 2026-04-21-hefan-ai-tide → wiki/published/hefan-ai-tide.md + concepts/tide-vs-waves.md
5. [x] 2026-04-20-prfaas-prefill-as-a-service → wiki/published/prfaas... + concepts/phase-geographic-decoupling.md（paper-decode mode）
6. [x] 2026-04-17-claude-opus-4-7 → wiki/published/claude-opus-4-7.md + concepts/model-tiering.md
7. [x] 2026-04-17-letta-context-constitution → wiki/published/letta-context-constitution.md + concepts/context-constitution.md
8. [x] 2026-04-17-your-harness-your-memory → wiki/published/your-harness... + concepts/memory-as-moat.md
9. [x] 2026-04-12-mythos-reckless-helpfulness → wiki/published/... + concepts/reckless-helpfulness.md

### B. hot-history（2 个）

10. [x] 2026-04-21-memex-llm-wiki → wiki/published/memex-llm-wiki.md + wiki/sources/polish-7steps.md（hot-history mode + 7 步润色标尺写入 playbook A.7b）
11. [x] 2026-04-21-skills-frames → wiki/published/skills-frames.md（hot-history mode 升 ✅，B.2.1 子模式骨架写入 playbook）

### C. practice（1 个）

12. [x] 2026-03-29-claude-insights-collaboration-fix → wiki/published/claude-insights-collaboration-fix.md（practice mode，第 10 种钩子）

### A.补 已完成

- [x] 2026-04-13-tedx-fractal-minds → wiki/published/tedx-fractal-minds.md（talk-decode mode，第 7 种钩子）

### D. claudecode_deep_decode（8 个全部完成 ✅，source-code-decode mode）

13. [x] 2026-04-03-agent-loop-single-thread → wiki/published/agent-loop-single-thread.md
14. [x] 2026-04-03-claude-code-leak-panorama → wiki/published/claude-code-leak-panorama.md
15. [x] 2026-04-03-harness-greater-than-model → wiki/published/harness-greater-than-model.md
16. [x] 2026-04-03-kairos-daemon → wiki/published/kairos-daemon.md
17. [x] 2026-04-03-queryengine-brain → wiki/published/queryengine-brain.md
18. [x] 2026-04-03-speculation-prefetch → wiki/published/speculation-prefetch.md
19. [x] 2026-04-03-two-leaks-evolution → wiki/published/two-leaks-evolution.md
20. [x] 2026-04-03-undercover-mode → wiki/published/undercover-mode.md

钩子方式累积：8 篇 8 种新方式（#11-#18）：连环排除/数学题反问/反讽事件重演/代码片段反差/极端数字对比/跨界历史类比/源码注释当锚/内部vs公开对比。

### E. 长篇 manual（1 个 ✅）

21. [x] manual实操手册-claudeFexcel → wiki/sources/manual-claude-for-excel.md（manual mode 写入 playbook B.2）

## 跳过策略

- **方法论/知识/反馈类**（methodology/, knowledge/, context/, feedback/）：与项目根 `style/` 高度重合，不进 wiki/sources/。如发现 style/ 缺失内容，单独反馈。
- **pipeline_tools/, scripts/**：代码工具，非内容。跳过。
- **小红书参考/**：分发参考素材，不进 wiki。
- **media_pipeline媒体流水线/**：另一个项目的产物，跳过。
- **node_modules/, .DS_Store, .png/.svg/.docx**：构建产物/二进制，跳过。
