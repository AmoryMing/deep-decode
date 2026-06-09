import type { ReactNode } from "react";
import Link from "next/link";
import { logout } from "../actions";
import { AdminNav } from "@/components/AdminNav";

export default function PanelLayout({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-6 sm:flex-row">
      <aside className="w-full shrink-0 sm:sticky sm:top-4 sm:h-fit sm:w-56">
        <div className="mb-4">
          <h1 className="text-lg font-bold text-ink">运营工作台</h1>
          <p className="text-xs text-muted">内容闭环 · 仅本人可见</p>
        </div>
        <AdminNav />
        <div className="mt-4 flex items-center gap-3 border-t border-line pt-3 text-xs text-muted">
          <Link href="/" className="transition-colors hover:text-accent">
            ← 看门户
          </Link>
          <form action={logout}>
            <button className="transition-colors hover:text-accent">登出</button>
          </form>
        </div>
      </aside>
      <main className="min-w-0 flex-1">{children}</main>
    </div>
  );
}
