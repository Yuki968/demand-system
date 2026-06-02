import Link from "next/link";

import { decodeUnicodeEscapes } from "@/lib/text";
import { cn } from "@/lib/utils";

const DEMO_MODES = [
  {
    href: "/board/demo/drawer",
    key: "drawer",
    label: decodeUnicodeEscapes("\u62bd\u5c49\u5f0f"),
  },
  {
    href: "/board/demo/detail-page",
    key: "detail-page",
    label: decodeUnicodeEscapes("\u65b0\u9875\u9762\u5f0f"),
  },
] as const;

export function RequirementDemoLayout({
  activeMode,
  title,
  description,
  children,
}: {
  activeMode: (typeof DEMO_MODES)[number]["key"];
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#f8fafc_0%,#eef6fb_42%,#f8fafc_100%)]">
      <div className="mx-auto flex w-full max-w-[1680px] flex-col gap-7 px-6 py-8 lg:px-10 xl:px-12">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-3">
            <Link
              href="/board"
              className="inline-flex rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 shadow-sm transition hover:border-sky-200 hover:text-sky-700"
            >
              {decodeUnicodeEscapes("\u8fd4\u56de\u5f53\u524d\u770b\u677f")}
            </Link>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-sky-700">Prototype Lab</p>
              <h1 className="mt-3 text-4xl font-semibold text-slate-950 lg:text-5xl">
                {title}
              </h1>
              <p className="mt-3 max-w-[68ch] text-sm leading-7 text-slate-600 sm:text-base">
                {description}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 rounded-full border border-slate-200 bg-white p-2 shadow-sm">
            {DEMO_MODES.map((mode) => (
              <Link
                key={mode.key}
                href={mode.href}
                className={cn(
                  "rounded-full px-4 py-2 text-sm font-medium transition",
                  activeMode === mode.key
                    ? "bg-slate-950 text-white shadow-[0_14px_28px_-18px_rgba(15,23,42,0.8)]"
                    : "text-slate-500 hover:bg-slate-100 hover:text-slate-900",
                )}
              >
                {mode.label}
              </Link>
            ))}
          </div>
        </div>

        {children}
      </div>
    </div>
  );
}

export function RequirementDemoNotes({
  title,
  items,
}: {
  title: string;
  items: string[];
}) {
  return (
    <section className="rounded-[2rem] border border-[var(--border-soft)] bg-white p-6 shadow-[var(--shadow-panel)]">
      <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">{title}</p>
      <div className="mt-4 grid gap-3 md:grid-cols-3">
        {items.map((item) => (
          <div key={item} className="rounded-[1.5rem] border border-slate-100 bg-slate-50/80 px-4 py-4 text-sm leading-6 text-slate-600">
            {item}
          </div>
        ))}
      </div>
    </section>
  );
}
