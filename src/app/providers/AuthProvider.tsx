"use client";

import { getCurrentUserApi } from "@/lib/api/UserApi";
import { useAuthStore } from "@/src/store/AuthStore";
import { useEffect } from "react";

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const setUser = useAuthStore((state) => state.setUser);
  const setLoading = useAuthStore((state) => state.setLoading);

  useEffect(() => {
    const bootstrap = async () => {
      try {
        const me = await getCurrentUserApi();
        setUser(me);
      } catch (error: any) {
        if (error?.status !== 401 && error?.status !== 403) {
          console.warn("Auth check failed:", error?.message);
        }
        setUser(null); 
      } finally {
        setLoading(false); 
      }
    };

    bootstrap();
  }, [setUser, setLoading]);

  return <>{children}</>;
}