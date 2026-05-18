import type { Prisma, RequirementStage } from "@/generated/prisma/client";

import {
  AFTER_SALES_OWNER,
  STAGE_ORDER_MAP,
  STAGE_SEQUENCE,
} from "@/constants/requirement";
import {
  getRequirementEntityById,
  replaceStageSnapshots,
  updateRequirement,
} from "@/repositories/requirementRepository";
import {
  daysInclusive,
  todayDateOnly,
} from "@/services/requirement/date";
import type { StageNameKey } from "@/types/requirement";

function hasProductIntakeStarted(stage: RequirementStage | undefined) {
  if (!stage) {
    return false;
  }

  return Boolean(
    stage.ownerName ||
      stage.startTime ||
      stage.endTime ||
      stage.outputProductRequirement ||
      stage.outputSolution ||
      stage.relatedCustomer,
  );
}

function hasImplementationStarted(stage: RequirementStage | undefined) {
  if (!stage) {
    return false;
  }

  return Boolean(
    stage.ownerName ||
      stage.startTime ||
      stage.endTime ||
      stage.planCompleted ||
      stage.deliveryCompleted ||
      stage.feedbackStatus ||
      stage.feedbackContent ||
      stage.includeNextProduct ||
      stage.targetProduct,
  );
}

function resolveCurrentStatus(
  stagesByName: Partial<Record<StageNameKey, RequirementStage>>,
  isClosed: boolean,
) {
  if (isClosed) {
    return "CLOSED" as const;
  }

  if (stagesByName.IMPLEMENTATION_DELIVERY?.stageReached) {
    return "IMPLEMENTATION_DELIVERY" as const;
  }

  if (stagesByName.PRODUCT_INTAKE?.stageReached) {
    return "PRODUCT_INTAKE" as const;
  }

  return "DEMAND_CREATED" as const;
}

function resolveCurrentOwner(
  currentStatus: string,
  createdBy: string,
  stagesByName: Partial<Record<StageNameKey, RequirementStage>>,
) {
  if (currentStatus === "CLOSED") {
    return null;
  }

  const stageOwner = stagesByName[currentStatus as StageNameKey]?.ownerName ?? null;

  if (currentStatus === "DEMAND_CREATED") {
    return stageOwner ?? createdBy;
  }

  if (currentStatus === "IMPLEMENTATION_DELIVERY") {
    return stageOwner ?? AFTER_SALES_OWNER;
  }

  return stageOwner;
}

export async function syncRequirement(requirementId: number) {
  const requirement = await getRequirementEntityById(requirementId);

  if (!requirement) {
    throw new Error("需求不存在");
  }

  const today = todayDateOnly();
  const stages = [...requirement.stages]
    .filter((stage): stage is RequirementStage & { stageName: StageNameKey } =>
      STAGE_SEQUENCE.includes(stage.stageName as StageNameKey),
    )
    .sort((left, right) => STAGE_ORDER_MAP[left.stageName] - STAGE_ORDER_MAP[right.stageName]);
  const stagesByName = Object.fromEntries(stages.map((stage) => [stage.stageName, stage])) as Partial<
    Record<StageNameKey, RequirementStage>
  >;

  const demandStage = stagesByName.DEMAND_CREATED;
  const productStage = stagesByName.PRODUCT_INTAKE;
  const implementationStage = stagesByName.IMPLEMENTATION_DELIVERY;

  const productReached = hasProductIntakeStarted(productStage);
  const implementationReached = hasImplementationStarted(implementationStage);
  const isClosed =
    implementationStage?.deliveryCompleted === "YES" &&
    implementationStage?.feedbackStatus === "FEEDBACK_RECEIVED";

  if (demandStage) {
    demandStage.stageReached = true;
    demandStage.stageOrder = STAGE_ORDER_MAP.DEMAND_CREATED;
  }

  if (productStage) {
    productStage.stageReached = productReached;
    productStage.stageOrder = STAGE_ORDER_MAP.PRODUCT_INTAKE;
  }

  if (implementationStage) {
    implementationStage.stageReached = implementationReached;
    implementationStage.stageOrder = STAGE_ORDER_MAP.IMPLEMENTATION_DELIVERY;
  }

  for (const stage of stages) {
    if (!stage.durationIsManual) {
      stage.durationValue = stage.startTime
        ? daysInclusive(stage.startTime, stage.endTime ?? today)
        : null;
    }
  }

  const currentStatus = resolveCurrentStatus(stagesByName, isClosed);
  const currentOwner = resolveCurrentOwner(currentStatus, requirement.createdBy, stagesByName);
  const isFinished = isClosed;
  const totalDurationValue = requirement.totalDurationIsManual
    ? requirement.totalDurationValue
    : demandStage?.startTime
      ? daysInclusive(
          demandStage.startTime,
          isFinished ? implementationStage?.endTime ?? today : today,
        )
      : null;

  const stageUpdates = stages.map((stage) => ({
    stageName: stage.stageName,
    stageOrder: stage.stageOrder,
    stageReached: stage.stageReached,
    ownerName: stage.ownerName,
    startTime: stage.startTime,
    endTime: stage.endTime,
    relatedCustomer: stage.relatedCustomer,
    outputProductRequirement: stage.outputProductRequirement,
    outputSolution: stage.outputSolution,
    planCompleted: stage.planCompleted,
    deliveryCompleted: stage.deliveryCompleted,
    feedbackStatus: stage.feedbackStatus,
    feedbackContent: stage.feedbackContent,
    includeNextProduct: stage.includeNextProduct,
    targetProduct: stage.targetProduct,
    durationValue: stage.durationValue,
    durationIsManual: stage.durationIsManual,
  })) satisfies Array<
    Prisma.RequirementStageUncheckedUpdateInput & {
      stageName: (typeof STAGE_SEQUENCE)[number];
    }
  >;

  await replaceStageSnapshots(requirement.id, stageUpdates);

  return updateRequirement(requirement.id, {
    currentStatus,
    currentOwner,
    isFinished,
    totalDurationValue,
  });
}
