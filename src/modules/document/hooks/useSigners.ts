import { useState } from "react";
import { Signer } from "../types";

const generateColor = (index: number) => {
  const palette = ["#2563eb", "#16a34a", "#dc2626", "#9333ea", "#ea580c"];
  return palette[index % palette.length];
};

const normalizeSignerOrder = (signers: Signer[]): Signer[] => {
  return signers.map((signer, index) => ({
    ...signer,
    order: index + 1,
  }));
};

export function useSigners() {
  const ownerSigner: Signer = {
    id: "Sam",
    name: "Samuel Thomas",
    email: "samuelthomas183@gmail.com",
    order: 0,
    status: "DRAFT",
    color: generateColor(0),
    isOwner: true,
  };

  const [signers, setSigners] = useState<Signer[]>(
    normalizeSignerOrder([ownerSigner]),
  );

  const addSigner = (name: string, email: string) => {
    setSigners((prev) => {
      const newSigner: Signer = {
        id: crypto.randomUUID(),
        name,
        email,
        order: 0,
        status: "DRAFT",
        color: generateColor(prev.length),
      };

      return normalizeSignerOrder([...prev, newSigner]);
    });
  };

  const removeSigner = (signerId: string) => {
    setSigners((prev) => {
      const signer = prev.find((s) => s.id === signerId);
      if (!signer || signer.isOwner) return prev;

      return normalizeSignerOrder(prev.filter((s) => s.id !== signerId));
    });
  };

  const reorderSigners = (newOrder: Signer[]) => {
    setSigners(normalizeSignerOrder(newOrder));
  };

  return {
    signers,
    addSigner,
    removeSigner,
    reorderSigners,
  };
}
