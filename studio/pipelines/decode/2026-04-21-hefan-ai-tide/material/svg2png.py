#!/usr/bin/env python3
# 把本目录所有 SVG 转 PNG 2x
import cairosvg, pathlib, sys

base = pathlib.Path(__file__).resolve().parent.parent
out = base / "material" / "pngs"
out.mkdir(parents=True, exist_ok=True)

svgs = sorted(base.glob("*.svg"))
if not svgs:
    print("no svg found", file=sys.stderr); sys.exit(1)

for svg in svgs:
    png = out / (svg.stem + ".png")
    cairosvg.svg2png(url=str(svg), write_to=str(png), scale=2)
    print(f"✓ {svg.name} -> {png.relative_to(base)}")
