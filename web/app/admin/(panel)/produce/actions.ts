"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import fs from "node:fs";
import path from "node:path";
import yaml from "js-yaml";
import { SESSION_COOKIE, verifyToken } from "@/lib/auth";
import { repoRoot } from "@/lib/repo";

export interface CreateState {
  ok: boolean;
  message: string;
  slug?: string;
}

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

function kebab(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);
}

/**
 * 从 UI 新建一个项目：写 output/<slug>/spec_lock.yaml + 建目录。
 * 这是「配置 → 可启动 run」的缺失环节——建好后它出现在产出页，可点「▶ 开始」。
 * 发送/生成都不在这里发生；只落一个 awaiting-confirmation 的契约。
 */
export async function createProject(
  _prev: CreateState,
  formData: FormData,
): Promise<CreateState> {
  const store = await cookies();
  if (!(await verifyToken(store.get(SESSION_COOKIE)?.value))) {
    return { ok: false, message: "未登录" };
  }

  const title = String(formData.get("title") || "").trim();
  const slugRaw = String(formData.get("slug") || "").trim();
  const contentType = String(formData.get("content_type") || "decode").trim();
  const reader = String(formData.get("reader") || "default").trim();
  const style = String(formData.get("style") || "default").trim();
  const voice = String(formData.get("voice") || "").trim();
  const inputType = String(formData.get("input_type") || "url").trim();
  const source = String(formData.get("source") || "").trim();
  const channels = formData.getAll("channels").map(String).filter(Boolean);

  if (!title) return { ok: false, message: "标题/选题不能为空" };
  if (channels.length === 0)
    return { ok: false, message: "至少选一个分发渠道" };

  const base = kebab(slugRaw) || kebab(title) || "draft";
  const root = repoRoot();
  let slug = `${today()}-${base}`;
  let dir = path.join(root, "output", slug);
  for (let i = 2; fs.existsSync(dir) && i < 20; i++) {
    slug = `${today()}-${base}-${i}`;
    dir = path.join(root, "output", slug);
  }
  if (fs.existsSync(dir)) return { ok: false, message: "slug 冲突，换个名字" };

  const spec = {
    version: 2,
    project: {
      slug,
      type: contentType,
      input_mode:
        inputType === "url"
          ? "decode-url"
          : inputType === "entity"
            ? "decode-entity"
            : "local-material",
      root: `output/${slug}`,
      status: "awaiting-confirmation",
      strategy_confirmed: false,
      title,
    },
    trigger: "manual",
    input: { type: inputType, source },
    config: {
      reader,
      style,
      knowledge_domains: [],
      content_type: contentType,
      voice: voice || null,
      image_backend: "gpt-image",
    },
    strategy: {
      title_angle: "",
      thesis: "",
      counter_thesis: "",
      red_lines: [
        "不从 wiki 摘要写正文",
        '不用"我认为"',
        "英文引用必须翻译",
        '禁止 emoji、"让我们"、"值得注意的是"',
      ],
    },
    artifacts: {
      article: "article.md",
      visuals_min: 4,
      visuals_max: 8,
      podcast_required: contentType === "decode",
      factcheck_required: true,
      polish_required: true,
      video_required: false,
      distribution: { channels, mode: "draft" },
    },
  };

  try {
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(
      path.join(dir, "spec_lock.yaml"),
      "# 由工作台「新建项目」生成 — Strategy 待 UI 确认\n" +
        yaml.dump(spec, { lineWidth: 100, noRefs: true }),
      "utf8",
    );
  } catch {
    return { ok: false, message: "写入失败：此环境文件系统只读" };
  }

  revalidatePath("/admin/produce");
  return { ok: true, message: `已建 ${slug}`, slug };
}
