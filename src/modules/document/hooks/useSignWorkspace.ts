import { useState, useEffect } from "react";
import { DraftField } from "../types";
import { useFields } from "./useFields";
import { useSigners } from "./useSigners";
import { useAuthStore } from "@/src/store/AuthStore";
import {
  finalizeDocumentApi,
  generateSignatureNonceApi,
  rejectDocumentApi,
  signDocumentApi,
} from "@/lib/api/DocumentApi";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function useSignWorkspace(documentId: string) {
  const { fields } = useFields(documentId, false);
  const { signers } = useSigners(documentId);
  const currentUser = useAuthStore((state) => state.user);
  const currentSignerId = currentUser!.id;
  const [signatures, setSignatures] = useState<Record<string, string>>({});
  const [activeSignField, setActiveSignField] = useState<DraftField | null>(
    null,
  );
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isRejectting, setIsRejectting] = useState<boolean>(false);
  const [isFinalizing, setIsFinalizing] = useState<boolean>(false);

  const router = useRouter();

  const openSignModal = (field: DraftField) => {
    setActiveSignField(field);
  };

  const closeSignModal = () => {
    setActiveSignField(null);
  };

  const confirmSignature = (signatureData: string) => {
    if (!activeSignField) return;

    setSignatures((prev) => ({
      ...prev,
      [activeSignField.id]: signatureData,
    }));

    closeSignModal();
  };

  const submitDocument = async () => {
    setIsSubmitting(true);
    const nonce = await generateSignatureNonceApi(documentId);

    try {
      const payload = {
        signatures: fields
          .filter((field) => signatures[field.id])
          .map((field) => ({
            id: field.id,
            page: field.page,
            relX: field.x,
            relY: field.y,
            relWidth: field.width,
            relHeight: field.height,
            signatureType: field.mode as "TYPED" | "DRAWN",
            signatureContent: signatures[field.id],
          })),

        nonce: nonce.nonce,
      };

      if (payload.signatures.length === 0) {
        toast.error("You already signed this document");
        return;
      }

      await signDocumentApi(documentId, payload);
      toast.success("Document has been signed!");
      window.location.href = `/document/${documentId}`;
    } catch (error: any) {
      let errorMessage = "Failed to sign document";

      try {
        const parsed = JSON.parse(error.message);

        errorMessage = parsed?.errors?.email || parsed?.message || errorMessage;
      } catch {
        errorMessage = error.message || errorMessage;
      }

      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const rejectDocument = async () => {
    setIsRejectting(true);
    try {
      await rejectDocumentApi(documentId);
      toast.success("Document has been rejected");
      router.push("/dashboard");
    } catch (err: any) {
      console.error(err);

      let message = "Failed to reject document";

      try {
        const parsed = JSON.parse(err.message);
        message = parsed?.message || message;
      } catch {
        message = err.message || message;
      }

      toast.error(message);
    } finally {
      setIsRejectting(false);
    }
  };

  const finalizeDocument = async () => {
    setIsFinalizing(true);

    try {
      await finalizeDocumentApi(documentId);
      toast.success("Document has been finalized");
      window.location.href = `/document/${documentId}`;
    } catch (err: any) {
      console.error(err);

      let message = "Failed to finalize document";

      try {
        const parsed = JSON.parse(err.message);
        message = parsed?.message || message;
      } catch {
        message = err.message || message;
      }

      toast.error(message);
    } finally {
      setIsFinalizing(false);
    }
  };

  return {
    fields,
    signers,
    currentSignerId,
    signatures,
    isSubmitting,
    isRejectting,
    isFinalizing,
    activeSignField,
    openSignModal,
    closeSignModal,
    confirmSignature,
    submitDocument,
    rejectDocument,
    finalizeDocument,
  };
}
