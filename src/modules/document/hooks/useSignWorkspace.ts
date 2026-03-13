import { useState, useEffect } from "react";
import { DraftField, Signer } from "../types";

const DUMMY_SIGNERS: Signer[] = [
  {
    id: "user-1",
    name: "Alice Owner",
    email: "alice@test.com",
    order: 1,
    status: "DRAFT",
    color: "#2563eb",
    isOwner: true,
  },
  {
    id: "user-2",
    name: "Bob Signer",
    email: "bob@test.com",
    order: 2,
    status: "WAITING",
    color: "#16a34a",
  },
];

const DUMMY_FIELDS: DraftField[] = [
  {
    id: "field-1",
    type: "SIGNATURE",
    mode: "DRAW",
    x: 120,
    y: 150,
    width: 80,
    height: 80,
    page: 1,
    signerId: "user-2",
  },
  {
    id: "field-2",
    type: "SIGNATURE",
    mode: "TYPE",
    x: 120,
    y: 350,
    width: 80,
    height: 80,
    page: 2,
    signerId: "user-2",
  },
];

export function useSignWorkspace(documentId: string) {
  const [fields, setFields] = useState<DraftField[]>(DUMMY_FIELDS);
  const [signers, setSigners] = useState<Signer[]>(DUMMY_SIGNERS);
  const [currentSignerId, setCurrentSignerId] = useState<string>("user-2");
  const [signatures, setSignatures] = useState<Record<string, string>>({});
  const [activeSignField, setActiveSignField] = useState<DraftField | null>(
    null,
  );
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

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