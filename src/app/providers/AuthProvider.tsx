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
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    bootstrap();
  }, [setUser, setLoading]);

  return <>{children}</>;
}
