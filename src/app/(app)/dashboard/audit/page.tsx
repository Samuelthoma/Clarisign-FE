"use client";

import ActivityLogTable from "@/src/modules/document/components/ui/ActivityLogTable";

export default function ActivityLogPage() {
  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-8">
      <header className="pb-6 border-b border-slate-200 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            User Audit Log
          </h1>
          <p className="text-slate-500 mt-1.5 text-lg font-medium">
            Monitor workspace activity, track document lifecycle events, and
            review user actions for security and compliance.
          </p>
        </div>
      </header>

      <main>
        <ActivityLogTable />
      </main>
    </div>
  );
}
