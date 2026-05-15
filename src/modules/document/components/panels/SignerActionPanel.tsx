"use client";

import { CheckCircle2, Circle, PenLine, XCircle, Check } from "lucide-react";
import { DraftField } from "../../types";

interface SignerActionPanelProps {
  fields: DraftField[];
  currentSignerId: string;
  signatures: Record<string, string>;

  onNavigateToField: (field: DraftField) => void;
  onComplete: () => void;
  onReject: () => void;
  isSubmitting?: boolean;
}

export default function SignerActionPanel({
  fields,
  currentSignerId,
  signatures,
  onNavigateToField,
  onComplete,
  onReject,
  isSubmitting = false,
}: SignerActionPanelProps) {
  const assignedFields = fields.filter(
    (field) => field.signerId === currentSignerId,
  );

  const completedCount = assignedFields.filter(
    (f) => f.status === "ACTIVE" || !!signatures[f.id],
  ).length;
  const totalCount = assignedFields.length;
  const isAllCompleted = totalCount > 0 && completedCount === totalCount;

  return (
    <div className="flex flex-col h-full space-y-6">
      <div className="flex-1 overflow-hidden flex flex-col">
        <div className="mb-4">
          <h3 className="text-xs uppercase tracking-wider text-gray-600 mb-1">
            Required Actions
          </h3>
          <p className="text-sm text-gray-500">
            {completedCount} of {totalCount} completed
          </p>
        </div>

        {/* Action List */}
        <div className="flex-1 overflow-y-auto space-y-2 pr-2 no-scrollbar">
          {assignedFields.length === 0 ? (
            <div className="text-sm text-gray-500 italic text-center py-4">
              No fields assigned to you.
            </div>
          ) : (
            assignedFields.map((field, index) => {
              const isCompleted =
                field.status === "ACTIVE" || !!signatures[field.id];

              return (
                <button
                  key={field.id}
                  onClick={() => onNavigateToField(field)}
                  className={`w-full flex items-center justify-between p-3 rounded-md border text-left transition-all duration-150 group
                    ${
                      isCompleted
                        ? "bg-green-50 border-green-200 hover:bg-green-100"
                        : "bg-white border-gray-200 hover:border-blue-400 hover:shadow-sm"
                    }
                  `}
                >
                  <div className="flex items-center gap-3">
                    {isCompleted ? (
                      <CheckCircle2 size={18} className="text-green-600" />
                    ) : (
                      <Circle
                        size={18}
                        className="text-gray-400 group-hover:text-blue-500"
                      />
                    )}
                    <div>
                      <div
                        className={`text-sm font-medium ${isCompleted ? "text-green-800" : "text-gray-700"}`}
                      >
                        Signature {index + 1}
                      </div>
                      <div className="text-xs text-gray-500">
                        Page {field.page}
                      </div>
                    </div>
                  </div>
                  <PenLine
                    size={16}
                    className={
                      isCompleted
                        ? "text-green-600/50"
                        : "text-gray-400 group-hover:text-blue-500"
                    }
                  />
                </button>
              );
            })
          )}
        </div>
      </div>

      <div className="pt-4 border-t border-gray-100 mt-auto space-y-3">
        <button
          onClick={onComplete}
          disabled={isSubmitting}
          className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-md text-sm font-medium transition
            ${
              isAllCompleted
                ? "bg-black text-white hover:opacity-90"
                : "bg-gray-100 text-gray-400 cursor-not-allowed"
            }
          `}
        >
          <Check size={16} />
          Sign Document
        </button>

        <button
          onClick={onReject}
          disabled={isSubmitting}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-md text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 transition"
        >
          <XCircle size={16} />
          Reject Document
        </button>
      </div>
    </div>
  );
}
