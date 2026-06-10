import type { Metadata } from "next";
import { getAnalytics, getAIInsight } from "@/lib/analytics";
import { getFactoryStats } from "@/lib/content";
import { getCalendarStats } from "@/lib/calendar";
import { getDataCenter } from "@/lib/dataCenter";
import { AnalyticsPanel } from "@/components/AnalyticsPanel";
import { DataCenterPanel } from "@/components/DataCenterPanel";

export const metadata: Metadata = {
  title: "数据分析",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default function AnalyticsPage() {
  const data = getAnalytics();
  const insight = getAIInsight();
  const factory = getFactoryStats();
  const cal = getCalendarStats();
  const dc = getDataCenter();

  const aiInput = {
    platforms: data.platforms.map((p) => ({
      platform: p.platform,
      posts: p.posts,
    })),
    revenueByMonth: data.revenueByMonth,
    revenueTotal: data.revenueTotal,
    contentTotal: factory.total,
    publishedCount: cal.published,
    scheduledCount: cal.scheduled,
  };

  return (
    <div className="flex flex-col gap-6">
      <header>
        <h2 className="text-xl font-bold text-ink">⑤ 数据 · 拉取 + AI 分析</h2>
        <p className="mt-1 text-sm text-muted">
          拉取小红书 / 公众号运营数据，AI 分析趋势与建议，回流驱动下一轮选题。
        </p>
      </header>
      <AnalyticsPanel data={data} aiInput={aiInput} insight={insight} />

      {/* 数据中心：时序趋势 + 赢面概念 + 单篇排行（闭环可视） */}
      <section className="border-t border-line pt-6">
        <h3 className="mb-1 text-lg font-bold text-ink">数据中心 · 闭环</h3>
        <p className="mb-4 text-sm text-muted">
          账号趋势 + 单篇表现归因 → "哪类概念赢面高" → 自动给相关新热点在选题页加权。
        </p>
        <DataCenterPanel dc={dc} />
      </section>
    </div>
  );
}
