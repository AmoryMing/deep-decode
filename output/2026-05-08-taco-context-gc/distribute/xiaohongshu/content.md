## 标题

Agent 学会了给上下文倒垃圾

## 正文

2026 年 5 月 8 日，曼彻斯特大学、北航、港科大与 MAP 团队的一篇 arXiv 论文公开（arxiv.org/abs/2604.19572），提出 TACO：给终端 Agent 的上下文加一套垃圾回收（GC）机制。研究对象是跑在 shell 里、解 TerminalBench 任务的 Agent。

为什么值得看：这类 Agent 每发一条命令就拿到一段不可预测的输出——一次 `apt-get install` 能吐 10071 个字符，其中 99% 是重复的 Unpacking 行，真正决定下一步的只有最后一行 success/fail。但 Agent 不知道哪行关键，于是全部塞进下一轮 prompt。TerminalBench 2.0 实测：raw prompt 里 24.6%–44.1% 是低价值冗余。瓶颈不再是"窗口不够大"（DeepSeek-V3.2 给 128K 也照样塞满），而是"窗口里垃圾比例太高"。

TACO 的解法是让过滤规则自己长出来，而不是写死。窗口越长越值钱，留给垃圾就越亏——这是两个完全不同的工程问题，解法也完全不同。

对从业者意味着什么：长程 Agent 的成本曲线，治理点正在从"扩窗口"转向"主动剪枝"。判断一个 Agent 系统能不能跑长任务，先看它对自己的观测有没有回收机制，而不是看它的上下文窗口标了多大。

## 标签

#Agent架构 #上下文工程 #终端Agent #上下文压缩 #TACO

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
- article_page_10.png
