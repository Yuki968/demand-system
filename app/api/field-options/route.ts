import { jsonError, jsonSuccess } from "@/lib/http";
import { listFieldOptions } from "@/repositories/requirementRepository";

export async function GET() {
  try {
    const data = await listFieldOptions();
    return jsonSuccess(data);
  } catch (error) {
    return jsonError(error instanceof Error ? error.message : "获取选项失败", 500);
  }
}
