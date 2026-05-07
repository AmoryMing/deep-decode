# 企媒运营 Changelog

## 2026-04-21

### 收录：横纵分析法 Deep Research Prompt
- 来源：数字生命卡兹克（融合 Saussure 历时-共时 + 商学院案例法 + 竞争战略分析）
- 存放：`knowledge/horizontal-vertical-analysis-prompt.md`
- 用法：改 Prompt 第一行"研究对象 = XX"，丢给任何 Deep Research 模型即可
- 和企媒管线结合点已标注：deep-decode（拆稿骨架）/ product-pitch（商业分析补位）/ scout 周刊（每周锁 1 对象做深度）

## 2026-03-31

### 字幕同步修复（TTS 时间戳）
- **根因**: gotchas.md 写的豆包 TTS 时间戳参数全错（`audio.enable_timestamp`），正确参数在 `request` 对象（`with_frontend` + `with_timestamp` + `frontend_type`）
- **修复**: 写了 tts_doubao_v2.py，从 TTS 原生字级时间戳直接生成 SRT，替代 Whisper+DeepSeek 5步链路
- **效果**: 时间精度从 0.5-2秒 → 10ms，文字准确率 85% → 100%
- **文件**: `pipelines/scripts/tts_doubao_v2.py` + `srt_generator.py`

### Boris Cherny 15 Tips 拆解
- 第三篇 decode 产出：`pipelines/decode/2026-03-31-boris-claude-code-tips/`
- 6 张概念图（冰山/三阶段/batch/Hooks/Cowork/盲区），视觉隐喻风格
- 原创概念：三层金字塔（对话→基础设施→自治）、意图编排

### 微信公众号自动发布
- 写了 `wechat_publish.py`：读 MD+PNG → 上传微信CDN → 转内联HTML → 创建草稿
- 两篇文章（Boris + PM遇上指数级AI）成功推送到公众号草稿箱
- 8 条避坑经验记入 gotchas.md #26-33
- 限制：未认证个人号只能建草稿，最后一步需人工点发布

### 文件结构规范化
- decode 产出路径统一到 `企媒运营/pipelines/decode/`
- 文件夹用拆解日期命名，.md 用 `日期-标题.md`（不再用 README.md）
- PNG 放 .md 同级目录（不嵌套 material/pngs/）

### CLAUDE.md 更新
- 新增 Think out loud 模式

### 记录的反馈
- `feedback_decode-folder-naming.md` — 文件夹命名规范
- `feedback_enterprise-vs-personal-style.md` — 企媒 vs 个人号风格区分
- `lessons-tts-subtitle-sync.md` — TTS 时间戳 debug 经验
