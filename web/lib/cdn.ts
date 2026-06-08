/**
 * 媒体 URL 构造。
 *
 * 默认走站内中转路由 /api/media（见 app/api/media/[...path]/route.ts）：
 *   - 本地直接读 output/，线上由 Vercel 服务器回源 GitHub raw。
 *   - 绕开 jsDelivr / GitHub raw 在国内浏览器端不可达的问题。
 *
 * 若设置 NEXT_PUBLIC_CDN_BASE / NEXT_PUBLIC_RAW_BASE，则改为直连该 CDN
 *（例如海外访问为主、或将来换到国内 OSS 时）。
 */
const DIRECT_CDN = process.env.NEXT_PUBLIC_CDN_BASE;
const DIRECT_RAW = process.env.NEXT_PUBLIC_RAW_BASE;

function enc(repoRelPath: string): string {
  return repoRelPath
    .replace(/^\/+/, "")
    .split("/")
    .map((seg) => encodeURIComponent(seg))
    .join("/");
}

/** 图片 / 音频 */
export function cdnUrl(repoRelPath: string): string {
  const p = enc(repoRelPath);
  return DIRECT_CDN ? `${DIRECT_CDN}/${p}` : `/api/media/${p}`;
}

/** 视频等大文件 */
export function rawUrl(repoRelPath: string): string {
  const p = enc(repoRelPath);
  return DIRECT_RAW ? `${DIRECT_RAW}/${p}` : `/api/media/${p}`;
}
