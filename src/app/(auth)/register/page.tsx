"use client";

import { useState } from "react";
import "../../../styles/globals.css";

import AccountStep from "./steps/AccountStep";
import OtpStep from "./steps/OtpStep";
import IdUploadStep from "./steps/IdUploadStep";
import IdValidationStep from "./steps/IdValidationStep";
import LivenessDetectionStep from "./steps/LivenessDetectionStep";
import VerificationPendingStep from "./steps/VerificationPendingStep";

export default function RegisterPage() {
  const [devMode, setDevMode] = useState(true);

  const [currentStep, setCurrentStep] = useState(0);

  const [registerData, setRegisterData] = useState({
    email: "",
    username: "",
    password: "",
  });

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 p-4 bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-muted/60 via-background to-background">
      <div className="bg-card shadow-2xl rounded-sm overflow-hidden flex max-w-4xl w-full h-[520px]">
        <div className="w-1/2 p-8 flex flex-col justify-center">
          {currentStep === 0 && (
            <AccountStep
              onNext={(data) => {
                setRegisterData(data);
                setCurrentStep(1);
              }}
            />
          )}

          {currentStep === 1 && <OtpStep email={registerData.email} />}
          {currentStep === 2 && <IdUploadStep />}
          {currentStep === 3 && <IdValidationStep />}
          {currentStep === 4 && <LivenessDetectionStep />}
          {currentStep === 5 && <VerificationPendingStep />}
        </div>

        <div className="w-1/2 bg-muted border-l border-border/60">
          <img
            src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=1200"
            alt="Office documents"
            className="w-full h-full object-cover"
          />
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
