## 标题

终端Agent的窗口里44%是垃圾

## 正文

一个跑在 shell 里的 Agent,解任务跑到第 30 步,已经看不到自己最初要干什么。窗口给到 128K 也照样塞满。

但 TerminalBench 2.0 实测:prompt 里 24.6%–44.1% 的内容是低价值冗余——一条 apt-get install 吐一万字符,真正有用的只有最后那行成功还是失败。

所以瓶颈从来不是"窗口不够大",而是"垃圾比例太高"?

这组图讲清楚了 TACO 怎么用 LLM 自己写压缩规则、按任务进化:DevEval 上 token 砍掉 27%,准确率反而涨 1.6 个点——省钱和涨分同时拿到,因为砍的本来就在拖后腿。

评论区聊聊,你手里的 Agent 跑到第 50 步时,前面的输出还在不在 prompt 里?

## 标签

#Agent #上下文工程 #终端Agent #AI #人工智能 #大模型

## 配图

- cover.png
- card_01.png
- card_02.png
- card_03.png
- card_04.png
- card_05.png
- card_06.png
- card_07.png
- card_08.png
- card_09.png
- card_10.png
- card_11.png
- card_12.png
- card_13.png
- card_14.png
- card_15.png
