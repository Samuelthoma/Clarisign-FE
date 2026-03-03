"use client";

import { DraftField, Signer } from "../../types";
import { ImageUpscale, PenLine } from "lucide-react";

interface FieldBoxProps {
  field: DraftField;
  signer?: Signer;
  scale: number;

  onStartMove: (e: React.MouseEvent<HTMLDivElement>, field: DraftField) => void;

  onStartResize: (
    e: React.MouseEvent<HTMLDivElement>,
    field: DraftField,
  ) => void;

  onRemove: (id: string) => void;
}

export default function FieldBox({
  field,
  signer,
  scale,
  onStartMove,
  onStartResize,
  onRemove,
}: FieldBoxProps) {
  const borderColor = signer?.color ?? "#2563eb";

  return (
    <div
      onMouseDown={(e) => onStartMove(e, field)}
      className="absolute rounded-md z-20 group transition cursor-move"
      style={{
        left: field.x * scale,
        top: field.y * scale,
        width: field.width * scale,
        height: field.height * scale,
        border: `2px solid ${borderColor}`,
        backgroundColor: `${borderColor}20`,
      }}
    >
      <div
        onMouseDown={(e) => {
          e.stopPropagation();
          onStartResize(e, field);
        }}
        className="absolute bottom-1 right-1 w-4 h-4 flex items-center justify-center text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity cursor-se-resize"
      >
        <ImageUpscale size={14} />
      </div>

      <button
        onClick={(e) => {
          e.stopPropagation();
          onRemove(field.id);
        }}
        className="absolute -top-2 -right-2 w-5 h-5 flex items-center justify-center rounded-full bg-white text-gray-500 border border-gray-200 shadow-sm opacity-0 group-hover:opacity-100 transition-all hover:bg-red-50 hover:text-red-600"
      >
        ×
      </button>

      <div className="flex flex-col justify-between h-full p-2">
        <div className="flex items-center gap-2 text-[10px] font-medium min-w-0">
          <div
            className="w-4 h-4 rounded-full flex items-center justify-center text-[8px] text-white shrink-0"
            style={{ backgroundColor: signer?.color }}
          >
            {signer?.name?.charAt(0).toUpperCase()}
          </div>

          <span className="truncate">{signer?.name}</span>
        </div>

        <div className="flex items-center gap-1 text-gray-500 text-[11px]">
          <PenLine size={10} />
          <span className="truncate">Signature</span>
        </div>
      </div>
    </div>
  );
}
