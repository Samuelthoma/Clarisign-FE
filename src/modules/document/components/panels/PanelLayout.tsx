"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { PanelLeft, PanelRight, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import "@/src/styles/globals.css";

const DESKTOP_QUERY = "(min-width: 1024px)";

interface PanelLayoutProps {
  center: React.ReactNode;
  left?: React.ReactNode;
  leftTitle?: string;
  leftIcon?: React.ReactNode;

  right?: React.ReactNode;
  rightTitle?: string;
  rightIcon?: React.ReactNode;

  title?: string;
  headerActions?: React.ReactNode;
}

function PanelToggle({
  open,
  onClick,
  icon,
  label,
}: {
  open: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      aria-expanded={open}
      aria-label={`${open ? "Hide" : "Show"} ${label}`}
      title={`${open ? "Hide" : "Show"} ${label}`}
      className={cn(
        "inline-flex shrink-0 items-center gap-2 rounded-lg border px-2.5 py-2 text-xs font-medium transition-colors",
        open
          ? "border-primary/30 bg-primary/5 text-primary"
          : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50 hover:text-gray-900",
      )}
    >
      {icon}
      <span className="hidden uppercase tracking-wider lg:inline">{label}</span>
    </button>
  );
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

  useEffect(() => {
    const query = window.matchMedia(DESKTOP_QUERY);

    const sync = () => {
      setLeftOpen(query.matches);
      setRightOpen(query.matches);
    };

    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);

  const togglePanel = (side: "left" | "right") => {
    const isDesktop = window.matchMedia(DESKTOP_QUERY).matches;

    if (side === "left") {
      const next = !leftOpen;
      setLeftOpen(next);
      if (next && !isDesktop) setRightOpen(false);
      return;
    }

    const next = !rightOpen;
    setRightOpen(next);
    if (next && !isDesktop) setLeftOpen(false);
  };

  const overlayOpen = leftOpen || rightOpen;

  return (
    <div className="flex flex-col h-dvh bg-[#f4f6f8] overflow-hidden">

      <header className="h-16 shrink-0 bg-white border-b border-gray-200 flex items-center justify-between gap-2 sm:gap-4 px-3 sm:px-4 z-30">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <Link
            href="/dashboard"
            className="group inline-flex shrink-0 items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-600 transition-all duration-200 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-900"
          >
            <ArrowLeft
              size={16}
              className="text-gray-500 transition-all duration-200 group-hover:-translate-x-0.5 group-hover:text-primary"
            />
            <span className="hidden sm:inline">Back to Dashboard</span>
          </Link>

          {left && (
            <PanelToggle
              open={leftOpen}
              onClick={() => togglePanel("left")}
              icon={leftIcon}
              label={leftTitle}
            />
          )}

          {title && (
            <>
              <div className="hidden h-6 w-px bg-gray-200 sm:block" />
              <h1 className="truncate text-sm font-semibold text-gray-800 max-w-[30vw]">
                {title}
              </h1>
            </>
          )}
        </div>

        <div className="flex shrink-0 items-center gap-2">
          {headerActions}
          {right && (
            <PanelToggle
              open={rightOpen}
              onClick={() => togglePanel("right")}
              icon={rightIcon}
              label={rightTitle}
            />
          )}
        </div>
      </header>

      <div className="relative flex flex-1 min-h-0 overflow-hidden">
        {left && (
          <aside
            className={cn(
              "bg-white flex flex-col z-40",
              "fixed inset-y-0 top-16 left-0 w-[280px] max-w-[85vw] border-r transition-transform duration-300 ease-in-out",
              leftOpen ? "translate-x-0" : "-translate-x-full",

              "lg:static lg:top-0 lg:z-auto lg:max-w-none lg:translate-x-0 lg:shrink-0 lg:overflow-hidden lg:transition-[width]",
              leftOpen ? "lg:w-[280px] lg:border-r" : "lg:w-0 lg:border-r-0",
            )}
          >
            <div className="flex-1 overflow-auto p-4">{left}</div>
          </aside>
        )}

        <div className="flex-1 min-w-0 relative flex flex-col h-full">
          <div className="flex-1 overflow-auto flex items-center-safe justify-center-safe p-2 sm:p-4">
            {center}
          </div>
        </div>

        {right && (
          <aside
            className={cn(
              "bg-white flex flex-col z-40",
              "fixed inset-y-0 top-16 right-0 w-[320px] max-w-[85vw] border-l transition-transform duration-300 ease-in-out",
              rightOpen ? "translate-x-0" : "translate-x-full",
              "lg:static lg:top-0 lg:z-auto lg:max-w-none lg:translate-x-0 lg:shrink-0 lg:overflow-hidden lg:transition-[width]",
              rightOpen ? "lg:w-[320px] lg:border-l" : "lg:w-0 lg:border-l-0",
            )}
          >
            <div className="flex-1 overflow-auto p-4">{right}</div>
          </aside>
        )}

        {overlayOpen && (
          <div
            onClick={() => {
              setLeftOpen(false);
              setRightOpen(false);
            }}
            aria-hidden
            className="fixed inset-0 top-16 z-30 bg-slate-900/40 lg:hidden"
          />
        )}
      </div>
    </div>
  );
}
