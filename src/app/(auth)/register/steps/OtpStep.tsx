"use client";

import { registerApi, verifyOtpApi } from "@/lib/api/AuthApi";
import React, { useRef, useState } from "react";

type OtpStepProps = {
  email: string;
  onNext: () => void;
};

export default function OtpStep({ email, onNext }: OtpStepProps) {
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const [error, setError] = useState("");

  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);

  const handleChange = (value: string, index: number) => {
    if (!/^\d?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputsRef.current[index + 1]?.focus();
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
    setOtp(newOtp);

    newOtp.forEach((char, index) => {
      const input = inputsRef.current[index];
      if (input) {
        input.value = char;
      }
    });

    inputsRef.current[Math.min(paste.length, 6) - 1]?.focus();
  };

  const resendOtp = async () => {
    try {
      setError("");
      await registerApi(email);
    } catch (error: any) {
      setError(error.message);
    }
  };

  const verifyOtp = async () => {
    const otpValue = otp.join("");

    try {
      setError("");
      const res = await verifyOtpApi(email, otpValue);
      if (res.code == 200) {
        onNext();
      } else {
        setError(res.message);
      }
    } catch (error: any) {
      setError(error.message);
    }
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
            "
          />
        ))}
      </div>

      <div className="space-y-4">
        <button
          onClick={() => verifyOtp()}
          type="button"
          className="w-full bg-primary text-primary-foreground py-2 rounded hover:bg-primary/90 transition-colors"
        >
          Verify
        </button>

        <p className="text-center text-sm text-muted-foreground">
          Didn’t receive the code?{" "}
          <button
            type="button"
            onClick={() => resendOtp()}
            className="text-primary font-medium underline underline-offset-2 hover:text-primary/90"
          >
            Resend code
          </button>
        </p>
      </div>
    </>
  );
}
