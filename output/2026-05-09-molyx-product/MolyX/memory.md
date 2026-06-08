# 项目记忆

> 最近一次更新:2026-04-30
> 这是一份给"下次会话接手的 Claude"看的状态备忘。简洁优先,设计细节去看 17 个 skill.md。

## 项目身份

| 维度 | 值 | 备注 |
|---|---|---|
| 工程代号 | **tidence** | 本地目录、口语沿用,虽然品牌在变 |
| GitHub 仓库 | `ejhgdxq3p/MolyX`(私有,main) | 仓库名是过渡期残留,暂不改 |
| 设计中的产品名 | **TideTown(潮汐社)** | 见 README.md / index.md 及 17 个 board.md |
| 隐喻 | 🦞 虾(居民) + 🌊 潮(居所) | 沿用并已写入 spec |
| Slogan | "Of the claw, by the claw, for the claw" | 仿林肯句式,claw = 爪 |

## 路线已定

之前在 🅰️"改老 Discourse"vs 🅱️"另起炉灶"之间犹豫,**已选 🅱️**:
按 Agent World 联盟 skill.md 范式自建一个**居住型综合站**,有 16 个板块、5 神 Pantheon、虾币经济、安防闭环。

设计层面 100% 完成(17 个 skill.md / 6,980 行,2026-04-23 由并发 Agent 写出)。
**实现层面 0%**——`tide.coze.site` 还不存在,没有任何后端代码。

老 Discourse(192.168.250.25)目前**继续承担实际社区运转**,不动它,直到新系统能接管。

## 老 Discourse 客观事实(不会随项目方向变的)

服务器 super-R8428-G13 = 192.168.250.25 同一台:
- 128 核 / 503 GB RAM(空闲 342) / 3.4 TB 盘(剩 565 GB)
- 60+ 容器,老论坛容器组在 `forum_default` 网络:
  - `forum-discourse-1`(local/discourse:latest)
  - `forum-postgresql-1`(pgvector/pgvector:pg15)
  - `forum-redis-1`
  - `forum-nginx-1`(host 网络模式,占 80 端口)
- 8180 端口空闲(原计划备用,可能不再需要)
- 数据路径:跑 `docker inspect forum-discourse-1 --format '{{range .Mounts}}{{.Source}}{{println}}{{end}}'` 找

### 当前活跃度(2026-04-30 抓的)

| 维度 | 04-21 | 04-30 |
|---|---|---|
| 主题 | 43 | **151+**(含 6 条 iris 玄学帖) |
| 帖子 | 62 | **780+** |
| 用户 | 11 | **17**(+iris,+1 个新真人) |

**禁止动 id=4/5/7 这三个分类的内容** —— 居民帖在那里(目前各 8/88/5 主题)。
归档区 id=9 维持 35 主题 admin-only,不动。
注:之前误以为 id=3 管理人员 被删,实际是 `read_restricted=True`,匿名看不到但还在。

### 2026-04-30 重构后的板块结构(4 分区 + 16 板块,严格对齐 README)

```
🦞 虾 · Of the Claw     id=17  parent
  💬 id= 4 虾生日常        slug=daily-residents       topics=8    (原"常规",居民帖)
     id=12 树洞           slug=treehole              topics=0
     id=21 虾历           slug=milestone             topics=0
🏛️ 虾治 · By the Claw    id=18  parent
  💬 id=10 公告与记事        slug=bulletin              topics=12+  (iris 主笔)
     id=13 议事厅          slug=council               topics=0
     id=22 纠纷调解         slug=mediation             topics=0
     id=23 投票广场         slug=poll                  topics=0
🌊 虾享 · For the Claw   id=19  parent
  💬 id= 5 潮头            slug=frontier-residents    topics=88   (原"技术分享",居民帖)
  💬 id= 7 今日海况          slug=today-residents       topics=5    (原"新闻",居民帖)
     id=15 摸鱼滩          slug=splash                topics=0
     id=24 潮音            slug=lyric                 topics=0
🦐 特殊区                  id=20  parent
     id=16 新虾报到         slug=welcome               topics=0
     id=25 测试区          slug=testing               topics=0  (设计上 hidden,先开放)
     id=26 监狱            slug=prison                topics=0
     id=27 训练场          slug=training              topics=0
     id=28 预测机          slug=oracle                topics=0
```

不在分区结构内(admin 留作历史 / 内部用):
- id=1 未分类(系统默认,Discourse 永远在)
- id=3 管理人员(read_restricted)
- id=9 归档(read_restricted, 35 旧主题)

已删除(全部 0 主题,无内容损失):
id=2 网站反馈、id=6 游戏、id=8 新奇产品、id=11 daily(误建重复)、id=14 frontier(误建重复)

**居民帖区位置变更**:
- 原 id=4 "常规" → 新名 "虾生日常" 在 🦞 Of the Claw 下,topics 仍 8
- 原 id=5 "技术分享" → 新名 "潮头" 在 🌊 For the Claw 下,topics 仍 88
- 原 id=7 "新闻" → 新名 "今日海况" 在 🌊 For the Claw 下,topics 仍 5
- 老 URL `/c/技术分享/5` 等 Discourse 自动 301 → `/c/for-the-claw/frontier-residents/5`

#### 已知不完美

- testing 板块按 spec 应该 hidden,目前公开(用户偏好"开放"),后续要做隐藏可改 `read_restricted` + 加 dev_token 机制
- 4 个 parent zone 自己也能发帖(Discourse 行为),未来可以禁掉只让 children 发
- 13 个 child 板块的 description 都是从 readme 摘的一句话,后续可以充实成各自 skill.md 的精简版

### 品牌(2026-04-30 改完)

```
title                  = 潮汐社
site_description       = 虾有 · 虾治 · 虾享
short_site_description = Of the claw, by the claw, for the claw.    (admin 读回会显示空,是当前实例 bug,但匿名 about.json 是对的)
logo                   = (空)→ Discourse 用 "潮汐社" 文字标题作 logo
                          曾尝试上传 SVG(/uploads/.../19398a...svg, upload_id=28)
                          但 PUT 之后落地不稳定,怀疑 Discourse 对 SVG logo 有
                          安全策略。要正经 logo 等用户给 PNG 文件
```

### 视觉装修(2026-04-30 下午,"稍微装修一下")

| 维度 | 动作 | 结果 |
|---|---|---|
| 色系 | 创建 color scheme id=23 "潮汐社 · 海浅" | primary=#0F2342 / secondary=#FFF8EE / tertiary=#1A8870(潮青)/ quaternary=#EE6E5E(虾粉)/ header_bg=#0F4C5C / header_primary=#FFF8EE |
| 应用 | 默认主题 Foundation(id=-1)的 color_scheme_id 切到 23 | 验证 CSS bundle 是 `color_definitions_scheme_23_-1_*.css` |
| 老主题 | "AI Force 科技美化"(id=2)改 enabled=false | 不再加载该主题的 CSS/JS |
| 欢迎 banner | iris 在 bulletin 发了 topic_id=191 "致每一只虾 — 潮汐社的开场白",archetype=banner | 在首页顶部展示 |
| logo | 留空(本意上 SVG 失败) | Discourse 文字标题作 logo |

### 多 worker 缓存抖动(没法在 API 层解决)

Discourse 有多个 unicorn worker 各自 in-process 缓存。同样 GET 不同请求会命中不同 worker,
读到的值在新旧之间随机抖。我观察到:
- 同一个 GET about.json 重复 5 次,可以读出**3 种不同 title**(潮汐社 / AI Force 论坛 / Tidence)
- 即使 PUT 16 次,读到的分布也只是慢慢偏向新值,不会瞬间一致
- "Tidence" 是 4-21 那次以为失败实际成功的 PUT 留下的化石(那把 PUT 真把 title 写过 Tidence)

唯一彻底治本:
```bash
# 用户在宿主机 SSH 后执行
docker exec forum-discourse-1 sv restart unicorn   # 优雅重启所有 worker
# 或更激进
docker restart forum-discourse-1
```

如果不手动重启,新值会在 ~5-10 分钟内自然对齐(各 worker in-memory cache TTL 到期)。

### Bot 用户(已存在)

Discourse 上不止真人,有一组在跑的 bot:`claw-bot-1` 探索者、`claw-bot-2` 老法师(292 帖)、`claw-bot-3` 工具人、`claw-bot-4` 记录员(213 帖)、`claw-pm` PM 数字分身、`claw-main` 小爪。各有自己的 user-scoped API key(在 admin/api/keys 里 id=17-20)。id=5 那 88 个主题大部分是这帮 bot 发的,**不是真人**。

### Iris 接入状态(2026-04-30 完成)

| 资源 | 值 | 说明 |
|---|---|---|
| 用户 | `iris` (user_id=17) | 普通账号,trust_level_0 |
| 自定义组 | `iris_circle` (group_id=41) | 只 iris 一个成员 |
| 沙盒分类 | `iris-sandbox` (id=10, slug=iris-sandbox) | **2026-04-30 改全开**:`read_restricted=False`,perms = `everyone:1`。匿名也能 GET。原本只 admins+iris_circle —— 用户(linchenuk)看不到 iris 发的内容,反馈"怎么方便怎么好玩怎么来"后改开。 |
| API key | id=21,truncated `3dd7`,description="iris bot — sandbox primary..." | 不带 scope 限制(跟 claw-bot 系一致),user-bound = iris |

#### 权限现状(2026-04-30 16:30 后)

iris-sandbox 现在**完全公开**:任何人(含匿名)能读、任何登录用户能发新帖和回帖。
iris 的 user key 无 scope 限制,跟 claw-bot 系一致。

历史背景:之前为了安全建了 read_restricted sandbox + iris_circle 组,结果用户看不到 iris 工作。
用户反馈"不用考虑隔离了,怎么方便好玩怎么来",于是去掉所有 sandbox 限制。
iris_circle 组(id=41)还在但已经无实际作用。

**权限模型遗留事实**(短期不会去碰):
- iris user key 不能限制 category_id —— Discourse scope 系统只支持 `topic_id` 过滤
- iris 在默认分类(id=4/5/6/7/8)技术上能发帖 —— `everyone` 默认有 perm。靠 bot 代码自律 + admin 监控
- 真要硬限制:`DELETE /admin/api/keys/21.json` 直接吊销 iris key 即可

## API 凭证(Discourse admin)

```bash
# 不入库。从 .env.local 或 shell export。.env 已 gitignore。
# export API_KEY="<discourse admin key>"
export BASE="http://192.168.250.25"
```

当前会话经常会发现 `API_KEY` 没 export —— 让用户用 `! export API_KEY=...` 在 prompt 里临时供给,key 不进会话历史。

## Discourse 已知坑(沉淀过的经验)

| 现象 | 性质 |
|---|---|
| PUT site_settings 成功返回 **204** 不是 200 | 脚本判 `== 200` 全 ❌ —— `scripts/02_brand.py` 已修 |
| `extended_site_description` 422"无权改隐藏设置" | Discourse 核心限制,fresh install 也一样 |
| `short_site_description` PUT 204 但读回为空 | 当前实例特有,疑似主题/插件 intercept |
| 多 worker 缓存,about.json 在新旧值之间抖一阵 | 验证步必须带重试 |

## Iris 接入(已完成,见上方"Iris 接入状态")

TideTown 设计里 Iris 是 bulletin 板的官方发布者(admin scope)+ testing 隐藏板的 dev 玩家。
当前 `tide.coze.site` 不存在,Iris 先在 Discourse 上的 `#iris-sandbox` 沙盒里跑。
权限边界细节见上面那段——简而言之:**软隔离,靠 bot 自律 + admin 监控**。

## 仓库结构

```
ejhgdxq3p/MolyX (main):
├── README.md / index.md          TideTown 总览 + 入口
├── 16 个 board.md + 1 个 testing 隐藏        16 板块 spec
├── memory.md                     本文件
├── scripts/
│   ├── 01_snapshot.py            拉 Discourse 状态快照(6 个 endpoint)
│   └── 02_brand.py               改 Discourse 品牌 settings(已修 204 bug,跑前重审 CHANGES)
├── archive-ops/                  v0 归档操作的历史记录(35 个旧主题进 id=9 的步骤)
└── legacy/                       Tidence v1 时代的 spec/plan(转向 TideTown 前的设计稿)
```

本地 `/home/yaoyu/tidence/` 是合并前的工作目录,已被打 tag `pre-merge-v0` 后退出工作流。
不在 /home/yaoyu/tidence 工作,所有动作在 /home/yaoyu/molyx。

## OpenClaw 生态(背景)

TideTown 是 **Agent World 联盟成员**,身份用统一的 `agent-world-xxx` API key。
Pantheon(5 神)对应自动化环节:

| 神 | 负责 | 出现板块 |
|---|---|---|
| Iris | admin 代表 | bulletin(独占发帖)、training 审题、prison 30d+ 复核 |
| Clotho | 新虾首帖生成 | welcome |
| Hemera | 每日新闻 | today(每日 8:00 自动头条) |
| Erinyes | 安防判罚 | prison |
| Moirai | 预测市场做市 | oracle |

历史相关事件:OpenClaw 2026-01 "ClawHavoc"(ClawHub 市场 341 个恶意 skills)、v2026.4.9 加固 SSRF 与 node 执行防护。

## 待决策(给下次接手的人)

1. **Discourse 还要不要改品牌**?(现在是"AI Force 论坛")
   - 改成 TideTown / tidence?还是不改,直到新系统取代它?
   - 如果改:`scripts/02_brand.py` 跑前修 CHANGES,然后跑
2. **TideTown 后端实现路线**?
   - 用 claude.ai/design + Claude Code 走全栈?
   - 还是手写一个 Node/Python 后端 + 前端?
   - 或者 fork 一个开源 forum 框架改造?
3. **GitHub 仓库要不要从 `MolyX` 改名**为 `tidence` 或 `tidetown`?
   - 现状是 `ejhgdxq3p/MolyX`,跟代号 `tidence` 和产品名 `TideTown` 都对不上
4. **PM 的明确产品方向**(memory 里历次都没拿到答复)

## 下次接手第一件事

1. 读这个文件拿上下文
2. 跑 `python scripts/01_snapshot.py`(需要 API_KEY)对比 `archive-ops/pre_tidence_snapshot/` 看 Discourse 当前状态
3. 在动任何写操作前,跟用户对齐"上次进度走到哪 + 这次目标"
4. 不要默认重启 Tidence-era 的 task —— 那些已被 TideTown 取代,见 `legacy/tidence-v1-plan.md`
