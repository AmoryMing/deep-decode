---
title: "51 个文件的信任界面：权限请求 UI 全拆解"
type: topic
status: ready
created: 2026-04-16
updated: 2026-04-16
tags: [权限, 安全, 信任, UI, 对话框, 规则引擎, claude-code]
signal_score: 12
source_support: strong
series: claude-code-ux-源码拆解
---

## 选题角度

**读者的 UX 问题**：Claude Code 每次要执行命令、编辑文件、访问网络时都会弹出权限请求。这些权限弹窗不是同一个模板——Bash 命令显示完整命令、文件编辑显示 diff、网络请求显示 URL。51 个文件背后是怎样的权限 UI 架构？

**本文要做的事**：拆解权限系统的 UI 层。不涉及后端权限逻辑（那是另一个选题），专注于"用户看到什么、怎么操作、界面怎么渲染"。从通用权限对话框框架到每种工具类型的专用权限组件，逐个分析。

## 必读文件清单

**通用框架（6 个核心文件）**：
1. `src/components/permissions/PermissionRequest.tsx` -- 权限请求主组件，所有请求的入口
2. `src/components/permissions/PermissionPrompt.tsx` -- 权限提示框
3. `src/components/permissions/PermissionDialog.tsx` -- 权限对话框容器
4. `src/components/permissions/PermissionRequestTitle.tsx` -- 请求标题组件
5. `src/components/permissions/PermissionExplanation.tsx` -- 权限解释文本
6. `src/components/permissions/PermissionRuleExplanation.tsx` -- 规则解释
7. `src/components/permissions/PermissionDecisionDebugInfo.tsx` -- 决策调试信息

**工具专用权限组件（每种工具一套）**：

*Bash 相关*：
8. `src/components/permissions/BashPermissionRequest/` -- Bash 命令权限（目录）
9. `src/components/permissions/PowerShellPermissionRequest/` -- PowerShell 权限（目录）
10. `src/components/permissions/shellPermissionHelpers.tsx` -- Shell 权限辅助函数
11. `src/components/permissions/useShellPermissionFeedback.ts` -- Shell 权限反馈 hook

*文件操作相关*：
12. `src/components/permissions/FileEditPermissionRequest/` -- 文件编辑权限（目录，显示 diff）
13. `src/components/permissions/FileWritePermissionRequest/` -- 文件写入权限（目录）
14. `src/components/permissions/FilesystemPermissionRequest/` -- 文件系统权限（目录）
15. `src/components/permissions/FilePermissionDialog/` -- 文件权限对话框（目录）
16. `src/components/permissions/NotebookEditPermissionRequest/` -- Notebook 编辑权限（目录）
17. `src/components/permissions/SedEditPermissionRequest/` -- Sed 编辑权限（目录）

*其他工具*：
18. `src/components/permissions/WebFetchPermissionRequest/` -- 网络请求权限（目录）
19. `src/components/permissions/ComputerUseApproval/` -- 计算机操作权限（目录）
20. `src/components/permissions/SkillPermissionRequest/` -- Skill 执行权限（目录）

*计划模式*：
21. `src/components/permissions/EnterPlanModePermissionRequest/` -- 进入计划模式
22. `src/components/permissions/ExitPlanModePermissionRequest/` -- 退出计划模式

*用户交互*：
23. `src/components/permissions/AskUserQuestionPermissionRequest/` -- 向用户提问

*兜底*：
24. `src/components/permissions/FallbackPermissionRequest.tsx` -- 未知工具的通用权限请求
25. `src/components/permissions/SandboxPermissionRequest.tsx` -- 沙箱权限

**规则系统 UI**：
26. `src/components/permissions/rules/` -- 权限规则的 UI 渲染（目录）

**辅助**：
27. `src/components/permissions/hooks.ts` -- 权限相关 hooks
28. `src/components/permissions/utils.ts` -- 工具函数
29. `src/components/permissions/WorkerBadge.tsx` -- Worker 标识
30. `src/components/permissions/WorkerPendingPermission.tsx` -- Worker 待审权限

## 文章必须回答的问题

### 第一层：权限 UI 架构
1. 权限请求的渲染链路是什么？从"AI 想调用工具"到"用户看到弹窗"，经过哪些组件？
2. `PermissionRequest.tsx` 怎么根据工具类型分发到不同的专用组件？是 switch-case 还是注册表？
3. 通用框架（PermissionDialog/PermissionPrompt）提供了什么布局规范？每个专用组件可以自定义什么？

### 第二层：专用权限组件
4. `BashPermissionRequest` 怎么显示命令？语法高亮有吗？危险命令有视觉警告吗？
5. `FileEditPermissionRequest` 怎么显示 diff？是完整 diff 还是摘要？颜色怎么标记增删？
6. `WebFetchPermissionRequest` 显示什么？URL、目的、预期内容？
7. `ComputerUseApproval` -- 计算机操作（截屏、点击）的权限 UI 和其他有什么不同？

### 第三层：规则系统 UI
8. `rules/` 目录里的组件怎么渲染权限规则？"允许这个目录下的所有文件编辑"在 UI 上长什么样？
9. `PermissionRuleExplanation.tsx` 怎么把规则翻译成用户能读懂的文字？
10. 用户能在权限弹窗里直接创建规则吗？UI 流程是什么？

### 第四层：交互细节
11. 用户有哪些操作选项？允许/拒绝/始终允许/编辑后允许？
12. 键盘快捷键是什么？Y/N/A？
13. `PermissionDecisionDebugInfo.tsx` 给谁看？什么时候显示？

### 第五层：设计决策
14. 为什么每种工具类型要单独一套 UI？不能共用一个模板吗？
15. 权限弹窗的信息密度怎么平衡？太少用户不敢点，太多用户不想读
16. `FallbackPermissionRequest.tsx` 处理什么场景？新增工具时 UI 怎么优雅降级？

## 文章结构建议

1. **开头钩子**：Android 的权限弹窗就一种样式，Claude Code 有 15+ 种——因为 "Allow bash access" 和 "Allow file edit" 需要完全不同的上下文信息
2. **权限 UI 架构图**：画出从工具调用到弹窗显示的完整链路
3. **专用组件逐个拆解**：
   - Bash: 显示命令 + 风险评估
   - FileEdit: 显示 diff + 文件路径
   - WebFetch: 显示 URL + 目的
   - ComputerUse: 显示操作描述 + 截图
4. **规则系统 UI**：怎么让用户建立信任规则
5. **对从业者意味着什么**：AI agent 的权限 UI 设计是被忽视的关键 UX

## 交叉引用

- [[2026-04-16-ux-design-system]] -- 权限对话框使用 Dialog.tsx
- [[2026-04-16-ux-message-rendering]] -- 工具调用消息触发权限请求
- [[2026-04-03-six-level-security]] -- 六级安全模型的 UI 表现
- [[2026-04-03-bashtool-security]] -- Bash 工具安全分类的 UI 侧
