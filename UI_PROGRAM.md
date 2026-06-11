# UI_PROGRAM.md — 网站 UI 自优化循环（autoresearch 改编）

> 对标 karpathy/autoresearch 的 `program.md`。那里 agent 改 `train.py`、用 `val_bpb` 评判；
> 这里 agent 改 `web/`、用 `tools/ui_eval.py` 的 `ui_score` 评判。**改 web，不改评分器。**

## 角色分工（铁律）

| autoresearch | 这里 | 谁改 |
|---|---|---|
| prepare.py（只读 ground truth） | `tools/ui_eval.py` + `EVAL_CRITERIA.md` | **不可改** |
| train.py（被迭代） | `web/`（组件/页面/lib） | agent 改这里 |
| program.md（编排） | 本文件 | 人改 |
| val_bpb 越低越好 | ui_score 越高越好（0-100） | — |
| results.tsv | `ui_results.tsv`（git 不追踪） | agent 记 |

## Setup（一次性）

1. 选 run tag（按日期，如 `jun11`）。分支 `ui-autoresearch/<tag>` 必须不存在。
2. `git checkout -b ui-autoresearch/<tag>`（从当前分支）。
3. 读 in-scope：`EVAL_CRITERIA.md`（评分标准）、`wiki/evaluation/2026-06-11-uiux-critique.md`（critique 找改点）、`web/components/*.tsx` + `web/app/admin/(panel)/*/page.tsx`（要改的）。
4. 确认 dev server 在跑：`curl --noproxy '*' -s -o /dev/null -w '%{http_code}' http://localhost:3100/` == 200。
5. 冻结 baseline（仅首次）：`python3 tools/ui_eval.py --freeze-baseline`。
6. 初始化 `ui_results.tsv`（表头）。记 baseline 分。

## 实验循环（LOOP FOREVER）

1. 看 git 状态（当前分支/commit）。
2. 挑一个改点（从 critique 的 Top5 / 资产表 / 失败断言清单里选**一个**），直接改 `web/`。一次一个，diff 可审。
3. **必跑** `cd web && npx tsc --noEmit`（类型不过不算数，直接 revert）。
4. `git add -A web/ && git commit -m "ui: <一句话>"`。
5. 评分：`python3 tools/ui_eval.py > /tmp/ui_eval.json 2>&1; grep ui_score /tmp/ui_eval.json`。
   （dev server 需在跑；改了 server 组件 Next 会 HMR，等 2 秒再评。）
6. 读分：
   - **ui_score 升高** → keep，advance（保留 commit）。
   - **持平或降低** → `git reset --hard HEAD~1` 回退。
   - **tsc 失败 / 页面 500** → 当 crash，revert，记 status=crash。
7. 记 `ui_results.tsv`（TAB 分隔，不 commit 这个文件）：
   ```
   commit	ui_score	A	B	C	D	status	description
   ```
8. 回 1。

## 约束（防 reward hacking）

- **不改 `tools/ui_eval.py` / `EVAL_CRITERIA.md`**（它们是 ground truth；改了分数不可比）。
- **不删黑名单词 / 不放宽断言**（评分只能由真实 UI 变好驱动）。
- **不动 `factory.config.yaml`、密钥、`output/`、`tools/`（除非该改点就是工具）**。
- 简单优先：同等加分，改动越小越好；删代码拿到等分=赢。

## 评分手册（ui_eval 在算什么，见 EVAL_CRITERIA.md 详）

- A 黑话(25)：UI 可见文本里 `n.*/m.*/spec_lock/.yaml/硬停/契约…` 的泄漏数，越少越高。**最快加分区**：建一张 `web/lib/nodeLabels.ts` 映射，渲染层统一翻译。
- B bug(25)：7 条断言（日期 GMT 串、视频统计、blocked 带 CTA、编号不撞、accent 对比度…）通过率。
- C 动线(25)：playwright 数"建项目→开跑""成稿→发布"的点击数（暂占位 12.5，接 playwright 后生效）。
- D 信任(25)：开始按钮成本预告、用量显示、人审承诺三处可见、Strategy 两步、断点续跑说明。

## 何时算"可放心自优化"

ui_score 从 23 → **≥60** 且 B(bug) 满分、A(黑话) ≥20，即认为 agent 可无人值守续跑剩余优化。届时把本循环挂到后台连跑。

## NEVER STOP

setup 完成后进入循环就别停下问"要继续吗"。人可能去睡了。没 idea 就回头读 critique 的 30 条文案表 + 资产表，一条条啃。直到人手动打断。
