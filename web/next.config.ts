import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  // 内容数据 (output/ schedule/ wiki/ skillgraph.yaml) 位于仓库根，即 web/ 的上一级。
  // build 时数据层用 fs 读取，这里把 file tracing root 指向仓库根，
  // 确保 Vercel 在 root directory=web 下也能把外层文件纳入构建。
  outputFileTracingRoot: path.join(process.cwd(), ".."),
  // 媒体全部走 CDN 的 <img>/<video>，不经过 next/image 优化（避免 Vercel 优化额度）。
  // 仍允许 jsDelivr/raw 作为远程图源以备将来使用 next/image。
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "cdn.jsdelivr.net" },
      { protocol: "https", hostname: "raw.githubusercontent.com" },
    ],
  },
};

export default nextConfig;
