"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { SESSION_COOKIE, verifyToken } from "@/lib/auth";
import { PLATFORMS, updatePublishedCell, type Platform } from "@/lib/queue";

export interface MarkState {
  ok: boolean;
  message: string;
}

/** 人审完点「标记已发」→ 回填 published.md 对应单元格为今天日期。 */
export async function markPublished(
  _prev: MarkState,
  formData: FormData,
): Promise<MarkState> {
  const store = await cookies();
  const authed = await verifyToken(store.get(SESSION_COOKIE)?.value);
  if (!authed) return { ok: false, message: "未登录" };

  const slug = String(formData.get("slug") || "").trim();
  const platform = String(formData.get("platform") || "") as Platform;
  if (!slug || !PLATFORMS.includes(platform)) {
    return { ok: false, message: "参数不合法" };
  }

  const today = new Date().toISOString().slice(0, 10);
  let done = false;
  try {
    done = updatePublishedCell(slug, platform, today);
  } catch {
    // 线上（Vercel 等）文件系统只读——队列的写回只在本地工作台可用
    return { ok: false, message: "写入失败：此环境文件系统只读，请在本地工作台操作" };
  }
  if (done) revalidatePath("/admin/queue");
  return done
    ? { ok: true, message: `${platform} → ${today}` }
    : { ok: false, message: "在 published.md 里没找到该行" };
}
