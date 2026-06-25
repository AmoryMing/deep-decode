import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE, verifyToken } from "./lib/auth";

// 公开站开关：Vercel 上设 NEXT_PUBLIC_AIDEEP_PUBLIC=1，
// 则整个运营后台与运营接口对公网一律 404（像不存在）；本地不设，后台照常用。
const PUBLIC_SITE = process.env.NEXT_PUBLIC_AIDEEP_PUBLIC === "1";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (PUBLIC_SITE) {
    // 后台 UI、服务端动作、运营接口全部隐藏；/api/media（图片/播客）不在此列，照常公开。
    return new NextResponse("Not Found", { status: 404 });
  }

  if (pathname === "/admin/login") return NextResponse.next();

  const token = req.cookies.get(SESSION_COOKIE)?.value;
  if (!(await verifyToken(token))) {
    const url = req.nextUrl.clone();
    url.pathname = "/admin/login";
    url.searchParams.set("from", pathname);
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/runs/:path*", "/api/analytics/:path*"],
};
