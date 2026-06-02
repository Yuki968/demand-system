import Link from "next/link";
import { notFound } from "next/navigation";

import { RequirementDetailPanel } from "@/components/requirement/detail-panel";
import { decodeUnicodeEscapes, displayText } from "@/lib/text";
import { getRequirementById } from "@/repositories/requirementRepository";

export default async function BoardRequirementDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ from?: string }>;
}) {
  const { id } = await params;
  const { from } = await searchParams;
  const requirementId = Number(id);

  if (!Number.isInteger(requirementId)) {
    notFound();
  }

  const item = await getRequirementById(requirementId);

  if (!item) {
    notFound();
  }

  const backHref = from === "admin" ? "/board?from=admin" : "/board";

  return (
    <div className="mx-auto flex w-full max-w-[1680px] flex-col gap-6 px-6 py-8 lg:px-10 xl:px-12 2xl:px-14">
      <section className="rounded-[2rem] border border-[var(--border-soft)] bg-white p-6 shadow-[var(--shadow-panel)] lg:p-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">
              Requirement #{item.requirementNo}
            </p>
            <h2 className="mt-2 text-3xl font-semibold leading-tight text-slate-950">
              {displayText(item.requirementName)}
            </h2>
          </div>
          <div className="flex flex-wrap gap-3">
            {from === "admin" ? (
              <Link
                href="/admin/requirements"
                className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-500 transition hover:border-sky-200 hover:text-sky-700"
              >
                {decodeUnicodeEscapes("\u8fd4\u56de\u540e\u53f0")}
              </Link>
            ) : null}
            <Link
              href={backHref}
              className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-500 transition hover:border-slate-300 hover:text-slate-900"
            >
              {decodeUnicodeEscapes("\u8fd4\u56de\u5217\u8868")}
            </Link>
          </div>
        </div>
      </section>

      <RequirementDetailPanel item={item} />
    </div>
  );
}
