---
title: Tomer Tunguz：别再只看智力分，要看"一个结果烧掉多少 token"
date: 2026-06-04
type: decode
slug: 2026-06-04-tunguz-tokens-per-result
style: default
reader: default
sources:
  - https://www.tomtunguz.com/tokens-per-result
  - https://techcrunch.com/2026/06/02/uber-caps-employee-ai-spending-after-blowing-through-budget-in-four-months/
  - https://www.techloy.com/marc-benioff-says-salesforce-will-spend-300-million-on-anthropic-tokens-this-year/
distribute: [email, xiaohongshu]
---

# Tomer Tunguz：别再只看智力分，要看"一个结果烧掉多少 token"

风投人 Tomasz Tunguz（业内常称 Tomer Tunguz，Theory Ventures 合伙人）6 月 3 日发了一篇短文，标题叫《Intelligence Per Dollar》（每一美元买到多少智能）。他的核心判断只有一句：评价一个模型，单看它在榜单上的智力分已经不够了，要看它"达成一个结果烧掉多少 token"。这把模型选型从"比谁聪明"换成了"比谁单位成本低"——AI 行业第一次有人把成本提到和能力同等的位置，写进了评价标准。

作为给企业算采购账的 VC，Tunguz 的视角天然带着会计的冷静。下面把这篇短文拆给关心 AI 成本的人。

![封面](assets/gpt-img/00_cover.png)

## 本期看点

- **token** —— 大模型处理文字的最小计费单位，约等于 0.75 个英文单词或半个汉字。模型每"想"一步、每吐一个字都在烧 token，烧多少直接换算成钱。
- **token-per-result（每结果 token 数）** —— Tunguz 提的新指标：不看模型答得对不对这一个维度，而看它"答对一道题平均花多少 token"。同样答对，花得少的赢。
- **intelligence per dollar（每美元智能）** —— 把模型能力分除以运行成本，得到"性价比分"。两个模型智力分一样，成本低的那个性价比更高。
- **SWE-Bench Verified** —— 一套用真实 GitHub 工单考模型写代码能力的基准，分数越高说明它能独立修复的真实 bug 越多。

## 一、微软在发布卡上加了一栏，把成本摆上了台面

变化的信号藏在一个不起眼的动作里：微软在自家新模型的发布卡（model card，厂商公布模型能力的标准说明书）上，第一次把"平均 token 使用量"列成了一项标准指标。

过去发布卡只比一件事——分数。SWE-Bench 多少分、数学多少分、推理多少分，分越高越能上头条。微软这一栏等于公开承认：光有分数不够，还得告诉你这个分是花多少 token 换来的。

它给的数字很有攻击性。微软的新模型在 SWE-Bench Verified 上拿到 71.6 分，而达成这个分数，按 Tunguz 引用的说法只烧了"Claude Haiku 4.5 大约三分之一的 token"。Haiku 是 Anthropic 主打便宜快的那一档模型，微软挑它当对手，意思很明白——我不光分数能打，连最省的对手我都比它省三分之二。

这一栏一旦成了行业标配，模型公司之间的竞争就多了一条战线。以前发布会上只敢秀分数，现在不敢只秀分数了，因为对手会反问一句：你这分烧了多少 token。

![微软发布卡新增 token 用量指标](assets/gpt-img/01_modelcard.png)

## 二、同样 60 分，一个 3357 美元，一个 4685 美元

Tunguz 真正的证据是一组并排的账。他引用第三方测评机构 Artificial Analysis（专做模型成本与能力独立测算）的数据，把当下两个顶级模型摆在一起：

GPT-5.5 和 Claude Opus 4.8，在 Artificial Analysis 的智能指数（Intelligence Index，把多个基准汇总成一个综合分）上得分相近，都在 60 分上下。但跑完同一套测评，GPT-5.5 花了 3357 美元，Opus 4.8 花了 4685 美元。

同样的智力分，Opus 4.8 贵了将近 40%。

这就是 token-per-result 的全部威力：当两个模型聪明程度肉眼看不出差别时，决定选谁的不再是那 0.1 分的高低，而是这 40% 的差价。对一家每天要跑几百万次推理的公司，40% 不是小数点后的零头，是一整个团队一年的预算。

Tunguz 的潜台词是给采购方的：你在 leaderboard 上看到的排名第一，可能在你的账单上是排名最后。榜单只回答"谁更聪明"，回答不了"在我的用量下谁更便宜"。这两个问题的答案，越来越经常地不是同一个模型。

![同分不同价：GPT-5.5 与 Opus 4.8 成本对比](assets/gpt-img/02_cost_compare.png)

## 三、补贴和"堆 token"的时代结束了

Tunguz 把这事放进了一个更大的判断里，原话是"补贴、堆 token、为少数场景不计成本拼性能的时代，结束了"（the era of subsidies, tokenmaxxing, & all-out performance for many use cases is over）。

"堆 token"（tokenmaxxing）指的是过去两年的一种打法：模型为了把分数刷高，舍得让自己多想几步、多生成几轮、把上下文塞满，反正算力有融资补贴、token 有厂商让利，烧得起。分数好看，账先不算。

支撑"账先不算"的前提正在崩。Tunguz 列了三个现实里的预算崩盘：

Uber 把员工的 AI 编程预算砍了——它原本鼓励全员用 AI，内部还搞排行榜比谁用得多，结果一年的预算四个月就烧光。据 TechCrunch 报道，封顶前单个工程师每月的 token 账单能到 500 到 2000 美元，现在每个 AI 编程工具每人每月封顶 1500 美元，受影响的正是 Claude Code 和 Cursor 这类按 token 计费的工具。

Salesforce 一年要在 Anthropic 的 token 上花 3 亿美元，同时冻结了工程师招聘。CEO Benioff 的算盘是把钱从"招人"挪到"买 token"，让一支约 1.5 万人的工程团队配上 AI 接着干。

微软则在内部多个部门砍掉了 Claude Code 的授权，因为工程师的用量超了预算。

三家公司体量都不小，连它们都开始为 token 账单做减法。Tunguz 用这三个例子证明的不是"AI 没用"，恰恰相反——是 AI 太有用、用得太凶，凶到再不算账就要把预算吃穿。当连大厂都不能给每个场景配最贵的模型时，"哪个场景配哪档模型"就成了必须算的题。

![三家公司的 token 预算崩盘](assets/gpt-img/03_budget_break.png)

## 四、定价逻辑会顺着技术栈往上传

Tunguz 收尾的判断最值得抄：成本压力不会停在模型层，它会顺着整个技术栈一层层往上传。

模型公司之间，比的是 intelligence per dollar——每一美元买到多少智能。这一层微软已经开打。

往上一层是做应用的开发者，他们面对的客户不按 token 付费，客户只关心结果：工单关了几个、代码上线了没、客服 case 解决了几条。所以应用层比的会是 dollars-per-outcome（每个结果花多少钱）——一个 AI 客服解决一张工单成本几毛钱，比另一家便宜，就赢了订单。

Tunguz 把这条逻辑链收成一句话："技术栈里的每一层，现在都得按客户思考的方式来定价——按结果，不是按 token。"（Every layer in the stack now has to price the same way the customer thinks: per result, not per token.）

客户从来不想知道一次对话烧了多少 token，就像你打车不想知道发动机烧了多少油。中间所有按 token 计价的环节，都是把自己的成本结构甩给客户。谁先把定价从 token 翻译成结果，谁就先一步站到客户那一边。

![定价逻辑顺技术栈向上传导](assets/gpt-img/04_stack_pricing.png)

## 对从业者意味着什么

最该做的一件事：给自己建一套 token-per-task 基准，别只盯 leaderboard。

对工程团队和技术负责人：拿你最高频的几个真实任务——修一个典型 bug、写一段标准 CRUD、答一类客服问题——分别用几个候选模型各跑 50 次，记下每次的 token 消耗和成功率，算出"每成功一次平均多少钱"。这张表比任何公开榜单都准，因为它跑的是你的活、你的提示词、你的用量。很可能你会发现，某个榜单上排第三的模型，在你的任务上每结果成本只有第一名的一半——那它就是你该选的第一名。

对企业采购和财务：把 AI 支出当成会随用量指数膨胀的可变成本来管，不是一次性软件采购。Uber 四个月烧穿全年预算不是个例，是"按 token 计费 + 鼓励多用"这个组合的必然结果。提前设人均/团队封顶、上用量看板、按场景分配模型档位（贵的留给真正难的活，便宜的扛日常），是现在就该搭的财务基建。

对创业者：如果你做的是应用层，定价别跟着上游按 token 转嫁，直接给客户报"每个结果多少钱"。把 token 成本的波动自己消化掉、对客户报一个干净的结果价，这本身就是护城河——你帮客户把那道算不清的账算清了。

## 引用

1. Tomasz Tunguz，《Intelligence Per Dollar》（每一美元买到多少智能），2026-06-03：https://www.tomtunguz.com/tokens-per-result
2. TechCrunch：《Uber 烧穿 AI 预算四个月后，给员工 AI 支出封顶》，2026-06-02：https://techcrunch.com/2026/06/02/uber-caps-employee-ai-spending-after-blowing-through-budget-in-four-months/
3. Techloy：《Benioff 称 Salesforce 今年将在 Anthropic token 上花 3 亿美元》，2026：https://www.techloy.com/marc-benioff-says-salesforce-will-spend-300-million-on-anthropic-tokens-this-year/
4. Artificial Analysis 智能指数（模型能力与成本独立测算），数据经 Tunguz 原文引用
