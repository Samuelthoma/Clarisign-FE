"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";

interface ForgotPasswordEmailStepProps {
  isSubmitting: boolean;
  error?: string;
  onNext: (data: { email: string }) => Promise<void>;
}

export default function ForgotPasswordEmailStep({
  isSubmitting,
  error,
  onNext,
}: ForgotPasswordEmailStepProps) {
  const [email, setEmail] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await onNext({ email });
  };

  return (
    <>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-foreground">Forgot Password</h2>

        <p className="mt-2 text-sm text-muted-foreground">
          Enter your email address and we'll send you a verification code to
          reset your password.
        </p>
      </div>

      {error && (
        <p className="mb-4 rounded bg-red-100 p-2 text-sm text-red-600">
          {error}
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-foreground/80 mb-1"
          >
            Email
          </label>

          <input
            id="email"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="w-full py-2 bg-transparent border-b-2 border-muted-foreground/40 text-foreground focus:outline-none focus:border-primary transition-colors"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-primary text-primary-foreground py-2 rounded hover:bg-primary/90 transition-colors disabled:opacity-50"
        >
          {isSubmitting ? "Sending..." : "Send Verification Code"}
        </button>

        <p className="text-center text-sm text-muted-foreground">
          Remember your password?{" "}
          <Link
            href="/login"
            className="text-primary font-semibold underline underline-offset-2"
          >
            Back to Login
          </Link>
        </p>
      </form>
    </>
  );
}
