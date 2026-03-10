"use client";

import { DraftField, Signer } from "../../types";
import { ImageUpscale, PenLine, X } from "lucide-react";

interface FieldBoxProps {
  field: DraftField;
  signer?: Signer;
  scale: number;

  mode?: "draft" | "sign" | "view";
  
  onStartMove?: (e: React.MouseEvent<HTMLDivElement>, field: DraftField) => void;
  onStartResize?: (e: React.MouseEvent<HTMLDivElement>, field: DraftField) => void;
  onRemove?: (id: string) => void;

  onSignClick?: (field: DraftField) => void;
  
  signatureValue?: string | null; 
}

export default function FieldBox({
  field,
  signer,
  scale,
  mode = "draft",
  onStartMove,
  onStartResize,
  onRemove,
  onSignClick,
  signatureValue,
}: FieldBoxProps) {
  const borderColor = signer?.color ?? "#2563eb";
  const isDraftMode = mode === "draft";
  const isSignMode = mode === "sign";

  const getCursorStyle = () => {
    if (isDraftMode) return "cursor-move";
    if (isSignMode && !signatureValue) return "cursor-pointer hover:shadow-md hover:ring-2";
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
        if (isSignMode && onSignClick && !signatureValue) {
          e.stopPropagation();
          onSignClick(field);
        }
      }}
      className={`absolute rounded-md z-20 group transition-color ${getCursorStyle()}`}
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
        <img 
          src={signatureValue} 
          alt="Signature" 
          className="w-full h-full object-contain p-1"
          draggable={false}
        />
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
            
            {isSignMode && !signatureValue && (
              <span className="text-blue-600 font-semibold animate-pulse mr-1">
                Click to sign
              </span>
            )}
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