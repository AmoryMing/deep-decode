#!/usr/bin/env python3
# coding: utf-8
"""deep-decode happy-path 邮件草稿：HTML 全内联 + 5 张图 CID 内联 + 2 个附件"""

import imaplib
import email
import email.utils
import yaml
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.mime.image import MIMEImage
from email.mime.base import MIMEBase
from email import encoders
from pathlib import Path

BASE = Path('/home/super/stuff_AI_force/stuff/muming/vault/1-knowledge/project/content_creation企媒内容生产/pipelines/decode/2026-04-21-hefan-ai-tide')
PNG = BASE / 'material' / 'pngs'
CFG = yaml.safe_load(open('/home/super/stuff_AI_force/stuff/muming/.claude/skills/chinadaas-email/config.yaml', encoding='utf-8'))

# ========== 样式片段 ==========
FONT = "'PingFang SC','Microsoft YaHei',sans-serif"
P = f"font-size:15px;line-height:1.9;color:#37352F;margin:0 0 16px 0;font-family:{FONT};"
HL = 'background:#FFF3E0;padding:1px 5px;border-radius:3px;color:#37352F;'
H1 = f"font-size:22px;color:#37352F;font-weight:700;margin:0 0 8px 0;line-height:1.4;font-family:{FONT};"
SUB = f"font-size:13px;color:#787774;margin:0 0 24px 0;font-family:{FONT};"
H2 = f"font-size:18px;color:#37352F;font-weight:700;margin:32px 0 12px 0;padding-bottom:8px;border-bottom:2px solid #2383E2;font-family:{FONT};"
LI = f"font-size:15px;line-height:1.8;color:#37352F;margin-bottom:8px;font-family:{FONT};"
QUOTE = f"margin:16px 0;padding:14px 18px;border-left:3px solid #2383E2;background:#F7F7F5;font-size:15px;line-height:1.8;color:#37352F;font-family:{FONT};"
IMG = 'style="max-width:100%;height:auto;border-radius:6px;"'
IMG_WRAP = 'style="text-align:center;margin:24px 0;"'

def p(t): return f'<p style="{P}">{t}</p>'
def h2(t): return f'<h2 style="{H2}">{t}</h2>'
def hl(t): return f'<strong style="{HL}">{t}</strong>'
def q(t): return f'<div style="{QUOTE}">「{t}」</div>'
def img(cid, alt): return f'<div {IMG_WRAP}><img src="cid:{cid}" alt="{alt}" {IMG}></div>'

# ========== 正文 ==========
body = f'''<!DOCTYPE html>
<html><head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#F7F7F5;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F7F7F5;">
<tr><td align="center" style="padding:32px 16px;">
<table role="presentation" width="680" cellpadding="0" cellspacing="0" style="background:#FFFFFF;border-radius:8px;max-width:680px;width:100%;">
<tr><td style="padding:36px 40px;">

<h1 style="{H1}">越追 AI 风口，越被反收割</h1>
<p style="{SUB}">一份给产品人的"潮汐手册" · AI 笔记 04/21 · 2026</p>
<hr style="border:none;border-top:2px solid #2383E2;margin:0 0 28px 0;">

{img('cover', '封面')}

{p(f'{hl("2026 年 Q1，全球风险投资砸进 AI 的钱是 2420 亿美元")}，占当季全球 VC 总额的 80%，相当于 2025 年全年 AI 融资的大半。与此同时，麻省理工调研显示——95% 接入 AI 的公司，拿不出可量化的投资回报。')}

{p('一边是史上最大规模的资本集结，一边是 95% 的回本失败率。两个数字放在一起，就是一个价值几千亿美元的问题——' + hl('你是那 5%，还是那 95%？'))}

{p('一个反直觉的答案：' + hl('越追 AI 风口，越容易被时代淘汰') + '。不是劝你远离 AI，是劝你换个姿势——别当那只追兔子的农夫，做那棵等兔子撞上来的树。')}

{h2('一、潮汐和浪花')}
{p('把世界上所有变化分成两类：快变量 = 浪花，慢变量 = 潮汐。浪花是每天的新模型、新融资、新政策；潮汐是技术革命、人口结构、全球化进程。')}
{p(hl('浪花会自己跳到你眼前，潮汐不会') + '。所以我们每天刷 3 小时热搜，却没时间去读一份人口结构或新技术长期趋势的报告。')}
{q('贸易摩擦只是树枝，国际关系才是大树；股价涨跌只是浪花，技术革命才是洋流。')}

{h2('二、历史三镜——1840 / 2000 / 2026')}
{img('mirror', '历史三镜对比')}
{p('每一轮技术革命早期都有大量资产价格泡沫。1840 年代英国铁路狂热：上千家铁路公司注册，大部分倒掉，真正的铁路巨头才在基础设施沉淀后诞生。2000 年 Nasdaq 从 5048 跌到 1114，缩水 78%，谷歌和亚马逊才开始真正崛起。亚马逊股价从 113 跌到 5.5 美元，贝佐斯那时候说了一句"股票不等于公司"。')}
{q('每一轮技术革命，都是 "前人栽树，后人乘凉"。')}
{p('2026 年 AI 这一轮：OpenAI Q1 融 1220 亿，Anthropic 300 亿，xAI 200 亿，Waymo 160 亿——' + hl('四家合计占 Q1 全球 VC 的 65%') + '。Alpine Macro 量化策略师 Henry Wu：「我们很可能正处于泡沫形成的早期阶段。」"这次不一样"——这五个字是泡沫破裂的背景音。')}

{h2('三、守树策略')}
{img('tree', '守树策略')}
{p('如果泡沫早晚要破，普通人怎么办？有一个反英雄主义的答案：守株待兔。这不是消极，是有意识的战略耐心。')}
{q('不要用你的业务，去挑战别人的专业。要用你的专业，去拥抱新技术的红利。')}
{p('你是医生，就好好看病，等 AI 帮你看片子。你是老师，等 AI 帮你改作业。' + hl('新技术真正改变世界的方式，从来不是推倒重来，而是以接口形式接入现有专业') + '。X 光机、CT、MRI 都没取代医生——真正赚到红利的，是能把最新工具接进工作流的医生。')}
{p('这就浮现出一个值得命名的现象——' + hl('"风口反收割"') + '：你本以为要去收割风口，结果被风口反过来收割了时间、金钱、注意力，连自己真正的长板都荒废了。' + hl('被风口反收割的人，比被 AI 替代的人还多。'))}

{h2('四、选择题选手 vs 解答题选手')}
{img('choice', '选择题 vs 解答题')}
{p('我们从小是在"寻找标准答案"的教育里长大的。面前有几百家外卖店反复对比 30 分钟终于下单，结果送到一看同事那份更好吃——' + hl('最优解思维') + '的典型病。')}
{p('赫伯特·西蒙：人是' + hl('"有限理性"') + '的，只能在有限信息里找那个 80 分的满足解。选择题选手执着于标准答案，解答题选手承认没有标准答案、自己切自己试自己迭代。')}
{p('AI 时代最怕的姿势——"Claude 和 GPT 哪个好？""LangChain 和 CrewAI 哪个强？"这些问题都默认有标准答案。' + hl('解答题选手先把业务问题搞清楚再挑工具；选择题选手先研究所有工具再问自己"我要解决什么"——等他想清楚，时代已经换了两代。'))}

{h2('五、被风口反收割')}
{img('harvest', '风口反收割')}
{p('过去三年，多少人放下十年专业去学 Prompt 工程、学 AI 绘画、学大模型微调，一年后什么都没做成，回头发现原领域也被甩开了？这就是"焦虑税"——课程费、工具订阅费、项目沉没成本只是显性部分；隐性的是注意力被切碎、专业被稀释、信心被透支。')}
{p('把手弄脏。过去红利期靠一个模式或一个点子就能赚钱，现在红利没了，赚钱回归到又苦又累的细节里。' + hl('过去是"规模先于需求"，今天是"显微镜先于放大镜"') + '——先把一个具体用户在具体场景里的痛点挖到底，再想怎么复制。')}

{h2('六、对产品人的 5 条 action')}
<ol style="padding-left:20px;margin:12px 0;">
<li style="{LI}"><strong>停止每周追新工具的惯性。</strong>每天 15 分钟深度报告，比每天 3 小时刷 AI 推特有用一百倍。</li>
<li style="{LI}"><strong>回到自己领域深挖。</strong>零售 PM 就把 AI 切进选品/定价/会员三个现有环节，而不是想"我要不要转 AI PM"。</li>
<li style="{LI}"><strong>从选择题选手变成解答题选手。</strong>遇到技术选型问题，先把业务问题描述到每个人都能复述，再选工具。顺序反了 9 成返工。</li>
<li style="{LI}"><strong>把手弄脏。</strong>做一个 100 人以内的小闭环跑通，再考虑扩。不相信只在 PPT 上推演的 AI 策略。</li>
<li style="{LI}"><strong>电影院策略。</strong>不确定的机会买张票进场但站在门口——保持参与度，严格控制沉没成本。</li>
</ol>

{h2('七、盲区提醒')}
<ul style="padding-left:20px;margin:12px 0;">
<li style="{LI}"><strong>AI 成熟周期可能压缩到 3-5 年。</strong>不像铁路互联网需 10-30 年物理沉淀，"等待期"比暗示的更短，医生还能守，客服可能已无树可守。</li>
<li style="{LI}"><strong>这次泡沫不同于 dot-com。</strong>AI 资本支出靠企业现金流而非杠杆，破裂形态更可能是中小 AI 分化式回调，而非 Nasdaq 78% 崩盘。</li>
<li style="{LI}"><strong>22 岁年轻人无树可守。</strong>零起点反而最适合追早期 AI 赛道——没有被上一代专业绑住的沉没成本。</li>
</ul>

{h2('本期关键词')}
<ul style="padding-left:20px;margin:12px 0;">
<li style="{LI}"><strong>潮汐 vs 浪花</strong>（Tide vs Wave）—— 慢变量 vs 快变量，看世界的第一个视角切换</li>
<li style="{LI}"><strong>风口反收割</strong>（Reverse Harvest）—— 本期新造概念。本想收割风口，反被风口收割了时间、金钱、专业</li>
<li style="{LI}"><strong>解答题选手</strong> vs <strong>选择题选手</strong> —— 承认没有标准答案 vs 执着找标准答案，AI 时代最贵的认知切换</li>
<li style="{LI}"><strong>守树策略</strong>（Wait-by-Tree Strategy）—— 守在自己十年专业里等 AI 来找你</li>
<li style="{LI}"><strong>电影院策略</strong>（Cinema Strategy）—— 买票进场但站门口，保持参与度+控制沉没成本</li>
<li style="{LI}"><strong>焦虑税</strong>（Anxiety Tax）—— 追风口的隐形成本：课程费/工具订阅/沉没成本/注意力切碎</li>
</ul>

{h2('附件 & 路径')}
{p('<strong>1. 【AI笔记0421】越追AI风口越被反收割.docx</strong>（965K）—— 4000 字完整稿，含 5 张图和结语方块')}
{p('<strong>2. content.md</strong> —— 小红书文案+标签。13 张 1080×1440 配图在：<code style="background:#F5F5F5;padding:2px 5px;border-radius:3px;font-size:13px;">pipelines/decode/2026-04-21-hefan-ai-tide/distribute/xiaohongshu/</code>')}

{h2('credit')}
{p('原始视频：<a href="https://b23.tv/Ana69zK" style="color:#2383E2;">越追 AI 风口，越容易被时代淘汰</a> · 何帆（上海交大安泰经管学院教授）')}
{p('核心观点引自：何帆《大局观：真实世界中的经济学思维（新版）》2025；文字版扩展参考：《2026，看清变量，保持耐心》虎嗅 2026-01；Q1 2026 AI 融资数据：Crunchbase / Remio；英伟达估值模型：上海金融与发展实验室 2026-01。')}

</td></tr></table>
</td></tr></table>
</body></html>'''

# ========== 组装 MIME ==========
msg = MIMEMultipart('mixed')
msg['From'] = CFG['email']
msg['To'] = 'muming@chinadaas.com'
msg['Subject'] = '[AI笔记 04/21] 越追 AI 风口，越被反收割 — 深度解读（含 5 张信息图）'
msg['Date'] = email.utils.formatdate(localtime=True)

# related 包裹 HTML + CID 图
related = MIMEMultipart('related')
related.attach(MIMEText(body, 'html', 'utf-8'))

for cid, fname in [
    ('cover', '00_cover.png'),
    ('mirror', '01_three_mirrors.png'),
    ('tree', '02_wait_by_tree.png'),
    ('choice', '03_answer_vs_choice.png'),
    ('harvest', '04_reverse_harvest.png'),
]:
    with open(PNG / fname, 'rb') as f:
        im = MIMEImage(f.read(), _subtype='png')
    im.add_header('Content-ID', f'<{cid}>')
    im.add_header('Content-Disposition', 'inline', filename=fname)
    related.attach(im)

msg.attach(related)

# 附件
for fp in [
    BASE / '【AI笔记0421】越追AI风口越被反收割.docx',
    BASE / 'distribute' / 'xiaohongshu' / 'content.md',
]:
    part = MIMEBase('application', 'octet-stream')
    part.set_payload(open(fp, 'rb').read())
    encoders.encode_base64(part)
    part.add_header('Content-Disposition', 'attachment', filename=fp.name)
    msg.attach(part)

# IMAP APPEND to Drafts
with imaplib.IMAP4_SSL(CFG['imap_server'], CFG['imap_port']) as mail:
    mail.login(CFG['email'], CFG['password'])
    r = mail.append('Drafts', '\\Draft', None, msg.as_bytes())
    print('APPEND:', r[0])

# 备份 HTML 预览
preview = BASE / 'email_preview.html'
preview.write_text(body, encoding='utf-8')
print('HTML preview saved:', preview)
