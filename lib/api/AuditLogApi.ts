import { UserActionType } from "@/src/modules/document/types";
import { apiFetch } from "./Client";

export interface GetActivityLogsParams {
  page: number;
  size: number;
  param?: string;
  type?: string;
  name?: string;
  actionType?: UserActionType;
}

export const getActivityLogsApi = async (params: GetActivityLogsParams) => {
  const queryParams = new URLSearchParams();

  queryParams.append("page", params.page.toString());
  queryParams.append("size", params.size.toString());

  if (params.param) queryParams.append("param", params.param);
  if (params.type) queryParams.append("type", params.type);
  if (params.name) queryParams.append("name", params.name);
  if (params.actionType) queryParams.append("actionType", params.actionType);

  const response = await apiFetch(`/api/v1/audit-logs?${queryParams.toString()}`, {
    method: "GET",
  });

  return response.outputSchema;
};

export const getAuditFile = async () => {
  const blob = await apiFetch(`/api/v1/audit-logs/users/my-activity/download`, {
    method: "GET",
    responseType: "blob",
  });
  const url = URL.createObjectURL(blob);

  return { url };
};