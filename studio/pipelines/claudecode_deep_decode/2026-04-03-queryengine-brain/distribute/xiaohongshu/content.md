## 标题

QueryEngine：13000

## 正文

88 行和 13000 行之间，隔着什么？

有人用 Rust 重写了 Claude Code 的核心循环，精简到 88 行代码。while 循环、工具调用、结果回填——骨架就这么简单。但真正的 Claude Code 源码里，query.ts 加上 QueryEngine.ts 加上 processUserInput.ts，三个文件合计超过 13000 行。

差出来的那 12900 行，不是冗余。那是一个 AI 编程工具从"能跑"到"能用"的全部距离。

## 标签

#ClaudeCode #QueryEngine #AgentLoop #上下文工程 #流式执行 #源码拆解 

## 配图

- 2026-04-03-queryengine-brain_page_01.png
- 2026-04-03-queryengine-brain_page_02.png
- 2026-04-03-queryengine-brain_page_03.png
- 2026-04-03-queryengine-brain_page_04.png
- 2026-04-03-queryengine-brain_page_05.png
- 2026-04-03-queryengine-brain_page_06.png
- 2026-04-03-queryengine-brain_page_07.png
- 2026-04-03-queryengine-brain_page_08.png
- 2026-04-03-queryengine-brain_page_09.png
- 2026-04-03-queryengine-brain_page_10.png
- 2026-04-03-queryengine-brain_page_11.png
- 2026-04-03-queryengine-brain_page_12.png
- 2026-04-03-queryengine-brain_page_13.png
