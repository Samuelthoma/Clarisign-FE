"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, FileQuestion, Home, PenLine, SearchX } from "lucide-react";

export default function NotFound() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-b from-[var(--secondary)]/50 via-white to-white flex flex-col">
      <div
        className="absolute inset-0 opacity-60"
        aria-hidden
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(110,86,207,0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(110,86,207,0.08) 1px, transparent 1px)",
          backgroundSize: "44px 44px",
          maskImage: "radial-gradient(ellipse 70% 60% at 50% 40%, black 30%, transparent 100%)",
          WebkitMaskImage: "radial-gradient(ellipse 70% 60% at 50% 40%, black 30%, transparent 100%)",
        }}
      />
      <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-[var(--primary)]/25 blur-3xl" aria-hidden />
      <div className="absolute -bottom-32 -right-24 w-[28rem] h-[28rem] rounded-full bg-indigo-400/20 blur-3xl" aria-hidden />

      <header className="relative z-10 max-w-6xl w-full mx-auto px-6 h-16 flex items-center">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="w-8 h-8 rounded-lg bg-[var(--primary)] flex items-center justify-center shadow-sm shadow-[var(--primary)]/40">
            <PenLine className="w-4.5 h-4.5 text-white" />
          </span>
          <span className="font-bold text-lg tracking-tight text-[var(--foreground)]">Clarisign</span>
        </Link>
      </header>

      <section className="relative z-10 flex-1 flex items-center justify-center px-6 pb-16">
        <div className="w-full max-w-xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="relative mx-auto mb-10 w-full max-w-sm"
            aria-hidden
          >
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="bg-white rounded-2xl border border-[var(--border)] shadow-2xl shadow-[var(--primary)]/15 p-6 text-left"
            >
              <div className="flex items-center gap-2.5 mb-5">
                <span className="w-9 h-9 rounded-lg bg-[var(--secondary)]/70 flex items-center justify-center">
                  <FileQuestion className="w-4.5 h-4.5 text-[var(--primary)]" />
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-[var(--foreground)] truncate">this-page.pdf</p>
                  <p className="text-[11px] text-gray-500">Requested just now</p>
                </div>
                <span className="ml-auto shrink-0 text-[10px] font-semibold uppercase tracking-wider text-rose-600 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-full">
                  Not found
                </span>
              </div>
              <div className="space-y-2.5 mb-5">
                <div className="h-2 rounded bg-gray-100 w-full" />
                <div className="h-2 rounded bg-gray-100 w-10/12" />
                <div className="h-2 rounded bg-gray-100 w-7/12" />
              </div>
              <div className="rounded-xl border-2 border-dashed border-gray-200 bg-gray-50/70 px-4 py-3 flex items-center gap-2">
                <SearchX className="w-4 h-4 text-gray-400" />
                <span className="text-xs text-gray-400">Nothing to sign here</span>
              </div>
            </motion.div>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-sm font-semibold uppercase tracking-widest text-[var(--primary)] mb-3"
          >
            Error 404
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="text-3xl md:text-5xl font-extrabold tracking-tight text-[var(--foreground)] mb-4"
          >
            This page{" "}
            <span className="bg-gradient-to-r from-[var(--primary)] to-indigo-500 bg-clip-text text-transparent">
              doesn't exist
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-gray-600 md:text-lg leading-relaxed mb-9"
          >
            The link may be broken, or the page may have been moved or removed.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.25 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3"
          >
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-[var(--primary)] rounded-full shadow-lg shadow-[var(--primary)]/30 hover:opacity-90 hover:-translate-y-0.5 transition"
            >
              <Home className="w-4 h-4" />
              Back to home
            </Link>
            <button
              type="button"
              onClick={() => window.history.back()}
              className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-[var(--foreground)] bg-white/80 backdrop-blur border border-[var(--border)] rounded-full hover:border-[var(--primary)]/40 hover:text-[var(--primary)] transition"
            >
              <ArrowLeft className="w-4 h-4" />
              Go back
            </button>
          </motion.div>
        </div>
      </section>

      <p className="relative z-10 pb-6 text-center text-xs text-gray-400">
        © {new Date().getFullYear()} Clarisign
      </p>
    </main>
  );
}
