"use client";

import React, { useState, useRef, useEffect } from "react";
import { X, Eraser, PenLine, Upload, Bookmark } from "lucide-react";
import { toast } from "sonner";
import { SignatureMode } from "../../types";
import { Caveat } from "next/font/google";
import SignaturePad from "signature_pad";
import {
  getSavedSignatureApi,
  saveSignatureApi,
  SavedSignatureResponse,
} from "@/lib/api/UserApi";

interface SignatureModalProps {
  isOpen: boolean;
  mode: SignatureMode;
  onClose: () => void;
  onConfirm: (signatureBase64: string, applyToAll?: boolean) => void;
  /** How many of the signer's still-pending boxes share this mode (enables "fill all"). */
  applicableCount?: number;
}

const signatureFont = Caveat({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

// Mirror the backend policy (SaveSignatureRequestDto): PNG/JPEG, max 1 MB.
const MAX_UPLOAD_BYTES = 1024 * 1024;
const ALLOWED_TYPES = ["image/png", "image/jpeg"];

const trimSignatureWhitespace = (dataUrl: string): Promise<string> =>
  new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      if (!ctx) return resolve(dataUrl);
      ctx.drawImage(img, 0, 0);

      let imageData: ImageData;
      try {
        imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      } catch {
        return resolve(dataUrl);
      }

      const { width, height } = canvas;
      const px = imageData.data;
      let minX = width;
      let minY = height;
      let maxX = -1;
      let maxY = -1;

      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          const i = (y * width + x) * 4;
          const alpha = px[i + 3];
          if (alpha < 16) continue; // transparent background
          const r = px[i];
          const g = px[i + 1];
          const b = px[i + 2];
          if (r > 245 && g > 245 && b > 245) continue; // near-white background
          if (x < minX) minX = x;
          if (x > maxX) maxX = x;
          if (y < minY) minY = y;
          if (y > maxY) maxY = y;
        }
      }

      // No ink found (blank/white image) — keep the original.
      if (maxX < minX || maxY < minY) return resolve(dataUrl);

      const pad = Math.round(Math.max(width, height) * 0.02) + 4;
      const sx = Math.max(0, minX - pad);
      const sy = Math.max(0, minY - pad);
      const sw = Math.min(width, maxX + pad + 1) - sx;
      const sh = Math.min(height, maxY + pad + 1) - sy;

      const out = document.createElement("canvas");
      out.width = sw;
      out.height = sh;
      const octx = out.getContext("2d");
      if (!octx) return resolve(dataUrl);
      octx.drawImage(canvas, sx, sy, sw, sh, 0, 0, sw, sh);
      resolve(out.toDataURL("image/png"));
    };
    img.onerror = () => resolve(dataUrl);
    img.src = dataUrl;
  });

type DrawnTab = "draw" | "upload" | "saved";

const DRAWN_TABS: { key: DrawnTab; label: string; icon: React.ReactNode }[] = [
  { key: "draw", label: "Draw", icon: <PenLine size={14} /> },
  { key: "upload", label: "Upload", icon: <Upload size={14} /> },
  { key: "saved", label: "Saved", icon: <Bookmark size={14} /> },
];

export default function SignatureModal({
  isOpen,
  mode,
  onClose,
  onConfirm,
  applicableCount = 0,
}: SignatureModalProps) {
  const [typedName, setTypedName] = useState("");

  const [tab, setTab] = useState<DrawnTab>("draw");
  const [saveAsDefault, setSaveAsDefault] = useState(false);
  const [applyToAll, setApplyToAll] = useState(false);
  const [uploadPreview, setUploadPreview] = useState<string | null>(null);
  const [saved, setSaved] = useState<SavedSignatureResponse | null>(null);
  const [isInserting, setIsInserting] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const signaturePadRef = useRef<SignaturePad | null>(null);

  useEffect(() => {
    if (isOpen) {
      setTypedName("");
      setTab("draw");
      setSaveAsDefault(false);
      setApplyToAll(false);
      setUploadPreview(null);
      signaturePadRef.current?.clear();

      // Know up-front whether a saved signature exists, so the Saved tab is instant.
      if (mode === "DRAWN") {
        setSaved(null);
        getSavedSignatureApi()
          .then(setSaved)
          .catch(() => setSaved({ exists: false, dataUrl: null }));
      }
    }
  }, [isOpen, mode]);

  // Re-runs when returning to the Draw tab, because the canvas unmounts on other tabs.
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
  }, [isOpen, tab]);

  if (!isOpen) return null;

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!ALLOWED_TYPES.includes(file.type)) {
      toast.error("Only PNG or JPEG images are allowed.");
      return;
    }
    if (file.size > MAX_UPLOAD_BYTES) {
      toast.error("Signature image must be at most 1 MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = async () => {
      // Trim right away so the preview shows what will actually land in the box.
      const trimmed = await trimSignatureWhitespace(reader.result as string);
      setUploadPreview(trimmed);
    };
    reader.readAsDataURL(file);
  };

  /** Persist as the user's reusable signature (best-effort — insertion proceeds regardless). */
  const persistAsDefault = async (dataUrl: string) => {
    try {
      const blob = await (await fetch(dataUrl)).blob();
      const toSave = new File([blob], "signature.png", { type: "image/png" });
      const result = await saveSignatureApi(toSave);
      setSaved(result);
      toast.success("Signature saved for future use.");
    } catch (err: any) {
      toast.error(err?.message || "Failed to save signature for reuse.");
    }
  };

  const handleSave = async () => {
    if (mode === "TYPED") {
      if (!typedName.trim()) {
        toast.error("Please type your name before saving.");
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
        onConfirm(dataUrl, applyToAll);
      }
      return;
    }

    // DRAWN mode — behaviour depends on the active tab.
    if (tab === "draw") {
      const signaturePad = signaturePadRef.current;
      if (!signaturePad) return;

      if (signaturePad.isEmpty()) {
        toast.error("Please draw your signature before saving.");
        return;
      }

      setIsInserting(true);
      try {
        // Trim so a small doodle in the corner of the canvas still fills the box.
        const dataUrl = await trimSignatureWhitespace(
          signaturePad.toDataURL("image/png"),
        );
        if (saveAsDefault) await persistAsDefault(dataUrl);
        onConfirm(dataUrl, applyToAll);
      } finally {
        setIsInserting(false);
      }
      return;
    }

    if (tab === "upload") {
      if (!uploadPreview) {
        toast.error("Please choose a signature image first.");
        return;
      }
      setIsInserting(true);
      try {
        // Preview is already trimmed — insert and (optionally) save that version.
        if (saveAsDefault) await persistAsDefault(uploadPreview);
        onConfirm(uploadPreview, applyToAll);
      } finally {
        setIsInserting(false);
      }
      return;
    }

    // tab === "saved"
    if (!saved?.exists || !saved.dataUrl) {
      toast.error("You have no saved signature yet.");
      return;
    }
    setIsInserting(true);
    try {
      // Legacy saves may predate trimming — trim on the way into the box.
      onConfirm(await trimSignatureWhitespace(saved.dataUrl), applyToAll);
    } finally {
      setIsInserting(false);
    }
  };

  const saveAsDefaultCheckbox = (
    <label className="mt-3 flex items-center gap-2 text-sm text-gray-600 cursor-pointer select-none">
      <input
        type="checkbox"
        checked={saveAsDefault}
        onChange={(e) => setSaveAsDefault(e.target.checked)}
        className="rounded border-gray-300"
      />
      Save as my reusable signature
      {saved?.exists && (
        <span className="text-xs text-amber-600">(replaces your current one)</span>
      )}
    </label>
  );

  return (
    <div className="fixed inset-0 z-9999 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800">
            {mode === "DRAWN" ? "Add Your Signature" : "Type Your Signature"}
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md transition"
          >
            <X size={20} />
          </button>
        </div>

        {mode === "DRAWN" && (
          <div className="flex gap-1 px-6 pt-4 bg-gray-50">
            {DRAWN_TABS.map(({ key, label, icon }) => (
              <button
                key={key}
                onClick={() => setTab(key)}
                className={`flex items-center gap-1.5 px-3.5 py-2 text-sm font-medium rounded-t-lg border border-b-0 transition
                  ${
                    tab === key
                      ? "bg-white text-blue-700 border-gray-200"
                      : "bg-gray-100 text-gray-500 border-transparent hover:text-gray-700"
                  }`}
              >
                {icon}
                {label}
                {key === "saved" && saved?.exists && (
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                )}
              </button>
            ))}
          </div>
        )}

        <div className="p-6 bg-gray-50 flex flex-col items-center justify-center">
          {mode === "TYPED" ? (
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
          ) : tab === "draw" ? (
            <div className="w-full">
              <div className="relative">
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
              {saveAsDefaultCheckbox}
            </div>
          ) : tab === "upload" ? (
            <div className="w-full">
              <label className="w-full h-[200px] bg-white border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-blue-400 transition p-4">
                {uploadPreview ? (
                  <img
                    src={uploadPreview}
                    alt="Signature preview"
                    className="max-h-full max-w-full object-contain"
                  />
                ) : (
                  <>
                    <Upload size={28} className="text-gray-400" />
                    <span className="text-sm text-gray-500">
                      Click to choose a PNG or JPEG (max 1 MB)
                    </span>
                    <span className="text-xs text-gray-400">
                      PNG with a transparent background looks best on documents
                    </span>
                  </>
                )}
                <input
                  type="file"
                  accept="image/png,image/jpeg"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </label>
              {uploadPreview && (
                <p className="mt-2 text-xs text-gray-500 text-center">
                  Click the preview to choose a different image.
                </p>
              )}
              {saveAsDefaultCheckbox}
            </div>
          ) : (
            <div className="w-full">
              {saved === null ? (
                <div className="w-full h-[200px] bg-white border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                  <span className="text-sm text-gray-400">
                    Loading your saved signature…
                  </span>
                </div>
              ) : saved.exists && saved.dataUrl ? (
                <>
                  <div className="w-full h-[200px] bg-white border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center p-4">
                    <img
                      src={saved.dataUrl}
                      alt="Saved signature"
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                  <p className="mt-2 text-xs text-gray-500 text-center">
                    Your saved signature — click Insert to place it in the box.
                  </p>
                </>
              ) : (
                <div className="w-full h-[200px] bg-white border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center gap-1 p-6 text-center">
                  <Bookmark size={24} className="text-gray-300" />
                  <span className="text-sm text-gray-500">
                    No saved signature yet.
                  </span>
                  <span className="text-xs text-gray-400">
                    Draw or upload one and tick “Save as my reusable signature”.
                  </span>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between gap-3 bg-white">
          {applicableCount > 1 ? (
            <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={applyToAll}
                onChange={(e) => setApplyToAll(e.target.checked)}
                className="rounded border-gray-300"
              />
              Fill all {applicableCount} of my{" "}
              {mode === "DRAWN" ? "drawn" : "typed"} boxes
            </label>
          ) : (
            <span />
          )}
          <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={
              isInserting ||
              (mode === "DRAWN" && tab === "saved" && !saved?.exists)
            }
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isInserting ? "Inserting…" : "Insert Signature"}
          </button>
          </div>
        </div>
      </div>
    </div>
  );
}
