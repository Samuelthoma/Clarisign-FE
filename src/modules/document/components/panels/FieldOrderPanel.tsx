"use client";

import { DraftField, Signer } from "../../types";
import { ChevronUp, ChevronDown, Crown } from "lucide-react";

interface FieldOrderPanelProps {
  fields: DraftField[];
  signers: Signer[];
  onReorder: (newOrder: Signer[]) => void;
  canEdit: boolean;
}

export default function FieldOrderPanel({
  fields,
  signers,
  onReorder,
  canEdit,
}: FieldOrderPanelProps) {
  const fieldCounts = new Map<string, number>();
  for (const f of fields) {
    if (f.signerId) {
      fieldCounts.set(f.signerId, (fieldCounts.get(f.signerId) || 0) + 1);
    }
  }

  const holders = signers
    .filter((s) => (fieldCounts.get(s.id) || 0) > 0)
    .sort((a, b) => a.order - b.order);

  if (holders.length === 0) return null;

  const handleMove = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= holders.length) return;

    const swapped = [...holders];
    [swapped[index], swapped[target]] = [swapped[target], swapped[index]];

    const others = signers.filter(
      (s) => !holders.some((h) => h.id === s.id),
    );

    onReorder([...swapped, ...others]);
  };

  return (
    <div className="space-y-3">
      <h3 className="text-xs uppercase tracking-wider text-gray-600">
        Signing Order
      </h3>

      <div className="space-y-1">
        {holders.map((signer, index) => {
          const count = fieldCounts.get(signer.id) || 0;

          return (
            <div
              key={signer.id}
              className="flex items-center justify-between gap-2 p-2 rounded-md border border-gray-200 bg-white"
            >
              <div className="flex items-center gap-2 min-w-0">
                <span className="text-[11px] text-gray-400 w-4 text-center shrink-0">
                  {index + 1}
                </span>
                <div
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: signer.color }}
                />
                <span className="text-sm font-medium truncate">
                  {signer.name}
                </span>
                {signer.isOwner && (
                  <Crown
                    size={12}
                    className="text-yellow-500 fill-yellow-400 shrink-0"
                  />
                )}
                <span className="text-[11px] text-gray-400 shrink-0">
                  {count} field{count !== 1 ? "s" : ""}
                </span>
              </div>

              {canEdit && (
                <div className="flex items-center gap-0.5 shrink-0">
                  <button
                    onClick={() => handleMove(index, -1)}
                    disabled={index === 0}
                    className="p-0.5 rounded hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition"
                    title="Move up"
                  >
                    <ChevronUp size={14} className="text-gray-500" />
                  </button>
                  <button
                    onClick={() => handleMove(index, 1)}
                    disabled={index === holders.length - 1}
                    className="p-0.5 rounded hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition"
                    title="Move down"
                  >
                    <ChevronDown size={14} className="text-gray-500" />
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
