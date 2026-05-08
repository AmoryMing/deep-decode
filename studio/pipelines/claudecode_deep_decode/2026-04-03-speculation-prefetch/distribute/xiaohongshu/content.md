## 标题

推测执行：当 AI 编程助手学会了

## 正文

1969 年，IBM System/360 Model 91 第一次在硬件里实现了分支预测——CPU 不再傻等条件判断的结果，而是赌一把：猜你接下来要走哪条路，提前把那条路上的指令算好。猜对了，省掉几十个时钟周期；猜错了，把算好的结果扔掉，假装什么都没发生。

57 年后，Claude Code 的源码里出现了同样的逻辑。只不过这次预测的对象不是机器指令的跳转方向，而是人类开发者的下一步操作。

泄露的 992 行 `speculation.ts` 揭示了一套完整的意图流水线（Intent Pipeline）：预测你要输什么 → 在沙箱里替你先做了 → 你按回车确认就直接用结果，改主意就全丢。这套系统内部代号 Tengu（天狗），目前仅限 Anthropic 内部员工使用，但所有基础设施已经完全就位。

## 标签

#ClaudeCode #推测执行 #分支预测 #AI工程 #性能优化 #源码拆解 

## 配图

- 2026-04-03-speculation-prefetch_page_01.png
- 2026-04-03-speculation-prefetch_page_02.png
- 2026-04-03-speculation-prefetch_page_03.png
- 2026-04-03-speculation-prefetch_page_04.png
- 2026-04-03-speculation-prefetch_page_05.png
- 2026-04-03-speculation-prefetch_page_06.png
- 2026-04-03-speculation-prefetch_page_07.png
- 2026-04-03-speculation-prefetch_page_08.png
- 2026-04-03-speculation-prefetch_page_09.png
- 2026-04-03-speculation-prefetch_page_10.png
- 2026-04-03-speculation-prefetch_page_11.png
- 2026-04-03-speculation-prefetch_page_12.png
- 2026-04-03-speculation-prefetch_page_13.png
- 2026-04-03-speculation-prefetch_page_14.png
- 2026-04-03-speculation-prefetch_page_15.png
