import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { repoRoot } from "./repo";
import { cdnUrl, rawUrl } from "./cdn";
import { rewriteAndRender } from "./markdown";

export interface PostMeta {
  slug: string;
  title: string;
  date: string;
  decoded?: string;
  author?: string;
  source?: string;
  type?: string;
  status?: string;
  tags: string[];
  cover?: string;
  excerpt: string;
  hasPodcast: boolean;
  hasVideo: boolean;
  imageCount: number;
}

export interface Post extends PostMeta {
  html: string;
  podcast?: string;
  videoH?: string;
  videoV?: string;
  images: string[];
}

const outputDir = () => path.join(repoRoot(), "output");

/**
 * 归一化日期为 YYYY-MM-DD。
 * gray-matter 会把未加引号的 YAML 日期解析成 JS Date，String(Date) 会渲染成
 * "Wed May 27 2026 08:00:00 GMT+0800"（门户两行 + 字典序乱排的根因）。
 * 这里统一拍平成纯日期串，既消 GMT 串，也让卡片按日期正确降序。
 */
function normalizeDate(v: unknown): string {
  if (v instanceof Date && !isNaN(v.getTime())) {
    const y = v.getFullYear();
    const m = String(v.getMonth() + 1).padStart(2, "0");
    const d = String(v.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  }
  const s = String(v ?? "").trim();
  const m = s.match(/(\d{4})[-/](\d{2})[-/](\d{2})/);
  if (m) return `${m[1]}-${m[2]}-${m[3]}`;
  return s;
}

function firstImage(md: string, slug: string): string | undefined {
  const m = md.match(/!\[[^\]]*\]\(([^)]+)\)/);
  if (!m) return undefined;
  const s = m[1].trim();
  if (/^https?:/.test(s)) return s;
  return cdnUrl(`output/${slug}/${s.replace(/^\.\//, "")}`);
}

function makeExcerpt(md: string): string {
  const text = md
    .replace(/```[\s\S]*?```/g, "")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, "")
    .replace(/^#{1,6}.*$/gm, "")
    .replace(/^\s*>.*$/gm, "")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/[`*_~#>|]/g, "")
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l.length > 0)
    .join(" ");
  return text.slice(0, 140);
}

export function getAllSlugs(): string[] {
  const dir = outputDir();
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((name) => !name.startsWith("_") && !name.startsWith("."))
    .filter((name) => {
      try {
        return fs.statSync(path.join(dir, name)).isDirectory();
      } catch {
        return false;
      }
    })
    .filter((name) => fs.existsSync(path.join(dir, name, "article.md")));
}

// 收集组件交错用的配图（gpt-img 杂志图 > png > assets > 顶层散图），返回相对路径。
// getPost 用它出图、剥内联；getPostMeta 用它做封面回退。统一一处，避免两边逻辑漂移。
function collectFigures(slug: string): string[] {
  const slugDir = path.join(outputDir(), slug);
  if (!fs.existsSync(slugDir)) return [];
  const imgExt = /\.(png|jpe?g|webp)$/i;
  const collect = (rel: string): string[] => {
    const abs = path.join(slugDir, rel);
    if (!fs.existsSync(abs) || !fs.statSync(abs).isDirectory()) return [];
    return fs
      .readdirSync(abs)
      .filter((f) => imgExt.test(f))
      .sort()
      .map((f) => `${rel}/${f}`.replace(/^\.\//, ""));
  };
  let rel = collect("assets/gpt-img");
  if (rel.length === 0) rel = collect("assets/png");
  if (rel.length === 0) rel = collect("assets");
  if (rel.length === 0)
    rel = fs.readdirSync(slugDir).filter((f) => imgExt.test(f)).sort();
  return rel;
}

// 卡片封面：正文无内联图时，回退到资产首图（如 00_cover）。
function figureCover(slug: string): string | undefined {
  const f = collectFigures(slug)[0];
  return f ? cdnUrl(`output/${slug}/${f}`) : undefined;
}

export function getPostMeta(slug: string): PostMeta | null {
  const file = path.join(outputDir(), slug, "article.md");
  if (!fs.existsSync(file)) return null;
  const raw = fs.readFileSync(file, "utf8");
  const { data, content } = matter(raw);
  const dirFiles = fs.readdirSync(path.join(outputDir(), slug));
  const dateFromSlug = slug.match(/^(\d{4}-\d{2}-\d{2})/)?.[1];
  const imageCount = dirFiles.filter((f) =>
    /\.(png|jpe?g|webp)$/i.test(f),
  ).length;
  return {
    slug,
    title: data.title ? String(data.title) : slug,
    date: normalizeDate(data.date || data.decoded || dateFromSlug),
    decoded: data.decoded ? normalizeDate(data.decoded) : undefined,
    author: data.author ? String(data.author) : undefined,
    source: data.source ? String(data.source) : undefined,
    type: data.type ? String(data.type) : undefined,
    status: data.status ? String(data.status) : undefined,
    tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
    cover: firstImage(content, slug) ?? figureCover(slug),
    excerpt: makeExcerpt(content),
    hasPodcast: dirFiles.includes("podcast.mp3"),
    hasVideo:
      dirFiles.includes("video.mp4") ||
      dirFiles.includes("video_horizontal.mp4") ||
      dirFiles.includes("video_vertical.mp4"),
    imageCount,
  };
}

export function getAllPosts(): PostMeta[] {
  return getAllSlugs()
    .map(getPostMeta)
    .filter((p): p is PostMeta => p !== null)
    .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
}

export function getPost(slug: string): Post | null {
  const meta = getPostMeta(slug);
  if (!meta) return null;
  const file = path.join(outputDir(), slug, "article.md");
  const { content } = matter(fs.readFileSync(file, "utf8"));
  const slugDir = path.join(outputDir(), slug);
  const dirFiles = fs.readdirSync(slugDir);
  const images = collectFigures(slug).map((r) => cdnUrl(`output/${slug}/${r}`));
  // 有配图资产时，ArticleWithFigures 组件会自动按章交错插图；
  // 因此剥掉正文里的内联图 ![]（多为整行），避免与组件各插一次造成图片重复。
  // 无资产的文章（images 为空）保留内联图——那是它唯一的图源。
  const body =
    images.length > 0
      ? content.replace(/^[ \t]*!\[[^\]]*\]\([^)]*\)[ \t]*$/gm, "")
      : content;
  return {
    ...meta,
    html: rewriteAndRender(body, slug),
    podcast: dirFiles.includes("podcast.mp3")
      ? cdnUrl(`output/${slug}/podcast.mp3`)
      : undefined,
    videoH: dirFiles.includes("video_horizontal.mp4")
      ? rawUrl(`output/${slug}/video_horizontal.mp4`)
      : undefined,
    videoV: dirFiles.includes("video_vertical.mp4")
      ? rawUrl(`output/${slug}/video_vertical.mp4`)
      : undefined,
    images,
  };
}

export function getAllTags(): { tag: string; count: number }[] {
  const counts = new Map<string, number>();
  for (const p of getAllPosts())
    for (const t of p.tags) counts.set(t, (counts.get(t) || 0) + 1);
  return [...counts.entries()]
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count);
}

export interface FactoryStats {
  total: number;
  withPodcast: number;
  withVideo: number;
  totalImages: number;
  tags: number;
  latest?: string;
}

export function getFactoryStats(): FactoryStats {
  const posts = getAllPosts();
  return {
    total: posts.length,
    withPodcast: posts.filter((p) => p.hasPodcast).length,
    withVideo: posts.filter((p) => p.hasVideo).length,
    totalImages: posts.reduce((n, p) => n + p.imageCount, 0),
    tags: getAllTags().length,
    latest: posts[0]?.date,
  };
}
