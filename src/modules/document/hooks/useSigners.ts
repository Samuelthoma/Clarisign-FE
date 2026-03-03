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

export function useSigners(initialSigners: Signer[] = []) {
  const [signers, setSigners] = useState<Signer[]>(
    normalizeSignerOrder(initialSigners),
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
    setSigners((prev) =>
      normalizeSignerOrder(prev.filter((s) => s.id !== signerId)),
    );
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
