'use client';

import React from "react";

export default function VerificationPendingStep() {
  return (
    <>
      <div className="flex flex-col items-center text-center">
        {/* Icon */}
        <div
          className="
            w-12 h-12
            flex items-center justify-center
            rounded-full
            bg-muted
            mb-4
          "
        >
          <svg
            className="w-6 h-6 text-muted-foreground"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 8v4l3 3"
            />
            <circle cx="12" cy="12" r="9" />
          </svg>
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-foreground mb-2">
          Verification in progress
        </h2>

        {/* Message */}
        <p className="text-sm text-muted-foreground mb-6 max-w-md">
          Thank you for completing the registration process. Your information
          has been submitted and is currently under review by our internal
          verification team.
        </p>

        <p className="text-sm text-muted-foreground mb-8 max-w-md">
          Once your account has been approved, you will receive a notification
          via email. This process may take up to <strong>1–2 business days</strong>.
        </p>

        {/* Action */}
        <a
          href="/login"
          className="
            inline-flex items-center justify-center
            px-6 py-2
            rounded
            bg-primary
            text-primary-foreground
            hover:bg-primary/90
            transition-colors
          "
        >
          Back to login
        </a>
      </div>
    </>
  );
}
