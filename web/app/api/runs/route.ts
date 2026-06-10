import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { SESSION_COOKIE, verifyToken } from "@/lib/auth";
import { listRuns } from "@/lib/runs";

// 轮询端点：/admin/runs 的客户端每隔几秒拉一次，渲染实时进度
export const dynamic = "force-dynamic";

export async function GET() {
  const store = await cookies();
  if (!(await verifyToken(store.get(SESSION_COOKIE)?.value))) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  return NextResponse.json({ runs: listRuns(), at: new Date().toISOString() });
}
