import { SideBar } from "./components/layout/sidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen">
      <SideBar />
      <main className="flex-1 p-6 overflow-y-auto bg-muted/40">{children}</main>
    </div>
  );
}
