---
title: Useful Memories Become Faulty When Continuously Updated by LLMs
type: source
created: 2026-05-18
updated: 2026-05-18
tags: [Agent记忆, LLM研究, memory-consolidation, ARC-AGI, 自进化Agent, UIUC, 清华IIIS]
---

# Useful Memories Become Faulty When Continuously Updated by LLMs

- **arXiv**: 2605.12978v1（cs.AI，2026-05-13 提交）
- **PDF**: https://arxiv.org/pdf/2605.12978
- **项目页**: https://dylanzsz.github.io/faulty-memory/
- **作者**: Dylan Zhang(张世卓), Yanshan Lin, Zhengkun Wu, Yihang Sun, Bingxuan Li, Dianqi Li, Hao Peng
- **机构**: 1 University of Illinois Urbana-Champaign（UIUC）；2 IIIS, Tsinghua University（清华交叉信息研究院）。论文标注 "Work done at UIUC"。通讯作者 Dylan Zhang（UIUC 在读博士，导师 Hao Peng）
- **推主转发源**: https://x.com/rohanpaul_ai/status/2055919204591902771

## 一句话论点

LLM agent 把原始经历不断「重写压缩」成文字教训的记忆机制（consolidation），即使原始经历完全正确，也会在持续更新中让记忆质量先升后降、最终掉到「无记忆」基线以下；问题出在重写这个动作本身，不是经历的质量。

## 核心论点

1. **记忆效用非单调**：从空记忆开始，压缩记忆的效用先涨后跌。ScienceWorld 上得分在第 20 步左右见顶，到第 100 步跌破无记忆基线（所有记忆容量都如此）。
2. **干净数据也救不了**：在 19 道 GPT-5.4 无记忆能 100% 解的 ARC-AGI 题上，每步都喂标准答案做流式重写。Static（一次性压缩全池）保持天花板（R10/R50 都 94.7%），Stream（每题更新一次）到第 10 轮跌到 52.6%——论文据此说「在它原本解出的题上失败 46%/54%」。归因明确：错在 consolidation 步骤，不是脏轨迹。
3. **同样轨迹，不同时序 → 不同记忆**：一次性压缩（Static-All）vs 流式批更新（Stream）产生质量截然不同的最终记忆；Stream 比 Static 掉 17–38 个百分点。早期抽象会锚定后续重写，小错复利。
4. **episodic-only 已经够强**：把原始 rollout 直接当 in-context demo 追加（不做任何跨轨迹抽象），在 ALFWorld/WebShop/AppWorld 上已经能和 ACE/AWM/Dynamic Cheatsheet 这些 lesson 式压缩器打平甚至超过（Table 2）。
5. **三个失败机理**（§6）：
   - **错分组（misgrouping）**：抽象前没把同类经历归对。强制每步压缩时，模型频繁把不同问题类的 episode 合并（Force regime misclassification 高发）。分类能力本来是有的——给自主权时 71 步后能干净覆盖 6 个问题类——是强制抽象覆盖了它本可做对的分组。
   - **干扰（interference）**：抽象剥掉「适用条件」，过泛化的教训污染邻近任务。ALFWorld 里给 Pick&Place 的教训误导了 Pick-Clean-Place。ScienceWorld 15 任务切换序列里，Cumulative 比 Fresh 落后 +203 分；Cumulative 累积过泛化记忆的速率约为 Fresh 的 5 倍，垃圾记忆约 20 倍。
   - **过拟合（overfit）**：输入分布变窄时，抽象拟合表层规律而非问题策略。对同一题重复重写 50 轮：Round 1 还写「max size（最大尺寸）」这个 solver 能算的具体属性，Round 50 退化成「某个 per-object 数值属性的最大值」——没词记录该最大化哪个属性了。在精确重复题上稳定，在同族简单变体上崩。
6. **缓解方案**：双存储——一个 first-class 的 Episodic 原始轨迹缓冲 + 一个可选、由 agent 自己 gate 的 Abstract 抽象存储。在 ARC-AGI Stream 里给 Retain/Delete/Consolidate 三个动作：Auto（自己决定保留还是压缩）和 Episodic Management Only（彻底禁用抽象）都 ≥ Force（强制每步压缩）。Auto 把原始缓冲很快填满、抽象存储保持稀疏，accuracy 大致翻倍于 Force。结论：决定性失败模式是「每步强制重写」，不是抽象本身。

## 关键数据

| 实验 | 设置 | 结果 |
|---|---|---|
| ARC-AGI 流式 GT | 19 题，GPT-5.4 无记忆 100% | Static R10/R50=94.7%；Stream R10=52.6%（≈失败 46%） |
| ScienceWorld + CLIN | batch=4 离线流 | 第 ~20 步见顶，第 100 步跌破无记忆 |
| WebShop + AWM | 8→128 示例 | 成功率 0.64（8 例）→ 0.20（128 例）；无记忆=0.20 |
| Stream vs Pool | ALFWorld/SciWorld | Stream 比一次性压缩掉 17–38 pts |
| ScienceWorld 15-task switch | Fresh vs Cumulative | Cumulative 最终落后 +203 分；过泛化 5×、垃圾记忆 20× |
| ARC-AGI Stream 400 步 | Force vs Auto vs No-mem | Auto(|Ep|=100)=43.2% 累计成功 ＞ Force ＞ No-mem |
| 过拟合 OOD | GPT5.4 同族变体 | ID/OOD gap 极大，OOD 接近 0.00–0.05 |

## 金句（英文原文 + 中译）

> "even when consolidating from ground-truth solutions, GPT-5.4 fails on 54% of a set of ARC-AGI problems it had previously solved without memory."
> （即使从标准答案做压缩，GPT-5.4 在一组它原本无记忆就能解的 ARC-AGI 题上也失败了 54%。）

> "Each consolidation step is a lossy rewrite of the memory store: useful details are dropped, spurious rules are introduced, and once-helpful abstractions drift away from the underlying task structure."
> （每一次压缩都是对记忆库的有损重写：有用细节被丢掉，伪规则被引入，曾经有用的抽象偏离了底层任务结构。）

> "robust agent memory should treat raw episodes as first-class evidence and gate consolidation explicitly rather than firing it after every interaction."
> （稳健的 agent 记忆应把原始经历当作一等证据，显式地为压缩设闸，而不是每次交互后就触发它。）

> "continuously updated textual memory should be treated not as a reliable engine of self-improvement, but as a fragile mechanism that can make more experience produce worse memory."
> （持续更新的文本记忆不该被当作可靠的自我提升引擎，而是一个会让「更多经历产出更差记忆」的脆弱机制。）

## 可写角度

- 反「自进化 agent」叙事：行业把「distill → store → rewrite」当免费午餐（不用改参数就能自我提升），论文用最干净的对照证伪。
- 点名具体被波及的方法：CLIN、Agent Workflow Memory(AWM)、Dynamic Cheatsheet、ACE——都是 update-after-every-interaction 设计。
- 工程落地：episodic-only 是被低估的强基线；任何靠蒸馏的记忆方法都该和它没压缩的原始 rollout 对照测。
- 与 Anthropic Memory Store、各家 memory layer 产品对照：商业产品默认的「记忆会自动越用越好」假设站不住。

## 关联

- [[wiki/concepts/memory-as-moat]]
- [[wiki/concepts/context-compression]]
- 同期对照：2026-05-15 腾讯 agent memory token-61（已发）
