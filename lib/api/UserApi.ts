import { User } from "@/src/types/User";
import { authFetch } from "./Client";

export const getCurrentUserApi = async () => {
  const res = await authFetch("/api/users/me", {
    method: "GET",
  });

  const data: User = await res.json();

  return data;
};