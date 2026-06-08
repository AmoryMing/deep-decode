---
title: 3.8%：Computer-Use 的全自动办公幻象，被 23 套真 SaaS 击穿
source:
  - https://www.qbitai.com/2026/05/424277.html
  - https://unipat.ai/benchmarks/SaaS-Bench
  - https://arxiv.org/html/2605.15777v1
  - https://github.com/UniPat-AI/SaaS-Bench
  - https://eu.36kr.com/en/p/3824057526259840
author: 内容工厂
date: 2026-05-27
type: decode
voice: doubao
slug: 2026-05-27-saas-bench-claude-3-8-percent
tags: [SaaS-Bench, ComputerUse, UniPat, Anthropic, AgentEval]
---

# 3.8%：Computer-Use 的全自动办公幻象，被 23 套真 SaaS 击穿

把 5 月 25 日量子位发的一条新闻压成两个数字：43.9 和 3.8。前者是 Claude Opus 4.7 在 SaaS-Bench 上的 checkpoint 分数，后者是它的端到端通过率。这两个数字摆在一起，是 2024 年 10 月 Anthropic 第一次演 Computer-Use demo 以来，agent 范式遇到的最具体的一次撞墙。

发布方是 UniPat AI——一家以北大为主力学术背景的中国 agent 公司。他们做的事情很笨重也很彻底：找来 23 套真实的开源 SaaS 系统——BigCapital 做财务、ERPNext 做 ERP、OpenEMR 做医疗、Mattermost 做协作、Grocy 做供应链、code-server 做 IDE——一套套装进 Docker，连前端 UI、后端数据库、业务约束一起搬。然后让 agent 在里面跑 106 道真实办公任务，比如报销、对账、维护病历、跨系统下单。每道任务平均 100 多步操作，最长一条 300 多步，93.4% 要跨 2 个以上应用。

结果是这样的：榜首 Claude Opus 4.7，checkpoint 43.9%，端到端 3.8%（106 道里完整做完 4 道）。第二名 GPT-5.5 High 1.9%。Kimi K2.5、Gemini 3.1 Pro 两个 0%。Claude Sonnet 4.6 0.9%。Qwen 3.6 Plus 1.9%。豆包 Seed 2.0 Pro 1.9%。

3.8% 不是某一家模型翻车了的笑话。它是这一代 Computer-Use agent 范式的天花板，被一份基准当众钉在了墙上。下面这篇文章拆五件事：43.9 和 3.8 之间这 11 倍落差的真实含义；UniPat 这套评测设计为什么是 evals 行业的方法论升级；论文给的四种失败模式诊断书；闭源、开源、各家旗舰在同一张桌子上的真实位次；以及这份基准对"AI 替代白领"叙事的具体打击。

![SaaS-Bench 击穿 Computer-Use 全自动办公幻象](00_系列封面.png)

## 11 倍落差才是诊断书

43.9% checkpoint 和 3.8% end-to-end 之间这 11 倍落差，是这份基准最值得被反复念的数字。

checkpoint 评分的逻辑是：一道任务被拆成 10 到 20 个验证点，每过一个给一个分。43.9% 意味着 Claude Opus 4.7 在中间环节大约能过将近一半。这个数字单看不寒酸，过去两年厂商 demo 视频里展示的"agent 帮你订机票""agent 帮你填表单"，大致就在这个水平上。问题出在剩下那一步：把 10 到 20 个 checkpoint 串起来，从头跑到尾，最终交付一份业务上可以接受的产物——这件事的概率只有 3.8%。

数学上很容易看出为什么会有 11 倍落差。假设每步独立成功率 90%，听上去高，跑 20 步累乘后是 12%。每步 95%，20 步后是 36%。每步 99%，20 步后是 82%。一个 SaaS-Bench 典型任务平均 100 多步，最长 300 多步。要让 100 步的端到端通过率到 50%，每步成功率得 99.3%。这是行业过去两年完全没拿到的工程指标。论文给这个现象取了名字叫 Long-Horizon Fragility（长程脆性）——单步对，累乘起来不对。

更要命的是失败不是均匀分布的。SaaS-Bench 论文里讲的另一件事叫 Error Cascading（错误级联）：早期某一个 3% 权重的判断错误，会让下游 30% 的分数全部作废。一个具体例子是，agent 在第三步把"供应商"实体建成了"客户"实体——这一步本身只占总分 3%，但后面所有"给这个供应商开发票""给这个供应商付款""审核这个供应商资质"的步骤，全部跑在错误的数据基座上。agent 不会回头复盘，它把错误带着往前跑，把整条流程一起带沟里。

3.8% 不是模型笨。是这一代 agent 的工作方式——单线推进、不带状态校验、不回滚——在 100 步以上的长任务上必然会触发的结构性失败。

![checkpoint 43.9% vs end-to-end 3.8%：11 倍落差才是真天花板](01_checkpoint_vs_end_to_end.png)

## 把 evals 从答题升到生产环境

过去三年 LLM 评测有个尴尬：分数刷得越来越漂亮，生产环境里 agent 越用越不敢托底。MMLU 95%、SWE-Bench Verified 80%、GAIA 70%——这些数字一年涨一档，但企业 IT 部门里"我能不能让 agent 帮我跑完一次报销审批"的答案，仍然是不能。

差距出在评测的颗粒度上。MMLU 是单题选择，SWE-Bench 是单个 GitHub issue 的 patch，GAIA 是几步内的网页查询。这些任务和企业里"跑完一条完整工作流"之间，差了三个数量级的步数、跨应用上下文、和业务约束。

UniPat 这次做的，是把评测从"prompt 答题"升级到"Docker 里跑真 SaaS"。23 套系统不是 mockup，是真的 BigCapital、真的 ERPNext、真的 OpenEMR——你能本地起来登进去注册账号下单的那种。Docker 让评测可复现，每跑一道任务起一套干净环境；任务设计采用"LLM 生成 + 专家监督"，LLM 围绕六大领域和具体岗位生成任务，再由领域专家手动筛选 + 实跑验证。验证用三件套：State-Check 直接对数据库或 API 状态做比对，Content-Check 做字符串和正则匹配，LLM-Judge 评判开放式输出。

这套架构的杀伤力不在于复杂，而在于它消灭了一类作弊空间。在 prompt 答题范式里，模型只要在文本层面"看起来对"就能得分，agent 自报"我已完成"是免费的。在 SaaS-Bench 里，agent 说自己改完了客户档案，State-Check 直接去数据库查那条记录变了没有——没变就是没做。agent 没法靠"演"过关。

这是 evals 行业过去三年最重要的方法论升级。Cursor 在 3 月发布的代码评测基准、Anthropic 内部的 SWE-bench-multimodal 都在同一个方向——把测试环境从静态文本升到真实状态。但 SaaS-Bench 走得更远，它把"跨应用、长流程、有状态、有约束"这四件事同时压在 agent 头上。**3.8% 这个数字之所以重要，是因为它来自一个让作弊变得困难的环境**。

![23 套真 SaaS × Docker × 三类验证：evals 范式升级](04_methodology.png)

## 四种失败模式：诊断 agent 卡在哪一步

论文里 UniPat 团队给出了一份失败模式的诊断书，共四条。这部分比分数本身更有价值，因为它告诉工程师"agent 到底是在哪几个地方挂掉"。

第一条 **Long-Horizon Fragility（长程脆性）**。10 到 20 个 checkpoint 的任务，每个 checkpoint 都有独立失败率，端到端成功率被数学叠加压到接近 0。这条是不可避免的物理约束，再训一代模型也很难单纯靠提高单步准确率把它解决——99% 单步对 100 步还是只有 37%。

第二条 **Error Cascading（错误级联）**。早期决策的错误通过依赖链向下游传染。36kr 给的具体数字是：单应用任务通过率 53%，四应用任务掉到 20%，每多接入一个应用通过率近乎线性下降。这条说的是单步精度本身不够，agent 必须有跨步、跨应用的"错误回滚"能力——而这一代模型没有。

第三条 **Verification Blindness（验证盲）**。这条最反直觉也最致命。Agent 完成一个操作后，比如点了"保存"按钮、提交了一个表单、改了一条数据库记录，它倾向于直接进入下一步，不会回到原页面去 recheck 那条数据是不是真的变了。论文里一个原文例子是 agent 改完一条记录"did not return to the page for recheck"——它认为"我点了保存"等于"我完成了"，但分布式系统里这两件事中间隔着一整条网络栈、一整套业务校验、一整层并发控制。Verification Blindness 不是数据问题，是 agent 的元认知缺陷——它不知道自己应该不相信自己。

第四条 **Execution Variance（执行方差）**。同一道任务，用同一个模型，跑三次得分分布从 0.00 到 0.68 都有。36kr 给的具体数字是：同任务三次复跑只能拿到 8 个百分点的提升，远低于"独立同分布抽样"的统计预期。这说明 agent 的失败不是均匀随机的，而是路径依赖的——早期的某几个决策点会分叉，分叉之后两条路径会越走越远，最终一条进 0 分一条进 0.68。工程上没法靠简单重试来稳态。

这四条失败模式叠加，画出来的是一张 agent 当下能力的实际边界。**任何一条单独看都还能用工程手段缓解**——加 verifier、加重试、加 human-in-loop。**四条叠在一起的时候，能力曲线就被压在了 4% 以下**。

![四种失败模式：长程脆性 / 错误级联 / 验证盲 / 执行方差](03_failure_modes.png)

## 闭源、开源、Anthropic 自家：同一张桌子上的真实位次

把 SaaS-Bench leaderboard 上十款模型按端到端通过率排一遍，会发现一件值得注意的事——**前五名的差距小到没有统计意义**。

Claude Opus 4.7 3.8%。GPT-5.4 High 3.8%。Claude Opus 4.6 3.8%。GPT-5.5 High 1.9%。Qwen 3.6 Plus 1.9%。豆包 Seed 2.0 Pro 1.9%。差距加在一起也不到 2 个百分点，而 106 道任务的统计颗粒度下，每个百分点大致对应一道任务的差异。换句话说，**前六名之间"谁第一"的判断方差大于差异本身**。Claude Opus 4.7 比 GPT-5.4 High 多做对的，可能只是某一道在某次跑里运气好的题。

更不寻常的是 GPT-5.5 High 比 GPT-5.4 High 还低（1.9% vs 3.8%）。这个倒挂说明端到端通过率受运行方差影响极大，新一代模型的提升被吃在了"路径依赖"这种工程方差里。同样的对比也出现在 Anthropic 自家：Claude Sonnet 4.6 0.9%，是 Opus 4.6 / 4.7 的 1/4。Sonnet 在大多数其他 benchmark 上和 Opus 差距没这么大，这次被拉开，是因为 SaaS-Bench 任务长得吃 Opus 的多步推理能力。

闭源 vs 开源这条对位线，在这个 bench 上也变得模糊。Kimi K2.6 0.9%、Qwen 3.6 Plus 1.9%、Doubao Seed 2.0 Pro 1.9%——开源代表队和闭源代表队的中位数差不多，全都在 1-2% 区间打转。**Computer-Use 这条赛道不是模型差距问题，是 paradigm 差距问题**——所有家都没拿到工程级可靠性。

值得另外提一句的，是 Anthropic 自己。Claude 是 2024 年 10 月最早把 computer-use 推向公众的厂商，自家两代旗舰在自家擅长的赛道上拿到 3.8%。这是一个诚实的数字。它没有给 Anthropic 一个"我们家就是比别家强"的优越感空间，但它也没让 Claude 难堪——3.8% 在这张表上仍是第一。**真正难堪的是整个行业**——过去两年那么多"全自动办公 agent"的销售话术，今天被一张 leaderboard 拆穿成了 3.8% 的现实。

![十款模型 SaaS-Bench 双指标排名：前六名差距 < 统计噪声](02_leaderboard.png)

## 对"AI 替代白领"叙事的具体反例

这件事对从业者最值得带走的判断不是"Claude 不够强"，是**"AI 替代白领"这种宏大叙事，现在有了一份可以指着说话的反例**。

过去两年这条叙事有两种讲法。一种是张牙舞爪的——"两年内 AI 替代会计""三年内 AI 替代 HR"。这种话术不需要数据，靠的是声量。SaaS-Bench 对它没什么对话空间——它本来就不打算给数据。

更值得拆的是另一种温和版的讲法："agent 已经能跑通真实办公流程，企业只是没用起来"。这套说辞过去常常以"我们已经看到客户用 Claude 跑完了报销审批"开头，但 SaaS-Bench 测的恰好是这件事。它的任务设计直接抄了企业里实习生日常做的活——报销、对账、维护客户档案、跨系统下单、做月度报表。这些不是炫技任务，是任何一个 1 年经验的运营都能做的事。最强 Claude 在这些任务上完整做完 4/106。

3.8% 这个数字最有杀伤力的用法，是**用它具体地反驳"agent 已经能办公了"的销售话术**。把这份 leaderboard 直接给 CTO 看，把 23 套 SaaS 名单直接给 IT 总监看，问一句"贵公司宣称的 agent 自动化里，哪几套 SaaS 在 leaderboard 上、哪几道任务是被 Claude 跑完了的那 4 道、哪几道是被跑挂了的剩下 102 道"——这是 2026 年 5 月起评估任何"agent 全自动办公"产品的最锋利的一个具体问题。

这不意味着 agent 没用。3.8% 端到端意味着 96.2% 不行——但 43.9% checkpoint 意味着大约一半的中间环节其实能跑。把 agent 当作"半自动 + 人在回路"的工具，而不是"全自动替代品"，是 SaaS-Bench 给从业者最直接的工程指引。把 agent 链路里的每一步都加上 verifier，让 agent 不允许自报完成；把长任务拆成更短的子任务，每个子任务跑完显式 handoff 给下一个；把 human-in-loop 放在级联失败的关键节点而不是最后兜底——这是 3.8% 这个数字翻译到工程实践层面应有的动作。

## 对从业者意味着什么

- **PM**：本周回去看你产品里宣称"agent 自动跑完"的功能，按 checkpoint vs end-to-end 拆指标——把过程指标和成果指标分开汇报。如果你只能给出 checkpoint 类数字（"agent 完成了 80% 步骤"），那它的端到端成功率大概率不到 5%。

- **架构师**：本周在 agent 链路里加 verifier 子流程，不允许 agent 自报"完成"。每个写操作之后强制读一次状态，State-Check 思路直接拿来用。对 100 步以上的长任务做 task decomposition，分段交付而不是一次性跑完。

- **CTO**：本周和你的销售对齐措辞——别再用"全自动办公" pitch。改成"半自动 + 人审"，并明确说明 verifier 在链路中的位置。把 SaaS-Bench 那张 leaderboard 印一份贴在会议室里。下次有外部 agent 厂商来 pitch，问他们这 23 套系统里能跑通哪几套、端到端通过率多少。

- **工程师**：本周打开 github.com/UniPat-AI/SaaS-Bench 把 docker-compose + verifier 框架抄进自家 evals 体系。这套架构对任何 agent 产品的内部测试都是直接可用的。论文 2605.15777 第 5 节的失败模式讨论值得读一遍。

## 本期关键词

**Long-Horizon Fragility（长程脆性）**。这一代 agent 范式最核心的诊断词。每步独立成功率乘以总步数得到端到端成功率，这件事的数学结果是：99% 单步对 100 步只剩 37% 端到端对。SaaS-Bench 文本任务 97.3% 超过 100 步，长程脆性是这个 paradigm 在长任务上的物理上限。它没法靠提高单步精度解决，必须靠减少步数（task decomposition）或者增加回滚能力（verifier + retry）来缓解。

**Verification Blindness（验证盲）**。Agent 完成一个操作后不会回头确认结果。它认为"我点了保存"等于"我完成了"，但分布式系统里这两件事中间隔着一整条网络栈和业务校验。这是 agent 的元认知缺陷——它不知道自己应该不相信自己。工程上必须外挂 verifier，不允许 agent 自报完成。论文里给的原文例子是 agent 改完一条记录"did not return to the page for recheck"。

**Checkpoint vs End-to-End**。SaaS-Bench 评分用双指标。checkpoint 是中间环节得分（任务被拆成 10-20 个验证点逐个打分），end-to-end 是整条流程完成与否的二值判断。Claude Opus 4.7 是 43.9% 和 3.8%，11 倍落差。任何 agent 产品宣传只给 checkpoint 类指标的，需要追问端到端数字——前者的水分通常是后者的 10 倍以上。

**Computer-Use 范式**。让大模型直接操作电脑 GUI（鼠标点击、键盘输入、读屏）完成任务的范式，Anthropic 2024 年 10 月发布 API 时定义。SaaS-Bench 是这个范式诞生 19 个月后第一份带定量诊断的报告：能力曲线被压在端到端 4% 以下，paradigm-level 而不是 model-level 的问题。

**Cross-Application 任务**。横跨多个应用系统才能完成的工作流。SaaS-Bench 里 93.4% 任务跨 2+ 应用，三应用任务占一半。每多接入一个应用通过率近乎线性下降——单应用 53%，四应用 20%。这条曲线说明 agent 在切换上下文时丢失状态的代价远大于单应用内推理。企业里"agent 自动跑完一条工作流"几乎默认就是跨应用，所以 cross-application 是 agent 落地的真实主战场。

## 引用

1. [Claude 通过率不到4%，SaaS-Bench撕碎了Computer-Use的「全自动办公」幻想 — 量子位](https://www.qbitai.com/2026/05/424277.html) — 原文出处
2. [SaaS-Bench — UniPat AI 官方 leaderboard](https://unipat.ai/benchmarks/SaaS-Bench) — 模型分数与方法学权威页
3. [SaaS-Bench: Can Computer-Use Agents Leverage Real-World SaaS to Solve Professional Workflows? — arxiv](https://arxiv.org/html/2605.15777v1) — 论文原文，作者主力 PKU + UniPat AI
4. [UniPat-AI/SaaS-Bench — GitHub](https://github.com/UniPat-AI/SaaS-Bench) — 评测代码与 docker-compose 框架
5. [Claude's Pass Rate Less Than 4%, SaaS-Bench Shatters Computer-Use's "Fully Automated Office" Fantasy — 36Kr](https://eu.36kr.com/en/p/3824057526259840) — 英文交叉验证，含失败模式具体数字
