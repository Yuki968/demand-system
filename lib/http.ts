import { NextResponse } from "next/server";

import type { ApiErrorResponse, ApiSuccessResponse } from "@/types/requirement";

export function jsonSuccess<TData>(data: TData, init?: ResponseInit) {
  return NextResponse.json<ApiSuccessResponse<TData>>(
    {
      success: true,
      data,
    },
    init,
  );
}

export function jsonError(message: string, status = 400, details?: string[]) {
  return NextResponse.json<ApiErrorResponse>(
    {
      success: false,
      error: {
        message,
        details,
      },
    },
    { status },
  );
}
