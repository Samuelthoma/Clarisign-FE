export type FieldLayout = {
  userId: string;
  page: number;
  relX: number;
  relY: number;
  relWidth: number;
  relHeight: number;
  type: "TYPED" | "DRAWN";
};

export type SaveDraftPayload = {
  layoutItems: FieldLayout[];
};
