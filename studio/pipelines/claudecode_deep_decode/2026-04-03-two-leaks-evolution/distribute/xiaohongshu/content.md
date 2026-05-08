## 标题

从 v0.2.8 到 v2.1.88

## 正文

同一行配置，同一个错误，14 个月后再犯一次。

2025 年 2 月，开发者 Dave Schumaker 在 Claude Code 的 cli.mjs 底部发现了一行 `sourceMappingURL`。顺着这条线索，社区还原出了早期版本的 TypeScript 源码。Anthropic 在 v0.2.9 中删掉了 sourcemap，下架了旧版本，事情似乎就这么过去了。

14 个月后的 2026 年 3 月 31 日，安全研究员 Chaofan Shou 在 X 上发了一条帖子，浏览量超过 2000 万：Claude Code v2.1.88 的 npm 包里，又带上了 sourcemap。这一次，暴露的不再是一个简单 CLI 的源码，而是 1,902 个文件、512,685 行 TypeScript——一个完整的 Agent 平台，连同它所有的秘密。

## 标签

#ClaudeCode #源码泄露 #逆向工程 #版本演进 #npm安全 #Agent架构 

## 配图

- 2026-04-03-two-leaks-evolution_page_01.png
- 2026-04-03-two-leaks-evolution_page_02.png
- 2026-04-03-two-leaks-evolution_page_03.png
- 2026-04-03-two-leaks-evolution_page_04.png
- 2026-04-03-two-leaks-evolution_page_05.png
- 2026-04-03-two-leaks-evolution_page_06.png
- 2026-04-03-two-leaks-evolution_page_07.png
- 2026-04-03-two-leaks-evolution_page_08.png
- 2026-04-03-two-leaks-evolution_page_09.png
- 2026-04-03-two-leaks-evolution_page_10.png
- 2026-04-03-two-leaks-evolution_page_11.png
- 2026-04-03-two-leaks-evolution_page_12.png
