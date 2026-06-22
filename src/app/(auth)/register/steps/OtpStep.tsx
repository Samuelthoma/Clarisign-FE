import React, { useEffect, useRef, useState } from "react";

type OtpStepProps = {
  email: string;
  onVerify: (otp: string) => void;
  onResend: () => void;
  isSubmitting: boolean;
  error?: string;
};

const RESEND_OTP_COOLDOWN = 60;

export default function OtpStep({ email, onVerify, onResend, isSubmitting, error }: OtpStepProps) {
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const [resendCooldown, setResendCooldown] = useState(RESEND_OTP_COOLDOWN);

  useEffect(() => {
    if (resendCooldown <= 0) return;

    const interval = setInterval(() => {
      setResendCooldown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [resendCooldown]);

  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);

  const handleChange = (value: string, index: number) => {
    if (!/^\d?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }

    if (value && index === 5) {
      const otpString = newOtp.join("");
      if (otpString.length === 6) {
        onVerify(otpString);
      }
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.key === "Backspace" && !e.currentTarget.value && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const paste = e.clipboardData.getData("text").slice(0, 6);

    if (!/^\d+$/.test(paste)) return;

    const newOtp = paste.split("");
    while (newOtp.length < 6) newOtp.push("");
    setOtp(newOtp);

    newOtp.forEach((char, index) => {
      const input = inputsRef.current[index];
      if (input) {
        input.value = char;
      }
    });

    inputsRef.current[Math.min(paste.length, 6) - 1]?.focus();

    if (paste.length === 6) {
      onVerify(paste);
    }
  };

  const handleResendClick = () => {
    setResendCooldown(RESEND_OTP_COOLDOWN);
    onResend();
  };

  return (
    <>
      <h2 className="text-2xl font-bold mb-2 text-foreground">
        Verify your email
      </h2>

      <p className="text-sm text-muted-foreground mb-6">
        We've sent a 6-digit verification code to{" "}
        <span className="font-medium text-foreground">{email}</span>. Please
        enter the code below to continue.
      </p>

      <div className="pb-4">
        {error && <p className="text-sm text-red-500">{error}</p>}
      </div>

      <div className="flex justify-between gap-3 mb-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <input
            key={i}
            ref={(el) => {
              inputsRef.current[i] = el;
            }}
            value={otp[i]}
            type="text"
            inputMode="numeric"
            maxLength={1}
            disabled={isSubmitting}
            aria-label={`OTP digit ${i + 1}`}
            onChange={(e) => handleChange(e.target.value, i)}
            onKeyDown={(e) => handleKeyDown(e, i)}
            onPaste={handlePaste}
            className="
              w-10 h-12 text-center text-lg font-medium
              bg-transparent
              border-b-2 border-muted-foreground/40
              text-foreground
              focus:outline-none focus:border-primary
              transition-colors
              disabled:opacity-50 disabled:cursor-not-allowed
            "
          />
        ))}
      </div>

      <div className="space-y-4">
        <button
          onClick={() => onVerify(otp.join(""))}
          disabled={isSubmitting || otp.join("").length < 6}
          type="button"
          className="w-full bg-primary text-primary-foreground py-2 rounded hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Verifying..." : "Verify"}
        </button>

        <p className="text-center text-sm text-muted-foreground">
          Didn’t receive the code?{" "}
          <button
            type="button"
            disabled={resendCooldown > 0 || isSubmitting}
            onClick={handleResendClick}
            className="text-primary font-medium underline underline-offset-2 hover:text-primary/90 disabled:no-underline disabled:text-muted-foreground"
          >
            {resendCooldown > 0 
              ? `Resend in 00:${resendCooldown.toString().padStart(2, "0")}` 
              : "Resend code"
            }
          </button>
        </p>
      </div>
    </>
  );
}