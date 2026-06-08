## 标题

微交互在 AI 产品里失效了

## 正文

2026 年 4 月 30 日，本篇拆解一个在 AI 产品设计里反复被忽视的断裂：以 Anthropic 开源的 Claude Code 源码（src/components/Markdown.tsx、Spinner/、hooks/）为实证，对照 Dan Saffer 2013 年那本经典《Microinteractions》，看它的框架在 AI 时代为什么不够用了。

为什么值得看：Saffer 的四件套——触发器、规则、反馈、循环模式——讲一个按钮按下、一封邮件归档全都通。但放到 ChatGPT 一次回答上立刻塞住：触发器是用户敲 Enter？规则是一个跑十几秒的随机过程？反馈是一句话逐字浮现、期间还跳一下错一下？Saffer 那套针对的是确定性界面（响应小于 100ms、结果可枚举），反馈只是把"已发生"画给用户看。AI 产品反过来——结果还在生成中，反馈本身要先把"正在发生什么"建模出来。Claude Code 源码里专门处理流式 Markdown 撕裂、Spinner 状态机，就是这条裂缝的工程证据。

微交互的主战场，从装饰转成了不确定性的可视化。

对从业者意味着什么：为 AI 产品做交互设计，不能再套确定性时代的反馈模型。判断一个 AI 界面好不好，先看它有没有把"系统正在不确定地工作"这件事讲清楚，而不是看它的动效漂不漂亮。

## 标签

#AI #交互设计 #微交互 #ClaudeCode #深度解读

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
