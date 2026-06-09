import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { repoRoot } from "./repo";

const topicsDir = () => path.join(repoRoot(), "wiki", "topics");
const radarDir = () => path.join(repoRoot(), "wiki", "radar");

export interface Topic {
  slug: string;
  title: string;
  status: string;
  tags: string[];
  sourceSupport: string;
  created: string;
  angle: string;
}

function extractSection(md: string, heading: string): string {
  const re = new RegExp(`##\\s*${heading}\\s*\\n([\\s\\S]*?)(?:\\n##\\s|$)`);
  const m = md.match(re);
  return m ? m[1].trim().replace(/\n+/g, " ").slice(0, 160) : "";
}

export function getTopics(): Topic[] {
  const dir = topicsDir();
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".md"))
    .map((f) => {
      const raw = fs.readFileSync(path.join(dir, f), "utf8");
      const { data, content } = matter(raw);
      return {
        slug: f.replace(/\.md$/, ""),
        title: data.title ? String(data.title) : f,
        status: data.status ? String(data.status) : "topic",
        tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
        sourceSupport: data.source_support ? String(data.source_support) : "",
        created: String(data.created || ""),
        angle: extractSection(content, "角度"),
      };
    })
    .sort((a, b) => (a.created < b.created ? 1 : -1));
}

export interface RadarReport {
  date: string;
  items: number;
  preview: string;
}

export function getRadar(): RadarReport[] {
  const dir = radarDir();
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".md"))
    .map((f) => {
      const raw = fs.readFileSync(path.join(dir, f), "utf8");
      const items = (raw.match(/^\s*[-*]\s/gm) || []).length;
      const firstLine =
        raw
          .split("\n")
          .find((l) => l.trim() && !l.startsWith("#") && !l.startsWith("---")) ||
        "";
      return {
        date: f.replace(/\.md$/, ""),
        items,
        preview: firstLine.trim().slice(0, 120),
      };
    })
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export interface TopicStats {
  total: number;
  byStatus: { status: string; count: number }[];
}

export function getTopicStats(): TopicStats {
  const topics = getTopics();
  const m = new Map<string, number>();
  for (const t of topics) m.set(t.status, (m.get(t.status) || 0) + 1);
  return {
    total: topics.length,
    byStatus: [...m.entries()]
      .map(([status, count]) => ({ status, count }))
      .sort((a, b) => b.count - a.count),
  };
}
