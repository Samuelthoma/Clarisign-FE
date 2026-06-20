"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  FileQuestion,
  CheckCircle2,
  Download,
  ShieldCheck,
} from "lucide-react";

import PanelLayout from "../panels/PanelLayout";
import RightPanel from "../panels/RightPanel";
import { downloadDocumentFileApi, getDocumentFileApi } from "@/lib/api/DocumentApi";

import { useSignWorkspace } from "../../hooks/useSignWorkspace";
import FieldBox from "../ui/field";

interface Props {
  documentId: string;
}

const BaseViewer = dynamic(() => import("../viewer/BaseViewer"), {
  ssr: false,
});

export default function CompletedWorkspace({ documentId }: Props) {
  const router = useRouter();

  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [downloadDocument, setDownloadDocument] = useState<string | null>(null);
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

  useEffect(() => {
    const fetchDownloadDocument = async () => {
      setIsLoading(true);

      try {
        const res = await downloadDocumentFileApi(documentId);

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

    fetchDownloadDocument();
  }, [documentId]);

  const handleDownload = () => {
    if (fileUrl) {
      const link = document.createElement("a");
      link.href = fileUrl;
      link.download = `Signed_Document_${documentId}.pdf`;
      link.target = "_blank";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  if (!isLoading && !fileUrl) {
    return (
      <div className="flex flex-col w-full h-full bg-slate-50 items-center justify-center p-6">
        <div className="flex flex-col items-center bg-white p-10 rounded-2xl border border-slate-200 shadow-sm max-w-md text-center">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-6">
            <FileQuestion size={32} className="text-slate-400" />
          </div>

          <h2 className="text-xl font-bold text-slate-800 mb-2">
            Document Not Found
          </h2>

          <p className="text-slate-500 text-sm mb-8">
            The file you are looking for doesn't exist, was deleted, or the URL
            is incorrect.
          </p>

          <button
            onClick={() => router.push("/dashboard")}
            className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-lg font-medium transition-all shadow-sm"
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
            <div className="flex flex-col h-full bg-emerald-50/30 border-r border-emerald-100/50">
              <div className="border-b border-emerald-100/50 p-5">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-emerald-100 shadow-sm border border-emerald-200">
                    <CheckCircle2 size={20} className="text-emerald-700" />
                  </div>

                  <div>
                    <h2 className="text-sm font-bold text-emerald-900 tracking-tight">
                      Document Finalized
                    </h2>

                    <p className="text-xs text-emerald-700 mt-1 leading-relaxed font-medium">
                      This document has been successfully executed and digitally
                      signed by all required parties.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-5 space-y-4">
                <div className="bg-white border border-emerald-100 rounded-xl p-4 shadow-sm">
                  <p className="text-[10px] font-bold text-slate-400 mb-2 uppercase tracking-widest">
                    Current Status
                  </p>

                  <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-bold text-emerald-700 ring-1 ring-inset ring-emerald-600/20 uppercase tracking-wider">
                    <ShieldCheck size={12} strokeWidth={2.5} />
                    COMPLETED
                  </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
                  <p className="text-sm font-semibold text-slate-800 mb-1">
                    Download Copy
                  </p>
                  <p className="text-xs text-slate-500 leading-relaxed mb-4">
                    The final signed PDF and its audit trail are securely
                    stored. Download a copy for your records.
                  </p>

                  <button
                    onClick={handleDownload}
                    className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 shadow-sm hover:shadow hover:-translate-y-0.5"
                  >
                    <Download size={16} strokeWidth={2.5} />
                    Download PDF
                  </button>
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
