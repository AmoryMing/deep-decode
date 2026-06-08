/**
 * 单用户后台登录。HMAC 签名 cookie，middleware（edge）与 server action（node）
 * 都用 Web Crypto，两端通用。
 */
const encoder = new TextEncoder();

function b64url(bytes: Uint8Array): string {
  let s = "";
  for (const b of bytes) s += String.fromCharCode(b);
  return btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

async function hmac(secret: string, msg: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", key, encoder.encode(msg));
  return b64url(new Uint8Array(sig));
}

function secret(): string {
  return process.env.AUTH_SECRET || "dev-insecure-secret-change-me";
}

export const SESSION_COOKIE = "cf_session";
export const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 天

export function checkCredentials(user: string, pass: string): boolean {
  const U = process.env.ADMIN_USER || "muming";
  const P = process.env.ADMIN_PASS || "muming";
  return user === U && pass === P;
}

export async function createToken(user: string): Promise<string> {
  const payload = `${user}.${Date.now()}`;
  const sig = await hmac(secret(), payload);
  return `${b64url(encoder.encode(payload))}.${sig}`;
}

export async function verifyToken(token: string | undefined): Promise<boolean> {
  if (!token) return false;
  const dot = token.lastIndexOf(".");
  if (dot <= 0) return false;
  const p = token.slice(0, dot);
  const sig = token.slice(dot + 1);
  let payload: string;
  try {
    payload = atob(p.replace(/-/g, "+").replace(/_/g, "/"));
  } catch {
    return false;
  }
  const expected = await hmac(secret(), payload);
  return timingSafeEqual(sig, expected);
}

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let r = 0;
  for (let i = 0; i < a.length; i++) r |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return r === 0;
}
