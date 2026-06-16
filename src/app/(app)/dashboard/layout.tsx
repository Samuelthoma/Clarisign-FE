"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Activity,
  Settings,
  LogOut,
  FileText,
  BadgeCheck,
} from "lucide-react";
import "@/src/styles/globals.css";
import { logoutApi } from "@/lib/api/UserApi";
import { toast } from "sonner";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await logoutApi();
      toast.success("Logged out successfully");
      window.location.href = "/login";
    } catch (err) {
      console.error(err);
      toast.error("Failed to logout");
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="flex h-screen bg-slate-100 font-sans overflow-hidden selection:bg-indigo-100 selection:text-indigo-900">
      <aside className="w-[260px] bg-white border-r border-slate-300 flex flex-col shrink-0 z-10 shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
        <div className="h-[72px] flex items-center gap-3 px-6 border-b border-slate-100">
          <div className="w-8 h-8 bg-linear-to-br from-indigo-600 to-indigo-700 rounded-lg flex items-center justify-center shadow-md shadow-indigo-600/20 ring-1 ring-inset ring-white/20">
            <FileText size={18} className="text-white" strokeWidth={2} />
          </div>
          <span className="font-bold text-slate-900 tracking-tight text-xl">
            Clarisign
          </span>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          <p className="px-3 text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-3">
            Workspace
          </p>

          <Link
            href="/dashboard"
            className={`group w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
              pathname === "/dashboard"
                ? "bg-indigo-50/80 text-indigo-700 ring-1 ring-inset ring-indigo-100/50"
                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
            }`}
          >
            <Home
              size={18}
              strokeWidth={pathname === "/dashboard" ? 2.5 : 2}
              className={
                pathname === "/dashboard"
                  ? "text-indigo-600"
                  : "text-slate-400 group-hover:text-slate-600"
              }
            />
            Dashboard
          </Link>

          <Link
            href="/dashboard/audit"
            className={`group w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
              pathname.includes("/dashboard/audit")
                ? "bg-indigo-50/80 text-indigo-700 ring-1 ring-inset ring-indigo-100/50"
                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
            }`}
          >
            <Activity
              size={18}
              strokeWidth={pathname.includes("/dashboard/audit") ? 2.5 : 2}
              className={
                pathname.includes("/dashboard/audit")
                  ? "text-indigo-600"
                  : "text-slate-400 group-hover:text-slate-600"
              }
            />
            Audit Logs
          </Link>

          <Link
            href="/dashboard/verify"
            className={`group w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
              pathname.includes("/dashboard/verify")
                ? "bg-indigo-50/80 text-indigo-700 ring-1 ring-inset ring-indigo-100/50"
                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
            }`}
          >
            <BadgeCheck
              size={18}
              strokeWidth={pathname.includes("/dashboard/verify") ? 2.5 : 2}
              className={
                pathname.includes("/dashboard/verify")
                  ? "text-indigo-600"
                  : "text-slate-400 group-hover:text-slate-600"
              }
            />
            Verify Document
          </Link>
        </nav>

        <div className="p-4 border-t border-slate-100 space-y-1 bg-slate-50/30">
          <button className="group w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors">
            <Settings
              size={18}
              className="text-slate-400 group-hover:text-slate-600 transition-colors"
            />
            Settings
          </button>
          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="group w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-600 hover:bg-red-50 hover:text-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <LogOut
              size={18}
              className="text-slate-400 group-hover:text-red-500 transition-colors"
            />
            {isLoggingOut ? "Logging out..." : "Log out"}
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        <div className="absolute top-0 left-0 right-0 h-8 bg-linear-to-b from-slate-100/50 to-transparent pointer-events-none z-0" />

        <div className="flex-1 overflow-auto p-8 md:p-12 z-10">{children}</div>
      </main>
    </div>
  );
}
