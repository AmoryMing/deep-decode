## 标题

thinking 默认隐身是源码取舍

## 正文

2025 年 9 月 30 日，GitHub 用户 janbam 在 anthropics/claude-code 仓库提了一条 issue，编号 8477，标题平淡——"[FEATURE] Add Option to Always Show Claude's Thinking"。他说自己升到 v2.0.0 之后，verbose 模式不再渲染 thinking 内容了；想看 Claude 是怎么想的，得连按三步——`ctrl+o`、`ctrl+e`、再向上滚——他用的词是 tedious。issue 七个多月过去没合并，状态还是 open。

如果只看 issue 描述，这是一个 UX 微改进。但把 `claude-code/src/` 翻开，会发现这不是漏改的设置项——v2.0.0 让 janbam 第一次注意到 thinking 不在主屏；七个月后的 2026-02-12，Anthropic 又在 API 层加了一刀。两刀方向一致，理由都写在源码注释里——interactive users rarely open ctrl+o。janbam 是被这个判断划到外面的人。

- thinking 块——Claude 模型在 API 返回里夹带的一类内容块（content block），类型字段是 `thinking` 或 `redacted_thinking`，里面是模型"出声思考"的草稿。它不进入最终回答，但会被计费、会进入对话上下文。

## 标签

#AI #深度解读 

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
- article_page_11.png
