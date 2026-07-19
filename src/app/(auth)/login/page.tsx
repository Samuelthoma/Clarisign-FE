"use client";

import "@/src/styles/globals.css";
import { loginApi } from "@/lib/api/AuthApi";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { getCurrentUserApi } from "@/lib/api/UserApi";
import { useAuthStore } from "@/src/store/AuthStore";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const setUser = useAuthStore((state) => state.setUser);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("session") !== "expired") return;

    toast.info("Your session has expired. Please sign in again.");

    params.delete("session");
    const query = params.toString();
    window.history.replaceState(null, "", query ? `/login?${query}` : "/login");
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      await loginApi(email, password);
      const me = await getCurrentUserApi();
      setUser(me);
      router.push("/dashboard");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-dvh flex items-center justify-center bg-background p-4">
      <div className="bg-card shadow-2xl rounded-sm overflow-hidden flex flex-col md:flex-row max-w-4xl w-full md:h-[520px]">
        <div className="w-full md:w-1/2 p-6 sm:p-10 flex flex-col justify-center">
          <h2 className="text-2xl font-bold mb-6 text-foreground">Login</h2>

          {error && (
            <p className="mb-4 rounded bg-red-100 p-2 text-sm text-red-600">
              {error}
            </p>
          )}

          <form
            id="loginForm"
            className="w-full space-y-6"
            onSubmit={handleLogin}
          >
            <div>
              <label
                htmlFor="email"
                className="block text-foreground/80 text-sm font-medium mb-1"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                autoComplete="email"
                className="w-full py-2 bg-transparent border-b-2 border-muted-foreground/40 text-foreground focus:outline-none focus:border-primary transition-colors"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-foreground/80 text-sm font-medium mb-1"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                autoComplete="current-password"
                className="w-full py-2 bg-transparent border-b-2 border-muted-foreground/40 text-foreground focus:outline-none focus:border-primary transition-colors"
              />
            </div>

            <div className="text-right">
              <a
                href="/forgot-password"
                className="text-sm text-primary hover:underline"
              >
                Forgot password?
              </a>
            </div>

            <div>
              <button
                type="submit"
                className="
                  w-full bg-primary text-primary-foreground
                  py-2 rounded 
                  hover:bg-primary/90 
                  transition-colors
                "
                disabled={loading}
              >
                Login
              </button>
            </div>

            <p className="text-center text-muted-foreground text-sm">
              Don't have an account?{" "}
              <a
                href="/register"
                className="text-primary font-semibold underline underline-offset-2"
              >
                Register now
              </a>
            </p>
          </form>
        </div>

        <div className="hidden md:block md:w-1/2 bg-muted">
          <div className="aspect-square w-full h-full">
            <img
              src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=1200"
              alt="Office"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
