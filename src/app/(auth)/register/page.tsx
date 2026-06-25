"use client";

import { useState } from "react";
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
  updateKycStatusApi,
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
}

export default function RegisterPage() {
  const router = useRouter();
  const [devMode, setDevMode] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);

  const [registerData, setRegisterData] = useState<RegisterDataState>({
    email: "",
    ocrData: null,
    verifiedIdData: null,
  });

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

    try {
      const response = await registerApi(data.email);

      if (response.errorSchema.code === "200") {
        setRegisterData((prev) => ({
          ...prev,
          email: data.email,
        }));

        const status = response.outputSchema?.registrationStatus;

        switch (status) {
          case "PENDING_OTP":
            setCurrentStep(1);
            if (response.outputSchema?.otpSent === false) {
              handleResendOtp();
            }
            break;

          case "PENDING_KYC":
            setCurrentStep(2);
            break;

          case "PENDING_PASSWORD":
            setCurrentStep(5);
            break;

          default:
            setCurrentStep(1);
            break;
        }
      } else {
        setEmailError(response.errorSchema.message);
      }
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
      const res = await verifyOtpApi(registerData.email, otpValue);

      if (res.code == 200 || res.errorSchema?.code === "200") {
        setCurrentStep(2);
      } else {
        setOtpError(
          res.message || res.errorSchema?.message || "Invalid OTP code.",
        );
      }
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
    if (
      !registerData.ocrData ||
      !registerData.verifiedIdData ||
      !registerData.verifiedIdData.tanggalLahir
    ) {
      console.error("Missing required registration data. Cannot submit KYC.");
      setKycError("Missing required data. Please review previous steps.");
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

      const formattedDob = format(
        registerData.verifiedIdData.tanggalLahir,
        "yyyy-MM-dd",
      );

      const finalPayload = {
        email: registerData.email,
        nik: registerData.verifiedIdData.nik,
        fullName: registerData.verifiedIdData.nama,
        dateOfBirth: formattedDob,
        idCardImageUrl:
          registerData.ocrData.idCardImageUrl || "missing-id-card-url",
        selfieImageUrl: selfieObjectId,
        isKycValid: true,
      };

      console.log(finalPayload);
      await updateKycStatusApi(finalPayload);

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
      const passwordPayload = {
        email: registerData.email,
        password: password,
        confirmPassword: confirmPassword,
      };

      await setPasswordApi(passwordPayload);
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
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 p-4 bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-muted/60 via-background to-background">
      <div className="bg-card shadow-2xl rounded-sm overflow-hidden flex max-w-2xl w-full min-h-[520px]">
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
