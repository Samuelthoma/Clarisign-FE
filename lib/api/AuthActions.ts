"use server";

import { cookies, headers } from "next/headers";
import { ActionResult, ApiError } from "./Client";
import { authCookieScope } from "./cookieScope";
import { serverApiFetch, serverAuthFetch, serverFastApiFetch } from "./ServerClient";

const AUTH_COOKIE = "accessToken";

async function resolveCookieScope() {
  return authCookieScope((await headers()).get("host") ?? "");
}

async function run<T>(body: () => Promise<T>): Promise<ActionResult<T>> {
  try {
    return { ok: true, data: await body() };
  } catch (error) {
    if (error instanceof ApiError) {
      return {
        ok: false,
        message: error.message,
        code: error.code,
        status: error.status,
      };
    }

    console.error("Auth action failed:", error);
    return {
      ok: false,
      message: "Could not reach the server. Please try again in a moment.",
      status: 0,
    };
  }
}

export const loginApi = async (email: string, password: string) =>
  run(async () => {
    const response = await serverAuthFetch("/api/v1/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });

    const setCookieHeader = response.headers.get("Set-Cookie");

    if (setCookieHeader) {
      const tokenMatch = setCookieHeader.match(/accessToken=([^;]+)/);

      if (tokenMatch && tokenMatch[1]) {
        const scope = await resolveCookieScope();
        (await cookies()).set({
          name: AUTH_COOKIE,
          value: tokenMatch[1],
          httpOnly: true,
          path: "/",
          maxAge: 60 * 60,
          sameSite: "lax",
          ...scope,
        });
      }
    }

    return await response.json();
  });

export const logoutApi = async () =>
  run(async () => {
    try {
      await serverAuthFetch("/api/v1/auth/tokens", { method: "DELETE" });
    } catch {

    }

    const scope = await resolveCookieScope();
    (await cookies()).set({
      name: AUTH_COOKIE,
      value: "",
      httpOnly: true,
      path: "/",
      maxAge: 0,
      sameSite: "lax",
      ...scope,
    });

    return { message: "Logged out" };
  });

export const registerApi = async (email: string) =>
  run(() =>
    serverApiFetch("/api/v1/auth/register", {
      method: "POST",
      body: JSON.stringify({ email }),
    }),
  );

export const verifyOtpApi = async (email: string, otp: string) =>
  run(() =>
    serverApiFetch("/api/v1/auth/verify-otp", {
      method: "POST",
      body: JSON.stringify({ email, otp }),
    }),
  );

export const verifyKycApi = async (data: {
  email: string;
  id_card_key: string;
  selfie_key: string;
  nik?: string;
  full_name?: string;
  date_of_birth?: string;
}) =>
  run(() =>
    serverFastApiFetch("/identity/verify-kyc", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }),
  );

export const uploadFaceImageApi = async (file: File) =>
  run(() => {
    const formData = new FormData();
    formData.append("file", file);

    return serverFastApiFetch("/users/face", {
      method: "POST",
      body: formData,
    });
  });

export const setPasswordApi = async (data: {
  email: string;
  password: string;
  confirmPassword: string;
  registrationToken: string;
}) =>
  run(() =>
    serverApiFetch("/api/v1/auth/set-password", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  );

export const idCardOcrApi = async (file: File) =>
  run(() => {
    const formData = new FormData();
    formData.append("file", file);

    return serverFastApiFetch("/users/id-card", {
      method: "POST",
      body: formData,
    });
  });

export const requestPasswordResetApi = async (email: string) =>
  run(() =>
    serverApiFetch("/api/v1/auth/password-reset-requests", {
      method: "POST",
      body: JSON.stringify({ email }),
    }),
  );

export const verifyResetPasswordOtpApi = async (email: string, otp: string) =>
  run(() =>
    serverApiFetch("/api/v1/auth/password-reset-verify", {
      method: "POST",
      body: JSON.stringify({ email, otp }),
    }),
  );

export const resetPasswordApi = async (resetToken: string, password: string) =>
  run(() =>
    serverApiFetch("/api/v1/auth/password-resets", {
      method: "POST",
      body: JSON.stringify({ resetToken, password }),
    }),
  );
