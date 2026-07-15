import { useState } from "react";
import { Eye, EyeOff, Loader2 } from "lucide-react";

interface PasswordSetupStepProp {
  handleSetPassword: (password: string, confirmPassword: string) => void;
  isSubmitting?: boolean;
  error?: string;
}

export default function PasswordSetupStep({
  handleSetPassword,
  isSubmitting,
  error,
}: PasswordSetupStepProp) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const isLengthValid = password.length >= 8;
  // Mirror the backend policy: at least one lowercase, one uppercase, one digit.
  const hasComplexity =
    /[a-z]/.test(password) && /[A-Z]/.test(password) && /\d/.test(password);
  const isPasswordValid = isLengthValid && hasComplexity;
  const passwordsMatch = password === confirmPassword;

  const canSubmit = isPasswordValid && passwordsMatch && !isSubmitting;

  return (
    <div className="flex flex-col items-center text-center w-full">
      <h2 className="text-2xl font-bold text-foreground mb-2">
        Set your password
      </h2>

      <p className="text-sm text-muted-foreground mb-8 max-w-md">
        Your account has been verified. Create a secure password to complete
        your account setup.
      </p>

      <div className="w-full max-w-md space-y-4">
        <div className="text-left">
          <label className="block text-sm font-medium mb-2">Password</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isSubmitting}
              placeholder="Min 8 chars: upper, lower & number"
              className="
                w-full
                px-3 py-2
                border
                border-muted-foreground/40
                focus:outline-none focus:border-primary
                transition-colors
                rounded-md
                bg-background
                text-foreground
                disabled:opacity-50 disabled:cursor-not-allowed
              "
            />
            <button
              type="button"
              disabled={isSubmitting}
              onClick={() => setShowPassword((prev) => !prev)}
              className="
                absolute
                right-3
                top-1/2
                -translate-y-1/2
                text-muted-foreground
                hover:text-foreground
                disabled:opacity-50 disabled:cursor-not-allowed
              "
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {password && !isPasswordValid && (
            <p className="text-xs text-muted-foreground mt-1.5">
              Password must be at least 8 characters and include an uppercase
              letter, a lowercase letter, and a number.
            </p>
          )}
        </div>

        <div className="text-left">
          <label className="block text-sm font-medium mb-2">
            Confirm Password
          </label>
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={isSubmitting}
              placeholder="Confirm password"
              className={`
                w-full
                px-3 py-2
                border
                focus:outline-none focus:border-primary
                transition-colors
                rounded-md
                bg-background
                text-foreground
                disabled:opacity-50 disabled:cursor-not-allowed
                ${confirmPassword && !passwordsMatch ? "border-destructive focus:border-destructive" : "border-muted-foreground/40"}
              `}
            />
            <button
              type="button"
              disabled={isSubmitting}
              onClick={() => setShowConfirmPassword((prev) => !prev)}
              className="
                absolute
                right-3
                top-1/2
                -translate-y-1/2
                text-muted-foreground
                hover:text-foreground
                disabled:opacity-50 disabled:cursor-not-allowed
              "
            >
              {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {confirmPassword && !passwordsMatch && (
            <p className="text-xs text-destructive mt-1.5">
              Passwords do not match.
            </p>
          )}
        </div>

        {error && (
          <div className="p-3 bg-destructive/10 border border-destructive/20 text-destructive text-sm rounded-sm text-left">
            {error}
          </div>
        )}

        <div className="pt-4">
          <button
            type="button"
            disabled={!canSubmit}
            onClick={() => handleSetPassword(password, confirmPassword)}
            className="
              w-full
              inline-flex
              items-center
              justify-center
              gap-2
              px-6
              py-2
              rounded-sm
              bg-primary
              text-primary-foreground
              hover:bg-primary/90
              transition-colors
              disabled:opacity-50 disabled:cursor-not-allowed
            "
          >
            {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
            {isSubmitting ? "Creating Account..." : "Set Password"}
          </button>
        </div>
      </div>
    </div>
  );
}
