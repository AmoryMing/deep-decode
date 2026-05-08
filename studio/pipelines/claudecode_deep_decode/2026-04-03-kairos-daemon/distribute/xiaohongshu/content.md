## 标题

KAIROS：7x24 后台

## 正文

"Each wake-up costs an API call, but the prompt cache expires after 5 minutes of inactivity — balance accordingly."

这句话藏在 Claude Code 源码的 SleepTool 提示词里。一个 AI 编程助手的内部提示词，在教 AI 怎么省钱。不是教它写更好的代码，不是教它理解用户意图——是教它算账：醒来一次花多少钱，睡太久缓存过期又要多花多少钱。

这条提示词指向一个事实：Anthropic 在源码里藏了一个完整的后台守护进程系统，代号 KAIROS。它被 feature flag 锁死，从未出现在任何公开版本里，但在源码中被引用了超过 150 次，关联 75 个文件。这不是一个还没做完的功能。这是一套完整的、已经通过编译的基础设施，只差一个开关。

## 标签

#AI产品 #Agent架构 #ClaudeCode源码 #后台Agent #记忆系统 

## 配图

- 2026-04-03-kairos-daemon_page_01.png
- 2026-04-03-kairos-daemon_page_02.png
- 2026-04-03-kairos-daemon_page_03.png
- 2026-04-03-kairos-daemon_page_04.png
- 2026-04-03-kairos-daemon_page_05.png
- 2026-04-03-kairos-daemon_page_06.png
- 2026-04-03-kairos-daemon_page_07.png
- 2026-04-03-kairos-daemon_page_08.png
- 2026-04-03-kairos-daemon_page_09.png
- 2026-04-03-kairos-daemon_page_10.png
- 2026-04-03-kairos-daemon_page_11.png
- 2026-04-03-kairos-daemon_page_12.png
