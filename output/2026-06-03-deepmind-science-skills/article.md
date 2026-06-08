---
title: 大模型不缺智力，缺一个"事实接口"——DeepMind 把领域知识做成了开源 skills
date: 2026-06-03
type: decode
slug: 2026-06-03-deepmind-science-skills
style: default
reader: default
sources:
  - https://x.com/googleaidevs/status/2061924472245153863
  - https://github.com/google-deepmind/science-skills
distribute: [email, xiaohongshu]
---

# 大模型不缺智力，缺一个"事实接口"——DeepMind 把领域知识做成了开源 skills

直接问一个通用大模型某个基因变异是不是致病、某个蛋白的三维结构长什么样，它多半会编一个像模像样的答案给你。它不是不够聪明，是它手里没有那本权威字典——专业领域的事实，从来不在模型的脑子里，在 ClinVar、UniProt、AlphaFold 这些数据库里。

Google AI Developers 这条推文宣布的东西，正是给这个缺口补的接口：**Science Skills**，一组面向科研的开源 agent skills，已经放上 GitHub。它的官方定位是"加速你的 agentic 科研工作流，带来科学的 grounding 和更高的 token 效率"。把这句话翻译成人话：让 AI agent 做科研时，答案锚在可核实的真实数据库上（少幻觉），同时不用把整个数据库塞进上下文（省 token）。这件事本身不大，但它发生在哪一方、用的是谁定的格式，是真正值得拆的信号。

![大模型不缺智力，缺一个事实接口](assets/gpt-img/00_cover.png)

## 本期关键词

- **agent skill** —— 给 AI agent 的一个能力包：一份写给模型看的指令（`SKILL.md`）+ 一组可执行脚本 + 可选的参考文档。模型需要某项专业能力时按指令调用，平时不占用上下文。
- **grounding（事实接地）** —— 让模型的输出锚定在可核实的外部事实上，而不是凭参数里的模糊记忆生成。问基因就去查 ClinVar，而不是"回忆"。
- **token 效率** —— 同样一件事用更少的上下文 token 完成。把数据库塞进 prompt 是最费 token 的做法；按需调脚本取回那一条结果，是最省的做法。
- **AlphaFold / AlphaGenome** —— DeepMind 的两个科学模型。前者预测蛋白质三维结构（AFDB 是它产出的结构数据库），后者预测基因组序列变异的功能影响。Science Skills 把它们当作可调用的数据源接进来。

## 一、它是什么：一个 skill 就是"指令 + 脚本 + 数据接口"

![它是什么：指令+脚本+数据接口](assets/gpt-img/01_what.png)

先把东西说清楚，否则后面都是空话。

Science Skills 是一个 GitHub 仓库，里面装着一批针对科研的 skill。每个 skill 的结构是固定的三件套：一份 `SKILL.md`（带 YAML frontmatter，写清这个 skill 干什么、何时用、怎么用，这是给模型读的说明书）、若干辅助脚本（真正去干活的代码，比如查某个数据库、解析某种格式）、以及可选的参考文档。安装一行命令：`npx skills add google-deepmind/science-skills/`，装完可以接到 Google 的 agent 平台 Antigravity 上跑。

覆盖面是它的硬指标：集成 **30 多个数据库和工具**，点名的有 AlphaGenome、AFDB（AlphaFold 蛋白结构数据库）、UniProt（蛋白质序列与功能注释）、ClinVar（基因变异与临床意义）、OpenAlex（学术文献检索），横跨基因组学、结构生物学、化学信息学、文献检索几个方向。其中有的需要 API key（AlphaGenome、OpenAlex），有的不用 key 也能用（ClinVar 无 key 可跑，有 key 只是放宽速率上限）。

判断：这套结构里没有任何新模型、没有新算法。它是一层**封装**——把"一个科学家知道该去查哪个库、用什么参数查、怎么读结果"这套领域常识，写成模型能照着执行的指令和脚本。值钱的不是脚本本身，是那份把专业 know-how 翻译给 agent 的 `SKILL.md`。

## 二、为什么需要它：通用模型不缺智力，缺事实接口

![为什么需要：补的是事实接口](assets/gpt-img/02_why.png)

通用大模型在专业领域的问题，从来不是推理能力不够，是它的知识有两个先天毛病：一是过时（训练数据有截止日，新发现的变异、新解出的结构它不知道），二是会编（参数里存的是统计意义上"像答案的东西"，不是查证过的事实）。问它一个具体蛋白的结合位点，它能给你一段流畅的、错的。

解决这个，业界其实只有三条路，Science Skills 选了第三条：

第一条是**塞进上下文**——把相关数据库内容贴进 prompt 让模型现读。问题是数据库动辄上亿条目，塞不下，塞一部分还费 token，每次都重新塞更费。第二条是**微调**——拿领域数据再训一遍模型。问题是贵、慢、数据一更新就得重训，而且微调进去的事实照样会被模型"记串"。第三条是 skill：不把知识灌进模型，而是给模型一个**按需取用的接口**——需要查 ClinVar 时，模型读 `SKILL.md` 学会怎么调，脚本去库里取回那一条精确结果，用完即走。

这一条同时把 grounding 和 token 效率两件事一起办了：取回的是数据库里的真实记录（接地、可核实，少幻觉），而上下文里只多了那一条结果，不是整个库（省 token）。这就是官方那句"better grounding and higher token efficiency"的全部机制——不是模型变聪明了，是把"查证"这个动作从模型脑内挪到了脚本外部。

## 三、真正的信号：skills 正在变成跨厂的 agent 能力格式

![skills 成了跨厂能力格式](assets/gpt-img/03_signal.png)

如果只看到"DeepMind 出了个科研工具包"，就漏掉了最重要的一层。

Agent Skills 这套格式——一个 `SKILL.md` 带 YAML frontmatter，配脚本和参考文档，由模型按需加载——是 **Anthropic 发起并定义的开放标准**。现在 DeepMind 这个团队采纳了同一套格式，来分发自己的科学能力。安装命令用的是通用的 `npx skills add`，而不是任何一家专属的包管理器。这意味着：一个用 Anthropic 标准写的 skill，和一个 DeepMind 写的 skill，理论上能被同一个支持该标准的 agent 加载。

判断：这是 skills 从"某一家的功能"走向"跨厂能力分发格式"的第一个明确信号。它的意义对照历史看更清楚——当年 Language Server Protocol（一种编辑器与语言工具之间的通用协议）让任何编辑器都能用任何语言的智能补全，谁定义了被广泛采纳的格式，谁就坐在了生态的中心。Agent 时代的对应物，就是"能力包"用什么格式分发。Anthropic 定标准、DeepMind 用标准，这一来一回，比这个工具包本身能查多少个数据库重要得多。

仓库里还有个容易被略过的细节：明确标注 **"This is not an official Google product."（这不是 Google 的官方产品）**。许可上，代码是 Apache 2.0，其它材料是 CC-BY 4.0，接进来的第三方数据源各有各的条款。这个标注不是免责套话——它说明这是 DeepMind 团队层面的开源动作，不是公司级的产品承诺。一个非官方的团队项目就采用了竞争对手发起的标准，恰恰说明这套格式的吸引力跑在了公司战略博弈的前面。

## 对从业者意味着什么

![对从业者：封装成 skill](assets/gpt-img/04_takeaway.png)

把这件事压成一句：**给 agent 补专业能力，正确的做法不是把知识塞进 prompt、也不是微调，而是封装成一个标准化的 skill——指令 + 脚本 + 数据接口。**

- **做垂直领域 AI 的**：这是范式参考。你的领域知识（行业数据库、专有 API、内部规则）别再往 prompt 里堆或者拿去微调，把它写成 skill：一份给模型看的 `SKILL.md` 说清"何时用、怎么调"，脚本负责真正取数。这样既给 agent 可核实的事实 grounding，又省上下文。照着 Science Skills 仓库里现成的 `SKILL.md` 抄结构是最快的起步方式。
- **关注标准可移植性的**：押注 skill 这套格式时，把"能不能被多家 agent 加载"当成一等公民来设计。一个写得符合开放标准的 skill，资产价值远高于绑死某一个平台的插件——DeepMind 用 Anthropic 的标准这件事，就是可移植性正在兑现的证据。
- **做科研 / 生信的**：可以直接试。`npx skills add google-deepmind/science-skills/` 装上，ClinVar 无 key 就能跑，AlphaGenome、OpenAlex 备好 API key。但记住它的定位是给 agent 工作流当事实接口，不是替你做判断——它解决"查得准、查得省"，最后的科学结论仍然要你来担责。
- **对所有人**：模型幻觉这个老问题，正在从"让模型更诚实"（治不好，裁判和球员同一个）转向"给模型一个外部的事实接口"（用结构解决）。看到一个 AI 在专业领域不胡说，多半不是因为它更聪明，是因为有人在背后给它接了一个能核实的库。

## 引用

1. Google AI Developers 推文（宣布 Science Skills 开源）："Building autonomous agents for scientific discovery? @GoogleDeepMind Science Skills is now available on GitHub."（在为科学发现构建自主 agent？DeepMind 的 Science Skills 现已上线 GitHub。我们开源这套专业工具包，用科学的 grounding 和更高的 token 效率，加速你的 agentic 工作流。）：https://x.com/googleaidevs/status/2061924472245153863
2. google-deepmind/science-skills GitHub 仓库（安装命令、30+ 数据源清单、Apache 2.0 / CC-BY 4.0 许可、"This is not an official Google product." 声明）：https://github.com/google-deepmind/science-skills
