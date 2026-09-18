import Link from "next/link";
import { notFound } from "next/navigation";

import { RequirementDetailPanel } from "@/components/requirement/detail-panel";
import {
  getStaticRequirementById,
  getStaticRequirementParams,
} from "@/lib/static-requirements";
import { decodeUnicodeEscapes, displayText } from "@/lib/text";

export const dynamicParams = false;

export function generateStaticParams() {
  return getStaticRequirementParams();
}

export default async function BoardRequirementDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const requirementId = Number(id);

  if (!Number.isInteger(requirementId)) {
    notFound();
  }

  const item = getStaticRequirementById(requirementId);

  if (!item) {
    notFound();
  }

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
            <Link
              href="/board"
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
