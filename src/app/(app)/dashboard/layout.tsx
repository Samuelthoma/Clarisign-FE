"use client";

import { useEffect, useState } from "react";
import "@/src/styles/globals.css";
import DashboardSidebar from "./components/DashboardSidebar";
import DashboardTopbar from "./components/DashboardTopbar";
import "driver.js/dist/driver.css";
import { startDashboardTour } from "@/lib/tour/dashboardTour";

const STORAGE_KEY = "clarisign:sidebar-collapsed";

const DESKTOP_QUERY = "(min-width: 768px)";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(true);

  // restore the persisted collapse state on mount (client-only to avoid SSR mismatch)
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved !== null) setCollapsed(saved === "true");
  }, []);

  useEffect(() => {
    const query = window.matchMedia(DESKTOP_QUERY);

    const sync = () => {
      setIsDesktop(query.matches);
      if (query.matches) setMobileOpen(false);
    };

    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (!mobileOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMobileOpen(false);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [mobileOpen]);

  useEffect(() => {
    const hasSeenTour = localStorage.getItem("dashboard-tour");

    if (!hasSeenTour) {
      const timer = setTimeout(() => {

        if (!window.matchMedia(DESKTOP_QUERY).matches) return;

        startDashboardTour();
        localStorage.setItem("dashboard-tour", "true");
      }, 300);

      return () => clearTimeout(timer);
    }
  }, []);

  const toggleSidebar = () => {
    if (!isDesktop) {
      setMobileOpen((prev) => !prev);
      return;
    }

    setCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem(STORAGE_KEY, String(next));
      return next;
    });
  };

  return (
    <div className="flex h-dvh bg-slate-50 font-sans overflow-hidden selection:bg-indigo-100 selection:text-indigo-900">
      <DashboardSidebar
        collapsed={collapsed}
        mobileOpen={mobileOpen}
        onNavigate={() => setMobileOpen(false)}
      />

      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          aria-hidden
          className="fixed inset-0 z-40 bg-slate-900/40 md:hidden"
        />
      )}

      <main className="flex-1 flex flex-col min-w-0 overflow-hidden bg-slate-50">
        <DashboardTopbar
          collapsed={collapsed}
          onToggleSidebar={toggleSidebar}
        />
        <div className="relative flex-1 overflow-auto">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 h-72"
            style={{
              background:
                "radial-gradient(70% 60% at 50% 0%, rgba(99,102,241,0.05), rgba(99,102,241,0) 100%)",
            }}
          />
          <div className="relative p-4 sm:p-6 md:p-10">{children}</div>
        </div>
      </main>
    </div>
  );
}
