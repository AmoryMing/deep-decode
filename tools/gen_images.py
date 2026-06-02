#!/usr/bin/env python3
"""gen_images.py — 用 gpt-image-2 (OpenAI 兼容网关) 批量出 paper 信息图。

读 batch JSONL（每行 {"prompt":..., "out":..., "size":"1536x1024"}），
POST /v1/images/generations，存 data[0].b64_json 到 out。

凭证从环境变量读，不入库：
  export IMAGEGEN_BASE_URL=https://api.openai.com/v1
  export IMAGEGEN_API_KEY=sk-...
  export IMAGEGEN_MODEL=gpt-image-2

用法：
  python3 tools/gen_images.py --batch hf_images.jsonl --root output/<slug> [--concurrency 2]
"""
from __future__ import annotations
import argparse, base64, json, os, sys, time
import concurrent.futures as cf
from pathlib import Path
import requests


def gen_one(base, key, model, task, root: Path, timeout=300):
    out = root / task["out"]
    out.parent.mkdir(parents=True, exist_ok=True)
    body = {
        "model": task.get("model", model),
        "prompt": task["prompt"],
        "size": task.get("size", "1536x1024"),
    }
    for attempt in range(3):
        try:
            r = requests.post(f"{base}/images/generations",
                              headers={"Authorization": f"Bearer {key}",
                                       "Content-Type": "application/json"},
                              json=body, timeout=timeout)
            if r.status_code != 200:
                print(f"[{out.name}] HTTP {r.status_code}: {r.text[:200]}", flush=True)
                time.sleep(3); continue
            d = r.json()
            b64 = d["data"][0]["b64_json"]
            out.write_bytes(base64.b64decode(b64))
            print(f"[OK] {out.name} {out.stat().st_size//1024} KB", flush=True)
            return True
        except Exception as e:
            print(f"[{out.name}] attempt {attempt} err: {e}", flush=True)
            time.sleep(3)
    print(f"[FAIL] {out.name}", flush=True)
    return False


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--batch", required=True)
    ap.add_argument("--root", required=True)
    ap.add_argument("--concurrency", type=int, default=2)
    args = ap.parse_args()
    base = os.environ.get("IMAGEGEN_BASE_URL", "https://api.openai.com/v1").rstrip("/")
    key = os.environ.get("IMAGEGEN_API_KEY")
    model = os.environ.get("IMAGEGEN_MODEL", "gpt-image-2")
    if not key:
        sys.exit("缺 IMAGEGEN_API_KEY")
    root = Path(args.root)
    tasks = [json.loads(l) for l in Path(args.batch).read_text(encoding="utf-8").splitlines() if l.strip()]
    print(f"出图 {len(tasks)} 张，model={model}, concurrency={args.concurrency}", flush=True)
    ok = 0
    with cf.ThreadPoolExecutor(max_workers=args.concurrency) as ex:
        for r in ex.map(lambda t: gen_one(base, key, model, t, root), tasks):
            ok += 1 if r else 0
    print(f"done: {ok}/{len(tasks)}", flush=True)
    return 0 if ok == len(tasks) else 1


if __name__ == "__main__":
    raise SystemExit(main())
