import type { RequirementStatusKey, RequirementStageRecord, StageNameKey } from "@/types/requirement";

export const STAGE_PROGRESS_SEQUENCE = [
  "DEMAND_CREATED",
  "PRODUCT_INTAKE",
  "IMPLEMENTATION_DELIVERY",
] as const satisfies readonly StageNameKey[];

export type StageProgressNameKey = (typeof STAGE_PROGRESS_SEQUENCE)[number];
export type StageProgressRecord = RequirementStageRecord & { stageName: StageProgressNameKey };

export const STAGE_PROGRESS_LABELS: Record<StageProgressNameKey, string> = {
  DEMAND_CREATED: "需求提出",
  PRODUCT_INTAKE: "产品承接",
  IMPLEMENTATION_DELIVERY: "交付验收",
};

export function isStageProgressVisible(stageName: StageNameKey): stageName is StageProgressNameKey {
  return STAGE_PROGRESS_SEQUENCE.includes(stageName as StageProgressNameKey);
}

export function getStageProgressOrder(stageName: StageNameKey) {
  return STAGE_PROGRESS_SEQUENCE.indexOf(stageName as StageProgressNameKey) + 1;
}

export function mapStatusToStageProgress(status: RequirementStatusKey): StageProgressNameKey {
  if (status === "CLOSED") {
    return "IMPLEMENTATION_DELIVERY";
  }

  return status;
}

export function getVisibleStageProgressRecords(stages: RequirementStageRecord[]): StageProgressRecord[] {
  return [...stages]
    .filter((stage): stage is StageProgressRecord => isStageProgressVisible(stage.stageName))
    .sort((left, right) => getStageProgressOrder(left.stageName) - getStageProgressOrder(right.stageName));
}
