import type { ReactNode } from "react";
import Link from "next/link";
import { logout } from "../actions";

export default function PanelLayout({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto max-w-6xl px-5 py-8">
      <header className="mb-7 flex items-center justify-between border-b border-line pb-4">
        <div>
          <h1 className="text-xl font-bold text-ink">运营后台</h1>
          <p className="text-xs text-muted">内容工厂 · 仅本人可见</p>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <Link
            href="/"
            className="text-muted transition-colors hover:text-accent"
          >
            ← 看门户
          </Link>
          <form action={logout}>
            <button className="rounded-lg border border-line bg-white px-3 py-1.5 text-ink-soft transition-colors hover:border-ink/40">
              登出
            </button>
          </form>
        </div>
      </header>
      {children}
    </div>
  );
}
