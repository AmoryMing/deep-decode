#!/usr/bin/env python3
"""图 + 音频 + 字幕 → MP4。
本机 ffmpeg 无 libass / drawtext / freetype，所以走 PIL 烧字幕：
- 把封面图 padding 到 1920x1080 → bg
- 每条字幕生成一张 bg+text 的 PNG（按时长复制成 N 帧 image2 序列）
- 改用 concat demuxer：file + duration，零 drawtext
"""
from pathlib import Path
import re, subprocess, math
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parent
COVER = ROOT / "00_gpt_image_summary.png"
AUDIO = ROOT / "podcast.mp3"
SRT = ROOT / "podcast.srt"
OUT = ROOT / "podcast_video.mp4"
FRAMES = ROOT / "video_frames"
FONT = "/System/Library/Fonts/STHeiti Medium.ttc"

W, H = 1920, 1080
SUB_FONT_SIZE = 50
SUB_BOTTOM = 120  # 距底部 px
BG_COLOR = (14, 17, 22)


def parse_srt(path: Path):
    text = path.read_text(encoding="utf-8")
    blocks = re.split(r"\n\s*\n", text.strip())
    subs = []
    for b in blocks:
        lines = [l for l in b.strip().split("\n") if l.strip()]
        if len(lines) < 3:
            continue
        m = re.match(r"(\d+):(\d+):(\d+),(\d+)\s*-->\s*(\d+):(\d+):(\d+),(\d+)", lines[1])
        if not m:
            continue
        g = list(map(int, m.groups()))
        s = g[0] * 3600 + g[1] * 60 + g[2] + g[3] / 1000
        e = g[4] * 3600 + g[5] * 60 + g[6] + g[7] / 1000
        subs.append((s, e, " ".join(lines[2:])))
    return subs


def make_bg() -> Image.Image:
    cover = Image.open(COVER).convert("RGB")
    cw, ch = cover.size
    scale = min(W / cw, H / ch)
    nw, nh = int(cw * scale), int(ch * scale)
    cover = cover.resize((nw, nh), Image.LANCZOS)
    bg = Image.new("RGB", (W, H), BG_COLOR)
    bg.paste(cover, ((W - nw) // 2, (H - nh) // 2))
    return bg


def draw_subtitle(bg: Image.Image, text: str, font: ImageFont.FreeTypeFont) -> Image.Image:
    img = bg.copy()
    d = ImageDraw.Draw(img, "RGBA")
    bbox = d.textbbox((0, 0), text, font=font)
    tw, th = bbox[2] - bbox[0], bbox[3] - bbox[1]
    pad_x, pad_y = 32, 18
    box_w, box_h = tw + 2 * pad_x, th + 2 * pad_y
    box_x = (W - box_w) // 2
    box_y = H - SUB_BOTTOM - box_h
    d.rectangle([box_x, box_y, box_x + box_w, box_y + box_h], fill=(0, 0, 0, 160))
    d.text((box_x + pad_x - bbox[0], box_y + pad_y - bbox[1]), text, font=font, fill=(255, 255, 255))
    return img


def main():
    subs = parse_srt(SRT)
    audio_dur = float(subprocess.check_output(
        ["ffprobe", "-v", "error", "-show_entries", "format=duration",
         "-of", "default=nw=1:nk=1", str(AUDIO)]).strip())
    print(f"[parse] {len(subs)} 条字幕  audio={audio_dur:.2f}s")

    FRAMES.mkdir(exist_ok=True)
    for f in FRAMES.glob("*.png"):
        f.unlink()

    bg = make_bg()
    bg_path = FRAMES / "bg.png"
    bg.save(bg_path, optimize=True)

    font = ImageFont.truetype(FONT, SUB_FONT_SIZE)

    # 拼 concat 列表：交替 bg（gap）+ subtitle 帧
    concat_lines = []
    cursor = 0.0
    for i, (s, e, t) in enumerate(subs):
        if s > cursor + 0.01:
            concat_lines.append(f"file '{bg_path}'")
            concat_lines.append(f"duration {s - cursor:.3f}")
        sub_img = draw_subtitle(bg, t, font)
        sub_path = FRAMES / f"sub_{i:03d}.png"
        sub_img.save(sub_path, optimize=True)
        concat_lines.append(f"file '{sub_path}'")
        concat_lines.append(f"duration {max(e - s, 0.05):.3f}")
        cursor = e

    if cursor < audio_dur:
        concat_lines.append(f"file '{bg_path}'")
        concat_lines.append(f"duration {audio_dur - cursor:.3f}")
    concat_lines.append(f"file '{bg_path}'")  # concat demuxer 要求最后再写一次

    concat_file = FRAMES / "concat.txt"
    concat_file.write_text("\n".join(concat_lines), encoding="utf-8")

    print(f"[render] {len(subs)} 字幕帧已生成 → {FRAMES}/")
    print(f"[ffmpeg] 编码 mp4 ...")
    cmd = [
        "ffmpeg", "-y",
        "-f", "concat", "-safe", "0", "-i", str(concat_file),
        "-i", str(AUDIO),
        "-vsync", "vfr",
        "-pix_fmt", "yuv420p",
        "-c:v", "libx264", "-preset", "medium", "-crf", "23",
        "-c:a", "aac", "-b:a", "192k",
        "-shortest",
        str(OUT),
    ]
    r = subprocess.run(cmd, capture_output=True, text=True)
    if r.returncode != 0:
        print("\n".join(r.stderr.splitlines()[-25:]))
        raise SystemExit(1)
    print(f"[OK] {OUT}  {OUT.stat().st_size/1e6:.1f}MB")


if __name__ == "__main__":
    main()
