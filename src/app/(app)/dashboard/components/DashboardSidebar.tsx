"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  Home,
  Activity,
  BadgeCheck,
  Settings,
  LogOut,
  FileText,
} from "lucide-react";
import { logoutApi } from "@/lib/api/UserApi";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: Home, exact: true },
  { href: "/dashboard/audit", label: "Activity Logs", icon: Activity },
  { href: "/dashboard/verify", label: "Verify Document", icon: BadgeCheck },
];

export default function DashboardSidebar({ collapsed }: { collapsed: boolean }) {
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

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname.includes(href);

  // shared row layout: centered icon when collapsed, icon + label otherwise
  const rowLayout = collapsed ? "justify-center px-0 py-2.5" : "gap-3 px-3 py-2.5";

  return (
    <aside
      className={cn(
        "bg-white border-r border-slate-300 flex flex-col shrink-0 z-10 shadow-[4px_0_24px_rgba(0,0,0,0.02)] transition-[width] duration-300 ease-in-out",
        collapsed ? "w-[76px]" : "w-[260px]",
      )}
    >
      {/* Brand */}
      <div
        className={cn(
          "h-[72px] flex items-center border-b border-slate-100",
          collapsed ? "justify-center px-0" : "gap-3 px-6",
        )}
      >
        <div className="size-9 aspect-square shrink-0 bg-linear-to-br from-indigo-600 to-indigo-700 rounded-lg flex items-center justify-center shadow-md shadow-indigo-600/20 ring-1 ring-inset ring-white/20">
          <FileText size={18} className="text-white" strokeWidth={2} />
        </div>
        {!collapsed && (
          <span className="font-bold text-slate-900 tracking-tight text-xl whitespace-nowrap">
            Clarisign
          </span>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto overflow-x-hidden">
        {!collapsed && (
          <p className="px-3 text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-3">
            Workspace
          </p>
        )}

        {NAV_ITEMS.map(({ href, label, icon: Icon, exact }) => {
          const active = isActive(href, exact);
          return (
            <Link
              key={href}
              href={href}
              title={collapsed ? label : undefined}
              className={cn(
                "group flex items-center rounded-lg text-sm font-semibold transition-all duration-200",
                rowLayout,
                active
                  ? "bg-indigo-50/80 text-indigo-700 ring-1 ring-inset ring-indigo-100/50"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900",
              )}
            >
              <Icon
                size={18}
                strokeWidth={active ? 2.5 : 2}
                className={cn(
                  "shrink-0",
                  active
                    ? "text-indigo-600"
                    : "text-slate-400 group-hover:text-slate-600",
                )}
              />
              {!collapsed && <span className="whitespace-nowrap">{label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Footer actions */}
      <div className="p-3 border-t border-slate-100 space-y-1 bg-slate-50/30">
        <button
          title={collapsed ? "Settings" : undefined}
          className={cn(
            "group w-full flex items-center rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors",
            rowLayout,
          )}
        >
          <Settings
            size={18}
            className="text-slate-400 group-hover:text-slate-600 transition-colors shrink-0"
          />
          {!collapsed && <span className="whitespace-nowrap">Settings</span>}
        </button>

        <button
          onClick={handleLogout}
          disabled={isLoggingOut}
          title={collapsed ? "Log out" : undefined}
          className={cn(
            "group w-full flex items-center rounded-lg text-sm font-medium text-slate-600 hover:bg-red-50 hover:text-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed",
            rowLayout,
          )}
        >
          <LogOut
            size={18}
            className="text-slate-400 group-hover:text-red-500 transition-colors shrink-0"
          />
          {!collapsed && (
            <span className="whitespace-nowrap">
              {isLoggingOut ? "Logging out..." : "Log out"}
            </span>
          )}
        </button>
      </div>
    </aside>
  );
}
