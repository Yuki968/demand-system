import {
  FEEDBACK_STATUS_VALUES,
  PRIORITY_VALUES,
  REQUIREMENT_BELONG_VALUES,
  REQUIREMENT_TYPE_VALUES,
  STAGE_SEQUENCE,
  STATUS_VALUES,
  YES_NO_VALUES,
} from "@/constants/requirement";
import { isNonEmptyString } from "@/lib/utils";
import { compareDateOnly, isValidDateOnly } from "@/services/requirement/date";
import type {
  CreateRequirementInput,
  RequirementQueryParams,
  UpdateRequirementInput,
} from "@/types/requirement";

function ensureEnum<TValue extends string>(
  value: unknown,
  options: readonly TValue[],
  label: string,
  errors: string[],
) {
  if (value == null || value === "") {
    return undefined;
  }

  if (typeof value !== "string" || !options.includes(value as TValue)) {
    errors.push(`${label}无效`);
    return undefined;
  }

  return value as TValue;
}

function normalizeString(value: unknown) {
  if (value == null || value === "") {
    return null;
  }

  return typeof value === "string" ? value.trim() : null;
}

export function parseRequirementQueryParams(searchParams: URLSearchParams): RequirementQueryParams {
  const status = searchParams.get("status") ?? "";
  const owner = searchParams.get("owner") ?? "";
  const type = searchParams.get("type") ?? "";
  const keyword = searchParams.get("keyword") ?? "";

  return {
    status: STATUS_VALUES.includes(status as (typeof STATUS_VALUES)[number])
      ? (status as RequirementQueryParams["status"])
      : "",
    owner,
    type: REQUIREMENT_TYPE_VALUES.includes(type as (typeof REQUIREMENT_TYPE_VALUES)[number])
      ? (type as RequirementQueryParams["type"])
      : "",
    keyword,
  };
}

export function validateCreateRequirementInput(payload: unknown) {
  const errors: string[] = [];

  if (!payload || typeof payload !== "object") {
    return { errors: ["请求体不能为空"] };
  }

  const source = payload as Record<string, unknown>;
  const requirementName = normalizeString(source.requirementName);
  const createdAt = normalizeString(source.createdAt);
  const createdBy = normalizeString(source.createdBy);
  const requirementType = ensureEnum(source.requirementType, REQUIREMENT_TYPE_VALUES, "需求类型", errors);
  const requirementBelong = ensureEnum(source.requirementBelong, REQUIREMENT_BELONG_VALUES, "需求归属", errors);
  const priority = ensureEnum(source.priority, PRIORITY_VALUES, "优先级", errors);

  if (!isNonEmptyString(requirementName)) {
    errors.push("需求名称不能为空");
  }

  if (!createdAt || !isValidDateOnly(createdAt)) {
    errors.push("提出日期必须是 YYYY-MM-DD");
  }

  if (!isNonEmptyString(createdBy)) {
    errors.push("提出人不能为空");
  }

  if (errors.length > 0 || !requirementType || !requirementBelong || !priority || !createdAt || !requirementName || !createdBy) {
    return { errors };
  }

  const data: CreateRequirementInput = {
    requirementName,
    createdAt,
    createdBy,
    requirementType,
    requirementBelong,
    priority,
    relatedCustomer: normalizeString(source.relatedCustomer),
    relatedProject: normalizeString(source.relatedProject),
  };

  return { data, errors };
}

export function validateUpdateRequirementInput(payload: unknown) {
  const errors: string[] = [];

  if (!payload || typeof payload !== "object") {
    return { errors: ["请求体不能为空"] };
  }

  const source = payload as Record<string, unknown>;
  const result: UpdateRequirementInput = {};

  if (source.requirement && typeof source.requirement === "object") {
    const requirement = source.requirement as Record<string, unknown>;
    result.requirement = {};

    if ("requirementName" in requirement) {
      const value = normalizeString(requirement.requirementName);
      if (!value) {
        errors.push("需求名称不能为空");
      } else {
        result.requirement.requirementName = value;
      }
    }

    if ("createdAt" in requirement) {
      const value = normalizeString(requirement.createdAt);
      if (value && !isValidDateOnly(value)) {
        errors.push("提出日期必须是 YYYY-MM-DD");
      } else {
        result.requirement.createdAt = value ?? undefined;
      }
    }

    if ("createdBy" in requirement) {
      const value = normalizeString(requirement.createdBy);
      if (!value) {
        errors.push("提出人不能为空");
      } else {
        result.requirement.createdBy = value;
      }
    }

    if ("relatedCustomer" in requirement) {
      result.requirement.relatedCustomer = normalizeString(requirement.relatedCustomer);
    }

    if ("relatedProject" in requirement) {
      result.requirement.relatedProject = normalizeString(requirement.relatedProject);
    }

    if ("totalDurationValue" in requirement) {
      result.requirement.totalDurationValue = typeof requirement.totalDurationValue === "number" ? requirement.totalDurationValue : null;
    }

    if ("totalDurationIsManual" in requirement) {
      result.requirement.totalDurationIsManual = Boolean(requirement.totalDurationIsManual);
    }

    const requirementType = ensureEnum(requirement.requirementType, REQUIREMENT_TYPE_VALUES, "需求类型", errors);
    if (requirementType) {
      result.requirement.requirementType = requirementType;
    }

    const requirementBelong = ensureEnum(requirement.requirementBelong, REQUIREMENT_BELONG_VALUES, "需求归属", errors);
    if (requirementBelong) {
      result.requirement.requirementBelong = requirementBelong;
    }

    const priority = ensureEnum(requirement.priority, PRIORITY_VALUES, "优先级", errors);
    if (priority) {
      result.requirement.priority = priority;
    }
  }

  if (source.stages !== undefined) {
    if (!Array.isArray(source.stages)) {
      errors.push("阶段数据格式不正确");
    } else {
      result.stages = source.stages.map((entry, index) => {
        const stage = (entry ?? {}) as Record<string, unknown>;
        const stageErrors: string[] = [];
        const stageName = ensureEnum(stage.stageName, STAGE_SEQUENCE, `第 ${index + 1} 个阶段名称`, stageErrors);

        const startTime = normalizeString(stage.startTime);
        if (startTime && !isValidDateOnly(startTime)) {
          stageErrors.push(`第 ${index + 1} 个阶段开始时间格式不正确`);
        }

        const endTime = normalizeString(stage.endTime);
        if (endTime && !isValidDateOnly(endTime)) {
          stageErrors.push(`第 ${index + 1} 个阶段结束时间格式不正确`);
        }

        if (startTime && endTime && compareDateOnly(endTime, startTime) < 0) {
          stageErrors.push(`第 ${index + 1} 个阶段结束时间不能早于开始时间`);
        }

        const outputProductRequirement = ensureEnum(stage.outputProductRequirement, YES_NO_VALUES, `第 ${index + 1} 个阶段产出需求文档`, stageErrors);
        const outputSolution = ensureEnum(stage.outputSolution, YES_NO_VALUES, `第 ${index + 1} 个阶段产出方案`, stageErrors);
        const planCompleted = ensureEnum(stage.planCompleted, YES_NO_VALUES, `第 ${index + 1} 个阶段计划完成`, stageErrors);
        const deliveryCompleted = ensureEnum(stage.deliveryCompleted, YES_NO_VALUES, `第 ${index + 1} 个阶段交付完成`, stageErrors);
        const includeNextProduct = ensureEnum(stage.includeNextProduct, YES_NO_VALUES, `第 ${index + 1} 个阶段纳入下期产品`, stageErrors);
        const feedbackStatus = ensureEnum(stage.feedbackStatus, FEEDBACK_STATUS_VALUES, `第 ${index + 1} 个阶段反馈状态`, stageErrors);

        errors.push(...stageErrors);

        return {
          stageName: stageName ?? "DEMAND_CREATED",
          ownerName: "ownerName" in stage ? normalizeString(stage.ownerName) : undefined,
          startTime: "startTime" in stage ? startTime : undefined,
          endTime: "endTime" in stage ? endTime : undefined,
          relatedCustomer: "relatedCustomer" in stage ? normalizeString(stage.relatedCustomer) : undefined,
          outputProductRequirement: "outputProductRequirement" in stage ? outputProductRequirement ?? null : undefined,
          outputSolution: "outputSolution" in stage ? outputSolution ?? null : undefined,
          planCompleted: "planCompleted" in stage ? planCompleted ?? null : undefined,
          deliveryCompleted: "deliveryCompleted" in stage ? deliveryCompleted ?? null : undefined,
          feedbackStatus: "feedbackStatus" in stage ? feedbackStatus ?? null : undefined,
          feedbackContent: "feedbackContent" in stage ? normalizeString(stage.feedbackContent) : undefined,
          includeNextProduct: "includeNextProduct" in stage ? includeNextProduct ?? null : undefined,
          targetProduct: "targetProduct" in stage ? normalizeString(stage.targetProduct) : undefined,
        };
      });
    }
  }

  return { data: result, errors };
}
