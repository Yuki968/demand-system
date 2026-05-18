"use client";

import { useEffect, useMemo, useState } from "react";

import { FormSection } from "@/components/admin/form-section";
import { PriorityBadge, StatusBadge } from "@/components/requirement/badges";
import { FORM_OPTIONS, STAGE_SEQUENCE, STATUS_LABELS } from "@/constants/requirement";
import {
  getStageProgressOrder,
  mapStatusToStageProgress,
  STAGE_PROGRESS_LABELS,
  STAGE_PROGRESS_SEQUENCE,
} from "@/lib/requirement-stage-progress";
import { decodeUnicodeEscapes, displayText } from "@/lib/text";
import { cn } from "@/lib/utils";
import { compareDateOnly, daysInclusive, isValidDateOnly } from "@/services/requirement/date";
import type { CreateRequirementInput, RequirementRecord, RequirementStageRecord, StageNameKey } from "@/types/requirement";

export interface RequirementDraft extends CreateRequirementInput {
  totalDurationIsManual?: boolean;
  totalDurationValue?: number | null;
  stages: RequirementStageRecord[];
}

const TEXT = {
  select: "\u8bf7\u9009\u62e9",
  create: "\u65b0\u589e\u9700\u6c42",
  edit: "\u7f16\u8f91\u9700\u6c42",
  summaryTitle: "\u4e3b\u4fe1\u606f",
  summaryDesc: "上方字段为人工最终字段；下方当前状态、当前负责人、总时长、是否结束为系统汇总结果，只读展示，不作为人工真值来源。",
  stageTitle: "\u9636\u6bb5\u7ef4\u62a4\u5de5\u4f5c\u533a",
  stageDesc: "这里维护阶段事实字段，如负责人、开始/结束时间和关键判断项；保存后系统基于这些事实汇总当前状态、当前负责人、是否结束和自动总时长。",
  save: "\u4fdd\u5b58\u4fee\u6539",
  saving: "\u4fdd\u5b58\u4e2d...",
  createAction: "\u521b\u5efa\u9700\u6c42",
  manualSync: "\u624b\u52a8\u540c\u6b65",
  delete: "\u5220\u9664\u9700\u6c42",
  deleting: "\u5220\u9664\u4e2d...",
  started: "\u5df2\u542f\u52a8",
  pending: "\u672a\u542f\u52a8",
  finished: "\u5df2\u7ed3\u675f",
  yes: "\u662f",
  no: "\u5426",
  noValue: "-",
  durationAuto: "\u7cfb\u7edf\u81ea\u52a8\u6839\u636e\u5f00\u59cb\u65f6\u95f4\u548c\u7ed3\u675f\u65f6\u95f4\u8ba1\u7b97\u9636\u6bb5\u65f6\u957f\u3002",
  emptyTitle: "\u6682\u65e0\u5df2\u9009\u9700\u6c42",
  emptyDesc: "\u5f53\u524d\u5217\u8868\u4e2d\u6ca1\u6709\u53ef\u7ef4\u62a4\u7684\u9700\u6c42\uff0c\u53ef\u4ece\u5de6\u4fa7\u9009\u62e9\u5176\u4ed6\u9700\u6c42\uff0c\u6216\u76f4\u63a5\u65b0\u5efa\u4e00\u6761\u9700\u6c42\u3002",
} as const;

const fieldClassName = "rounded-2xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-sky-300 focus:ring-2 focus:ring-sky-100";

function SelectField({ value, options, onChange, placeholder = TEXT.select }: { value: string | null | undefined; options: Array<{ value: string; label: string }>; onChange: (value: string) => void; placeholder?: string; }) {
  return <select value={value ?? ""} onChange={(event) => onChange(event.target.value)} className={fieldClassName}><option value="">{decodeUnicodeEscapes(placeholder)}</option>{options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select>;
}

function resolveDefaultActiveStage(mode: "create" | "edit", currentRequirement: RequirementRecord | null): StageNameKey {
  if (mode === "create" || !currentRequirement) return "DEMAND_CREATED";
  return mapStatusToStageProgress(currentRequirement.currentStatus);
}

function getAutoDurationValue(stage: RequirementStageRecord) {
  if (!stage.startTime) {
    return null;
  }

  const end = stage.endTime || new Date().toISOString().slice(0, 10);
  return daysInclusive(stage.startTime, end);
}

function getAutoDurationText(stage: RequirementStageRecord) {
  const value = getAutoDurationValue(stage);
  return value ? `${value} ${decodeUnicodeEscapes("\u5929")}` : TEXT.noValue;
}

function validateStageDates(stages: RequirementStageRecord[]) {
  const errors: string[] = [];

  for (const stage of stages) {
    if (stage.startTime && !isValidDateOnly(stage.startTime)) {
      errors.push(`${STATUS_LABELS[stage.stageName]}的开始时间格式不正确`);
    }

    if (stage.endTime && !isValidDateOnly(stage.endTime)) {
      errors.push(`${STATUS_LABELS[stage.stageName]}的结束时间格式不正确`);
    }

    if (stage.startTime && stage.endTime && compareDateOnly(stage.endTime, stage.startTime) < 0) {
      errors.push(`${STATUS_LABELS[stage.stageName]}的结束时间不能早于开始时间`);
    }
  }

  return errors;
}

export function buildEmptyDraft(): RequirementDraft {
  return {
    requirementName: "",
    requirementType: "PRODUCT_PLANNING",
    requirementBelong: "THREE_POINT_ZERO",
    priority: "MEDIUM",
    createdAt: new Date().toISOString().slice(0, 10),
    createdBy: "",
    relatedCustomer: "",
    relatedProject: "",
    totalDurationIsManual: false,
    totalDurationValue: null,
    stages: STAGE_SEQUENCE.map((stageName, index) => ({ id: -(index + 1), requirementId: 0, stageName, stageOrder: index + 1, stageReached: stageName === "DEMAND_CREATED", ownerName: stageName === "DEMAND_CREATED" ? "" : null, startTime: stageName === "DEMAND_CREATED" ? new Date().toISOString().slice(0, 10) : null, endTime: null, relatedCustomer: null, outputProductRequirement: null, outputSolution: null, planCompleted: null, deliveryCompleted: null, feedbackStatus: null, feedbackContent: null, includeNextProduct: null, targetProduct: null, durationValue: null, durationIsManual: false, updatedAt: new Date().toISOString().slice(0, 10) })),
  };
}

export function toDraftFromRequirement(item: RequirementRecord): RequirementDraft {
  return { requirementName: item.requirementName, requirementType: item.requirementType, requirementBelong: item.requirementBelong, priority: item.priority, createdAt: item.createdAt, createdBy: item.createdBy, relatedCustomer: item.relatedCustomer, relatedProject: item.relatedProject, totalDurationIsManual: item.totalDurationIsManual, totalDurationValue: item.totalDurationValue, stages: item.stages };
}

export function RequirementEditor({ mode, draft, currentRequirement, onChange, onSubmit, onSync, onDelete, saving, deleting }: { mode: "create" | "edit"; draft: RequirementDraft; currentRequirement: RequirementRecord | null; onChange: (draft: RequirementDraft) => void; onSubmit: () => void; onSync: () => void; onDelete?: () => void; saving: boolean; deleting?: boolean; }) {
  const [activeStageName, setActiveStageName] = useState<StageNameKey>(resolveDefaultActiveStage(mode, currentRequirement));
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    setActiveStageName(resolveDefaultActiveStage(mode, currentRequirement));
  }, [mode, currentRequirement?.id, currentRequirement?.currentStatus]);

  const stageMap = useMemo(() => Object.fromEntries(draft.stages.map((stage) => [stage.stageName, stage])) as Record<StageNameKey, RequirementStageRecord>, [draft.stages]);
  const visibleStageNames = STAGE_PROGRESS_SEQUENCE;
  const activeStage = stageMap[activeStageName] ?? stageMap[visibleStageNames[0]];

  if (!activeStage) {
    return null;
  }

  const activeStageDisplayName = activeStage.stageName as (typeof STAGE_PROGRESS_SEQUENCE)[number];

  function patchRequirement<K extends keyof RequirementDraft>(key: K, value: RequirementDraft[K]) {
    onChange({ ...draft, [key]: value });
  }

  function patchStage(stageName: RequirementStageRecord["stageName"], patch: Partial<RequirementStageRecord>) {
    setFormError(null);
    onChange({ ...draft, stages: draft.stages.map((stage) => (stage.stageName === stageName ? { ...stage, ...patch } : stage)) });
  }

  function handleSubmitClick() {
    const errors = validateStageDates(draft.stages);
    if (errors.length > 0) {
      setFormError(errors[0]);
      return;
    }

    setFormError(null);
    onSubmit();
  }

  if (mode === "edit" && !currentRequirement) {
    return (
      <div className="rounded-[2rem] border border-dashed border-slate-300 bg-white px-8 py-14 text-center shadow-[var(--shadow-panel)]">
        <h3 className="text-xl font-semibold text-slate-900">{decodeUnicodeEscapes(TEXT.emptyTitle)}</h3>
        <p className="mt-3 text-sm leading-7 text-slate-500">{decodeUnicodeEscapes(TEXT.emptyDesc)}</p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="rounded-[2rem] border border-[var(--border-soft)] bg-slate-900 p-6 text-white shadow-[var(--shadow-panel)]">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-sky-200">Admin Studio</p>
            <h2 className="mt-3 text-2xl font-semibold">{decodeUnicodeEscapes(mode === "create" ? TEXT.create : draft.requirementName || TEXT.edit)}</h2>
            <p className="mt-2 text-sm text-slate-300">{decodeUnicodeEscapes("\u4e3b\u4fe1\u606f\u4e0e\u9636\u6bb5\u4fe1\u606f\u5206\u5f00\u7ef4\u62a4\uff0c\u4fdd\u5b58\u540e\u81ea\u52a8\u6267\u884c\u540c\u6b65\u3002")}</p>
          </div>
          <div className="flex max-w-full flex-col items-end gap-3">
            {currentRequirement ? <div className="flex flex-wrap gap-2"><StatusBadge className="whitespace-nowrap" status={currentRequirement.currentStatus} /><PriorityBadge className="whitespace-nowrap" priority={currentRequirement.priority} /></div> : null}
            <div className="flex flex-wrap justify-end gap-3">
              {mode === "edit" && currentRequirement ? <button type="button" onClick={onSync} disabled={saving || deleting} className="rounded-2xl border border-slate-600 bg-slate-800/70 px-4 py-2.5 text-sm font-semibold text-slate-100 transition hover:border-sky-300 hover:text-sky-100 disabled:cursor-not-allowed disabled:opacity-60">{decodeUnicodeEscapes(TEXT.manualSync)}</button> : null}
              {mode === "edit" && currentRequirement ? <button type="button" onClick={onDelete} disabled={saving || deleting} className="rounded-2xl border border-rose-300/60 bg-rose-500/10 px-4 py-2.5 text-sm font-semibold text-rose-100 transition hover:border-rose-200 hover:bg-rose-500/15 disabled:cursor-not-allowed disabled:opacity-60">{decodeUnicodeEscapes(deleting ? TEXT.deleting : TEXT.delete)}</button> : null}
              <button type="button" onClick={handleSubmitClick} disabled={saving || deleting} className="rounded-2xl bg-white px-5 py-2.5 text-sm font-semibold text-slate-900 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60">{decodeUnicodeEscapes(saving ? TEXT.saving : mode === "create" ? TEXT.createAction : TEXT.save)}</button>
            </div>
          </div>
        </div>
      </div>

      <FormSection title={TEXT.summaryTitle} description={TEXT.summaryDesc}>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <Field label="\u9700\u6c42\u540d\u79f0"><input value={draft.requirementName} onChange={(event) => patchRequirement("requirementName", event.target.value)} className={fieldClassName} /></Field>
          <Field label="\u63d0\u51fa\u65e5\u671f"><input type="date" value={draft.createdAt} onChange={(event) => patchRequirement("createdAt", event.target.value)} className={fieldClassName} /></Field>
          <Field label="\u63d0\u51fa\u4eba"><input value={draft.createdBy} onChange={(event) => patchRequirement("createdBy", event.target.value)} className={fieldClassName} /></Field>
          <Field label="\u5173\u8054\u9879\u76ee"><input value={draft.relatedProject ?? ""} onChange={(event) => patchRequirement("relatedProject", event.target.value)} className={fieldClassName} /></Field>
          <Field label="\u9700\u6c42\u7c7b\u578b"><SelectField value={draft.requirementType} options={FORM_OPTIONS.requirementType} onChange={(value) => patchRequirement("requirementType", value as RequirementDraft["requirementType"])} /></Field>
          <Field label="\u9700\u6c42\u5f52\u5c5e"><SelectField value={draft.requirementBelong} options={FORM_OPTIONS.requirementBelong} onChange={(value) => patchRequirement("requirementBelong", value as RequirementDraft["requirementBelong"])} /></Field>
          <Field label="\u4f18\u5148\u7ea7"><SelectField value={draft.priority} options={FORM_OPTIONS.priority} onChange={(value) => patchRequirement("priority", value as RequirementDraft["priority"])} /></Field>
          <Field label="\u5173\u8054\u5ba2\u6237"><input value={draft.relatedCustomer ?? ""} onChange={(event) => patchRequirement("relatedCustomer", event.target.value)} className={fieldClassName} /></Field>
          <label className="flex items-center gap-3 rounded-2xl border border-slate-200 px-3 py-2.5 text-sm text-slate-600 xl:col-span-2"><input type="checkbox" checked={Boolean(draft.totalDurationIsManual)} onChange={(event) => patchRequirement("totalDurationIsManual", event.target.checked)} />{decodeUnicodeEscapes("\u542f\u7528\u603b\u65f6\u957f\u624b\u52a8\u503c")}</label>
          <Field label="\u603b\u65f6\u957f\u503c"><input type="number" value={draft.totalDurationValue ?? ""} onChange={(event) => patchRequirement("totalDurationValue", event.target.value ? Number(event.target.value) : null)} className={fieldClassName} disabled={!draft.totalDurationIsManual} /></Field>
        </div>
        {currentRequirement ? <div className="mt-4 grid gap-4 rounded-3xl bg-slate-50 p-4 text-sm text-slate-600 md:grid-cols-2 xl:grid-cols-4"><InfoTile label="\u5f53\u524d\u72b6\u6001" value={STATUS_LABELS[currentRequirement.currentStatus]} /><InfoTile label="\u5f53\u524d\u8d1f\u8d23\u4eba" value={displayText(currentRequirement.currentOwner, TEXT.noValue)} /><InfoTile label="\u603b\u65f6\u957f" value={currentRequirement.totalDurationValue ? `${currentRequirement.totalDurationValue} ${decodeUnicodeEscapes("\u5929")}` : TEXT.noValue} /><InfoTile label="\u662f\u5426\u7ed3\u675f" value={currentRequirement.isFinished ? decodeUnicodeEscapes(TEXT.yes) : decodeUnicodeEscapes(TEXT.no)} /></div> : null}
      </FormSection>

      <FormSection title={TEXT.stageTitle} description={TEXT.stageDesc}>
        <div className="rounded-[1.75rem] border border-slate-200 bg-slate-50/80 p-3">
          <div className="grid gap-3 xl:grid-cols-3">
            {visibleStageNames.map((stageName, index) => {
              const stage = stageMap[stageName];
              return <button key={stageName} type="button" onClick={() => setActiveStageName(stageName)} className={cn("group relative rounded-2xl border px-4 py-3 text-left transition", activeStageName === stageName ? "border-sky-200 bg-white shadow-sm" : "border-slate-200 bg-slate-50 hover:border-slate-300 hover:bg-white")}><div className="flex items-start gap-3"><div className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-xs font-semibold transition", activeStageName === stageName ? "border-sky-200 bg-sky-50 text-slate-900" : "border-slate-200 bg-white text-slate-500")}>{index + 1}</div><div className="min-w-0"><p className="text-sm font-semibold text-slate-900">{STAGE_PROGRESS_LABELS[stageName]}</p><p className="mt-1 text-xs text-slate-500">{decodeUnicodeEscapes(stage?.stageReached ? TEXT.started : TEXT.pending)}</p></div></div>{index < visibleStageNames.length - 1 ? <div className="mt-3 h-px w-full bg-slate-200/80" /> : <div className="mt-3 h-px w-full bg-transparent" />}</button>;
            })}
          </div>
        </div>
        <div className="relative mt-5 pl-5">
          <div className="absolute bottom-5 left-[0.625rem] top-5 w-px bg-gradient-to-b from-slate-300 via-slate-200 to-transparent" />
          <div className="absolute left-[0.625rem] top-7 h-3 w-3 -translate-x-1/2 rounded-full border border-slate-300 bg-white shadow-sm" />
          <div className="grid gap-5 xl:grid-cols-[1.05fr_1.65fr]">
            <div className="relative rounded-[1.75rem] border border-slate-200 bg-slate-50 p-4 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-sm font-semibold text-slate-900">{getStageProgressOrder(activeStageDisplayName)}</div>
                <div className="h-px flex-1 bg-slate-200" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-slate-900">{STAGE_PROGRESS_LABELS[activeStageDisplayName]}</h3>
              <p className="mt-2 text-sm leading-7 text-slate-500">{decodeUnicodeEscapes(stageDescription(activeStageDisplayName))}</p>
              <div className="mt-4 space-y-3 text-sm text-slate-600"><InfoRow label="\u9636\u6bb5\u72b6\u6001" value={decodeUnicodeEscapes(activeStage.stageReached ? TEXT.started : TEXT.pending)} /><InfoRow label="\u5f00\u59cb\u65f6\u95f4" value={displayText(activeStage.startTime)} /><InfoRow label="\u7ed3\u675f\u65f6\u95f4" value={displayText(activeStage.endTime)} /><InfoRow label="\u9636\u6bb5\u65f6\u957f" value={getAutoDurationText(activeStage)} /></div>
              <p className="mt-4 rounded-2xl border border-sky-100 bg-sky-50 px-3 py-2 text-xs leading-6 text-sky-700">{decodeUnicodeEscapes(TEXT.durationAuto)}</p>
            </div>
            <div className="relative rounded-[1.75rem] border border-slate-200 bg-white p-4 shadow-sm">
              <div className="mb-4 flex items-center gap-3"><div className="h-px w-8 bg-slate-200" /><div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-700">{getStageProgressOrder(activeStageDisplayName)}</div><div className="h-px flex-1 bg-slate-200" /></div>
              <div className="grid gap-4 md:grid-cols-2">{renderStageFields(activeStage.stageName, activeStage, patchStage)}</div>
            </div>
          </div>
        </div>
        {formError ? <div className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{decodeUnicodeEscapes(formError)}</div> : null}
      </FormSection>
    </div>
  );
}

function stageDescription(stageName: (typeof STAGE_PROGRESS_SEQUENCE)[number]) {
  switch (stageName) {
    case "DEMAND_CREATED": return "\u7ef4\u62a4\u9700\u6c42\u63d0\u51fa\u65f6\u7684\u8d77\u59cb\u4fe1\u606f\uff0c\u660e\u786e\u63d0\u51fa\u4eba\u3001\u65f6\u95f4\u548c\u4e1a\u52a1\u80cc\u666f\u3002";
    case "PRODUCT_INTAKE": return "\u805a\u7126\u4ea7\u54c1\u627f\u63a5\u8d1f\u8d23\u4eba\u3001\u627f\u63a5\u65f6\u95f4\u3001\u4ea7\u54c1\u9700\u6c42\u8f93\u51fa\u4e0e\u65b9\u6848\u5f62\u6210\u4e8b\u5b9e\u3002";
    case "IMPLEMENTATION_DELIVERY": return "\u805a\u7126\u4ea4\u4ed8\u542f\u52a8\u3001\u65b9\u6848\u5b8c\u6210\u3001\u4ea4\u4ed8\u5b8c\u6210\u548c\u53cd\u9988\u95ed\u73af\u4e8b\u5b9e\u3002";
    default: return "";
  }
}

function renderStageFields(stageName: StageNameKey, stage: RequirementStageRecord, patchStage: (stageName: RequirementStageRecord["stageName"], patch: Partial<RequirementStageRecord>) => void) {
  const endTimeField = <Field label="\u7ed3\u675f\u65f6\u95f4"><input type="date" value={stage.endTime ?? ""} onChange={(event) => patchStage(stageName, { endTime: event.target.value || null })} className={fieldClassName} /></Field>;
  switch (stageName) {
    case "DEMAND_CREATED": return <><Field label="\u63d0\u51fa\u4eba / \u9636\u6bb5\u8d1f\u8d23\u4eba"><input value={stage.ownerName ?? ""} onChange={(event) => patchStage(stageName, { ownerName: event.target.value })} className={fieldClassName} /></Field><Field label="\u63d0\u51fa\u65f6\u95f4"><input type="date" value={stage.startTime ?? ""} onChange={(event) => patchStage(stageName, { startTime: event.target.value || null })} className={fieldClassName} /></Field>{endTimeField}<Field label="\u9636\u6bb5\u5ba2\u6237"><input value={stage.relatedCustomer ?? ""} onChange={(event) => patchStage(stageName, { relatedCustomer: event.target.value || null })} className={fieldClassName} /></Field></>;
    case "PRODUCT_INTAKE": return <><Field label="\u8d1f\u8d23\u4eba"><input value={stage.ownerName ?? ""} onChange={(event) => patchStage(stageName, { ownerName: event.target.value })} className={fieldClassName} /></Field><Field label="\u627f\u63a5\u65f6\u95f4"><input type="date" value={stage.startTime ?? ""} onChange={(event) => patchStage(stageName, { startTime: event.target.value || null })} className={fieldClassName} /></Field>{endTimeField}<Field label="\u9636\u6bb5\u5ba2\u6237"><input value={stage.relatedCustomer ?? ""} onChange={(event) => patchStage(stageName, { relatedCustomer: event.target.value || null })} className={fieldClassName} /></Field><Field label="\u662f\u5426\u8f93\u51fa\u4ea7\u54c1\u9700\u6c42"><SelectField value={stage.outputProductRequirement} options={FORM_OPTIONS.yesNo} onChange={(value) => patchStage(stageName, { outputProductRequirement: (value || null) as RequirementStageRecord["outputProductRequirement"] })} /></Field><Field label="\u65b9\u6848\u5f62\u6210"><SelectField value={stage.outputSolution} options={FORM_OPTIONS.yesNo} onChange={(value) => patchStage(stageName, { outputSolution: (value || null) as RequirementStageRecord["outputSolution"] })} /></Field></>;
    case "IMPLEMENTATION_DELIVERY": return <><Field label="\u8d1f\u8d23\u4eba"><input value={stage.ownerName ?? ""} onChange={(event) => patchStage(stageName, { ownerName: event.target.value })} className={fieldClassName} /></Field><Field label="\u4ea4\u4ed8\u542f\u52a8\u65f6\u95f4"><input type="date" value={stage.startTime ?? ""} onChange={(event) => patchStage(stageName, { startTime: event.target.value || null })} className={fieldClassName} /></Field>{endTimeField}<Field label="\u65b9\u6848\u5b8c\u6210"><SelectField value={stage.planCompleted} options={FORM_OPTIONS.yesNo} onChange={(value) => patchStage(stageName, { planCompleted: (value || null) as RequirementStageRecord["planCompleted"] })} /></Field><Field label="\u4ea4\u4ed8\u5b8c\u6210"><SelectField value={stage.deliveryCompleted} options={FORM_OPTIONS.yesNo} onChange={(value) => patchStage(stageName, { deliveryCompleted: (value || null) as RequirementStageRecord["deliveryCompleted"] })} /></Field><Field label="\u53cd\u9988\u72b6\u6001"><SelectField value={stage.feedbackStatus} options={FORM_OPTIONS.feedbackStatus} onChange={(value) => patchStage(stageName, { feedbackStatus: (value || null) as RequirementStageRecord["feedbackStatus"] })} /></Field><Field label="\u7eb3\u5165\u4e0b\u4ee3\u4ea7\u54c1"><SelectField value={stage.includeNextProduct} options={FORM_OPTIONS.yesNo} onChange={(value) => patchStage(stageName, { includeNextProduct: (value || null) as RequirementStageRecord["includeNextProduct"] })} /></Field><Field label="\u76ee\u6807\u4ea7\u54c1"><input value={stage.targetProduct ?? ""} onChange={(event) => patchStage(stageName, { targetProduct: event.target.value || null })} className={fieldClassName} /></Field><Field label="\u53cd\u9988\u5185\u5bb9" className="md:col-span-2"><textarea value={stage.feedbackContent ?? ""} onChange={(event) => patchStage(stageName, { feedbackContent: event.target.value || null })} className={cn(fieldClassName, "min-h-24 resize-y")} /></Field></>;
    default: return null;
  }
}

function Field({ label, children, className }: { label: string; children: React.ReactNode; className?: string }) { return <label className={cn("space-y-2 text-sm text-slate-600", className)}><span>{decodeUnicodeEscapes(label)}</span>{children}</label>; }
function InfoTile({ label, value }: { label: string; value: string }) { return <div><p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">{decodeUnicodeEscapes(label)}</p><p className="mt-1 text-sm font-medium text-slate-800">{decodeUnicodeEscapes(value)}</p></div>; }
function InfoRow({ label, value }: { label: string; value: string }) { return <div className="flex items-center justify-between gap-4 rounded-2xl border border-white/70 bg-white px-3 py-2.5"><span className="text-slate-500">{decodeUnicodeEscapes(label)}</span><span className="font-medium text-slate-800">{decodeUnicodeEscapes(value)}</span></div>; }
