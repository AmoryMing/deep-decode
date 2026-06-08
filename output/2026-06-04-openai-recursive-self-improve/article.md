---
title: OpenAI 写下"AI 已在加速 AI"——这句话出现在一份游说文件的第一段
date: 2026-06-04
type: decode
slug: 2026-06-04-openai-recursive-self-improve
style: default
reader: default
sources:
  - https://x.com/kimmonismus/status/2062517474277675102
  - https://openai.com/index/frontier-safety-blueprint/
  - https://cdn.openai.com/pdf/25752ecb-0e5c-47f9-b9e4-c0f4d76f8d3d/a-blueprint-for-a-federal-framework.pdf
  - https://techcrunch.com/2026/05/28/rsi-is-the-new-agi-and-its-just-as-hard-to-pin-down/
distribute: [email, xiaohongshu]
---

# OpenAI 写下"AI 已在加速 AI"——这句话出现在一份游说文件的第一段

先把这篇文章拆的是什么说清楚：6 月 4 日，X 上拥有大量粉丝的 AI 博主 Chubby（@kimmonismus）截了一段 OpenAI 的原文发出去，配文"OpenAI 刚刚写道"。被截出的那句话是——"我们也看到当今系统中递归自我改进（RSI）的早期迹象：AI 开发本身正被 AI 加速。"这条推文几小时内被点赞数百次，圈子立刻把它当成"OpenAI 官宣 AI 开始自己造自己"的信号。

这篇文章拆的不是一项已被证实的技术突破，而是这句话本身的分量与它的出处。两件事必须先钉死：第一，这是 OpenAI 的官方措辞，不是 Chubby 的概括，原文逐字可查；第二，它出自哪份文件，决定了它该被读成科研发现还是政策话术。回到一手材料，答案很清楚——这句话不在任何技术报告里，它是 OpenAI 6 月 2 日发布的政策蓝图《Democratic Governance of Frontier AI: A blueprint for a federal framework》（《前沿 AI 的民主治理：一份联邦框架蓝图》）的开篇第一段。一份递给美国政府、主张立法建监管机构的游说文件，把"RSI 早期迹象"写在了最显眼的位置。

![封面](assets/gpt-img/00_cover.png)

## 本期看点

- **递归自我改进（RSI）** —— AI 帮助造出更强的 AI，新 AI 再去造更强的，形成正反馈循环。经典定义里这个循环不需要人类介入。
- **联邦框架蓝图** —— OpenAI 这份文件的真实身份。它要的是美国政府立法设监管机构，"RSI 迹象"是论证为何"现在就得管"的开场白。
- **AI 写代码 vs 真 RSI** —— 编程智能体把研发提速是已发生的事实；"AI 自己造自己"是一个强得多、且没有公开证据支撑的主张。两者中间隔着一道大坎。
- **措辞的政治用途** —— 把技术状态描述得越临界，立法的紧迫性就越高。读这句话要连它的诉求一起读。

## 一、被截出的原文，逐字核对

Chubby 的推文文本被 X 截断了，但他贴的截图把 OpenAI 的整段话拍全了。回原文档逐字比对，OpenAI 写的是：

> "The countries that successfully harness artificial intelligence will shape the scientific, economic, and geopolitical trajectory of the 21st century... We also see early signs of recursive self-improvement (RSI) in today's systems: where AI development is itself accelerated by AI. We expect this to increase competitive pressures among developers and nations, and create governance challenges that existing institutions are not equipped to address. As RSI emerges, societies will need ways to shape the trajectory of AI development and ensure that it serves human interests."

（"成功驾驭人工智能的国家，将塑造 21 世纪的科学、经济与地缘政治走向……我们也看到当今系统中递归自我改进（RSI）的早期迹象：AI 开发本身正被 AI 加速。我们预计这将加剧开发者与国家间的竞争压力，并制造现有机构无力应对的治理挑战。随着 RSI 显现，社会将需要找到塑造 AI 发展轨迹的方法，确保它服务于人类利益。"）

转引是准确的，Chubby 没有歪曲。这一点先给 OpenAI 记上。但准确转引和正确解读是两回事——这段话被截出来单独传播时，丢掉了它前后的两个限定。前面那句把整件事框进"国家间竞争、谁驾驭 AI 谁赢得 21 世纪"的地缘叙事；后面那句直接落到"现有机构无力应对，社会需要新办法"。把这两句和中间的 RSI 连起来读，它不是一份观测记录，是一个论证链条：技术到了临界点 → 旧机构管不了 → 所以需要新的（由我们参与设计的）治理框架。

![从被截出的一句话，回到它所在的论证链条](assets/gpt-img/01_quote_chain.png)

## 二、这句话长在一份什么文件上

判断一句话的分量，先看它写在哪。这句"RSI 早期迹象"不是出自模型卡、安全评估报告或研究论文，而是《前沿 AI 的民主治理：联邦框架蓝图》的引言首段。文件作者署名 OpenAI，时间标注 2026 年 6 月 2 日，正文九页，核心诉求一句话能概括：美国联邦政府应当建立一套"持久的"前沿 AI 治理框架，把现有的零散措施——白宫自愿承诺、加州 SB 53、纽约 RAISE 法案、伊利诺伊 SB 315——收编进统一的联邦法律，并强化 CAISI（美国 AI 标准与创新中心）作为评估前沿模型的主管机构。

文件里有一段把意图说得很直白：

> "决定 AI 创新节奏的权力，不应留给任何单一实验室、公司或特殊利益集团。这些选择应当通过民主程序作出。"

这话听起来是在约束 OpenAI 自己，但放在游说文件的语境里，它的功能是为"政府该立法介入"背书。一家最前沿的实验室主动说"别让我们自己说了算"，既占了道德高地，又把规则制定的桌子搬到了它能坐上去的地方——文件通篇在讲该设哪些机构、用哪些已有标准、谁来做预部署评估，而 OpenAI 正是这些流程现成的参与方。

"RSI 早期迹象"在这套结构里扮演的是发令枪。把当前技术状态描述得越接近临界，"现在就必须立法"的紧迫性就越强。这不是说 OpenAI 在撒谎，而是说这句话被选中放在第一段，服务的是治理诉求，不是在汇报一项科研里程碑。

![这句话的真实文件身份：一份递给政府的治理蓝图，不是技术报告](assets/gpt-img/02_document_anatomy.png)

## 三、RSI 是什么，以及"早期迹象"这个词的弹性

递归自我改进，经典定义是一个不需要人的闭环：AI 设计出更强的 AI，更强的那个再设计更强的，能力像滚雪球一样自我加速。这个概念几十年前就有，它一直是"智能爆炸"叙事的技术内核，也是为什么它一出现就能点燃圈子——它指向的是失控的拐点。

OpenAI 用的措辞是"early signs"（早期迹象），不是"RSI 已发生"。这个词留足了退路：既能让读者脑补出"拐点临近"，又能在被追问时退回"我们只说看到迹象"。问题在于，"AI 开发被 AI 加速"这个被它当作 RSI 迹象的现象，和经典 RSI 之间隔着一道关键的坎——有没有人在回路里。

这道坎，OpenAI 自己的文件没有展开，但行业里有人说得很清楚。乔治城大学 CSET 的 Helen Toner 在被问到实验室是否在 RSI 时区分得很干脆：

> "他们只是在尽可能多地用 AI。我认为这和 RSI 的经典定义不一样——经典定义真正说的是，不再需要人类。"

谷歌 CEO 桑达尔·皮查伊（Sundar Pichai）谈到有意义的递归系统时也直接承认"我们还没到那一步"。换句话说，"AI 帮我们写更多代码、做更多实验"和"AI 不需要人就能自我升级"，是两个量级的命题。OpenAI 把前者的现象，套上了后者的术语。

![RSI 经典定义 vs OpenAI 所指：差在"人还在不在回路里"](assets/gpt-img/03_rsi_definition_gap.png)

## 四、哪些是真的，哪些是强主张

把营销话术和真实拐点分开，最好的办法是看具体证据落在哪一档。

真实的、有据可查的那一档：编程智能体确实在给 AI 研发提速。这不是空话。据 TechCrunch 5 月底那篇梳理 RSI 概念的报道，有 Claude Code 重度用户报告"接近 100%"的代码由工具写成；Anthropic 内部 18 名工程师里有 5 人认为某代内部模型已能替代中级程序员；机器学习智能体在 Kaggle 竞赛里拿下 28 枚奖牌。这些是可验证的工程进展，它们支撑的命题是"AI 大幅提升了 AI 团队的研发产能"——这一点没有争议。

强主张、缺公开证据的那一档：从"提速研发"到"递归自我改进"。同一篇报道援引的内部评估指出，当前模型最大的短板恰恰是自主性相关的能力——"自主管理为期一周的模糊任务、理解组织优先级、品味、验证、遵循指令、认识论"。这些全是真 RSI 必需的环节。一个连"自己定一周的活、自己判断做得对不对"都做不稳的系统，离"不需要人的自我升级闭环"还很远。

所以这句"RSI 早期迹象"的诚实读法是：它把第一档（真实的提速）当作第二档（递归闭环）的证据来用，而两档之间那道由人类把关的坎，OpenAI 没有给出任何已被跨过的迹象。TechCrunch 那篇报道的标题本身就是判断——"RSI 是新的 AGI，同样难以界定"。一个边界模糊、人人能往里塞自己定义的词，被放在游说文件的第一段，这件事比"AI 是否真在自我改进"更值得从业者警觉。

![两档证据：真实的研发提速，与缺证据的"自我改进"强主张](assets/gpt-img/04_evidence_tiers.png)

## 对从业者意味着什么

最实际的一条：别被一句被截图传播的官方措辞带节奏。这句话的正确处理方式不是转发"OpenAI 官宣 RSI"，而是点开它的出处，确认它是一份治理游说文件的开场白，再决定它值多少分量。一手材料的语境，往往比那句被反复转发的金句更说明问题。

对做 AI 工程和研究的人：把"AI 在加速 AI 研发"当成已发生的生产力事实去用——编程智能体、自动化实验、代码生成，这些是真红利，该上就上。但把"递归自我改进"当成一个尚未兑现的强主张去对待，别在它上面做战略押注，更别拿它去吓投资人或团队。判断一个系统是否接近 RSI，看的不是它写了多少代码，是它能不能在没有人把关的情况下，自己定义任务、自己验证结果、自己迭代——这几项现在都没站稳。

对关注 AI 治理和政策的人：留意"技术临界感"正在成为立法游说的标准修辞。当一家公司在递给政府的文件里，把当前技术状态描述得越危急、越超出现有机构的应对能力，它就越能为"需要新框架、新机构"背书——而它自己往往是这些新框架现成的座上宾。读这类文件，要把它的技术描述和它的诉求绑在一起读，单看哪一半都会失真。

## 引用

1. Chubby（@kimmonismus）转引 OpenAI 原文的推文（2026-06-04）："OpenAI 刚刚写道：我们也看到当今系统中递归自我改进（RSI）的早期迹象……"——https://x.com/kimmonismus/status/2062517474277675102
2. OpenAI，《A blueprint for democratic governance of frontier AI》（《前沿 AI 的民主治理：联邦框架蓝图》，2026-06-02 发布），RSI 原文出自引言首段——https://openai.com/index/frontier-safety-blueprint/ ；PDF 全文 https://cdn.openai.com/pdf/25752ecb-0e5c-47f9-b9e4-c0f4d76f8d3d/a-blueprint-for-a-federal-framework.pdf
3. TechCrunch，《RSI is the new AGI — and it's just as hard to pin down》（《RSI 是新的 AGI，同样难以界定》，2026-05-28）——含 Helen Toner、Sundar Pichai 表态及编程智能体提速研发的具体数据——https://techcrunch.com/2026/05/28/rsi-is-the-new-agi-and-its-just-as-hard-to-pin-down/
