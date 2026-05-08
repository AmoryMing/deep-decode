# Claude Code 源码拆解系列 — 任务交接文档

> 生成时间：2026-04-05
> 交接原因：当前代理无法完成，需要更高级代理接手

---

## 一、原始需求

**目标**：34 篇 Claude Code 源码深度拆解文章，全自动批量生产，无需人工干预

**产出规格**（每篇）：
1. vault 知识节点 `.md`（3000-5000 字深度解读）
2. 概念可视化 SVG（2-4 张）
3. 图文 Word 文档 `.docx`
4. 可选：播客音频 `.mp3`

**质量要求**：
- 像《晚点》《虎嗅》深度稿，叙事驱动
- 观点密度高，每段有判断
- 有原创概念命名
- 跨信号交叉验证（至少 3 个外部信源）
- 有盲区/反面论证

---

## 二、当前进度

| 指标 | 状态 |
|------|------|
| 素材库 | ✅ 完成（46+ 信息源、PDF、源码包、中英文 Wiki） |
| 选题队列 | ✅ 完成（queue.jsonl，34 篇已规划） |
| 写作规范 | ✅ 完成（SKILL.md + writing-style.md） |
| 已完成文章 | ❌ 0 篇 |
| 第 1 篇进度 | Phase 0-2 + 7 张 SVG 完成，正文未产出 |

**关键文件路径**：
- 选题队列：`pipeline/queue.jsonl`
- 素材库：`context/`
- 第 1 篇目录：`2026-04-03-claude-code-leak-panorama/`
- 第 1 篇骨架：`2026-04-03-claude-code-leak-panorama/phase1_skeleton.md`
- 第 1 篇信源：`2026-04-03-claude-code-leak-panorama/phase0_sources.json`
- 第 1 篇信号：`2026-04-03-claude-code-leak-panorama/phase2_signals.json`
- 第 1 篇 SVG：`2026-04-03-claude-code-leak-panorama/material/pngs/`（7 张）
- 第 1 篇 brief：`2026-04-03-claude-code-leak-panorama/brief.md`

---

## 三、尝试过的方案

### 方案 1：子 Agent 并行分发

**做法**：主会话作为控制器，每篇文章 spawn 一个子 agent 跑完整 deep-decode 流程

**结果**：失败

**原因**：
- 子 agent prompt 包含完整 SKILL.md + 10+ 个素材文件路径
- 上下文太大（~50k tokens），子 agent 跑了 16 分钟后 504 Gateway Timeout
- 子 agent 没产出任何文件就挂了

### 方案 2：batch_decode.js 脚本编排

**做法**：写 Node.js 脚本，用 `claude --print --permission-mode bypassPermissions` 逐篇调用

**脚本位置**：`pipeline/batch_decode.js`

**结果**：失败

**原因**：
1. 路径拼错（`baseDir` 少了一层 `claudecode_deep_decode`）
2. `claude --print` 子进程输出没被 Node.js 捕获
3. 质量检查找不到产出文件，判定失败，进入无限重试
4. decode-log.jsonl 被写入了虚假成功记录（10 条 "done"），但实际没有产出文章

### 方案 3：子 Agent + 精简 Brief

**做法**：主会话先产出精简 brief（~1000 字），子 agent 只读 brief 写文章

**结果**：未完成

**原因**：用户中断，要求先做问题诊断和文档

---

## 四、核心卡点

### 卡点 1：上下文窗口 vs 任务复杂度的矛盾

- 高质量文章需要：读素材 → 搜外部信号 → 写作 → 事实核查 → 出终稿
- 这个流程的认知负载很高，需要大量上下文
- 子 agent 上下文隔离，只能拿到 prompt 里塞的东西
- 塞少了 = 质量低；塞多了 = 上下文爆 / 超时

### 卡点 2：脚本调 `claude --print` 的输出捕获问题

- `claude --print` 确实能读写文件（已验证）
- 但 Node.js spawn 的 stdout 捕获有问题
- 脚本看不到 claude 的输出，无法判断是否成功
- 质量检查依赖文件存在性，但文件可能写到错误路径

### 卡点 3：流程太长，断点难恢复

- deep-decode 有 6 个 Phase，每个 Phase 有检查点
- 中间任何一步失败，整个流程要重来
- 没有实现真正的断点续跑

---

## 五、可能的解决方向

### 方向 A：拆分流水线，每步一个独立调用

```
Step 1: 读取素材 → 产出 brief.md
Step 2: 读取 brief → 产出 draft.md
Step 3: 读取 draft → 事实核查 → 产出终稿.md
```

每步用 `claude --print` 独立调用，上一步的输出是下一步的输入。脚本只做文件搬运和状态管理。

### 方向 B：使用 Claude API Batch Processing

Anthropic 有 Message Batches API，适合不需要即时响应的批量任务。成本更低，但需要改用 API 而非 CLI。

### 方向 C：人工介入关键节点

- 自动化：素材收集、brief 生成、初稿写作
- 人工：质量审核、事实核查、终稿确认
- 再自动化：批量发布

---

## 六、给下一个代理的建议

1. **先跑通 1 篇**：不要上来就批量，先确保单篇流程完整可走通
2. **验证产出存在**：每步完成后检查文件是否真的写到了正确路径
3. **减少子 agent 任务范围**：一个 agent 只做一件事（读 brief → 写 draft），不要让它做全流程
4. **考虑用 API 替代 CLI**：Batch API 更适合这种大规模批量任务
5. **第 1 篇的 brief 已经写好**：`2026-04-03-claude-code-leak-panorama/brief.md`，可以直接用来测试写作

---

## 七、相关文件索引

| 文件 | 路径 | 用途 |
|------|------|------|
| 选题队列 | `pipeline/queue.jsonl` | 34 篇文章的 ID、标题、信源、状态 |
| 生产计划 | `pipeline/production-plan.md` | 11 个系列、34 篇文章详细规划 |
| 技能定义 | `.claude/skills/deep-decode/SKILL.md` | 完整 deep-decode 流程定义 |
| 写作规范 | `.claude/skills/deep-decode/references/writing-style.md` | 钩子开头、证据驱动判断等 |
| SVG 规范 | `.claude/skills/deep-decode/references/svg-design.md` | 双风格（漫画/Notion 式） |
| 批量脚本 | `pipeline/batch_decode.js` | 已写但有 bug |
| 素材库 | `context/information_sources/` | 46+ 篇信息源文章 |
| 源码包 | `context/raw_code/` | 泄露的 TypeScript 源码 |
| 第 1 篇 brief | `2026-04-03-claude-code-leak-panorama/brief.md` | 已精炼的核心素材 |
