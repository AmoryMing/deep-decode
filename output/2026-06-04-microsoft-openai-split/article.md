---
title: 微软不想再当 OpenAI 的发行渠道：Build 2026 上，盟友变成了对手
date: 2026-06-04
type: decode
slug: 2026-06-04-microsoft-openai-split
style: default
reader: default
sources:
  - https://www.theverge.com/ai-artificial-intelligence/942242/microsoft-build-ai-agents-openai-competition
  - https://www.semafor.com/article/06/02/2026/microsofts-ai-chief-on-the-greatest-game-of-catchup-ever-played
  - https://www.euronews.com/next/2026/06/03/microsoft-launches-its-own-ai-models-to-take-on-openai-and-anthropic
  - https://www.cnbc.com/2026/04/27/openai-microsoft-partnership-revenue-cap.html
distribute: [email, xiaohongshu]
---

# 微软不想再当 OpenAI 的发行渠道：Build 2026 上，盟友变成了对手

微软给了 OpenAI 130 亿美元，把 GPT 塞进 Office、Bing、Azure 和 GitHub Copilot，做了三年它最大的金主和最大的渠道。2026 年 6 月 2 日的 Build 大会上，微软 AI 负责人 Mustafa Suleyman 站出来，一口气发布七个完全自研的前沿模型，等于公开宣布：这段关系从结盟转成了正面竞争。他给微软定的目标不是"继续卖 OpenAI"，而是"成为全世界排名前四的实验室"——而他承认，今天微软还排不进去。

这件事的核心判断不在某一款模型多强，而在一个平台公司想清楚了一件事：**不能把自己的命脉押在单一模型供应商手里。** 下面把这场转向拆给关心 AI 格局和企业采购的人。

![封面](assets/gpt-img/00_cover.png)

## 本期看点

- **MAI Superintelligence Team** —— 微软 2025 年 11 月成立、由 Suleyman 亲自带的"超级智能"团队，目标是从零自研前沿模型，这次 Build 是它的出道秀。
- **Distillation（蒸馏）** —— 用一个强模型的输出去训练另一个模型，相当于"抄学霸的答案"。微软强调自己的新模型"不做蒸馏、从头自训"，是在划清和 OpenAI 的技术血缘。
- **Harness（执行外壳）** —— 模型外面那层调用工具、跑代码、连 VS Code 和 GitHub 的工程框架。Suleyman 说模型必须"为 harness 调优"，谁的 harness 顺手谁就赢真实场景。
- **营收分成上限（revenue share cap）** —— 微软改判 OpenAI 关系的财务转折点：原本可能高达 1350 亿美元的分成，2026 年 4 月被改写为 380 亿封顶。

## 一、先看微软掏出了什么

判断要落在证据上，先看发布的东西硬不硬。Build 2026 上，微软一次性放出七个自研前沿模型，覆盖图像、语音、转录、推理、编码。旗舰是 **MAI-Thinking-1**——微软的第一个推理模型，350 亿激活参数，明确标注"在干净的、有商业授权的数据上从头训练，不蒸馏任何第三方系统"。

这句"不蒸馏"是说给 OpenAI 听的。过去外界普遍认为微软的 Copilot 本质是 GPT 的二次包装；现在微软要证明自己有独立的、从数据到权重都自己攥着的模型 IP。

效果上微软给了两个数字。第一，据评测公司 Surge 的盲测，MAI-Thinking-1 在编码基准上超过 Anthropic 的 Claude Sonnet 4.6、追平 Claude Opus 4.6。第二，Suleyman 称在为咨询公司麦肯锡做了专门调优后，模型质量超过 OpenAI 的 GPT-5.5，而且号称成本效率好十倍。还有一款 **MAI-Code-1-Flash**，已经直接接进了 GitHub Copilot 和 Visual Studio Code。

成本效率十倍是关键。微软不需要自研模型在绝对能力上碾压 OpenAI——它只需要一个"够好且便宜得多"的替代品，就能把自己每年付给 OpenAI 的钱省下来，同时把 Copilot 的毛利做厚。

![七个自研模型与定位](assets/gpt-img/01_models.png)

## 二、Suleyman 说的不是产品，是态度

发布会真正的信号在 Suleyman 的措辞里。他对微软的位置毫不掩饰：

> "我们的目标是证明自己能成为全世界排名前四的实验室。"

他点名了今天真正算数的三家——Google DeepMind、OpenAI、Anthropic，然后承认微软还不在这个名单里。一家市值数万亿的公司，由 AI 负责人公开说"我们还排不进前四、要从头证明自己"，这本身就是一种战略宣言：以前微软的 AI 故事是"我们投了最强的 OpenAI"，现在的故事变成"我们要亲手成为最强之一"。

他对追赶速度同样直白：

> "我们六个月就走到了这里，这本身就是了不起的成就。我们现在和几个月前的业界顶尖水平基本打平。"

> "我们是世界上最大的科技公司之一，我们有足够的资源确保自己追得上。"

注意他的逻辑：不是"我们已经领先"，而是"我们有钱、有算力、有时间，所以一定追得上"。这是平台巨头的典型打法——用资源把时间差熬平。Semafor 把这场追赶称为"史上最大的一场追赶游戏"，Suleyman 没有反驳，反而把"六个月追平半年前的 SOTA"当成卖点来讲。

![Suleyman 的三句判断](assets/gpt-img/02_quotes.png)

## 三、关系是怎么从结盟走到对手的

要看懂这次转向，得把微软和 OpenAI 这几年的账翻出来。

2019 年微软投 OpenAI 10 亿美元起步，2023 年 1 月追加约 100 亿，累计承诺超过 130 亿，成为它的锚定投资人，换来的是把 GPT-4 在几个月内嵌进 Office、Bing、Azure 和 GitHub Copilot 的独家位置。到 2025 年 9 月，130 亿里已经打了 116 亿。微软至今仍持有 OpenAI 约 27% 股份。

转折发生在 2026 年 4 月。两家重谈了合作条款：OpenAI 付给微软的营收分成被改成"设总额上限"——原本按老协议可能高达 1350 亿美元的分成，被封顶在 380 亿，但会一直付到 2030 年，且"与 OpenAI 的技术进展脱钩"。同时 OpenAI 被松绑，可以在 AWS 和 Google Cloud 上卖自己的服务，不再被微软独家绑定。

Suleyman 在受访时把这次重谈称作微软能"自己掌握 AI 命运"的最关键一步。逻辑很顺：独家绑定一旦解除，OpenAI 可以去找别的云，微软也就没有理由继续只当 OpenAI 的发行渠道。**绑定松开的那一刻，双方都从"必须互相成就"变成了"各自去抢同一块市场"。**

CEO 纳德拉把这层意思讲得更体面：

> "我们认为，时候到了——每家公司都该从'消费一个前沿模型'，转向'完整地参与到前沿本身'。"

翻译过来就是：微软不想再只做 OpenAI 的客户和柜台，它要自己站到模型前沿的牌桌上。

![从结盟到竞争的时间线](assets/gpt-img/03_timeline.png)

## 四、为什么平台公司一定会自研

这不是微软一家的偶然。把视角拉开，规律很清楚：任何一个把 AI 当命脉的平台公司，最终都不愿意把模型这一层押在别人身上。

原因有三层，且彼此咬合。成本上，微软每年付给 OpenAI 的推理和授权费是实打实的现金外流，自研一个"够用且便宜十倍"的模型，等于把这笔钱收回自己口袋，还顺手把 Copilot 的毛利做厚。控制权上，模型是产品的发动机，发动机握在供应商手里，路线图、涨价、断供全看对方脸色——这是任何平台公司都受不了的单点依赖。议价权上，自己手里有一个能打的模型，再去和 OpenAI、Anthropic 谈条件，腰杆才硬。

这条逻辑和微软同期那条"自研模型省成本"的线是同一件事的两面：省成本是账面动机，去单点依赖是战略动机。微软投了 OpenAI 130 亿、又投了 Anthropic 最多 50 亿，两家的模型都挂在 Azure 上卖——它从一开始就在做多模型对冲，自研只是把这盘对冲补上最后一块、也是最关键的一块：自己也能造。

![平台公司为什么必然自研](assets/gpt-img/04_why.png)

## 对从业者意味着什么

对企业采购方：别把单一模型供应商当成长期默认项。微软这个全球最大软件公司都在用脚投票做多模型化，说明"今天选了谁的模型、明天就一直用谁"的假设正在失效。采购时优先选能在多家模型间切换的架构和供应商，把"可替换性"写进合同，别让自己被任何一家的涨价或路线图变更卡脖子。

对创业者：模型层正在被巨头用资源熬平——微软六个月就追到半年前的 SOTA，靠的是钱和算力，不是奇迹。在模型层硬刚巨头几乎没有胜算；真正的机会在巨头不愿意做或做不细的垂直场景、在 harness 这层把工具和工作流接顺。Suleyman 反复强调"模型要为 harness 调优""要成为用 VS Code 和 GitHub 最强的模型"——他在提醒所有人，决定真实采用率的往往不是榜单分数，而是模型外面那层工程外壳顺不顺手。

对所有人：当微软、OpenAI、Anthropic、Google 互相又投资又竞争、模型在彼此的云上交叉售卖时，"盟友"和"对手"的边界已经没有意义。判断一家公司的真实意图，看它把钱和算力投向哪、把哪一层攥在自己手里，比看新闻稿里的合作措辞靠谱得多。

## 引用

1. The Verge《在 Build 2026，微软全力押注 AI 智能体，与 OpenAI 正面竞争》（At Build 2026, Microsoft goes all-in on AI agents, in competition with OpenAI）：https://www.theverge.com/ai-artificial-intelligence/942242/microsoft-build-ai-agents-openai-competition
2. Semafor《微软 AI 负责人谈这场史上最大的追赶游戏》（Microsoft's AI chief on the greatest game of catchup ever played）：https://www.semafor.com/article/06/02/2026/microsofts-ai-chief-on-the-greatest-game-of-catchup-ever-played
3. Euronews《微软推出自研 AI 模型，正面叫板 OpenAI 与 Anthropic》（Microsoft launches its own AI models to take on OpenAI and Anthropic）：https://www.euronews.com/next/2026/06/03/microsoft-launches-its-own-ai-models-to-take-on-openai-and-anthropic
4. CNBC《OpenAI 重整与微软的合作，为营收分成设上限》（OpenAI shakes up partnership with Microsoft, capping revenue share payments）：https://www.cnbc.com/2026/04/27/openai-microsoft-partnership-revenue-cap.html
