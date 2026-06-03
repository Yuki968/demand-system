import { RequirementStatus } from "@/generated/prisma/client";
import { NextRequest } from "next/server";

import { requireAdminAccess } from "@/lib/admin-auth";
import { jsonError, jsonSuccess } from "@/lib/http";
import {
  createRequirement,
  getMaxRequirementNo,
  getRequirementById,
  getRequirements,
  initializeStages,
} from "@/repositories/requirementRepository";
import { parseDateOnly } from "@/services/requirement/date";
import { syncRequirement } from "@/services/requirement/syncRequirement";
import { parseRequirementQueryParams, validateCreateRequirementInput } from "@/services/requirement/validation";

export async function GET(request: NextRequest) {
  try {
    const params = parseRequirementQueryParams(request.nextUrl.searchParams);
    const data = await getRequirements(params);
    return jsonSuccess(data);
  } catch (error) {
    return jsonError(error instanceof Error ? error.message : "获取需求列表失败", 500);
  }
}

export async function POST(request: Request) {
  try {
    const access = await requireAdminAccess();

    if (!access.ok) {
      return jsonError(access.message, access.status);
    }

    const payload = await request.json();
    const { data, errors } = validateCreateRequirementInput(payload);

    if (errors.length > 0 || !data) {
      return jsonError("创建需求失败", 400, errors);
    }

    const requirementNo = (await getMaxRequirementNo()) + 1;
    const createdAt = parseDateOnly(data.createdAt);

    if (!createdAt) {
      return jsonError("创建需求失败", 400, ["提出日期必须是 YYYY-MM-DD"]);
    }

    const created = await createRequirement({
      requirementNo,
      createdAt,
      requirementName: data.requirementName,
      requirementType: data.requirementType,
      requirementBelong: data.requirementBelong,
      priority: data.priority,
      currentStatus: RequirementStatus.DEMAND_CREATED,
      currentOwner: data.createdBy,
      createdBy: data.createdBy,
      relatedCustomer: data.relatedCustomer ?? null,
      relatedProject: data.relatedProject ?? null,
      isFinished: false,
      totalDurationValue: null,
      totalDurationIsManual: false,
    });

    await initializeStages(created.id, createdAt, data.createdBy);
    await syncRequirement(created.id);

    const detail = await getRequirementById(created.id);
    return jsonSuccess(detail, { status: 201 });
  } catch (error) {
    return jsonError(error instanceof Error ? error.message : "创建需求失败", 500);
  }
}
