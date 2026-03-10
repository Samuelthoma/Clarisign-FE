"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { ArrowLeft, FileQuestion } from "lucide-react";

import PanelLayout from "../panels/panel-layout";
import SignerActionPanel from "../panels/SignerActionPanel";
import RightPanel from "../panels/right-panel"; // Reusing your existing right panel
import { getDocumentFileApi } from "@/lib/api/DocumentApi";
import { DraftField } from "../../types";

// Hypothetical hook: You will need to create this to fetch the document's fields, 
// signers, current logged-in signer, and manage the signatures dictionary.
import { useSignWorkspace } from "../../hooks/useSignWorkspace"; 

interface Props {
  documentId: string;
}

// Dynamically import BaseViewer to prevent SSR issues with react-pdf
const BaseViewer = dynamic(() => import("../viewer/BaseViewer"), { ssr: false });
// We'll also need the FieldBox for the overlay
import FieldBox from "../ui/field";

export default function SignWorkspace({ documentId }: Props) {
  const router = useRouter();
  
  // File Loading State
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Pagination State (Lifted up for SignerActionPanel navigation)
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Signing Business Logic State
  const sign = useSignWorkspace(documentId);

  useEffect(() => {
    const fetchDocument = async () => {
      setIsLoading(true);
      try {
        const res = await getDocumentFileApi(documentId);
        setFileUrl(res.url);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDocument();
  }, [documentId]);

  // Cross-page navigation logic
  const handleNavigateToField = (field: DraftField) => {
    if (currentPage !== field.page) {
      setCurrentPage(field.page);
      
      setTimeout(() => {
        const element = document.getElementById(`field-${field.id}`);
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "center" });
          element.classList.add("ring-4", "ring-blue-400");
          setTimeout(() => element.classList.remove("ring-4", "ring-blue-400"), 1500);
        }
      }, 400); 
    } else {
      const element = document.getElementById(`field-${field.id}`);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" });
        element.classList.add("ring-4", "ring-blue-400");
        setTimeout(() => element.classList.remove("ring-4", "ring-blue-400"), 1500);
      }
    }
  };

  if (!isLoading && !fileUrl) {
    return (
      <div className="flex flex-col w-full h-full bg-[#f4f6f8] items-center justify-center p-6">
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

  const signerMap = Object.fromEntries(sign.signers.map((s) => [s.id, s]));

  return (
    <div>
      {!isLoading && (
        <PanelLayout
          // LEFT PANEL
          leftTitle="Required Actions"
          left={
            <SignerActionPanel 
              fields={sign.fields} 
              currentSignerId={sign.currentSignerId}
              signatures={sign.signatures}
              onNavigateToField={handleNavigateToField}
              onComplete={sign.submitDocument}
              onReject={sign.rejectDocument}
              isSubmitting={sign.isSubmitting}
            />
          }
          
          // CENTER PANEL
          center={
            <BaseViewer 
              fileUrl={fileUrl}
              isLoading={isLoading}
              pageNumber={currentPage}
              onPageChange={setCurrentPage}
            >
              {({ scale, pageNumber }) => (
                <div className="absolute inset-0 z-10">
                  {sign.fields
                    .filter((field: any) => field.page === pageNumber)
                    .map((field: any) => {
                      const signer = signerMap[field.signerId!];
                      
                      return (
                        <FieldBox
                          key={field.id}
                          field={field}
                          signer={signer}
                          scale={scale}
                          mode={field.signerId === sign.currentSignerId ? "sign" : "view"}
                          onSignClick={sign.openSignModal}
                          signatureValue={sign.signatures[field.id] || null}
                        />
                      );
                    })}
                </div>
              )}
            </BaseViewer>
          }

          // RIGHT PANEL
          rightTitle="Collaborators"
          right={
            <RightPanel 
              signers={sign.signers} 
              // Passing empty/noop functions if the signer isn't allowed to add/remove collaborators
              onAddSigner={() => {}} 
              onRemoveSigner={() => {}}
            />
          }
        />
      )}

      {/* TODO: Add Signing Modal Here (e.g. Draw/Type Signature Modal)
        <SignatureModal 
          isOpen={sign.isSignModalOpen} 
          onClose={sign.closeSignModal}
          onConfirm={sign.confirmSignature}
        />
      */}
    </div>
  );
}