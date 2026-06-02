"use client";

import { useEffect, useMemo, useState } from "react";

import { RequirementFilterBar } from "@/components/requirement/filter-bar";
import { RequirementDetailPanel } from "@/components/requirement/detail-panel";
import { RequirementPreviewCard } from "@/components/requirement/requirement-preview-card";
import { filterRequirementList, getOwnerOptions } from "@/components/requirement/requirement-search";
import { requestJson } from "@/lib/api-client";
import { decodeUnicodeEscapes } from "@/lib/text";
import type { RequirementQueryParams, RequirementRecord } from "@/types/requirement";

export function RequirementDrawerDemoClient({
  initialRequirements,
}: {
  initialRequirements: RequirementRecord[];
}) {
  const [requirements, setRequirements] = useState(initialRequirements);
  const [selectedId, setSelectedId] = useState<number | undefined>();
  const [selectedDetail, setSelectedDetail] = useState<RequirementRecord | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [filters, setFilters] = useState<RequirementQueryParams>({ status: "", owner: "", type: "", keyword: "" });
  const [detailLoading, setDetailLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const filteredRequirements = useMemo(() => filterRequirementList(requirements, filters), [requirements, filters]);
  const ownerOptions = useMemo(() => getOwnerOptions(requirements), [requirements]);

  useEffect(() => {
    if (!filteredRequirements.length) {
      if (!drawerOpen) {
        setSelectedId(undefined);
        setSelectedDetail(null);
      }
      return;
    }

    if (!selectedId) {
      setSelectedId(filteredRequirements[0]?.id);
    }
  }, [drawerOpen, filteredRequirements, selectedId]);

  async function handleSelect(item: RequirementRecord) {
    setSelectedId(item.id);
    setSelectedDetail(item);
    setDrawerOpen(true);
    setDetailLoading(true);
    setMessage(null);

    try {
      const detail = await requestJson<RequirementRecord>(`/api/requirements/${item.id}`, {
        errorMessage: decodeUnicodeEscapes("\u9700\u6c42\u8be6\u60c5\u52a0\u8f7d\u5931\u8d25\uff0c\u8bf7\u7a0d\u540e\u91cd\u8bd5"),
      });
      setRequirements((current) => current.map((entry) => (entry.id === detail.id ? detail : entry)));
      setSelectedDetail(detail);
    } catch (loadError) {
      setMessage(loadError instanceof Error ? loadError.message : decodeUnicodeEscapes("\u9700\u6c42\u8be6\u60c5\u52a0\u8f7d\u5931\u8d25"));
    } finally {
      setDetailLoading(false);
    }
  }

  return (
    <div className="relative min-h-[720px] overflow-hidden rounded-[2rem] border border-[var(--border-soft)] bg-white shadow-[var(--shadow-panel)]">
      <div className="border-b border-slate-100 px-6 py-6 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">Drawer Web Demo</p>
            <h2 className="mt-2 text-2xl font-semibold text-slate-950">{decodeUnicodeEscapes("\u7f51\u9875\u62bd\u5c49\u5f0f\u9700\u6c42\u5217\u8868")}</h2>
          </div>
          <div className="text-right text-sm text-slate-500">
            <p>
              {filteredRequirements.length}
              {decodeUnicodeEscapes(" \u6761\u9700\u6c42")}
            </p>
            <p>{message ?? decodeUnicodeEscapes("\u8be6\u60c5\u4f1a\u4ece\u9875\u9762\u53f3\u4fa7\u6253\u5f00")}</p>
          </div>
        </div>
      </div>

      <div className="space-y-5 px-6 py-6 lg:px-8">
        <RequirementFilterBar filters={filters} ownerOptions={ownerOptions} onChange={setFilters} />

        <div className="grid gap-4 lg:grid-cols-2 2xl:grid-cols-3">
          {filteredRequirements.length ? (
            filteredRequirements.map((item) => (
              <button key={item.id} type="button" onClick={() => handleSelect(item)} className="block h-full w-full text-left">
                <RequirementPreviewCard item={item} selected={drawerOpen && item.id === selectedId} />
              </button>
            ))
          ) : (
            <div className="rounded-[1.75rem] border border-dashed border-slate-300 bg-slate-50 px-5 py-12 text-center text-sm text-slate-500 lg:col-span-2 2xl:col-span-3">
              {decodeUnicodeEscapes("\u5f53\u524d\u7b5b\u9009\u6761\u4ef6\u4e0b\u6ca1\u6709\u5339\u914d\u7684\u9700\u6c42\u3002")}
            </div>
          )}
        </div>
      </div>

      <div
        className={`fixed inset-0 z-50 transition ${drawerOpen ? "pointer-events-auto" : "pointer-events-none"}`}
        aria-hidden={!drawerOpen}
      >
        <button
          type="button"
          aria-label={decodeUnicodeEscapes("\u5173\u95ed\u8be6\u60c5")}
          onClick={() => setDrawerOpen(false)}
          className={`absolute inset-0 bg-slate-950/35 transition ${drawerOpen ? "opacity-100" : "opacity-0"}`}
        />
        <div
          className={`absolute inset-y-0 right-0 flex w-full max-w-[880px] flex-col border-l border-slate-200 bg-white shadow-[-40px_0_120px_-64px_rgba(15,23,42,0.72)] transition duration-300 ${drawerOpen ? "translate-x-0" : "translate-x-full"}`}
        >
          <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.26em] text-slate-400">Detail Drawer</p>
              <h3 className="mt-1 text-xl font-semibold text-slate-950">{decodeUnicodeEscapes("\u9700\u6c42\u8be6\u60c5")}</h3>
            </div>
            <button
              type="button"
              onClick={() => setDrawerOpen(false)}
              className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-500 transition hover:border-slate-300 hover:text-slate-900"
            >
              {decodeUnicodeEscapes("\u5173\u95ed")}
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-6">
            <RequirementDetailPanel item={selectedDetail} loading={detailLoading} />
          </div>
        </div>
      </div>
    </div>
  );
}
