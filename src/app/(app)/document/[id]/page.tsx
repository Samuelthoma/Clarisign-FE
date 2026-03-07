"use client";

import DraftWorkspace from "@/src/modules/document/components/workspace/draft-workspace";
import { useParams } from "next/navigation";

export default function Workspace() {
  const params = useParams();
  const documentId = params.id as string;

  return (
    <>
      <DraftWorkspace documentId={documentId} />
    </>
  );
}
