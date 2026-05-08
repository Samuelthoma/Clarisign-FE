export type FieldLayout = {
  userId: string;
  page: number;
  relX: number;
  relY: number;
  relWidth: number;
  relHeight: number;
  type: "TYPED" | "DRAWN";
};

export type SignerOrder = {
  userId: string;
  order: number;
};

export type SaveDraftPayload = {
  layoutItems: FieldLayout[];
  signerOrders: SignerOrder[];
};
