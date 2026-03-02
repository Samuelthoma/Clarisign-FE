import { useState } from "react"
import { SignatureMode, Signer } from "../types"

interface Props {
  isOpen: boolean
  signers: Signer[]
  onClose: () => void
  onConfirm: (signerId: string) => void
}

export default function SignatureAssignmentModal({
  isOpen,
  signers,
  onClose,
  onConfirm,
}: Props) {
  const [selectedSignerId, setSelectedSignerId] = useState<string | null>("1")

  if (!isOpen) return null

  const canConfirm = selectedSignerId

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white w-[420px] rounded-lg shadow-lg p-6 space-y-6">

        <h2 className="text-lg font-semibold">Assign Signature Field</h2>

        <div>
          <p className="text-sm font-medium mb-2">Select Signer</p>
          <div className="space-y-2">
            {signers.map((signer) => (
              <button
                key={signer.id}
                onClick={() => setSelectedSignerId(signer.id)}
                className={`w-full text-left px-3 py-2 rounded-md border text-sm transition
                  ${
                    selectedSignerId === signer.id
                      ? "border-black bg-black text-white"
                      : "border-gray-300 hover:bg-gray-100"
                  }`}
              >
                {signer.name} • Step {signer.order}
              </button>
            ))}
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
              if (!selectedSignerId) return
              onConfirm(selectedSignerId)
            }}
            className="px-4 py-2 rounded-md bg-black text-white text-sm disabled:opacity-40"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  )
}