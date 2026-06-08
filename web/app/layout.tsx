import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { Nav } from "@/components/Nav";

export const metadata: Metadata = {
  title: {
    default: "内容工厂 · Deep Decode",
    template: "%s · 内容工厂",
  },
  description:
    "AI 大厂与顶级个人博客的深度拆解。每篇产出文章 + 信息图 + 播客 + 视频四件套。",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="zh-CN">
      <body className="flex min-h-screen flex-col">
        <Nav />
        <div className="flex-1">{children}</div>
        <footer className="mt-24 border-t border-line">
          <div className="mx-auto flex max-w-5xl flex-col gap-1 px-5 py-10 text-sm text-muted">
            <span className="font-medium text-ink-soft">内容工厂 · Deep Decode</span>
            <span>一个想法进，可发布内容出。拆解 · 信息图 · 播客 · 视频。</span>
          </div>
        </footer>
      </body>
    </html>
  );
}
