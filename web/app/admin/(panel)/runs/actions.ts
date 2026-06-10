"use server";

import { cookies } from "next/headers";
import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { SESSION_COOKIE, verifyToken } from "@/lib/auth";
import { repoRoot } from "@/lib/repo";

export interface RunActionState {
  ok: boolean;
  message: string;
}

async function authed(): Promise<boolean> {
  const store = await cookies();
  return verifyToken(store.get(SESSION_COOKIE)?.value);
}

function slugDir(slug: string): string | null {
  // 防目录穿越：slug 只能是单段、无分隔符
  if (!/^[A-Za-z0-9_-]+$/.test(slug)) return null;
  const dir = path.join(repoRoot(), "output", slug);
  return fs.existsSync(path.join(dir, "spec_lock.yaml")) ? dir : null;
}

/** 后台启动 driver 把项目往前推。先写 queued 状态让 UI 立刻看到，再 detached spawn。 */
export async function startRun(
  _prev: RunActionState,
  formData: FormData,
): Promise<RunActionState> {
  if (!(await authed())) return { ok: false, message: "未登录" };
  const slug = String(formData.get("slug") || "").trim();
  const dir = slugDir(slug);
  if (!dir) return { ok: false, message: "无效项目（缺 spec_lock）" };

  try {
    const stateDir = path.join(dir, "_state");
    fs.mkdirSync(stateDir, { recursive: true });
    fs.writeFileSync(
      path.join(stateDir, "run.json"),
      JSON.stringify(
        { slug, status: "queued", started_at: new Date().toISOString(), history: [] },
        null,
        1,
      ),
    );
    const child = spawn(
      "python3",
      ["tools/run_pipeline.py", "--root", dir],
      { cwd: repoRoot(), detached: true, stdio: "ignore" },
    );
    child.unref();
    return { ok: true, message: "已启动" };
  } catch {
    return { ok: false, message: "启动失败：此环境可能无 python 或文件只读" };
  }
}

/** 定向重跑某个安全节点（UI 里点某步「重跑」）。 */
export async function runNode(
  _prev: RunActionState,
  formData: FormData,
): Promise<RunActionState> {
  if (!(await authed())) return { ok: false, message: "未登录" };
  const slug = String(formData.get("slug") || "").trim();
  const node = String(formData.get("node") || "").trim();
  const dir = slugDir(slug);
  if (!dir) return { ok: false, message: "无效项目" };
  if (!/^[a-z]\.[a-z_]+$/.test(node)) return { ok: false, message: "无效节点" };
  try {
    const child = spawn(
      "python3",
      ["tools/run_pipeline.py", "--root", dir, "--node", node],
      { cwd: repoRoot(), detached: true, stdio: "ignore" },
    );
    child.unref();
    return { ok: true, message: `重跑 ${node}` };
  } catch {
    return { ok: false, message: "启动失败" };
  }
}
