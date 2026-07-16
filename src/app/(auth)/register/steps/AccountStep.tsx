import Link from "next/link";
import { useState } from "react";

type AccountStepProps = {
  onNext: (data: { email: string }) => void;
  isSubmitting: boolean;
  error?: string;
};

export default function AccountStep({
  onNext,
  isSubmitting,
  error,
}: AccountStepProps) {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext({ email });
  };

  return (
    <>
      <h2 className="text-2xl font-bold mb-2 text-foreground">
        Create your account
      </h2>

      <p className="text-sm text-muted-foreground mb-8">
        We’ll start by verifying your email address.
      </p>

      <form className="w-full space-y-6" onSubmit={handleSubmit}>
        <div>
          <label
            htmlFor="email"
            className="block text-foreground/80 text-sm font-medium mb-1"
          >
            Email address
          </label>
          <input
            id="email"
            type="email"
            required
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@company.com"
            autoComplete="email"
            className="w-full py-2 bg-transparent border-b-2 border-muted-foreground/40 text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary transition-colors"
          />
        </div>

        {error && <p className="text-sm text-red-500">{error}</p>}

        <div className="pt-2">
          <button
            disabled={isSubmitting}
            type="submit"
            className="w-full bg-primary text-primary-foreground py-2 rounded hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Sending..." : "Send Verification Code"}
          </button>
        </div>

        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
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
