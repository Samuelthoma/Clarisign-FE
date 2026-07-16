"use client";

import "@/src/styles/globals.css";

import { useState } from "react";
import { useRouter } from "next/navigation";

import OtpStep from "../register/steps/OtpStep";
import PasswordSetupStep from "../register/steps/SetPasswordStep";
import ForgotPasswordEmailStep from "./ForgotPasswordEmailStep";
import { requestPasswordResetApi } from "@/lib/api/AuthApi";

interface ForgotPasswordState {
  email: string;
}

export default function ForgotPasswordPage() {
  const router = useRouter();

  const [devMode, setDevMode] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);

  const [forgotPasswordData, setForgotPasswordData] =
    useState<ForgotPasswordState>({
      email: "",
    });

  const [isRequestingOtp, setIsRequestingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [isResettingPassword, setIsResettingPassword] = useState(false);

  const [emailError, setEmailError] = useState<string>();
  const [otpError, setOtpError] = useState<string>();
  const [passwordError, setPasswordError] = useState<string>();

  const handleEmailSubmit = async (data: { email: string }) => {
    setIsRequestingOtp(true);
    setEmailError(undefined);

    try {
      await requestPasswordResetApi(data.email)

      setForgotPasswordData({
        email: data.email,
      });

      setCurrentStep(1);
    } catch (err: any) {
      setEmailError(
        err.message || "Failed to send verification code. Please try again.",
      );
    } finally {
      setIsRequestingOtp(false);
    }
  };

  const handleVerifyOtp = async (otp: string) => {
    setIsVerifyingOtp(true);
    setOtpError(undefined);

    try {
      // TODO:
      // await verifyForgotPasswordOtpApi(forgotPasswordData.email, otp);

      setCurrentStep(2);
    } catch (err: any) {
      setOtpError(err.message || "Failed to verify verification code.");
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  const handleResendOtp = async () => {
    try {
      // TODO:
      // await forgotPasswordApi(forgotPasswordData.email);
    } catch (err) {
      console.error(err);
    }
  };

  const handleResetPassword = async (
    password: string,
    confirmPassword: string,
  ) => {
    setIsResettingPassword(true);
    setPasswordError(undefined);

    try {
      // TODO:
      // await resetPasswordApi({
      //   email: forgotPasswordData.email,
      //   password,
      //   confirmPassword,
      // });

      router.replace("/login");
    } catch (err: any) {
      setPasswordError(
        err.message || "Failed to reset password. Please try again.",
      );
    } finally {
      setIsResettingPassword(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 p-4 bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-muted/60 via-background to-background">
      <div className="bg-card shadow-2xl rounded-sm overflow-hidden flex max-w-2xl w-full min-h-[520px]">
        <div className="w-full p-8 flex flex-col justify-center">
          {currentStep === 0 && (
            <ForgotPasswordEmailStep
              isSubmitting={isRequestingOtp}
              error={emailError}
              onNext={handleEmailSubmit}
            />
          )}

          {currentStep === 1 && (
            <OtpStep
              email={forgotPasswordData.email}
              isSubmitting={isVerifyingOtp}
              error={otpError}
              onVerify={handleVerifyOtp}
              onResend={handleResendOtp}
            />
          )}

          {currentStep === 2 && (
            <PasswordSetupStep
              isSubmitting={isResettingPassword}
              error={passwordError}
              handleSetPassword={handleResetPassword}
            />
          )}
        </div>
      </div>

      {devMode && (
        <div className="flex items-center gap-2 text-xs text-muted-foreground flex-col">
          <span>Development Only Navigation Bar:</span>

          <div className="flex">
            <button
              type="button"
              disabled={currentStep === 0}
              onClick={() => setCurrentStep((s) => Math.max(0, s - 1))}
              className="px-3 py-1 rounded border hover:bg-muted disabled:opacity-40"
            >
              Back
            </button>

            <button
              type="button"
              disabled={currentStep === 2}
              onClick={() => setCurrentStep((s) => Math.min(2, s + 1))}
              className="ml-2 px-3 py-1 rounded border hover:bg-muted disabled:opacity-40"
            >
              Next
            </button>

            <button
              type="button"
              onClick={() => setDevMode(false)}
              className="ml-2 px-3 py-1 rounded border hover:bg-muted"
            >
              Disable Dev Mode
            </button>
          </div>
        </div>
      )}

      {!devMode && (
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <button
            type="button"
            onClick={() => setDevMode(true)}
            className="px-3 py-1 rounded border hover:bg-muted"
          >
            Enable Dev Mode
          </button>
        </div>
      )}
    </div>
  );
}
