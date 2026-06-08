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
    date: String(data.date || data.decoded || dateFromSlug || ""),
    decoded: data.decoded ? String(data.decoded) : undefined,
    author: data.author ? String(data.author) : undefined,
    source: data.source ? String(data.source) : undefined,
    type: data.type ? String(data.type) : undefined,
    status: data.status ? String(data.status) : undefined,
    tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
    cover: firstImage(content, slug),
    excerpt: makeExcerpt(content),
    hasPodcast: dirFiles.includes("podcast.mp3"),
    hasVideo:
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
  const dirFiles = fs.readdirSync(path.join(outputDir(), slug));
  const images = dirFiles
    .filter((f) => /\.(png|jpe?g|svg|webp)$/i.test(f))
    .sort()
    .map((f) => cdnUrl(`output/${slug}/${f}`));
  return {
    ...meta,
    html: rewriteAndRender(content, slug),
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
