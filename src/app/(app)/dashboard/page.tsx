"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  UploadCloud,
  Loader2,
  FileText,
  ChevronRight,
  Crown,
  Download,
  Layers,
  FileEdit,
  Clock,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import {
  getDocumentLogApi,
  getRecentDocumentListApi,
  uploadDocumentApi,
} from "@/lib/api/DocumentApi";
import { toast } from "sonner";

import { useAuthStore } from "@/src/store/AuthStore";
import { StatusBadge } from "@/src/lib/BadgeHelper";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import DocumentProgressModal from "@/src/modules/document/components/modals/DocumentProgressModal";

interface RecentDocument {
  id: string;
  documentName: string;
  status: string;
  signedCount: number;
  totalSigners: number;
  isOwner: boolean;
}

export default function DashboardHome() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [documents, setDocuments] = useState<RecentDocument[]>([]);
  const [documentsLoading, setDocumentsLoading] = useState(true);

  const [page, setPage] = useState(0);
  const [size, setSize] = useState(5);
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [progressModalId, setProgressModalId] = useState<string | null>(null);

  const { user } = useAuthStore();

  const handleStatusChange = (value: string) => {
    setStatusFilter(value);
    setPage(0);
  };

  useEffect(() => {
    const fetchDocuments = async () => {
      setDocumentsLoading(true);
      try {
        const res = await getRecentDocumentListApi({
          page,
          size,
          status: statusFilter === "ALL" ? undefined : statusFilter,
        });
        setDocuments(res.content);
        setTotalPages(res.totalPages || 1);
        setTotalElements(res.totalElements || 0);
      } catch (err) {
        console.error("Failed to fetch documents", err);
      } finally {
        setDocumentsLoading(false);
      }
    };

    fetchDocuments();
  }, [page, size, statusFilter]);

  const handleDownloadAuditLog = async (
    documentId: string,
    documentName: string,
  ) => {
    try {
      const { url } = await getDocumentLogApi(documentId);
      const link = document.createElement("a");
      link.href = url;

      const safeName = documentName.replace(/\s+/g, "-").toLowerCase();
      link.download = `${safeName}-audit-log.pdf`;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Failed to download audit log:", error);
    }
  };

  const handleFileProcess = async (file: File) => {
    if (file.type !== "application/pdf") {
      alert("Only PDF documents are allowed.");
      return;
    }

    try {
      setLoading(true);
      const res = await uploadDocumentApi(file);
      router.push(`/document/${res}`);
    } catch (err: any) {
      toast(
        "File size exceeds 10 MB. Please upload a file smaller than 10 MB.",
        {
          position: "top-right",
        },
      );
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileProcess(file);
  };

  const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFileProcess(file);
  };

  return (
    <div className="space-y-6 max-w-6xl">
      <header className="pb-6 border-b border-slate-200 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            Welcome Back, {user?.name} 👋
          </h1>
          <p className="text-slate-500 mt-1.5 text-lg font-medium">
            Let's start signing. Track your pending requests or send a new
            document securely.
          </p>
        </div>
      </header>

      <section>
        <div className="mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <h2 className="text-md font-semibold text-slate-900 tracking-tight">
            Create a New Signing Request
          </h2>

          <div className="flex items-center gap-2 text-sm font-medium text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200/60 w-fit">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse"></span>
            Step 1: Upload PDF
          </div>
        </div>

        <div
          onClick={() => !loading && inputRef.current?.click()}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
          className={`
          relative flex flex-col items-center justify-center w-full p-12 
          border-2 border-dashed rounded-2xl transition-all duration-300 ease-out bg-white
          ${loading ? "bg-slate-50 border-slate-200 cursor-not-allowed" : "cursor-pointer shadow-sm hover:shadow-md"}
          ${
            isDragging
              ? "border-indigo-500 bg-indigo-50/50 scale-[1.01]"
              : "border-slate-300 hover:border-indigo-400 hover:bg-slate-50/50"
          }
        `}
        >
          {loading ? (
            <div className="flex flex-col items-center text-indigo-600">
              <Loader2 size={44} className="animate-spin mb-4" />
              <p className="text-sm font-semibold text-slate-700">
                Initializing Workspace...
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center text-slate-500">
              <div
                className={`w-16 h-16 rounded-full flex items-center justify-center mb-5 transition-colors duration-300 shadow-sm ${
                  isDragging
                    ? "bg-indigo-100 text-indigo-600"
                    : "bg-white text-slate-600 border border-slate-200"
                }`}
              >
                <UploadCloud size={30} strokeWidth={1.5} />
              </div>
              <p className="text-base font-medium text-slate-800 mb-1.5">
                <span className="text-indigo-600 hover:text-indigo-700 hover:underline cursor-pointer font-semibold">
                  Click to browse
                </span>{" "}
                or drag and drop here
              </p>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded uppercase tracking-widest ring-1 ring-inset ring-slate-200">
                  PDF Only
                </span>
                <span className="text-xs text-slate-400 font-medium">
                  Max 10MB
                </span>
              </div>
            </div>
          )}
        </div>

        <input
          ref={inputRef}
          type="file"
          accept="application/pdf"
          className="hidden"
          onChange={handleFileChange}
          disabled={loading}
        />
      </section>

      <section>
        <div className="mb-4 flex items-center justify-between gap-4">
          <h2 className="text-xs font-bold uppercase tracking-widest text-slate-500">
            Recent Documents
          </h2>

          <Select value={statusFilter} onValueChange={handleStatusChange}>
            <SelectTrigger className="w-44 h-9 text-sm font-medium border-slate-200 text-slate-600 bg-white hover:bg-slate-50 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-colors shadow-sm">
              <SelectValue placeholder="Filter status" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="ALL">
                <div className="flex items-center gap-2">
                  <Layers size={14} className="text-slate-500" />
                  <span>All Status</span>
                </div>
              </SelectItem>

              <SelectItem value="DRAFT">
                <div className="flex items-center gap-2">
                  <FileEdit size={14} className="text-slate-400" />
                  <span>Draft</span>
                </div>
              </SelectItem>

              <SelectItem value="PENDING">
                <div className="flex items-center gap-2">
                  <Clock size={14} className="text-amber-500" />
                  <span>Pending</span>
                </div>
              </SelectItem>

              <SelectItem value="FINALIZED">
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-emerald-500" />
                  <span>Finalized</span>
                </div>
              </SelectItem>

              <SelectItem value="REVOKED">
                <div className="flex items-center gap-2">
                  <XCircle size={14} className="text-rose-500" />
                  <span>Revoked</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-col gap-4">
          {documentsLoading ? (
            <div className="py-12 flex flex-col items-center justify-center">
              <Loader2 size={24} className="animate-spin text-slate-400 mb-2" />
              <span className="text-sm text-slate-500 font-medium">
                Loading documents...
              </span>
            </div>
          ) : documents.length === 0 ? (
            <div className="bg-white rounded-xl border border-slate-200 p-10 flex flex-col items-center justify-center shadow-sm">
              <div className="w-14 h-14 bg-slate-50 rounded-full flex items-center justify-center mb-4 border border-slate-100 shadow-inner">
                <FileText
                  size={24}
                  className="text-slate-400"
                  strokeWidth={1.5}
                />
              </div>
              <p className="text-sm font-semibold text-slate-800">
                {statusFilter === "DRAFT" && "No drafts found"}
                {statusFilter === "PENDING" && "No pending documents"}
                {statusFilter === "FINALIZED" && "No finalized documents"}
                {statusFilter === "REVOKED" && "No revoked documents"}
                {statusFilter === "ALL" && "No recent documents"}
              </p>
              <p className="text-sm text-slate-500 mt-1 text-center max-w-xs">
                {statusFilter === "DRAFT" &&
                  "You don't have any unfinished signing requests."}
                {statusFilter === "PENDING" &&
                  "You don't have any documents waiting for signatures."}
                {statusFilter === "FINALIZED" &&
                  "None of your documents have been fully signed yet."}
                {statusFilter === "REVOKED" &&
                  "You don't have any cancelled or revoked documents."}
                {statusFilter === "ALL" &&
                  "Upload a PDF above to create your first signing request."}
              </p>
            </div>
          ) : (
            <>
              <div className="space-y-3">
                {documents.map((doc) => (
                  <div
                    key={doc.id}
                    onClick={() => router.push(`/document/${doc.id}`)}
                    className="w-full flex items-center justify-between gap-4 p-4 rounded-xl text-left transition-all duration-200 bg-white border border-indigo-300 shadow-sm hover:border-indigo-500 hover:shadow-md hover:-translate-y-0.5 group cursor-pointer"
                  >
                    <div className="flex items-center gap-4 min-w-0">
                      <div className="w-12 h-12 rounded-lg bg-indigo-50/50 border border-indigo-100/50 flex items-center justify-center shrink-0 group-hover:bg-indigo-50 transition-colors">
                        <FileText
                          size={20}
                          className="text-indigo-600"
                          strokeWidth={1.5}
                        />
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <p className="text-sm font-semibold text-slate-800 truncate">
                            {doc.documentName}
                          </p>
                          {doc.isOwner && (
                            <div
                              title="You are the owner"
                              className="flex items-center text-amber-500 shrink-0 bg-amber-50 p-1 rounded-md"
                            >
                              <Crown size={14} strokeWidth={2} />
                            </div>
                          )}
                        </div>

                        <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                          <span>
                            {doc.signedCount} of {doc.totalSigners} signed
                          </span>
                          <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <StatusBadge status={doc.status} />

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setProgressModalId(doc.id);
                        }}
                        className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium text-indigo-600 bg-indigo-50 border border-indigo-100 hover:bg-indigo-100 hover:text-indigo-700 transition-colors focus:outline-none"
                      >
                        <Clock size={14} strokeWidth={2} />
                        <span>Track</span>
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDownloadAuditLog(doc.id, doc.documentName);
                        }}
                        className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium text-slate-600 bg-slate-50 border border-slate-200 hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-200 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                      >
                        <Download size={14} strokeWidth={2} />
                        <span>Audit Log</span>
                      </button>

                      <ChevronRight
                        size={18}
                        className="text-slate-300 group-hover:text-indigo-500 transition-colors ml-1"
                        strokeWidth={2}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {totalPages > 1 && (
                <div className="flex items-center justify-between border-t border-slate-100 pt-4 mt-2">
                  <div className="text-xs text-slate-500">
                    Showing{" "}
                    <span className="font-medium text-slate-700">
                      {page * size + 1}
                    </span>{" "}
                    to{" "}
                    <span className="font-medium text-slate-700">
                      {Math.min((page + 1) * size, totalElements)}
                    </span>{" "}
                    of{" "}
                    <span className="font-medium text-slate-700">
                      {totalElements}
                    </span>{" "}
                    results
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setPage((p) => Math.max(0, p - 1))}
                      disabled={page === 0}
                      className="px-3 py-1.5 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-md hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Previous
                    </button>

                    <div className="text-sm font-medium text-slate-700 px-2">
                      Page {page + 1} of {totalPages}
                    </div>

                    <button
                      onClick={() =>
                        setPage((p) => Math.min(totalPages - 1, p + 1))
                      }
                      disabled={page >= totalPages - 1}
                      className="px-3 py-1.5 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-md hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </section>
      <DocumentProgressModal
        documentId={progressModalId}
        isOpen={progressModalId !== null}
        onClose={() => setProgressModalId(null)}
      />
    </div>
  );
}
