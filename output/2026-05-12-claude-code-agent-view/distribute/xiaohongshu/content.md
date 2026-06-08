## 标题

Claude Code 变成调度台了

## 正文

2026 年 5 月 11 日，Anthropic 发布 Claude Code v2.1.139，把两个功能放在 release note 最前面：agent view 和 `/goal`。这不是小功能堆叠，它把 AI coding 的默认画面，从一个终端里的一段对话，推向一个任务调度台。

为什么值得看：agent view 管横向并发——用 `claude agents` 打开一个屏幕，管理所有后台 session，谁在跑、谁卡在等人输入、谁已完成，session 可以在没有终端连接的情况下由独立 supervisor 进程继续跑。`/goal` 管纵向续航——写一个可验证的完成条件（某组测试通过、某个队列清空），Claude 每跑完一个 turn 由小模型检查是否达成，没达成就自动开下一轮，不把控制权交还给用户。

主界面从一条 transcript 变成一张状态表（Working / Needs input / Idle / Completed / Failed），人类看的不再是"下一句怎么回"，而是"哪条任务线需要介入"。后台 session 编辑文件时进入隔离的 git worktree，避免并发互相踩。这些已经不是聊天软件语言，是任务系统语言。

对从业者意味着什么：当工具把"助手"重构成"可调度的工作单元"，人的角色从"逐步喂 prompt"变成"定义验收口径 + 处理阻塞"。把目标写成可检查的条件，比努力工作到满意更值钱。

## 标签

#AI #ClaudeCode #Anthropic #AI编程 #深度解读

## 配图

- article_page_01.png
- article_page_02.png
- article_page_03.png
- article_page_04.png
- article_page_05.png
- article_page_06.png
- article_page_07.png
