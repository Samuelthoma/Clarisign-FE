import { SaveDraftPayload, SignDocumentPayload } from "@/src/types/Document";
import { apiFetch, fastApiFetch } from "./Client";

export interface GetDocumentsParams {
  page: number;
  size: number;
  param?: string;
  type?: string;
  name?: string;
  status?: string;
}

export interface DocumentProgressResponse {
  documentId: string;
  documentName: string;
  documentStatus: string;
  totalSigners: number;
  signedCount: number;
  currentOrder: number | null;
  currentSignerEmail: string | null;
  steps: {
    order: number;
    email: string;
    status: string;
  }[];
  you: {
    order: number;
    status: string;
    yourTurn: boolean;
    signer: boolean;
  };
}

export const uploadDocumentApi = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await apiFetch("/api/v1/documents", {
    method: "POST",
    body: formData,
  });

  return response.outputSchema;
};

export const getRecentDocumentListApi = async (params: GetDocumentsParams) => {
  const queryParams = new URLSearchParams();

  queryParams.append("page", params.page.toString());
  queryParams.append("size", params.size.toString());

  if (params.param) queryParams.append("param", params.param);
  if (params.type) queryParams.append("type", params.type);
  if (params.name) queryParams.append("name", params.name);
  if (params.status) queryParams.append("status", params.status);

  const response = await apiFetch(
    `/api/v1/documents?${queryParams.toString()}`,
    {
      method: "GET",
    },
  );

  return response.outputSchema;
};

export const getDocumentProgressApi = async (
  documentId: string,
): Promise<DocumentProgressResponse> => {
  const res = await apiFetch(`/api/v1/documents/${documentId}/progress`, {
    method: "GET",
  });

  return res.outputSchema;
};

export const getDocumentFileApi = async (documentId: string) => {
  const blob = await apiFetch(`/api/v1/documents/${documentId}`, {
    method: "GET",
    responseType: "blob",
  });
  const url = URL.createObjectURL(blob);

  return { url };
};

export const downloadDocumentFileApi = async (documentId: string) => {
  const blob = await apiFetch(`/api/v1/documents/${documentId}/download`, {
    method: "GET",
    responseType: "blob",
  });
  const url = URL.createObjectURL(blob);

  return { url };
};

export const getDocumentLogApi = async (documentId: string) => {
  const blob = await apiFetch(
    `/api/v1/audit-logs/documents/${documentId}/download`,
    {
      method: "GET",
      responseType: "blob",
    },
  );
  const url = URL.createObjectURL(blob);

  return { url };
};

export const getDocumentCollaboratorsApi = async (documentId: string) => {
  const response = await apiFetch(
    `/api/v1/documents/${documentId}/collaborators`,
    {
      method: "GET",
    },
  );

  return response.outputSchema;
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

export const removeDocumentCollaboratorApi = async (
  documentId: string,
  collaboratorId: string,
) => {
  return apiFetch(`/api/v1/documents/${documentId}/collaborators`, {
    method: "DELETE",
    body: JSON.stringify({ collaboratorId }),
  });
};

export const getDocumentLayoutApi = async (documentId: string) => {
  const response = await apiFetch(`/api/v1/documents/${documentId}/draft`, {
    method: "GET",
  });

  return await response.outputSchema;
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

export const publishDocumentApi = async (documentId: string) => {
  return apiFetch(`/api/v1/documents/${documentId}/publish`, {
    method: "POST",
  });
};

export const generateSignatureNonceApi = async (documentId: string) => {
  const response = await apiFetch(
    `/api/v1/documents/${documentId}/signatures/nonce`,
    {
      method: "POST",
    },
  );

  return response.outputSchema;
};

export const signDocumentApi = async (
  documentId: string,
  data: SignDocumentPayload,
) => {
  return apiFetch(`/api/v1/documents/${documentId}/signatures`, {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  });
};

export const rejectDocumentApi = async (documentId: string) => {
  return apiFetch(`/api/v1/documents/${documentId}/reject`, {
    method: "POST",
  });
};

export const finalizeDocumentApi = async (documentId: string) => {
  return apiFetch(`/api/v1/documents/${documentId}/finalize`, {
    method: "POST",
  });
};

export const verifyDocument = async (file: File) => {
  const formData = new FormData();
  formData.append("request", file);

  return fastApiFetch("/verify", {
    method: "POST",
    body: formData,
  });
};
