"use client";

import { Signature, Type } from "lucide-react";
import { FieldType, SignatureMode } from "../../types";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface DraftToolsPanelProps {
  activeTool: {
    type: FieldType;
    mode: SignatureMode;
  } | null;
  isPublishing: boolean;
  setActiveTool: (
    tool: {
      type: FieldType;
      mode: SignatureMode;
    } | null,
  ) => void;
  onSaveDraft: () => void;
  onPublishDraft: () => void;
  middleContent?: React.ReactNode;
}

export default function DraftToolsPanel({
  activeTool,
  setActiveTool,
  onSaveDraft,
  onPublishDraft,
  isPublishing,
  middleContent,
}: DraftToolsPanelProps) {
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
    <div className="space-y-6 flex flex-col h-full">
      <div className="flex-1">
        <h3 className="text-xs uppercase tracking-wider text-gray-600 mb-3">
          Signature
        </h3>

        <div className="space-y-2">
          <button
            draggable
            onClick={() => handleClick("DRAWN")}
            onDragStart={(e) => handleDragStart(e, "DRAWN")}
            className={`w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-all duration-150 border
            ${
              isActive("DRAWN")
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
            onClick={() => handleClick("TYPED")}
            onDragStart={(e) => handleDragStart(e, "TYPED")}
            className={`w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-all duration-150 border
            ${
              isActive("TYPED")
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

      {middleContent}

      <div className="pt-6 border-t border-gray-100 mt-auto">
        <button
          onClick={onSaveDraft}
          className="w-full py-2 rounded-md bg-white text-gray-800 text-sm font-medium border border-gray-400 hover:bg-gray-50 transition mb-4"
        >
          Save Draft
        </button>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <button
              disabled={isPublishing}
              className="w-full py-2 rounded-md bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 disabled:opacity-50"
            >
              Publish Document
            </button>
          </AlertDialogTrigger>

          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Publish this document?</AlertDialogTitle>
              <AlertDialogDescription>
                Once published, this document will enter signing mode and cannot
                be edited in draft state anymore.
              </AlertDialogDescription>
            </AlertDialogHeader>

            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>

              <AlertDialogAction
                onClick={onPublishDraft}
              >
                Yes, Publish
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
