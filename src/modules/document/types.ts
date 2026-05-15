export type FieldType = "SIGNATURE";

export type SignatureMode = "DRAWN" | "TYPED";

export type SignatureStatus = "ACTIVE" | "PENDING" | "REJECTED" | "REVOKED";

export interface DraftField {
  id: string;
  type: FieldType;
  mode: SignatureMode;
  x: number;
  y: number;
  width: number;
  height: number;
  page: number;
  status: SignatureStatus;
  signerId?: string;
}

export type SignerStatus =
  | "DRAFT"
  | "INVITED"
  | "WAITING"
  | "SIGNED"
  | "REJECTED";

export type Signer = {
  id: string;
  name: string;
  email: string;
  order: number;
  status: SignerStatus;
  color: string;
  isOwner?: boolean;
};
