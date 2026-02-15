"use client";

import { useEffect, useState } from "react";
import PanelLayout from "./panels/panel-layout";
import LeftPanel from "./panels/left-panel";
import Viewer from "./panels/viewer";
import RightPanel from "./panels/right-panel";
import { getDocumentFileApi } from "@/lib/api/DocumentApi";

interface Props {
  documentId: string;
}

export default function DraftWorkspace({ documentId }: Props) {
  const [activeTool, setActiveTool] = useState<string | null>(null);
  const [fileUrl, setFileUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchDocument = async () => {
      try {
        const res = await getDocumentFileApi(documentId);
        setFileUrl(res.url);
      } catch (err) {
        console.error(err);
      }
    };

    fetchDocument();
  }, [documentId]);

  return (
    <PanelLayout
      left={<LeftPanel activeTool={activeTool} setActiveTool={setActiveTool} />}
      center={<Viewer fileUrl={fileUrl} />}
      right={<RightPanel />}
    />
  );
}
