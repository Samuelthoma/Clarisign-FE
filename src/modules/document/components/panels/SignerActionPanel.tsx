"use client";

import {
  CheckCircle2,
  Circle,
  PenLine,
  XCircle,
  Check,
  Loader2,
  Send,
} from "lucide-react";
import { DraftField } from "../../types";
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

interface SignerActionPanelProps {
  fields: DraftField[];
  currentSignerId: string;
  signatures: Record<string, string>;

  onNavigateToField: (field: DraftField) => void;
  onComplete: () => void;
  onReject: () => void;
  isOwner?: boolean;
  onFinalize?: () => void;
  isFinalizing?: boolean;
  isSubmitting?: boolean;
  isRejectting?: boolean;
  isMyTurn?: boolean;
  currentSignerEmail?: string | null;
}

export default function SignerActionPanel({
  fields,
  currentSignerId,
  signatures,
  onNavigateToField,
  onComplete,
  onReject,
  onFinalize,
  isOwner = false,
  isSubmitting = false,
  isRejectting = false,
  isFinalizing = false,
  isMyTurn = true,
  currentSignerEmail = null,
}: SignerActionPanelProps) {
  const assignedFields = fields.filter(
    (field) => field.signerId === currentSignerId,
  );

  const totalCount = assignedFields.length;
  const completedCount = assignedFields.filter(
    (f) => f.status === "ACTIVE" || !!signatures[f.id],
  ).length;

  const isAllCompletedLocally = totalCount > 0 && completedCount === totalCount;
  const isProcessing = isSubmitting || isRejectting;

  const hasPendingAssignedFields = assignedFields.some(
    (f) => f.status !== "ACTIVE",
  );
  const showSignRejectButtons = totalCount > 0 && hasPendingAssignedFields;
  const isDocumentFullyActive =
    fields.length > 0 && fields.every((f) => f.status === "ACTIVE");
  const showFinalizeButton = isOwner && isDocumentFullyActive;

  return (
    <div className="flex flex-col h-full space-y-6">
      <div className="flex-1 overflow-hidden flex flex-col">
        <div className="mb-4">
          <h3 className="text-[11px] font-bold uppercase tracking-widest text-slate-500 mb-1">
            Required Actions
          </h3>
          <p className="text-sm font-medium text-slate-600">
            {completedCount} of {totalCount} completed
          </p>
        </div>

        <div className="flex-1 overflow-y-auto space-y-2 pr-2 no-scrollbar">
          {assignedFields.length === 0 ? (
            <div className="text-sm text-slate-500 italic text-center py-8 bg-slate-50 rounded-xl border border-dashed border-slate-200">
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
                  className={`w-full flex items-center justify-between p-3.5 rounded-xl border text-left transition-all duration-200 group
                    ${
                      isCompleted
                        ? "bg-emerald-50/50 border-emerald-200 hover:bg-emerald-50"
                        : "bg-white border-slate-200 hover:border-indigo-400 hover:shadow-sm"
                    }
                  `}
                >
                  <div className="flex items-center gap-3">
                    {isCompleted ? (
                      <CheckCircle2 size={18} className="text-emerald-600" />
                    ) : (
                      <Circle
                        size={18}
                        className="text-slate-300 group-hover:text-indigo-500 transition-colors"
                      />
                    )}
                    <div>
                      <div
                        className={`text-sm font-semibold ${
                          isCompleted ? "text-emerald-800" : "text-slate-800"
                        }`}
                      >
                        Signature {index + 1}
                      </div>
                      <div className="text-xs font-medium text-slate-500 mt-0.5">
                        Page {field.page} ·{" "}
                        {field.mode === "TYPED" ? "Typed" : "Drawn"}
                      </div>
                    </div>
                  </div>
                  <PenLine
                    size={16}
                    className={
                      isCompleted
                        ? "text-emerald-600/50"
                        : "text-slate-300 group-hover:text-indigo-500 transition-colors"
                    }
                  />
                </button>
              );
            })
          )}
        </div>
      </div>

      <div className="pt-5 border-t border-slate-200 mt-auto space-y-3">
        {showSignRejectButtons && (
          <>
            {isMyTurn ? (
              <button
                onClick={onComplete}
                disabled={isProcessing || !isAllCompletedLocally}
                className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200
                  ${
                    isAllCompletedLocally && !isProcessing
                      ? "bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm hover:shadow"
                      : "bg-slate-100 text-slate-400 cursor-not-allowed"
                  }
                `}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Signing...
                  </>
                ) : (
                  <>
                    <Check size={16} strokeWidth={2.5} />
                    Sign Document
                  </>
                )}
              </button>
            ) : (
              <div className="w-full rounded-lg bg-amber-50 border border-amber-200 px-3 py-2.5 text-sm text-amber-800 text-center">
                It's not your turn yet
                {currentSignerEmail ? (
                  <>
                    {" "}
                    — waiting for{" "}
                    <span className="font-semibold">{currentSignerEmail}</span>
                  </>
                ) : null}
                .
              </div>
            )}

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <button
                  disabled={isProcessing || !isMyTurn}
                  title={
                    !isMyTurn
                      ? "You can only reject when it's your turn to sign"
                      : undefined
                  }
                  className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200
                    ${
                      isProcessing || !isMyTurn
                        ? "text-rose-400 bg-rose-50 cursor-not-allowed opacity-60"
                        : "text-rose-600 bg-rose-50 hover:bg-rose-100 hover:text-rose-700"
                    }
                  `}
                >
                  {isRejectting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Rejecting...
                    </>
                  ) : (
                    <>
                      <XCircle size={16} strokeWidth={2.5} />
                      Reject Document
                    </>
                  )}
                </button>
              </AlertDialogTrigger>

              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Reject document?</AlertDialogTitle>

                  <AlertDialogDescription>
                    This action cannot be undone. The document will be marked as
                    rejected and all participants will be notified.
                  </AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>

                  <AlertDialogAction
                    onClick={onReject}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    Reject Document
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </>
        )}

        {showFinalizeButton && (
          <button
            onClick={onFinalize}
            disabled={isFinalizing}
            className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200
              ${
                isFinalizing
                  ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                  : "bg-slate-900 text-white hover:bg-slate-800 shadow-sm hover:shadow"
              }
            `}
          >
            {isFinalizing ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Finalizing...
              </>
            ) : (
              <>
                <Send size={16} strokeWidth={2.5} />
                Finalize Document
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
