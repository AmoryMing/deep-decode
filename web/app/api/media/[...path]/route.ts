import type { NextRequest } from "next/server";
import fs from "node:fs";
import path from "node:path";
import { repoRoot } from "@/lib/repo";

/**
 * 媒体中转路由 —— 绕开 jsDelivr 在国内不可达的问题。
 * - 本地（dev / 本地 prod）：直接从仓库根的 output/ 读文件（最快，国内可见）。
 * - 线上（Vercel）：serverless 不含 2.6G 媒体，回退到从 GitHub raw 取
 *   （Vercel 服务器在国外，访问 GitHub 通），再 serve 给用户。
 *   用户只访问 Vercel 域名，不直接碰 jsDelivr/GitHub。
 * 加长缓存头，Vercel 边缘缓存命中后不再回源。
 */
const RAW_BASE =
  process.env.MEDIA_RAW_BASE ||
  "https://raw.githubusercontent.com/AmoryMing/deep-decode/deploy";

const TYPES: Record<string, string> = {
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".mp3": "audio/mpeg",
  ".wav": "audio/wav",
  ".mp4": "video/mp4",
};

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path: segs } = await params;
  const rel = segs.join("/"); // 形如 output/<slug>/<file>
  const ext = path.extname(rel).toLowerCase();
  const headers = {
    "Content-Type": TYPES[ext] || "application/octet-stream",
    "Cache-Control": "public, max-age=31536000, immutable",
  };

  // 1) 本地文件优先
  try {
    const local = path.join(repoRoot(), rel);
    if (fs.existsSync(local) && fs.statSync(local).isFile()) {
      return new Response(new Uint8Array(fs.readFileSync(local)), { headers });
    }
  } catch {
    // ignore, fall through to remote
  }

  // 2) 回退 GitHub raw（线上）
  try {
    const url = `${RAW_BASE}/${segs.map(encodeURIComponent).join("/")}`;
    const res = await fetch(url, { cache: "force-cache" });
    if (res.ok) {
      return new Response(await res.arrayBuffer(), { headers });
    }
  } catch {
    // ignore
  }

  return new Response("Not found", { status: 404 });
}
