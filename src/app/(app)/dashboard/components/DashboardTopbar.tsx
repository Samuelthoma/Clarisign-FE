"use client";

import { usePathname } from "next/navigation";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { useAuthStore } from "@/src/store/AuthStore";

const TITLES: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/dashboard/audit": "Activity Logs",
  "/dashboard/verify": "Verify Document",
};

function getTitle(pathname: string): string {
  if (TITLES[pathname]) return TITLES[pathname];

  // longest-prefix match for nested routes (ignore the bare /dashboard root)
  const match = Object.keys(TITLES)
    .filter((p) => p !== "/dashboard" && pathname.startsWith(p))
    .sort((a, b) => b.length - a.length)[0];

  return match ? TITLES[match] : "Dashboard";
}

function getInitials(name?: string, email?: string): string {
  const base = name?.trim() || email?.split("@")[0] || "U";
  const parts = base.split(/[\s._-]+/).filter(Boolean);
  const chars = (parts[0]?.[0] ?? "") + (parts[1]?.[0] ?? "");
  return (chars || base[0] || "U").toUpperCase();
}

export default function DashboardTopbar({
  collapsed,
  onToggleSidebar,
}: {
  collapsed: boolean;
  onToggleSidebar: () => void;
}) {
  const pathname = usePathname();
  const user = useAuthStore((s) => s.user);
  const title = getTitle(pathname);

  return (
    <header className="h-[72px] shrink-0 bg-white/80 backdrop-blur-sm border-b border-slate-200 flex items-center justify-between px-4 md:px-6 z-20">
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onToggleSidebar}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-colors"
        >
          {collapsed ? (
            <PanelLeftOpen size={18} />
          ) : (
            <PanelLeftClose size={18} />
          )}
        </button>

        <div className="h-6 w-px bg-slate-200 hidden sm:block" />

        <h1 className="text-lg font-bold text-slate-900 tracking-tight truncate">
          {title}
        </h1>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden sm:flex flex-col items-end leading-tight">
          <span className="text-sm font-semibold text-slate-800 truncate max-w-[200px]">
            {user?.name || "Welcome"}
          </span>
          <span className="text-xs text-slate-400 truncate max-w-[200px]">
            {user?.email || "Not signed in"}
          </span>
        </div>
        <div className="w-9 h-9 rounded-full bg-linear-to-br from-indigo-500 to-indigo-700 text-white flex items-center justify-center text-xs font-bold shadow-sm ring-1 ring-inset ring-white/20 shrink-0">
          {getInitials(user?.name, user?.email)}
        </div>
      </div>
    </header>
  );
}
