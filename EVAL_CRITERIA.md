# EVAL_CRITERIA.md — 网站客观评估标准（autoresearch 的"val_bpb"）

> created: 2026-06-11
> 目的：给 UI 自优化一个**单一、确定、可复算**的分数。autoresearch 的灵魂是"一个数字，越低越好，机器照着它迭代"。我们这里是 **ui_score，越高越好（0-100）**。每条都能被脚本机械判定，不靠人打分、不靠 agent 自述。
> 配套脚本：`tools/ui_eval.py`（吐 JSON，含总分 + 分项 + 失败断言清单）。

## 为什么需要客观标准（对照 autoresearch）

karpathy/autoresearch 能让 agent 整夜自优化，关键不是 agent 多聪明，是 **prepare.py 里的 evaluate_bpb 是只读的 ground truth**——agent 改 train.py，分数自动判好坏，keep/discard 全自动。
我们的 UI 自优化要成立，同样需要一个 agent **不能改、只能被它评判**的评分器。否则 agent 会"优化"评估标准本身（reward hacking）。

→ `tools/ui_eval.py` 对标 `prepare.py`：**只读、是 ground truth**。
→ web/ 源码对标 `train.py`：agent 只改这里。
→ `UI_PROGRAM.md` 对标 `program.md`：人编排的实验循环说明。

## ui_score 构成（满分 100，五维各 20）

### A. 黑话泄漏（20 分）—— 全自动可判
扫 `web/` 渲染层 + 截图 OCR，统计**内部标识符泄漏到 UI 文本**的次数。
- 黑名单正则：`\bn\.\w+`、`\bm\.\w+`、`\ba\.\w+`、`\bc\.\w+`、`spec_lock`、`val_bpb`、`runner`、`BYOK`、`executor`、`tone_lint`、`\.yaml`、`\.py`（在用户可见文案里）、"契约"、"硬停"、"节点"
- 计分：`25 * max(0, 1 - leaks/baseline_leaks)`，baseline_leaks = 首次测得的泄漏数（冻结为常量）
- 注：代码注释、变量名、aria-label 里的不算；只算渲染给用户看的字符串字面量 + 截图可见文本

### B. 工程 bug（20 分）—— 全自动可判（断言通过率）
一组 pass/fail 断言（见 critique 资产表 3），每条等权：
- 门户 DOM 不含 `GMT+`（日期渲染干净）
- 门户卡片按日期降序（解析前 5 张卡日期单调不增）
- hasVideo 统计 == 实际 `video.mp4` 数
- 每个 blocked 状态有对应 CTA 元素（runs 页 DOM 有 `data-cta`）
- accent 色 `#d4541e` 不再用于 `<18px` 文本（grep globals + 组件）
- 一套编号：全站 H2 序号与侧栏序号一致（解析 `①②③` 与 nav num）
- 计分：`25 * 通过数/总数`

### C. 动线步数（20 分，占位10）—— 半自动（脚本数 DOM 跳转）
"从选题到内容开跑"和"从成稿到发布"两条关键链路的点击数 + 跨页数。
- 用 playwright 脚本走一遍，记录 click 次数 N1（建项目→开跑）、N2（成稿→发布动作可点）
- 计分：`25 * (baseline_clicks / max(current_clicks, baseline_clicks))`，baseline = 当前实测（建项目→开跑 5 击、成稿→发布 ∞ 因为要终端）
- 终端命令出现在关键路径 = 该路径判 0（不可达）

### D. 信任可见性（20 分）—— 断言可判
- 「开始」按钮旁有耗时/成本/边界预告文本（DOM 含"约""分钟"或"不会发布"）：5
- 运行卡显示 `llm_calls/上限` 用量：5
- "发布永远人审"承诺在总览 + 开始按钮 + 审核页三处可见：5（每处 1.67）
- Strategy 确认是两步（先展示草案 DOM 再有确认按钮，不是一键）：5
- blocked 卡有"可以离开/断点续跑"说明：5

### E. 视觉美观/一致性（20 分）—— 静态扫源码可判
用户加的第 5 维。机器可判的一致性指标：
- 圆角档数 ≤4（rounded-* 收敛）
- 小字号 text-[10/11px] 不增（中文 11px 发虚，地板提到 12px）
- violet 跨页二义消除（queued≠ready 不共用）
- "未动"不再用红（red 只留失败）
- 有集中状态色/标签映射模块（nodeLabels.ts 或 statusColors.ts）
- 计分：通过数/5 × 20

## 总分解读
- **<40**：critique 前状态（当前估计 ~30）
- **60**：黑话清零 + bug 修完，可用
- **80**：动线压缩 + 信任可见，生产级
- **目标 ≥85** 后视为"agent 可放心自优化"的及格线

## 评分器的不可侵犯性（防 reward hacking）
1. `tools/ui_eval.py` 与 `EVAL_CRITERIA.md` 在自优化循环里**只读**，agent 不得修改（对标 prepare.py 只读）。
2. baseline 常量一旦冻结不改（否则分数不可比）。
3. 黑名单/断言集只能由人扩充，不能由优化 agent 删减。
4. 分数提升必须由**真实 DOM/源码变化**驱动，不接受"调评分器"式提升。

## 与 autoresearch 的映射
| autoresearch | 本项目 |
|---|---|
| prepare.py（只读 ground truth） | tools/ui_eval.py + EVAL_CRITERIA.md |
| train.py（agent 改） | web/（组件 + 页面 + lib） |
| program.md（人编排循环） | UI_PROGRAM.md |
| val_bpb（越低越好） | ui_score（越高越好） |
| 5 分钟固定预算 | 一轮 = 一个改动 + ui_eval（约 1-2 分钟） |
| results.tsv | ui_results.tsv |
| git branch autoresearch/<tag> | git branch ui-autoresearch/<tag> |
