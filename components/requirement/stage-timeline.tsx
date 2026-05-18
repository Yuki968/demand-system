import {
  FEEDBACK_STATUS_LABELS,
  YES_NO_LABELS,
} from "@/constants/requirement";
import {
  getStageProgressOrder,
  getVisibleStageProgressRecords,
  mapStatusToStageProgress,
  STAGE_PROGRESS_LABELS,
  STAGE_PROGRESS_SEQUENCE,
} from "@/lib/requirement-stage-progress";
import { decodeUnicodeEscapes, displayText } from "@/lib/text";
import { cn } from "@/lib/utils";
import type { RequirementRecord, RequirementStageRecord, StageNameKey } from "@/types/requirement";

const TEXT = {
  completed: "\u5df2\u5b8c\u6210",
  current: "\u5f85\u5b8c\u6210",
  topPending: "\u672a\u542f\u52a8",
  pending: "\u672a\u5230\u8fbe",
  noStart: "\u5c1a\u672a\u586b\u5199\u5f00\u59cb\u65f6\u95f4",
  startAt: "\u5f00\u59cb\u4e8e ",
  endAt: "\uff0c\u7ed3\u675f\u4e8e ",
} as const;

type StageVisualState = "completed" | "current" | "pending";

function displayDecision(value: string | null) {
  if (!value) return "-";
  if (value in YES_NO_LABELS) return YES_NO_LABELS[value as keyof typeof YES_NO_LABELS];
  if (value in FEEDBACK_STATUS_LABELS) return FEEDBACK_STATUS_LABELS[value as keyof typeof FEEDBACK_STATUS_LABELS];
  return decodeUnicodeEscapes(value);
}

function resolveVisibleStages(item: RequirementRecord) {
  const currentStageName = mapStatusToStageProgress(item.currentStatus);
  const normalizedIndex = STAGE_PROGRESS_SEQUENCE.indexOf(currentStageName);
  return getVisibleStageProgressRecords(item.stages).filter((stage) => getStageProgressOrder(stage.stageName) <= normalizedIndex + 1);
}

function resolveAllStages(item: RequirementRecord) {
  return getVisibleStageProgressRecords(item.stages);
}

function resolveCurrentStageName(item: RequirementRecord): StageNameKey | null {
  if (item.currentStatus === "CLOSED") {
    return null;
  }

  return mapStatusToStageProgress(item.currentStatus);
}

function resolveStageVisualState(
  stage: RequirementStageRecord,
  currentStageName: StageNameKey | null,
  isClosed: boolean,
): StageVisualState {
  if (isClosed) {
    return "completed";
  }

  if (currentStageName === stage.stageName) {
    return "current";
  }

  if (stage.stageReached) {
    return "completed";
  }

  return "pending";
}

function getStageStateText(state: StageVisualState) {
  switch (state) {
    case "completed":
      return decodeUnicodeEscapes(TEXT.completed);
    case "current":
      return decodeUnicodeEscapes(TEXT.current);
    default:
      return decodeUnicodeEscapes(TEXT.pending);
  }
}

function getTopStageStateText(state: StageVisualState) {
  switch (state) {
    case "completed":
      return decodeUnicodeEscapes(TEXT.completed);
    case "current":
      return decodeUnicodeEscapes(TEXT.current);
    default:
      return decodeUnicodeEscapes(TEXT.topPending);
  }
}

function getTopStageCardClass(state: StageVisualState) {
  switch (state) {
    case "completed":
      return "border-emerald-300 bg-gradient-to-br from-emerald-50 via-emerald-100/90 to-emerald-50 shadow-[0_12px_30px_rgba(16,185,129,0.12)]";
    case "current":
      return "border-amber-300 bg-gradient-to-br from-amber-50 via-yellow-100/90 to-amber-50 shadow-[0_12px_30px_rgba(245,158,11,0.12)]";
    default:
      return "border-slate-300 bg-gradient-to-br from-slate-50 via-slate-100 to-slate-50 shadow-sm";
  }
}

function getTopStageIndexClass(state: StageVisualState) {
  switch (state) {
    case "completed":
      return "bg-emerald-600 text-white shadow-[0_10px_24px_rgba(5,150,105,0.18)]";
    case "current":
      return "bg-amber-500 text-white shadow-[0_10px_24px_rgba(217,119,6,0.18)]";
    default:
      return "bg-slate-400 text-white";
  }
}

function getTopStageMetaClass(state: StageVisualState) {
  switch (state) {
    case "completed":
      return "text-emerald-800";
    case "current":
      return "text-amber-900";
    default:
      return "text-slate-600";
  }
}

function getDetailTagClass(state: StageVisualState) {
  switch (state) {
    case "completed":
      return "border border-emerald-300 bg-emerald-50 text-slate-900";
    case "current":
      return "border border-amber-300 bg-amber-50 text-slate-900";
    default:
      return "border border-slate-200 bg-slate-50 text-slate-700";
  }
}

function getDetailRailClass(state: StageVisualState) {
  switch (state) {
    case "completed":
      return "from-emerald-300 via-emerald-200 to-emerald-100";
    case "current":
      return "from-amber-300 via-amber-200 to-amber-100";
    default:
      return "from-slate-300 via-slate-200 to-slate-100";
  }
}

function getDetailMarkerClass(state: StageVisualState) {
  switch (state) {
    case "completed":
      return "border-emerald-300 bg-emerald-100 text-emerald-900";
    case "current":
      return "border-amber-300 bg-amber-100 text-amber-900";
    default:
      return "border-slate-200 bg-slate-50 text-slate-700";
  }
}

function buildStageHighlights(stage: RequirementStageRecord, item: RequirementRecord) {
  switch (stage.stageName) {
    case "DEMAND_CREATED":
      return [[decodeUnicodeEscapes("\u63d0\u51fa\u65f6\u95f4"), displayText(item.createdAt)], [decodeUnicodeEscapes("\u63d0\u51fa\u4eba"), displayText(item.createdBy)], [decodeUnicodeEscapes("\u5173\u8054\u5ba2\u6237"), displayText(item.relatedCustomer)], [decodeUnicodeEscapes("\u5173\u8054\u9879\u76ee"), displayText(item.relatedProject)]] as const;
    case "PRODUCT_INTAKE":
      return [[decodeUnicodeEscapes("\u8d1f\u8d23\u4eba"), displayText(stage.ownerName, decodeUnicodeEscapes("\u5f85\u8865\u5145"))], [decodeUnicodeEscapes("\u627f\u63a5\u65f6\u95f4"), displayText(stage.startTime)], [decodeUnicodeEscapes("\u662f\u5426\u8f93\u51fa\u4ea7\u54c1\u9700\u6c42"), displayDecision(stage.outputProductRequirement)], [decodeUnicodeEscapes("\u65b9\u6848\u5f62\u6210"), displayDecision(stage.outputSolution)], [decodeUnicodeEscapes("\u672c\u9636\u6bb5\u65f6\u957f"), stage.durationValue ? `${stage.durationValue} ${decodeUnicodeEscapes("\u5929")}` : "-"]] as const;
    case "IMPLEMENTATION_DELIVERY":
      return [[decodeUnicodeEscapes("\u8d1f\u8d23\u4eba"), displayText(stage.ownerName, decodeUnicodeEscapes("\u5f85\u8865\u5145"))], [decodeUnicodeEscapes("\u4ea4\u4ed8\u542f\u52a8\u65f6\u95f4"), displayText(stage.startTime)], [decodeUnicodeEscapes("\u65b9\u6848\u5b8c\u6210"), displayDecision(stage.planCompleted)], [decodeUnicodeEscapes("\u4ea4\u4ed8\u5b8c\u6210"), displayDecision(stage.deliveryCompleted)], [decodeUnicodeEscapes("\u53cd\u9988\u72b6\u6001"), displayDecision(stage.feedbackStatus)], [decodeUnicodeEscapes("\u53cd\u9988\u5185\u5bb9"), displayText(stage.feedbackContent)], [decodeUnicodeEscapes("\u7eb3\u5165\u4e0b\u4ee3\u4ea7\u54c1"), displayDecision(stage.includeNextProduct)], [decodeUnicodeEscapes("\u76ee\u6807\u4ea7\u54c1"), displayText(stage.targetProduct)], [decodeUnicodeEscapes("\u672c\u9636\u6bb5\u65f6\u957f"), stage.durationValue ? `${stage.durationValue} ${decodeUnicodeEscapes("\u5929")}` : "-"]] as const;
    default:
      return [] as const;
  }
}

export function StageTimeline({ item }: { item: RequirementRecord }) {
  const allStages = resolveAllStages(item);
  const visibleStages = resolveVisibleStages(item);
  const currentStageName = resolveCurrentStageName(item);
  const isClosed = item.currentStatus === "CLOSED";

  return (
    <div className="space-y-4 rounded-[1.75rem] border border-slate-200 bg-slate-50/80 p-4">
      <div className="overflow-x-auto pb-1">
        <div className="flex min-w-max items-stretch gap-3">
          {allStages.map((stage, index) => {
            const visualState = resolveStageVisualState(stage, currentStageName, isClosed);
            return (
              <div key={stage.stageName} className="flex min-w-[190px] flex-col gap-3">
                <div className={cn("flex items-center gap-3 rounded-[1.35rem] border px-4 py-3 text-left transition", getTopStageCardClass(visualState))}>
                  <div className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold", getTopStageIndexClass(visualState))}>{index + 1}</div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-slate-900">{STAGE_PROGRESS_LABELS[stage.stageName]}</p>
                    <p className={cn("mt-1 text-xs font-medium", getTopStageMetaClass(visualState))}>{getTopStageStateText(visualState)}{stage.startTime ? `${decodeUnicodeEscapes(" \u00b7 ")}${displayText(stage.startTime)}` : ""}</p>
                  </div>
                </div>
                {index < allStages.length - 1 ? <div className="h-px w-full bg-slate-200/80" /> : <div className="h-px w-full bg-transparent" />}
              </div>
            );
          })}
        </div>
      </div>

      <div className="max-h-[34rem] overflow-y-auto pr-2">
        <div className="relative space-y-4 pb-2 pl-6">
          <div className="pointer-events-none absolute bottom-2 left-3 top-3 w-px bg-gradient-to-b from-slate-300 via-slate-200 to-transparent" />
          <div className="space-y-4">
            {visibleStages.map((stage) => {
              const highlights = buildStageHighlights(stage, item);
              const visualState = resolveStageVisualState(stage, currentStageName, isClosed);
              return (
                <section key={stage.stageName} className="relative rounded-[1.55rem] border border-slate-200 bg-white p-4 shadow-sm">
                  <div className={cn("absolute left-[-1.12rem] top-6 flex h-9 w-9 items-center justify-center rounded-full border text-xs font-semibold shadow-sm", getDetailMarkerClass(visualState))}>{getStageProgressOrder(stage.stageName)}</div>
                  <div className={cn("absolute left-[-0.22rem] top-[3.25rem] hidden h-[calc(100%-3.25rem)] w-[2px] rounded-full bg-gradient-to-b xl:block", getDetailRailClass(visualState))} />
                  <div className="mb-4 flex items-center gap-3">
                    <div className="h-px flex-1 bg-slate-200" />
                    <div className={cn("rounded-full px-3 py-1 text-xs font-semibold", getDetailTagClass(visualState))}>{getStageStateText(visualState)}</div>
                  </div>
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h5 className="text-base font-semibold text-slate-900">{STAGE_PROGRESS_LABELS[stage.stageName]}</h5>
                      <p className="mt-1 text-sm text-slate-500">{stage.startTime ? `${decodeUnicodeEscapes(TEXT.startAt)}${displayText(stage.startTime)}` : decodeUnicodeEscapes(TEXT.noStart)}{stage.endTime ? `${decodeUnicodeEscapes(TEXT.endAt)}${displayText(stage.endTime)}` : ""}</p>
                    </div>
                  </div>
                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    {highlights.map(([label, value]) => <div key={label} className={label === decodeUnicodeEscapes("\u53cd\u9988\u5185\u5bb9") ? "sm:col-span-2" : undefined}><p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">{label}</p><p className="mt-1 text-sm leading-6 text-slate-800">{value}</p></div>)}
                  </div>
                </section>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

