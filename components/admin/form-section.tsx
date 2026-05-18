import { cn } from "@/lib/utils";
import { decodeUnicodeEscapes } from "@/lib/text";

export function FormSection({
  title,
  description,
  children,
  className,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("rounded-3xl border border-slate-200 bg-white p-5 shadow-sm", className)}>
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-slate-900">{decodeUnicodeEscapes(title)}</h3>
        <p className="mt-1 text-sm text-slate-500">{decodeUnicodeEscapes(description)}</p>
      </div>
      {children}
    </section>
  );
}