## 标题

单线程 Agent Loop：为什么

## 正文

`while (true)` —— 51 万行代码的 AI 编程工具，心脏只有这四个单词。

2024 年 10 月，OpenAI 开源了 Swarm，一个多 Agent 编排框架，核心卖点是 Agent 之间的 handoff 和 routine。社区一片叫好：多 Agent 是未来。2026 年 3 月，Claude Code 源码泄露，51 万行 TypeScript 摊在阳光下。所有人都去找它的多 Agent 系统——确实找到了三套。但翻遍 1900 个文件后，一个更有趣的事实浮出水面：Claude Code 的默认模式是单线程。一个 `while(true)` 循环，一条消息历史，模型自己决定下一步做什么。

三套多 Agent 系统全部是 feature-flagged 的可选层。Anthropic 把多 Agent 当作特定场景的解决方案，而非通用范式。

## 标签

#ClaudeCode #AgentLoop #单线程 #Swarm #Coordinator #多Agent #源码拆解 

## 配图

- 2026-04-03-agent-loop-single-thread_page_01.png
- 2026-04-03-agent-loop-single-thread_page_02.png
- 2026-04-03-agent-loop-single-thread_page_03.png
- 2026-04-03-agent-loop-single-thread_page_04.png
- 2026-04-03-agent-loop-single-thread_page_05.png
- 2026-04-03-agent-loop-single-thread_page_06.png
- 2026-04-03-agent-loop-single-thread_page_07.png
- 2026-04-03-agent-loop-single-thread_page_08.png
- 2026-04-03-agent-loop-single-thread_page_09.png
- 2026-04-03-agent-loop-single-thread_page_10.png
- 2026-04-03-agent-loop-single-thread_page_11.png
- 2026-04-03-agent-loop-single-thread_page_12.png
- 2026-04-03-agent-loop-single-thread_page_13.png
