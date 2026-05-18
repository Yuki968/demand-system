import { NextRequest } from "next/server";

import { jsonError, jsonSuccess } from "@/lib/http";
import { getRequirementById } from "@/repositories/requirementRepository";
import { syncRequirement } from "@/services/requirement/syncRequirement";

function parseRequirementId(value: string) {
  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : null;
}

export async function POST(_request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const params = await context.params;
    const id = parseRequirementId(params.id);

    if (!id) {
      return jsonError("需求 ID 无效");
    }

    await syncRequirement(id);
    const detail = await getRequirementById(id);
    return jsonSuccess(detail);
  } catch (error) {
    return jsonError(error instanceof Error ? error.message : "同步失败", 500);
  }
}
