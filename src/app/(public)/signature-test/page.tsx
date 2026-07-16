"use client";

import { useState } from "react";
import SignatureModal from "@/src/modules/document/components/modals/SignatureModal";
import { SignatureMode } from "@/src/modules/document/types";

export default function SignatureTestPage() {
  const [mode, setMode] = useState<SignatureMode>("DRAWN");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [capturedSignature, setCapturedSignature] = useState<string | null>(
    null,
  );

  const handleConfirm = (signatureBase64: string) => {
    setCapturedSignature(signatureBase64);
    setIsModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#f4f6f8] flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100">
          <h1 className="text-xl font-bold text-gray-800">
            Signature Pad Test
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Test the signature capture on your device
          </p>
        </div>

        <div className="p-6 space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Signature Mode
            </label>
            <div className="flex gap-3">
              <button
                onClick={() => setMode("DRAWN")}
                className={`flex-1 py-3 px-4 rounded-lg text-base font-medium transition touch-manipulation ${
                  mode === "DRAWN"
                    ? "bg-blue-600 text-white shadow-sm"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Draw
              </button>
              <button
                onClick={() => setMode("TYPED")}
                className={`flex-1 py-3 px-4 rounded-lg text-base font-medium transition touch-manipulation ${
                  mode === "TYPED"
                    ? "bg-blue-600 text-white shadow-sm"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Type
              </button>
            </div>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="w-full py-4 bg-gray-900 hover:bg-gray-800 text-white rounded-lg text-lg font-medium transition touch-manipulation"
          >
            Open Signature Pad
          </button>

          {capturedSignature && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">
                  Captured Signature
                </label>
                <button
                  onClick={() => setCapturedSignature(null)}
                  className="text-sm text-red-600 hover:text-red-700 font-medium touch-manipulation"
                >
                  Clear
                </button>
              </div>

              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 flex items-center justify-center min-h-[100px]">
                <img
                  src={capturedSignature}
                  alt="Captured signature"
                  className="max-w-full max-h-[120px] object-contain"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-500">
                  Base64 Output
                </label>
                <pre className="text-xs text-gray-400 bg-gray-50 border border-gray-200 rounded-lg p-3 overflow-x-auto whitespace-pre-wrap break-all select-all">
                  {capturedSignature.length > 120
                    ? `${capturedSignature.slice(0, 120)}...`
                    : capturedSignature}
                </pre>
              </div>
            </div>
          )}
        </div>

        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
          <p className="text-xs text-gray-400 text-center">
            Touch-friendly &middot; No authentication required &middot; Data
            stays on device
          </p>
        </div>
      </div>

      <SignatureModal
        isOpen={isModalOpen}
        mode={mode}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirm}
      />
    </div>
  );
}
