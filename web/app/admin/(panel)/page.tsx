import type { Metadata } from "next";
import Link from "next/link";
import { getTopicStats } from "@/lib/topics";
import { getFactoryStats } from "@/lib/content";
import { getComplianceSummary } from "@/lib/compliance";
import { getCalendarStats } from "@/lib/calendar";
import { getScheduleSummary } from "@/lib/schedule";
import { getAnalytics } from "@/lib/analytics";

export const metadata: Metadata = {
  title: "总览",
  robots: { index: false, follow: false },
};

export default function Overview() {
  const topics = getTopicStats();
  const factory = getFactoryStats();
  const compliance = getComplianceSummary();
  const cal = getCalendarStats();
  const sched = getScheduleSummary();
  const analytics = getAnalytics();

  const stages = [
    {
      num: 1,
      label: "选题",
      href: "/admin/discover",
      metric: String(topics.total),
      unit: "个选题",
      sub: `${sched.queueCount} 待写`,
    },
    {
      num: 2,
      label: "产出",
      href: "/admin/produce",
      metric: String(factory.total),
      unit: "篇成稿",
      sub: `${sched.inProgressCount} 在写`,
    },
    {
      num: 3,
      label: "合规",
      href: "/admin/compliance",
      metric: String(compliance.error + compliance.warn),
      unit: "待处理",
      sub: `${compliance.pass} 通过`,
    },
    {
      num: 4,
      label: "投放",
      href: "/admin/calendar",
      metric: String(cal.published),
      unit: "已发布",
      sub: `${cal.scheduled} 排期中`,
    },
    {
      num: 5,
      label: "数据",
      href: "/admin/analytics",
      metric: `¥${analytics.revenueTotal}`,
      unit: "营收",
      sub: `${analytics.platforms.length} 平台`,
    },
  ];

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h2 className="text-2xl font-bold text-ink">内容生产闭环</h2>
        <p className="mt-1 text-sm text-muted">
          选题 → 产出 → 合规 → 投放 → 数据分析，数据回流再驱动选题。
        </p>
        <p className="mt-1.5 text-xs text-muted">
          全程 AI 只出草稿；任何发布都要你人工审核后手动确认，发布永远不会自动发生。
        </p>
      </div>

      {/* 闭环流程条 */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
        {stages.map((s, i) => (
          <Link
            key={s.num}
            href={s.href}
            className="group relative flex flex-col rounded-xl border border-line bg-white p-4 transition-all hover:-translate-y-0.5 hover:border-ink/30 hover:shadow-sm"
          >
            <div className="mb-2 flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-ink text-xs font-bold text-paper">
                {s.num}
              </span>
              <span className="text-sm font-semibold text-ink">{s.label}</span>
            </div>
            <div className="text-2xl font-bold tabular-nums text-ink">
              {s.metric}
            </div>
            <div className="text-xs text-muted">{s.unit}</div>
            <div className="mt-1 text-xs text-accent">{s.sub}</div>
            {i < stages.length - 1 && (
              <span className="absolute -right-2.5 top-1/2 z-10 hidden -translate-y-1/2 text-muted md:block">
                →
              </span>
            )}
          </Link>
        ))}
      </div>

      {/* 关键提醒 */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card title="待办" href="/admin/produce">
          <Line label="待写选题" value={sched.queueCount} />
          <Line label="在写中" value={sched.inProgressCount} />
          <Line label="合规待处理" value={compliance.error + compliance.warn} accent />
        </Card>
        <Card title="本月营收" href="/admin/analytics">
          <div className="text-3xl font-bold text-ink">
            ¥{analytics.revenueByMonth[0]?.amount ?? 0}
          </div>
          <p className="mt-1 text-xs text-muted">
            {analytics.revenueByMonth[0]?.month ?? "—"} ·
            累计 ¥{analytics.revenueTotal}
          </p>
        </Card>
        <Card title="内容资产" href="/">
          <Line label="已发拆解" value={factory.total} />
          <Line label="播客" value={factory.withPodcast} />
          <Line label="信息图" value={factory.totalImages} />
        </Card>
      </div>
    </div>
  );
}

function Card({
  title,
  href,
  children,
}: {
  title: string;
  href: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-line bg-white p-5">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-bold uppercase tracking-wider text-muted">
          {title}
        </h3>
        <Link href={href} className="text-xs text-accent hover:underline">
          查看 →
        </Link>
      </div>
      <div className="flex flex-col gap-2">{children}</div>
    </div>
  );
}

function Line({
  label,
  value,
  accent,
}: {
  label: string;
  value: number;
  accent?: boolean;
}) {
  return (
    <div className="flex items-baseline justify-between">
      <span className="text-sm text-ink-soft">{label}</span>
      <span
        className={`text-lg font-bold tabular-nums ${accent ? "text-accent" : "text-ink"}`}
      >
        {value}
      </span>
    </div>
  );
}
