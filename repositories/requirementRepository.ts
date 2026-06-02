import type { Prisma, RequirementStage } from "@/generated/prisma/client";

import { STAGE_ORDER_MAP, STAGE_SEQUENCE } from "@/constants/requirement";
import { prisma } from "@/lib/prisma";
import { formatDate, parseDateOnly } from "@/services/requirement/date";
import type {
  RequirementQueryParams,
  RequirementRecord,
  RequirementStageRecord,
  StageNameKey,
  UpdateRequirementInput,
} from "@/types/requirement";

const requirementInclude = {
  stages: {
    orderBy: {
      stageOrder: "asc",
    },
  },
} satisfies Prisma.RequirementInclude;

export type RequirementEntity = Prisma.RequirementGetPayload<{
  include: typeof requirementInclude;
}>;

function serializeStage(stage: RequirementStage): RequirementStageRecord {
  return {
    id: stage.id,
    requirementId: stage.requirementId,
    stageName: stage.stageName as StageNameKey,
    stageOrder: stage.stageOrder,
    stageReached: stage.stageReached,
    ownerName: stage.ownerName,
    startTime: formatDate(stage.startTime),
    endTime: formatDate(stage.endTime),
    relatedCustomer: stage.relatedCustomer,
    blockingReason: stage.blockingReason,
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
    updatedAt: formatDate(stage.updatedAt) ?? "",
  };
}

export function serializeRequirement(entity: RequirementEntity): RequirementRecord {
  return {
    id: entity.id,
    requirementNo: entity.requirementNo,
    createdAt: formatDate(entity.createdAt) ?? "",
    requirementName: entity.requirementName,
    requirementType: entity.requirementType,
    requirementBelong: entity.requirementBelong,
    priority: entity.priority,
    currentStatus: entity.currentStatus,
    currentOwner: entity.currentOwner,
    relatedProject: entity.relatedProject,
    createdBy: entity.createdBy,
    relatedCustomer: entity.relatedCustomer,
    isFinished: entity.isFinished,
    totalDurationValue: entity.totalDurationValue,
    totalDurationIsManual: entity.totalDurationIsManual,
    updatedAt: formatDate(entity.updatedAt) ?? "",
    stages: entity.stages.map(serializeStage),
  };
}

export async function getRequirements(params: RequirementQueryParams = {}) {
  const where: Prisma.RequirementWhereInput = {};

  if (params.status) {
    where.currentStatus = params.status;
  }

  if (params.owner?.trim()) {
    where.currentOwner = {
      contains: params.owner.trim(),
    };
  }

  if (params.type) {
    where.requirementType = params.type;
  }

  if (params.keyword?.trim()) {
    where.OR = [
      {
        requirementName: {
          contains: params.keyword.trim(),
        },
      },
      {
        relatedProject: {
          contains: params.keyword.trim(),
        },
      },
      {
        relatedCustomer: {
          contains: params.keyword.trim(),
        },
      },
      {
        createdBy: {
          contains: params.keyword.trim(),
        },
      },
    ];
  }

  const items = await prisma.requirement.findMany({
    where,
    include: requirementInclude,
    orderBy: [{ updatedAt: "desc" }, { requirementNo: "desc" }],
  });

  return items.map(serializeRequirement);
}

export async function getRequirementById(id: number) {
  const item = await prisma.requirement.findUnique({
    where: { id },
    include: requirementInclude,
  });

  return item ? serializeRequirement(item) : null;
}

export async function getRequirementEntityById(id: number) {
  return prisma.requirement.findUnique({
    where: { id },
    include: requirementInclude,
  });
}

export async function getMaxRequirementNo() {
  const item = await prisma.requirement.findFirst({
    orderBy: { requirementNo: "desc" },
    select: { requirementNo: true },
  });

  return item?.requirementNo ?? 0;
}

export async function createRequirement(data: Prisma.RequirementUncheckedCreateInput) {
  return prisma.requirement.create({
    data,
    include: requirementInclude,
  });
}

export async function updateRequirement(id: number, data: Prisma.RequirementUncheckedUpdateInput) {
  return prisma.requirement.update({
    where: { id },
    data,
    include: requirementInclude,
  });
}

export async function updateStage(
  requirementId: number,
  stageName: StageNameKey,
  data: Prisma.RequirementStageUncheckedUpdateInput,
) {
  return prisma.requirementStage.update({
    where: {
      requirementId_stageName: {
        requirementId,
        stageName,
      },
    },
    data,
  });
}

export async function batchUpdateStages(
  requirementId: number,
  stages: UpdateRequirementInput["stages"] = [],
) {
  return prisma.$transaction(
    stages.map((stage) =>
      prisma.requirementStage.update({
        where: {
          requirementId_stageName: {
            requirementId,
            stageName: stage.stageName,
          },
        },
        data: {
          ownerName: stage.ownerName === undefined ? undefined : stage.ownerName || null,
          startTime:
            stage.startTime === undefined ? undefined : parseDateOnly(stage.startTime),
          endTime:
            stage.endTime === undefined ? undefined : parseDateOnly(stage.endTime),
          relatedCustomer:
            stage.relatedCustomer === undefined ? undefined : stage.relatedCustomer || null,
          blockingReason:
            stage.blockingReason === undefined ? undefined : stage.blockingReason || null,
          outputProductRequirement:
            stage.outputProductRequirement === undefined
              ? undefined
              : stage.outputProductRequirement,
          outputSolution:
            stage.outputSolution === undefined ? undefined : stage.outputSolution,
          planCompleted:
            stage.planCompleted === undefined ? undefined : stage.planCompleted,
          deliveryCompleted:
            stage.deliveryCompleted === undefined ? undefined : stage.deliveryCompleted,
          feedbackStatus:
            stage.feedbackStatus === undefined ? undefined : stage.feedbackStatus,
          feedbackContent:
            stage.feedbackContent === undefined ? undefined : stage.feedbackContent || null,
          includeNextProduct:
            stage.includeNextProduct === undefined ? undefined : stage.includeNextProduct,
          targetProduct:
            stage.targetProduct === undefined ? undefined : stage.targetProduct || null,
          durationValue: null,
          durationIsManual: false,
        },
      }),
    ),
  );
}

export async function initializeStages(
  requirementId: number,
  createdAt: Date,
  createdBy: string,
) {
  return prisma.requirementStage.createMany({
    data: STAGE_SEQUENCE.map((stageName) => ({
      requirementId,
      stageName,
      stageOrder: STAGE_ORDER_MAP[stageName],
      stageReached: stageName === "DEMAND_CREATED",
      startTime: stageName === "DEMAND_CREATED" ? createdAt : null,
      ownerName: stageName === "DEMAND_CREATED" ? createdBy : null,
      relatedCustomer: null,
      blockingReason: null,
    })),
  });
}

export async function replaceStageSnapshots(
  requirementId: number,
  stages: Array<Prisma.RequirementStageUncheckedUpdateInput & { stageName: StageNameKey }>,
) {
  return prisma.$transaction(
    stages.map((stage) =>
      prisma.requirementStage.update({
        where: {
          requirementId_stageName: {
            requirementId,
            stageName: stage.stageName,
          },
        },
        data: stage,
      }),
    ),
  );
}

export async function deleteRequirementCascade(id: number) {
  return prisma.$transaction(async (tx) => {
    await tx.requirementStage.deleteMany({
      where: {
        requirementId: id,
      },
    });

    return tx.requirement.delete({
      where: { id },
      include: requirementInclude,
    });
  });
}

export async function clearAllRequirements() {
  await prisma.requirementStage.deleteMany();
  await prisma.requirement.deleteMany();
}

export async function clearFieldOptions() {
  await prisma.fieldOption.deleteMany();
}

export async function createFieldOptions(data: Prisma.FieldOptionCreateManyInput[]) {
  await prisma.fieldOption.createMany({ data });
}

export async function listFieldOptions() {
  return prisma.fieldOption.findMany({
    where: { isActive: true },
    orderBy: [{ fieldName: "asc" }, { optionOrder: "asc" }],
  });
}
