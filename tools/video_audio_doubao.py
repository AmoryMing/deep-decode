#!/usr/bin/env python3
"""video_audio_doubao.py — 给 web-video-presentation 的 audio-segments.json 用豆包女声逐段合成。

输出到 <presentation>/public/audio/<chapter>/<n>.mp3（与 App.tsx 的
`audio/<id>/<step+1>.mp3` 约定一致）。已存在的段跳过，可断点续跑。

用法：
  python3 tools/video_audio_doubao.py output/<slug>/video/presentation [--speed 1.1]
"""
from __future__ import annotations
import argparse, json, sys, os
from pathlib import Path

VAULT = "/Users/muming/项目/内容/raw/vault/1-knowledge/project/content_creation企媒内容生产/pipelines/scripts"
sys.path.insert(0, VAULT)
from tts_doubao_v2 import text_to_mp3_sync  # noqa: E402

VOICE = "zh_female_shuangkuaisisi_moon_bigtts"


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("presentation", help="presentation 目录")
    ap.add_argument("--speed", type=float, default=1.1)
    ap.add_argument("--volume", type=float, default=1.3)
    a = ap.parse_args()
    P = Path(a.presentation).resolve()
    seg_file = P / "audio-segments.json"
    if not seg_file.exists():
        sys.exit(f"缺 {seg_file}（先 npm run extract-narrations）")
    segs = json.loads(seg_file.read_text(encoding="utf-8"))
    out_root = P / "public" / "audio"
    done = skip = fail = 0
    for s in segs:
        rel = s["audio"]               # 如 coldopen/1.mp3
        out = out_root / rel
        out.parent.mkdir(parents=True, exist_ok=True)
        if out.exists() and out.stat().st_size > 1000:
            skip += 1
            continue
        text = s["text"].strip()
        if not text:
            continue
        try:
            text_to_mp3_sync(text, output_path=str(out), voice_type=VOICE,
                             speed_ratio=a.speed, volume_ratio=a.volume)
            sz = out.stat().st_size if out.exists() else 0
            if sz > 1000:
                done += 1
                print(f"  ✓ {rel} ({sz}B)")
            else:
                fail += 1
                print(f"  ✗ {rel} 产物过小")
        except Exception as e:
            fail += 1
            print(f"  ✗ {rel} {e}")
    print(json.dumps({"done": done, "skip": skip, "fail": fail, "total": len(segs)}, ensure_ascii=False))
    sys.exit(1 if fail else 0)


if __name__ == "__main__":
    main()
