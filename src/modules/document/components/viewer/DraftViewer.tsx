"use client";

import React, { useState } from "react";
import BaseViewer from "./BaseViewer";
import { DraftField, FieldType, SignatureMode, Signer } from "../../types";
import { useFieldInteraction } from "../../hooks/useFieldInteraction";
import FieldBox from "../ui/field";

interface DraftViewerProps {
  fileUrl: string | null;
  isLoading?: boolean;
  fields: DraftField[];
  signers: Signer[];
  placementTool: {
    type: FieldType;
    mode: SignatureMode;
  } | null;
  clearPlacementTool: () => void;
  onPlaceField: (
    e: React.MouseEvent<HTMLDivElement>,
    pageContainerRef: React.RefObject<HTMLDivElement | null>,
    scale: number,
    pageNumber: number,
    mode: SignatureMode,
  ) => void;
  onCreateField: (
    e: React.DragEvent<HTMLDivElement>,
    pageContainerRef: React.RefObject<HTMLDivElement | null>,
    scale: number,
    pageNumber: number,
  ) => void;
  onMoveField: (id: string, x: number, y: number) => void;
  onRemoveField: (id: string) => void;
  onResizeField: (id: string, width: number, height: number) => void;
}

export default function DraftViewer(props: DraftViewerProps) {
  const [pageNumber, setPageNumber] = useState<number>(1);

  return (
    <BaseViewer 
      fileUrl={props.fileUrl} 
      isLoading={props.isLoading}
      pageNumber={pageNumber}
      onPageChange={setPageNumber}
    >
      {(viewerState) => <DraftOverlay {...props} {...viewerState} />}
    </BaseViewer>
  );
}

interface DraftOverlayProps extends DraftViewerProps {
  scale: number;
  pageNumber: number;
  pageContainerRef: React.RefObject<HTMLDivElement | null>;
}

function DraftOverlay({
  fields,
  signers,
  scale,
  pageNumber,
  pageContainerRef,
  placementTool,
  clearPlacementTool,
  onCreateField,
  onPlaceField,
  onMoveField,
  onResizeField,
  onRemoveField,
}: DraftOverlayProps) {
  
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const { startMove, startResize } = useFieldInteraction({
    fields,
    scale,
    pageContainerRef,
    onMoveField,
    onResizeField,
  });

  const signerMap = Object.fromEntries(signers.map((s) => [s.id, s]));

  return (
    <div
      className={`absolute inset-0 z-10 ${
        placementTool ? "cursor-crosshair" : ""
      }`}
      onDrop={(e) => onCreateField(e, pageContainerRef, scale, pageNumber)}
      onDragOver={handleDragOver}
      onClick={(e) => {
        if (!placementTool) return;
        if ((e.target as HTMLElement).closest("[data-field]")) return;

        onPlaceField(
          e,
          pageContainerRef,
          scale,
          pageNumber,
          placementTool.mode,
        );

        clearPlacementTool();
      }}
    >
      {fields
        .filter((field) => field.page === pageNumber)
        .map((field) => {
          const signer = signerMap[field.signerId!];

          return (
            <FieldBox
              key={field.id}
              field={field}
              signer={signer}
              scale={scale}
              mode="draft" 
              onStartMove={startMove}
              onStartResize={startResize}
              onRemove={onRemoveField}
            />
          );
        })}
    </div>
  );
}