import { cn } from "@/lib/utils";
import { decodeUnicodeEscapes } from "@/lib/text";

export function StatsCard({
  label,
  value,
  hint,
  accent,
}: {
  label: string;
  value: string | number;
  hint: string;
  accent: "sky" | "emerald" | "amber" | "violet";
}) {
  const accentClasses = {
    sky: "from-sky-100 to-white text-sky-700",
    emerald: "from-emerald-100 to-white text-emerald-700",
    amber: "from-amber-100 to-white text-amber-700",
    violet: "from-violet-100 to-white text-violet-700",
  } as const;

  return (
    <div className="rounded-3xl border border-[var(--border-soft)] bg-white p-5 shadow-[var(--shadow-panel)]">
      <div className={cn("inline-flex rounded-2xl bg-gradient-to-br px-3 py-1 text-xs font-semibold", accentClasses[accent])}>
        {decodeUnicodeEscapes(label)}
      </div>
      <p className="mt-4 text-3xl font-semibold text-slate-900">{typeof value === "string" ? decodeUnicodeEscapes(value) : value}</p>
      <p className="mt-2 text-sm text-slate-500">{decodeUnicodeEscapes(hint)}</p>
    </div>
  );
}