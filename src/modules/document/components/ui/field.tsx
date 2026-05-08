"use client";

import { DraftField, Signer } from "../../types";
import { ImageUpscale, PenLine, X } from "lucide-react";

interface FieldBoxProps {
  field: DraftField;
  signer?: Signer;
  scale: number;
  mode?: "draft" | "sign" | "view";
  onStartMove?: (
    e: React.MouseEvent<HTMLDivElement>,
    field: DraftField,
  ) => void;
  onStartResize?: (
    e: React.MouseEvent<HTMLDivElement>,
    field: DraftField,
  ) => void;
  onRemove?: (id: string) => void;
  onSignClick?: (field: DraftField) => void;
  signatureValue?: string | null;
  canEdit?: Boolean
}

export default function FieldBox({
  field,
  signer,
  scale,
  mode = "draft",
  canEdit = false,
  onStartMove,
  onStartResize,
  onRemove,
  onSignClick,
  signatureValue,
  
}: FieldBoxProps) {
  const borderColor = signer?.color ?? "#2563eb";
  const isDraftMode = mode === "draft" && canEdit;
  const isSignMode = mode === "sign";

  const getCursorStyle = () => {
    if (isDraftMode) return "cursor-move";
    if (isSignMode) return "cursor-pointer hover:shadow-md hover:ring-2";
    return "cursor-default";
  };

  return (
    <div
      id={`field-${field.id}`}
      data-field
      onMouseDown={(e) => {
        if (isDraftMode && onStartMove) {
          onStartMove(e, field);
        }
      }}
      onClick={(e) => {
        if (isSignMode && onSignClick) {
          e.stopPropagation();
          onSignClick(field);
        }
      }}
      className={`absolute rounded-md z-20 group transition-opacity duration-200 ${getCursorStyle()}`}
      style={{
        left: field.x * scale,
        top: field.y * scale,
        width: field.width * scale,
        height: field.height * scale,
        border: `2px solid ${borderColor}`,
        backgroundColor: signatureValue ? "transparent" : `${borderColor}20`,
      }}
    >
      {signatureValue ? (
        <div className="relative w-full h-full group/sig flex items-center justify-center">
          <img
            src={signatureValue}
            alt="Signature"
            style={{
              width: Math.max(field.width, 140) * scale,
              height: Math.max(field.height, 60) * scale,
            }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 object-contain p-1 drop-shadow-sm pointer-events-none"
            draggable={false}
          />

          {isSignMode && (
            <div className="absolute inset-0 bg-white/70 opacity-0 group-hover/sig:opacity-100 transition-opacity flex items-center justify-center rounded-sm z-10">
              <span className="text-[11px] font-medium text-gray-700 flex items-center gap-1.5 bg-white px-2 py-1 rounded shadow-sm border border-gray-200">
                <PenLine size={12} /> Edit Signature
              </span>
            </div>
          )}
        </div>
      ) : (
        <div className="flex flex-col justify-between h-full p-2">
          <div className="flex items-center gap-2 text-[10px] font-medium min-w-0">
            <div
              className="w-4 h-4 rounded-full flex items-center justify-center text-[8px] text-white shrink-0 shadow-sm"
              style={{ backgroundColor: signer?.color }}
            >
              {signer?.name?.charAt(0).toUpperCase()}
            </div>
            <span className="truncate">{signer?.name}</span>
          </div>

          <div className="flex items-center justify-between text-gray-500 text-[11px]">
            <div className="flex items-center gap-1">
              <PenLine size={10} />
              <span className="truncate">Signature</span>
            </div>
          </div>
        </div>
      )}

      {isDraftMode && (
        <>
          <div
            onMouseDown={(e) => {
              e.stopPropagation();
              if (onStartResize) onStartResize(e, field);
            }}
            className="absolute bottom-1 right-1 w-4 h-4 flex items-center justify-center text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity cursor-se-resize"
          >
            <ImageUpscale size={14} />
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              if (onRemove) onRemove(field.id);
            }}
            className="absolute -top-2 -right-2 w-5 h-5 flex items-center justify-center rounded-full bg-white text-gray-500 border border-gray-200 shadow-sm opacity-0 group-hover:opacity-100 transition-all hover:bg-red-50 hover:text-red-600 z-30"
          >
            <X size={12} />
          </button>
        </>
      )}
    </div>
  );
}
