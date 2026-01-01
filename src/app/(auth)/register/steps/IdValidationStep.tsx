'use client';

import React from "react";

export default function IdValidationStep() {
  return (
    <>
      <h2 className="text-2xl font-bold mb-2 text-foreground">
        Verify your identity details
      </h2>

      <p className="text-sm text-muted-foreground mb-6">
        Please review and refine the data if any information is missing or incorrect.
      </p>

      <form className="space-y-6">
        <div>
          <label
            htmlFor="nik"
            className="block text-foreground/80 text-sm font-medium mb-1"
          >
            NIK (16-digit National ID Number)
          </label>
          <input
            id="nik"
            type="text"
            placeholder="e.g. 3201XXXXXXXXXXXX"
            className="
              w-full py-2 bg-transparent
              border-b-2 border-muted-foreground/40
              text-foreground
              focus:outline-none focus:border-primary
              transition-colors
            "
          />
        </div>

        <div>
          <label
            htmlFor="fullName"
            className="block text-foreground/80 text-sm font-medium mb-1"
          >
            Full name (as shown on ID)
          </label>
          <input
            id="fullName"
            type="text"
            placeholder="Enter your full legal name"
            className="
              w-full py-2 bg-transparent
              border-b-2 border-muted-foreground/40
              text-foreground
              focus:outline-none focus:border-primary
              transition-colors
            "
          />
        </div>

        <div>
          <label
            htmlFor="dob"
            className="block text-foreground/80 text-sm font-medium mb-1"
          >
            Date of birth
          </label>
          <input
            id="dob"
            type="date"
            className="
              w-full py-2 bg-transparent
              border-b-2 border-muted-foreground/40
              text-foreground
              focus:outline-none focus:border-primary
              transition-colors
            "
          />
        </div>

        <div className="pt-6">
          <button
            type="button"
            className="
              w-full bg-primary text-primary-foreground
              py-2 rounded
              hover:bg-primary/90
              transition-colors
            "
          >
            Confirm & Continue
          </button>
        </div>
      </form>
    </>
  );
}
