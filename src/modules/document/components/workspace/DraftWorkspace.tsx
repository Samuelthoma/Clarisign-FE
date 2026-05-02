"use client";

import { useEffect, useState } from "react";
import PanelLayout from "../panels/PanelLayout";
import DraftToolsPanel from "../panels/DraftToolsPanel";
import RightPanel from "../panels/RightPanel";
import {
  getDocumentFileApi,
  saveDraftDocumentApi,
} from "@/lib/api/DocumentApi";
import dynamic from "next/dynamic";
import { ArrowLeft, FileQuestion } from "lucide-react";
import { FieldType, SignatureMode } from "../../types";
import SignatureAssignmentModal from "../modals/SignatureAssignmentModal";
import { useDraftWorkspace } from "../../hooks/useDraftWorkspace";

interface Props {
  documentId: string;
}

const Viewer = dynamic(() => import("../viewer/DraftViewer"), { ssr: false });

export default function DraftWorkspace({ documentId }: Props) {
  const [activeTool, setActiveTool] = useState<{
    type: FieldType;
    mode: SignatureMode;
  } | null>(null);
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const draft = useDraftWorkspace();

  const isCurrentUserOwner = draft.signers.find(
    (s) => s.id === draft.currentSignerId,
  )?.isOwner;

  const onSaveDraft = async () => {
    try {
      const payload = {
        layoutItems: draft.fields.map((field) => ({
          userId: field.signerId!,
          page: field.page,
          relX: field.x,
          relY: field.y,
          relWidth: field.width,
          relHeight: field.height,
          type: field.mode,
        })),
      };
      await saveDraftDocumentApi(documentId, payload);
    } catch (err) {
      console.error(err);
    }
  };

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
            onClick={() => {
              navigation.navigate("/dashboard");
            }}
            className="flex items-center gap-2 bg-gray-900 hover:bg-gray-800 text-white px-5 py-2.5 rounded-md font-medium transition"
          >
            <ArrowLeft size={18} />
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      {!isLoading && (
        <PanelLayout
          left={
            isCurrentUserOwner ? (
              <DraftToolsPanel
                activeTool={activeTool}
                setActiveTool={setActiveTool}
                onSaveDraft={onSaveDraft}
              />
            ) : (
              <div className="flex flex-col h-full bg-gray-50 border-r items-center justify-center p-6 text-center text-gray-500">
                <p className="text-sm font-semibold text-gray-700 mb-1">
                  View Only Mode
                </p>
                <p className="text-xs text-gray-500">
                  Only the document owner can add or modify signature fields.
                </p>
              </div>
            )
          }
          center={
            <Viewer
              fileUrl={fileUrl}
              isLoading={isLoading}
              fields={draft.fields}
              signers={draft.signers}
              onCreateField={draft.handleDrop}
              onMoveField={draft.moveField}
              onRemoveField={draft.removeField}
              onResizeField={draft.resizeField}
              onPlaceField={draft.handlePlaceField}
              clearPlacementTool={() => setActiveTool(null)}
              placementTool={activeTool}
            />
          }
          right={
            <RightPanel
              signers={draft.signers}
              onAddSigner={draft.addSigner}
              onRemoveSigner={draft.removeSigner}
              canEditSigners={isCurrentUserOwner}
            />
          }
        />
      )}
      <SignatureAssignmentModal
        isOpen={draft.isAssignmentModalOpen}
        signers={draft.signers}
        onClose={draft.cancelSignatureField}
        onConfirm={draft.confirmSignatureField}
      />
    </div>
  );
}
