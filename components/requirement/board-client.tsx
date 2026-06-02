"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { RequirementFilterBar } from "@/components/requirement/filter-bar";
import { RequirementPreviewCard } from "@/components/requirement/requirement-preview-card";
import { filterRequirementList, getOwnerOptions } from "@/components/requirement/requirement-search";
import { StatsCard } from "@/components/requirement/stats-card";
import { decodeUnicodeEscapes } from "@/lib/text";
import type { RequirementQueryParams, RequirementRecord } from "@/types/requirement";

export function BoardClient({ initialRequirements, showBackToAdmin = false }: { initialRequirements: RequirementRecord[]; showBackToAdmin?: boolean }) {
  const [filters, setFilters] = useState<RequirementQueryParams>({ status: "", owner: "", type: "", keyword: "" });

  const filteredRequirements = useMemo(() => filterRequirementList(initialRequirements, filters), [initialRequirements, filters]);
  const ownerOptions = useMemo(() => getOwnerOptions(initialRequirements), [initialRequirements]);

  const stats = useMemo(() => {
    const finished = filteredRequirements.filter((item) => item.isFinished).length;
    const activeOwners = new Set(filteredRequirements.map((item) => item.currentOwner).filter(Boolean)).size;
    const highPriority = filteredRequirements.filter((item) => item.priority === "VERY_HIGH" || item.priority === "HIGH").length;
    const longest = filteredRequirements.reduce((max, item) => Math.max(max, item.totalDurationValue ?? 0), 0);
    return { finished, activeOwners, highPriority, longest };
  }, [filteredRequirements]);

  function getDetailHref(item: RequirementRecord) {
    return showBackToAdmin ? `/board/${item.id}?from=admin` : `/board/${item.id}`;
  }

  return (
    <div className="mx-auto flex w-full max-w-[1680px] flex-col gap-6 px-6 py-8 lg:px-10 xl:px-12 2xl:px-14">
      <section className="grid gap-6 xl:grid-cols-[minmax(0,2.35fr)_repeat(3,minmax(0,1fr))] 2xl:grid-cols-[minmax(0,2.55fr)_repeat(3,minmax(0,1fr))]">
        <div className="overflow-hidden rounded-[2rem] border border-[var(--border-soft)] bg-white p-7 shadow-[var(--shadow-panel)] xl:p-8">
          <div className="flex items-start justify-between gap-4 xl:gap-5">
            <div className="flex min-w-0 max-w-[56rem] flex-1 flex-col items-start gap-3 xl:gap-4">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-sky-600">Product Board</p>
              <h2 className="max-w-[24ch] text-[clamp(2rem,2.2vw,2.6rem)] font-semibold leading-[1.16] tracking-tight text-slate-900 xl:whitespace-nowrap">{decodeUnicodeEscapes("\u4ea7\u54c1\u9700\u6c42\u7b5b\u67e5\u4e0e\u8fdb\u5ea6\u67e5\u770b\u770b\u677f")}</h2>
              <p className="max-w-[58rem] text-sm leading-7 text-slate-500 xl:text-[0.95rem]">{decodeUnicodeEscapes("\u9762\u5411\u4ea7\u54c1\u603b\u76d1\u3001\u4ea7\u54c1\u7ecf\u7406\u3001\u8fd0\u8425\u548c\u9879\u76ee\u534f\u540c\u4eba\u5458\uff0c\u96c6\u4e2d\u67e5\u770b\u9700\u6c42\u5f53\u524d\u72b6\u6001\u3001\u8d1f\u8d23\u4eba\u548c\u9636\u6bb5\u8fdb\u5c55\u3002")}</p>
            </div>
            {showBackToAdmin ? (
              <Link href="/admin/requirements" className="shrink-0 rounded-full border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-500 transition hover:border-sky-200 hover:text-sky-700">
                {decodeUnicodeEscapes("\u8fd4\u56de\u540e\u53f0")}
              </Link>
            ) : null}
          </div>
        </div>
        <StatsCard label={"\u5df2\u7ed3\u675f\u9700\u6c42"} value={stats.finished} hint={"\u5f53\u524d\u7b5b\u9009\u7ed3\u679c\u4e2d\u5df2\u5173\u95ed\u7684\u9700\u6c42\u6570\u91cf"} accent="emerald" />
        <StatsCard label={"\u9ad8\u4f18\u5148\u7ea7\u9700\u6c42"} value={stats.highPriority} hint={"\u5f53\u524d\u7b5b\u9009\u7ed3\u679c\u4e2d\u4f18\u5148\u7ea7\u4e3a\u9ad8\u7684\u9700\u6c42\u6570\u91cf"} accent="amber" />
        <StatsCard label={"\u6700\u957f\u603b\u65f6\u957f"} value={`${stats.longest} \u5929`} hint={"\u5f53\u524d\u7b5b\u9009\u7ed3\u679c\u4e2d\u7684\u6700\u957f\u603b\u65f6\u957f"} accent="sky" />
      </section>

      <section className="rounded-[2rem] border border-[var(--border-soft)] bg-white shadow-[var(--shadow-panel)]">
        <div className="border-b border-slate-100 px-6 py-6 lg:px-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">Requirement List</p>
              <h3 className="mt-2 text-2xl font-semibold text-slate-900">{decodeUnicodeEscapes("\u9700\u6c42\u5217\u8868")}</h3>
            </div>
            <div className="text-right text-sm text-slate-500">
              <p>{filteredRequirements.length}{decodeUnicodeEscapes(" \u6761\u9700\u6c42")}</p>
              <p>{decodeUnicodeEscapes("\u6d3b\u8dc3\u8d1f\u8d23\u4eba")} {stats.activeOwners} {decodeUnicodeEscapes("\u4eba")}</p>
            </div>
          </div>
        </div>

        <div className="space-y-5 px-6 py-6 lg:px-8">
          <RequirementFilterBar filters={filters} ownerOptions={ownerOptions} onChange={setFilters} />

          <div className="grid gap-4 lg:grid-cols-2 2xl:grid-cols-3">
            {filteredRequirements.length ? (
              filteredRequirements.map((item) => (
                <Link key={item.id} href={getDetailHref(item)} className="block h-full">
                  <RequirementPreviewCard item={item} />
                </Link>
              ))
            ) : (
              <div className="rounded-[1.75rem] border border-dashed border-slate-300 bg-slate-50 px-5 py-12 text-center text-sm text-slate-500 lg:col-span-2 2xl:col-span-3">
                {decodeUnicodeEscapes("\u5f53\u524d\u7b5b\u9009\u6761\u4ef6\u4e0b\u6ca1\u6709\u5339\u914d\u7684\u9700\u6c42\u3002")}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
