---
title: "三个屏幕撑起全局：App.tsx + REPL + Doctor"
type: topic
status: ready
created: 2026-04-16
updated: 2026-04-16
tags: [应用架构, 屏幕, REPL, 生命周期, 更新, 引导, claude-code]
signal_score: 11
source_support: strong
series: claude-code-ux-源码拆解
---

## 选题角度

**读者的 UX 问题**：打开 Claude Code，你看到的是一个对话界面。但这个界面是怎么启动的？出错时跳到诊断界面是怎么路由的？中断时的退出流程是什么？自动更新时界面怎么处理？整个应用的"骨架"是什么？

**本文要做的事**：从最顶层的 App.tsx 开始，拆解 Claude Code 的屏幕架构。只有三个屏幕（REPL、Doctor、ResumeConversation），但围绕它们有十几个顶层组件处理生命周期——引导流程、OAuth 登录、自动更新、退出确认、IDE 连接。读完之后，读者能画出 Claude Code 从启动到退出的完整 UI 状态图。

## 必读文件清单

**顶层入口**：
1. `src/components/App.tsx` -- 应用根组件，所有屏幕的父级

**三个屏幕**：
2. `src/screens/REPL.tsx` -- 主屏幕，对话交互的核心循环
3. `src/screens/Doctor.tsx` -- 诊断屏幕，排查环境问题
4. `src/screens/ResumeConversation.tsx` -- 恢复会话屏幕

**生命周期组件**：
5. `src/components/Onboarding.tsx` -- 引导流程（首次使用）
6. `src/components/ConsoleOAuthFlow.tsx` -- OAuth 登录流程
7. `src/components/ExitFlow.tsx` -- 退出流程（Ctrl+C 时的确认对话）
8. `src/components/AutoUpdater.tsx` -- 自动更新逻辑组件
9. `src/components/AutoUpdaterWrapper.tsx` -- 自动更新包装器
10. `src/components/NativeAutoUpdater.tsx` -- 原生更新器
11. `src/components/PackageManagerAutoUpdater.tsx` -- 包管理器更新

**辅助顶层组件**：
12. `src/components/AutoModeOptInDialog.tsx` -- 自动模式加入对话
13. `src/components/IdeAutoConnectDialog.tsx` -- IDE 自动连接对话
14. `src/components/IdeOnboardingDialog.tsx` -- IDE 引导对话
15. `src/components/ClaudeInChromeOnboarding.tsx` -- Chrome 扩展引导
16. `src/components/WorkflowMultiselectDialog.tsx` -- 工作流多选对话
17. `src/components/WorktreeExitDialog.tsx` -- Worktree 退出对话

## 文章必须回答的问题

### 第一层：应用骨架
1. `App.tsx` 的顶层结构是什么？有多少个 Provider 包裹？（Theme、Keybinding、Context 等）
2. 屏幕路由是怎么实现的？React Router？状态机？条件渲染？
3. App.tsx 有多大？它的职责边界是什么——纯粹的容器还是包含逻辑？

### 第二层：REPL 主屏幕
4. `REPL.tsx` 是整个产品的核心。它的组件树是什么？消息列表 + PromptInput + 状态栏？
5. REPL 的"主循环"是什么？用户输入 -> AI 回复 -> 工具调用 -> 权限请求 -> 继续回复，这个循环在 REPL.tsx 里怎么编排？
6. REPL.tsx 管理哪些 state？消息列表、loading 状态、当前工具调用？
7. 消息列表的滚动行为是什么？新消息自动滚到底？用户上滑时暂停自动滚动？

### 第三层：Doctor 诊断屏幕
8. `Doctor.tsx` 诊断哪些项目？Node 版本？API 连接？认证状态？文件权限？
9. 诊断结果怎么展示？清单式打勾？树形结构？
10. Doctor 是启动时自动跑还是手动触发？`/doctor` 命令？

### 第四层：生命周期管理
11. `Onboarding.tsx` 的引导流程有哪些步骤？首次用户看到什么？
12. `ConsoleOAuthFlow.tsx` 的 OAuth 流程——终端里怎么做 OAuth？打开浏览器？显示 device code？
13. `ExitFlow.tsx` -- 用户按 Ctrl+C 时发生什么？直接退出？确认对话？保存会话？
14. `ResumeConversation.tsx` -- 恢复会话的流程是什么？从哪读取历史？加载中 UI 是什么？

### 第五层：自动更新
15. 为什么有三个更新器组件（AutoUpdater、NativeAutoUpdater、PackageManagerAutoUpdater）？分别处理什么安装方式？
16. 更新提示在 UI 上长什么样？强制更新还是可跳过？

### 第六层：IDE 集成
17. `IdeAutoConnectDialog.tsx` 和 `IdeOnboardingDialog.tsx` 处理什么场景？VS Code 集成？
18. `ClaudeInChromeOnboarding.tsx` -- Chrome 扩展的引导流程是什么？

## 文章结构建议

1. **开头钩子**：大多数 CLI 工具启动就是一个 main() 函数。Claude Code 的"启动"经过引导、认证、版本检查、环境诊断四道关卡，才进入你看到的对话界面
2. **应用状态图**：画出从 `claude` 命令到 REPL 主屏幕的完整状态流转
3. **App.tsx 拆解**：Provider 洋葱圈 + 路由逻辑
4. **REPL.tsx 深度拆解**：组件树 + 主循环 + state 管理（这是本文的重点章节）
5. **Doctor.tsx 拆解**：诊断项 + 展示逻辑
6. **生命周期特写**：引导 -> 认证 -> 更新 -> 退出，每个流程一小节
7. **对从业者意味着什么**：CLI 产品的"第一印象"工程——引导流程和错误恢复同样重要

## 交叉引用

- [[2026-04-16-ux-ink-engine]] -- App.tsx 是 Ink 应用的顶层入口
- [[2026-04-16-ux-prompt-input]] -- REPL.tsx 包含 PromptInput
- [[2026-04-16-ux-message-rendering]] -- REPL.tsx 包含消息列表
- [[2026-04-16-ux-permission-system]] -- REPL 的主循环包含权限请求步骤
- [[2026-04-16-ux-vim-keybindings]] -- KeybindingProvider 在 App.tsx 层注入
- [[2026-04-16-ux-design-system]] -- ThemeProvider 在 App.tsx 层注入
