import type { Metadata } from "next";
import { LoginForm } from "./LoginForm";

export const metadata: Metadata = {
  title: "登录",
  robots: { index: false, follow: false },
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ from?: string }>;
}) {
  const { from } = await searchParams;
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-sm flex-col justify-center px-5">
      <div className="rounded-xl border border-line bg-white p-7">
        <h1 className="text-xl font-bold text-ink">运营后台</h1>
        <p className="mb-6 mt-1 text-sm text-muted">
          仅本人可见，请登录。
        </p>
        <LoginForm from={from || "/admin"} />
      </div>
    </div>
  );
}
