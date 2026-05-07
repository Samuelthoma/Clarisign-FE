import { SaveDraftPayload } from "@/src/types/Document";
import { apiFetch } from "./Client";

export const uploadDocumentApi = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);

  return apiFetch("/api/v1/documents", {
    method: "POST",
    body: formData,
  });
};

export const getRecentDocumentListApi = async () => {
  return apiFetch("/api/v1/documents", {
    method: "GET",
  });
};

export const getDocumentFileApi = async (documentId: string) => {
  const blob = await apiFetch(`/api/v1/documents/${documentId}`, {
    method: "GET",
    responseType: "blob",
  });
  const url = URL.createObjectURL(blob);

  return { url };
};

export const getDocumentCollaboratorsApi = async (documentId: string) => {
  return apiFetch(`/api/v1/documents/${documentId}/collaborators`, {
    method: "GET",
  });
};

export const addDocumentCollaboratorApi = async (
  email: string,
  documentId: string,
) => {
  return apiFetch(`/api/v1/documents/${documentId}/collaborators`, {
    method: "POST",
    body: JSON.stringify({ email }),
  });
};

export const saveDraftDocumentApi = async (
  documentId: string,
  data: SaveDraftPayload,
) => {
  return apiFetch(`/api/v1/documents/${documentId}/draft`, {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  });
};
