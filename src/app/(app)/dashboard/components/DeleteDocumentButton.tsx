"use client";

import { useState } from "react";
import { Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { deleteDocumentApi } from "@/lib/api/DocumentApi";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function DeleteDocumentButton({
  documentId,
  documentName,
  onDeleted,
}: {
  documentId: string;
  documentName: string;
  onDeleted: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    try {
      setDeleting(true);
      await deleteDocumentApi(documentId);
      toast.success("Draft deleted.");
      setOpen(false);
      onDeleted();
    } catch (err: any) {
      toast.error(err?.message || "Failed to delete the document.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <button
        type="button"
        title="Delete draft"
        aria-label="Delete draft"
        onClick={(e) => {
          e.stopPropagation();
          setOpen(true);
        }}
        className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium text-rose-600 bg-rose-50 border border-rose-100 hover:bg-rose-100 hover:text-rose-700 transition-colors focus:outline-none focus:ring-2 focus:ring-rose-500/40"
      >
        <Trash2 size={14} strokeWidth={2} />
        <span className="hidden sm:inline">Delete</span>
      </button>

      <AlertDialog open={open} onOpenChange={(next) => !deleting && setOpen(next)}>
        <AlertDialogContent onClick={(e) => e.stopPropagation()}>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this draft?</AlertDialogTitle>
            <AlertDialogDescription>
              &ldquo;{documentName}&rdquo; and its uploaded file will be permanently
              removed. This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              disabled={deleting}
              onClick={(e) => {
                e.preventDefault();
                handleDelete();
              }}
            >
              {deleting ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
