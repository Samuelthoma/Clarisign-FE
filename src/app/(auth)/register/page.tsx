"use client";

import { useEffect, useState } from "react";
import "@/src/styles/globals.css";

import AccountStep from "./steps/AccountStep";
import OtpStep from "./steps/OtpStep";
import IdUploadStep from "./steps/IdUploadStep";
import IdValidationStep from "./steps/IdValidationStep";
import LivenessDetectionStep from "./steps/LivenessDetectionStep";
import { format } from "date-fns";
import {
  idCardOcrApi,
  registerApi,
  setPasswordApi,
  verifyKycApi,
  uploadFaceImageApi,
  verifyOtpApi,
} from "@/lib/api/AuthApi";
import PasswordSetupStep from "./steps/SetPasswordStep";
import { useRouter } from "next/navigation";

interface OcrData {
  NIK: string;
  Nama: string;
  DOB: string;
  idCardImageUrl?: string;
}

interface VerifiedIdData {
  nik: string;
  nama: string;
  tanggalLahir: Date | undefined;
}

interface RegisterDataState {
  email: string;
  ocrData: OcrData | null;
  verifiedIdData: VerifiedIdData | null;
  // Short-lived registration JWT issued at /verify-otp; required by /set-password.
  registrationToken: string | null;
}

// Persist the registration token (with its email) in sessionStorage so an
// accidental refresh mid-registration doesn't lose it. Cleared on tab close.
const REG_STORAGE_KEY = "clarisign_registration";

function persistRegistration(email: string, token: string | null, step?: number) {
  if (typeof window === "undefined") return;
  if (token) {
    sessionStorage.setItem(
      REG_STORAGE_KEY,
      JSON.stringify({ email, token, step: step ?? 2 }),
    );
  } else {
    sessionStorage.removeItem(REG_STORAGE_KEY);
  }
}

function readRegistration(): {
  email: string;
  token: string;
  step?: number;
} | null {
  if (typeof window === "undefined") return null;
  const raw = sessionStorage.getItem(REG_STORAGE_KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    if (parsed?.email && parsed?.token) return parsed;
  } catch {
    /* ignore malformed storage */
  }
  return null;
}

export default function RegisterPage() {
  const router = useRouter();
  const [devMode, setDevMode] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);

  const [registerData, setRegisterData] = useState<RegisterDataState>({
    email: "",
    ocrData: null,
    verifiedIdData: null,
    registrationToken: null,
  });

  // Rehydrate the registration token after a refresh.
  useEffect(() => {
    const saved = readRegistration();
    if (saved) {
      setRegisterData((prev) => ({
        ...prev,
        email: prev.email || saved.email,
        registrationToken: saved.token,
      }));
    }
  }, []);

  const [isRequestingOtp, setIsRequestingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [isProcessingOcr, setIsProcessingOcr] = useState(false);
  const [isSubmittingKyc, setIsSubmittingKyc] = useState(false);
  const [isSettingPassword, setIsSettingPassword] = useState(false);

  const [emailError, setEmailError] = useState<string | undefined>();
  const [otpError, setOtpError] = useState<string | undefined>();
  const [ocrError, setOcrError] = useState<string | undefined>();
  const [kycError, setKycError] = useState<string | undefined>();
  const [passwordError, setPasswordError] = useState<string | undefined>();

  const handleEmailSubmit = async (data: { email: string }) => {
    setIsRequestingOtp(true);
    setEmailError(undefined);

    // If we still hold a valid session (token) for THIS email, resume straight to
    // the last step — no new OTP is sent.
    const saved = readRegistration();
    if (saved?.token && saved.email === data.email) {
      setRegisterData((prev) => ({
        ...prev,
        email: data.email,
        registrationToken: saved.token,
      }));
      setCurrentStep(saved.step && saved.step >= 2 ? saved.step : 2);
      setIsRequestingOtp(false);
      return;
    }

    // No valid session → send an OTP and go verify it (verification mints a fresh
    // token). Any in-progress account resumes through OTP first.
    try {
      const response = await registerApi(data.email);
      const status = response.outputSchema?.registrationStatus;

      // Starting fresh / different email → drop any stale token.
      setRegisterData((prev) => ({
        ...prev,
        email: data.email,
        registrationToken: null,
      }));
      persistRegistration(data.email, null);

      if (status === "COMPLETED") {
        setEmailError("This email is already registered. Please log in.");
        return;
      }

      setCurrentStep(1); // OTP
    } catch (error: any) {
      console.error("Failed to request OTP:", error);
      setEmailError(
        error.message || "Failed to send verification code. Please try again.",
      );
    } finally {
      setIsRequestingOtp(false);
    }
  };

  const handleVerifyOtp = async (otpValue: string) => {
    setIsVerifyingOtp(true);
    setOtpError(undefined);

    try {
      const response = await verifyOtpApi(registerData.email, otpValue);

      // Capture + persist the registration token so /set-password can use it.
      const token: string | null =
        response.outputSchema?.registrationToken ?? null;
      const status: string | undefined =
        response.outputSchema?.registrationStatus;

      // Resume-safe: verify-otp keeps the user's step, so route by returned status.
      const nextStep = status === "PENDING_PASSWORD" ? 5 : 2;

      setRegisterData((prev) => ({ ...prev, registrationToken: token }));
      persistRegistration(registerData.email, token, nextStep);

      setCurrentStep(nextStep);
    } catch (error: any) {
      console.error("Failed to verify OTP:", error);
      setOtpError(error.message || "Failed to verify code. Please try again.");
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  const handleResendOtp = async () => {
    try {
      await registerApi(registerData.email);
    } catch (error: any) {
      console.error("Failed to resend OTP:", error);
    }
  };

  const handleFinalKycSubmission = async (base64FaceImage: string) => {
    const idCardKey = registerData.ocrData?.idCardImageUrl;
    if (!idCardKey) {
      console.error("Missing ID card image. Cannot submit KYC.");
      setKycError("Missing ID card data. Please re-upload your ID.");
      return;
    }

    try {
      setIsSubmittingKyc(true);
      setKycError(undefined);

      const res = await fetch(base64FaceImage);
      const blob = await res.blob();
      const imageFile = new File([blob], "selfie.jpg", { type: "image/jpeg" });

      const uploadRes = await uploadFaceImageApi(imageFile);
      const selfieObjectId = uploadRes.objectId;

      // The server (Python) runs OCR + face match and reports the verdict to
      // sign-api. In production, NIK/name/DOB are extracted server-side (OCR is
      // authoritative). The reviewed values below are only honored when the
      // server's KYC_ALLOW_CLIENT_IDENTITY dev flag is on (for testing).
      const verified = registerData.verifiedIdData;
      const result = await verifyKycApi({
        email: registerData.email,
        id_card_key: idCardKey,
        selfie_key: selfieObjectId,
        nik: verified?.nik,
        full_name: verified?.nama,
        date_of_birth: verified?.tanggalLahir
          ? format(verified.tanggalLahir, "yyyy-MM-dd")
          : undefined,
      });

      if (result?.valid === false) {
        const reasons: string[] = result.reasons ?? [];
        setKycError(
          reasons.length
            ? `Verification failed: ${reasons.join("; ")}`
            : "Identity verification did not pass. Please try again.",
        );
        return;
      }

      // KYC done → remember set-password as the resume point.
      persistRegistration(registerData.email, registerData.registrationToken, 5);
      setCurrentStep(5);
    } catch (error: any) {
      console.error("Failed KYC submission:", error);
      setKycError(
        error.message || "Failed to submit verification. Please try again.",
      );
    } finally {
      setIsSubmittingKyc(false);
    }
  };

  const handleIdUpload = async (file: File) => {
    setIsProcessingOcr(true);
    setOcrError(undefined);

    try {
      const result = await idCardOcrApi(file);

      setRegisterData((prev) => ({
        ...prev,
        ocrData: {
          ...result.extracted_data,
          idCardImageUrl: result.key,
        },
      }));

      setCurrentStep(3);
    } catch (err: any) {
      console.error("OCR API failed:", err);
      setOcrError(
        "We had trouble reading your ID. Please ensure the image is clear and try again.",
      );
    } finally {
      setIsProcessingOcr(false);
    }
  };

  const handleSetPassword = async (
    password: string,
    confirmPassword: string,
  ) => {
    setIsSettingPassword(true);
    setPasswordError(undefined);

    try {
      const token = registerData.registrationToken;
      if (!token) {
        // No valid session token (e.g. it expired or was never obtained).
        setPasswordError(
          "Your registration session has expired. Please verify the OTP again.",
        );
        setCurrentStep(1);
        return;
      }

      const passwordPayload = {
        email: registerData.email,
        password: password,
        confirmPassword: confirmPassword,
        registrationToken: token,
      };

      await setPasswordApi(passwordPayload);

      persistRegistration(registerData.email, null); // consume the token
      router.replace("/login");
    } catch (err: any) {
      console.log("Failed to set password", err);
      setPasswordError(
        err.message || "Failed to set password. Please try again.",
      );
    } finally {
      setIsSettingPassword(false);
    }
  };

  return (
    <div className="min-h-dvh flex flex-col items-center justify-center gap-4 p-4 bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-muted/60 via-background to-background">
      <div className="bg-card shadow-2xl rounded-sm flex max-w-2xl w-full min-h-[520px]">
        <div className="w-full p-8 flex flex-col justify-center">
          {currentStep === 0 && (
            <AccountStep
              isSubmitting={isRequestingOtp}
              error={emailError}
              onNext={handleEmailSubmit}
            />
          )}

          {currentStep === 1 && (
            <OtpStep
              email={registerData.email}
              isSubmitting={isVerifyingOtp}
              error={otpError}
              onVerify={handleVerifyOtp}
              onResend={handleResendOtp}
            />
          )}
          {currentStep === 2 && (
            <IdUploadStep
              isSubmitting={isProcessingOcr}
              error={ocrError}
              onUpload={handleIdUpload}
            />
          )}
          {currentStep === 3 && (
            <IdValidationStep
              ocrData={registerData.ocrData}
              onNext={(validatedData) => {
                setRegisterData((prev) => ({
                  ...prev,
                  verifiedIdData: validatedData,
                }));
                setCurrentStep(4);
              }}
            />
          )}
          {currentStep === 4 && (
            <LivenessDetectionStep
              isSubmitting={isSubmittingKyc}
              error={kycError}
              onNext={handleFinalKycSubmission}
            />
          )}
          {currentStep === 5 && (
            <PasswordSetupStep
              isSubmitting={isSettingPassword}
              error={passwordError}
              handleSetPassword={handleSetPassword}
            />
          )}
        </div>
      </div>

      {devMode && (
        <div className="flex items-center gap-2 text-xs text-muted-foreground flex-col">
          <span>Development Only Navigation Bar:</span>

          <div className="flex flex-row">
            <button
              type="button"
              disabled={currentStep === 0}
              onClick={() => setCurrentStep((s) => Math.max(0, s - 1))}
              className="px-3 py-1 rounded border border-b hover:bg-muted disabled:opacity-40"
            >
              Back
            </button>

            <button
              type="button"
              disabled={currentStep === 5}
              onClick={() => setCurrentStep((s) => Math.min(5, s + 1))}
              className="px-3 py-1 ml-2 rounded border border-b hover:bg-muted disabled:opacity-40"
            >
              Next
            </button>

            <button
              type="button"
              onClick={() => setDevMode(false)}
              className="ml-2 px-3 py-1 rounded border border-b hover:bg-muted"
            >
              Disable Dev Mode
            </button>
          </div>
        </div>
      )}

      {!devMode && (
        <div className="flex items-center gap-2 text-xs text-muted-foreground flex-col">
          <button
            type="button"
            onClick={() => setDevMode(true)}
            className="ml-2 px-3 py-1 rounded border border-b hover:bg-muted"
          >
            Enable Dev Mode
          </button>
        </div>
      )}
    </div>
  );
}
