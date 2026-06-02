import {
  PriorityBadge,
  RequirementBelongBadge,
  RequirementTypeBadge,
  StatusBadge,
} from "@/components/requirement/badges";
import { decodeUnicodeEscapes, displayText } from "@/lib/text";
import { cn } from "@/lib/utils";
import type { RequirementRecord } from "@/types/requirement";

export function RequirementPreviewCard({
  item,
  selected,
  className,
}: {
  item: RequirementRecord;
  selected?: boolean;
  className?: string;
}) {
  const demandStage = item.stages.find((stage) => stage.stageName === "DEMAND_CREATED");

  return (
    <article
      className={cn(
        "h-full rounded-[1.75rem] border px-5 py-5 text-left transition",
        selected
          ? "border-sky-200 bg-sky-50 shadow-[0_18px_40px_-28px_rgba(14,165,233,0.55)]"
          : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
            Requirement #{item.requirementNo}
          </p>
          <h3 className="mt-2 line-clamp-2 text-lg font-semibold leading-6 text-slate-900">
            {displayText(item.requirementName)}
          </h3>
        </div>
        <PriorityBadge className="shrink-0 whitespace-nowrap" priority={item.priority} />
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <StatusBadge className="whitespace-nowrap" status={item.currentStatus} />
        <RequirementTypeBadge className="whitespace-nowrap" requirementType={item.requirementType} />
        <RequirementBelongBadge className="whitespace-nowrap" requirementBelong={item.requirementBelong} />
      </div>

      <div className="mt-5 grid gap-3 text-sm text-slate-600 sm:grid-cols-2">
        <p className="truncate">
          {decodeUnicodeEscapes("\u63d0\u51fa\u4eba\uff1a")}
          {displayText(demandStage?.ownerName ?? item.createdBy)}
        </p>
        <p className="truncate">
          {decodeUnicodeEscapes("\u5f53\u524d\u8d1f\u8d23\u4eba\uff1a")}
          {displayText(item.currentOwner, "-")}
        </p>
        <p className="truncate">
          {decodeUnicodeEscapes("\u9879\u76ee\uff1a")}
          {displayText(item.relatedProject, decodeUnicodeEscapes("\u672a\u586b\u5199\u9879\u76ee"))}
        </p>
        <p className="truncate">
          {decodeUnicodeEscapes("\u5ba2\u6237\uff1a")}
          {displayText(item.relatedCustomer, decodeUnicodeEscapes("\u672a\u586b\u5199\u5ba2\u6237"))}
        </p>
      </div>

      <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4 text-xs text-slate-500">
        <span>
          {decodeUnicodeEscapes("\u63d0\u51fa\u65e5\u671f\uff1a")}
          {displayText(demandStage?.startTime ?? item.createdAt)}
        </span>
        <span className="font-semibold text-slate-700">
          {decodeUnicodeEscapes("\u603b\u65f6\u957f\uff1a")}
          {item.totalDurationValue ? `${item.totalDurationValue} ${decodeUnicodeEscapes("\u5929")}` : "-"}
        </span>
      </div>
    </article>
  );
}
