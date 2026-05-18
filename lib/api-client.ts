import type { ApiErrorResponse, ApiSuccessResponse } from "@/types/requirement";

type JsonRequestInit = RequestInit & {
  errorMessage?: string;
};

function buildRequestError(response: Response, fallbackMessage: string, details?: string[]) {
  const suffix = details?.length ? `：${details.join("；")}` : "";
  return new Error(`${fallbackMessage}${suffix}`);
}

export async function requestJson<TData>(input: RequestInfo | URL, init?: JsonRequestInit) {
  const { errorMessage = "请求失败，请稍后重试", headers, ...restInit } = init ?? {};

  const response = await fetch(input, {
    ...restInit,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...(headers ?? {}),
    },
  });

  const contentType = response.headers.get("content-type")?.toLowerCase() ?? "";
  const rawText = await response.text();

  if (!contentType.includes("application/json")) {
    console.error("requestJson: expected JSON but received non-JSON response", {
      input,
      status: response.status,
      contentType,
      preview: rawText.slice(0, 200),
    });
    throw buildRequestError(response, errorMessage);
  }

  let payload: ApiSuccessResponse<TData> | ApiErrorResponse;

  try {
    payload = JSON.parse(rawText) as ApiSuccessResponse<TData> | ApiErrorResponse;
  } catch (error) {
    console.error("requestJson: failed to parse JSON response", {
      input,
      status: response.status,
      rawText: rawText.slice(0, 200),
      error,
    });
    throw buildRequestError(response, errorMessage);
  }

  if (!response.ok || !payload.success) {
    const details = payload.success ? undefined : payload.error.details;
    const message = payload.success ? errorMessage : payload.error.message || errorMessage;
    throw buildRequestError(response, message, details);
  }

  return payload.data;
}
