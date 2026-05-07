"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  UploadCloud,
  Loader2,
  FileText,
  ChevronRight,
  Crown,
} from "lucide-react";
import {
  getRecentDocumentListApi,
  uploadDocumentApi,
} from "@/lib/api/DocumentApi";
import { toast } from "sonner";

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

  const fetchDocuments = async () => {
    try {
      setDocumentsLoading(true);

      const data = await getRecentDocumentListApi();

      setDocuments(data);
    } catch (err) {
      console.error(err);
    } finally {
      setDocumentsLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const handleFileProcess = async (file: File) => {
    if (file.type !== "application/pdf") {
      alert("Only PDF documents are allowed.");
      return;
    }

    try {
      setLoading(true);
      const res = await uploadDocumentApi(file);
      router.push(`/document/${res.data}`);
    } catch (err: any) {
      toast(err.message, {
        position: "top-right",
      });
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
    <div className="space-y-10">
      <section>
        <div className="mb-4">
          <h2 className="text-lg font-bold text-gray-800">Upload Document</h2>
          <p className="text-sm text-gray-500">
            Prepare a new PDF for signatures.
          </p>
        </div>

        <div
          onClick={() => !loading && inputRef.current?.click()}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
          className={`
            relative flex flex-col items-center justify-center w-full p-10 
            border-2 border-dashed rounded-xl transition-all duration-200 ease-in-out bg-white
            ${loading ? "bg-gray-50 border-gray-200 cursor-not-allowed" : "cursor-pointer shadow-sm"}
            ${
              isDragging
                ? "border-blue-500 bg-blue-50 scale-[1.01]"
                : "border-gray-300 hover:border-blue-400 hover:shadow-md"
            }
          `}
        >
          {loading ? (
            <div className="flex flex-col items-center text-blue-600">
              <Loader2 size={40} className="animate-spin mb-4" />
              <p className="text-sm font-medium text-gray-700">
                Initializing Workspace...
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center text-gray-500">
              <div
                className={`w-14 h-14 rounded-full flex items-center justify-center mb-4 transition-colors duration-200 ${
                  isDragging
                    ? "bg-blue-100 text-blue-600"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                <UploadCloud size={28} />
              </div>
              <p className="text-base font-medium text-gray-800 mb-1">
                <span className="text-blue-600 hover:underline">
                  Click to upload
                </span>{" "}
                or drag and drop
              </p>
              <p className="text-xs text-gray-400 uppercase tracking-wider font-medium mt-1">
                PDF ONLY (Max 10MB)
              </p>
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
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-bold uppercase tracking-wider text-gray-500">
            Recent Documents
          </h2>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
          {documentsLoading ? (
            <div className="p-8 flex items-center justify-center">
              <Loader2 size={20} className="animate-spin text-gray-400" />
            </div>
          ) : documents.length === 0 ? (
            <div className="p-8 flex flex-col items-center justify-center">
              <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mb-3 border border-gray-100">
                <FileText size={20} className="text-gray-400" />
              </div>

              <p className="text-sm font-medium text-gray-700">
                No recent documents
              </p>

              <p className="text-xs text-gray-500 mt-1">
                Upload a PDF above to get started.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {documents.map((doc) => (
                <button
                  key={doc.id}
                  onClick={() => router.push(`/document/${doc.id}`)}
                  className="w-full grid grid-cols-[1fr_auto_auto] items-center gap-4 p-4 my-2 bg-white border border-gray-400 rounded-xl hover:border-gray-500 hover:shadow-sm transition text-left"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center shrink-0">
                      <FileText size={18} className="text-gray-600" />
                    </div>

                    <div className="min-w-0">
                      <p className="text-sm font-medium text-gray-800 truncate">
                        {doc.documentName}
                      </p>

                      <p className="text-xs text-gray-600 mt-0.5">
                        {doc.signedCount}/{doc.totalSigners} signed
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 border-l border-gray-200 pl-4">
                    <span className="text-[11px] px-2 py-1 rounded-full bg-gray-100 text-gray-600 whitespace-nowrap">
                      {doc.status}
                    </span>

                    {doc.isOwner && (
                      <div
                        title="You are the owner"
                        className="flex items-center text-amber-500"
                      >
                        <Crown size={13} />
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-end border-l border-gray-200 pl-4">
                    <ChevronRight
                      size={18}
                      className="text-gray-300 shrink-0"
                    />
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
