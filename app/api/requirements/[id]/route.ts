import { NextRequest } from "next/server";

import { requireAdminAccess } from "@/lib/admin-auth";
import { jsonError, jsonSuccess } from "@/lib/http";
import {
  batchUpdateStages,
  deleteRequirementCascade,
  getRequirementById,
  updateRequirement,
} from "@/repositories/requirementRepository";
import { parseDateOnly } from "@/services/requirement/date";
import { syncRequirement } from "@/services/requirement/syncRequirement";
import { validateUpdateRequirementInput } from "@/services/requirement/validation";

function parseRequirementId(value: string) {
  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : null;
}

export async function GET(_request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const params = await context.params;
    const id = parseRequirementId(params.id);

    if (!id) {
      return jsonError("需求 ID 无效");
    }

    const detail = await getRequirementById(id);
    if (!detail) {
      return jsonError("需求不存在", 404);
    }

    return jsonSuccess(detail);
  } catch (error) {
    return jsonError(error instanceof Error ? error.message : "获取需求详情失败", 500);
  }
}

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const access = await requireAdminAccess();

    if (!access.ok) {
      return jsonError(access.message, access.status);
    }

    const params = await context.params;
    const id = parseRequirementId(params.id);

    if (!id) {
      return jsonError("需求 ID 无效");
    }

    const payload = await request.json();
    const { data, errors } = validateUpdateRequirementInput(payload);

    if (errors.length > 0 || !data) {
      return jsonError("更新需求失败", 400, errors);
    }

    if (data.requirement) {
      const updateData = {
        requirementName: data.requirement.requirementName,
        requirementType: data.requirement.requirementType,
        requirementBelong: data.requirement.requirementBelong,
        priority: data.requirement.priority,
        createdBy: data.requirement.createdBy,
        relatedCustomer: data.requirement.relatedCustomer,
        relatedProject: data.requirement.relatedProject,
        totalDurationValue: data.requirement.totalDurationValue,
        totalDurationIsManual: data.requirement.totalDurationIsManual,
      } as Parameters<typeof updateRequirement>[1];

      if (data.requirement.createdAt !== undefined) {
        const createdAt = parseDateOnly(data.requirement.createdAt);
        if (!createdAt) {
          return jsonError("更新需求失败", 400, ["提出日期必须是 YYYY-MM-DD"]);
        }
        updateData.createdAt = createdAt;
      }

      await updateRequirement(id, updateData);
    }

    if (data.stages?.length) {
      await batchUpdateStages(id, data.stages);
    }

    await syncRequirement(id);

    const detail = await getRequirementById(id);
    return jsonSuccess(detail);
  } catch (error) {
    return jsonError(error instanceof Error ? error.message : "更新需求失败", 500);
  }
}

export async function DELETE(_request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const access = await requireAdminAccess();

    if (!access.ok) {
      return jsonError(access.message, access.status);
    }

    const params = await context.params;
    const id = parseRequirementId(params.id);

    if (!id) {
      return jsonError("需求 ID 无效");
    }

    const detail = await getRequirementById(id);
    if (!detail) {
      return jsonError("需求不存在", 404);
    }

    await deleteRequirementCascade(id);

    return jsonSuccess({
      id,
      requirementNo: detail.requirementNo,
    });
  } catch (error) {
    return jsonError(error instanceof Error ? error.message : "删除需求失败", 500);
  }
}
