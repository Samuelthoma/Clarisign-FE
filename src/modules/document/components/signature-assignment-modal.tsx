import { useState } from "react";
import { SignatureMode, Signer } from "../types";

interface Props {
  isOpen: boolean;
  signers: Signer[];
  onClose: () => void;
  onConfirm: (signerId: string) => void;
}

export default function SignatureAssignmentModal({
  isOpen,
  signers,
  onClose,
  onConfirm,
}: Props) {
  const [selectedSignerId, setSelectedSignerId] = useState<string | null>();

  if (!isOpen) return null;

  const canConfirm = selectedSignerId;

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white w-[420px] rounded-lg shadow-lg p-6 space-y-6">
        <h2 className="text-lg font-semibold">Assign Signature Field</h2>

        <div>
          <p className="text-sm font-medium mb-2">Select Signer</p>
          <div className="max-h-64 overflow-y-auto space-y-2 pr-1">
            {signers.map((signer) => {
              const isSelected = selectedSignerId === signer.id;

              return (
                <button
                  type="button"
                  key={signer.id}
                  onClick={() => setSelectedSignerId(signer.id)}
                  className={`w-full flex items-center gap-3 p-3 border rounded-md transition text-left
                    ${isSelected ? "border-black bg-gray-50" : "border-gray-200 hover:bg-gray-100"}`}
                >
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: signer.color }}
                  />

                  <div className="min-w-0">
                    <div className="text-sm font-medium truncate">
                      {signer.order}. {signer.name}
                    </div>
                    <div className="text-xs text-gray-500 truncate">
                      {signer.email}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-md border text-sm hover:bg-gray-100"
          >
            Cancel
          </button>

          <button
            disabled={!canConfirm}
            onClick={() => {
              if (!selectedSignerId) return;
              onConfirm(selectedSignerId);
            }}
            className="px-4 py-2 rounded-md bg-black text-white text-sm disabled:opacity-40"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}