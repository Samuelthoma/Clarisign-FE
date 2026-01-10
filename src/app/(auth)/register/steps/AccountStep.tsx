import { useState } from "react";
import { registerApi } from "../../../../../lib/api/AuthApi";

type AccountStepProps = {
  onNext: (data: { email: string }) => void;
};

export default function AccountStep({ onNext }: AccountStepProps) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      onNext({ email });
      await registerApi(email);
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <>
      <h2 className="text-2xl font-bold mb-2 text-foreground">
        Create your account
      </h2>

      <p className="text-sm text-muted-foreground mb-8">
        Enter your account details to get started.
      </p>

      <form className="w-full space-y-6" onSubmit={handleSubmit}>
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
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your work email"
            autoComplete="email"
            className="w-full py-2 bg-transparent border-b-2 border-muted-foreground/40 text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary transition-colors"
          />
        </div>

        {error && <p className="text-sm text-red-500">{error}</p>}

        <div className="pt-2">
          <button
            disabled={isLoading}
            type="submit"
            className="w-full bg-primary text-primary-foreground py-2 rounded hover:bg-primary/90 transition-colors"
          >
            Send OTP
          </button>
        </div>
      </form>
    </>
  );
}
