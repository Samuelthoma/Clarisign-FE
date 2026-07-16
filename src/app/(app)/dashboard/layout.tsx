"use client";

import { useEffect, useState } from "react";
import "@/src/styles/globals.css";
import DashboardSidebar from "./components/DashboardSidebar";
import DashboardTopbar from "./components/DashboardTopbar";
import "driver.js/dist/driver.css";
import { startDashboardTour } from "@/lib/tour/dashboardTour";

const STORAGE_KEY = "clarisign:sidebar-collapsed";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [collapsed, setCollapsed] = useState(false);

  // restore the persisted collapse state on mount (client-only to avoid SSR mismatch)
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved !== null) setCollapsed(saved === "true");
  }, []);

  useEffect(() => {
    const hasSeenTour = localStorage.getItem("dashboard-tour");

    if (!hasSeenTour) {
      const timer = setTimeout(() => {
        startDashboardTour();
        localStorage.setItem("dashboard-tour", "true");
      }, 300);

      return () => clearTimeout(timer);
    }
  }, []);

  const toggleSidebar = () => {
    setCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem(STORAGE_KEY, String(next));
      return next;
    });
  };

  return (
    <div className="flex h-screen bg-slate-50 font-sans overflow-hidden selection:bg-indigo-100 selection:text-indigo-900">
      <DashboardSidebar collapsed={collapsed} />

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
          <div className="relative p-6 md:p-10">{children}</div>
        </div>
      </main>
    </div>
  );
}
