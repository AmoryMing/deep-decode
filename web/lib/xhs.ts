import fs from "node:fs";
import path from "node:path";
import { repoRoot } from "./repo";

export interface XhsMetric {
  label: string;
  value: number;
  change: number | null;
  unit?: string;
}

export interface XhsSnapshot {
  account: {
    handle: string;
    name: string;
    bio: string;
    following: number;
    followers: number;
    followerGoal: number;
    totalLikesCollects: number;
  };
  period: string;
  range: string;
  updatedAt: string;
  mode: string;
  metrics: Record<string, XhsMetric>;
  latestNote: string;
}

export interface FunnelStage {
  stage: string;
  value: number;
  rate: number | null; // 相对上一层的转化率（%）
}

export interface XhsDerived {
  engagements: number; // 互动总数
  viewRate: number; // 观看/曝光
  engageRate: number; // 互动/曝光
  followRate: number; // 净涨粉/观看
  collectLikeRatio: number; // 收藏/点赞（>1 = 内容有收藏价值，干货信号）
  funnel: FunnelStage[];
  health: { label: string; value: string; good: boolean; hint: string }[];
}

export function getXhsSnapshot(): XhsSnapshot | null {
  const f = path.join(repoRoot(), "schedule", "xhs-snapshot.json");
  try {
    if (fs.existsSync(f)) return JSON.parse(fs.readFileSync(f, "utf8"));
  } catch {
    /* ignore */
  }
  return null;
}

function pct(n: number, d: number): number {
  return d > 0 ? Math.round((n / d) * 1000) / 10 : 0;
}

export function getXhsDerived(s: XhsSnapshot): XhsDerived {
  const m = s.metrics;
  const imp = m.impressions?.value ?? 0;
  const views = m.views?.value ?? 0;
  const likes = m.likes?.value ?? 0;
  const collects = m.collects?.value ?? 0;
  const comments = m.comments?.value ?? 0;
  const shares = m.shares?.value ?? 0;
  const net = m.netFollowers?.value ?? 0;
  const engagements = likes + collects + comments + shares;

  const viewRate = pct(views, imp);
  const engageRate = pct(engagements, imp);
  const followRate = pct(net, views);
  const collectLikeRatio = likes > 0 ? Math.round((collects / likes) * 100) / 100 : 0;

  const funnel: FunnelStage[] = [
    { stage: "曝光", value: imp, rate: null },
    { stage: "观看", value: views, rate: pct(views, imp) },
    { stage: "互动", value: engagements, rate: pct(engagements, views) },
    { stage: "净涨粉", value: net, rate: pct(net, engagements) },
  ];

  const health = [
    {
      label: "观看率",
      value: `${viewRate}%`,
      good: viewRate >= 15,
      hint: "观看/曝光，封面+标题的吸引力。>15% 较好",
    },
    {
      label: "互动率",
      value: `${engageRate}%`,
      good: engageRate >= 1,
      hint: "互动/曝光，内容质量。小红书 >1% 算不错",
    },
    {
      label: "收藏点赞比",
      value: `${collectLikeRatio}`,
      good: collectLikeRatio >= 1,
      hint: "收藏/点赞。>1 说明是被反复看的干货，权重更高",
    },
    {
      label: "涨粉率",
      value: `${followRate}%`,
      good: followRate >= 0.2,
      hint: "净涨粉/观看，内容到关注的转化",
    },
  ];

  return {
    engagements,
    viewRate,
    engageRate,
    followRate,
    collectLikeRatio,
    funnel,
    health,
  };
}
