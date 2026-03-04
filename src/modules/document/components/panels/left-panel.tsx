import { Signature, Type } from "lucide-react";
import { FieldType, SignatureMode } from "../../types";

interface LeftPanelProps {
  activeTool: {
    type: FieldType;
    mode: SignatureMode;
  } | null;

  setActiveTool: (
    tool: {
      type: FieldType;
      mode: SignatureMode;
    } | null,
  ) => void;
}

export default function LeftPanel({
  activeTool,
  setActiveTool,
}: LeftPanelProps) {
  const handleDragStart = (
    e: React.DragEvent<HTMLButtonElement>,
    mode: SignatureMode,
  ) => {
    setActiveTool(null);
    e.dataTransfer.setData("signature-mode", mode);
    e.dataTransfer.effectAllowed = "copy";
  };

  const handleClick = (mode: SignatureMode) => {
    const isActive =
      activeTool?.type === "SIGNATURE" && activeTool?.mode === mode;

    if (isActive) {
      setActiveTool(null);
    } else {
      setActiveTool({
        type: "SIGNATURE",
        mode,
      });
    }
  };

  const isActive = (mode: SignatureMode) =>
    activeTool?.type === "SIGNATURE" && activeTool?.mode === mode;

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xs uppercase tracking-wider text-gray-600 mb-3">
          Signature
        </h3>

        <div className="space-y-2">
          <button
            draggable
            onClick={() => handleClick("DRAW")}
            onDragStart={(e) => handleDragStart(e, "DRAW")}
            className={`w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-all duration-150 border
            ${
              isActive("DRAW")
                ? "border-black bg-gray-100 ring-1 ring-black/10"
                : "border-gray-300 hover:bg-gray-100 text-gray-700"
            }
          `}
          >
            <Signature size={16} />
            Draw Signature
          </button>

          <button
            draggable
            onClick={() => handleClick("TYPE")}
            onDragStart={(e) => handleDragStart(e, "TYPE")}
            className={`w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-all duration-150 border
            ${
              isActive("TYPE")
                ? "border-black bg-gray-100 ring-1 ring-black/10"
                : "border-gray-300 hover:bg-gray-100 text-gray-700"
            }
          `}
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
