import { cookies } from "next/headers";

import {
  ADMIN_PASSWORD_MISSING_MESSAGE,
  ADMIN_SESSION_COOKIE_NAME,
  createAdminSessionValue,
  getAdminAuthStatus,
  getAdminSessionCookieOptions,
  isAdminPasswordCorrect,
} from "@/lib/admin-auth";
import { jsonError, jsonSuccess } from "@/lib/http";

export async function GET() {
  const authStatus = await getAdminAuthStatus();

  if (!authStatus.configured) {
    return jsonError(authStatus.message, 503);
  }

  return jsonSuccess({
    authenticated: authStatus.authenticated,
  });
}

export async function POST(request: Request) {
  const authStatus = await getAdminAuthStatus();

  if (!authStatus.configured) {
    return jsonError(authStatus.message, 503);
  }

  let payload: { password?: unknown } | null = null;

  try {
    payload = (await request.json()) as { password?: unknown };
  } catch {
    return jsonError("后台登录失败", 400, ["请求体必须是 JSON"]);
  }

  if (typeof payload?.password !== "string" || payload.password.length === 0) {
    return jsonError("后台登录失败", 400, ["请输入后台密码"]);
  }

  if (!isAdminPasswordCorrect(payload.password)) {
    return jsonError("后台登录失败", 401, ["密码不正确"]);
  }

  (await cookies()).set(
    ADMIN_SESSION_COOKIE_NAME,
    createAdminSessionValue(),
    getAdminSessionCookieOptions(),
  );

  return jsonSuccess({
    authenticated: true,
  });
}

export async function DELETE() {
  const authStatus = await getAdminAuthStatus();

  if (!authStatus.configured) {
    return jsonError(ADMIN_PASSWORD_MISSING_MESSAGE, 503);
  }

  (await cookies()).set(ADMIN_SESSION_COOKIE_NAME, "", {
    ...getAdminSessionCookieOptions(),
    maxAge: 0,
  });

  return jsonSuccess({
    authenticated: false,
  });
}
