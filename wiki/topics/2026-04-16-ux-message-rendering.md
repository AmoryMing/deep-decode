---
title: "41 种消息长什么样：Messages 渲染系统逐行拆解"
type: topic
status: ready
created: 2026-04-16
updated: 2026-04-16
tags: [消息渲染, 组件, 消息类型, 工具调用, thinking, claude-code]
signal_score: 13
source_support: strong
series: claude-code-ux-源码拆解
---

## 选题角度

**读者的 UX 问题**：Claude Code 的对话界面里，不同消息长得不一样——用户的话是一种样式，AI 的回复是另一种，工具调用有展开/折叠，错误消息有红色背景，thinking 消息有特殊动画。这些视觉差异是怎么在代码里实现的？有多少种消息类型？

**本文要做的事**：完整枚举 messages/ 目录下的所有消息组件，按类型分类拆解。让读者看到 Claude Code 的消息系统不是一个 `<Message>` 组件的 if-else，而是 41 个专用组件的精确分工。

## 必读文件清单

**AI 助手消息**：
1. `src/components/messages/AssistantTextMessage.tsx` -- AI 文本回复
2. `src/components/messages/AssistantToolUseMessage.tsx` -- AI 工具调用消息
3. `src/components/messages/AssistantThinkingMessage.tsx` -- AI 思考过程（thinking/extended thinking）
4. `src/components/messages/AssistantRedactedThinkingMessage.tsx` -- 被裁剪的思考内容

**用户消息**：
5. `src/components/messages/UserTextMessage.tsx` -- 用户文本输入
6. `src/components/messages/UserPromptMessage.tsx` -- 用户提示
7. `src/components/messages/UserImageMessage.tsx` -- 用户图片消息
8. `src/components/messages/UserCommandMessage.tsx` -- 用户命令（/开头）
9. `src/components/messages/UserMemoryInputMessage.tsx` -- 用户记忆输入
10. `src/components/messages/UserPlanMessage.tsx` -- 用户计划消息
11. `src/components/messages/UserChannelMessage.tsx` -- 频道消息
12. `src/components/messages/UserTeammateMessage.tsx` -- 团队成员消息
13. `src/components/messages/UserResourceUpdateMessage.tsx` -- 资源更新消息

**用户工具交互消息**：
14. `src/components/messages/UserBashInputMessage.tsx` -- Bash 命令输入
15. `src/components/messages/UserBashOutputMessage.tsx` -- Bash 命令输出
16. `src/components/messages/UserLocalCommandOutputMessage.tsx` -- 本地命令输出
17. `src/components/messages/UserToolResultMessage/UserToolResultMessage.tsx` -- 工具结果（主组件）
18. `src/components/messages/UserToolResultMessage/RejectedToolUseMessage.tsx` -- 被拒绝的工具调用
19. `src/components/messages/UserToolResultMessage/RejectedPlanMessage.tsx` -- 被拒绝的计划
20. `src/components/messages/UserToolResultMessage/UserToolCanceledMessage.tsx` -- 用户取消的工具
21. `src/components/messages/UserToolResultMessage/UserToolErrorMessage.tsx` -- 工具错误
22. `src/components/messages/UserToolResultMessage/UserToolRejectMessage.tsx` -- 用户拒绝
23. `src/components/messages/UserToolResultMessage/UserToolSuccessMessage.tsx` -- 工具成功
24. `src/components/messages/UserToolResultMessage/utils.tsx` -- 工具消息工具函数

**系统消息**：
25. `src/components/messages/SystemAPIErrorMessage.tsx` -- API 错误
26. `src/components/messages/SystemTextMessage.tsx` -- 系统文本
27. `src/components/messages/RateLimitMessage.tsx` -- 速率限制提示
28. `src/components/messages/ShutdownMessage.tsx` -- 关闭提示

**特殊消息**：
29. `src/components/messages/AdvisorMessage.tsx` -- 顾问消息
30. `src/components/messages/AttachmentMessage.tsx` -- 附件消息
31. `src/components/messages/HookProgressMessage.tsx` -- Hook 进度消息
32. `src/components/messages/PlanApprovalMessage.tsx` -- 计划审批消息
33. `src/components/messages/TaskAssignmentMessage.tsx` -- 任务分配消息
34. `src/components/messages/UserAgentNotificationMessage.tsx` -- Agent 通知消息
35. `src/components/messages/CompactBoundaryMessage.tsx` -- 紧凑边界消息

**辅助组件**：
36. `src/components/messages/GroupedToolUseContent.tsx` -- 分组工具调用内容
37. `src/components/messages/CollapsedReadSearchContent.tsx` -- 折叠的读取/搜索内容
38. `src/components/messages/HighlightedThinkingText.tsx` -- 高亮思考文本
39. `src/components/messages/nullRenderingAttachments.ts` -- 空渲染附件处理
40. `src/components/messages/teamMemCollapsed.tsx` -- 团队记忆折叠
41. `src/components/messages/teamMemSaved.ts` -- 团队记忆保存

## 文章必须回答的问题

### 第一层：消息类型图谱
1. 41 个文件可以分成哪几大类？每类有多少种？画一张分类图谱
2. 消息类型是怎么确定的？有一个中央 switch/map 还是 React 路由式分发？
3. 哪些消息类型是用户永远看不到但代码里存在的？

### 第二层：AI 消息渲染
4. `AssistantTextMessage.tsx` 怎么渲染 Markdown？用什么 parser？代码块怎么高亮？
5. `AssistantToolUseMessage.tsx` 怎么显示工具调用？展开/折叠逻辑是什么？
6. `AssistantThinkingMessage.tsx` 的 thinking 动画怎么做的？extended thinking 和普通 thinking 有区别吗？
7. `AssistantRedactedThinkingMessage.tsx` -- 什么情况下思考被裁剪？UI 上怎么告知用户？

### 第三层：工具结果消息
8. `UserToolResultMessage/` 子目录为什么独立出来？有 8 个文件处理工具结果的不同状态
9. 工具成功、失败、被拒绝、被取消四种状态的视觉差异是什么？
10. `GroupedToolUseContent.tsx` 怎么把多个工具调用分组显示？折叠逻辑是什么？
11. `CollapsedReadSearchContent.tsx` -- 读文件/搜索结果为什么需要专门的折叠组件？

### 第四层：系统消息
12. `RateLimitMessage.tsx` 怎么处理限速？显示倒计时吗？
13. `SystemAPIErrorMessage.tsx` 的错误信息有多详细？给开发者看还是给普通用户看？

### 第五层：视觉层次
14. 不同消息类型的视觉层次怎么区分？颜色、缩进、边框的规则是什么？
15. 消息之间的间距规则是什么？连续相同类型的消息怎么处理？

## 文章结构建议

1. **开头钩子**：ChatGPT 的消息就两种——用户和 AI。Claude Code 有 41 种，因为 coding agent 的"对话"远不止文字聊天
2. **消息类型全景图**：一张图展示 41 种消息的分类和数量
3. **三条线索拆解**：
   - 线索一：一次普通对话——UserTextMessage -> AssistantTextMessage
   - 线索二：一次工具调用——AssistantToolUseMessage -> 权限请求 -> UserToolResultMessage
   - 线索三：一次错误——SystemAPIErrorMessage / RateLimitMessage
4. **thinking 消息特写**：动画实现、裁剪机制、视觉设计
5. **对从业者意味着什么**：消息类型的粒度决定了 agent 产品的信息透明度

## 交叉引用

- [[2026-04-16-ux-design-system]] -- 消息组件使用 ThemedText/ThemedBox
- [[2026-04-16-ux-spinner-animation]] -- thinking 消息使用 Spinner 动画系统
- [[2026-04-16-ux-permission-system]] -- 工具调用消息触发权限请求
- [[2026-04-16-ux-app-screens]] -- REPL.tsx 是消息列表的容器
