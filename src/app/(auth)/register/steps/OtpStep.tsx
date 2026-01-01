'use client';

import React, { useRef } from "react";

export default function OtpStep({ email }: { email: string }) {
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);

  const handleChange = (value: string, index: number) => {
    if (!/^\d?$/.test(value)) return;

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

    paste.split("").forEach((char, index) => {
      const input = inputsRef.current[index];
      if (input) {
        input.value = char;
      }
    });

    inputsRef.current[Math.min(paste.length, 6) - 1]?.focus();
  };

  return (
    <>
      <h2 className="text-2xl font-bold mb-2 text-foreground">
        Verify your email
      </h2>

      <p className="text-sm text-muted-foreground mb-6">
        We've sent a 6-digit verification code to{" "}
        <span className="font-medium text-foreground">{email}</span>.
        Please enter the code below to continue.
      </p>

      <div className="flex justify-between gap-3 mb-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <input
            key={i}
            ref={(el) => {inputsRef.current[i] = el}}
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
          type="button"
          className="w-full bg-primary text-primary-foreground py-2 rounded hover:bg-primary/90 transition-colors"
        >
          Verify
        </button>

        <p className="text-center text-sm text-muted-foreground">
          Didn’t receive the code?{" "}
          <button
            type="button"
            className="text-primary font-medium underline underline-offset-2 hover:text-primary/90"
          >
            Resend code
          </button>
        </p>
      </div>
    </>
  );
}
