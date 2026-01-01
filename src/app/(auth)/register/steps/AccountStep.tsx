type AccountStepProps = {
  onNext: (data: { email: string; username: string; password: string }) => void;
};

export default function AccountStep({ onNext }: AccountStepProps) {
  return (
    <>
      <h2 className="text-2xl font-bold mb-2 text-foreground">
        Create your account
      </h2>

      <p className="text-sm text-muted-foreground mb-8">
        Enter your account details to get started.
      </p>

      <form className="w-full space-y-6">
        <div>
          <label
            htmlFor="username"
            className="block text-foreground/80 text-sm font-medium mb-1"
          >
            Username
          </label>
          <input
            id="username"
            type="text"
            required
            placeholder="Choose a username"
            autoComplete="username"
            className="w-full py-2 bg-transparent border-b-2 border-muted-foreground/40 text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary transition-colors"
          />
        </div>

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
            placeholder="Enter your work email"
            autoComplete="email"
            className="w-full py-2 bg-transparent border-b-2 border-muted-foreground/40 text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary transition-colors"
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
            placeholder="Create a password"
            autoComplete="new-password"
            className="w-full py-2 bg-transparent border-b-2 border-muted-foreground/40 text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary transition-colors"
          />
        </div>

        <div className="pt-2">
          <button
            type="submit"
            className="w-full bg-primary text-primary-foreground py-2 rounded hover:bg-primary/90 transition-colors"
          >
            Continue
          </button>
        </div>
      </form>
    </>
  );
}
