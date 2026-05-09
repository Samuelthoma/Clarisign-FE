import { useState, useEffect } from "react";
import { DraftField } from "../types";
import { useFields } from "./useFields";
import { useSigners } from "./useSigners";
import { useAuthStore } from "@/src/store/AuthStore";

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
    try {
      /* TODO: Replace with your actual Spring Boot API POST endpoint
        Example:
        await axios.post(`/api/v1/documents/${documentId}/sign`, {
          signatures: signatures 
        });
      */
      console.log("Submitting signatures to backend:", signatures);

      // Usually, you would navigate away after success:
      // router.push('/dashboard');
    } catch (error) {
      console.error("Failed to submit signatures:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const rejectDocument = async () => {
    setIsSubmitting(true);
    try {
      /* TODO: Replace with your actual Spring Boot API POST endpoint
        Example:
        await axios.post(`/api/v1/documents/${documentId}/reject`);
      */
      console.log("Rejecting document...");

      // router.push('/dashboard');
    } catch (error) {
      console.error("Failed to reject document:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    fields,
    signers,
    currentSignerId,
    signatures,
    isSubmitting,
    activeSignField,
    openSignModal,
    closeSignModal,
    confirmSignature,
    submitDocument,
    rejectDocument,
  };
}
