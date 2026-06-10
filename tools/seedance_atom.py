#!/usr/bin/env python3
"""seedance_atom.py — 即梦（Seedance）文生视频原子（M7b）。

火山引擎视觉 API：CVSync2AsyncSubmitTask 提交 → CVSync2AsyncGetResult 轮询 → 下载 mp4。
AK/SK V4 签名纯标准库实现（无新依赖）。凭证只读 gitignore 的 factory.config.yaml
（video.seedance 段），绝不入库、绝不打印。

用法：
  python3 tools/seedance_atom.py --probe                       # 验签名/配额（提交前干检）
  python3 tools/seedance_atom.py --prompt "..." --out v.mp4    # 提交并等结果
  python3 tools/seedance_atom.py --task-id <id> --out v.mp4    # 续取已有任务
"""
from __future__ import annotations
import argparse, datetime, hashlib, hmac, json, sys, time, urllib.request, urllib.error
from pathlib import Path

REPO = Path(__file__).resolve().parents[1]

try:
    import yaml
except ImportError:
    sys.exit("需要 PyYAML")


def load_sd_config() -> dict:
    f = REPO / "factory.config.yaml"
    if not f.exists():
        sys.exit("缺 factory.config.yaml（含 video.seedance 凭证，gitignore）")
    cfg = yaml.safe_load(f.read_text(encoding="utf-8")) or {}
    sd = (cfg.get("video", {}) or {}).get("seedance", {}) or {}
    for k in ("access_key", "secret_key"):
        if not sd.get(k):
            sys.exit(f"factory.config.yaml video.seedance 缺 {k}")
    sd.setdefault("host", "visual.volcengineapi.com")
    sd.setdefault("region", "cn-north-1")
    sd.setdefault("service", "cv")
    sd.setdefault("req_key", "jimeng_t2v_v30_pro")
    return sd


# ── 火山 V4 签名（与官方 SDK/jimeng-ai-mcp 等价，纯标准库）─────
def _hmac(key: bytes, msg: str) -> bytes:
    return hmac.new(key, msg.encode("utf-8"), hashlib.sha256).digest()


def _signing_key(secret: str, datestamp: str, region: str, service: str) -> bytes:
    k = _hmac(secret.encode("utf-8"), datestamp)
    k = _hmac(k, region)
    k = _hmac(k, service)
    return _hmac(k, "request")


def signed_request(sd: dict, action: str, body: dict, timeout: int = 60) -> dict:
    host, region, service = sd["host"], sd["region"], sd["service"]
    query = f"Action={action}&Version=2022-08-31"
    req_body = json.dumps(body, ensure_ascii=False, separators=(",", ":"))
    now = datetime.datetime.now(datetime.timezone.utc)
    x_date = now.strftime("%Y%m%dT%H%M%SZ")
    datestamp = now.strftime("%Y%m%d")
    payload_hash = hashlib.sha256(req_body.encode("utf-8")).hexdigest()
    content_type = "application/json"
    signed_headers = "content-type;host;x-content-sha256;x-date"
    canonical = "\n".join([
        "POST", "/", query,
        f"content-type:{content_type}",
        f"host:{host}",
        f"x-content-sha256:{payload_hash}",
        f"x-date:{x_date}",
        "", signed_headers, payload_hash,
    ])
    scope = f"{datestamp}/{region}/{service}/request"
    to_sign = "\n".join([
        "HMAC-SHA256", x_date, scope,
        hashlib.sha256(canonical.encode("utf-8")).hexdigest(),
    ])
    sig = hmac.new(_signing_key(sd["secret_key"], datestamp, region, service),
                   to_sign.encode("utf-8"), hashlib.sha256).hexdigest()
    auth = (f"HMAC-SHA256 Credential={sd['access_key']}/{scope}, "
            f"SignedHeaders={signed_headers}, Signature={sig}")
    req = urllib.request.Request(
        f"https://{host}/?{query}", data=req_body.encode("utf-8"),
        headers={"Content-Type": content_type, "Host": host,
                 "X-Date": x_date, "X-Content-Sha256": payload_hash,
                 "Authorization": auth})
    try:
        with urllib.request.urlopen(req, timeout=timeout) as r:
            return json.loads(r.read().decode("utf-8"))
    except urllib.error.HTTPError as e:
        try:
            return json.loads(e.read().decode("utf-8"))
        except Exception:
            return {"code": e.code, "message": f"HTTP {e.code}"}


def submit(sd: dict, prompt: str, req_key: str | None = None, extra: dict | None = None) -> dict:
    body = {"req_key": req_key or sd["req_key"], "prompt": prompt}
    if extra:
        body.update(extra)
    return signed_request(sd, "CVSync2AsyncSubmitTask", body)


def query(sd: dict, task_id: str, req_key: str | None = None) -> dict:
    return signed_request(sd, "CVSync2AsyncGetResult",
                          {"req_key": req_key or sd["req_key"], "task_id": task_id})


def extract_err(resp: dict) -> str:
    meta_err = (resp.get("ResponseMetadata", {}) or {}).get("Error")
    if meta_err:
        return f"{meta_err.get('Code')}: {meta_err.get('Message')}"
    if resp.get("code") not in (10000, None):
        return f"{resp.get('code')}: {resp.get('message')}"
    return ""


def wait_and_download(sd: dict, task_id: str, out: Path, req_key: str | None = None,
                      poll_s: int = 10, max_wait_s: int = 900) -> tuple[bool, str]:
    t0 = time.time()
    while time.time() - t0 < max_wait_s:
        resp = query(sd, task_id, req_key)
        err = extract_err(resp)
        if err:
            return False, f"查询失败 {err}"
        data = resp.get("data", {}) or {}
        st = data.get("status", "")
        if st == "done":
            urls = []
            rd = data.get("resp_data")
            if isinstance(rd, str):
                try:
                    rd = json.loads(rd)
                except Exception:
                    rd = {}
            if isinstance(rd, dict) and isinstance(rd.get("urls"), list):
                urls += rd["urls"]
            if isinstance(data.get("video_url"), str):
                urls.append(data["video_url"])
            if not urls:
                return False, f"done 但无视频 URL：{json.dumps(data, ensure_ascii=False)[:200]}"
            out.parent.mkdir(parents=True, exist_ok=True)
            urllib.request.urlretrieve(urls[0], out)
            sz = out.stat().st_size
            return (sz > 50000, f"已下载 {out.name}（{sz}B）")
        if st in ("not_found", "expired", "failed"):
            return False, f"任务状态 {st}"
        time.sleep(poll_s)
    return False, f"超时（>{max_wait_s}s），task_id={task_id} 可 --task-id 续取"


def main():
    ap = argparse.ArgumentParser(description="Seedance 文生视频原子")
    ap.add_argument("--probe", action="store_true", help="干检签名/req_key（提交一个最小任务并立刻查询）")
    ap.add_argument("--prompt")
    ap.add_argument("--task-id")
    ap.add_argument("--req-key", help="覆盖配置中的 req_key")
    ap.add_argument("--out", default="seedance_video.mp4")
    ap.add_argument("--frames", type=int, help="可选 frames 参数（按文档：121=5s 241=10s）")
    ap.add_argument("--aspect", help="可选 aspect_ratio，如 9:16 / 16:9")
    a = ap.parse_args()
    sd = load_sd_config()

    if a.probe:
        # 用一个不存在的 task 查询：签名错→鉴权错误；签名对→业务错误（task 不存在/req_key 无效）
        resp = query(sd, "probe-nonexistent-task", a.req_key)
        print(json.dumps(resp, ensure_ascii=False)[:400])
        err = extract_err(resp)
        if "Signature" in err or "Authorization" in err or "AccessDenied" in err:
            print("✗ 签名/鉴权失败"); sys.exit(1)
        print("✓ 签名通过（返回业务层响应）"); sys.exit(0)

    if a.task_id:
        ok, msg = wait_and_download(sd, a.task_id, Path(a.out), a.req_key)
        print(msg); sys.exit(0 if ok else 1)

    if not a.prompt:
        sys.exit("需要 --prompt 或 --task-id 或 --probe")
    extra = {}
    if a.frames:
        extra["frames"] = a.frames
    if a.aspect:
        extra["aspect_ratio"] = a.aspect
    resp = submit(sd, a.prompt, a.req_key, extra)
    err = extract_err(resp)
    if err:
        print(f"提交失败 {err}"); sys.exit(1)
    task_id = (resp.get("data", {}) or {}).get("task_id", "")
    if not task_id:
        print(f"无 task_id：{json.dumps(resp, ensure_ascii=False)[:300]}"); sys.exit(1)
    print(f"task_id={task_id}，轮询中…")
    ok, msg = wait_and_download(sd, task_id, Path(a.out), a.req_key)
    print(msg); sys.exit(0 if ok else 1)


if __name__ == "__main__":
    main()
