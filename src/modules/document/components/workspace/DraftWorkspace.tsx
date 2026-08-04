"use client";

import { useEffect, useState } from "react";
import PanelLayout from "../panels/PanelLayout";
import DraftToolsPanel from "../panels/DraftToolsPanel";
import FieldOrderPanel from "../panels/FieldOrderPanel";
import RightPanel from "../panels/RightPanel";
import {
  getDocumentFileApi,
  publishDocumentApi,
  saveDraftDocumentApi,
} from "@/lib/api/DocumentApi";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { ArrowLeft, FileQuestion, Loader2 } from "lucide-react";
import { FieldType, SignatureMode } from "../../types";
import SignatureAssignmentModal from "../modals/SignatureAssignmentModal";
import { useDraftWorkspace } from "../../hooks/useDraftWorkspace";
import { toast } from "sonner";
import { useAuthStore } from "@/src/store/AuthStore";


interface Props {
  documentId: string;
}

const Viewer = dynamic(() => import("../viewer/DraftViewer"), { ssr: false });

export default function DraftWorkspace({ documentId }: Props) {
  const router = useRouter();
  const [activeTool, setActiveTool] = useState<{
    type: FieldType;
    mode: SignatureMode;
  } | null>(null);
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [publishing, setPublishing] = useState(false);
  const isAuthLoading = useAuthStore((state) => state.isLoading);

  const draft = useDraftWorkspace(documentId);

  const isCurrentUserOwner = draft.isCurrentUserOwner;

  const onSaveDraft = async () => {
    try {
      const signerOrders = draft.signers.map((s) => ({
        userId: s.id,
        order: s.order,
      }));

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

        signerOrders,
      };
      await saveDraftDocumentApi(documentId, payload);
      toast.success("Draft saved successfully!");
    } catch (err) {
      toast.error("Failed to save draft. Please try again.");
      console.error(err);
    }
  };

  const onPublishDraft = async () => {
    try {
      setPublishing(true);

      await publishDocumentApi(documentId);

      toast.success("Document published successfully!");

      await new Promise((resolve) => setTimeout(resolve, 1200));
      window.location.href = `/document/${documentId}`;
    } catch (err: any) {
      console.error(err);

      let message = "Failed to publish document";

      try {
        const parsed = JSON.parse(err.message);
        message = parsed?.message || message;
      } catch {
        message = err.message || message;
      }

      toast.error(message);
    } finally {
      setPublishing(false);
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

  if (isAuthLoading || draft.isLoadingFields) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 size={24} className="animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div>
      {!isLoading && !draft.isLoadingFields && (
        <PanelLayout
          left={
            isCurrentUserOwner ? (
              <div className="flex flex-col h-full">
                <DraftToolsPanel
                  activeTool={activeTool}
                  setActiveTool={setActiveTool}
                  onSaveDraft={onSaveDraft}
                  onPublishDraft={onPublishDraft}
                  isPublishing={publishing}
                  middleContent={
                    draft.fields.length > 0 ? (
                      <>
                        <hr className="border-gray-200 my-4" />
                        <FieldOrderPanel
                          fields={draft.fields}
                          signers={draft.signers}
                          onReorder={draft.reorderSigners}
                          canEdit={isCurrentUserOwner}
                        />
                      </>
                    ) : undefined
                  }
                />
              </div>
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
              isCurrentUserOwner={isCurrentUserOwner}
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

      {(isLoading || draft.isLoadingFields) && (
        <div className="flex items-center justify-center h-[80vh]">
          <div className="flex flex-col items-center gap-3 text-gray-500">
            <Loader2 size={28} className="animate-spin" />
            <p className="text-sm">Loading document workspace...</p>
          </div>
        </div>
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
