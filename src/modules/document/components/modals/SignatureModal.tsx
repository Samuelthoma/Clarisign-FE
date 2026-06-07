"use client";

import React, { useState, useRef, useEffect } from "react";
import { X, Eraser } from "lucide-react";
import { SignatureMode } from "../../types";
import { Caveat } from "next/font/google";
import SignaturePad from "signature_pad";

interface SignatureModalProps {
  isOpen: boolean;
  mode: SignatureMode;
  onClose: () => void;
  onConfirm: (signatureBase64: string) => void;
}

const signatureFont = Caveat({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

export default function SignatureModal({
  isOpen,
  mode,
  onClose,
  onConfirm,
}: SignatureModalProps) {
  const [typedName, setTypedName] = useState("");

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const signaturePadRef = useRef<SignaturePad | null>(null);

  useEffect(() => {
    if (isOpen) {
      setTypedName("");
      signaturePadRef.current?.clear();
    }
  }, [isOpen, mode]);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas || !isOpen) return;

    const ratio = Math.max(window.devicePixelRatio || 1, 1);

    canvas.width = canvas.offsetWidth * ratio;
    canvas.height = canvas.offsetHeight * ratio;

    const ctx = canvas.getContext("2d");

    if (ctx) {
      ctx.scale(ratio, ratio);
    }

    signaturePadRef.current = new SignaturePad(canvas, {
      minWidth: 0.8,
      maxWidth: 2.5,
      penColor: "#000000",
      velocityFilterWeight: 0.7,
    });

    return () => {
      signaturePadRef.current?.off();
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    if (mode === "DRAWN") {
      const signaturePad = signaturePadRef.current;

      if (!signaturePad) return;

      if (signaturePad.isEmpty()) {
        alert("Please draw your signature before saving.");
        return;
      }

      const dataUrl = signaturePad.toDataURL("image/png");

      onConfirm(dataUrl);
    }

    if (mode === "TYPED") {
      if (!typedName.trim()) {
        alert("Please type your name before saving.");
        return;
      }

      const tempCanvas = document.createElement("canvas");
      const ctx = tempCanvas.getContext("2d");

      if (ctx) {
        ctx.font = `48px ${signatureFont.style.fontFamily}`;
        const metrics = ctx.measureText(typedName);

        tempCanvas.width = metrics.width + 40;
        tempCanvas.height = 70;

        ctx.font = `48px ${signatureFont.style.fontFamily}`;
        ctx.fillStyle = "#000000";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        ctx.fillText(typedName, tempCanvas.width / 2, tempCanvas.height / 2);

        const dataUrl = tempCanvas.toDataURL("image/png");
        onConfirm(dataUrl);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-9999 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800">
            {mode === "DRAWN" ? "Draw Your Signature" : "Type Your Signature"}
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md transition"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 bg-gray-50 flex flex-col items-center justify-center">
          {mode === "DRAWN" ? (
            <div className="w-full relative">
              <canvas
                ref={canvasRef}
                className="w-full h-[200px] bg-white border-2 border-dashed border-gray-300 rounded-lg touch-none"
              />
              <div className="absolute bottom-3 right-3">
                <button
                  onClick={() => signaturePadRef.current?.clear()}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-600 bg-white border border-gray-200 rounded shadow-sm hover:bg-gray-50 hover:text-red-600 transition"
                >
                  <Eraser size={14} />
                  Clear
                </button>
              </div>
            </div>
          ) : (
            <div className="w-full space-y-4">
              <input
                type="text"
                placeholder="Type your full name here..."
                value={typedName}
                onChange={(e) => setTypedName(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition shadow-sm text-center text-lg"
              />

              <div className="w-full h-[120px] bg-white border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center p-4 overflow-hidden">
                {typedName ? (
                  <span
                    className={`text-5xl text-black ${signatureFont.className}`}
                  >
                    {typedName}
                  </span>
                ) : (
                  <span className="text-gray-400 text-sm italic">
                    Preview will appear here
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-end gap-3 bg-white">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition shadow-sm"
          >
            Insert Signature
          </button>
        </div>
      </div>
    </div>
  );
}
