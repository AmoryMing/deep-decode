/**
 * 媒体走 CDN，部署包零媒体。
 * - 图片 / 音频：jsDelivr（仓库已在 GitHub，免费 CDN，自带边缘缓存）
 * - 视频：GitHub raw（mp4 常超 jsDelivr 单文件 20MB 上限）
 * 路径段做 percent-encode 以兼容中文文件名（如 00_系列封面.png）。
 *
 * 内容推送在孤儿分支 deploy（cleanup 的历史含 600MB+ 大 commit，
 * 经代理推不动；deploy 用分批小 commit 推送），故默认指向 @deploy。
 */
const CDN_BASE =
  process.env.NEXT_PUBLIC_CDN_BASE ||
  "https://cdn.jsdelivr.net/gh/AmoryMing/deep-decode@deploy";
const RAW_BASE =
  process.env.NEXT_PUBLIC_RAW_BASE ||
  "https://raw.githubusercontent.com/AmoryMing/deep-decode/deploy";

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
