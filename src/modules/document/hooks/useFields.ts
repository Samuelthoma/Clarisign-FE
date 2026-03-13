import { useState } from "react";
import { DraftField, SignatureMode } from "../types";
import { FIELD_CONFIG } from "../FieldConfig";

export function useFields() {
  const [fields, setFields] = useState<DraftField[]>([]);

  const createField = (
    x: number,
    y: number,
    page: number,
    signerId: string,
    mode: SignatureMode
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
    setFields((prev) =>
      prev.map((field) =>
        field.id === id ? { ...field, x, y } : field
      )
    );
  };

  const resizeField = (id: string, width: number, height: number) => {
    setFields((prev) =>
      prev.map((field) =>
        field.id === id ? { ...field, width, height } : field
      )
    );
  };

  const removeField = (id: string) => {
    setFields((prev) => prev.filter((field) => field.id !== id));
  };

  const removeFieldsBySigner = (signerId: string) => {
    setFields((prev) =>
      prev.filter((field) => field.signerId !== signerId)
    );
  };

  return {
    fields,
    createField,
    moveField,
    resizeField,
    removeField,
    removeFieldsBySigner,
  };
}