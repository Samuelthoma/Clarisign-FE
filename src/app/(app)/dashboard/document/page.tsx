"use client";

import DocumentExplorerComponent from "../components/DocumentExplorer";

export default function DocumentExplorer() {
  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-8">
      <header className="pb-6 border-b border-slate-200 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            Document Explorer
          </h1>
          <p className="text-slate-500 mt-1.5 text-lg font-medium">
            Search, filter, and track the status of all your workspace documents
            in one place
          </p>
        </div>
      </header>

      <main>
        <DocumentExplorerComponent />
      </main>
    </div>
  );
}
