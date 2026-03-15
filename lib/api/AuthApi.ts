"use server";

import { apiFetch, fastApiFetch } from "./Client";

export const loginApi = async (email: string, password: string) => {
  return apiFetch("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
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

export const idCardOcrApi = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);

  return fastApiFetch("/users/id-card", {
    method: "POST",
    body: formData,
  });
};
