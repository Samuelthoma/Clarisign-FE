"use client";

import { useEffect, useState } from "react";
import PanelLayout from "./panels/panel-layout";
import LeftPanel from "./panels/left-panel";
import RightPanel from "./panels/right-panel";
import { getDocumentFileApi } from "@/lib/api/DocumentApi";
import dynamic from "next/dynamic";
import { ArrowLeft, FileQuestion } from "lucide-react";

interface Props {
  documentId: string;
}

const Viewer = dynamic(() => import("./panels/viewer"), { ssr: false });

export default function DraftWorkspace({ documentId }: Props) {
  const [activeTool, setActiveTool] = useState<string | null>(null);
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchDocument = async () => {
      setIsLoading(true);
      try {
        const res = await getDocumentFileApi(documentId);
        setFileUrl(res.url);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDocument();
  }, [documentId]);

  if (!isLoading && !fileUrl) {
    return (
      <div className="flex flex-col w-full h-full bg-[#f4f6f8] items-center justify-center p-6">
        <div className="flex flex-col items-center bg-white p-10 rounded-xl border border-gray-200 shadow-sm max-w-md text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-6">
            <FileQuestion size={32} className="text-gray-400" />
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">
            Document Not Found
          </h2>
          <p className="text-gray-500 text-sm mb-8">
            The file you are looking for doesn't exist, was deleted, or the URL
            is incorrect.
          </p>
          <button
            onClick={() => {
              navigation.navigate("/dashboard");
            }}
            className="flex items-center gap-2 bg-gray-900 hover:bg-gray-800 text-white px-5 py-2.5 rounded-md font-medium transition"
          >
            <ArrowLeft size={18} />
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      {!isLoading && (
        <PanelLayout
          left={
            <LeftPanel activeTool={activeTool} setActiveTool={setActiveTool} />
          }
          center={<Viewer fileUrl={fileUrl} isLoading={isLoading} />}
          right={<RightPanel />}
        />
      )}
    </div>
  );
}
