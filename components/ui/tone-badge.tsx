import { cn } from "@/lib/utils";

const toneClasses = {
  slate: "border-slate-200 bg-slate-100 text-slate-700",
  sky: "border-sky-200 bg-sky-50 text-sky-700",
  amber: "border-amber-200 bg-amber-50 text-amber-700",
  violet: "border-violet-200 bg-violet-50 text-violet-700",
  emerald: "border-emerald-200 bg-emerald-50 text-emerald-700",
  zinc: "border-zinc-200 bg-zinc-100 text-zinc-700",
  rose: "border-rose-200 bg-rose-50 text-rose-700",
  "status-created": "border-[#BFDBFE] bg-[#EFF6FF] text-[#1E3A8A]",
  "status-intake": "border-[#99F6E4] bg-[#F0FDFA] text-[#0D9488]",
  "status-design": "border-[#DDD6FE] bg-[#F5F3FF] text-[#6D28D9]",
  "status-delivery": "border-[#FED7AA] bg-[#FFF7ED] text-[#9A3412]",
  "status-feedback": "border-[#A7F3D0] bg-[#ECFDF5] text-[#064E3B]",
  "status-closed": "border-[#D4D4D8] bg-[#FAFAFA] text-[#52525B]",
  "priority-very-high": "border-[#FCA5A5] bg-[#7F1D1D] text-[#FEF2F2]",
  "priority-high": "border-[#FECACA] bg-[#FEF2F2] text-[#DC2626]",
  "priority-medium": "border-[#FDE68A] bg-[#FFFBEB] text-[#D97706]",
  "type-planning": "border-[#FDE68A] bg-[#FFFBEB] text-[#B45309]",
  "type-iteration": "border-[#C7D2FE] bg-[#EEF2FF] text-[#3730A3]",
  "type-customization": "border-[#FBCFE8] bg-[#FDF2F8] text-[#BE185D]",
  "type-operation": "border-[#DDD6FE] bg-[#F5F3FF] text-[#6D28D9]",
  "belong-two": "border-[#BAE6FD] bg-[#F0F9FF] text-[#0284C7]",
  "belong-three": "border-[#99F6E4] bg-[#F0FDFA] text-[#0D9488]",
  "belong-pot": "border-[#FDE68A] bg-[#FEFCE8] text-[#92400E]",
  "stage-started": "border-[#d5dee7] bg-[#eff4f8] text-[#1f2937]",
  "stage-pending": "border-[#dde2e8] bg-[#f6f8fa] text-[#1f2937]",
} as const;

export function ToneBadge({
  children,
  tone,
  className,
}: {
  children: React.ReactNode;
  tone: keyof typeof toneClasses;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold",
        toneClasses[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}