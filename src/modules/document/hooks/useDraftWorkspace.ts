import { useState } from "react";
import { FieldType, SignatureMode } from "../types";
import { FIELD_CONFIG } from "../field-config";
import { useFields } from "./useFields";
import { useSigners } from "./useSigners";

interface PendingPosition {
  x: number;
  y: number;
  page: number;
  mode: SignatureMode;
}

export function useDraftWorkspace() {
  const { signers, addSigner, removeSigner, reorderSigners } = useSigners();

  const {
    fields,
    createField,
    moveField,
    resizeField,
    removeField,
    removeFieldsBySigner,
  } = useFields();

  const [pendingPosition, setPendingPosition] =
    useState<PendingPosition | null>(null);

  const [isAssignmentModalOpen, setIsAssignmentModalOpen] = useState(false);

  const handleDrop = (
    e: React.DragEvent<HTMLDivElement>,
    pageContainerRef: React.RefObject<HTMLDivElement | null>,
    scale: number,
    pageNumber: number,
  ) => {
    e.preventDefault();

    const mode = e.dataTransfer.getData("signature-mode") as SignatureMode;

    if (!mode || !pageContainerRef.current) return;

    const rect = pageContainerRef.current.getBoundingClientRect();

    const rawX = (e.clientX - rect.left) / scale;
    const rawY = (e.clientY - rect.top) / scale;

    const config = FIELD_CONFIG["SIGNATURE"];

    const pageWidth = rect.width / scale;
    const pageHeight = rect.height / scale;

    const clampedX = Math.max(0, Math.min(rawX, pageWidth - config.width));

    const clampedY = Math.max(0, Math.min(rawY, pageHeight - config.height));

    setPendingPosition({
      x: clampedX,
      y: clampedY,
      page: pageNumber,
      mode,
    });

    setIsAssignmentModalOpen(true);
  };

  const handlePlaceField = (
    e: React.MouseEvent<HTMLDivElement>,
    pageContainerRef: React.RefObject<HTMLDivElement | null>,
    scale: number,
    pageNumber: number,
    mode: SignatureMode,
  ) => {
    if (!pageContainerRef.current) return;

    const rect = pageContainerRef.current.getBoundingClientRect();

    const rawX = (e.clientX - rect.left) / scale;
    const rawY = (e.clientY - rect.top) / scale;

    const config = FIELD_CONFIG["SIGNATURE"];

    const pageWidth = rect.width / scale;
    const pageHeight = rect.height / scale;

    const clampedX = Math.max(0, Math.min(rawX, pageWidth - config.width));

    const clampedY = Math.max(0, Math.min(rawY, pageHeight - config.height));

    setPendingPosition({
      x: clampedX,
      y: clampedY,
      page: pageNumber,
      mode,
    });

    setIsAssignmentModalOpen(true);
  };

  const confirmSignatureField = (signerId: string) => {
    if (!pendingPosition) return;

    createField(
      pendingPosition.x,
      pendingPosition.y,
      pendingPosition.page,
      signerId,
      pendingPosition.mode,
    );

    setPendingPosition(null);
    setIsAssignmentModalOpen(false);
  };

  const cancelSignatureField = () => {
    setPendingPosition(null);
    setIsAssignmentModalOpen(false);
  };

  const handleRemoveSigner = (signerId: string) => {
    removeSigner(signerId);
    removeFieldsBySigner(signerId);
  };

  return {
    signers,
    fields,
    addSigner,
    removeSigner: handleRemoveSigner,
    reorderSigners,
    moveField,
    resizeField,
    removeField,
    handleDrop,
    handlePlaceField,
    confirmSignatureField,
    cancelSignatureField,
    isAssignmentModalOpen,
  };
}