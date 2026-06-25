"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "拆解" },
  { href: "/process", label: "流程" },
  // 运营入口仅本地可见；公开站（NEXT_PUBLIC_AIDEEP_PUBLIC=1）隐藏
  ...(process.env.NEXT_PUBLIC_AIDEEP_PUBLIC === "1"
    ? []
    : [{ href: "/admin", label: "运营" }]),
];

export function Nav() {
  const pathname = usePathname();
  return (
    <header className="sticky top-0 z-50 border-b border-line bg-paper/85 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-5">
        <Link href="/" className="flex items-baseline gap-2">
          <span className="text-base font-bold tracking-tight text-ink">
            AIDEEP
          </span>
          <span className="text-[11px] tracking-[0.2em] text-muted">
            AI&nbsp;深度拆解
          </span>
        </Link>
        <nav className="flex items-center gap-1 text-sm">
          {links.map((l) => {
            const active =
              l.href === "/"
                ? pathname === "/"
                : pathname.startsWith(l.href);
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`rounded-full px-3.5 py-1.5 transition-colors ${
                  active
                    ? "bg-ink text-paper"
                    : "text-ink-soft hover:bg-line/60"
                }`}
              >
                {l.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
