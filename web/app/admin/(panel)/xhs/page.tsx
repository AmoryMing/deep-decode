import type { Metadata } from "next";
import { getXhsSnapshot, getXhsDerived } from "@/lib/xhs";
import { XhsDashboard } from "@/components/XhsDashboard";

export const metadata: Metadata = {
  title: "小红书监控",
  robots: { index: false, follow: false },
};

export default function XhsPage() {
  const snap = getXhsSnapshot();

  return (
    <div className="flex flex-col gap-6">
      <header>
        <h2 className="text-xl font-bold text-ink">小红书 · 数据监控看板</h2>
        <p className="mt-1 text-sm text-muted">
          @fantastic_ming 创作者后台快照。曝光 → 互动 → 涨粉全链路 + 内容健康度 + AI 诊断。
        </p>
      </header>

      {snap ? (
        <XhsDashboard snapshot={snap} derived={getXhsDerived(snap)} />
      ) : (
        <p className="rounded-lg border border-line bg-white p-6 text-center text-sm text-muted">
          暂无小红书快照数据（schedule/xhs-snapshot.json 缺失）。
        </p>
      )}
    </div>
  );
}
