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
  BadgeCheck
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
    <div className="flex h-screen bg-[#f4f6f8] font-sans overflow-hidden">
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col shrink-0">
        <div className="h-16 flex items-center gap-3 px-6 border-b border-gray-100">
          <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center shadow-sm">
            <FileText size={16} className="text-white" />
          </div>
          <span className="font-bold text-gray-900 tracking-tight text-lg">
            Clarisign
          </span>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-2 mt-2">
            Workspace
          </p>

          <Link
            href="/dashboard"
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
              pathname === "/dashboard"
                ? "bg-blue-50 text-blue-700"
                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            }`}
          >
            <Home size={18} />
            Dashboard
          </Link>

          <Link
            href="/dashboard/audit"
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
              pathname.includes("/dashboard/audit")
                ? "bg-blue-50 text-blue-700"
                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            }`}
          >
            <Activity size={18} />
            Audit Logs
          </Link>

          <Link
            href="/dashboard/verify"
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
              pathname.includes("/dashboard/verify")
                ? "bg-blue-50 text-blue-700"
                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            }`}
          >
            <BadgeCheck size={18} />
            Verify Document
          </Link>
        </nav>

        <div className="p-4 border-t border-gray-100 space-y-1">
          <button className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
            <Settings size={18} />
            Settings
          </button>
          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors"
          >
            <LogOut size={18} />
            Log out
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <div className="flex-1 overflow-auto p-8">{children}</div>
      </main>
    </div>
  );
}
