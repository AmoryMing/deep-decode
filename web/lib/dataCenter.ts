import fs from "node:fs";
import path from "node:path";
import { repoRoot } from "./repo";

/**
 * 数据中心（DISCOVERY_DATA_SPEC 支柱2/3 的 web 呈现）：
 * 时间序列趋势 + 单篇表现排行 + 高/低赢面概念（爆款归因先验）。
 * 数据源全是 tools/ 产物：schedule/analytics/<date>.json、output/<slug>/performance.json、
 * wiki/_performance_priors.json。无数据时各段优雅留空。
 */

export interface TrendPoint {
  date: string;
  followers: number | null;
  impressions: number | null;
  collects: number | null;
  netFollowers: number | null;
}

export interface ContentPerf {
  slug: string;
  platform: string;
  views: number;
  likes: number;
  collects: number;
  comments: number;
  shares: number;
  engagement: number; // 综合互动率 %
  collectLikeRatio: number | null;
}

export interface ConceptPrior {
  concept: string;
  weight: number;
  avg: number;
  n: number;
}

export interface DataCenter {
  trend: TrendPoint[];
  topContent: ContentPerf[];
  goodConcepts: ConceptPrior[];
  badConcepts: ConceptPrior[];
  priorsComputedFrom: number;
}

function readJson(p: string): any {
  try {
    return JSON.parse(fs.readFileSync(p, "utf8"));
  } catch {
    return null;
  }
}

function getTrend(): TrendPoint[] {
  const dir = path.join(repoRoot(), "schedule", "analytics");
  if (!fs.existsSync(dir)) return [];
  const files = fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".json"))
    .sort();
  const out: TrendPoint[] = [];
  for (const f of files) {
    const d = readJson(path.join(dir, f));
    if (!d) continue;
    const m = d.xhs_metrics || {};
    out.push({
      date: d.date || f.replace(/\.json$/, ""),
      followers: d.xhs_account?.followers ?? null,
      impressions: m.impressions ?? null,
      collects: m.collects ?? null,
      netFollowers: m.netFollowers ?? null,
    });
  }
  return out.slice(-30);
}

function getContentPerf(): ContentPerf[] {
  const outDir = path.join(repoRoot(), "output");
  if (!fs.existsSync(outDir)) return [];
  const rows: ContentPerf[] = [];
  for (const slug of fs.readdirSync(outDir)) {
    const pf = path.join(outDir, slug, "performance.json");
    if (!fs.existsSync(pf)) continue;
    const d = readJson(pf);
    if (!d?.platforms) continue;
    for (const [platform, p] of Object.entries<any>(d.platforms)) {
      const views = p.views || p.impressions || 0;
      if (!views) continue;
      const weighted =
        (p.likes || 0) +
        (p.collects || 0) * 2 +
        (p.comments || 0) * 3 +
        (p.shares || 0) * 2 +
        (p.new_followers || 0) * 5;
      rows.push({
        slug,
        platform,
        views,
        likes: p.likes || 0,
        collects: p.collects || 0,
        comments: p.comments || 0,
        shares: p.shares || 0,
        engagement: Math.round((weighted / views) * 1000) / 10,
        collectLikeRatio: p.likes ? Math.round((p.collects / p.likes) * 100) / 100 : null,
      });
    }
  }
  return rows.sort((a, b) => b.engagement - a.engagement);
}

export function getDataCenter(): DataCenter {
  const priors = readJson(path.join(repoRoot(), "wiki", "_performance_priors.json")) || {};
  const conceptArr: ConceptPrior[] = Object.entries<any>(priors.concepts || {}).map(
    ([concept, v]) => ({
      concept,
      weight: v.weight ?? 0,
      avg: v.avg ?? 0,
      n: v.n ?? 0,
    }),
  );
  conceptArr.sort((a, b) => b.weight - a.weight);
  return {
    trend: getTrend(),
    topContent: getContentPerf().slice(0, 15),
    goodConcepts: conceptArr.filter((c) => c.weight > 0).slice(0, 8),
    badConcepts: conceptArr.filter((c) => c.weight < 0).slice(-8).reverse(),
    priorsComputedFrom: priors.computed_from || 0,
  };
}
