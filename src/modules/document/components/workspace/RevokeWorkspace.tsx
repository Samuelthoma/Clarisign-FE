"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { AlertTriangle, ArrowLeft, FileQuestion } from "lucide-react";

import PanelLayout from "../panels/PanelLayout";
import RightPanel from "../panels/RightPanel";
import { getDocumentFileApi } from "@/lib/api/DocumentApi";

import { useSignWorkspace } from "../../hooks/useSignWorkspace";

interface Props {
  documentId: string;
}

const BaseViewer = dynamic(() => import("../viewer/BaseViewer"), {
  ssr: false,
});

import FieldBox from "../ui/field";

export default function RevokedWorkspace({ documentId }: Props) {
  const router = useRouter();

  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [currentPage, setCurrentPage] = useState<number>(1);

  const sign = useSignWorkspace(documentId);

  useEffect(() => {
    const fetchDocument = async () => {
      setIsLoading(true);

      try {
        const res = await getDocumentFileApi(documentId);

        if (!res?.url) {
          throw new Error("Document URL not found");
        }

        setFileUrl(res.url);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDocument();
  }, [documentId]);

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

  const signerMap = Object.fromEntries(
    (sign.signers || []).map((s) => [s.id, s]),
  );

  return (
    <div>
      {!isLoading && (
        <PanelLayout
          leftTitle="Document Status"
          left={
            <div className="flex flex-col h-full bg-red-50 border-r border-red-100">
              <div className="border-b border-red-100 p-5">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-full bg-red-100">
                    <AlertTriangle size={20} className="text-red-600" />
                  </div>

                  <div>
                    <h2 className="text-sm font-semibold text-red-700">
                      Document Revoked
                    </h2>

                    <p className="text-xs text-red-600 mt-1 leading-relaxed">
                      This document has been revoked and can no longer be signed
                      or modified.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-5 space-y-3">
                <div className="bg-white border border-red-100 rounded-lg p-4">
                  <p className="text-xs text-gray-500 mb-1">Current Status</p>

                  <div className="inline-flex items-center rounded-full bg-red-100 px-3 py-1 text-xs font-medium text-red-700">
                    REVOKED
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <p className="text-xs text-gray-500 leading-relaxed">
                    You can still review the document contents, collaborators,
                    and signature fields, but no further actions are allowed.
                  </p>
                </div>
              </div>
            </div>
          }
          center={
            <BaseViewer
              fileUrl={fileUrl}
              isLoading={isLoading}
              pageNumber={currentPage}
              onPageChange={setCurrentPage}
            >
              {({ scale, pageNumber }) => (
                <div className="absolute inset-0 z-10">
                  {(sign.fields || [])
                    .filter((field: any) => field.page === pageNumber)
                    .map((field: any) => {
                      const signer = signerMap[field.signerId!];

                      return (
                        <FieldBox
                          key={field.id}
                          field={field}
                          signer={signer}
                          scale={scale}
                          mode="view"
                          signatureValue={sign.signatures?.[field.id] || null}
                        />
                      );
                    })}
                </div>
              )}
            </BaseViewer>
          }
          rightTitle="Collaborators"
          right={
            <RightPanel signers={sign.signers || []} canEditSigners={false} />
          }
        />
      )}
    </div>
  );
}
