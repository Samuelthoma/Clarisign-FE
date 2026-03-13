"use client";

import React, { useState, useRef, useEffect } from "react";
import { X, Eraser } from "lucide-react";
import { SignatureMode } from "../../types";
import { Caveat } from "next/font/google";

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
  const isDrawing = useRef(false);

  useEffect(() => {
    if (isOpen) {
      setTypedName("");
      clearCanvas();
    }
  }, [isOpen, mode]);

  if (!isOpen) return null;

  const startDrawing = (
    e:
      | React.MouseEvent<HTMLCanvasElement>
      | React.TouchEvent<HTMLCanvasElement>,
  ) => {
    isDrawing.current = true;
    draw(e);
  };

  const stopDrawing = () => {
    isDrawing.current = false;
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) ctx.beginPath();
    }
  };

  const draw = (
    e:
      | React.MouseEvent<HTMLCanvasElement>
      | React.TouchEvent<HTMLCanvasElement>,
  ) => {
    if (!isDrawing.current) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    let x = 0;
    let y = 0;

    if ("touches" in e) {
      x = e.touches[0].clientX - rect.left;
      y = e.touches[0].clientY - rect.top;
    } else {
      x = (e as React.MouseEvent).clientX - rect.left;
      y = (e as React.MouseEvent).clientY - rect.top;
    }

    ctx.lineWidth = 5;
    ctx.lineCap = "round";
    ctx.strokeStyle = "#000000";

    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  };

  const handleSave = () => {
    if (mode === "DRAW") {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const isCanvasBlank = (canvas: HTMLCanvasElement) => {
        const context = canvas.getContext("2d");
        if (!context) return true;
        const pixelBuffer = new Uint32Array(
          context.getImageData(0, 0, canvas.width, canvas.height).data.buffer,
        );
        return !pixelBuffer.some((color) => color !== 0);
      };

      if (isCanvasBlank(canvas)) {
        alert("Please draw your signature before saving.");
        return;
      }

      const dataUrl = canvas.toDataURL("image/png");
      onConfirm(dataUrl);
    }

    if (mode === "TYPE") {
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
            {mode === "DRAW" ? "Draw Your Signature" : "Type Your Signature"}
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md transition"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 bg-gray-50 flex flex-col items-center justify-center">
          {mode === "DRAW" ? (
            <div className="w-full relative">
              <canvas
                ref={canvasRef}
                width={400}
                height={200}
                onMouseDown={startDrawing}
                onMouseUp={stopDrawing}
                onMouseOut={stopDrawing}
                onMouseMove={draw}
                onTouchStart={startDrawing}
                onTouchEnd={stopDrawing}
                onTouchCancel={stopDrawing}
                onTouchMove={(e) => {
                  e.preventDefault();
                  draw(e);
                }}
                className="w-full h-[200px] bg-white border-2 border-dashed border-gray-300 rounded-lg cursor-crosshair touch-none"
              />
              <div className="absolute bottom-3 right-3">
                <button
                  onClick={clearCanvas}
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
