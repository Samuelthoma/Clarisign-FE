"use client";

import { useState } from "react";
import Link from "next/link";
import { PanelLeft, PanelRight, ArrowLeft } from "lucide-react";
import "@/src/styles/globals.css";

interface PanelLayoutProps {
  center: React.ReactNode;
  left?: React.ReactNode;
  leftTitle?: string;
  leftIcon?: React.ReactNode;

  right?: React.ReactNode;
  rightTitle?: string;
  rightIcon?: React.ReactNode;

  /** Optional document title shown in the header bar. */
  title?: string;
  /** Optional right-aligned actions in the header bar. */
  headerActions?: React.ReactNode;
}

export default function PanelLayout({
  center,
  left,
  leftTitle = "Left Panel",
  leftIcon = <PanelLeft size={18} />,
  right,
  rightTitle = "Right Panel",
  rightIcon = <PanelRight size={18} />,
  title,
  headerActions,
}: PanelLayoutProps) {
  const [leftOpen, setLeftOpen] = useState(true);
  const [rightOpen, setRightOpen] = useState(true);

  return (
    <div className="flex flex-col h-screen bg-[#f4f6f8] overflow-hidden">
      {/* Header bar — holds the back button, document title, and any actions */}
      <header className="h-16 shrink-0 bg-white border-b border-gray-200 flex items-center justify-between gap-4 px-4 z-30">
        <div className="flex items-center gap-3 min-w-0">
          <Link
            href="/dashboard"
            className="group inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-600 transition-all duration-200 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-900"
          >
            <ArrowLeft
              size={16}
              className="text-gray-500 transition-all duration-200 group-hover:-translate-x-0.5 group-hover:text-primary"
            />
            <span className="hidden sm:inline">Back to Dashboard</span>
          </Link>

          {title && (
            <>
              <div className="hidden h-6 w-px bg-gray-200 sm:block" />
              <h1 className="truncate text-sm font-semibold text-gray-800 max-w-[40vw]">
                {title}
              </h1>
            </>
          )}
        </div>

        {headerActions && (
          <div className="flex shrink-0 items-center gap-2">{headerActions}</div>
        )}
      </header>

      {/* Body — left panel / center / right panel */}
      <div className="flex flex-1 min-h-0 overflow-hidden">
        {left && (
          <>
            <div
              className={`transition-all duration-300 bg-white border-r flex flex-col ${
                leftOpen ? "w-[280px]" : "w-[60px]"
              }`}
            >
              <div className="flex items-center justify-center h-12 border-b min-h-12">
                <button
                  onClick={() => setLeftOpen(!leftOpen)}
                  className="flex items-center gap-2 text-xs text-gray-500 hover:text-black transition"
                  title={leftOpen ? "Collapse" : "Expand"}
                >
                  {leftIcon}
                  {leftOpen && (
                    <span className="uppercase tracking-wider text-black whitespace-nowrap overflow-hidden">
                      {leftTitle}
                    </span>
                  )}
                </button>
              </div>

              <div
                className={`flex-1 overflow-hidden transition-opacity duration-200 ${
                  leftOpen ? "opacity-100 p-4" : "opacity-0 pointer-events-none"
                }`}
              >
                {left}
              </div>
            </div>
            <div className="w-px bg-gray-300 shrink-0" />
          </>
        )}

        <div className="flex-1 min-w-0 relative flex flex-col h-full">
          <div className="flex-1 overflow-auto no-scrollbar flex items-center justify-center">
            {center}
          </div>
        </div>

        {right && (
          <>
            <div className="w-px bg-gray-300 shrink-0" />
            <div
              className={`transition-all duration-300 bg-white border-l flex flex-col ${
                rightOpen ? "w-[320px]" : "w-[60px]"
              }`}
            >
              <div className="flex items-center justify-center h-12 border-b min-h-12">
                <button
                  onClick={() => setRightOpen(!rightOpen)}
                  className="flex items-center gap-2 text-xs text-gray-500 hover:text-black transition"
                  title={rightOpen ? "Collapse" : "Expand"}
                >
                  {rightIcon}
                  {rightOpen && (
                    <span className="uppercase tracking-wider text-black whitespace-nowrap overflow-hidden">
                      {rightTitle}
                    </span>
                  )}
                </button>
              </div>

              <div
                className={`flex-1 overflow-hidden transition-opacity duration-200 ${
                  rightOpen ? "opacity-100 p-4" : "opacity-0 pointer-events-none"
                }`}
              >
                {right}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
