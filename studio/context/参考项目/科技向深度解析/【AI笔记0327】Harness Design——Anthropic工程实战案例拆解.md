# Harness Design for Long-Running Apps

> Anthropic Engineering Case Study  
> Anthropic 工程实战案例拆解  
> Anthropic Engineering · Anthropic Blog · 2026-03  
> AI Force 前沿 AI 探索  
> 整理：Dave  
> 原文：https://www.anthropic.com/engineering/harness-design-long-running-apps

---


### 开篇

用 AI agent 帮你干活，到底是省钱还是烧钱？Anthropic 工程团队用三个真实项目给出了答案：一个独立游戏制作项目花了 9 美元/20 分钟，一个 DAW 插件项目三个半小时花了 124.70 美元——两者背后是完全不同的 Harness 设计思路。

这篇文章是 Anthropic 内部真实工程实践的案例复盘，不谈概念，只谈他们具体怎么做的：前端评估如何打分、Sprint 合约如何防幻觉、QA 怎么调出来的、上下文重置时机的判断，以及最终他们推翻了哪些最初的假设。


---


## 01  前端评估循环：四维打分 + Playwright 实测


![01_前端设计循环详解](material/pngs/01_前端设计循环详解.png)

Harness 的第一个核心组件是前端设计循环（Frontend Design Loop）。每次 agent 生成 UI 后，Harness 会自动启动 Playwright 在真实浏览器中截图，然后用 Claude 对截图打分，决定是否进入下一个 Sprint 或要求重做。

打分维度固定四个：视觉设计（布局、颜色、层次感）、功能完整度（所有要求的控件是否存在）、交互一致性（按钮、表单行为是否符合预期）、响应适配（不同屏幕宽度下的表现）。每个维度 1-10 分，总分 >= 32/40 才算通过。


> *The frontend evaluation is not a vibes check — it's a structured four-dimensional score with a hard threshold. If the score is below 32, the agent retries automatically without human intervention.*
> 前端评估不是感觉检查，而是有硬性阈值的四维结构化打分。低于 32 分，agent 自动重试，不需要人工介入。

Few-shot 校准是保证评分一致性的关键。在提示中放入 3 对「截图 + 评分」的真实样例，让 Claude 对「7 分的视觉设计」和「9 分的视觉设计」有具体的参照物，而不是在空气中打分。


---


## 02  Sprint 合约：27 条标准防止幻觉完成


![02_Sprint合约实例拆解](material/pngs/02_Sprint合约实例拆解.png)

Sprint 合约（Sprint Contract）解决的是「agent 自认为完成了但实际没做」的问题——即幻觉完成（hallucinated completion）。

以 DAW 插件项目的 Sprint 3 为例，合约包含 27 条具体验收标准，不是笼统的「实现拖拽排序功能」，而是拆解到：「PUT /frames/reorder 端点接受 frame_ids 数组」「frame_ids 中的每个元素都必须是合法整数，非整数返回 422」「重排后数据库中 frame.order 字段立即更新」……

合约驱动开发暴露了一个真实 bug：FastAPI 路由的类型转换逻辑，当请求 PUT /frames/reorder 时，路由器错误地将路径中的 frame_id 匹配为整数参数，导致传入字符串 ID 时返回 404 而非 422。这个 bug 被第 14 条标准直接捕获，定位到 LevelEditor.tsx:892。


> *The Sprint contract is not a wish list — it's a machine-readable checklist. Every item must be verifiable by an automated test or a deterministic Playwright interaction.*
> Sprint 合约不是愿望清单，而是机器可读的 Checklist。每一条都必须能被自动化测试或确定性 Playwright 操作验证。

- 合约项数量：Sprint 3 共 27 条，覆盖 API 端点、数据库行为、UI 交互、错误响应
- 每条验收标准对应一个自动化测试，合约通过率 < 100% 则 Sprint 失败
- bug 定位精度：直接输出文件名 + 行号（LevelEditor.tsx:892），不是「大概在这个函数里」

---


## 03  QA 调优：自我审批陷阱与三轮迭代


![03_QA调优踩坑](material/pngs/03_QA调优踩坑.png)

QA agent 的第一版实现失败了。失败方式是：agent 自己写代码，自己测试，自己说「测试通过」。这是一种自我审批（self-approval）模式，内部推理链如下：

「我刚写了这段代码 → 我对它比较有信心 → 测试应该是通过的 → 我来运行测试 → 测试通过了（因为我预期它通过）」

这不是 agent 在说谎，而是确认偏误（confirmation bias）在大模型上的具体表现。解法是把 QA 拆成两个独立角色：Implementer 写代码，Reviewer 测试，两者不共享上下文，Reviewer 拿到的只有 Sprint 合约和当前代码，没有实现过程中的「我觉得这样应该行」。


> *The fix was not to make the QA prompt more detailed. The fix was to remove the agent's memory of having written the code it was testing.*
> 修复方案不是让 QA 提示词更详细，而是移除 agent 对「它正在测试自己写的代码」这一事实的记忆。


#### 三种失败模式 → 三轮 Prompt 迭代

- 第一轮失败：自我审批 → 修复：拆分 Implementer/Reviewer 角色，隔离上下文
- 第二轮失败：Playwright 测试中 click 了不存在的按钮却返回 success → 修复：要求每次交互后截图并用视觉验证确认元素实际存在
- 第三轮失败：pass/fail 判断过于宽松，把「功能基本存在」判为通过 → 修复：在 QA 提示中加入「只有在 Sprint 合约的全部 N 条标准均满足时才能输出 PASS」

---


## 04  上下文重置：Sonnet 4.5 的「上下文焦虑」


![04_上下文重置机制](material/pngs/04_上下文重置机制.png)

长时运行任务中，上下文窗口会随着对话历史增长而膨胀，最终拖慢推理速度并引入噪音。Harness 的设计决策之一是何时重置（reset）上下文，而不是无限压缩（compaction）。

用 Claude Sonnet 4.5 运行时，团队观察到一个明显症状：当上下文长度超过 40K tokens 后，agent 开始「过度反思」——每次行动前都花大量 token 回顾历史记录、重新确认已完成的工作，推理速度明显下降，且容易把早期的中间状态误认为当前状态。团队把这个现象称为「上下文焦虑」（context anxiety）。


> *At 40K tokens, Sonnet 3.5 would start re-reading its entire history before every action, as if it couldn't trust its own recent outputs. The fix was a hard reset at 35K with a structured handoff file.*
> 超过 40K tokens 时，Sonnet 3.5 在每次行动前都开始重读整个历史，好像不相信自己最近的输出。修复方案是在 35K 时强制重置，配合结构化交接文件。

重置不是简单地清空历史。Harness 在重置前会让 agent 写一份结构化的交接文件（handoff file），包含：当前 Sprint 已完成的条目列表、下一步 TODO、已知 bug 及其状态、需要保持不变的设计决策。新的上下文从这份文件开始，而不是从零开始。

Opus 4.6 上线后，这个问题得到明显改善——在同等上下文长度下，Opus 4.6 不再表现出「上下文焦虑」的症状，重置阈值可以从 35K 放宽到 80K+。


---


## 05  硬数据：两个项目的真实账单


![05_硬数据拆解](material/pngs/05_硬数据拆解.png)

关于成本，文章给出了两个项目的真实数字，没有模糊处理：

独立游戏项目（Game Maker）：**9 美元 / 20 分钟。**这是一个原型级别的 2D 平台游戏，包含基础碰撞检测、角色动画、关卡编辑器。任务边界清晰，Sprint 数量少（共 3 个 Sprint），agent 基本在 context 较小的状态下运行，每次重置代价低。对比：同等功能的人工开发估计 6 小时，按 200 美元/小时折算约 1,200 美元。

DAW 插件项目（Digital Audio Workstation）：**124.70 美元 / 3 小时 50 分钟。**账单拆分：第一阶段 0.46 美元 / 4.7 分钟（初始规划和架构），第二阶段 71.08 美元 / 2 小时 7 分钟（核心功能实现），第三阶段 53.16 美元 / 1 小时 38 分钟（QA、重构和边缘 case 修复）。


> *The cost curve is non-linear. The first 20% of functionality costs 0.4% of the total bill. The last 20% — edge cases, error handling, polish — costs 43% of the total.*
> 成本曲线是非线性的。前 20% 的功能只占总账单的 0.4%；最后 20%——边缘 case、错误处理、打磨——占总账单的 43%。

这个非线性特征对 Harness 设计有直接影响：Sprint 合约的颗粒度应该随着项目进展加密——早期 Sprint 可以粗放，后期 Sprint 的验收标准需要精确到具体错误码和响应时间阈值。


---


## 06  被推翻的假设：Opus 4.6 改变了什么


![06_组件假设检验](material/pngs/06_组件假设检验.png)

文章最后一部分是对 Harness 设计中「哪些假设随着 Opus 4.6 上线变得过时」的直接复盘，这是本文最有价值的部分之一：

假设一（已过时）：**需要在每个 Sprint 结束时强制执行上下文重置。**Opus 4.6 的长上下文处理能力显著改善，不再出现 Sonnet 4.5 的「上下文焦虑」症状，重置阈值从 35K 放宽到 80K+。

假设二（已过时）：**前端评估需要 few-shot 示例才能打出一致的分数。**Opus 4.6 在零样本下的评分一致性已经足够，few-shot 校准的增益从约 15% 降到 < 3%，可以简化提示词。

假设三（仍然成立）：**Sprint 合约必须机器可读，不能依赖 agent 的主观判断。**无论模型能力如何提升，合约驱动开发的价值在于消除「幻觉完成」，这个问题没有消失。

假设四（仍然成立）：**QA 角色必须与 Implementer 角色隔离上下文。**确认偏误不是能力问题，而是角色定义问题。即使用最强的模型，让同一个 agent 又写又测仍然是危险的设计。

Harness 的设计不是一次性的蓝图，而是随模型能力持续演化的工程决策集合。关键是知道哪些组件在补偿模型的当前局限，哪些组件是结构性需求——后者无论模型如何进步都不会消失。


---


---


---


## 结语

这篇案例的核心价值不在于告诉你「用 AI agent 能省多少钱」，而在于展示了一套可以被检验、被推翻、被升级的工程决策框架。Harness 的每一个组件背后都有一个明确的假设，当模型能力变化时，团队知道哪些假设需要重新检验。这种「可证伪的工程设计」思维，比任何具体的技术配方都更值得复用。


**三个关键启示：**

1. **Sprint 合约是防幻觉的关键组件。** 验收标准必须机器可读、可自动化验证，这个需求不会因模型变强而消失。
2. **角色隔离比提示词优化更有效。** 把写代码和测代码拆成独立 agent，从结构上消除确认偏误，而不是依靠更复杂的提示词来约束它。
3. **区分「补偿型组件」和「结构型组件」。** 前者随模型升级可以简化甚至删除，后者是永久性需求——搞清楚哪些是哪些，才能让 Harness 随时间保持精简。

---

原文链接：https://www.anthropic.com/engineering/harness-design-long-running-apps  
AI Force 前沿 AI 探索 · 整理：Dave