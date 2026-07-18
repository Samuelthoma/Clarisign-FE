"use server";

import { cookies, headers } from "next/headers";
import { apiFetch, authFetch, fastApiFetch } from "./Client";

const AUTH_COOKIE = "accessToken";

async function resolveCookieScope() {
  const hostname = ((await headers()).get("host") ?? "").split(":")[0];
  const isLocal = hostname === "localhost" || hostname === "127.0.0.1";

  if (isLocal || !hostname.includes(".")) {
    return { secure: false as const };
  }

  const baseDomain = hostname.split(".").slice(-2).join(".");
  return { domain: `.${baseDomain}`, secure: true as const };
}

export const loginApi = async (email: string, password: string) => {
  const response = await authFetch("/api/v1/auth/login", {
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
};

/**
 * Logout must run on the server: the auth cookie is set by Next (scoped to the
 * parent domain), so only Next can clear it. The backend call is still made so
 * the logout is recorded there, but it cannot clear this cookie by itself.
 */
export const logoutApi = async () => {
  try {
    await authFetch("/api/v1/auth/tokens", { method: "DELETE" });
  } catch {

  }

  const scope = await resolveCookieScope();
  (await cookies()).set({
    name: AUTH_COOKIE,
    value: "",
    httpOnly: true,
    path: "/",
    maxAge: 0, // expire immediately
    sameSite: "lax",
    ...scope,
  });

  return { message: "Logged out" };
};

export const registerApi = async (email: string) => {
  return apiFetch("/api/v1/auth/register", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
};

export const verifyOtpApi = async (email: string, otp: string) => {
  return apiFetch("/api/v1/auth/verify-otp", {
    method: "POST",
    body: JSON.stringify({ email, otp }),
  });
};

// KYC is now decided server-side: the Python service runs OCR + face match on the
// uploaded images (by R2 key) and, only if it passes, reports the verdict to
// sign-api itself. The client just points at the images — it never asserts validity.
export const verifyKycApi = async (data: {
  email: string;
  id_card_key: string;
  selfie_key: string;
  // Optional client-supplied identity — only used by the server when its
  // KYC_ALLOW_CLIENT_IDENTITY dev flag is on; ignored in production.
  nik?: string;
  full_name?: string;
  date_of_birth?: string;
}) => {
  return fastApiFetch("/identity/verify-kyc", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
};

export const uploadFaceImageApi = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);

  return fastApiFetch("/users/face", {
    method: "POST",
    body: formData,
  });
};

export const setPasswordApi = async (data: {
  email: string;
  password: string;
  confirmPassword: string;
  registrationToken: string;
}) => {
  return apiFetch("/api/v1/auth/set-password", {
    method: "POST",
    body: JSON.stringify(data),
  });
};

export const idCardOcrApi = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);

  return fastApiFetch("/users/id-card", {
    method: "POST",
    body: formData,
  });
};

export const requestPasswordResetApi = async (email: string) => {
  return apiFetch("/api/v1/auth/password-reset-requests", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
};

export const verifyResetPasswordOtpApi = async (email: string, otp: string) => {
  return apiFetch("/api/v1/auth/password-reset-verify", {
    method: "POST",
    body: JSON.stringify({ email, otp }),
  });
};

export const resetPasswordApi = async (
  resetToken: string,
  password: string,
) => {
  return apiFetch("/api/v1/auth/password-resets", {
    method: "POST",
    body: JSON.stringify({ resetToken, password }),
  });
};
