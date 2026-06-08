---
title: Claude Code 变成任务调度台
---

## 主界面变了

过去 Claude Code 的主界面是一条对话记录，人盯着当前任务往前推。新版用 claude agents 打开后，主界面变成一张状态表：Working、Needs input、Idle、Completed、Failed、Stopped。这些不是聊天软件的词,是任务系统的词。一个屏幕管所有后台 session，看哪条在跑、哪条卡在等人输入、哪条已完成。操作重心从"下一句怎么回"挪到"哪条任务线要介入"。这是助手到工作单元的分界线。

## 按空格就介入

最关键的交互叫 peek and reply。按 Space 看某个 session 最近在做什么、要什么输入、开了哪个 PR；要回复就直接在 peek 面板里回，不必打开完整对话。这把人的介入压成一个调度动作。多数时候人不需要钻回细节，只处理阻塞。这解释了为什么后台 session 能脱离终端继续跑,由独立 supervisor 进程承载——人不在场,任务也不停。

## worktree 是底座

并发不是开多个窗口那么简单。官方文档写得很细：后台 session 起步在当前目录，但要改文件时会进入 .claude/worktrees/ 下的隔离 git worktree。原因很硬：多个 coding agent 共享同一个 checkout，写文件迟早互相踩。worktree 把"同时跑多个 session"从演示变成工程现实。看不见的隔离机制，才是 agent view 不浮在表面的证据。

## goal 改的是 turn 之间

/goal 不是更长的 prompt。长 prompt 只影响当前 turn 的意图，/goal 改的是 turn 和 turn 之间的连接。你写一个完成条件，Claude 每跑完一轮，一个小模型检查条件满了没；没满就自动开下一轮，不把控制权还给你。官方把它和 /loop、Stop hook、auto mode 放进同一张比较表:/goal 在上一轮结束后触发,停止条件是模型确认目标达成。纵向续航,一条线自己跑到底。

## 把满意写成可检查

这里最重要的词不是"自动",是"可验证"。官方建议完成条件要有可测终点、检查方式和约束:测试命令退出 0、lint 干净、不改其他测试文件。/goal 奖励的不是"努力到满意",而是"把满意写成可检查的条件"。所以它支持 -p 和 Remote Control:claude -p "/goal CHANGELOG 给本周每个合并的 PR 都有一条记录",一次 CLI 调用变成跑到条件满足为止的循环。

## 调度台不等于无人驾驶

盲区要盯死。agent view 还是 research preview，界面和快捷键可能变。更要命的是 /goal 的边界:官方写明 evaluator 不独立跑命令也不读文件，只能看 Claude 已经放进对话里的内容来判断目标满没满。意思是没有对话里的证据,evaluator 就是瞎的——goal 的质量取决于 Claude 真把检查跑出来写出来。权限也没消失:文件写入、命令执行、PR 合并,仍靠权限模式、hooks、worktree 兜底。

## 成本从对话变调度

还有一笔账。agent view 的每行摘要由 Haiku 级小模型生成，/goal 每个 turn 后也触发小模型评估。单次看不大，但并发 session 一多，组织要关注的就不再只是主模型 token，而是整套 agent 操作面的 token、权限和产出质量。一个配套的硬信号:subagent 的 API 请求会带 agent id 和 parent agent id,OTEL span 也写入。agent 一旦可并发,就必须可追踪、可归因、可观测。
