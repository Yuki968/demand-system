import type { Metadata } from "next";

import { decodeUnicodeEscapes } from "@/lib/text";

import "./globals.css";

export const metadata: Metadata = {
  title: decodeUnicodeEscapes("\u9700\u6c42\u53ef\u89c6\u5316\u7cfb\u7edf"),
  description: decodeUnicodeEscapes("\u5355\u7ba1\u7406\u5458\u7ef4\u62a4\u3001\u591a\u4eba\u516c\u5f00\u67e5\u770b\u7684\u9700\u6c42\u53ef\u89c6\u5316\u7cfb\u7edf"),
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN" className="h-full">
      <body className="min-h-screen bg-[var(--bg-canvas)] font-sans text-slate-900 antialiased">
        <div className="relative min-h-screen overflow-hidden">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-[radial-gradient(circle_at_top_left,_rgba(14,165,233,0.18),_transparent_42%),radial-gradient(circle_at_top_right,_rgba(16,185,129,0.18),_transparent_38%)]" />
          <header className="relative z-10 border-b border-white/70 bg-white/80 backdrop-blur">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-10">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-sky-600">Demand Visual Board</p>
                <h1 className="text-lg font-semibold text-slate-900">{decodeUnicodeEscapes("\u9700\u6c42\u53ef\u89c6\u5316\u7cfb\u7edf")}</h1>
              </div>
              <p className="text-sm text-slate-500">{decodeUnicodeEscapes("\u5185\u90e8\u534f\u4f5c\u9700\u6c42\u67e5\u8be2\u4e0e\u7ef4\u62a4\u7cfb\u7edf")}</p>
            </div>
          </header>
          <main className="relative z-10">{children}</main>
        </div>
      </body>
    </html>
  );
}
