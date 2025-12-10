"use server";

import { apiFetch } from "./Client";

export const loginApi = async (email: string, password: string) => {
  return apiFetch("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
};

export const registerApi = async () => {
    // TODO : Create API Calling for register
}