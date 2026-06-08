/**
 * 媒体走 CDN，部署包零媒体。
 * - 图片 / 音频：jsDelivr（仓库已在 GitHub，免费 CDN，自带边缘缓存）
 * - 视频：GitHub raw（mp4 常超 jsDelivr 单文件 20MB 上限）
 * 路径段做 percent-encode 以兼容中文文件名（如 00_系列封面.png）。
 *
 * 注意：内容当前在 cleanup 分支（main 为空），故默认指向 @cleanup。
 * 合并到 main 后把下面两个默认值（及 Vercel 环境变量）改回 @main 即可。
 */
const CDN_BASE =
  process.env.NEXT_PUBLIC_CDN_BASE ||
  "https://cdn.jsdelivr.net/gh/AmoryMing/deep-decode@cleanup";
const RAW_BASE =
  process.env.NEXT_PUBLIC_RAW_BASE ||
  "https://raw.githubusercontent.com/AmoryMing/deep-decode/cleanup";

function enc(repoRelPath: string): string {
  return repoRelPath
    .replace(/^\/+/, "")
    .split("/")
    .map((seg) => encodeURIComponent(seg))
    .join("/");
}

/** 图片 / 音频 → jsDelivr */
export function cdnUrl(repoRelPath: string): string {
  return `${CDN_BASE}/${enc(repoRelPath)}`;
}

/** 视频等大文件 → GitHub raw */
export function rawUrl(repoRelPath: string): string {
  return `${RAW_BASE}/${enc(repoRelPath)}`;
}
