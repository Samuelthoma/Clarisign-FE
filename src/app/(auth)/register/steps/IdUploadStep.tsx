"use client";

import React, { useRef, useState } from "react";

export default function IdUploadStep() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    console.log("Selected file:", file); 

    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  };

  return (
    <>
      <h2 className="text-2xl font-bold mb-2 text-foreground">
        Upload your identification
      </h2>

      <p className="text-sm text-muted-foreground mb-6">
        Please upload a clear photo of your government-issued ID card for
        identity verification.
      </p>

      <div
        onClick={() => inputRef.current?.click()}
        className="
          flex flex-col items-center justify-center
          w-full h-28
          border border-dashed border-muted-foreground/40
          rounded-sm
          cursor-pointer
          hover:border-primary
          transition-colors
        "
      >
        <span className="text-sm text-muted-foreground">
          {previewUrl ? "Replace uploaded image" : "Click to upload ID card"}
        </span>
        <span className="text-xs text-muted-foreground mt-1">
          JPG or PNG, max 5MB
        </span>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/png, image/jpeg"
        className="hidden"
        onChange={handleFileChange}
      />

      {previewUrl && (
        <div className="mt-6">
          <img
            src={previewUrl}
            alt="Uploaded ID card preview"
            className="
              w-full h-40
              object-contain
              rounded-sm
              border border-border
              bg-muted
            "
          />
        </div>
      )}

      {!previewUrl && (
        <div className="mt-6 text-sm text-muted-foreground">
          <p className="mb-1 font-medium text-foreground">
            Make sure your image is clear:
          </p>
          <ul className="list-disc list-inside space-y-1">
            <li>All text must be readable</li>
            <li>No glare or shadows</li>
            <li>Entire card visible</li>
          </ul>
        </div>
      )}

      <div className="pt-6">
        <button
          type="button"
          className="w-full bg-primary text-primary-foreground py-2 rounded hover:bg-primary/90 transition-colors"
        >
          Continue
        </button>
      </div>
    </>
  );
}
