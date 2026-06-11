---
title: 四专家并发 UIUX Critique（创作者视角）
type: evaluation
created: 2026-06-11
tags: [uiux, critique, 大改版]
---

# 四专家并发 UIUX Critique · 2026-06-11

> 方法：playwright 全页截图 9 页（portal/post/overview/setup/discover/produce/runs/queue/analytics，1440 宽）+ 源码核对。
> 四个镜头并行：A 新手首登 / B 日常动线 / C 视觉与信息架构 / D 自动化信任与文案。
> 每条发现都定位到截图与源码行。本文是四份完整报告的归档 + 收敛综合。

## 综合判决（四镜头一致收敛）

**一句话：发动机是为创作者造的，仪表盘是写给造发动机的人看的。**

四位专家独立得出同一组结论，按共识强度排序：

1. 🔴🔴🔴🔴 **机器语言渗透**（4/4 一致）：slug 当标题、`n.router`/`m.article`/`spec_lock`/"契约"/"硬停"直出 UI、blocked 文案是工程日志、数据页空态让用户跑带参数的 Python 命令。
2. 🔴🔴🔴 **Strategy 确认是盲签**（3/4 独立发现）：「生成并确认」一键完成"DeepSeek 生成草案 + 置 confirmed"，**用户从未见过草案就签了字**——产品宣称的"唯一硬停"被自己的按钮穿透，信任承诺造假级问题。
3. 🔴🔴🔴 **动线终点断在终端**（3/4）：审核页发布动作 = 复制 `python3 send_email.py --send` 去命令行。非技术用户在闭环最后一步 100% 卡死（系统明明已有 server-action spawn 能力）。
4. 🔴🔴🔴 **三~四套编号互相打架**（3/4）：侧栏 0-7、页内 H2 ①-⑤（运行=③合规=③撞号）、总览闭环条 1-5（跳过运行/审核）、setup 页内又一套 ①-④。新手靠编号建心智模型，系统教了 3 个矛盾流程。
5. 🔴🔴 **列表被历史债淹没**：produce 17 张卡按"进度低在前"（烂尾永远霸榜）、queue 108 行"未动"红 chip 海（排序正好反了：今天能发的沉底）。
6. 🔴🔴 **进度条视觉说谎**：黄黑斑马纹无图例，8% 的项目看起来像 80%；卡住的格子反而透明不可见。
7. 🔴 **门面工程 bug**：portal 日期渲染成 `Wed May 27 2026 08:00:00 GMT+0800` 两行 + 卡片按英文星期字典序排序（乱序）；post 页 0 配图（图在 assets/ 没回插正文）；hasVideo 只认旧文件名导致视频统计 6→2。
8. 🔴 **接入页无法零知识完成**：API Key 无获取指引无连通验证；gpt-image"网关"是作者私有服务外人拿不到 key 还是默认值；".example 复制（M2.5）"文案误导。

## 全员 Top5 交集 → 改版主轴

1. **诚实修复**（信任地基）：Strategy 确认拆两步（先看草案再确认）+ 进度条诚实化 + blocked 三态化（等你/差配置/出错）每条带 CTA
2. **人话化**（一张 NODE_LABEL 映射表渲染层统一翻译，黑话清单 22 条 + 命名映射 25 条见下）
3. **按钮化**（发布动作 server-action 化，终端命令降级为"高级"折叠）
4. **以"人的一天"重排**（导航 10→6：今天/选题/生产[吞并运行]/出厂[合规+审核]/投放/数据+小红书；接入沉为设置；produce/queue 按"等我决定/在跑/卡住/可发"分组，中文标题取代 slug）
5. **统一系统**（一套编号单一来源；状态色规范：amber=等人、sky=在跑、ink=完成、red=失败、灰=未排；日期统一 YYYY-MM-DD；text-[11px]→12px 地板）

## 资产表 1 · 黑话→人话（渲染层 NODE_LABEL 映射，摘录）

| 内部词（UI 现状） | 人话 |
|---|---|
| n.router 入口路由（5 原子推荐） | AI 定位选题（推荐角度和标题） |
| n.strategy / Strategy Spec / 硬停 | 写作策略（等你拍板） |
| n.evidence | 抓原文、找证据 |
| m.article | 写稿 |
| m.tone_gate / a.tone_lint | 语气检查 |
| m.polish | 润色 |
| m.visual / visual.backend | 配图 / 配图引擎 |
| m.video / video.backend | 生成视频 / 视频引擎 |
| m.podcast / a.tts | 生成播客（配音） |
| m.email_package / a.email_draft | 邮件草稿（存进你的邮箱草稿箱） |
| a.wechat_draft | 公众号草稿 |
| c.distribute_all | 全渠道草稿打包 |
| spec_lock(.yaml) | 生产卡（项目配置单） |
| slug | 短名（用于网址，可自动生成） |
| run / runner / driver | 任务 / 自动流水线 |
| 契约未过 | 产物没齐 / 质检没过 |
| BYOK / executor | 用你自己的模型 Key 自动跑 |
| READY.md / send.sh | 发布清单 / 发布脚本 |
| factory.config.yaml | 工厂设置 |
| "确定性节点但需凭证/网络/模型…暂不自动跑" | "这一步要动你的账号，AI 不会自动碰——去审核页一键生成草稿" |
| "已达单 run LLM 调用上限 12" | "触发了花费保险丝（你设的上限），防失控消耗" |
| tools/perf_record.py --slug … | "发布后回来填一次互动数〔记录第一篇〕" |

## 资产表 2 · 状态色规范（全局替换目标）

| 色 | 唯一语义 | 现状违例 |
|---|---|---|
| amber | 等人动手 | 同时表示草稿/卡住/待确认/可跑/warn 五义 |
| sky | 机器在跑 | runs 用了，produce 同数据用黄黑斑马 |
| ink | 完成 | 与 emerald 分裂（setup/数据中心用绿） |
| red | 失败 | "未动"用红虚线（未动不是错误！） |
| 灰 | 未排/跳过 | — |
| violet | 删除该色 | queued 与 ready 语义相反共用 |

## 资产表 3 · 立修 bug 清单（可测试断言）

| Bug | 位置 | 断言 |
|---|---|---|
| 日期渲染 Date 对象全串 | web/lib/content.ts:88 | DOM 不含 "GMT+0800" |
| 卡片按英文日期字典序排序 | 同上（连带自愈） | portal 卡片日期降序 |
| hasVideo 只认 video_horizontal/vertical | content.ts:99-101 | 统计含 video.mp4 |
| Seedance 双 key 共用一个已配标志 | ConfigEditor.tsx:94-95 | 独立标志 |
| NewProjectForm 指引指向不存在的「开始」 | NewProjectForm.tsx:41 | 文案与实际按钮一致 |
| 收件箱说"勾选"但无勾选框 | RadarInbox.tsx:79 | 文案或控件二选一 |
| 「实时（每3s）」暂停的是刷新不是 AI | RunsConsole.tsx:112 | 文案改"自动刷新" |
| rerunNode action 写好了无人调用 | runs/actions.ts:65 | blocked 卡有重试按钮 |
| TableView 空值渲染 text-line "·" | TableView.tsx:13 | 空串+aria-hidden |
| accent #d4541e 对比度 3.7:1 | globals.css | ≥4.5:1 或仅大字 |

## 四份完整报告索引

四份完整 critique（含逐页评分、22 条黑话清单、30 条文案改写表、IA before→after 树、空状态 9 页评分）保留在会话记录中；本页为可执行核心。执行优先级见 EVAL_CRITERIA.md（客观评估标准）与改版任务拆解。
