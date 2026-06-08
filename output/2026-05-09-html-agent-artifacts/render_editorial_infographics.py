#!/usr/bin/env python3
from __future__ import annotations

import math
import random
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter, ImageFont


ROOT = Path(__file__).resolve().parent
OUT = ROOT / "assets" / "png"
W, H = 1536, 864
FONT_REG = "/System/Library/Fonts/Hiragino Sans GB.ttc"
FONT_BOLD = "/System/Library/Fonts/STHeiti Medium.ttc"


def font(size: int, bold: bool = False) -> ImageFont.FreeTypeFont:
    return ImageFont.truetype(FONT_BOLD if bold else FONT_REG, size=size)


def text_w(draw: ImageDraw.ImageDraw, s: str, f: ImageFont.ImageFont) -> int:
    b = draw.textbbox((0, 0), s, font=f)
    return b[2] - b[0]


def wrap(draw: ImageDraw.ImageDraw, s: str, f: ImageFont.ImageFont, max_w: int) -> list[str]:
    lines, cur = [], ""
    for ch in s:
        if ch == "\n":
            lines.append(cur)
            cur = ""
            continue
        nxt = cur + ch
        if text_w(draw, nxt, f) <= max_w or not cur:
            cur = nxt
        else:
            lines.append(cur)
            cur = ch
    if cur:
        lines.append(cur)
    return lines


def bg(seed: int) -> Image.Image:
    rnd = random.Random(seed)
    img = Image.new("RGB", (W, H), "#ddd7c7")
    pix = img.load()
    for y in range(H):
        shade = int(18 * (y / H))
        for x in range(W):
            n = rnd.randint(-10, 10)
            base = 218 + n - shade
            pix[x, y] = (max(0, base), max(0, base - 6), max(0, base - 18))
    overlay = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    d = ImageDraw.Draw(overlay)
    for _ in range(22):
        x, y = rnd.randint(-80, W), rnd.randint(-60, H)
        w, h = rnd.randint(180, 430), rnd.randint(90, 240)
        color = rnd.choice([(240, 224, 182, 165), (225, 214, 190, 150), (180, 178, 170, 90)])
        d.rounded_rectangle([x, y, x + w, y + h], radius=8, fill=color)
    return Image.alpha_composite(img.convert("RGBA"), overlay)


def torn_box(draw: ImageDraw.ImageDraw, xy, fill, outline=None, jitter=12, seed=1):
    rnd = random.Random(seed)
    x, y, w, h = xy
    pts = []
    for i in range(9):
        pts.append((x + i * w // 8, y + rnd.randint(-jitter, jitter)))
    for i in range(1, 5):
        pts.append((x + w + rnd.randint(-jitter, jitter), y + i * h // 5))
    for i in range(8, -1, -1):
        pts.append((x + i * w // 8, y + h + rnd.randint(-jitter, jitter)))
    for i in range(4, 0, -1):
        pts.append((x + rnd.randint(-jitter, jitter), y + i * h // 5))
    draw.polygon([(px + 8, py + 10) for px, py in pts], fill=(0, 0, 0, 55))
    draw.polygon(pts, fill=fill, outline=outline)


def tape(draw, x, y, w=92):
    draw.rounded_rectangle([x, y, x + w, y + 28], radius=4, fill=(236, 218, 163, 215), outline=(124, 109, 80, 80))


def label(draw, xy, title, body, color, fg=(28, 25, 20), seed=1):
    x, y, w, h = xy
    torn_box(draw, xy, color, seed=seed)
    tape(draw, x + w // 2 - 46, y - 14)
    draw.text((x + 26, y + 24), title, font=font(34, True), fill=fg)
    small = font(25)
    yy = y + 76
    for line in wrap(draw, body, small, w - 52)[:4]:
        draw.text((x + 26, yy), line, font=small, fill=fg)
        yy += 34


def browser(draw, x, y, w, h, title="artifact.html"):
    draw.rounded_rectangle([x, y, x + w, y + h], radius=24, fill=(29, 36, 47), outline=(87, 106, 127), width=3)
    draw.rounded_rectangle([x + 16, y + 16, x + w - 16, y + 62], radius=16, fill=(230, 235, 238))
    for i, c in enumerate(["#ff5f56", "#ffbd2e", "#27c93f"]):
        draw.ellipse([x + 34 + i * 34, y + 30, x + 50 + i * 34, y + 46], fill=c)
    draw.text((x + 140, y + 26), title, font=font(20), fill=(80, 84, 88))
    draw.rounded_rectangle([x + 36, y + 88, x + w - 36, y + h - 34], radius=18, fill=(246, 244, 235))


def code_slip(draw, x, y, w, h, seed=1):
    rnd = random.Random(seed)
    torn_box(draw, (x, y, w, h), (240, 235, 215, 235), seed=seed)
    mono = font(18)
    for i in range(8):
        lx = x + 24
        ly = y + 26 + i * 24
        draw.rectangle([lx, ly, lx + rnd.randint(120, w - 60), ly + 10], fill=rnd.choice(["#335c81", "#e28b3a", "#4d7c59", "#8b5e4d"]))


def photo(draw, x, y, w, h, seed=1):
    rnd = random.Random(seed)
    draw.rectangle([x + 8, y + 8, x + w + 8, y + h + 8], fill=(0, 0, 0, 45))
    draw.rectangle([x, y, x + w, y + h], fill=(242, 235, 218), outline=(170, 158, 132))
    inset = 16
    draw.rectangle([x + inset, y + inset, x + w - inset, y + h - 34], fill=(rnd.randint(50, 95), rnd.randint(56, 90), rnd.randint(65, 100)))
    draw.ellipse([x + 38, y + 32, x + 78, y + 72], fill=(210, 205, 185))
    body_top = min(y + h - 48, y + 84)
    draw.rectangle([x + 30, body_top, x + w - 30, y + h - 42], fill=(92, 88, 82))


def title_block(draw, title, subtitle):
    torn_box(draw, (48, 38, 610, 184), (238, 224, 178, 245), seed=7)
    title_font = font(46 if len(title) > 12 else 52, True)
    draw.text((78, 66), title, font=title_font, fill=(14, 13, 12))
    draw.text((82, 154), subtitle, font=font(25), fill=(56, 48, 38))


def save(img, name):
    OUT.mkdir(parents=True, exist_ok=True)
    img.convert("RGB").save(OUT / name, quality=94)


def cover():
    img = bg(1)
    d = ImageDraw.Draw(img, "RGBA")
    title_block(d, "HTML工作台：渲染判断", "Markdown 退回草稿层，HTML 走到审阅前台")
    browser(d, 520, 250, 520, 380, "review-artifact.html")
    for i, yy in enumerate([370, 418, 466, 514]):
        d.rounded_rectangle([590, yy, 960, yy + 26], radius=10, fill=(i % 2 and (44, 120, 180, 210) or (231, 132, 45, 215)))
    for p in [(250, 286, 220, 140), (1080, 120, 230, 150), (1110, 520, 250, 150), (240, 600, 250, 130)]:
        photo(d, *p, seed=sum(p))
    label(d, (70, 315, 370, 165), "源文件层", "结构化草稿留住可追溯事实。", (83, 47, 29, 232), (255, 247, 230), 10)
    label(d, (1120, 92, 360, 170), "可视密度", "HTML 把布局、表格、交互压成工作界面。", (238, 181, 55, 245), seed=11)
    label(d, (1080, 360, 390, 165), "人类回路", "人审阅、比较、调参，再把选择喂回 Agent。", (86, 44, 104, 238), (255, 255, 255), 12)
    label(d, (70, 610, 430, 160), "边界条件", "HTML 是工作台；审阅记录和配置才是档案。", (24, 24, 24, 232), (255, 255, 255), 13)
    for a, b in [((440, 397), (560, 440)), ((1120, 177), (1010, 350)), ((1080, 440), (1010, 450)), ((500, 690), (650, 620))]:
        d.line([a, b], fill=(255, 132, 25, 238), width=7)
    save(img, "00_series_cover.png")
    (ROOT / "00_sensenova_hero.png").write_bytes((OUT / "00_series_cover.png").read_bytes())


def format_shift():
    img = bg(2)
    d = ImageDraw.Draw(img, "RGBA")
    title_block(d, "格式迁移", "从可编辑文本，到可操作界面")
    xs = [100, 430, 760, 1090]
    names = ["Markdown", "HTML", "Rendered UI", "Agent Loop"]
    desc = ["轻、可 diff、适合草稿", "布局、样式、媒体、脚本", "人类快速审阅和比较", "选择导出为 JSON / diff"]
    colors = [(244, 238, 218, 242), (225, 236, 244, 242), (245, 226, 194, 242), (232, 220, 242, 242)]
    for i, x in enumerate(xs):
        torn_box(d, (x, 290, 250, 240), colors[i], seed=30+i)
        tape(d, x+76, 276)
        d.text((x+28, 326), names[i], font=font(32, True), fill=(25, 25, 24))
        for line in wrap(d, desc[i], font(24), 196):
            d.text((x+28, 390), line, font=font(24), fill=(55, 51, 45))
            break
        if i < 3:
            d.line([(x+258, 410), (x+320, 410)], fill=(35, 131, 226, 240), width=8)
            d.polygon([(x+320, 410), (x+296, 394), (x+296, 426)], fill=(35, 131, 226, 240))
    code_slip(d, 150, 585, 400, 190, 61)
    browser(d, 880, 565, 430, 220, "decision.html")
    save(img, "01_format_shift.png")


def source_vs_artifact():
    img = bg(3)
    d = ImageDraw.Draw(img, "RGBA")
    title_block(d, "源与产物", "事实源在后台，工作界面在前台")
    label(d, (90, 300, 430, 300), "Source of truth", "Markdown、YAML、JSON、代码、数据库记录。它们负责版本、审查、合并和追溯。", (42, 42, 40, 238), (255,255,255), 40)
    browser(d, 900, 255, 470, 350, "rendered-interface.html")
    label(d, (960, 640, 380, 145), "Rendered interface", "负责阅读、比较、操作和导出，不充当最终事实源。", (238, 181, 55, 245), seed=42)
    for i in range(5):
        code_slip(d, 575, 190 + i*82, 210, 68, 70+i)
    d.line([(525, 445), (875, 430)], fill=(255, 132, 25, 245), width=10)
    d.polygon([(875, 430), (845, 410), (848, 454)], fill=(255, 132, 25, 245))
    d.line([(920, 640), (540, 590)], fill=(35, 131, 226, 230), width=7)
    d.polygon([(540, 590), (572, 574), (568, 610)], fill=(35, 131, 226, 230))
    save(img, "02_source_vs_artifact.png")


def human_loop():
    img = bg(4)
    d = ImageDraw.Draw(img, "RGBA")
    title_block(d, "人机闭环", "界面把人的判断重新变成结构化输入")
    browser(d, 500, 210, 540, 420, "prompt-tuner.html")
    for i, label_txt in enumerate(["拖拽卡片", "调参滑块", "风险标签", "复制 JSON"]):
        x = 560 + (i % 2) * 230
        y = 330 + (i // 2) * 120
        d.rounded_rectangle([x, y, x + 190, y + 70], radius=15, fill=(255,255,255,235), outline=(180,180,170), width=2)
        d.text((x+24, y+18), label_txt, font=font(25, True), fill=(42,42,42))
    label(d, (85, 295, 340, 210), "输入", "真实上下文：代码、工单、Slack、配置和历史记录。", (83, 47, 29, 235), (255,247,230), 50)
    label(d, (1090, 295, 360, 210), "输出", "人的选择被导出成 diff、JSON、prompt，再喂回 Agent。", (86,44,104,238), (255,255,255), 51)
    d.arc([265, 175, 1265, 760], 190, 350, fill=(35,131,226,238), width=10)
    d.arc([265, 175, 1265, 760], 10, 170, fill=(255,132,25,238), width=10)
    save(img, "03_human_loop.png")


def enterprise():
    img = bg(5)
    d = ImageDraw.Draw(img, "RGBA")
    title_block(d, "企业落地分层", "漂亮界面不能替代审计链")
    layers = [
        ("1 事实源", "代码 / Markdown / YAML / JSON / 数据库", (42, 42, 40, 238)),
        ("2 工作台", "HTML artifact：阅读、比较、编辑、导出", (238, 181, 55, 245)),
        ("3 审计轨迹", "diff / 决策记录 / 配置变更 / 引用来源", (35, 131, 226, 230)),
    ]
    for i, (t, b, c) in enumerate(layers):
        y = 275 + i * 150
        label(d, (240, y, 1050, 105), t, b, c, (255,255,255) if i != 1 else (25,25,25), 80+i)
        if i < 2:
            d.line([(765, y+115), (765, y+145)], fill=(255,132,25,245), width=8)
            d.polygon([(765, y+152), (748, y+126), (782, y+126)], fill=(255,132,25,245))
    for p in [(70, 535, 140, 105), (1300, 250, 150, 105), (1220, 640, 170, 110)]:
        photo(d, *p, seed=sum(p))
    save(img, "04_enterprise_pattern.png")


def main():
    cover()
    format_shift()
    source_vs_artifact()
    human_loop()
    enterprise()


if __name__ == "__main__":
    main()
