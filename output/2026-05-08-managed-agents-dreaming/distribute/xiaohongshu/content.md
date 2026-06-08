## 标题

Agent 学会了做梦

## 正文

2026 年 5 月 8 日，Anthropic Managed Agents 团队在官网发布更新（claude.com/blog/new-in-claude-managed-agents），新增一项叫 dreaming 的能力：让 agent 在没事干的时候回头看自己之前几百次会话，找出哪里反复栽跟头，然后自己改自己的系统提示词。

为什么值得看：dreaming 听起来像营销词，但 Harvey 用它跑出了 6 倍完成率。过去两年 agent 的行为模式是固定的——收到请求、推理、调工具、输出、会话结束，结束后所有事打包扔进日志，下一次从零开始。问题不在某次任务做得好不好，而在它做不好"同一类任务里那个反复出现的坑"：客户名字写错纠正一次下个会话又错，某个 SQL 风格提醒一次第二天又写。每个团队都在给系统提示词打补丁，打成一坨连作者都不敢删的 600 行补丁博物馆。

dreaming 给 harness 加了一条记忆通道：上周做错了什么，今天版本应该知道。这条通道以前靠工程师每周翻日志手动改，Anthropic 这回把它做成了产品功能。

对从业者意味着什么：agent 的竞争正在从"单次推理多强"转向"会不会从自己的历史里改自己"。判断一个 agent 产品有没有长期价值，看它是反应式（每次从零）还是反身式（会回看自己）。

## 标签

#Anthropic #ManagedAgents #Agent工程 #AI #深度解读

## 配图

- article_page_01.png
- article_page_02.png
- article_page_03.png
- article_page_04.png
- article_page_05.png
- article_page_06.png
- article_page_07.png
- article_page_08.png
- article_page_09.png
