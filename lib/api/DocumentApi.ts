"use server";

import { fastApiFetch } from "./Client";

export const uploadDocumentApi = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);

  return fastApiFetch("/documents", {
    method: "POST",
    body: formData,
  });
};

export const getDocumentFileApi = async (documentId: string) => {
  return fastApiFetch(`/documents/${documentId}/file`, {
    method: "GET",
  });
};
