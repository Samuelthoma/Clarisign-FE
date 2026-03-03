import { Signer } from "../../types";

interface RightPanelProps {
  signers: Signer[];
  onAddSigner: (name: string, email: string) => void;
  onRemoveSigner: (id: string) => void;
}

export default function RightPanel({
  signers,
  onAddSigner,
  onRemoveSigner,
}: RightPanelProps) {
  return (
    <div className="flex flex-col h-full bg-white border-l">
      <div className="p-4 border-b">
        <h3 className="text-xs uppercase tracking-wider text-gray-600 mb-3">Signers</h3>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {signers.map((signer) => (
          <div
            key={signer.id}
            className="flex items-center justify-between p-3 border rounded-md"
          >
            <div className="flex items-center gap-3">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: signer.color }}
              />
              <div>
                <div className="text-sm font-medium">
                  {signer.order}. {signer.name}
                </div>
                <div className="text-xs text-gray-500">{signer.email}</div>
              </div>
            </div>

            <button
              onClick={() => onRemoveSigner(signer.id)}
              className="text-xs text-red-500 hover:underline"
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      <div className="p-4 border-t">
        <button
          onClick={() =>
            onAddSigner(
              `Signer ${signers.length + 1}`,
              `signer${signers.length + 1}@mail.com`,
            )
          }
          className="w-full bg-black text-white py-2 rounded-md text-sm"
        >
          Add Signer
        </button>
      </div>
    </div>
  );
}
