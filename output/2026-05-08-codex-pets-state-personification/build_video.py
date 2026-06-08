#!/usr/bin/env python3
from pathlib import Path
import subprocess
from PIL import Image

ROOT = Path(__file__).resolve().parent
AUDIO = ROOT / "podcast.mp3"
IMAGES = [
    ROOT / "00_gpt_image_hero.png",
    ROOT / "00_系列封面.png",
    ROOT / "01_state_light.png",
    ROOT / "02_two_pet_models.png",
    ROOT / "03_sidecar_watcher.png",
    ROOT / "04_entry_workflow.png",
]
FRAMES = ROOT / "video_frames_simple"


def audio_duration() -> float:
    out = subprocess.check_output([
        "ffprobe", "-v", "error", "-show_entries", "format=duration",
        "-of", "default=nw=1:nk=1", str(AUDIO)
    ])
    return float(out.decode().strip())


def fit_image(src: Path, size: tuple[int, int]) -> Image.Image:
    w, h = size
    img = Image.open(src).convert("RGB")
    iw, ih = img.size
    scale = min(w / iw, h / ih)
    nw, nh = int(iw * scale), int(ih * scale)
    resized = img.resize((nw, nh), Image.LANCZOS)
    canvas = Image.new("RGB", size, (247, 247, 245))
    canvas.paste(resized, ((w - nw) // 2, (h - nh) // 2))
    return canvas


def build(kind: str, size: tuple[int, int], out_name: str) -> None:
    out_dir = FRAMES / kind
    out_dir.mkdir(parents=True, exist_ok=True)
    for old in out_dir.glob("*.png"):
        old.unlink()

    duration = audio_duration()
    per = duration / len(IMAGES)

    concat_lines = []
    for i, src in enumerate(IMAGES):
        frame = out_dir / f"frame_{i:02d}.png"
        fit_image(src, size).save(frame, optimize=True)
        concat_lines.append(f"file '{frame}'")
        concat_lines.append(f"duration {per:.3f}")
    concat_lines.append(f"file '{out_dir / f'frame_{len(IMAGES)-1:02d}.png'}'")
    concat = out_dir / "concat.txt"
    concat.write_text("\n".join(concat_lines), encoding="utf-8")

    out = ROOT / out_name
    cmd = [
        "ffmpeg", "-y",
        "-f", "concat", "-safe", "0", "-i", str(concat),
        "-i", str(AUDIO),
        "-vsync", "vfr",
        "-pix_fmt", "yuv420p",
        "-c:v", "libx264", "-preset", "medium", "-crf", "21",
        "-c:a", "aac", "-b:a", "192k",
        "-shortest",
        str(out),
    ]
    subprocess.run(cmd, check=True)
    print(f"[OK] {out.name} {out.stat().st_size / 1024 / 1024:.1f} MB")


def main() -> None:
    missing = [p for p in IMAGES + [AUDIO] if not p.exists()]
    if missing:
        raise SystemExit("Missing files: " + ", ".join(str(p) for p in missing))
    build("horizontal", (1920, 1080), "video_horizontal.mp4")
    build("vertical", (1080, 1920), "video_vertical.mp4")


if __name__ == "__main__":
    main()
