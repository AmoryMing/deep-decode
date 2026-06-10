# PLATFORM_SPEC — open-content：把内容工厂做成创作者平台

> status: **active build** (driven by `/loop`)
> created: 2026-06-10
> 框架对外名：**open-content**（见 [SPLIT_SPEC.md](SPLIT_SPEC.md)）

这份文档是自驱构建循环的**主干**。每次 loop 迭代：读这里 → 选下一个未勾选项 → 实现 → 勾掉 → 提交。
它把"production level platform that can truly help creators"拆成可验收的里程碑，避免循环在长链路里走丢
（这正是项目两个月最大的痛点：[痛点考古结论](#) runner 采用率 8/154——所以平台的铁律是**UI 只能通过 runner 干活，没有旁路**）。

## 北极星

一个非技术创作者能完成这条闭环，全程在 GUI 里、不碰命令行：

```
接入知识库 + 模板 + 读者画像
   → 每天收到自动推送的候选选题
   → 勾几个，给每个选渠道/产物/读者风格/声音/动效
   → 按「开始」推进内容流水线
   → 看进度条（多批次并行可见）
   → 审核 + 发布日历
   → 看数据：哪些内容好、哪些差 → 反哺选题
```

## 现状基线（2026-06-10）

- ✅ 引擎层：`skillgraph.yaml` + `tools/pipeline.py`（status/next/verify/gate，硬产物门）
- ✅ 原子：tone_lint / tts_atom / imagegen_relay / gen_send_sh / xhs_* / video pipeline
- ✅ Web：Next.js 15 admin（选题/产出/合规/审核/投放/数据 六页），但**全部只读展示 markdown**
- ✅ 审核队列 v0（`/admin/queue`，能回填 published.md）
- ❌ 缺口：UI 不能**启动**或**观测**一次 pipeline run；runner 只有 CLI、只有彩色文本输出
- ❌ 缺口：生成步骤（写稿/取证）需要 agent 或 LLM API；目前靠操作者的 Claude Code 会话手动跑
- ❌ 缺口：reader/wiki/template 的接入靠手改文件，没有 UI

## 里程碑

### M1 · 机器可读的流水线状态 ▶ keystone
**目标**：任何 UI 进度功能的地基——一条命令吐出某项目的全节点状态 JSON。
- [x] `pipeline.py status --json`：输出 `{slug, confirmed, progress:{done,total}, next, nodes:[{id,layer,title,status,blocked,details}]}`
- [x] `web/lib/projectState.ts`：按 slug 跑 runner 取 JSON（本地工作台；Vercel 只读时优雅降级）
- [x] 产出页 `/admin/produce` 对在写项目显示真实**节点级进度条**（不再只是"四件套齐全度"的静态点）
- 验收：打开产出页能看到某 in-progress 项目"7/14 节点"的进度条 + 卡在哪个节点 ✅ 已验证

### M2 · 从 UI 启动一次 run + 进度轮询 ✅
**目标**：「press start」+「progress bar」。
- [x] run 状态模型：`output/<slug>/_state/run.json`（status / 当前节点 / 进度 / blocked_reason / history / log_tail；gitignore）
- [x] `tools/run_pipeline.py`：driver——循环问 `build_status` → 安全确定性原子自动跑 → mark/gate → 写 run.json；生成/agent/重原子停在 blocked 并写**精确原因**（绝不静默跳过）。带 `--once/--dry-run/--node` 定向重跑
- [x] 确定性原子自动跑：`a.tone_lint` 已接（幂等白名单 SAFE_AUTORUN）；其余重原子（tts/imagegen/video/各渠道）默认 block 说明，待显式启用
- [x] web server action `startRun(slug)`（detached spawn，防穿越）；`/admin/runs` 实时进度页（每 3s 轮询 `/api/runs`）；产出卡片「▶ 开始」按钮
- [x] 并行批次：多 run 各自 run.json，`/admin/runs` 一屏看全部，活跃排前
- 验收：UI 点开始 → driver 自跑 → 正确停在生成节点 `n.router`，进度条 + 卡住原因实时显示 ✅ 已浏览器验证

### M2.5 · BYOK 生成执行器（让 run 真正产出，不止于 block）✅ 核心打通
**目标**：生成节点由 LLM API 自动跑，run 能真正推到 draft-ready。
- [x] `factory.config.yaml`：DeepSeek key（用户提供）+ 分级路由（分类 v4-flash / 写稿 v4-pro），gitignore
- [x] `tools/llm_executor.py`：OpenAI 兼容调用（urllib 无新依赖）+ 执行器 router/evidence/article/strategy；URL 抓正文做一手素材
- [x] 成本护栏：单次 max_tokens + 单 run max_calls，读 factory.config.budget
- [x] 接进 driver：生成节点走 executor；atom: 别名解析（tone_gate 自动跑 tone_lint）；修了"Strategy 未确认却误报 done"的 bug
- [x] UI Strategy 确认按钮（生成草案 + 置 confirmed，放行下游）
- 验收：decode 项目 driver 自动 router→evidence→article→tone_gate（5/11），**DeepSeek 写的 3600 字文章 0 违规过 tone_lint**，停在 m.polish（待接 executor）✅ 已验证
- [x] m.polish / m.factcheck（DeepSeek）✅ 产物过契约（polish_report structure/prose/verdict；factcheck claims/verdict）
- [x] m.visual（gpt-image，可配置后端）✅ 实测出 5 张 1024×1536 PNG 过 glob≥4 契约；修了本地代理 SSL EOF（NO_PROXY）
- [x] m.video（Seedance AK/SK V4 签名，tools/seedance_atom.py）✅ 签名通过；**账号需在火山控制台开通视频模型权限**（当前 50400 Access Denied）

### M7 · 视频后端（Seedance + 可配置）✅ 全通
- [x] `video.backend` 可插拔：remotion | seedance | open-design-html（factory.config，UI 可改）
- [x] `tools/seedance_atom.py`：火山视觉 API 提交→轮询→下载，V4 签名纯标准库
- [x] **实测出片**：req_key=`jimeng_t2v_v30_1080p`（账号已开通 3.0 1080P），提交→轮询→下载 **7.7MB 真 MP4** ✅
- [x] m.video 契约 backend-aware：seedance 出片 → node_status 认 `satisfied` → 不卡 remotion 的 podcast/scene_plan 契约
- [x] driver 实测：article→m.video(seedance 出片)→satisfied→推进到分发 ✅ 8/11
- [ ] Pro（3.0Pro 1080P）req_key 未定（jimeng_ti2v_v30_pro 仍 Access Denied）——查产品接入文档；3.0 1080P 已够用
- [ ] open-design-html 后端（github.com/nexu-io/html-video，本地无 key）——更适合"动画信息图视频"，留作第三后端

### M3b · UI 配置编辑器 ✅
- [x] `/admin/setup` 顶部配置卡：模型 key/provider、按节点模型、visual/video backend、渠道，写 factory.config.yaml
- [x] key 写入式（留空保持不变，不回传明文），保存往返保 key 完整 ✅ 已验证

### M3 · 接入创作者资产（onboarding）
**目标**：创作者插自己的 wiki + 模板 + 读者画像，全在 UI。
- [x] `factory.config.yaml.example`：路径/渠道/模型 key/成本护栏/默认原子，单一配置源（gitignore 真文件）
- [x] `/admin/setup` 页：config 状态（per-provider key 检测）+ reader/style/content_type/渠道/wiki 清单，缺项标红 ✅ 已验证
- [ ] reader 画像编辑器：UI 读写 `readers/<r>/{persona.md,tone.yaml}`（盘点→可编辑）
- [ ] 读者画像编辑器：`/admin/setup/reader` 读写 `readers/<r>/{persona.md,tone.yaml}`
- [ ] 知识库接入：UI 导入 → 走 ingest skill 写 `wiki/sources|concepts`（先支持粘贴/文件，RSS 留 M4）
- [ ] 模板选择：content_type ↔ 模板在 UI 可视、可选（读 `templates/content/_registry.yaml`）
- 验收：新建一个 reader 画像 + 导入一篇素材，全程不碰文件系统

### M4 · 每日选题自动推送
**目标**：「daily auto push of possible topics」。
- [ ] scout 定时（cron / `/schedule`）→ 写 `wiki/radar/YYYY-MM-DD.md` + 打分
- [ ] `/admin/discover` 把雷达做成**收件箱**：候选选题卡，可勾选、可一键转项目
- [ ] 选题 → 批量建 `output/<slug>/` + spec_lock（带所选配置）→ 进 M5 配置台
- 验收：雷达今日条目在选题页可勾选，勾完一键生成 N 个待配置项目

### M5 · 配置台 + 批量启动
**目标**：「select channel/output/reader-style…press start…parallel batches」。
- [x] 新建项目表单（`/admin/produce`）：标题/输入/content_type/reader/style/voice/渠道 → 写合法 spec_lock → 建 output 目录 ✅ 已验证（UI 建的 spec_lock 被 runner 正确解析成 13 节点）
- [x] 建好即出现在产出页进度列表，可点「▶ 开始」入队 M2 driver → `/admin/runs` 看进度
- [ ] Strategy Spec 确认做成 UI 卡片确认（当前 strategy_confirmed 仍需手动/CLI；UI 确认按钮待接）
- [ ] 批量：选多个选题一次配置 + 一键全启动（单建已通，批量待加）
- 验收（单条）：UI 新建 → 出现在列表 → 点开始 → driver 自跑到 blocked ✅

### M6 · 发布日历 + 数据闭环
**目标**：「publish calendar」+「what performs good/bad → 反哺」。
- [ ] `/admin/calendar` 接真实 published.md + 排期，按平台/日期网格
- [ ] 数据接入：各平台后台数据归集（公众号/小红书先行）→ `/admin/analytics`
- [ ] 爆款归因：好/差内容对比 → 选题打分加权（把表现喂回 M4 的 scout 打分）
- 验收：日历显示真实发布；数据页按表现排序，差内容可一键"别再选这类"

### M7 · 视频后端（Seedance + open-design HTML→video）
**目标**：用户可提供 Seedance API；复用 open-design 的 HTML→video。
- [ ] `video_backend` 可插拔原子：`remotion`（现状）| `seedance`（API）| `open-design-html`
- [ ] Seedance API 原子：读 key、提交任务、轮询、落 mp4，进 video 契约
- [ ] 评估 open-design HTML→video pipeline，作为 SVG/动效卡的视频化路径
- 验收：spec_lock 切 `video_backend: seedance` 能出片并过 av_sync 契约

### M8 · open-content 打包（开源）
**目标**：第二个用户能装上跑（按 SPLIT_SPEC）。
- [ ] 框架/私有拆分（SPLIT_SPEC §5）+ 凭证清理 + gitleaks
- [ ] `init.sh` 脚手架空工厂；examples/ 脱敏画像与风格
- [ ] 打包成 Claude Code plugin + docker compose 起 web
- [ ] 双语 README（产品向，非作品集向）+ 架构图
- 验收：在干净目录 `init.sh` → 填 config → 跑通一篇 demo

## 🎯 端到端验收（2026-06-10）
一句选题 → 全自动产出内容包，**9/13 节点无人工**（仅 Strategy 一次 UI 确认）：
- Strategy(确认) → router → evidence → article → tone_gate → polish → factcheck → visual → (跳过video) → 停在分发打包 ✅
- 成品：6355 字文章**过 tone_lint 0 违规**（有"本期关键词"、评论员视角）+ polish_report(pass) + factcheck.json + **5 张 1024×1536 杂志风配图**
- 全程 DeepSeek（文）+ gpt-image（图），配置全在 factory.config.yaml（UI 可改）
- 可选节点按 spec 跳过（创作者关掉视频/播客 → 不 block）：driver skip + node_status 认 skipped
- **停在 m.email_package（分发打包）= 人审边界**（合规铁律：成稿到 draft-ready 即停，人审后发 → 走「审核」队列）

**唯一外部阻塞**：Seedance 视频需你在火山控制台开通"即梦视频生成"权限（当前 50400 Access Denied）。签名+提交+轮询+下载代码已就绪并验证，开通即可用。
**一个收尾项**：m.video 节点契约目前是 remotion 专属（podcast/scene_plan/captions）；seedance 后端要满足它需加一个 backend-aware 的契约变体（小改 skillgraph）。

## 决策记录
- 框架名 = **open-content**（用户 2026-06-10 拍板）
- 发送动作永远人审后（合规 + 痛点教训）；driver 跑到 draft-ready 即停
- BYOK：生成步骤调国产/Claude API，不依赖操作者盯着 Claude Code 会话——否则不算"production"
- 顺序理由：M1→M2 是地基（没有可观测/可启动的 run，后面全是空中楼阁）；M3-M5 是创作者入口；M6 闭环；M7-M8 增强与开源
