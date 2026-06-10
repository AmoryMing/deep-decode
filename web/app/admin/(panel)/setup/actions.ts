"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { SESSION_COOKIE, verifyToken } from "@/lib/auth";
import { saveConfigPatch } from "@/lib/setup";

export interface SaveState {
  ok: boolean;
  message: string;
}

export async function saveConfig(
  _prev: SaveState,
  formData: FormData,
): Promise<SaveState> {
  const store = await cookies();
  if (!(await verifyToken(store.get(SESSION_COOKIE)?.value))) {
    return { ok: false, message: "未登录" };
  }
  const s = (k: string) => {
    const v = String(formData.get(k) || "").trim();
    return v || undefined;
  };
  const channels = formData.getAll("channels").map(String).filter(Boolean);

  const res = saveConfigPatch({
    defaultModel: s("defaultModel"),
    visualBackend: s("visualBackend"),
    videoBackend: s("videoBackend"),
    channels: channels.length ? channels : undefined,
    nodeModels: {
      ...(s("model_article") ? { "m.article": s("model_article")! } : {}),
      ...(s("model_router") ? { "n.router": s("model_router")! } : {}),
    },
    deepseekKey: s("deepseekKey"),
    gptImageKey: s("gptImageKey"),
    seedanceAccessKey: s("seedanceAccessKey"),
    seedanceSecretKey: s("seedanceSecretKey"),
  });
  if (res.ok) revalidatePath("/admin/setup");
  return res;
}
