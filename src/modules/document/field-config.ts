import { FieldType } from "./types";

export const FIELD_CONFIG: Record<
  FieldType,
  { width: number; height: number }
> = {
  SIGNATURE: {
    width: 180,
    height: 60,
  },
  TEXT: {
    width: 180,
    height: 60,
  },
};
