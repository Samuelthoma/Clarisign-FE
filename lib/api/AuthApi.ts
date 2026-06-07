"use server";

import { cookies } from "next/headers";
import { apiFetch, authFetch, fastApiFetch } from "./Client";

export const loginApi = async (email: string, password: string) => {
  const response = await authFetch("/api/v1/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });

  const setCookieHeader = response.headers.get("Set-Cookie");

  if (setCookieHeader) {
    const tokenMatch = setCookieHeader.match(/accessToken=([^;]+)/);

    if (tokenMatch && tokenMatch[1]) {
      (await cookies()).set({
        name: "accessToken",
        value: tokenMatch[1],
        httpOnly: true,
        path: "/",
        maxAge: 60 * 60,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
      });
    }
  }
  return await response.json();
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

export const updateKycStatusApi = async (data: {
  email: string;
  nik: string;
  fullName: string;
  dateOfBirth: string;
  idCardImageUrl: string;
  selfieImageUrl: string;
  isKycValid: boolean;
}) => {
  return apiFetch("/api/v1/auth/validate-kyc", {
    method: "POST",
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
