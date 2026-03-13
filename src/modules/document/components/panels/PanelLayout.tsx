"use client";

import { useState } from "react";
import { PanelLeft, PanelRight } from "lucide-react";
import "@/src/styles/globals.css";

interface PanelLayoutProps {
  center: React.ReactNode;
  
  left?: React.ReactNode;
  leftTitle?: string;
  leftIcon?: React.ReactNode;

  right?: React.ReactNode;
  rightTitle?: string;
  rightIcon?: React.ReactNode;
}

export default function PanelLayout({
  center,
  left,
  leftTitle = "Left Panel",
  leftIcon = <PanelLeft size={18} />,
  right,
  rightTitle = "Right Panel",
  rightIcon = <PanelRight size={18} />,
}: PanelLayoutProps) {
  const [leftOpen, setLeftOpen] = useState(true);
  const [rightOpen, setRightOpen] = useState(true);

  return (
    <div className="flex h-[calc(100vh-64px)] bg-[#f4f6f8] overflow-hidden">
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

      <div className="flex-1 min-w-0 flex items-center justify-center overflow-auto no-scrollbar relative">
        {center}
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
  );
}