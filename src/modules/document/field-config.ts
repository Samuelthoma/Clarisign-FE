import { FieldType } from "./types";

export const FIELD_CONFIG: Record<
  FieldType,
  {
    width: number;
    height: number;
    minWidth: number;
    minHeight: number;
    resizable: boolean;
  }
> = {
  SIGNATURE: {
    width: 180,
    height: 60,
    minWidth: 60,
    minHeight: 40,
    resizable: true,
  }
};
