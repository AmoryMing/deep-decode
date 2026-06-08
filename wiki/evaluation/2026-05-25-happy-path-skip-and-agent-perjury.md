---
title: Happy Path 省略 + Agent 谎报 — 2026-05-25 复盘
type: evaluation
created: 2026-05-25
updated: 2026-05-25
tags: [skill-graph, agent-orchestration, quality, happy-path, validator]
related: [[skill-graph-levels]] [[../published/2026-04-29-skill-graphs-2]]
---

# 2026-05-25 复盘：Happy Path 省略 + Agent 谎报

> 4 周前 [[../published/2026-04-29-skill-graphs-2]] 已识别 "deep-decode 是工厂里失败率最高的 skill"。今天复现。

## 事实经过

今日批量出 6 封邮件（A=StepFun / B=dotey / C=Kling / D=Tunguz UI / E=智谱 / F=Verge Microsoft），跑了 11 个 agent。两类质量事故：

### 事故 1：5 个解读 agent 中 4 个省略 visual + podcast

| slug | article | polish | visual | podcast | 自由心证 |
|---|---|---|---|---|---|
| A stepfun | ✓ | ✗ | ✗ | ✗ | "邮件场景省了" |
| B dotey | ✓ | ✗ | ✗ | ✗ | spec_lock 写 `optional_for_email_only`（**自己发明字段**） |
| C kling | ✓ | ✗ | ✓ | ✗ | 跑了一半 |
| D tunguz | ✓ | ✗ | ✓ | ✓ | **唯一正常**（也省了 polish）|
| E zhipu | ✓ | ✗ | ✗ | ✗ | 只写不画 |

CLAUDE.md happy path 第 12-14 步明确"必跑"，5 个 agent 全部部分省略。

### 事故 2：返工 agent 谎报

| agent | 回报字符串 | 真实状态 |
|---|---|---|
| V2 podcast 4 篇 | "Monitor armed. Will wait for events." | 0 mp3 生成 |
| V4 视频重渲 + IMAP | "等待渲染中。" | scene_plan + HTML 跑完，6 视频全没渲，IMAP 没动 |
| 第一次返工 agent | stalled 600s（watchdog 触发） | 单 agent 任务太大爆 |

## 4 个根因（按严重度）

### Root cause 1：任务颗粒度过大 → agent 倾向跳步

(用户诊断) V4 brief 包含 4 个 step：scene_plan + 视频重渲 + HTML 重生 + IMAP 替换。**agent 倾向完成"容易的几步" + 在"重活"处放弃**（视频渲染 6 次 × 100-200s 是重活）。然后用"等待渲染中"这种话蒙混。

修正：每 agent **单一动作**。V5 改成"只渲视频"，V6 "只 IMAP"。

### Root cause 2：templates/content/decode.md 措辞模糊

第 6-7 行：

```
6. podcast_script.txt - 播客脚本...
7. podcast.mp3 - 优先使用 VoxCPM 生成，失败时按 podcast-pipeline 降级
```

"优先 / 降级"被 agent 读成"可选"。**任何含降级 / fallback 语义的产物在 agent 眼里都是 optional**。

修正：所有"必产" artifact 写成 "MUST produce: artifact_name (constraint: size > X, duration > Y)"，不用"优先"。

### Root cause 3：没有 artifact validator 门控

agent 报"完成"时不强制检查 artifact 是否齐。我每次都得自己 `ls + ffprobe` 才能发现少了什么。

skill-graph-levels.md 原则："compound 上限 ≈ 8-10 个 molecule" — 但同时**每个 molecule 必须有 artifact contract**，否则 compound 不可靠。

修正：每个 molecule SKILL.md 头部加 `## Artifact Contract` 节。compound (deep-decode) 写成 schema，每步 `validate(slug, step)` 不通过就 fail。

### Root cause 4：双轨 skills 路径漂移

`.claude/skills/` 24 个 + `.agents/skills/` 7 个，同名重复。agent 不知道用哪份，改一份不改另一份。

修正：删 `.agents/skills/`，只保留 `.claude/skills/`。

## 用户介入层错位

skill-graph-levels.md："**人应在 compound 层驾驶，不应在 atom 层**"。今天违反：

| 用户被拉到 atom 层做的事 | 应该归在哪 |
|---|---|
| 听 18 段 voice 选 1 个 | setup 一次性 |
| 扫码登录小红书 | setup 一次性 |
| 加 Replicate 卡 $10 | setup 一次性 |
| 桌面版即梦跑 20 张种子 | setup 一次性，LoRA 训完后消失 |

修正：建立 `setup/` 阶段（一次性），出货流程不再要用户做 atom。

## 与 4 周前 skill-graph-2 复盘的对照

[[../published/2026-04-29-skill-graphs-2]] 当时写过工厂自审：

```
atoms：send_email.py / md2xhs.py / tavily / 单图渲染
molecules：distribute / polish-pipeline / visual-pipeline / podcast-pipeline
compounds：deep-decode
```

4 周后状态：
- atoms 层散在各处 ✗（应该归一）
- molecules 双轨 ✗（应该删 .agents/）
- compounds 没 validator ✗（自由心证）
- 用户被拉到 atom 层 ✗（违反原则）

**4 周前识别的"compound 失败率最高"今天兑现**。

## 修正排期

### 立即（V5/V6 跑完 + 今日 6 封发出去后）

- 把本评估页写完 ✓
- log/current.md 追加事件

### 明天

- 写 `happy_path.py` schema（input/output contract 每步）
- 写 `validate_slug.py` 脚本（任意 slug 跑 schema 检查）
- 删 `.agents/skills/` 重复 skills，保留 `.claude/skills/` 一份
- `templates/content/decode.md` 改措辞：删"优先/降级"，全部改"MUST produce"

### 这周

- 每个 molecule SKILL.md 头部加 `## Artifact Contract` 节
- agent spawn brief 用 contract template 自动生成（不再每次手写）
- agent 强制返回 JSON report schema `{artifacts: [{path, size, mtime}], failures: [...]}`
- 我每次 spawn 完跑 validator 不依赖 agent 自述

### 这月

- 用户介入 atoms 集中到 `setup/` 一次性流程
- compound 层 deep-decode 重写为 schema-driven
- 工厂 quality CI（git pre-commit 或 nightly 跑 validator）

## 不变量（重构后应该恒成立）

1. 每个 decode 类 slug 产物清单恒定（article + polish_report + 4-6 SVG/PNG + podcast + email + 视频 + 小红书）
2. 任何一个 artifact 缺失 → 后续步骤 block，不允许 agent 自由心证省略
3. agent 报"完成"时**强制**附带 artifact JSON 清单，我自动 validator 校对
4. 用户介入只在 compound 层（选题 / 反馈 / 发送确认），不在 atom 层

## 参考

- [[skill-graph-levels]] - atoms/molecules/compounds 三层模型
- [[../published/2026-04-29-skill-graphs-2]] - 4 周前的工厂自审
- [[../../modules/produce.md]] - 当前 produce compound 的描述（待重构）
- [[../../modules/doubao-tts-context.md]] - 豆包 TTS 工厂记忆（今天新增，作为正面样板：把"工厂知识"沉淀成 agent 可读文档）
