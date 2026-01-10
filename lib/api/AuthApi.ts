"use server";

import { apiFetch } from "./Client";

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
