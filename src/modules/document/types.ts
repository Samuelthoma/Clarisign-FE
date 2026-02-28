export type FieldType = "SIGNATURE" | "TEXT";

export interface DraftField {
    id: string
    type: FieldType
    x: number
    y: number
    width: number
    height: number
    page: number
}
