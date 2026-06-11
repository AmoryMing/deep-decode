"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV = [
  { href: "/admin", label: "总览", num: "", desc: "闭环全景" },
  { href: "/admin/setup", label: "接入", num: "0", desc: "资产盘点" },
  { href: "/admin/discover", label: "选题", num: "1", desc: "内容发现" },
  { href: "/admin/produce", label: "产出", num: "2", desc: "文图播客视频" },
  { href: "/admin/runs", label: "运行", num: "3", desc: "流水线进度" },
  { href: "/admin/compliance", label: "合规", num: "4", desc: "发布前审查" },
  { href: "/admin/queue", label: "审核", num: "5", desc: "全平台待发清单" },
  { href: "/admin/calendar", label: "投放", num: "6", desc: "发布日历" },
  { href: "/admin/analytics", label: "数据", num: "7", desc: "拉取 + AI 分析" },
  { href: "/admin/xhs", label: "小红书", num: "", desc: "数据监控看板" },
];

export function AdminNav() {
  const pathname = usePathname();
  return (
    <nav className="flex flex-col gap-1">
      {NAV.map((n) => {
        const active =
          n.href === "/admin" ? pathname === "/admin" : pathname.startsWith(n.href);
        return (
          <Link
            key={n.href}
            href={n.href}
            className={`group flex items-center gap-3 rounded-lg px-3 py-2 transition-colors ${
              active ? "bg-ink text-paper" : "text-ink-soft hover:bg-line/50"
            }`}
          >
            <span
              className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-lg text-xs font-bold ${
                active
                  ? "bg-paper/20 text-paper"
                  : n.num
                    ? "bg-line text-muted group-hover:bg-line"
                    : "text-muted"
              }`}
            >
              {n.num || "·"}
            </span>
            <span className="flex flex-col leading-tight">
              <span className="text-sm font-medium">{n.label}</span>
              <span
                className={`text-[11px] ${active ? "text-paper/70" : "text-muted"}`}
              >
                {n.desc}
              </span>
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
