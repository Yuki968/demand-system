"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { RequirementFilterBar } from "@/components/requirement/filter-bar";
import { RequirementPreviewCard } from "@/components/requirement/requirement-preview-card";
import { filterRequirementList, getOwnerOptions } from "@/components/requirement/requirement-search";
import { decodeUnicodeEscapes } from "@/lib/text";
import type { RequirementQueryParams, RequirementRecord } from "@/types/requirement";

export function RequirementDetailPageDemoList({
  initialRequirements,
}: {
  initialRequirements: RequirementRecord[];
}) {
  const [filters, setFilters] = useState<RequirementQueryParams>({ status: "", owner: "", type: "", keyword: "" });

  const filteredRequirements = useMemo(
    () => filterRequirementList(initialRequirements, filters),
    [filters, initialRequirements],
  );
  const ownerOptions = useMemo(() => getOwnerOptions(initialRequirements), [initialRequirements]);

  return (
    <div className="rounded-[2rem] border border-[var(--border-soft)] bg-white shadow-[var(--shadow-panel)]">
      <div className="border-b border-slate-100 px-6 py-6 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">Page Web Demo</p>
            <h2 className="mt-2 text-2xl font-semibold text-slate-950">{decodeUnicodeEscapes("\u7f51\u9875\u65b0\u9875\u9762\u5f0f\u9700\u6c42\u5217\u8868")}</h2>
          </div>
          <p className="text-sm text-slate-500">
            {filteredRequirements.length}
            {decodeUnicodeEscapes(" \u6761\u9700\u6c42")}
          </p>
        </div>
      </div>

      <div className="space-y-5 px-6 py-6 lg:px-8">
        <RequirementFilterBar filters={filters} ownerOptions={ownerOptions} onChange={setFilters} />

        <div className="grid gap-4 lg:grid-cols-2 2xl:grid-cols-3">
          {filteredRequirements.length ? (
            filteredRequirements.map((item) => (
              <Link key={item.id} href={`/board/demo/detail-page/${item.id}`} className="block h-full">
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
    </div>
  );
}
