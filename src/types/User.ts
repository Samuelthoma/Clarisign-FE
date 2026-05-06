export type User = {
  id: string;
  email: string;
  name: string;
};

export type PendingUser = {
    id: string
    username: string
    fullName: string
    email: string
    requestedAt: string
    confidence: number
}