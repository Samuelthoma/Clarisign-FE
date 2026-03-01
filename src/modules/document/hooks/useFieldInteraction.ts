import { useEffect, useRef, useState } from "react";
import { DraftField } from "../types";
import { FIELD_CONFIG } from "../field-config";

interface UseFieldInteractionProps {
  fields: DraftField[];
  scale: number;
  pageContainerRef: React.RefObject<HTMLDivElement | null>;
  onMoveField: (id: string, x: number, y: number) => void;
  onResizeField: (id: string, width: number, height: number) => void;
}

export function useFieldInteraction({
  fields,
  scale,
  pageContainerRef,
  onMoveField,
  onResizeField,
}: UseFieldInteractionProps) {
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [resizingId, setResizingId] = useState<string | null>(null);

  const offsetRef = useRef({ x: 0, y: 0 });
  const resizeStartRef = useRef({
    startX: 0,
    startY: 0,
    startWidth: 0,
    startHeight: 0,
  });

  const startMove = (e: React.MouseEvent, field: DraftField) => {
    e.stopPropagation();
    if (!pageContainerRef.current) return;

    const rect = pageContainerRef.current.getBoundingClientRect();

    const mouseX = (e.clientX - rect.left) / scale;
    const mouseY = (e.clientY - rect.top) / scale;

    offsetRef.current = {
      x: mouseX - field.x,
      y: mouseY - field.y,
    };

    setDraggingId(field.id);
  };

  const startResize = (e: React.MouseEvent, field: DraftField) => {
    e.stopPropagation();

    resizeStartRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      startWidth: field.width,
      startHeight: field.height,
    };

    setResizingId(field.id);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!pageContainerRef.current) return;

      const rect = pageContainerRef.current.getBoundingClientRect();

      if (resizingId) {
        const field = fields.find((f) => f.id === resizingId);
        if (!field) return;

        const dx = (e.clientX - resizeStartRef.current.startX) / scale;
        const dy = (e.clientY - resizeStartRef.current.startY) / scale;

        const config = FIELD_CONFIG[field.type];

        let newWidth = resizeStartRef.current.startWidth + dx;
        let newHeight = resizeStartRef.current.startHeight + dy;

        newWidth = Math.max(config.minWidth, newWidth);
        newHeight = Math.max(config.minHeight, newHeight);

        const pageWidth = rect.width / scale;
        const pageHeight = rect.height / scale;

        newWidth = Math.min(newWidth, pageWidth - field.x);

        newHeight = Math.min(newHeight, pageHeight - field.y);

        onResizeField(resizingId, newWidth, newHeight);
        return;
      }

      if (draggingId) {
        const field = fields.find((f) => f.id === draggingId);
        if (!field) return;

        const mouseX = (e.clientX - rect.left) / scale;
        const mouseY = (e.clientY - rect.top) / scale;

        const newX = mouseX - offsetRef.current.x;
        const newY = mouseY - offsetRef.current.y;

        const pageWidth = rect.width / scale;
        const pageHeight = rect.height / scale;

        const clampedX = Math.max(0, Math.min(newX, pageWidth - field.width));

        const clampedY = Math.max(0, Math.min(newY, pageHeight - field.height));

        onMoveField(draggingId, clampedX, clampedY);
      }
    };

    const handleMouseUp = () => {
      setDraggingId(null);
      setResizingId(null);
      document.body.style.userSelect = "";
    };

    if (draggingId || resizingId) {
      document.body.style.userSelect = "none";
    }

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [
    draggingId,
    resizingId,
    fields,
    scale,
    onMoveField,
    onResizeField,
    pageContainerRef,
  ]);

  return {
    draggingId,
    resizingId,
    startMove,
    startResize,
  };
}
