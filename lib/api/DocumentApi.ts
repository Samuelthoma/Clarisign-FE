import { apiFetch } from "./Client";

export const uploadDocumentApi = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);

  return apiFetch("/api/v1/documents", {
    method: "POST",
    body: formData,
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
