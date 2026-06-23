import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Check, Clock, Loader2, AlertCircle, FileText } from "lucide-react";
import {
  DocumentProgressResponse,
  getDocumentProgressApi,
} from "@/lib/api/DocumentApi";

interface Props {
  documentId: string | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function DocumentProgressModal({
  documentId,
  isOpen,
  onClose,
}: Props) {
  const [data, setData] = useState<DocumentProgressResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen && documentId) {
      const fetchProgress = async () => {
        setIsLoading(true);
        try {
          const res = await getDocumentProgressApi(documentId);
          setData(res);
        } catch (error) {
          console.error("Failed to load progress:", error);
        } finally {
          setIsLoading(false);
        }
      };
      fetchProgress();
    } else {
      setData(null);
    }
  }, [isOpen, documentId]);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[450px] p-0 overflow-hidden bg-white border-slate-200">
        <DialogDescription className="sr-only">
          Track the signature progress of the selected document.
        </DialogDescription>

        <DialogHeader className="p-6 pb-4 border-b border-slate-100 bg-slate-50/50">
          <DialogTitle className="flex flex-col gap-1.5 text-left">
            <span className="text-xs font-bold uppercase tracking-widest text-slate-500">
              Document Progress
            </span>
            <span className="text-lg text-slate-800 flex items-center gap-2 truncate">
              <FileText size={18} className="text-indigo-500 shrink-0" />
              {data?.documentName || "Loading..."}
            </span>
          </DialogTitle>
        </DialogHeader>

        <div className="p-6">
          {isLoading || !data ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 size={32} className="animate-spin text-slate-300 mb-3" />
              <p className="text-sm text-slate-500">Fetching timeline...</p>
            </div>
          ) : (
            <div className="space-y-6">
              {data.you.signer && (
                <div
                  className={`flex items-start gap-3 p-3.5 rounded-xl border ${
                    data.you.yourTurn
                      ? "bg-indigo-50 border-indigo-200 text-indigo-800"
                      : data.you.status === "SIGNED"
                        ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                        : "bg-amber-50 border-amber-200 text-amber-800"
                  }`}
                >
                  <div className="mt-0.5 shrink-0">
                    {data.you.yourTurn ? (
                      <AlertCircle size={18} className="text-indigo-600" />
                    ) : data.you.status === "SIGNED" ? (
                      <Check size={18} className="text-emerald-600" />
                    ) : (
                      <Clock size={18} className="text-amber-600" />
                    )}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold">
                      {data.you.yourTurn
                        ? "It's your turn to sign!"
                        : data.you.status === "SIGNED"
                          ? "You have already signed this document."
                          : "Waiting for others to sign before your turn."}
                    </span>
                    <span className="text-xs opacity-80 mt-0.5">
                      You are assigned as Signer #{data.you.order}
                    </span>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between px-2 text-sm">
                <span className="text-slate-500 font-medium">
                  Tracking Status
                </span>
                <span className="font-semibold text-slate-700">
                  {data.signedCount} of {data.totalSigners} Completed
                </span>
              </div>

              <div className="pl-4 pt-2">
                <div className="relative border-l-2 border-slate-100 space-y-6 pb-2">
                  {data.steps.map((step, index) => {
                    const isCompleted = step.status === "SIGNED";
                    const isCurrent = data.currentOrder === step.order;

                    return (
                      <div key={step.order} className="relative pl-6">
                        <div
                          className={`absolute -left-[13px] top-0.5 flex items-center justify-center w-6 h-6 rounded-full border-2 bg-white ${
                            isCompleted
                              ? "border-emerald-500 bg-emerald-500 text-white"
                              : isCurrent
                                ? "border-indigo-500 ring-4 ring-indigo-50"
                                : "border-slate-200"
                          }`}
                        >
                          {isCompleted ? (
                            <Check size={12} strokeWidth={3} />
                          ) : isCurrent ? (
                            <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
                          ) : null}
                        </div>

                        {/* Step Details */}
                        <div className="flex flex-col">
                          <span
                            className={`text-sm font-semibold ${
                              isCompleted || isCurrent
                                ? "text-slate-800"
                                : "text-slate-400"
                            }`}
                          >
                            Signer {step.order}
                            {data.you.order === step.order && " (You)"}
                          </span>
                          <span
                            className={`text-xs mt-0.5 ${
                              isCurrent
                                ? "text-indigo-600 font-medium"
                                : "text-slate-500"
                            }`}
                          >
                            {step.email}
                          </span>

                          <span
                            className={`text-[10px] font-bold uppercase tracking-wider mt-1.5 w-fit px-1.5 py-0.5 rounded-sm ${
                              isCompleted
                                ? "bg-emerald-100 text-emerald-700"
                                : isCurrent
                                  ? "bg-indigo-100 text-indigo-700"
                                  : "bg-slate-100 text-slate-500"
                            }`}
                          >
                            {isCompleted
                              ? "Completed"
                              : isCurrent
                                ? "In Progress"
                                : "Pending"}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
