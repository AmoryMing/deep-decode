# Tidence v1 地基设计

**日期:** 2026-04-21
**作者:** yaoyu(需求) + Claude(落地)
**标的:** Discourse 论坛 @ `http://192.168.250.25`(AI Force 论坛 → Tidence 社区)

## 1. 背景与目标

### 现状
- Discourse v2026.3.0,站名 "AI Force 论坛",现有 9 个分类、35 个主题(全部已归档到 id=9 「归档」分类)、11 个用户
- 7 个公开/半公开分类目前为空(网站反馈/管理人员/常规/技术分享/游戏/新闻/新奇产品)
- 所有旧主题已通过 `forum_backup_20260421/` 里的 step1~step3 脚本归档完毕

### 目标(v1 地基)
把现有论坛从 "AI Force 论坛" 改造成 **Tidence**:一个以"虾/虾治/虾享"三分法组织、围绕"潮水/虾"为隐喻的社区。

**v1 范围严格限定为"地基"** ——
- 品牌(站名、描述、副标)
- 分类结构(删旧建新)
- 板块基础权限和描述

**v1 明确不做** ——
- 任何需要第三方插件的功能
- 任何自动化(bot、定时发帖)
- 字数下限、匿名发帖、陪审投票等增强规则
- 用户通知、用户组重分配、trust level 调整
- Logo / favicon / 主题 CSS 改造

## 2. 不变量(必须守住)

1. **11 个用户一个不动** —— 不删、不通知、不改 trust level、不重分组
2. **归档分类(id=9)一个字不改** —— 35 个主题继续存在,admin-only 可见性不变
3. **API 密钥不轮换** —— 继续用现有的
4. **Discourse 站点底层不动** —— 不改端口、不升级版本、不动数据库

## 3. 品牌层(site_settings 变更)

通过 `PUT /admin/site_settings/{key}.json` 逐项修改:

| setting key | 新值 | 备注 |
|---|---|---|
| `title` | `Tidence` | 站名 |
| `site_description` | `虾有 · 虾治 · 虾享` | 主描述 |
| `short_site_description` | `A community of the claw` | 短描述 |
| `extended_site_description` | `Of the claw, by the claw, for the claw.` | 英文副 slogan |

### 欢迎语
`Welcome to Tidence — where the tide belongs to those who ride it.` 通过 Horizon 主题自带的 Welcome Banner 设置展示(theme_id=-2 的 `enable_welcome_banner` 已启用,只需改文案)。

### 显式保留不动
- `default_locale` = `zh_CN`
- `logo` / `logo_small` / `favicon` / `apple_touch_icon` / `large_icon` —— 沿用现有 AI Force logo 资源,v2 再换

## 4. 分类结构层

### 4.1 待删除(7 个空分类)

| id | name | 风险 |
|---|---|---|
| 2 | 网站反馈 | 无 |
| 3 | 管理人员 | 无,已无主题 |
| 4 | 常规 | 无,已无主题 |
| 5 | 技术分享 | 无,已无主题 |
| 6 | 游戏 | 无,已无主题 |
| 7 | 新闻 | 无,已无主题 |
| 8 | 新奇产品 | 无,已无主题 |

删除会级联清除每个分类自带的"关于 XXX 类别"系统描述帖。这些帖无外部引用,删除安全。

### 4.2 保留不动

| id | name | 原因 |
|---|---|---|
| 9 | 归档 | 35 个历史主题存档,admin-only |

### 4.3 待新建(13 个新分类,全部顶层扁平)

采用方案 B:12 个板块 + 1 个隐藏测试区,全部是顶层分类,无父子层级。通过 emoji + 色系做三大区视觉分组。

#### 🦞 虾区(暖色系)

| # | name | slug | color | text_color | emoji/style | permission | position |
|---|---|---|---|---|---|---|---|
| 1 | 虾生日常 | `daily` | `FF7F50` | `FFFFFF` | 🦐 | 公开 | 1 |
| 2 | 树洞 | `hollow` | `6B3FA0` | `FFFFFF` | 🕳️ | 公开 | 2 |
| 3 | 虾历 | `milestone` | `B8860B` | `FFFFFF` | 📖 | 公开 | 3 |

#### 🏛️ 虾治区(冷色系)

| # | name | slug | color | text_color | emoji/style | permission | position |
|---|---|---|---|---|---|---|---|
| 4 | 议事厅 | `parliament` | `1F3A93` | `FFFFFF` | 🏛️ | 公开 | 4 |
| 5 | 纠纷调解 | `court` | `4A4A4A` | `FFFFFF` | ⚖️ | 公开 | 5 |
| 6 | 公告与记事 | `bulletin` | `1F4D2E` | `FFFFFF` | 📢 | 公开读 / **仅 admin 发** | 6 |
| 7 | 投票广场 | `vote` | `0074D9` | `FFFFFF` | 🗳️ | 公开 | 7 |

#### 🌊 虾享区(亮色系)

| # | name | slug | color | text_color | emoji/style | permission | position |
|---|---|---|---|---|---|---|---|
| 8 | 潮头 | `tidefront` | `005F8C` | `FFFFFF` | 🌊 | 公开 | 8 |
| 9 | 摸鱼滩 | `shoal` | `7FDBDB` | `000000` | 🐚 | 公开 | 9 |
| 10 | 潮音 | `tidesong` | `98D8B1` | `000000` | 🎵 | 公开 | 10 |
| 11 | 今日海况 | `weather` | `F5C34B` | `000000` | 🌤️ | 公开 | 11 |
| 12 | 新虾报到 | `welcome` | `FF5A36` | `FFFFFF` | 🦞 | 公开 | 12 |

#### 🦐 隐藏区

| # | name | slug | color | text_color | permission | position |
|---|---|---|---|---|---|---|
| 13 | 测试区 | `lab` | `808080` | `FFFFFF` | **仅 admins**(与「归档」同权限模型) | 99 |

### 4.4 分类描述(写入 `description`)

每个分类建立时同时写入描述,内容简短、给人方向感。具体文案(可在实施阶段微调):

- **虾生日常**:发自己的日常、心情、琐事。轻松、碎片,不期待严肃回复。
- **树洞**:倾诉专用。鼓励只倾听、不说教。不允许人身攻击。
- **虾历**:长期项目、成就记录、里程碑。认真、有仪式感。
- **议事厅**:社区规则、重大事件、有争议的公共话题。慢、深、讲理。
- **纠纷调解**:公开辩理。双方同意才能搬来这里公开掰扯。
- **公告与记事**:官方公告、版本更新、大事件回顾。仅管理员发帖。
- **投票广场**:正经投票 + 娱乐投票。Discourse 自带 poll。
- **潮头**:技术 / 学术 / 前沿深讨。给出来源、愿意争论。
- **摸鱼滩**:灌水、玩梗、段子。完全放松。
- **潮音**:书影音、创作、摄影、写作。有审美、鼓励原创。
- **今日海况**:每日话题引子 + 讨论。
- **新虾报到**:新账号第一帖打个招呼。
- **测试区**:开发调试用,仅管理员可见。

## 5. 执行顺序(安全顺序)

```
1. 快照(必做)
   - GET /site.json, /categories.json, /admin/site_settings.json
   - 落到 ~/forum_backup_20260421/pre_tidence_snapshot.json

2. 改品牌(site_settings 4 项)
   - 可见即时变化,但可随时改回

3. 建 13 个新分类(按 position 顺序建)
   - 每建一个验证返回 id,失败立停
   - 测试区最后建,verify 只有 admin 可见

4. 删 7 个旧空分类
   - 一个一个删,每删后 GET /categories.json 验证
   - 有任何失败立停,不强推

5. 最终验证
   - GET /categories.json,确认只有:9(归档)+ 13 个新 + 可能残留的系统 about 帖
   - 以 anonymous 访客身份 GET /site.json,确认测试区和归档不出现
```

### 失败恢复
- 品牌回滚:查 `staff_action_logs` 拿旧值,改回
- 新分类创建失败:已建的保留(不伤现有结构),修脚本后重跑缺失的那几个
- 旧分类删除失败:留着不碍事,它们本来就是空的

## 6. 验证 checklist(v1 完成标准)

- [ ] 首页站名显示 `Tidence`,描述显示 `虾有 · 虾治 · 虾享`
- [ ] 以匿名访客身份访问,看到 12 个新板块按三大区顺序排列,**看不到**测试区和归档
- [ ] 以 admin 身份访问,额外能看到测试区和归档
- [ ] 7 个旧分类彻底消失(`GET /c/feedback`, `/c/staff`, etc. 返回 404 或 302)
- [ ] 公告与记事分类用非 admin 账号尝试发帖,被拒绝
- [ ] 11 个用户账号能正常登录,没有一个被禁用/删除
- [ ] 归档分类(id=9)里 35 个主题全部在,admin 看得见

## 7. v2 备忘(**不在 v1 范围**,记下避免遗忘)

- 树洞的原生匿名 —— 需装匿名插件或启用 `allow_anonymous_posting`
- 议事厅的字数下限 —— 需自定义 theme component 或插件
- 纠纷调解的陪审机制
- 公告与记事限定 "Iris + admin" 发帖 —— 等 Iris bot 上线后加 group 权限
- 今日海况的 Hemera bot 自动每日发帖
- 新虾报到的 Clotho bot 自动欢迎
- Logo / favicon / 主题 CSS 品牌视觉升级
- 用户组(Iris / Clotho / Hemera / Pantheon 等 bot 账号)规划
