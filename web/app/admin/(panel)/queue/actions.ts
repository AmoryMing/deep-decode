"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import fs from "node:fs";
import path from "node:path";
import { SESSION_COOKIE, verifyToken } from "@/lib/auth";
import { repoRoot } from "@/lib/repo";
import { PLATFORMS, updatePublishedCell, type Platform } from "@/lib/queue";

const execFileP = promisify(execFile);

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

/**
 * 一键发送/建草稿——把原来要去终端跑的发布命令包成按钮（critique #1）。
 * 安全设计：① 只在人显式点击 + 二次确认（confirm=yes）时才真的执行；
 * ② 邮件是真发送，必须带 confirm；公众号是建草稿（不直发）；
 * ③ 永不自动触发——server action 只响应浏览器里的人工点击。
 */
export async function sendChannel(
  _prev: MarkState,
  formData: FormData,
): Promise<MarkState> {
  const store = await cookies();
  if (!(await verifyToken(store.get(SESSION_COOKIE)?.value))) {
    return { ok: false, message: "未登录" };
  }
  const slug = String(formData.get("slug") || "").trim();
  const platform = String(formData.get("platform") || "") as Platform;
  const confirm = String(formData.get("confirm") || "");
  if (!/^[A-Za-z0-9_-]+$/.test(slug) || !PLATFORMS.includes(platform)) {
    return { ok: false, message: "参数不合法" };
  }
  const dir = path.join(repoRoot(), "output", slug);
  if (!fs.existsSync(dir)) return { ok: false, message: "项目目录不存在" };

  // 真发送类必须二次确认
  if (platform === "邮件" && confirm !== "yes") {
    return { ok: false, message: "再点一次确认——这会真的发邮件给订阅者" };
  }

  try {
    if (platform === "邮件") {
      if (!fs.existsSync(path.join(dir, "send_email.py"))) {
        return { ok: false, message: "缺 send_email.py，先生成邮件包" };
      }
      await execFileP("python3", ["send_email.py", "--send"], { cwd: dir, timeout: 120000 });
      updatePublishedCell(slug, "邮件", new Date().toISOString().slice(0, 10));
      revalidatePath("/admin/queue");
      return { ok: true, message: "邮件已发送，已回填日期" };
    }
    if (platform === "公众号") {
      const script = path.join(repoRoot(), ".claude/skills/distribute/wechat_publish.py");
      if (!fs.existsSync(script)) return { ok: false, message: "缺公众号发布脚本" };
      const { stdout } = await execFileP("python3", [script, "article.md"],
        { cwd: dir, timeout: 120000 });
      return { ok: true, message: "公众号草稿已建" + (stdout ? "" : "") };
    }
    return { ok: false, message: `${platform} 暂需手动上传（见展开里的素材包）` };
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    // 公众号常见 40164 IP 白名单
    if (/40164/.test(msg)) return { ok: false, message: "公众号失败：当前 IP 不在白名单" };
    return { ok: false, message: "发送失败：" + msg.slice(0, 120) };
  }
}
