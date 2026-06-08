"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  checkCredentials,
  createToken,
  SESSION_COOKIE,
  SESSION_MAX_AGE,
} from "@/lib/auth";

export interface LoginState {
  error: string | null;
}

export async function login(
  _prev: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const user = String(formData.get("user") || "");
  const pass = String(formData.get("pass") || "");
  const fromRaw = String(formData.get("from") || "/admin");

  if (!checkCredentials(user, pass)) {
    return { error: "用户名或密码错误" };
  }

  const token = await createToken(user);
  const store = await cookies();
  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });

  const dest = fromRaw.startsWith("/admin") ? fromRaw : "/admin";
  redirect(dest);
}

export async function logout(): Promise<void> {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
  redirect("/");
}
