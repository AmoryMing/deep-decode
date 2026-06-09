import type { Metadata } from "next";
import Link from "next/link";
import {
  getComplianceReport,
  getComplianceSummary,
  type Severity,
} from "@/lib/compliance";

export const metadata: Metadata = {
  title: "合规",
  robots: { index: false, follow: false },
};

const sevStyle: Record<Severity, string> = {
  error: "bg-accent/10 text-accent border-accent/30",
  warn: "bg-amber-50 text-amber-700 border-amber-200",
  info: "bg-line/40 text-muted border-line",
};

export default function Compliance() {
  const report = getComplianceReport();
  const sum = getComplianceSummary();
  const flagged = report.filter((r) => r.status !== "pass");

  return (
    <div className="flex flex-col gap-8">
      <header>
        <h2 className="text-xl font-bold text-ink">③ 合规 · 发布前审查</h2>
        <p className="mt-1 text-sm text-muted">
          自动扫描广告法极限词、写作铁律禁用、引用合规。发布前逐篇过审。
        </p>
      </header>

      {/* 概览 */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat n={sum.error} label="违规(error)" accent />
        <Stat n={sum.warn} label="待核(warn)" />
        <Stat n={sum.pass} label="通过" />
        <Stat n={sum.total} label="总篇数" />
      </div>

      {/* 问题列表 */}
      <section>
        <h3 className="mb-3 text-sm font-bold uppercase tracking-wider text-muted">
          待处理（{flagged.length}）
        </h3>
        {flagged.length === 0 ? (
          <p className="rounded-lg border border-line bg-white p-6 text-center text-sm text-muted">
            全部通过，无合规问题 🎉
          </p>
        ) : (
          <div className="flex flex-col gap-3">
            {flagged.map((r) => (
              <div
                key={r.slug}
                className="rounded-lg border border-line bg-white p-4"
              >
                <div className="mb-2 flex items-center gap-2">
                  <span
                    className={`rounded px-1.5 py-0.5 text-[10px] font-bold uppercase ${
                      r.status === "error"
                        ? "bg-accent text-paper"
                        : "bg-amber-400 text-ink"
                    }`}
                  >
                    {r.status}
                  </span>
                  <Link
                    href={`/post/${r.slug}`}
                    className="min-w-0 flex-1 truncate text-sm font-semibold text-ink hover:text-accent"
                  >
                    {r.title}
                  </Link>
                  {r.reviewed && (
                    <span className="shrink-0 text-[11px] text-muted">
                      ✓ 已人工复核
                    </span>
                  )}
                </div>
                <div className="flex flex-col gap-1.5">
                  {r.issues.map((iss, k) => (
                    <div
                      key={k}
                      className={`flex items-start gap-2 rounded border px-2.5 py-1.5 text-xs ${sevStyle[iss.severity]}`}
                    >
                      <span className="shrink-0 font-medium">{iss.type}</span>
                      <span className="opacity-80">{iss.detail}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function Stat({
  n,
  label,
  accent,
}: {
  n: number;
  label: string;
  accent?: boolean;
}) {
  return (
    <div className="rounded-xl border border-line bg-white p-4">
      <div
        className={`text-2xl font-bold tabular-nums ${accent ? "text-accent" : "text-ink"}`}
      >
        {n}
      </div>
      <div className="mt-0.5 text-xs text-muted">{label}</div>
    </div>
  );
}
