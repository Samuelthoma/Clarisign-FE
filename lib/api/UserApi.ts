import { User } from "@/src/types/User";
import { apiFetch, authFetch } from "./Client";

export const getCurrentUserApi = async () => {
  const res = await authFetch("/api/users/me", {
    method: "GET",
  });

  const data: User = await res.json();

  return data;
};

// --- Reusable saved signature (one per user; PUT replaces) ---

export interface SavedSignatureResponse {
  exists: boolean;
  dataUrl: string | null;
}

export const getSavedSignatureApi = async (): Promise<SavedSignatureResponse> =>
  apiFetch("/api/users/me/signature", { method: "GET" });

export const saveSignatureApi = async (
  file: File,
): Promise<SavedSignatureResponse> => {
  const formData = new FormData();
  formData.append("file", file);

  return apiFetch("/api/users/me/signature", {
    method: "PUT",
    body: formData,
  });
};

export const deleteSavedSignatureApi = async (): Promise<SavedSignatureResponse> =>
  apiFetch("/api/users/me/signature", { method: "DELETE" });
