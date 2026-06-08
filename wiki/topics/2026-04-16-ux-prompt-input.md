---
title: "21 个文件只为一个输入框：PromptInput 交互拆解"
type: topic
status: ready
created: 2026-04-16
updated: 2026-04-16
tags: [输入框, 交互设计, 粘贴, 历史搜索, 语音, shimmer, claude-code]
signal_score: 13
source_support: strong
series: claude-code-ux-源码拆解
---

## 选题角度

**读者的 UX 问题**：Claude Code 的输入框看起来就是终端里一行光标闪烁的地方。但用过的人都知道它"手感"不一样——粘贴大段代码时有特殊处理、按上箭头能搜历史、有 shimmer 动画、有语音输入指示器、底部有动态提示。一个输入框怎么需要 21 个文件？

**本文要做的事**：完整拆解 PromptInput 的交互实现。从主组件 `PromptInput.tsx` 出发，追踪每一个子系统：输入模式切换、粘贴处理、历史搜索、shimmer 效果、语音指示器、底部建议栏。读完之后，读者能理解一个"好用的输入框"在代码层面意味着多少工程量。

## 必读文件清单

**核心组件**：
1. `src/components/PromptInput/PromptInput.tsx` -- 主组件，入口，所有子系统的编排中心
2. `src/components/PromptInput/inputModes.ts` -- 输入模式定义（普通/多行/命令等）
3. `src/components/PromptInput/inputPaste.ts` -- 粘贴处理逻辑（大段文本怎么办）
4. `src/components/PromptInput/utils.ts` -- 工具函数

**子组件**：
5. `src/components/PromptInput/ShimmeredInput.tsx` -- 带 shimmer 效果的输入框
6. `src/components/PromptInput/HistorySearchInput.tsx` -- Ctrl+R 历史搜索输入
7. `src/components/PromptInput/VoiceIndicator.tsx` -- 语音输入状态指示
8. `src/components/PromptInput/IssueFlagBanner.tsx` -- 问题标记横幅
9. `src/components/PromptInput/Notifications.tsx` -- 通知提示
10. `src/components/PromptInput/PromptInputModeIndicator.tsx` -- 输入模式指示器（显示当前在什么模式）
11. `src/components/PromptInput/SandboxPromptFooterHint.tsx` -- 沙箱模式提示

**底部栏系统**：
12. `src/components/PromptInput/PromptInputFooter.tsx` -- 底部栏容器
13. `src/components/PromptInput/PromptInputFooterLeftSide.tsx` -- 底部左侧（模型名、token 数等）
14. `src/components/PromptInput/PromptInputFooterSuggestions.tsx` -- 底部建议（快捷操作提示）
15. `src/components/PromptInput/PromptInputHelpMenu.tsx` -- 帮助菜单
16. `src/components/PromptInput/PromptInputQueuedCommands.tsx` -- 排队命令显示
17. `src/components/PromptInput/PromptInputStashNotice.tsx` -- Stash 通知

**Hooks**：
18. `src/components/PromptInput/useMaybeTruncateInput.ts` -- 输入过长时的截断逻辑
19. `src/components/PromptInput/usePromptInputPlaceholder.ts` -- 动态 placeholder 内容
20. `src/components/PromptInput/useShowFastIconHint.ts` -- 快速模式图标提示
21. `src/components/PromptInput/useSwarmBanner.ts` -- Swarm 模式横幅

## 文章必须回答的问题

### 第一层：主组件架构
1. `PromptInput.tsx` 有多少行？它的 state 管理结构是什么？多少个 useState/useRef？
2. 输入框的"主循环"是什么？从用户按键到文本出现，经过哪些处理？
3. 这 21 个文件之间的依赖关系是什么？画出组件树

### 第二层：输入模式
4. `inputModes.ts` 定义了哪些模式？普通输入、多行输入、命令输入有什么区别？
5. 模式之间怎么切换？什么按键触发什么模式转换？
6. 不同模式下，Enter 键的行为有什么不同？（提交 vs 换行）

### 第三层：粘贴处理
7. `inputPaste.ts` 为什么需要单独一个文件？粘贴大段代码时的特殊处理是什么？
8. 粘贴检测的原理是什么？怎么区分"用户打字快"和"粘贴"？
9. 粘贴多行内容时自动切换到多行模式吗？

### 第四层：交互细节
10. `ShimmeredInput.tsx` 的 shimmer 效果怎么实现？什么时候触发？
11. `HistorySearchInput.tsx` 的搜索算法是什么？模糊搜索还是前缀匹配？
12. `VoiceIndicator.tsx` 怎么显示语音输入状态？动画是什么？
13. `usePromptInputPlaceholder.ts` 的 placeholder 内容怎么动态变化？

### 第五层：底部栏
14. PromptInputFooter 的信息密度如何分配？左/右分别显示什么？
15. `PromptInputFooterSuggestions.tsx` 的建议从哪来？上下文敏感吗？
16. `useMaybeTruncateInput.ts` 在什么阈值下截断？用户能看到被截断了吗？

## 文章结构建议

1. **开头钩子**：VS Code 的编辑器是一个文件，Claude Code 的输入框是 21 个文件——因为一个好的 AI 对话输入框比文本编辑器更难做
2. **组件树图**：PromptInput 的 21 个文件，画出谁包含谁、谁调用谁
3. **按交互场景拆解**：
   - 场景一：用户打一行话按 Enter -- 追踪完整链路
   - 场景二：用户粘贴 50 行代码 -- inputPaste.ts 怎么接管
   - 场景三：用户按 Ctrl+R 搜历史 -- HistorySearchInput 怎么工作
   - 场景四：空输入框时看到 shimmer -- ShimmeredInput 的动画原理
4. **底部栏信息架构**：Footer 系列组件的职责分工
5. **对从业者意味着什么**：做 AI 对话产品时，输入框的工程复杂度被严重低估

## 交叉引用

- [[2026-04-16-ux-ink-engine]] -- PromptInput 使用 Ink 的 hooks 和组件
- [[2026-04-16-ux-vim-keybindings]] -- Vim 模式下 PromptInput 的行为完全改变
- [[2026-04-16-ux-spinner-animation]] -- shimmer 动画系统与 Spinner 共享技术
- [[2026-04-16-ux-app-screens]] -- REPL.tsx 是 PromptInput 的直接父级
