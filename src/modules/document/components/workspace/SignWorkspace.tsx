"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { ArrowLeft, FileQuestion } from "lucide-react";

import PanelLayout from "../panels/PanelLayout";
import SignerActionPanel from "../panels/SignerActionPanel";
import RightPanel from "../panels/RightPanel";
import {
  getDocumentFileApi,
  verifyFaceIdentityApi,
} from "@/lib/api/DocumentApi";
import { DraftField } from "../../types";

import { useSignWorkspace } from "../../hooks/useSignWorkspace";
import FieldBox from "../ui/field";
import SignatureModal from "../modals/SignatureModal";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import LivenessDetectionStep from "@/src/app/(auth)/register/steps/LivenessDetectionStep";

interface Props {
  documentId: string;
}

const BaseViewer = dynamic(() => import("../viewer/BaseViewer"), {
  ssr: false,
});

export default function SignWorkspace({ documentId }: Props) {
  const router = useRouter();

  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const [isLivenessModalOpen, setIsLivenessModalOpen] = useState(false);
  const [livenessError, setLivenessError] = useState<string | undefined>();

  const [isVerifyingFace, setIsVerifyingFace] = useState(false);

  const sign = useSignWorkspace(documentId);

  const isCurrentUserOwner = sign.signers.some(
    (signer) => signer.id === sign.currentSignerId && signer.isOwner,
  );

  useEffect(() => {
    let currentObjectUrl: string | null = null;

    const fetchDocument = async () => {
      setIsLoading(true);
      try {
        const res = await getDocumentFileApi(documentId);
        currentObjectUrl = res.url;
        setFileUrl(res.url);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDocument();

    return () => {
      if (currentObjectUrl) {
        URL.revokeObjectURL(currentObjectUrl);
      }
    };
  }, [documentId]);

  const handleNavigateToField = (field: DraftField) => {
    if (currentPage !== field.page) {
      setCurrentPage(field.page);

      setTimeout(() => {
        const element = document.getElementById(`field-${field.id}`);
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "center" });
          element.classList.add("ring-4", "ring-blue-400");
          setTimeout(
            () => element.classList.remove("ring-4", "ring-blue-400"),
            1500,
          );
        }
      }, 400);
    } else {
      const element = document.getElementById(`field-${field.id}`);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" });
        element.classList.add("ring-4", "ring-blue-400");
        setTimeout(
          () => element.classList.remove("ring-4", "ring-blue-400"),
          1500,
        );
      }
    }
  };

  const handleInitiateCompletion = () => {
    setLivenessError(undefined);
    setIsVerifyingFace(false);
    setIsLivenessModalOpen(true);
  };

  const handleLivenessSuccess = async (base64FaceImage: string) => {
    setLivenessError(undefined);
    setIsVerifyingFace(true);

    try {
      const res = await fetch(base64FaceImage);
      const blob = await res.blob();
      const imageFile = new File([blob], "verification.jpg", {
        type: "image/jpeg",
      });

      const verificationResponse = await verifyFaceIdentityApi(
        sign.currentSignerId,
        imageFile,
      );

      console.log(verificationResponse)

      if (verificationResponse.match !== true) {
        throw new Error(
          "Identity verification failed. Face does not match the registered user.",
        );
      }

      await sign.submitDocument();

      setIsLivenessModalOpen(false);
    } catch (error: any) {
      console.error("Submission failed:", error);
      setLivenessError(
        // error.message ||
          "Failed to verify identity and submit. Please try again.",
      );
    } finally {
      setIsVerifyingFace(false);
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
          leftTitle="Required Actions"
          left={
            <SignerActionPanel
              fields={sign.fields}
              currentSignerId={sign.currentSignerId}
              signatures={sign.signatures}
              onNavigateToField={handleNavigateToField}
              onComplete={handleInitiateCompletion}
              onReject={sign.rejectDocument}
              onFinalize={sign.finalizeDocument}
              isSubmitting={sign.isSubmitting}
              isRejectting={sign.isRejectting}
              isFinalizing={sign.isFinalizing}
              isOwner={isCurrentUserOwner}
            />
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
                          mode={
                            field.signerId === sign.currentSignerId
                              ? "sign"
                              : "view"
                          }
                          onSignClick={sign.openSignModal}
                          signatureValue={sign.signatures[field.id] || null}
                        />
                      );
                    })}
                </div>
              )}
            </BaseViewer>
          }
          rightTitle="Collaborators"
          right={<RightPanel signers={sign.signers} canEditSigners={false} />}
        />
      )}

      <SignatureModal
        isOpen={!!sign.activeSignField}
        mode={sign.activeSignField?.mode || "DRAWN"}
        onClose={sign.closeSignModal}
        onConfirm={sign.confirmSignature}
      />

      <Dialog open={isLivenessModalOpen} onOpenChange={setIsLivenessModalOpen}>
        <DialogContent className="sm:max-w-[500px] bg-white p-6">
          <DialogTitle className="sr-only">Verify Identity</DialogTitle>
          <DialogDescription className="sr-only">
            Please complete the liveness detection to verify your identity
            before submitting the document.
          </DialogDescription>

          {isVerifyingFace ? (
            <div className="flex flex-col items-center justify-center py-16 space-y-6 text-center animate-in fade-in zoom-in duration-300">
              <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin" />
              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-foreground">
                  Liveness Verified!
                </h3>
                <p className="text-sm text-muted-foreground max-w-[300px]">
                  Please wait, the system is performing face recognition to
                  confirm your identity...
                </p>
              </div>
            </div>
          ) : (
            <LivenessDetectionStep
              onNext={handleLivenessSuccess}
              isSubmitting={sign.isSubmitting}
              error={livenessError}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
