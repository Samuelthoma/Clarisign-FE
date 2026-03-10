"use client";

import React, { useRef, useState } from "react";
import { pdfjs, Document, Page } from "react-pdf";
import {
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  FileText,
} from "lucide-react";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import DocumentSkeleton from "../ui/DocumentSkeleton";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url,
).toString();

export interface BaseViewerProps {
  fileUrl: string | null;
  isLoading?: boolean;
  pageNumber: number;
  onPageChange: (page: number) => void;
  children?: (props: {
    scale: number;
    pageNumber: number;
    pageContainerRef: React.RefObject<HTMLDivElement | null>;
  }) => React.ReactNode;
}

export default function BaseViewer({
  fileUrl,
  isLoading = false,
  pageNumber,
  onPageChange,
  children,
}: BaseViewerProps) {
  const [numPages, setNumPages] = useState<number>();
  const [scale, setScale] = useState<number>(1);
  const pageContainerRef = useRef<HTMLDivElement | null>(null);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
    setNumPages(numPages);
    onPageChange(1); 
  }

  const goToPrevPage = () => onPageChange(Math.max(pageNumber - 1, 1));
  const goToNextPage = () => onPageChange(Math.min(pageNumber + 1, numPages || 1));
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
          <div className="inline-block bg-white border border-gray-300 shadow-xl rounded-md p-4">
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
                <div
                  ref={pageContainerRef}
                  className="relative border border-gray-200 bg-white"
                >
                  <Page
                    pageNumber={pageNumber}
                    scale={scale}
                    className="block"
                    loading={<DocumentSkeleton />}
                  />
                  
                  {children && children({ scale, pageNumber, pageContainerRef })}
                </div>
              </Document>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}