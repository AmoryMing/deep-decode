# Ready: 2026-05-10-qwen-taobao-conversational-commerce

**第二篇 v0.1 端到端跑通**。

## 产物清单

| 文件 | 状态 | 备注 |
|---|---|---|
| `article.md` | ✓ | ~3000 字 / 6 章 / **polish 3/3 PASS**（按新 voice.md v2） |
| `assets/00-04.svg + .png` | ✓ | 5 张 1080×1350（封面 + 14 个月时间轴 + OpenAI 四面墙 + 两条路线对照 + 阿里双押） |
| `podcast.mp3` | ✓ | **VoxCPM2** / 45 段 / 11 分 15 秒 / 5.2 MB / loudnorm OK |
| `video.mp4` | ✓ | 1080×1350 视频号版 / 11 分 15 秒 / 19 MB |
| `video_douyin.mp4` | ✓ | 1080×1920 抖音版 / 11 分 15 秒 / 20 MB |
| `recap.md` | ✓ | 简介文案（视频/播客上传用） |
| `polish.pass / visual.pass / podcast.pass / video.pass` | ✓ | quality gates |

## 分发草稿状态

| 渠道 | 状态 | 下一步 |
|---|---|---|
| **邮件**（chinadaas） | ✅ **已存草稿箱**（含 podcast.mp3 5.2MB 附件） | 登录 exmail.qq.com → 草稿箱 → 审过 `--send` 发出 |
| **小红书** | ✅ **素材包就绪**（7 张 3:4 PNG + content.md） | 在 `distribute/xiaohongshu/`，小红书 App 手动上传 |
| **公众号** | 🟡 **未跑**（之前 IP 白名单卡住） | 你解了白名单后 `python3 ../../.claude/skills/distribute/wechat_publish.py article.md` |
| **抖音** | 🟡 **video_douyin.mp4 就绪** | `python3 ../../.claude/skills/distribute/upload_douyin.py --video video_douyin.mp4 --title "当 OpenAI 砍掉购物，阿里把 40 亿 SKU 塞进 Chat" --description-file recap.md --cover assets/00_cover.png --topics "AI,DeepSeek,阿里,千问,agentic commerce"` |
| **B 站** | 🟡 **video.mp4 就绪** | 先 `python3 ../../.claude/skills/distribute/login_bootstrap.py --site bilibili` 扫码，再跑 `upload_bilibili.py` |
| **小宇宙** | 🟡 **podcast.mp3 就绪** | `python3 ../../.claude/skills/distribute/upload_xiaoyuzhou.py --audio podcast.mp3 --title "当 OpenAI 砍掉购物，阿里把 40 亿 SKU 塞进 Chat" --shownotes-file recap.md --state ~/.content-factory/state/xiaoyuzhou.json` |
| **视频号** | 🟡 **video.mp4 就绪**，无脚本 | 手动上传 video.mp4 + recap.md 简介 |

## 工厂层面的本轮观察

1. **VoxCPM2 接口断了又通**：跑第一次时 `--interface utun7` 失败（"Couldn't bind"），切到 `--interface en0` 后正常。VPN 路由会变，建议 voxcpm2_tts.py 默认 auto-detect interface（**P1 工厂改进项**）。
2. **第二篇质量比第一篇更稳**：因为这次直接用 v2 voice.md，polish 3/3 一次过，没有翻译腔修。
3. **视频时长 11 分钟**：比 DeepSeek 那篇（7.6 min）长，因为 article 内容更结构化（4 面墙 + 时间轴）。
4. **抖音版 1080×1920** 首次产出：竖屏全幅，4 张图按 168s 均分（之前都是 1080×1350）。

## 自检

- 每段有判断 + 证据 ✓
- 6 章无自问自答、无元叙述、无"反驳无形对手"（按 v2 voice.md）
- 评论员立场：通篇用 Amazon Rufus / OpenAI 数据反差对照阿里，不像帮阿里宣传 ✓
- 英文引用全部翻译 + URL 第一条 ✓
- 反判断 + 盲区独立成节 ✓
- 多身份落地段 4 个：电商 PM / 跨境电商 / AI Agent 创业者 / CTO ✓

时间：2026-05-10
