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

### M2.5 · BYOK 生成执行器（让 run 真正产出，不止于 block）▶ 高价值
**目标**：生成节点（router/evidence/article/polish…）由 LLM API 自动跑，run 能真正推到 draft-ready。
- [ ] `factory.config.yaml`：模型 provider + key（DeepSeek/Claude/豆包）+ 每节点模型选择
- [ ] generative executor：按节点 `run:` + 模板/reader/wiki 组 prompt → 调 API → 落产物 → 过契约
- [ ] 成本护栏：每 run token 上限、缓存、dry-run 估价（呼应 OPTIMIZATION_BACKLOG 成本 2 分）
- [ ] 接进 driver：SAFE_AUTORUN 之外，生成节点走 executor 而非 block
- 验收：一个 decode 项目从 router 一路自动跑到 article 过 tone/polish 契约，全程无人工

### M3 · 接入创作者资产（onboarding）
**目标**：创作者插自己的 wiki + 模板 + 读者画像，全在 UI。
- [x] `factory.config.yaml.example`：路径/渠道/模型 key/成本护栏/默认原子，单一配置源（gitignore 真文件）
- [ ] `/admin/setup` 页：展示 config 状态 + reader/style/template/渠道 清单（先只读盘点）
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
- [ ] 配置台：每个选中选题选 channel(s) / 产物(文图播客视频) / reader / style / voice / 动效要求 → 写 spec_lock
- [ ] Strategy Spec 确认仍是唯一硬停，但做成 UI 卡片确认（不进终端）
- [ ] 「开始」批量入队 M2 的 driver，回到 `/admin/runs` 看并行进度
- 验收：3 个选题各配不同渠道，一键启动，三条进度条并行推进

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

## 决策记录
- 框架名 = **open-content**（用户 2026-06-10 拍板）
- 发送动作永远人审后（合规 + 痛点教训）；driver 跑到 draft-ready 即停
- BYOK：生成步骤调国产/Claude API，不依赖操作者盯着 Claude Code 会话——否则不算"production"
- 顺序理由：M1→M2 是地基（没有可观测/可启动的 run，后面全是空中楼阁）；M3-M5 是创作者入口；M6 闭环；M7-M8 增强与开源
