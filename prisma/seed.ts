import "dotenv/config";

import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

import { PrismaClient } from "../generated/prisma/client";

function getDatabaseUrl() {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    throw new Error("DATABASE_URL is not defined");
  }

  return databaseUrl;
}

function createPrismaClient() {
  const adapter = new PrismaBetterSqlite3(
    {
      url: getDatabaseUrl(),
    },
    {
      timestampFormat: "unixepoch-ms",
    },
  );

  return new PrismaClient({ adapter });
}

const prisma = createPrismaClient();

const stageSequence = [
  "DEMAND_CREATED",
  "PRODUCT_INTAKE",
  "IMPLEMENTATION_DELIVERY",
] as const;

const fixedFieldOptions = [
  ["requirementType", "PRODUCT_PLANNING", "产品规划需求", 1],
  ["requirementType", "PRODUCT_ITERATION", "产品迭代需求", 2],
  ["requirementType", "CUSTOMER_CUSTOMIZATION", "客户定制需求", 3],
  ["requirementType", "DATA_AND_OPERATION", "数据与运营需求", 4],
  ["requirementBelong", "TWO_POINT_ZERO", "2.0", 1],
  ["requirementBelong", "THREE_POINT_ZERO", "3.0", 2],
  ["requirementBelong", "SMALL_POT", "小锅", 3],
  ["priority", "VERY_HIGH", "极高", 1],
  ["priority", "HIGH", "高", 2],
  ["priority", "MEDIUM", "中", 3],
  ["currentStatus", "DEMAND_CREATED", "需求提出", 1],
  ["currentStatus", "PRODUCT_INTAKE", "产品承接", 2],
  ["currentStatus", "IMPLEMENTATION_DELIVERY", "交付验收", 3],
  ["currentStatus", "CLOSED", "已完成", 4],
  ["yesNo", "YES", "是", 1],
  ["yesNo", "NO", "否", 2],
  ["feedbackStatus", "FEEDBACK_RECEIVED", "已反馈", 1],
  ["feedbackStatus", "FEEDBACK_PENDING", "未反馈", 2],
] as const;

function dateOnly(value: string) {
  return new Date(`${value}T00:00:00.000Z`);
}

function diffDays(start: Date, end: Date) {
  return Math.floor((end.getTime() - start.getTime()) / (24 * 60 * 60 * 1000)) + 1;
}

async function resetData() {
  await prisma.requirementStage.deleteMany();
  await prisma.requirement.deleteMany();
  await prisma.fieldOption.deleteMany();
}

async function seedFieldOptions() {
  await prisma.fieldOption.createMany({
    data: fixedFieldOptions.map(([fieldName, optionValue, optionLabel, optionOrder]) => ({
      fieldName,
      optionValue,
      optionLabel,
      optionGroup: "fixed",
      optionOrder,
      isActive: true,
    })),
  });
}

type StageSeedMap = Record<
  (typeof stageSequence)[number],
  Partial<{
    stageReached: boolean;
    ownerName: string | null;
    startTime: string | null;
    endTime: string | null;
    relatedCustomer: string | null;
    outputProductRequirement: "YES" | "NO" | null;
    outputSolution: "YES" | "NO" | null;
    planCompleted: "YES" | "NO" | null;
    deliveryCompleted: "YES" | "NO" | null;
    feedbackStatus: "FEEDBACK_RECEIVED" | "FEEDBACK_PENDING" | null;
    feedbackContent: string | null;
    includeNextProduct: "YES" | "NO" | null;
    targetProduct: string | null;
    durationValue: number | null;
  }>
>;

async function createRequirementWithStages(input: {
  requirementNo: number;
  createdAt: string;
  requirementName: string;
  requirementType: "PRODUCT_PLANNING" | "PRODUCT_ITERATION" | "CUSTOMER_CUSTOMIZATION" | "DATA_AND_OPERATION";
  requirementBelong: "TWO_POINT_ZERO" | "THREE_POINT_ZERO" | "SMALL_POT";
  priority: "VERY_HIGH" | "HIGH" | "MEDIUM";
  currentStatus: "DEMAND_CREATED" | "PRODUCT_INTAKE" | "IMPLEMENTATION_DELIVERY" | "CLOSED";
  currentOwner: string | null;
  relatedProject: string | null;
  createdBy: string;
  relatedCustomer: string | null;
  isFinished: boolean;
  totalDurationValue: number;
  stages: StageSeedMap;
}) {
  const createdAt = dateOnly(input.createdAt);
  const requirement = await prisma.requirement.create({
    data: {
      requirementNo: input.requirementNo,
      createdAt,
      requirementName: input.requirementName,
      requirementType: input.requirementType,
      requirementBelong: input.requirementBelong,
      priority: input.priority,
      currentStatus: input.currentStatus,
      currentOwner: input.currentOwner,
      relatedProject: input.relatedProject,
      createdBy: input.createdBy,
      relatedCustomer: input.relatedCustomer,
      isFinished: input.isFinished,
      totalDurationValue: input.totalDurationValue,
      totalDurationIsManual: false,
    },
  });

  await prisma.requirementStage.createMany({
    data: stageSequence.map((stageName, index) => {
      const stage = input.stages[stageName] ?? {};
      return {
        requirementId: requirement.id,
        stageName,
        stageOrder: index + 1,
        stageReached: Boolean(stage.stageReached),
        ownerName: stage.ownerName ?? null,
        startTime: stage.startTime ? dateOnly(stage.startTime) : null,
        endTime: stage.endTime ? dateOnly(stage.endTime) : null,
        relatedCustomer: stage.relatedCustomer ?? null,
        outputProductRequirement: stage.outputProductRequirement ?? null,
        outputSolution: stage.outputSolution ?? null,
        planCompleted: stage.planCompleted ?? null,
        deliveryCompleted: stage.deliveryCompleted ?? null,
        feedbackStatus: stage.feedbackStatus ?? null,
        feedbackContent: stage.feedbackContent ?? null,
        includeNextProduct: stage.includeNextProduct ?? null,
        targetProduct: stage.targetProduct ?? null,
        durationValue: stage.durationValue ?? null,
        durationIsManual: false,
      };
    }),
  });
}

async function seedRequirements() {
  await createRequirementWithStages({
    requirementNo: 1001,
    createdAt: "2026-03-20",
    requirementName: "仪表盘全链路埋点梳理",
    requirementType: "DATA_AND_OPERATION",
    requirementBelong: "THREE_POINT_ZERO",
    priority: "MEDIUM",
    currentStatus: "DEMAND_CREATED",
    currentOwner: "李卓",
    relatedProject: "增长数据底座",
    createdBy: "李卓",
    relatedCustomer: "内部运营中心",
    isFinished: false,
    totalDurationValue: diffDays(dateOnly("2026-03-20"), dateOnly("2026-03-28")),
    stages: {
      DEMAND_CREATED: {
        stageReached: true,
        ownerName: "李卓",
        startTime: "2026-03-20",
        durationValue: diffDays(dateOnly("2026-03-20"), dateOnly("2026-03-28")),
        relatedCustomer: "内部运营中心",
      },
      PRODUCT_INTAKE: {},
      IMPLEMENTATION_DELIVERY: {},
    },
  });

  await createRequirementWithStages({
    requirementNo: 1002,
    createdAt: "2026-03-10",
    requirementName: "客户门户权限拆分优化",
    requirementType: "CUSTOMER_CUSTOMIZATION",
    requirementBelong: "TWO_POINT_ZERO",
    priority: "HIGH",
    currentStatus: "PRODUCT_INTAKE",
    currentOwner: "王敏",
    relatedProject: "客户门户 2.0",
    createdBy: "周怡",
    relatedCustomer: "华东大客户组",
    isFinished: false,
    totalDurationValue: diffDays(dateOnly("2026-03-10"), dateOnly("2026-03-28")),
    stages: {
      DEMAND_CREATED: {
        stageReached: true,
        ownerName: "周怡",
        startTime: "2026-03-10",
        endTime: "2026-03-12",
        durationValue: diffDays(dateOnly("2026-03-10"), dateOnly("2026-03-12")),
        relatedCustomer: "华东大客户组",
      },
      PRODUCT_INTAKE: {
        stageReached: true,
        ownerName: "王敏",
        startTime: "2026-03-12",
        durationValue: diffDays(dateOnly("2026-03-12"), dateOnly("2026-03-28")),
        relatedCustomer: "华东大客户组",
      },
      IMPLEMENTATION_DELIVERY: {},
    },
  });

  await createRequirementWithStages({
    requirementNo: 1003,
    createdAt: "2026-02-25",
    requirementName: "标准商品建模与字段治理",
    requirementType: "PRODUCT_PLANNING",
    requirementBelong: "THREE_POINT_ZERO",
    priority: "HIGH",
    currentStatus: "PRODUCT_INTAKE",
    currentOwner: "陈璐",
    relatedProject: "商品中台",
    createdBy: "赵楠",
    relatedCustomer: "零售业务部",
    isFinished: false,
    totalDurationValue: diffDays(dateOnly("2026-02-25"), dateOnly("2026-03-28")),
    stages: {
      DEMAND_CREATED: {
        stageReached: true,
        ownerName: "赵楠",
        startTime: "2026-02-25",
        endTime: "2026-02-28",
        durationValue: diffDays(dateOnly("2026-02-25"), dateOnly("2026-02-28")),
        relatedCustomer: "零售业务部",
      },
      PRODUCT_INTAKE: {
        stageReached: true,
        ownerName: "陈璐",
        startTime: "2026-02-28",
        outputProductRequirement: "YES",
        outputSolution: "YES",
        durationValue: diffDays(dateOnly("2026-03-06"), dateOnly("2026-03-28")),
      },
      IMPLEMENTATION_DELIVERY: {},
    },
  });

  await createRequirementWithStages({
    requirementNo: 1004,
    createdAt: "2026-02-01",
    requirementName: "门店导购任务看板升级",
    requirementType: "PRODUCT_ITERATION",
    requirementBelong: "SMALL_POT",
    priority: "MEDIUM",
    currentStatus: "IMPLEMENTATION_DELIVERY",
    currentOwner: "何青",
    relatedProject: "门店运营平台",
    createdBy: "顾航",
    relatedCustomer: "西南区域",
    isFinished: false,
    totalDurationValue: diffDays(dateOnly("2026-02-01"), dateOnly("2026-03-28")),
    stages: {
      DEMAND_CREATED: {
        stageReached: true,
        ownerName: "顾航",
        startTime: "2026-02-01",
        endTime: "2026-02-03",
        durationValue: diffDays(dateOnly("2026-02-01"), dateOnly("2026-02-03")),
        relatedCustomer: "西南区域",
      },
      PRODUCT_INTAKE: {
        stageReached: true,
        ownerName: "孙宁",
        startTime: "2026-02-03",
        endTime: "2026-02-10",
        outputProductRequirement: "YES",
        outputSolution: "YES",
        durationValue: diffDays(dateOnly("2026-02-10"), dateOnly("2026-02-18")),
      },
      IMPLEMENTATION_DELIVERY: {
        stageReached: true,
        ownerName: "何青",
        startTime: "2026-02-18",
        planCompleted: "NO",
        deliveryCompleted: "NO",
        durationValue: diffDays(dateOnly("2026-02-18"), dateOnly("2026-03-28")),
      },
    },
  });

  await createRequirementWithStages({
    requirementNo: 1005,
    createdAt: "2026-01-05",
    requirementName: "大客户定制报价流程闭环",
    requirementType: "CUSTOMER_CUSTOMIZATION",
    requirementBelong: "TWO_POINT_ZERO",
    priority: "HIGH",
    currentStatus: "CLOSED",
    currentOwner: null,
    relatedProject: "报价与审批链路",
    createdBy: "高玥",
    relatedCustomer: "华北 KA",
    isFinished: true,
    totalDurationValue: diffDays(dateOnly("2026-01-05"), dateOnly("2026-02-20")),
    stages: {
      DEMAND_CREATED: {
        stageReached: true,
        ownerName: "高玥",
        startTime: "2026-01-05",
        endTime: "2026-01-07",
        durationValue: diffDays(dateOnly("2026-01-05"), dateOnly("2026-01-07")),
        relatedCustomer: "华北 KA",
      },
      PRODUCT_INTAKE: {
        stageReached: true,
        ownerName: "吴涛",
        startTime: "2026-01-07",
        endTime: "2026-01-12",
        outputProductRequirement: "YES",
        outputSolution: "YES",
        durationValue: diffDays(dateOnly("2026-01-12"), dateOnly("2026-01-18")),
      },
      IMPLEMENTATION_DELIVERY: {
        stageReached: true,
        ownerName: "黄波",
        startTime: "2026-01-18",
        endTime: "2026-02-20",
        planCompleted: "YES",
        deliveryCompleted: "YES",
        feedbackStatus: "FEEDBACK_RECEIVED",
        feedbackContent: "客户确认流程可用，后续沉淀为行业模板。",
        includeNextProduct: "YES",
        targetProduct: "报价标准化 3.1",
        durationValue: diffDays(dateOnly("2026-01-18"), dateOnly("2026-02-20")),
      },
    },
  });
}

async function main() {
  await resetData();
  await seedFieldOptions();
  await seedRequirements();
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
