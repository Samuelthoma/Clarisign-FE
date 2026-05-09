"use client";

import { useState } from "react";
import { Signer } from "../../types";
import { Crown, Trash2 } from "lucide-react";
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

interface RightPanelProps {
  signers: Signer[];
  onAddSigner?: (email: string) => void;
  onRemoveSigner?: (id: string) => void;
  canEditSigners?: boolean;
}

export default function RightPanel({
  signers,
  onAddSigner,
  onRemoveSigner,
  canEditSigners = false,
}: RightPanelProps) {
  const [email, setEmail] = useState("");

  const handleAdd = () => {
    if (!email.trim()) return;

    onAddSigner?.(email);
    setEmail("");
  };

  return (
    <div className="flex flex-col h-full bg-white border-l">
      <div className="p-4 border-b">
        <h3 className="text-xs uppercase tracking-wider text-gray-600 mb-1">
          Signers
        </h3>
        <p className="text-[11px] text-gray-400">
          {signers.length} participant{signers.length > 1 ? "s" : ""}
        </p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {signers.map((signer) => {
          const isDocumentOwner = signer.isOwner === true;

          return (
            <div
              key={signer.id}
              className={`flex items-center justify-between p-3 border rounded-md transition hover:bg-gray-50 ${
                isDocumentOwner ? "bg-gray-50 border-gray-300" : ""
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className="w-3 h-3 rounded-full shrink-0"
                  style={{ backgroundColor: signer.color }}
                />

                <div className="min-w-0">
                  <div className="text-sm font-medium min-w-0 flex items-center gap-2">
                    <span className="truncate">
                      {signer.order}. {signer.name}
                    </span>

                    {isDocumentOwner && (
                      <Crown
                        size={14}
                        className="text-yellow-500 fill-yellow-400 shrink-0 flex-none"
                      />
                    )}
                  </div>

                  <div className="text-xs text-gray-500 truncate">
                    {signer.email}
                  </div>

                  {!isDocumentOwner && (
                    <div className="text-[10px] text-gray-400 mt-0.5">
                      {signer.status === "SIGNED" ? "Signed" : "Pending"}
                    </div>
                  )}
                </div>
              </div>

              {canEditSigners && !isDocumentOwner && onRemoveSigner && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <button
                      className="shrink-0 ml-2 flex items-center justify-center w-6 h-6 rounded-md text-red-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                      title="Remove collaborator"
                    >
                      <Trash2 size={14} className="shrink-0 flex-none ml-2" />
                    </button>
                  </AlertDialogTrigger>

                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Remove collaborator?</AlertDialogTitle>

                      <AlertDialogDescription>
                        {signer.name} will lose access to this document and all
                        assigned signature fields will be removed.
                      </AlertDialogDescription>
                    </AlertDialogHeader>

                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>

                      <AlertDialogAction
                        onClick={() => onRemoveSigner(signer.id)}
                      >
                        Remove
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
            </div>
          );
        })}

        {signers.length <= 1 && canEditSigners && (
          <div className="text-xs text-gray-400 text-center py-4">
            Add collaborators to assign signatures
          </div>
        )}
      </div>

      {canEditSigners && onAddSigner && (
        <div className="p-4 border-t bg-gray-50 space-y-2">
          <p className="text-xs text-gray-700">Add signer</p>

          <input
            type="email"
            placeholder="Enter signer email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleAdd();
            }}
            className="w-full border border-gray-400 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-black"
          />

          <button
            onClick={handleAdd}
            disabled={!email.trim()}
            className="w-full bg-black text-white py-2 rounded-md text-sm hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Add Signer
          </button>
        </div>
      )}
    </div>
  );
}
