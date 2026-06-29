---
title: Claude Tag —— Anthropic 把 AI 装进 Slack，并给它发了一个独立工号
type: source
created: 2026-06-28
updated: 2026-06-28
tags: [Anthropic, ClaudeTag, 智能体身份, agent-identity, Slack, 企业AI, ambient-mode, 权限治理]
---

## 核心论点

Claude Tag（2026-06-23 发布）表面是"在 Slack 里 @Claude 让它干活"，真正的产品突破是**智能体身份（agent identity）**：Claude 不再挂在某个用户名下，而是有自己独立的身份、权限、工具访问和按频道隔离的记忆，由管理员配置。Anthropic 自己的话最直白——把"这个用户能干什么？"换成了"这个智能体在这个隔间里能干什么？"。这一步把 AI 从工具升格成组织里的"非人账号/同事"，企业的权限、审计、成本治理逻辑被迫重写。

## 关键事实（带出处）

- 2026-06-23 发布，面向 Claude Enterprise / Team 客户 beta；替代旧的 Claude in Slack 应用，30 天内迁移；跑在 Opus 4.8 上。[Anthropic 官方]
- 一个频道里只有一个 Claude，所有人共用，谁都能看它干活、接力推进。[官方]
- 智能体身份：独立于个人账号，管理员设工作区级默认 + 频道级调整；记忆按频道隔离（销售 Claude 拿不到工程数据）。[Help Net Security / 官方]
- 因为以自己身份行动，操作进所连服务的审计日志；所有任务/记忆更新/网络请求都记录；停用身份即一键撤权。[Help Net Security]
- ambient（主动）模式：持续跟随频道与工具，主动提示、跟进没解决的线程。[官方 / TechCrunch]
- 管理员可设月度 token 上限（组织级 + 频道级），看含发起人的活动日志。[官方]
- Anthropic 产品团队 65% 的代码由内部版 Claude Tag 产出（自报，无第三方核验）。[官方]
- 竞争背景：微软、Glean、Snowflake、Databricks 同搭"组织上下文层"；Ramp 2026-05 AI Index，Anthropic 企业采用 34.4% 对 OpenAI 32.3%。[TechCrunch / Fortune]

## 金句（英文附译）

- Noah Zweben（Anthropic Claude Code 团队）："Agent identity replaces the question 'what can this user do?' with 'what can this agent do in this compartment?'" —— 智能体身份把"这个用户能干什么"换成了"这个智能体在这个隔间里能干什么"。
- Cat Wu（Head of Product, Claude Code & Cowork）："Claude Code, Cowork, and chat are very single-player, whereas Claude Tag is built to be interactive and multiplayer." —— Claude Code、Cowork、聊天都很"单机"，Claude Tag 一开始就是为多人在线而造。
- 官方："working with a real colleague — one that can produce work in public view." —— 像和一个真同事共事，一个能在所有人眼前产出工作的同事。

## 可写角度

1. **身份是真主角**（首选）：从"@一下"切入，落到 agent identity，讲企业为什么要把 AI 当一类新账号治理。
2. 多人协作（multiplayer）：AI 从私聊黑盒变成频道公开物，输入即公共上下文。
3. ambient 模式的双刃：主动有用，也意味着一个永远在监听全频道的账号。
4. 65% 数字的可信边界 + 对 Anthropic 的"上下文锁定"。

## 信源

1. [Introducing Claude Tag](https://www.anthropic.com/news/introducing-claude-tag) — 一手（官方发布页）
2. [What is Claude Tag? — Help Center](https://support.claude.com/en/articles/15594475-what-is-claude-tag) — 一手（官方文档）
3. [Anthropic's Claude Tag gives AI agents independent identities — Help Net Security](https://www.helpnetsecurity.com/2026/06/24/anthropic-claude-tag-agent-identity-model/) — 二手（含 Zweben 引语）
4. [Anthropic's Claude Tag is learning your company — TechCrunch](https://techcrunch.com/2026/06/23/anthropics-claude-tag-is-learning-your-company-one-slack-message-at-a-time/) — 二手
5. [Anthropic releases Claude Tag, a virtual employee — Fortune](https://fortune.com/2026/06/23/anthropic-claude-tag-virtual-employee-tool-slack/) — 二手（含 Cat Wu 引语）
6. [Claude Tag data privacy risks — Geeky Gadgets](https://www.geeky-gadgets.com/claude-tag-data-privacy-risks/) — 二手（风险视角）
