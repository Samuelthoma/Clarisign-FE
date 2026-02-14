"use client";

import { useState } from "react";
import { PanelLeft, PanelRight } from "lucide-react";
import "@/src/styles/globals.css";

interface PanelLayoutProps {
  left: React.ReactNode;
  center: React.ReactNode;
  right: React.ReactNode;
}

export default function PanelLayout({ left, center, right }: PanelLayoutProps) {
  const [leftOpen, setLeftOpen] = useState(true);
  const [rightOpen, setRightOpen] = useState(true);

  return (
    <div className="flex h-[calc(100vh-64px)] bg-[#f4f6f8] overflow-hidden">
      <div
        className={`transition-all duration-300 bg-white border-r flex flex-col ${
          leftOpen ? "w-[280px]" : "w-[60px]"
        }`}
      >
        <div className="flex items-center justify-center h-12 border-b">
          <button
            onClick={() => setLeftOpen(!leftOpen)}
            className="flex items-center gap-2 text-xs text-gray-500 hover:text-black transition"
          >
            <PanelLeft size={18} />
            {leftOpen && (
              <span className="uppercase tracking-wider text-gray-400">
                Fields
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

      <div className="w-px bg-gray-300" />

      <div className="flex-1 min-w-0 flex items-center justify-center overflow-auto no-scrollbar p-6">
        {center}
      </div>

      <div className="w-px bg-gray-300" />

      <div
        className={`transition-all duration-300 bg-white border-l flex flex-col ${
          rightOpen ? "w-[320px]" : "w-[60px]"
        }`}
      >
        <div className="flex items-center justify-center h-12 border-b">
          <button
            onClick={() => setRightOpen(!rightOpen)}
            className="flex items-center gap-2 text-xs text-gray-500 hover:text-black transition"
          >
            <PanelRight size={18} />
            {rightOpen && (
              <span className="uppercase tracking-wider text-gray-400">
                Collaborator
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
    </div>
  );
}
