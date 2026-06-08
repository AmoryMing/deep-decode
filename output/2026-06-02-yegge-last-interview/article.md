---
title: 技术面试的最后一夜：当评估比工作本身更假
date: 2026-06-02
source: https://steve-yegge.medium.com/the-last-technical-interview-bc13ddcf4564
author: Steve Yegge
type: decode
slug: 2026-06-02-yegge-last-interview
---

# 技术面试的最后一夜：当评估比工作本身更假

技术面试是软件业最大的"皇帝新衣"——所有人都知道它不准，所有人都继续用。Steve Yegge 有资格下这个判断：他在亚马逊当过 Bar Raiser（抬杠人），还被贝索斯和 Dalzell 拉进"Bar Raiser Core"去定义这个角色本身；后来在 Google Kirkland 的招聘委员会待了好几年，处理过数千份简历。这篇文章他攒了 35 年：

> "This post has been almost 35 years in the making; that's how long I have been conducting technical interviews."（这篇文章酝酿了近 35 年——这就是我做技术面试的年头。）

他的诊断冷得像手术刀：这套流程半个世纪原地踏步。

![信号阶梯与"让工作算两次"](cover.png)

## 一、五十年没变的"演戏"

> "The fundamental process — a short series of 1-hour interviews — hasn't changed in fifty years."（最根本的流程——几场一小时的面试串在一起——五十年没变过。）

更狠的是他给整件事的定性：白板题、临时编的系统设计题，在他眼里全是表演。

> "Whiteboards, made-up design questions — it's all just theater, trying to act like it's real work."（白板、临时编的设计题——全是演戏，假装自己是真实工作。）

他点破的是一个所有工程师都体会过、却没人愿意说破的事实：面试考的那套，和入职后真正干的活，几乎是两码事。它筛的是"擅长面试的人"，不是"擅长工作的人"。

## 二、最锋利的一刀：那次我们把自己开除了

这篇里最锋利的证据，是 Yegge 亲历的"那次我们把自己开除了"。在 Google 招聘委员会，HR 给了他们一批特殊的简历包，说是"校准练习"（calibration exercise）。委员会照常履职，投票拒掉了大约三分之二。然后真相揭晓：那批被匿名化的包，正是委员们自己当年应聘 Google 时的面试包。

> "those were our own packets from when we had all interviewed at Google. The recruiters had tricked us into reviewing our own interview packets, and we had voted not to hire most of our own group."（那些就是我们自己当年应聘 Google 时的面试包。招聘官设了个局，让我们复审自己的面试记录，而我们投票拒掉了自己组里大多数人。）

这不是轶事，是反证：如果同一批被这套流程录用的人，用这套流程会把彼此（以及自己）刷下去，那这套流程测的就不是能力，是噪声。

## 三、信号阶梯：越接近真活越准

Yegge 的建设性在于他不止骂，还排了一道"信号阶梯"——评估手段从弱到强是有序的。简历最弱（谁都能美化）；电话筛稍好；作品集仍偏弱（无法确认是不是本人独立产出）；现场面试更强一点；再往上是实习（约七周真实协作）；最强的是 co-op——五个月的真活。

规律很简单：越接近"真的一起干活"，越准；越像"模拟考试"，越假。传统面试恰恰待在阶梯最假的那一端，却被当成决定性环节。

## 四、处方：campfire，让工作算两次

于是处方是把评估搬到阶梯顶端。他管这个工作模型叫 campfire（篝火）：拖一根原木过来坐下，一起搭点东西，感受合不合拍。核心动作是停止模拟、直接派真实任务。最精彩的机制设计是"让工作算两次"：

> "You make the work count twice. Once for you... And then, importantly, each work item also counts once for the candidate: they walk away with a portable record."（你让这份工作算两次。一次算给你；更重要的是，每一份工作也给候选人算一次：他们带走一份可携带的记录。）

候选人不再为一场扔进垃圾桶的白板题白白燃烧一个下午，而是攒下一份可携带、有签名背书的真实工作履历——下一家公司能直接验证。这把面试从零和的损耗，变成了双向增值。

这套主张并非空想：Geoworks 当年要求六个月的 co-op；滑铁卢大学的合作教育是六段实习、累计约两年真实工作经验。长周期真实协作早就被验证为最强信号，只是主流招聘嫌它"太慢"而拒绝采纳。文末还有个彩蛋：Yegge 自陈这篇是和 Opus 4.8 协作写成的，本想再写一段却放弃了，"一半是因为没篇幅了，一半是因为 Opus 4.8 对什么都批评得太狠了（我的天）"。一个写"面试在 AI 时代终结"的人，正用 AI 当合写者，这本身就是论点的注脚。

## 对从业者意味着什么

对招聘方：你引以为傲的面试流程，可能只是把噪声当信号、还顺手刷掉了本可录用的人。可落地的一步是把终面换成一段"带薪真实小任务"——给一个真实的小需求、几天交付，看产出和协作，远比白板题准。对工程师：刷题准备的那套护城河正在干涸——AI 已经能秒解大多数算法题，未来证明你值钱的，不是你能在白板上背出反转链表，而是你留下的、可携带、可验证的真实作品。从现在开始攒"可携带的工作记录"——开源贡献、真实项目的可展示成果——比再刷一百道题更划算。

## 本期关键词

- **Bar Raiser（抬杠人）** —— 亚马逊招聘里的特殊角色，跨团队、对录用有一票否决权，本意是守住招聘标准不被业务压力稀释。
- **信号阶梯** —— 评估手段从"看简历"到"一起干真活"由弱到强的可靠性序列；越像模拟考试越不准。
- **campfire（篝火工作法）** —— 不再模拟工作，直接拉候选人一起干真实任务，在协作里看合不合拍。
- **让工作算两次（work counts twice）** —— 派真实任务，雇主看到真产出、候选人带走可携带的作品背书，双向不浪费。

## 引用

1. Steve Yegge《The Last Technical Interview》：https://steve-yegge.medium.com/the-last-technical-interview-bc13ddcf4564
