import { useState, useEffect } from "react";
import { DraftField, Signer } from "../types";

export function useSignWorkspace(documentId: string) {
  // --- Data States ---
  const [fields, setFields] = useState<DraftField[]>([]);
  const [signers, setSigners] = useState<Signer[]>([]);
  
  // In a real implementation, this ID likely comes from your JWT token or Auth session.
  // We initialize it as an empty string until the data loads.
  const [currentSignerId, setCurrentSignerId] = useState<string>("");

  // --- Signing States ---
  // Maps field.id to a base64 signature image string
  const [signatures, setSignatures] = useState<Record<string, string>>({});
  
  // Controls the Signature Modal. If null, modal is closed.
  const [activeSignField, setActiveSignField] = useState<DraftField | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // --- Fetch Initial Data ---
  useEffect(() => {
    const fetchWorkspaceData = async () => {
      try {
        /* TODO: Replace with your actual Spring Boot API GET endpoint
          Example:
          const response = await axios.get(`/api/v1/documents/${documentId}/workspace`);
          setFields(response.data.fields);
          setSigners(response.data.signers);
          setCurrentSignerId(response.data.currentUserId);
        */
      } catch (error) {
        console.error("Failed to fetch document workspace data:", error);
      }
    };

    if (documentId) {
      fetchWorkspaceData();
    }
  }, [documentId]);

  // --- Modal Actions ---
  const openSignModal = (field: DraftField) => {
    setActiveSignField(field);
  };

  const closeSignModal = () => {
    setActiveSignField(null);
  };

  const confirmSignature = (signatureData: string) => {
    if (!activeSignField) return;

    // Save the signature to our dictionary
    setSignatures((prev) => ({
      ...prev,
      [activeSignField.id]: signatureData,
    }));
    
    closeSignModal();
  };

  // --- Submission Actions ---
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
      // Handle error explicitly (e.g., show a toast notification)
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