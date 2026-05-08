# 企媒运营 Next Steps

## 高优先级（近期）

### 考虑因素

文化：比如西式的文化是人和家庭为主体，中式的文化是集体为主体，造成句式有所差异

用户体感：以及语音的质感，目前听起来听感不好；如果中文声音读英文很差，不如直接读英文

如果要做一个文化媒体，有很多需要打磨的，有很多需要考虑的，这些考虑因素究竟有什么

### 产品灵感生成+公司业务知识=公司产品 自动化产出流水线 auto gen product ideas for china daas

example:
文章标题：The capability overhang in AI
文章链接：https://x.com/levie/status/2037928306977509601?s=20
解读视频：https://www.bilibili.com/video/BV1o4XSBaEti/?spm_id_from=333.337.search-card.all.click&vd_source=e384885833961ebcbac3ede72b262dd9

we can actually get real good ideas for products from these articles and their analysis:
/home/super/stuff_AI_force/stuff/muming/vault/1-knowledge/project/企媒运营/feedback/CleanShot 2026-04-01 at 06.44.05.png


### 其他的主题：选题多元化，小面切入，灵感切入 good topics and interesting topics that are hella specific and unique
example:
如 skillsbench 如果 agent 自己写 skill 不好写，应该怎么写？emergent 的创办人在这个 YouTube 视频中提到：
https://youtu.be/8SVocWnDHwE?si=_mikuyWbndHdr3C6


### 信息源体系
- 对 AGI hunt 这个公众号的信息源进行提炼
- 以及对之前有的一些信息源进行提炼
- 形成一个高质量的信息源库，按更新频率维护，定制爬取时间
- 每天 deep-decode 自动从这些信息源爬下一些数据进行解读
- 尤其注重外国源

### 企媒风格适配
- 当前 decode 产出是个人号风格（观点张力强），企媒需要过滤：去营销词、加推导过程、降断言强度
- 在 deep-decode SKILL.md 中加"企媒适配"步骤，或做成独立 filter 脚本
- 参考: `memory/feedback_enterprise-vs-personal-style.md`

### SVG 质量提升
- 03-31 Boris 的 SVG 比 03-29 PM 的差距明显，需要统一视觉隐喻标准
- 每章必须有概念图（不是标签方块），用隐喻讲故事（河流/冰山/空椅子/...）
- 考虑做一套 SVG 组件库（人物/箭头/对比框/隐喻元素）复用

## 中优先级

### 播客+视频 E2E 验证
- 用新的 TTS 时间戳管线重新生成 PM-AI-Exponential 播客字幕
- 验证字幕同步效果，确认精度提升
- 品牌片头男女声分别生成（gotchas #21）

### 公众号发布优化
- 排版美化：代码块主题、引用块样式、字体大小微调
- 测试在手机端的实际渲染效果（微信编辑器 vs 手机阅读器差异大）
- 考虑加 mistune 自定义渲染器替代当前简易正则转换

### 多渠道分发
- 小红书：竖版视频+短配文（gotchas #20）
- 公众号：已通，待优化排版
- 视频号/B站：图片序列+播客音频→幻灯片视频
- 内部论坛（Discourse）：自动同步

## 低优先级（探索）

### 自动化闭环
- `/schedule` 定时从信息源抓取 → 自动 decode → 自动推草稿 → 通知审核
- 成本估算：每篇 decode ~$0.05（DeepSeek脚本+豆包TTS），可日产 5-10 篇