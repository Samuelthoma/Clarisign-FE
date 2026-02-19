"use client";

import { useState } from "react";
import { pdfjs, Document, Page } from "react-pdf";
import {
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  FileText,
  FileQuestion,
  ArrowLeft,
} from "lucide-react";
import Skeleton from "@mui/material/Skeleton";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

interface ViewerProps {
  fileUrl: string | null;
  isLoading?: boolean;
}

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url,
).toString();

function DocumentSkeleton() {
  return (
    <div className="w-[800px] h-[1100px] p-12 bg-white border border-gray-200 flex flex-col gap-6">
      <Skeleton
        variant="rectangular"
        width="33%"
        height={40}
        className="mb-4 rounded-md"
      />

      <div>
        <Skeleton variant="text" width="100%" height={24} />
        <Skeleton variant="text" width="100%" height={24} />
        <Skeleton variant="text" width="92%" height={24} />
        <Skeleton variant="text" width="80%" height={24} />
      </div>

      <div className="mt-2">
        <Skeleton variant="text" width="100%" height={24} />
        <Skeleton variant="text" width="85%" height={24} />
        <Skeleton variant="text" width="100%" height={24} />
        <Skeleton variant="text" width="75%" height={24} />
      </div>

      <Skeleton
        variant="rectangular"
        width="100%"
        height={200}
        className="my-4 rounded-md"
      />

      <div>
        <Skeleton variant="text" width="100%" height={24} />
        <Skeleton variant="text" width="75%" height={24} />
        <Skeleton variant="text" width="85%" height={24} />
      </div>
    </div>
  );
}

export default function Viewer({ fileUrl, isLoading = false }: ViewerProps) {
  const [numPages, setNumPages] = useState<number>();
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [scale, setScale] = useState<number>(1);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
    setNumPages(numPages);
    setPageNumber(1);
  }

  const goToPrevPage = () => {
    setPageNumber((prev) => Math.max(prev - 1, 1));
  };

  const goToNextPage = () => {
    setPageNumber((next) => Math.min(next + 1, numPages || 1));
  };

  const zoomIn = () => setScale((prev) => Math.min(prev + 0.2, 2));
  const zoomOut = () => setScale((prev) => Math.max(prev - 0.2, 0.6));

  return (
    <div className="flex flex-col w-full h-full bg-[#f4f6f8] overflow-hidden">
      <div className="h-14 flex items-center justify-between px-6 bg-white border-b shadow-sm z-10">
        <div className="flex items-center gap-3">
          <FileText size={18} className="text-gray-600" />
          <span className="text-sm font-semibold text-gray-700">
            Document Viewer
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={zoomOut}
            className="p-2 border rounded-md hover:bg-gray-100 transition"
            title="Zoom Out"
          >
            <ZoomOut size={16} />
          </button>

          <div className="text-sm font-medium text-gray-700 min-w-[90px] text-center">
            {Math.round(scale * 100)}%
          </div>

          <button
            onClick={zoomIn}
            className="p-2 border rounded-md hover:bg-gray-100 transition"
            title="Zoom In"
          >
            <ZoomIn size={16} />
          </button>

          <div className="w-px h-6 bg-gray-200 mx-2" />

          <button
            onClick={goToPrevPage}
            disabled={pageNumber <= 1}
            className="p-2 border rounded-md hover:bg-gray-100 disabled:opacity-40 transition"
            title="Previous Page"
          >
            <ChevronLeft size={18} />
          </button>

          <span className="text-sm font-medium text-gray-700 min-w-[110px] text-center">
            Page {pageNumber || 1} / {numPages || "--"}
          </span>

          <button
            onClick={goToNextPage}
            disabled={pageNumber >= (numPages || 1)}
            className="p-2 border rounded-md hover:bg-gray-100 disabled:opacity-40 transition"
            title="Next Page"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto bg-[#f4f6f8] p-6">
        <div className="flex justify-center min-w-0">
          <div className="bg-white border border-gray-300 shadow-xl rounded-md p-4 max-w-full">
            {isLoading ? (
              <DocumentSkeleton />
            ) : (
              <Document
                file={fileUrl}
                onLoadSuccess={onDocumentLoadSuccess}
                loading={<DocumentSkeleton />}
                error={
                  <div className="w-[800px] h-[1100px] flex items-center justify-center text-red-500 border border-red-300 bg-red-50 rounded-md">
                    Failed to load PDF
                  </div>
                }
              >
                <div className="relative border border-gray-200 bg-white min-h-[1100px]">
                  <Page
                    pageNumber={pageNumber}
                    scale={scale}
                    className="block"
                    loading={<DocumentSkeleton />}
                  />
                </div>
              </Document>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
