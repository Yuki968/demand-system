import {
  PriorityBadge,
  RequirementBelongBadge,
  RequirementTypeBadge,
  StatusBadge,
} from "@/components/requirement/badges";
import { StageTimeline } from "@/components/requirement/stage-timeline";
import { decodeUnicodeEscapes, displayText } from "@/lib/text";
import type { RequirementRecord } from "@/types/requirement";

export function RequirementDetailPanel({ item, loading }: { item: RequirementRecord | null; loading?: boolean }) {
  if (!item) {
    return <div className="rounded-3xl border border-dashed border-slate-300 bg-white/80 p-8 text-center text-sm text-slate-500 shadow-[var(--shadow-panel)]">{decodeUnicodeEscapes("\u4ece\u5de6\u4fa7\u9009\u62e9\u4e00\u6761\u9700\u6c42\u540e\uff0c\u8fd9\u91cc\u4f1a\u5c55\u793a\u4e3b\u4fe1\u606f\u3001\u5f53\u524d\u8fdb\u5c55\u548c\u9636\u6bb5\u6d41\u8f6c\u8be6\u60c5\u3002")}</div>;
  }

  const demandStage = item.stages.find((stage) => stage.stageName === "DEMAND_CREATED");

  return (
    <div className="space-y-5 rounded-3xl border border-[var(--border-soft)] bg-white p-6 shadow-[var(--shadow-panel)]">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">Requirement #{item.requirementNo}</p>
          <h3 className="mt-2 text-2xl font-semibold text-slate-900">{displayText(item.requirementName)}</h3>
          <p className="mt-2 text-sm text-slate-500">{decodeUnicodeEscapes("\u63d0\u51fa\u4e8e ")}{displayText(demandStage?.startTime ?? item.createdAt)}{decodeUnicodeEscapes("\uff0c\u63d0\u51fa\u4eba ")}{displayText(demandStage?.ownerName ?? item.createdBy)}{loading ? ` ${decodeUnicodeEscapes("\u00b7 \u6b63\u5728\u5237\u65b0\u8be6\u60c5")}` : ""}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <StatusBadge className="whitespace-nowrap" status={item.currentStatus} />
          <PriorityBadge className="whitespace-nowrap" priority={item.priority} />
          <RequirementTypeBadge className="whitespace-nowrap" requirementType={item.requirementType} />
          <RequirementBelongBadge className="whitespace-nowrap" requirementBelong={item.requirementBelong} />
        </div>
      </div>

      <div className="grid gap-4 rounded-3xl bg-slate-50 p-4 text-sm text-slate-600 lg:grid-cols-3">
        <InfoLine label={decodeUnicodeEscapes("\u5f53\u524d\u72b6\u6001")} value={<StatusBadge className="whitespace-nowrap" status={item.currentStatus} />} />
        <InfoLine label={decodeUnicodeEscapes("\u4f18\u5148\u7ea7")} value={<PriorityBadge className="whitespace-nowrap" priority={item.priority} />} />
        <InfoLine label={decodeUnicodeEscapes("\u5f53\u524d\u8d1f\u8d23\u4eba")} value={displayText(item.currentOwner)} />
        <InfoLine label={decodeUnicodeEscapes("\u9700\u6c42\u7c7b\u578b")} value={<RequirementTypeBadge className="whitespace-nowrap" requirementType={item.requirementType} />} />
        <InfoLine label={decodeUnicodeEscapes("\u9700\u6c42\u5f52\u5c5e")} value={<RequirementBelongBadge className="whitespace-nowrap" requirementBelong={item.requirementBelong} />} />
        <InfoLine label={decodeUnicodeEscapes("\u603b\u65f6\u957f")} value={item.totalDurationValue ? `${item.totalDurationValue} ${decodeUnicodeEscapes("\u5929")}` : "-"} />
        <InfoLine label={decodeUnicodeEscapes("\u5173\u8054\u9879\u76ee")} value={displayText(item.relatedProject)} />
        <InfoLine label={decodeUnicodeEscapes("\u5173\u8054\u5ba2\u6237")} value={displayText(item.relatedCustomer)} />
      </div>

      <div>
        <div className="mb-4 flex items-center justify-between gap-4">
          <div>
            <h4 className="text-lg font-semibold text-slate-900">{decodeUnicodeEscapes("\u9636\u6bb5\u63a8\u8fdb\u4e0e\u5173\u952e\u4fe1\u606f")}</h4>
            <p className="mt-1 text-sm text-slate-500">{decodeUnicodeEscapes("\u4ec5\u5c55\u793a\u5df2\u8fdb\u5165\u7684\u9636\u6bb5")}</p>
          </div>
          <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Stage Flow</p>
        </div>
        <StageTimeline item={item} />
      </div>
    </div>
  );
}

function InfoLine({ label, value }: { label: string; value: React.ReactNode }) {
  return <p className="flex flex-wrap items-center gap-2"><span className="font-medium text-slate-500">{label}{decodeUnicodeEscapes("\uff1a")}</span><span className="text-slate-800">{typeof value === "string" ? decodeUnicodeEscapes(value) : value}</span></p>;
}
