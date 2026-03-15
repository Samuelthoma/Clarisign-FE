"use client";

import { idCardOcrApi } from "@/lib/api/AuthApi";
import React, { useRef, useState } from "react";
import { Loader2 } from "lucide-react";

interface IdUploadStepProps {
  onNext: (extractedData: any) => void; 
}

export default function IdUploadStep({ onNext }: IdUploadStepProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    setError(null); 

    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  };

  const handleSubmit = async () => {
    if (!selectedFile) return;
    setIsProcessing(true);
    setError(null);

    try {
      const result = await idCardOcrApi(selectedFile);
      console.log(result.extracted_data);
      
      onNext(result.extracted_data); 
    } catch (err) {
      console.error("OCR API failed:", err);
      setError("We had trouble reading your ID. Please try again.");
    } finally {
      setIsProcessing(false);
    }
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
        onClick={() => !isProcessing && inputRef.current?.click()}
        className={`
          flex flex-col items-center justify-center
          w-full h-28
          border border-dashed border-muted-foreground/40
          rounded-sm
          transition-colors
          ${isProcessing ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:border-primary"}
        `}
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
        disabled={isProcessing}
      />

      {previewUrl && (
        <div className="mt-6">
          <img
            src={previewUrl}
            alt="Uploaded ID card preview"
            className={`
              w-full h-40
              object-contain
              rounded-sm
              border border-border
              bg-muted
              transition-opacity
              ${isProcessing ? "opacity-50" : "opacity-100"}
            `}
          />
        </div>
      )}

      {error && (
        <div className="mt-4 p-3 bg-destructive/10 border border-destructive/20 text-destructive text-sm rounded-sm">
          {error}
        </div>
      )}

      {!previewUrl && !error && (
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
          onClick={handleSubmit}
          disabled={!previewUrl || isProcessing}
          className="
            w-full bg-primary text-primary-foreground py-2 rounded 
            hover:bg-primary/90 transition-colors
            disabled:opacity-50 disabled:cursor-not-allowed
            flex items-center justify-center gap-2
          "
        >
          {isProcessing && <Loader2 className="w-4 h-4 animate-spin" />}
          {isProcessing ? "Verifying..." : "Continue"}
        </button>
      </div>
    </>
  );
}