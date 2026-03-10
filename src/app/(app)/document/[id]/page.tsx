"use client";

import { useState } from "react";
import DraftWorkspace from "@/src/modules/document/components/workspace/DraftWorkspace";
import SignWorkspace from "@/src/modules/document/components/workspace/SignWorkspace";
import { useParams } from "next/navigation";
import { DraftField, Signer } from "@/src/modules/document/types"; // Adjust path as needed

// Temporary Dev Mock Signers
const DEV_MOCK_SIGNERS: Signer[] = [
  { id: "user-1", name: "Alice Owner", email: "alice@test.com", order: 1, status: "DRAFT", color: "#2563eb", isOwner: true },
  { id: "user-2", name: "Bob Signer", email: "bob@test.com", order: 2, status: "INVITED", color: "#16a34a" }
];

export default function Workspace() {
  const params = useParams();
  const documentId = params.id as string;

  // --- DEV ONLY STATES ---
  const isDev = process.env.NODE_ENV === "development";
  const [phase, setPhase] = useState<"DRAFT" | "SIGN">("DRAFT");
  
  // Lifted state to persist drafted fields when switching phases
  const [devFields, setDevFields] = useState<DraftField[]>([]);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-[#f4f6f8]">
      
      {/* Workspace Rendering */}
      {phase === "DRAFT" ? (
        <DraftWorkspace 
          documentId={documentId} 
          // @ts-ignore - Temporary dev props
          devFields={devFields}
          setDevFields={setDevFields}
          devSigners={DEV_MOCK_SIGNERS}
        />
      ) : (
        <SignWorkspace 
          documentId={documentId} 
          // @ts-ignore - Temporary dev props
          devFields={devFields}
          devSigners={DEV_MOCK_SIGNERS}
          devCurrentSignerId="user-2" // Hardcode to simulate Bob viewing the document
        />
      )}

      {/* DEV-ONLY OVERLAY CONTROLS */}
      {isDev && (
        <div className="fixed bottom-6 right-6 z-9999 flex items-center gap-2 bg-white p-2 rounded-lg shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-gray-200">
          <div className="flex flex-col px-2">
            <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">
              Dev Mode
            </span>
            <span className="text-[10px] text-gray-500">
              {devFields.length} Fields
            </span>
          </div>
          
          <div className="w-px h-8 bg-gray-200 mx-1" />

          <button
            onClick={() => setPhase("DRAFT")}
            className={`px-4 py-2 text-sm font-medium rounded-md transition ${
              phase === "DRAFT"
                ? "bg-black text-white shadow-sm"
                : "bg-gray-50 text-gray-600 hover:bg-gray-100"
            }`}
          >
            Drafting
          </button>
          
          <button
            onClick={() => setPhase("SIGN")}
            className={`px-4 py-2 text-sm font-medium rounded-md transition ${
              phase === "SIGN"
                ? "bg-black text-white shadow-sm"
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