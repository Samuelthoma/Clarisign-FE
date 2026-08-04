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

  const signersWithFields = signers
    .filter((s) => (fieldCounts.get(s.id) || 0) > 0)
    .sort((a, b) => a.order - b.order);

  const owner = signersWithFields.find((s) => s.isOwner);
  const reorderable = signersWithFields.filter((s) => !s.isOwner);

  if (reorderable.length === 0 && !owner) return null;

  const displayList = owner ? [owner, ...reorderable] : reorderable;

  const handleMove = (reorderableIndex: number, direction: -1 | 1) => {
    const targetIndex = reorderableIndex + direction;
    if (targetIndex < 0 || targetIndex >= reorderable.length) return;

    const swapped = [...reorderable];
    [swapped[reorderableIndex], swapped[targetIndex]] = [
      swapped[targetIndex],
      swapped[reorderableIndex],
    ];

    const signersWithoutFields = signers.filter(
      (s) => !s.isOwner && !reorderable.some((r) => r.id === s.id),
    );

    const orderedArray = [
      ...(owner ? [owner] : []),
      ...swapped,
      ...signersWithoutFields,
    ];

    onReorder(orderedArray);
  };

  return (
    <div className="space-y-3">
      <h3 className="text-xs uppercase tracking-wider text-gray-600">
        Signing Order
      </h3>

      <div className="space-y-1">
        {displayList.map((signer, displayIndex) => {
          const count = fieldCounts.get(signer.id) || 0;
          const isOwner = signer.isOwner === true;
          const reorderableIndex = isOwner ? -1 : displayIndex - (owner ? 1 : 0);
          const isFirst = reorderableIndex <= 0;
          const isLast = reorderableIndex >= reorderable.length - 1;

          return (
            <div
              key={signer.id}
              className="flex items-center justify-between gap-2 p-2 rounded-md border border-gray-200 bg-white"
            >
              <div className="flex items-center gap-2 min-w-0">
                <span className="text-[11px] text-gray-400 w-4 text-center shrink-0">
                  {signer.order}
                </span>
                <div
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: signer.color }}
                />
                <span className="text-sm font-medium truncate">
                  {signer.name}
                </span>
                {isOwner && (
                  <Crown
                    size={12}
                    className="text-yellow-500 fill-yellow-400 shrink-0"
                  />
                )}
                <span className="text-[11px] text-gray-400 shrink-0">
                  {count} field{count !== 1 ? "s" : ""}
                </span>
              </div>

              {canEdit && !isOwner && (
                <div className="flex items-center gap-0.5 shrink-0">
                  <button
                    onClick={() => handleMove(reorderableIndex, -1)}
                    disabled={isFirst}
                    className="p-0.5 rounded hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition"
                    title="Move up"
                  >
                    <ChevronUp size={14} className="text-gray-500" />
                  </button>
                  <button
                    onClick={() => handleMove(reorderableIndex, 1)}
                    disabled={isLast}
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
