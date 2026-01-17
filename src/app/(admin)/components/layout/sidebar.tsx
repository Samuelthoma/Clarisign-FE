import { UserPlus, Users } from "lucide-react";
import "@/src/styles/globals.css";
import Link from "next/link";

const menu = [
  {
    label: "Pending Registrations",
    href: "pending-registrations",
    icon: UserPlus,
  },
  {
    label: "User Management",
    href: "user-management",
    icon: Users,
  },
];

export function SideBar() {
  return (
    <aside className="w-64 border-r bg-background p-4">
      <h2 className="mb-6 text-xl font-semibold">Admin Panel</h2>

      <nav className="space-y-1">
        {menu.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className="flex items-center gap-3 rounded-md px-3 py-2 text-sm hover:bg-accent"
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
