"use client";

import { useEffect, useState } from "react";
import DraftWorkspace from "@/src/modules/document/components/workspace/DraftWorkspace";
import SignWorkspace from "@/src/modules/document/components/workspace/SignWorkspace";
import RevokedWorkspace from "@/src/modules/document/components/workspace/RevokeWorkspace";
import { useParams, useRouter } from "next/navigation";
import { getDocumentLayoutApi } from "@/lib/api/DocumentApi";
import { FileQuestion, ArrowLeft } from "lucide-react";

export default function Workspace() {
  const params = useParams();
  const router = useRouter();
  const documentId = params.id as string;

  const isDev = process.env.NODE_ENV === "test";
  const [phase, setPhase] = useState<"DRAFT" | "SIGN">("DRAFT");
  const [status, setStatus] = useState<string | null>(null);

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const data = await getDocumentLayoutApi(documentId);
        setStatus(data.status);
      } catch (err: any) {
        console.error("Failed to fetch document status:", err);
        setError(err.message || "Document not found or invalid ID.");
      }
    };

    if (documentId) {
      fetchStatus();
    }
  }, [documentId]);

  if (error) {
    return (
      <div className="flex flex-col w-full h-screen bg-[#f4f6f8] items-center justify-center p-6">
        <div className="flex flex-col items-center bg-white p-10 rounded-xl border border-gray-200 shadow-sm max-w-md text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-6">
            <FileQuestion size={32} className="text-gray-400" />
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">
            Document Not Found
          </h2>
          <p className="text-gray-500 text-sm mb-8">
            The file you are looking for doesn't exist, was deleted, or the URL
            is incorrect.
          </p>
          <button
            onClick={() => router.push("/dashboard")}
            className="flex items-center gap-2 bg-gray-900 hover:bg-gray-800 text-white px-5 py-2.5 rounded-md font-medium transition"
          >
            <ArrowLeft size={18} />
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (status === "DRAFT") {
    return <DraftWorkspace documentId={documentId} />;
  }

  if (status === "PENDING") {
    return <SignWorkspace documentId={documentId} />;
  }

  if (status === "REVOKED") {
    return <RevokedWorkspace documentId={documentId} />;
  }

  return (
    <div className="relative w-full h-screen overflow-hidden bg-[#f4f6f8]">
      {isDev && !status && (
        <div className="fixed bottom-6 right-6 z-9999 flex items-center gap-2 bg-white p-2 rounded-lg shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-gray-200">
          <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider px-2">
            Dev Mode
          </span>
          <div className="w-px h-8 bg-gray-200 mx-1" />
          <button
            onClick={() => setPhase("DRAFT")}
            className={`px-4 py-2 text-sm font-medium rounded-md transition ${
              phase === "DRAFT"
                ? "bg-black text-white"
                : "bg-gray-50 text-gray-600 hover:bg-gray-100"
            }`}
          >
            Drafting
          </button>
          <button
            onClick={() => setPhase("SIGN")}
            className={`px-4 py-2 text-sm font-medium rounded-md transition ${
              phase === "SIGN"
                ? "bg-black text-white"
                : "bg-gray-50 text-gray-600 hover:bg-gray-100"
            }`}
          >
            Signing
          </button>
        </div>
      )}
    </div>
  );
}
