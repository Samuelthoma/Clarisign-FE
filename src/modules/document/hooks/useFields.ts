import { useEffect, useState } from "react";
import { DraftField, SignatureMode } from "../types";
import { FIELD_CONFIG } from "../FieldConfig";
import { getDocumentLayoutApi } from "@/lib/api/DocumentApi";

interface LayoutItemResponse {
  id: string;
  signerId: string;
  page: number;
  relX: number;
  relY: number;
  relWidth: number;
  relHeight: number;
  type: SignatureMode;
}

export function useFields(documentId: string, canEdit: boolean) {
  const [fields, setFields] = useState<DraftField[]>([]);
  const [isLoadingFields, setIsLoadingFields] = useState(true);

  const fetchLayout = async () => {
    try {
      setIsLoadingFields(true);

      const data = await getDocumentLayoutApi(documentId);

      const mappedFields: DraftField[] = data.fields.map(
        (item: LayoutItemResponse) => ({
          id: item.id,
          type: "SIGNATURE",
          mode: item.type,
          signerId: item.signerId,
          x: item.relX,
          y: item.relY,
          page: item.page,
          width: item.relWidth,
          height: item.relHeight,
        }),
      );

      setFields(mappedFields);
    } catch (err) {
      console.error("Failed to fetch layout:", err);
    } finally {
      setIsLoadingFields(false);
    }
  };

  useEffect(() => {
    fetchLayout();
  }, [documentId]);

  const createField = (
    x: number,
    y: number,
    page: number,
    signerId: string,
    mode: SignatureMode,
  ) => {
    const config = FIELD_CONFIG["SIGNATURE"];

    const newField: DraftField = {
      id: crypto.randomUUID(),
      type: "SIGNATURE",
      mode,
      signerId,
      x,
      y,
      page,
      width: config.width,
      height: config.height,
    };

    setFields((prev) => [...prev, newField]);
  };

  const moveField = (id: string, x: number, y: number) => {
    if (!canEdit) return;
    setFields((prev) =>
      prev.map((field) => (field.id === id ? { ...field, x, y } : field)),
    );
  };

  const resizeField = (id: string, width: number, height: number) => {
    if (!canEdit) return;
    setFields((prev) =>
      prev.map((field) =>
        field.id === id ? { ...field, width, height } : field,
      ),
    );
  };

  const removeField = (id: string) => {
    if (!canEdit) return;
    setFields((prev) => prev.filter((field) => field.id !== id));
  };

  const removeFieldsBySigner = (signerId: string) => {
    setFields((prev) => prev.filter((field) => field.signerId !== signerId));
  };

  return {
    fields,
    isLoadingFields,
    createField,
    moveField,
    resizeField,
    removeField,
    removeFieldsBySigner,
  };
}