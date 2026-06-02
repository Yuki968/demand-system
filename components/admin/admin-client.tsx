"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import {
  RequirementEditor,
  buildEmptyDraft,
  toDraftFromRequirement,
  type RequirementDraft,
} from "@/components/admin/requirement-editor";
import { filterRequirementList } from "@/components/requirement/requirement-search";
import { RequirementSummaryCard } from "@/components/requirement/requirement-summary-card";
import { requestJson } from "@/lib/api-client";
import { decodeUnicodeEscapes } from "@/lib/text";
import type { RequirementRecord } from "@/types/requirement";

function getDemandStageDraft(draft: RequirementDraft) {
  return draft.stages.find((stage) => stage.stageName === "DEMAND_CREATED") ?? null;
}

export function AdminRequirementsClient({ initialRequirements }: { initialRequirements: RequirementRecord[] }) {
  const [requirements, setRequirements] = useState(initialRequirements);
  const [selectedId, setSelectedId] = useState<number | null>(initialRequirements[0]?.id ?? null);
  const [selectedRequirement, setSelectedRequirement] = useState<RequirementRecord | null>(initialRequirements[0] ?? null);
  const [draft, setDraft] = useState<RequirementDraft>(initialRequirements[0] ? toDraftFromRequirement(initialRequirements[0]) : buildEmptyDraft());
  const [mode, setMode] = useState<"create" | "edit">(initialRequirements[0] ? "edit" : "create");
  const [keyword, setKeyword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [messageTone, setMessageTone] = useState<"success" | "error">("success");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const filteredRequirements = useMemo(() => filterRequirementList(requirements, { keyword }), [requirements, keyword]);

  function applyRequirementDetail(detail: RequirementRecord | null) {
    setSelectedRequirement(detail);
    setDraft(detail ? toDraftFromRequirement(detail) : buildEmptyDraft());
    if (detail) {
      setMode("edit");
    }
  }

  function mergeRequirementIntoList(list: RequirementRecord[], detail: RequirementRecord) {
    let found = false;
    const nextList = list.map((item) => {
      if (item.id !== detail.id) {
        return item;
      }
      found = true;
      return detail;
    });

    return found ? nextList : [detail, ...nextList];
  }

  useEffect(() => {
    if (mode === "create") return;
    if (!filteredRequirements.length) {
      setSelectedId(null);
      applyRequirementDetail(null);
      return;
    }
    if (!selectedId || !filteredRequirements.some((item) => item.id === selectedId)) {
      const fallback = filteredRequirements[0];
      setSelectedId(fallback.id);
    }
  }, [filteredRequirements, mode, selectedId]);

  useEffect(() => {
    if (!selectedId) return;

    let cancelled = false;

    async function loadDetail() {
      setLoading(true);
      try {
        const detail = await requestJson<RequirementRecord>(`/api/requirements/${selectedId}`, {
          errorMessage: decodeUnicodeEscapes("需求详情加载失败，请稍后重试"),
        });
        if (cancelled) {
          return;
        }
        applyRequirementDetail(detail);
        setMessage(null);
      } catch (error) {
        if (cancelled) {
          return;
        }
        setMessageTone("error");
        setMessage(error instanceof Error ? error.message : decodeUnicodeEscapes("需求详情加载失败，请稍后重试"));
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }
    void loadDetail();

    return () => {
      cancelled = true;
    };
  }, [selectedId]);

  async function refreshList(targetId?: number, latestDetail?: RequirementRecord) {
    const list = await requestJson<RequirementRecord[]>("/api/requirements", {
      errorMessage: decodeUnicodeEscapes("需求列表加载失败，请稍后重试"),
    });
    const nextList = latestDetail ? mergeRequirementIntoList(list, latestDetail) : list;
    setRequirements(nextList);

    if (targetId) {
      setSelectedId(targetId);
      if (latestDetail?.id === targetId) {
        applyRequirementDetail(latestDetail);
        return;
      }
      const detail = await requestJson<RequirementRecord>(`/api/requirements/${targetId}`, {
        errorMessage: decodeUnicodeEscapes("需求详情加载失败，请稍后重试"),
      });
      applyRequirementDetail(detail);
      return;
    }

    if (!list.length) {
      setSelectedId(null);
      applyRequirementDetail(null);
    }
  }

  async function handleSubmit() {
    setSaving(true);
    setMessage(null);
    try {
      if (mode === "create") {
        const demandStage = getDemandStageDraft(draft);
        const created = await requestJson<RequirementRecord>("/api/requirements", { method: "POST", body: JSON.stringify({ requirementName: draft.requirementName, requirementType: draft.requirementType, requirementBelong: draft.requirementBelong, priority: draft.priority, createdAt: demandStage?.startTime ?? draft.createdAt, createdBy: demandStage?.ownerName ?? draft.createdBy, relatedCustomer: draft.relatedCustomer, relatedProject: draft.relatedProject }), errorMessage: decodeUnicodeEscapes("需求创建失败，请稍后重试") });
        applyRequirementDetail(created);
        setMessageTone("success");
        setMessage(`${decodeUnicodeEscapes("需求")} #${created.requirementNo} ${decodeUnicodeEscapes("已创建并完成初始化同步")}`);
        await refreshList(created.id, created);
        return;
      }
      if (!selectedRequirement) return;
      const demandStage = getDemandStageDraft(draft);
      const updated = await requestJson<RequirementRecord>(`/api/requirements/${selectedRequirement.id}`, { method: "PATCH", body: JSON.stringify({ requirement: { requirementName: draft.requirementName, requirementType: draft.requirementType, requirementBelong: draft.requirementBelong, priority: draft.priority, createdAt: demandStage?.startTime ?? draft.createdAt, createdBy: demandStage?.ownerName ?? draft.createdBy, relatedCustomer: draft.relatedCustomer, relatedProject: draft.relatedProject, totalDurationValue: draft.totalDurationValue, totalDurationIsManual: draft.totalDurationIsManual }, stages: draft.stages.map((stage) => ({ stageName: stage.stageName, ownerName: stage.ownerName, startTime: stage.startTime, endTime: stage.endTime, relatedCustomer: null, blockingReason: stage.blockingReason, outputProductRequirement: stage.outputProductRequirement, outputSolution: stage.outputSolution, planCompleted: stage.planCompleted, deliveryCompleted: stage.deliveryCompleted, feedbackStatus: stage.feedbackStatus, feedbackContent: stage.feedbackContent, includeNextProduct: stage.includeNextProduct, targetProduct: stage.targetProduct })) }), errorMessage: decodeUnicodeEscapes("需求保存失败，请稍后重试") });
      applyRequirementDetail(updated);
      setMessageTone("success");
      setMessage(`${decodeUnicodeEscapes("需求")} #${updated.requirementNo} ${decodeUnicodeEscapes("已保存并同步")}`);
      await refreshList(updated.id, updated);
    } catch (error) {
      setMessageTone("error");
      setMessage(error instanceof Error ? error.message : decodeUnicodeEscapes("需求保存失败，请稍后重试"));
    } finally {
      setSaving(false);
    }
  }

  async function handleSync() {
    if (!selectedRequirement) return;
    setSaving(true);
    setMessage(null);
    try {
      const synced = await requestJson<RequirementRecord>(`/api/requirements/${selectedRequirement.id}/sync`, { method: "POST", errorMessage: decodeUnicodeEscapes("需求同步失败，请稍后重试") });
      applyRequirementDetail(synced);
      setMessageTone("success");
      setMessage(`${decodeUnicodeEscapes("需求")} #${synced.requirementNo} ${decodeUnicodeEscapes("已手动同步")}`);
      await refreshList(synced.id, synced);
    } catch (error) {
      setMessageTone("error");
      setMessage(error instanceof Error ? error.message : decodeUnicodeEscapes("需求同步失败，请稍后重试"));
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteConfirmed() {
    if (!selectedRequirement) return;

    const deletingId = selectedRequirement.id;
    const deletingRequirementNo = selectedRequirement.requirementNo;
    const currentIndex = requirements.findIndex((item) => item.id === deletingId);
    const nextList = requirements.filter((item) => item.id !== deletingId);
    const nextSelection = nextList[currentIndex] ?? nextList[currentIndex - 1] ?? null;

    setDeleting(true);
    setMessage(null);
    try {
      await requestJson<{ id: number; requirementNo: number }>(`/api/requirements/${deletingId}`, {
        method: "DELETE",
        errorMessage: decodeUnicodeEscapes("删除需求失败，请稍后重试"),
      });

      setShowDeleteConfirm(false);
      setRequirements(nextList);
      setMessageTone("success");
      setMessage(`${decodeUnicodeEscapes("需求")} #${deletingRequirementNo} ${decodeUnicodeEscapes("已删除，关联阶段信息已一并清理")}`);

      if (nextSelection) {
        setMode("edit");
        setSelectedId(nextSelection.id);
      } else {
        setSelectedId(null);
        applyRequirementDetail(null);
      }
    } catch (error) {
      setMessageTone("error");
      setMessage(error instanceof Error ? error.message : decodeUnicodeEscapes("删除需求失败，请稍后重试"));
    } finally {
      setDeleting(false);
    }
  }

  function handleCreate() {
    setMode("create");
    setSelectedId(null);
    setSelectedRequirement(null);
    setDraft(buildEmptyDraft());
    setMessage(null);
    setMessageTone("success");
    setShowDeleteConfirm(false);
  }

  return (
    <>
      <div className="mx-auto flex max-w-[1500px] flex-col gap-6 px-6 py-8 lg:px-10">
        <section className="rounded-[2rem] border border-[var(--border-soft)] bg-white p-7 shadow-[var(--shadow-panel)]">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-sky-600">Admin Workspace</p>
          <div className="mt-3 flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="text-3xl font-semibold text-slate-900">{decodeUnicodeEscapes("产品需求后台管理维护看板")}</h2>
              <p className="mt-3 text-sm leading-7 text-slate-500">{decodeUnicodeEscapes("面向管理员维护需求主信息、阶段负责人、阶段产出与反馈结果，所有保存仍复用现有同步逻辑。")}</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href="/board?from=admin" className="rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-sky-200 hover:text-sky-700">{decodeUnicodeEscapes("返回前台看板")}</Link>
              <button type="button" onClick={handleCreate} className="rounded-2xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800">{decodeUnicodeEscapes("新增需求")}</button>
            </div>
          </div>
        </section>

        <div className="grid gap-6 xl:grid-cols-[380px_minmax(0,1fr)]">
          <aside className="rounded-[2rem] border border-[var(--border-soft)] bg-white p-5 shadow-[var(--shadow-panel)]">
            <div className="border-b border-slate-100 pb-4">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">Maintain Queue</p>
              <h3 className="mt-2 text-xl font-semibold text-slate-900">{decodeUnicodeEscapes("需求维护台")}</h3>
              <p className="mt-2 text-sm text-slate-500">{decodeUnicodeEscapes("搜索需求名称、项目、客户、提出人或任一阶段负责人，快速定位需要维护的条目。")}</p>
            </div>

            <label className="mt-4 block space-y-2">
              <span className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">{decodeUnicodeEscapes("关键词搜索")}</span>
              <input value={keyword} onChange={(event) => setKeyword(event.target.value)} placeholder={decodeUnicodeEscapes("搜索需求名称、项目、客户、提出人或负责人")} className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 shadow-sm outline-none transition focus:border-sky-300 focus:ring-2 focus:ring-sky-100" />
            </label>

            {message ? <div className={`mt-4 rounded-2xl px-4 py-3 text-sm ${messageTone === "error" ? "border border-rose-200 bg-rose-50 text-rose-700" : "border border-emerald-200 bg-emerald-50 text-emerald-700"}`}>{decodeUnicodeEscapes(message)}</div> : null}

            <div className="mt-4 max-h-[calc(100vh-21rem)] space-y-3 overflow-y-auto pr-1">
              {filteredRequirements.length ? filteredRequirements.map((item) => <RequirementSummaryCard key={item.id} item={item} selected={selectedId === item.id && mode === "edit"} onClick={(selected) => { setSelectedId(selected.id); setMode("edit"); setShowDeleteConfirm(false); }} />) : <div className="rounded-[1.75rem] border border-dashed border-slate-300 bg-slate-50 px-5 py-10 text-center text-sm text-slate-500">{decodeUnicodeEscapes("暂无匹配的维护对象。")}</div>}
            </div>
          </aside>

          <section>
            {loading ? <div className="mb-3 text-sm text-slate-500">{decodeUnicodeEscapes("正在加载需求详情...")}</div> : null}
            <RequirementEditor mode={mode} draft={draft} currentRequirement={selectedRequirement} onChange={setDraft} onSubmit={() => { void handleSubmit(); }} onSync={() => { void handleSync(); }} onDelete={() => setShowDeleteConfirm(true)} saving={saving} deleting={deleting} />
          </section>
        </div>
      </div>

      {showDeleteConfirm && selectedRequirement ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 px-4">
          <div className="w-full max-w-md rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-2xl">
            <h3 className="text-xl font-semibold text-slate-900">{decodeUnicodeEscapes("\u5220\u9664\u9700\u6c42")}</h3>
            <p className="mt-3 whitespace-pre-line text-sm leading-7 text-slate-600">{decodeUnicodeEscapes("\u4f60\u5c06\u5220\u9664\u8be5\u9700\u6c42\u53ca\u5176\u5173\u8054\u7684\u9636\u6bb5\u4fe1\u606f\u3002\n\u8be5\u64cd\u4f5c\u4e0d\u53ef\u6062\u590d\uff0c\u8bf7\u786e\u8ba4\u662f\u5426\u7ee7\u7eed\u3002")}</p>
            <div className="mt-6 flex justify-end gap-3">
              <button type="button" onClick={() => setShowDeleteConfirm(false)} disabled={deleting} className="rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-slate-300 disabled:cursor-not-allowed disabled:opacity-60">{decodeUnicodeEscapes("\u53d6\u6d88")}</button>
              <button type="button" onClick={() => { void handleDeleteConfirmed(); }} disabled={deleting} className="rounded-2xl bg-rose-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-60">{decodeUnicodeEscapes(deleting ? "\u5220\u9664\u4e2d..." : "\u786e\u8ba4\u5220\u9664")}</button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
