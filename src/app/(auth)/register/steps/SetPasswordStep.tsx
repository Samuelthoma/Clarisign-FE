"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

interface PasswordSetupStepProp {
  handleSetPassword: (password: string, confirmPassword: string) => void;
}

export default function PasswordSetupStep({
  handleSetPassword,
}: PasswordSetupStepProp) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <div className="flex flex-col items-center text-center">
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
              placeholder="Enter password"
              className="
              w-full
              px-3 py-2
              border
              rounded-md
              bg-background
              text-foreground
            "
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="
              absolute
              right-3
              top-1/2
              -translate-y-1/2
              text-muted-foreground
              hover:text-foreground
            "
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
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
              placeholder="Confirm password"
              className="
              w-full
              px-3 py-2
              border
              rounded-md
              bg-background
              text-foreground
            "
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword((prev) => !prev)}
              className="
              absolute
              right-3
              top-1/2
              -translate-y-1/2
              text-muted-foreground
              hover:text-foreground
            "
            >
              {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <button
          type="button"
          onClick={() => handleSetPassword(password, confirmPassword)}
          className="
            w-full
            inline-flex
            items-center
            justify-center
            px-6
            py-2
            rounded-sm
            bg-primary
            text-primary-foreground
            hover:bg-primary/90
            transition-colors
          "
        >
          Set Password
        </button>
      </div>
    </div>
  );
}
