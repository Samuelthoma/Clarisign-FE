import { Signature, Type } from "lucide-react";
import { FieldType } from "../../types";

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
    type: FieldType,
  ) => {
    e.dataTransfer.setData("field-type", type);
    e.dataTransfer.effectAllowed = "copy";
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xs uppercase tracking-wider text-gray-400 mb-3">
          Fields
        </h3>

        <div className="space-y-2">
          <button
            draggable
            onClick={() =>
              setActiveTool(activeTool === "SIGNATURE" ? null : "SIGNATURE")
            }
            onDragStart={(e) => {
              handleDragStart(e, "SIGNATURE");
            }}
            className={`w-full flex items-center gap-2 px-3 py-2 rounded-md border text-sm transition
              ${
                activeTool === "SIGNATURE"
                  ? "border-black bg-black text-white"
                  : "border-gray-300 hover:bg-gray-100 text-gray-700"
              }`}
          >
            <Signature size={16} />
            Signature Field
          </button>

          <button
            draggable
            onClick={() => setActiveTool(activeTool === "TEXT" ? null : "TEXT")}
            onDragStart={(e) => {
              handleDragStart(e, "TEXT");
            }}
            className={`w-full flex items-center gap-2 px-3 py-2 rounded-md border text-sm transition
              ${
                activeTool === "TEXT"
                  ? "border-black bg-black text-white"
                  : "border-gray-300 hover:bg-gray-100 text-gray-700"
              }`}
          >
            <Type size={16} />
            Text Field
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
