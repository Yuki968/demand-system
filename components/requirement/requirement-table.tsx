"use client";

import {
  REQUIREMENT_BELONG_LABELS,
  REQUIREMENT_TYPE_LABELS,
} from "@/constants/requirement";
import { PriorityBadge, StatusBadge } from "@/components/requirement/badges";
import { cn } from "@/lib/utils";
import type { RequirementRecord } from "@/types/requirement";

export function RequirementTable({
  items,
  selectedId,
  onSelect,
}: {
  items: RequirementRecord[];
  selectedId?: number;
  onSelect: (item: RequirementRecord) => void;
}) {
  return (
    <div className="overflow-hidden rounded-3xl border border-[var(--border-soft)] bg-white shadow-[var(--shadow-panel)]">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-100 text-sm">
          <thead className="bg-slate-50 text-left text-xs uppercase tracking-[0.2em] text-slate-500">
            <tr>
              {[
                "编号",
                "提出日期",
                "需求名称",
                "需求类型",
                "归属",
                "优先级",
                "当前状态",
                "当前负责人",
                "关联项目",
                "总时长",
              ].map((column) => (
                <th key={column} className="px-4 py-3 font-semibold">{column}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {items.map((item) => {
              const demandStage = item.stages.find((stage) => stage.stageName === "DEMAND_CREATED");

              return (
                <tr
                  key={item.id}
                  className={cn(
                    "cursor-pointer transition hover:bg-sky-50/70",
                    selectedId === item.id && "bg-sky-50",
                  )}
                  onClick={() => onSelect(item)}
                >
                  <td className="px-4 py-4 font-semibold text-slate-700">#{item.requirementNo}</td>
                  <td className="px-4 py-4 text-slate-500">{demandStage?.startTime ?? item.createdAt}</td>
                  <td className="px-4 py-4">
                    <div className="min-w-[220px]">
                      <p className="font-semibold text-slate-900">{item.requirementName}</p>
                      <p className="mt-1 text-xs text-slate-500">提出人 {demandStage?.ownerName ?? item.createdBy}</p>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-slate-600">{REQUIREMENT_TYPE_LABELS[item.requirementType]}</td>
                  <td className="px-4 py-4 text-slate-600">{REQUIREMENT_BELONG_LABELS[item.requirementBelong]}</td>
                  <td className="px-4 py-4"><PriorityBadge priority={item.priority} /></td>
                  <td className="px-4 py-4"><StatusBadge status={item.currentStatus} /></td>
                  <td className="px-4 py-4 text-slate-600">{item.currentOwner ?? "待分配"}</td>
                  <td className="px-4 py-4 text-slate-600">{item.relatedProject ?? "-"}</td>
                  <td className="px-4 py-4 font-semibold text-slate-700">{item.totalDurationValue ? `${item.totalDurationValue} 天` : "-"}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
