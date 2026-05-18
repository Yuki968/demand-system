"use client";

import { FORM_OPTIONS } from "@/constants/requirement";
import { decodeUnicodeEscapes } from "@/lib/text";
import { cn } from "@/lib/utils";
import type { RequirementQueryParams } from "@/types/requirement";

interface RequirementFilterBarProps {
  filters: RequirementQueryParams;
  ownerOptions: string[];
  onChange: (nextFilters: RequirementQueryParams) => void;
}

function selectClasses() {
  return "rounded-2xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 shadow-sm outline-none transition focus:border-sky-300 focus:ring-2 focus:ring-sky-100";
}

export function RequirementFilterBar({ filters, ownerOptions, onChange }: RequirementFilterBarProps) {
  return (
    <div className="grid gap-3 rounded-3xl border border-[var(--border-soft)] bg-white p-5 shadow-[var(--shadow-panel)] lg:grid-cols-[1.8fr_repeat(3,minmax(0,1fr))]">
      <label className="space-y-2">
        <span className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">{decodeUnicodeEscapes("\u5173\u952e\u8bcd\u68c0\u7d22")}</span>
        <input value={filters.keyword ?? ""} onChange={(event) => onChange({ ...filters, keyword: event.target.value })} placeholder={decodeUnicodeEscapes("\u641c\u7d22\u9700\u6c42\u540d\u79f0\u3001\u9879\u76ee\u3001\u5ba2\u6237\u3001\u63d0\u51fa\u4eba\u6216\u4efb\u4e00\u9636\u6bb5\u8d1f\u8d23\u4eba")} className={cn(selectClasses(), "w-full")} />
      </label>
      <label className="space-y-2">
        <span className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">{decodeUnicodeEscapes("\u5f53\u524d\u72b6\u6001")}</span>
        <select value={filters.status ?? ""} onChange={(event) => onChange({ ...filters, status: event.target.value as RequirementQueryParams["status"] })} className={cn(selectClasses(), "w-full")}>
          <option value="">{decodeUnicodeEscapes("\u5168\u90e8\u72b6\u6001")}</option>
          {FORM_OPTIONS.currentStatus.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
        </select>
      </label>
      <label className="space-y-2">
        <span className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">{decodeUnicodeEscapes("\u5f53\u524d\u8d1f\u8d23\u4eba")}</span>
        <select value={filters.owner ?? ""} onChange={(event) => onChange({ ...filters, owner: event.target.value })} className={cn(selectClasses(), "w-full")}>
          <option value="">{decodeUnicodeEscapes("\u5168\u90e8\u8d1f\u8d23\u4eba")}</option>
          {ownerOptions.map((owner) => <option key={owner} value={owner}>{decodeUnicodeEscapes(owner)}</option>)}
        </select>
      </label>
      <label className="space-y-2">
        <span className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">{decodeUnicodeEscapes("\u9700\u6c42\u7c7b\u578b")}</span>
        <select value={filters.type ?? ""} onChange={(event) => onChange({ ...filters, type: event.target.value as RequirementQueryParams["type"] })} className={cn(selectClasses(), "w-full")}>
          <option value="">{decodeUnicodeEscapes("\u5168\u90e8\u7c7b\u578b")}</option>
          {FORM_OPTIONS.requirementType.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
        </select>
      </label>
    </div>
  );
}