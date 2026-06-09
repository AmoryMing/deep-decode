import fs from "node:fs";
import path from "node:path";
import { repoRoot } from "./repo";
import { getRevenue, type RevenueRow } from "./schedule";
import { getCalendarStats } from "./calendar";

export interface PlatformMetric {
  platform: string;
  followers?: number;
  newFollowers?: number;
  reads?: number;
  views?: number;
  likes?: number;
  collects?: number;
  comments?: number;
  shares?: number;
  posts?: number;
  updatedAt?: string;
}

export interface AnalyticsData {
  source: "manual" | "derived";
  platforms: PlatformMetric[];
  revenue: RevenueRow[];
  revenueTotal: number;
  revenueByMonth: { month: string; amount: number }[];
}

/**
 * 运营数据。优先读 schedule/analytics.json（由数据拉取写入，见
 * /api/analytics/refresh —— XHS / 公众号 实拉接口）；没有则从发布量 + 营收派生，
 * 保证前台闭环可跑通。
 */
export function getAnalytics(): AnalyticsData {
  let platforms: PlatformMetric[] = [];
  let source: "manual" | "derived" = "derived";

  const f = path.join(repoRoot(), "schedule", "analytics.json");
  if (fs.existsSync(f)) {
    try {
      const d = JSON.parse(fs.readFileSync(f, "utf8"));
      if (Array.isArray(d?.platforms) && d.platforms.length) {
        platforms = d.platforms;
        source = "manual";
      }
    } catch {
      /* ignore */
    }
  }

  if (platforms.length === 0) {
    const cal = getCalendarStats();
    platforms = cal.byPlatform.map((p) => ({
      platform: p.platform,
      posts: p.count,
    }));
  }

  const revenue = getRevenue();
  const byMonth = new Map<string, number>();
  for (const r of revenue)
    byMonth.set(r.month, (byMonth.get(r.month) || 0) + (r.amount || 0));

  return {
    source,
    platforms,
    revenue,
    revenueTotal: revenue.reduce((s, r) => s + (r.amount || 0), 0),
    revenueByMonth: [...byMonth.entries()]
      .map(([month, amount]) => ({ month, amount }))
      .sort((a, b) => (a.month < b.month ? 1 : -1)),
  };
}

export interface AIInsight {
  generatedAt: string;
  summary: string;
  points: string[];
}

export function getAIInsight(): AIInsight | null {
  const f = path.join(repoRoot(), "schedule", "ai-insights.json");
  try {
    if (fs.existsSync(f)) return JSON.parse(fs.readFileSync(f, "utf8"));
  } catch {
    /* ignore */
  }
  return null;
}
