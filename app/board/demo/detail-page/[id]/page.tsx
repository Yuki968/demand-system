import Link from "next/link";
import { notFound } from "next/navigation";

import { RequirementDetailPanel } from "@/components/requirement/detail-panel";
import { RequirementDemoLayout } from "@/components/requirement/demo-shell";
import { decodeUnicodeEscapes, displayText } from "@/lib/text";
import { getRequirementById } from "@/repositories/requirementRepository";

export default async function BoardDetailPageDemoPage(props: PageProps<"/board/demo/detail-page/[id]">) {
  const { id } = await props.params;
  const requirementId = Number(id);

  if (Number.isNaN(requirementId)) {
    notFound();
  }

  const item = await getRequirementById(requirementId);

  if (!item) {
    notFound();
  }

  return (
    <RequirementDemoLayout
      activeMode="detail-page"
      title={decodeUnicodeEscapes("\u65b0\u9875\u9762\u5f0f\u9700\u6c42\u8be6\u60c5")}
      description={decodeUnicodeEscapes("\u8fd9\u662f\u7f51\u9875\u7248\u7684\u72ec\u7acb\u8be6\u60c5\u9875\u6548\u679c\uff1a\u4ece\u5217\u8868\u8fdb\u5165\u540e\uff0c\u9875\u9762\u53ea\u805a\u7126\u4e00\u6761\u9700\u6c42\u7684\u4e3b\u4fe1\u606f\u3001\u5f53\u524d\u72b6\u6001\u548c\u9636\u6bb5\u65f6\u95f4\u7ebf\u3002")}
    >
      <section className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="rounded-[2rem] border border-[var(--border-soft)] bg-white p-6 shadow-[var(--shadow-panel)]">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-5">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.26em] text-slate-400">
                Requirement #{item.requirementNo}
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-slate-950">
                {displayText(item.requirementName)}
              </h2>
            </div>
            <Link
              href="/board/demo/detail-page"
              className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-500 transition hover:border-slate-300 hover:text-slate-900"
            >
              {decodeUnicodeEscapes("\u8fd4\u56de\u5217\u8868")}
            </Link>
          </div>
          <RequirementDetailPanel item={item} />
        </div>

        <div className="rounded-[2rem] border border-[var(--border-soft)] bg-white p-6 shadow-[var(--shadow-panel)]">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">Page Notes</p>
          <div className="mt-4 space-y-3 text-sm leading-7 text-slate-600">
            <p>{decodeUnicodeEscapes("\u9996\u9875\u4e0d\u518d\u540c\u65f6\u5448\u73b0\u300c\u5927\u91cf\u5217\u8868 + \u5b8c\u6574\u8be6\u60c5\u300d\uff0c\u4f7f\u7528\u8005\u5148\u5b8c\u6210\u300c\u9009\u9879\u76ee\u300d\u8fd9\u4e2a\u4efb\u52a1\u3002")}</p>
            <p>{decodeUnicodeEscapes("\u8fdb\u5165\u8be6\u60c5\u540e\uff0c\u6240\u6709\u9636\u6bb5\u65f6\u95f4\u7ebf\u4e0e\u5b57\u6bb5\u8bf4\u660e\u90fd\u6709\u66f4\u5145\u88d5\u7684\u89c6\u89c9\u7a7a\u95f4\u3002")}</p>
            <p>{decodeUnicodeEscapes("\u5982\u679c\u4f60\u540e\u9762\u60f3\u628a\u5b83\u7528\u4e8e\u6b63\u5f0f\u7248\uff0c\u8fd9\u4e2a\u65b9\u5411\u4e5f\u6700\u5bb9\u6613\u62d3\u5c55\u6210\u300c\u53ef\u5206\u4eab\u8be6\u60c5\u94fe\u63a5\u300d\u3002")}</p>
          </div>
        </div>
      </section>
    </RequirementDemoLayout>
  );
}
