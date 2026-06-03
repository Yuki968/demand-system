import "server-only";

import { cookies } from "next/headers";
import { createHmac, timingSafeEqual } from "node:crypto";

export const ADMIN_SESSION_COOKIE_NAME = "demand_system_admin_session";

const ADMIN_SESSION_PAYLOAD = "demand-system-admin";
const ADMIN_SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 5;

export const ADMIN_PASSWORD_MISSING_MESSAGE =
  "后台访问已禁用：服务器未配置 ADMIN_PASSWORD。";

export const ADMIN_AUTH_REQUIRED_MESSAGE = "请先完成后台登录。";

type AdminAuthStatus =
  | {
      configured: false;
      authenticated: false;
      message: string;
    }
  | {
      configured: true;
      authenticated: boolean;
      message: string | null;
    };

type AdminAccessCheck =
  | {
      ok: true;
    }
  | {
      ok: false;
      status: number;
      message: string;
    };

function getConfiguredAdminPassword() {
  const password = process.env.ADMIN_PASSWORD;
  return password && password.length > 0 ? password : null;
}

function getSignedSessionValue(password: string) {
  const signature = createHmac("sha256", password)
    .update(ADMIN_SESSION_PAYLOAD)
    .digest("base64url");

  return `${ADMIN_SESSION_PAYLOAD}.${signature}`;
}

function safeEqualText(left: string, right: string) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);

  if (leftBuffer.length !== rightBuffer.length) {
    return false;
  }

  return timingSafeEqual(leftBuffer, rightBuffer);
}

function isSessionValueValid(value: string, password: string) {
  return safeEqualText(value, getSignedSessionValue(password));
}

export function getAdminSessionCookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: false,
    path: "/",
    maxAge: ADMIN_SESSION_MAX_AGE_SECONDS,
  };
}

export function isAdminPasswordCorrect(input: string) {
  const configuredPassword = getConfiguredAdminPassword();

  if (!configuredPassword) {
    return false;
  }

  return safeEqualText(input, configuredPassword);
}

export function createAdminSessionValue() {
  const configuredPassword = getConfiguredAdminPassword();

  if (!configuredPassword) {
    throw new Error(ADMIN_PASSWORD_MISSING_MESSAGE);
  }

  return getSignedSessionValue(configuredPassword);
}

export async function getAdminAuthStatus(): Promise<AdminAuthStatus> {
  const configuredPassword = getConfiguredAdminPassword();

  if (!configuredPassword) {
    return {
      configured: false,
      authenticated: false,
      message: ADMIN_PASSWORD_MISSING_MESSAGE,
    };
  }

  const sessionValue = (await cookies()).get(ADMIN_SESSION_COOKIE_NAME)?.value;

  return {
    configured: true,
    authenticated: Boolean(
      sessionValue && isSessionValueValid(sessionValue, configuredPassword),
    ),
    message: null,
  };
}

export async function requireAdminAccess(): Promise<AdminAccessCheck> {
  const authStatus = await getAdminAuthStatus();

  if (!authStatus.configured) {
    return {
      ok: false,
      status: 503,
      message: authStatus.message,
    };
  }

  if (!authStatus.authenticated) {
    return {
      ok: false,
      status: 401,
      message: ADMIN_AUTH_REQUIRED_MESSAGE,
    };
  }

  return { ok: true };
}
