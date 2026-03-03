import { Signature, Type } from "lucide-react";
import { FieldType, SignatureMode } from "../../types";

interface LeftPanelProps {
  activeTool: FieldType | null;
  setActiveTool: (tool: FieldType | null) => void;
}

export default function LeftPanel({
  activeTool,
  setActiveTool,
}: LeftPanelProps) {
  const handleDragStart = (
    e: React.DragEvent<HTMLButtonElement>,
    mode: SignatureMode,
  ) => {
    e.dataTransfer.setData("signature-mode", mode);
    e.dataTransfer.effectAllowed = "copy";
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xs uppercase tracking-wider text-gray-600 mb-3">
          Signature
        </h3>

        <div className="space-y-2">
          <button
            draggable
            onDragStart={(e) => handleDragStart(e, "DRAW")}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-md border text-sm transition border-gray-300 hover:bg-gray-100 text-gray-700"
          >
            <Signature size={16} />
            Draw Signature
          </button>

          <button
            draggable
            onDragStart={(e) => handleDragStart(e, "TYPE")}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-md border text-sm transition border-gray-300 hover:bg-gray-100 text-gray-700"
          >
            <Type size={16} />
            Type Signature
          </button>
        </div>
      </div>

      <div className="pt-6 border-t border-gray-100">
        <button className="w-full py-2 rounded-md bg-black text-white text-sm font-medium hover:opacity-90 transition">
          Save Draft
        </button>
      </div>
    </div>
  );
}
