import { useEffect, useState } from "react";
import { Signer } from "../types";
import {
  addDocumentCollaboratorApi,
  getDocumentCollaboratorsApi,
  removeDocumentCollaboratorApi,
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

      const collaborators: Signer[] = data.collaborators
        .map((c: any) => ({
          id: c.id,
          name: c.name,
          email: c.email,
          order: c.signOrder ?? Number.MAX_SAFE_INTEGER,
          status: c.hasSigned ? "SIGNED" : "DRAFT",
          color: "",
          isOwner: false,
        }))
        .sort((a: any, b: any) => a.order - b.order)
        .map((c: any, index: any) => ({
          ...c,
          order: index + 1,
          color: generateColor(index + 1),
        }));

      setSigners(normalizeSignerOrder([owner, ...collaborators]));
    } catch (error) {
      console.error("Failed to fetch signers:", error);
    } finally {
      setIsLoading(false);
    }

  };

  useEffect(() => {
    fetchSigners();
  }, [documentId]);

  const addSigner = async (email: string) => {
    try {
      await addDocumentCollaboratorApi(email, documentId);
      await fetchSigners();
      toast.success("Collaborator added successfully!");
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

  const removeSigner = async (signerId: string) => {
    try {
      const signer = signers.find((s) => s.id === signerId);

      if (!signer || signer.isOwner) return;

      await removeDocumentCollaboratorApi(documentId, signerId);

      setSigners((prev) =>
        normalizeSignerOrder(prev.filter((s) => s.id !== signerId)),
      );

      toast.success("Collaborator removed successfully!");
    } catch (err: any) {
      toast.error(err.message || "Failed to remove collaborator.");
      console.error(err);
    }
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
