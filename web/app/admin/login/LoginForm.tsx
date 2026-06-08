"use client";

import { useActionState } from "react";
import { login, type LoginState } from "../actions";

const initial: LoginState = { error: null };

export function LoginForm({ from }: { from: string }) {
  const [state, action, pending] = useActionState(login, initial);

  return (
    <form action={action} className="flex flex-col gap-4">
      <input type="hidden" name="from" value={from} />
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-muted" htmlFor="user">
          用户名
        </label>
        <input
          id="user"
          name="user"
          autoComplete="username"
          autoFocus
          required
          className="rounded-lg border border-line bg-white px-3.5 py-2.5 text-sm outline-none focus:border-ink"
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-muted" htmlFor="pass">
          密码
        </label>
        <input
          id="pass"
          name="pass"
          type="password"
          autoComplete="current-password"
          required
          className="rounded-lg border border-line bg-white px-3.5 py-2.5 text-sm outline-none focus:border-ink"
        />
      </div>
      {state.error && (
        <p className="text-sm text-accent">{state.error}</p>
      )}
      <button
        type="submit"
        disabled={pending}
        className="mt-1 rounded-lg bg-ink px-4 py-2.5 text-sm font-medium text-paper transition-opacity hover:opacity-90 disabled:opacity-50"
      >
        {pending ? "登录中…" : "登录"}
      </button>
    </form>
  );
}
