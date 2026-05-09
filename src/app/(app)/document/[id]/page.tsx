"use client";

import { useEffect, useState } from "react";
import DraftWorkspace from "@/src/modules/document/components/workspace/DraftWorkspace";
import SignWorkspace from "@/src/modules/document/components/workspace/SignWorkspace";
import { useParams } from "next/navigation";
import { getDocumentLayoutApi } from "@/lib/api/DocumentApi";

export default function Workspace() {
  const params = useParams();
  const documentId = params.id as string;

  const isDev = process.env.NODE_ENV === "test";
  const [phase, setPhase] = useState<"DRAFT" | "SIGN">("DRAFT");
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    const fetchStatus = async () => {
      const data = await getDocumentLayoutApi(documentId);
      setStatus(data.status);
    };

    fetchStatus();
  }, [documentId]);

  if (status === "DRAFT") {
    return <DraftWorkspace documentId={documentId} />;
  }

  if (status === "PENDING") {
    return <SignWorkspace documentId={documentId} />;
  }

  return (
    <div className="relative w-full h-screen overflow-hidden bg-[#f4f6f8]">
      {isDev && (
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
