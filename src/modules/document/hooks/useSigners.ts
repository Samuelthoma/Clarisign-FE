import { useEffect, useState } from "react";
import { Signer } from "../types";
import {
  addDocumentCollaboratorApi,
  getDocumentCollaboratorsApi,
} from "@/lib/api/DocumentApi";
import { toast } from "sonner";

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

export function useSigners(documentId: string) {
  const [signers, setSigners] = useState<Signer[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchSigners = async () => {
    try {
      const data = await getDocumentCollaboratorsApi(documentId);

      const owner: Signer = {
        id: data.owner.id,
        name: data.owner.name,
        email: data.owner.email,
        order: 0,
        status: "DRAFT",
        isOwner: true,
        color: generateColor(0),
      };

      const collaborators: Signer[] = data.collaborators.map(
        (c: any, index: number) => ({
          id: c.id,
          name: c.name,
          email: c.email,
          order: c.signOrder ?? index + 1,
          status: c.hasSigned ? "SIGNED" : "DRAFT",
          color: generateColor(index + 1),
          isOwner: false,
        }),
      );

      setSigners(normalizeSignerOrder([owner, ...collaborators]));
    } catch (error) {
      console.error("Failed to fetch signers:", error);
    } finally {
      setIsLoading(false);
    }

    console.log(signers);
  };

  useEffect(() => {
    fetchSigners();
  }, [documentId]);

  const addSigner = async (email: string) => {
    try {
      await addDocumentCollaboratorApi(email, documentId);
      await fetchSigners();
    } catch (error: any) {
      console.error("Failed to add signer:", error);

      let errorMessage = "Failed to add signer";

      try {
        const parsed = JSON.parse(error.message);

        errorMessage = parsed?.errors?.email || parsed?.message || errorMessage;
      } catch {
        errorMessage = error.message || errorMessage;
      }

      toast.error(errorMessage);
    }
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
