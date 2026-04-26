"use client";

import "@/src/styles/globals.css";
import { loginApi } from "@/lib/api/AuthApi";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      await loginApi(email, password);

      router.push("/dashboard");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="bg-card shadow-2xl rounded-sm overflow-hidden flex max-w-4xl w-full h-[520px]">
        <div className="w-1/2 p-10 flex flex-col justify-center">
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

        <div className="w-1/2 bg-muted">
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
