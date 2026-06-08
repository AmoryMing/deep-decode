---
title: OpenAI 给自己最危险的能力上锁——读《智能时代的生物防御》
type: published
created: 2026-06-05
updated: 2026-06-05
style: default
distribute: [email, xiaohongshu]
tags: [OpenAI, 生物安全, AI治理, 双用途, 前沿实验室]
---

# OpenAI 给自己最危险的能力上锁——读《智能时代的生物防御》

5 月 29 日，OpenAI 发布《智能时代的生物防御》（Biodefense in the Intelligence Age），把一份本该藏在合规部门抽屉里的东西摆到了台面上：它正在主动给自己最危险的能力建一道墙，并且想让全行业一起出钱建墙。

这件事值得拆开看，因为它不是一篇普通的安全声明。生物是 AI 所有能力里最锋利的一把双刃刀——同一个能预测突变酶如何治病的模型，也能预测一种新病原体如何绕过人体免疫系统。OpenAI 这次做的，是把"防御"本身做成一套产品、一笔投资、一份立法提案和一套内部门禁，四件事同时上。把这四件事连起来看，你会发现它和本周另外两条线——Anthropic 披露恶意账户与漏洞、几家前沿实验室联名上书国会——其实是同一个动作：**前沿实验室不再等监管者来定规则，而是自己先把规则写出来。**

![封面](assets/gpt-img/00_cover.png)

## 本期看点

- OpenAI 把生物防御做成了"工具 + 投资 + 立法 + 门禁"四件一起的组合拳，不是单点声明
- 它的旗舰生物模型 GPT-Rosalind 至今不公开发布，只给政府、公共卫生伙伴和经审核的开发者——这是"主动留一手"
- 6 月 4 日 OpenAI、Anthropic、微软、谷歌的 CEO 联名上书国会，要求强制 DNA 合成订单筛查——竞争对手在安全议题上罕见同框
- 把防御做成议程，既是承担责任，也是抢占"谁来定义 AI 双用途治理"的话语权

## 同一个模型，能治病也能造病

要理解 OpenAI 为什么这么紧张，先得理解它手上有什么。

4 月 16 日上线的 GPT-Rosalind，名字取自用 X 射线衍射拍下 DNA 结构的化学家罗莎琳·富兰克林。OpenAI 把它定义为"前沿推理"级别的生命科学模型，能在复杂基因组、分子结构操作和细胞通路模拟上做推理。最新版本把 GPT-5.5 的智能体编码能力，和药物化学、基因组学、多模态生命科学研究的能力合在一起。

这是一台能加速疫苗设计、能筛查突变酶的机器。OpenAI 自己给出的那句话，把双用途的本质说穿了：**"一个能预测突变酶如何治愈疾病的模型，也能预测一种新病原体如何绕过免疫系统。"** 治病的推理和造病的推理，在数学上是同一种推理。你没法只训练前者、不训练后者。

这就是"双用途"（dual-use）的字面含义——同一项能力，换个意图就从救命变成杀人。核技术、密码学历史上都踩过这条线，但生物有个更要命的特点：门槛在快速塌掉。过去要造一种危险病原体，需要导师、实验室、多年训练这些"隐性知识"门槛挡着。一个足够强的模型，能把这些门槛一段一段填平。OpenAI 和同行在联名信里用的词是"meaningfully erode"——历史上挡住坏人的知识壁垒，正在被实质性地侵蚀。

![同一模型的双刃](assets/gpt-img/01_dual_use.png)

## 它先把自己的旗舰模型锁起来了

判断一家公司是不是认真对待风险，最硬的指标不是它说了什么，是它愿意不卖什么。

GPT-Rosalind 至今**不公开发布**。理由就是双用途风险。能用它的只有三类：经过挑选的政府机构、盟友级的公共卫生伙伴、经过审核的开发者。换句话说，OpenAI 把自己最强的生物模型，主动关在了一道门禁后面——这台机器能挣的钱，它没去挣。

这道门禁不是凭感觉拍的。OpenAI 有一套叫"准备度框架"（Preparedness Framework）的分级制度，给模型的生物能力打档，能力越过某条线就强制升级防护。2025 年 7 月发布的 ChatGPT Agent，是它第一个被判定为生物领域"高能力"（High capability）的产品。

注意这里的精确措辞。OpenAI 说，它**并没有确凿证据**证明这个模型真能实质性地帮一个外行造出严重生物危害——而"能帮外行造出严重危害"恰恰是"高能力"档的定义门槛。但它还是按"高能力"处理了。这是"宁可错杀"的预防式姿态：证据不足时，往严的一边站。激活的防护是一整套——拒绝可能用于制造生物武器的提问、把可疑请求标记给专家复审、硬性拦截高风险内容、加快异常响应、对滥用迹象做持续监控。核安全倡议组织（NTI）把这套做法称为"为行业树立标杆"。

把这条线拉长看：OpenAI 的整体策略是"分层韧性"——准备度评估、生物专项能力测试、对双用途请求的更安全模型行为、监控与执法、专家红队、针对高风险能力的安全控制。一层套一层，不指望单点防线万无一失。

![准备度框架的门禁](assets/gpt-img/02_preparedness.png)

## 防御不只是防，还要主动建能力

锁住危险能力是防守的一半，另一半是把防御能力真正建起来。这才是《智能时代的生物防御》这份计划的正题：它要的不是"别出事"，是"出了事社会扛得住"——更早发现威胁、更快研发对策、更有协调地应对危机。

落地的方式，是 Rosalind 生物防御计划：把 GPT-Rosalind 给到"可信开发者"，由 OpenAI 赞助访问并提供上线支持，用在流行病学建模、早期检测、订单筛查、防范准备和非药物干预这些公共卫生场景。已经在跑的合作很具体：

劳伦斯·利弗莫尔国家实验室，把 GPT-Rosalind 接到超算上测试对抗手段。约翰斯·霍普金斯应用物理实验室，把模型嵌进蛋白质平台筛查突变酶。流行病防范创新联盟（CEPI），在一次正在发生的埃博拉疫情里用它加速疫苗设计。Fourth Eon Biosecurity，扫描 DNA 合成订单、标记恶意基因序列——它的联合创始人 Gary Abel 给的判断是："稳健的筛查能提升在风险扩散之前发现并阻断危险 DNA 订单的能力。"

钱也跟上了。自 2025 年中以来，OpenAI 向两家生物安全初创公司投了约 4500 万美元：领投 Red Queen Bio 的 1500 万美元种子轮（专攻"AI 能力越来越容易获取所带来的生物风险"），以及 Valthos 的 3000 万美元（做病原体的实时识别和早期预警）。

把这些拼起来，OpenAI 不是在发一篇博客，是在搭一个生态——它出模型、出钱、出渠道，把"防御方"这一侧的能力做厚。逻辑很直白：如果进攻能力（造病原体的门槛塌方）注定要随模型变强而上升，那唯一能对冲的，是让防御能力（检测、对策、筛查）涨得更快。

![建防御生态](assets/gpt-img/03_ecosystem.png)

## 当对手在安全议题上同框

单家公司锁自己的模型、建自己的生态，都还在"自扫门前雪"。这套议程真正的野心，在 6 月 4 日露了出来。

那天，OpenAI 的 Sam Altman、Anthropic 的 Dario Amodei、微软 AI 的 Mustafa Suleyman，连同谷歌 DeepMind 的负责人、一批诺奖得主和生命科学专家、跨党派的国家安全老兵，以及真正在生产合成 DNA 的厂商（Twist Bioscience、Ansa Biotechnologies），共同签署了一封信：《支持强制核酸合成筛查与记录留存》（In Support of Mandatory Nucleic Acid Synthesis Screening and Recordkeeping），由 Institute for Progress 和 Foundation for American Innovation 牵头。

平时打得头破血流的对手，在这件事上罕见同框。信里的要求很具体：强制销售合成 DNA、RNA 的公司筛查可疑订单，发货前核验客户身份；保留订单和序列记录以便追溯；把现在自愿的行业筛查，升级成有法律约束力的硬规定。这封信指向的立法，是 2 月由参议员 Tom Cotton 和 Amy Klobuchar 两党共同提出的《2026 年生物安全现代化与创新法案》——要求卖家筛查订单与客户，同时豁免无害材料。

这一步把整件事的性质讲清楚了。锁自己的模型，OpenAI 只能管住自己；但 DNA 合成订单是物理世界的最后一道闸——再强的模型设计出危险序列，也得有厂商把它合成成真东西。把这道物理闸用法律锁上，才是真正能兜底的防线。所以前沿实验室一起去推，不只是为了避险，也是在主动定义"双用途 AI 该怎么治理"——在监管者还没想清楚之前，先把答案写好递过去。

![把规则递给监管者](assets/gpt-img/04_writing_rules.png)

## 对从业者意味着什么

如果你做 AI 产品或政策，这件事给三个可操作的信号。

第一，双用途不再是边缘话题，正在变成产品设计的硬约束。OpenAI 把最强模型锁在门禁后、按"高能力"档主动加防护，这套"准备度框架"式的能力分级 + 阈值触发防护，很可能成为前沿模型的默认范式。你如果在做有滥用风险的能力，提前想清楚"能力越线时怎么自动收紧"，比事后被监管追着补要主动得多。

第二，"自己先写规则"是这一周的共同主线。OpenAI 这份生物防御计划、Anthropic 披露恶意账户与漏洞、四家实验室联名上书——表面是三件事，底层是同一个动作：前沿实验室在监管真空里抢先定义安全标准。这既是责任，也是话语权——谁先把"什么算安全""该筛查什么"写成可执行的方案，谁就在未来的规则里占了先手。

第三，防御是一门正在打开的生意。OpenAI 向 Red Queen Bio、Valthos 投的钱，国家实验室、CEPI、Fourth Eon 接入 GPT-Rosalind 的合作，说明"AI 驱动的生物防御"——检测、对策、筛查、预警——是一条真在投钱、真有买家的赛道。攻击能力会随模型变强而水涨船高，对冲它的防御能力是刚需。这条线值得盯。

## 引用

1. OpenAI, "Biodefense in the Intelligence Age", 2026-05-29. https://openai.com/index/biodefense-in-the-intelligence-age/ （主信源；本文撰写时该页有 Cloudflare 验证墙，正文事实经下列多源交叉核实）
2. OpenAI, "Strengthening societal resilience with Rosalind Biodefense". https://openai.com/index/strengthening-societal-resilience-with-rosalind-biodefense/
3. OpenAI, "Preparing for future AI capabilities in biology". https://openai.com/index/preparing-for-future-ai-capabilities-in-biology/
4. Axios, "Exclusive: OpenAI launches biodefense program", 2026-05-29. https://www.axios.com/2026/05/29/openai-biodefense-program
5. Interesting Engineering, "OpenAI partners with US govt for bio-weapons detection and threat preparedness". https://interestingengineering.com/science/openai-us-government-national-labs-biosecurity
6. Fortune, "AI CEOs from OpenAI, Anthropic, and Microsoft set aside their rivalry to warn Congress…", 2026-06-05. https://fortune.com/2026/06/05/openai-anthropic-microsoft-ceos-congress-bioweapon-safeguards/
7. The Foundation for American Innovation, "In Support of Mandatory Nucleic Acid Synthesis Screening and Recordkeeping", 2026-06-04. https://www.thefai.org/posts/in-support-of-mandatory-nucleic-acid-synthesis-screening-and-recordkeeping
8. NTI, "ChatGPT Agent Setting Industry Leading Example for Biosecurity Safeguards". https://www.nti.org/risky-business/chatgpt-agent-setting-industry-leading-example-for-biosecurity-safeguards/
9. Fortune, "OpenAI warns that its new ChatGPT Agent has the ability to aid dangerous bioweapon development", 2025-07-18. https://fortune.com/2025/07/18/openai-chatgpt-agent-could-aid-dangerous-bioweapon-development/
