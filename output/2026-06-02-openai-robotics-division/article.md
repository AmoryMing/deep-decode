---
title: OpenAI 把手伸进物理世界：从"造图"到造机器人
date: 2026-06-02
source: https://x.com/sama/status/2061117302528188712
author: Sam Altman / OpenAI
type: decode
slug: 2026-06-02-openai-robotics-division
---

# OpenAI 把手伸进物理世界：从"造图"到造机器人

5 月 31 日，Sam Altman 发了一条招聘推文，宣布 **OpenAI Robotics 正式成立并开始招人**。别被"招聘启事"的外壳骗了——这是 OpenAI 第一次以独立部门的形式，公开承认自己要亲手造机器人，而不只是给别人的机器人当大脑。招的是 full-stack 硬件、运维、系统、ML 工程师，简历直接发 `robotics-recruiting@openai.com`。一家以软件和模型立身的公司，开始要焊电路、跑产线的人，这本身就是信号。

![OpenAI 进军机器人](cover.png)

## 一、它的来历：从"世界模拟"长出来的机器人

更关键的是这个部门的来历：它不是凭空冒出来的，而是**脱胎于过去一年的"世界模拟"（world simulation）研究项目**，由 DALL·E 和 Sora 的核心作者 Aditya Ramesh 领衔。

这条血缘很重要——OpenAI 不是把机器人当成一个全新赛道，而是当成视频生成/世界模型能力的"物理延伸"：既然模型已经能在像素里模拟世界的物理规律，下一步就是让它在真实世界里动手。这是 OpenAI 区别于波士顿动力那一派的根本路径——**它的机器人野心是模型能力溢出的结果，不是机械工程的起点**。同样一套"理解并预测世界如何演化"的能力，先用来生成视频，再用来驱动关节。

## 二、两步走路线：先建基础设施，再人手一台

Altman 给出了一条清晰的两步路线，原文值得逐字看：

> "AI should be able to help people in the physical world. In the short term, we are focused on robots to support skilled workers to build our future infrastructure; in the long term, we imagine everyone having a personal robot doing anything they need."（AI 应当能在物理世界里帮到人。短期内，我们专注于做机器人去辅助技术工人建设未来的基础设施；长期来看，我们设想每个人都拥有一台私人机器人，做任何他需要做的事。）

注意这个排序的精明之处：短期不碰消费端，而是瞄准**建基础设施的技术工人**——工地、产线、数据中心这类高价值、低拟人化要求的场景。这恰好是 OpenAI 自己最饥渴的地方：它正在为算力疯狂铺数据中心，"机器人帮人建基础设施"既是技术叙事，也是自家供应链的现实需求。把"人人一台私人机器人"放在长期，既画了饼，又暂时回避了消费级机器人那些难啃的安全与成本问题。

## 三、方法论：co-design，以及它背后那场分手

方法论上，Altman 反复强调一个词——**co-design（协同设计）**：

> "Progress is rapid, and based on a foundation of co-design between robotics hardware and ML research."（进展很快，其基础是机器人硬件与 ML 研究之间的协同设计。）

这句话是冲着行业痛点去的。机器人长期被"硬件团队造身体、算法团队写大脑"的割裂拖累，两边各自优化、互相迁就。co-design 的意思是硬件形态和模型能力一起迭代——身体为模型而设计，模型也吃透这具身体的物理特性。

这恰恰是 Figure 当初和 OpenAI 分手的导火索：2025 年 2 月 Figure 创始人宣布终止与 OpenAI 的合作，理由就是"通用大模型满足不了机器人的硬件需求，必须做垂直整合的端到端模型"。OpenAI 这次亲自下场做 co-design，某种程度上正是对那场分手的回应——既然合作方嫌通用模型不够垂直，那就自己把硬件和模型攥在一只手里。

## 对从业者意味着什么

这条路并不平坦。OpenAI 其实在 2020 年前后就解散过一次机器人团队，这是它六年后的"重启"；新部门挂帅前，前硬件负责人 Caitlin Kalinowski（从 Meta AR 眼镜团队挖来）已于 2026 年 3 月离职，公开原因是抗议 OpenAI 与五角大楼的合作，担忧"未经司法监督的监视"和"无人类授权的自主杀伤"。

把这些拼起来看，这条招聘推文的真正含义是：**OpenAI 已经认定光靠"卖智能"不够，要亲手占住身体这一层**——从生成像素到生成动作，模型公司正在试图把整个物理世界变成自己的下游。对机器人创业者：当 OpenAI 用"世界模型 + co-design"下场，单纯做硬件本体的公司议价权会被挤压，能跟模型深度协同设计的整机方案才是壁垒。对关注治理的人：一家连内部都为"机器人该听谁的命令"吵到核心高管出走的公司，凭什么定义"对社会有用"的机器人，是比技术路线更该追问的问题。

## 本期关键词

- **世界模拟 / 世界模型（world simulation / world model）** —— 让 AI 学会"世界接下来会怎样变"，先用来生成视频，再用来预测机器人动作的后果。
- **具身智能（embodied AI）** —— 把模型装进有身体的机器里，让它在真实物理世界里感知和行动，而不只是在屏幕上输出文字。
- **co-design（软硬协同设计）** —— 机器人硬件和 ML 模型一起迭代，身体为模型而造、模型吃透这具身体，而不是两个团队各做各的再硬凑。

## 引用

1. Sam Altman 宣布 OpenAI Robotics：https://x.com/sama/status/2061117302528188712
