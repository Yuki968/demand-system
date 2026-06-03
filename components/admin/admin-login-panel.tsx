"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { requestJson } from "@/lib/api-client";
import { decodeUnicodeEscapes } from "@/lib/text";

export function AdminLoginPanel({
  configured,
  errorMessage,
}: {
  configured: boolean;
  errorMessage?: string | null;
}) {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<string | null>(errorMessage ?? null);
  const [loggingIn, setLoggingIn] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!configured) {
      return;
    }

    setLoggingIn(true);
    setMessage(null);

    try {
      await requestJson<{ authenticated: boolean }>("/api/admin/session", {
        method: "POST",
        body: JSON.stringify({ password }),
        errorMessage: decodeUnicodeEscapes("后台登录失败，请稍后重试"),
      });
      setPassword("");
      router.refresh();
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : decodeUnicodeEscapes("后台登录失败，请稍后重试"),
      );
    } finally {
      setLoggingIn(false);
    }
  }

  return (
    <div className="mx-auto flex min-h-[calc(100vh-6rem)] w-full max-w-3xl items-center px-6 py-10 lg:px-10">
      <section className="w-full rounded-[2rem] border border-[var(--border-soft)] bg-white p-8 shadow-[var(--shadow-panel)]">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-sky-600">
          Admin Access
        </p>
        <h1 className="mt-4 text-3xl font-semibold text-slate-900">
          {decodeUnicodeEscapes("后台管理访问验证")}
        </h1>
        <p className="mt-3 text-sm leading-7 text-slate-500">
          {decodeUnicodeEscapes(
            "后台维护页面需要管理员密码。前台看板和公开读取接口保持不受影响。",
          )}
        </p>

        {message ? (
          <div
            className={`mt-6 rounded-2xl px-4 py-3 text-sm ${
              configured
                ? "border border-rose-200 bg-rose-50 text-rose-700"
                : "border border-amber-200 bg-amber-50 text-amber-800"
            }`}
          >
            {decodeUnicodeEscapes(message)}
          </div>
        ) : null}

        {configured ? (
          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label
                htmlFor="admin-password"
                className="block text-xs font-semibold uppercase tracking-[0.24em] text-slate-400"
              >
                {decodeUnicodeEscapes("后台密码")}
              </label>
              <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm transition focus-within:border-sky-300 focus-within:ring-2 focus-within:ring-sky-100">
                <input
                  id="admin-password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder={decodeUnicodeEscapes("输入后台访问密码")}
                  className="min-w-0 flex-1 bg-transparent text-sm text-slate-700 outline-none"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((current) => !current)}
                  className="shrink-0 text-xs font-semibold text-slate-500 transition hover:text-sky-700"
                >
                  {decodeUnicodeEscapes(showPassword ? "隐藏密码" : "显示密码")}
                </button>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                type="submit"
                disabled={loggingIn}
                className="rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {decodeUnicodeEscapes(loggingIn ? "验证中..." : "进入后台")}
              </button>
              <Link
                href="/board"
                className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-sky-200 hover:text-sky-700"
              >
                {decodeUnicodeEscapes("返回前台看板")}
              </Link>
            </div>
          </form>
        ) : (
          <div className="mt-6">
            <Link
              href="/board"
              className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-sky-200 hover:text-sky-700"
            >
              {decodeUnicodeEscapes("返回前台看板")}
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}
