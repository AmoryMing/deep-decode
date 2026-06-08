---
title: "16 个文件的设计语言：Claude Code 终端设计系统"
type: topic
status: ready
created: 2026-04-16
updated: 2026-04-16
tags: [设计系统, 终端UI, 主题, 颜色, 组件库, claude-code]
signal_score: 12
source_support: strong
series: claude-code-ux-源码拆解
---

## 选题角度

**读者的 UX 问题**：一个终端 CLI 工具需要"设计系统"吗？Claude Code 的界面看起来有统一的视觉风格——对话框有边框、文字有层次、颜色有语义——这 16 个文件就是它的设计语言的全部。

**本文要做的事**：完整拆解 Claude Code 终端里的设计系统实现。从颜色系统 `color.ts` 出发，讲清楚语义颜色如何映射到 ANSI 色码；然后逐个分析原子组件——ThemedText、ThemedBox、Dialog、ProgressBar、Tabs 等。读完之后，读者能理解"终端里的设计 token"是怎么工作的。

## 必读文件清单

**颜色与主题（核心）**：
1. `src/components/design-system/color.ts` -- 颜色系统核心，语义颜色到 ANSI 的映射
2. `src/components/design-system/ThemeProvider.tsx` -- 主题 Provider，dark/light 切换

**排版组件**：
3. `src/components/design-system/ThemedText.tsx` -- 语义文本组件，替代裸 `<Text>`
4. `src/components/design-system/ThemedBox.tsx` -- 语义容器组件，替代裸 `<Box>`

**复合组件**：
5. `src/components/design-system/Dialog.tsx` -- 对话框，权限请求等场景的容器
6. `src/components/design-system/ProgressBar.tsx` -- 进度条，文件操作等场景
7. `src/components/design-system/Tabs.tsx` -- 标签页切换
8. `src/components/design-system/FuzzyPicker.tsx` -- 模糊搜索选择器（文件选择、命令面板）
9. `src/components/design-system/Divider.tsx` -- 分隔线
10. `src/components/design-system/ListItem.tsx` -- 列表项
11. `src/components/design-system/Pane.tsx` -- 面板容器

**功能组件**：
12. `src/components/design-system/Byline.tsx` -- 署名/来源行
13. `src/components/design-system/KeyboardShortcutHint.tsx` -- 快捷键提示
14. `src/components/design-system/LoadingState.tsx` -- 加载状态
15. `src/components/design-system/Ratchet.tsx` -- 棘轮组件（只增不减的进度指示）
16. `src/components/design-system/StatusIcon.tsx` -- 状态图标（成功/失败/警告）

**上游依赖（需交叉阅读）**：
- `src/ink/colorize.ts` -- Ink 层的颜色应用函数
- `src/ink/components/Text.tsx` -- ThemedText 的底层
- `src/ink/components/Box.tsx` -- ThemedBox 的底层

## 文章必须回答的问题

### 第一层：颜色系统
1. `color.ts` 定义了哪些语义颜色？"primary"、"secondary"、"error"、"warning" 等分别映射到什么 ANSI 色码？
2. 终端只有 16 色/256 色/TrueColor 三种能力，`color.ts` 怎么做降级？
3. 暗色/亮色主题在 `ThemeProvider.tsx` 里怎么切换？运行时还是启动时决定？

### 第二层：原子组件
4. `ThemedText.tsx` 比 Ink 的 `<Text>` 多了什么？有哪些 variant（正文、标题、代码、淡化文本）？
5. `ThemedBox.tsx` 比 Ink 的 `<Box>` 多了什么？边框样式、间距规范是什么？
6. 这些原子组件的 props 设计哲学是什么？受限 API 还是灵活 API？

### 第三层：复合组件
7. `Dialog.tsx` 的布局结构是什么？标题、内容、操作区怎么排列？谁在用它？
8. `FuzzyPicker.tsx` 的模糊搜索算法是什么？输入、候选列表、高亮匹配怎么实现？
9. `ProgressBar.tsx` 在 80 字符宽度下怎么画进度条？用什么字符？
10. `Tabs.tsx` 在终端里怎么实现标签切换？键盘导航怎么做？

### 第四层：设计决策
11. 为什么用 16 个文件而不是更多/更少？组件粒度的判断标准是什么？
12. 哪些 web 设计系统的概念被保留了（token、semantic color），哪些被丢弃了（响应式、动画）？
13. `Ratchet.tsx` 这个组件解决什么问题？"棘轮"隐喻在 UI 里意味着什么？

## 文章结构建议

1. **开头钩子**：Ant Design 有 60+ 组件，Claude Code 只用 16 个文件就建了一套完整设计系统——因为终端天然约束了设计空间
2. **颜色系统拆解**：color.ts 逐行，画一张语义颜色 -> ANSI 色码的映射表
3. **组件图谱**：画一张 16 个组件的依赖关系图，谁依赖谁
4. **逐个组件拆解**：每个组件一小节，展示 props 接口 + 渲染输出 + 使用场景
5. **设计哲学**：终端设计系统 vs Web 设计系统的取舍
6. **对从业者意味着什么**：如果你也要给 CLI 工具做设计系统，从这 16 个文件能学到什么

## 交叉引用

- [[2026-04-16-ux-ink-engine]] -- 设计系统组件的底层是 Ink 渲染引擎
- [[2026-04-16-ux-permission-system]] -- Dialog.tsx 被权限系统大量使用
- [[2026-04-16-ux-message-rendering]] -- ThemedText 在消息渲染中广泛使用
- [[2026-04-16-ux-spinner-animation]] -- StatusIcon 和 LoadingState 与 Spinner 系统互补
