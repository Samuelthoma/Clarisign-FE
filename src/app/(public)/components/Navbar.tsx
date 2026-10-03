"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, PenLine, X } from "lucide-react";

const links = [
  { id: "home", label: "Home" },
  { id: "features", label: "Features" },
  { id: "how-it-works", label: "How It Works" },
  { id: "contact", label: "Contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  const scrollTo = (id: string) => {
    setOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav className="fixed top-0 left-0 w-full bg-white/70 backdrop-blur-xl border-b border-[var(--border)] z-50">
      <div className="mx-auto max-w-6xl px-4 md:px-6 h-16 flex items-center justify-between">
        <button
          onClick={() => scrollTo("home")}
          className="flex items-center gap-2.5"
          aria-label="Clarisign home"
        >
          <span className="w-8 h-8 rounded-lg bg-[var(--primary)] flex items-center justify-center shadow-sm shadow-[var(--primary)]/40">
            <PenLine className="w-4.5 h-4.5 text-white" />
          </span>
          <span className="font-bold text-lg tracking-tight text-[var(--foreground)]">
            Clarisign
          </span>
        </button>

        <div className="hidden md:flex items-center gap-1">
          {links.map((link) => (
            <button
              key={link.id}
              onClick={() => scrollTo(link.id)}
              className="px-3.5 py-2 text-sm font-medium text-gray-600 rounded-full hover:text-[var(--primary)] hover:bg-[var(--secondary)]/60 transition-colors"
            >
              {link.label}
            </button>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          <a
            href="/login"
            className="px-4 py-2 text-sm font-medium text-gray-700 rounded-full hover:text-[var(--primary)] transition-colors"
          >
            Sign in
          </a>
          <a
            href="/register"
            className="px-4.5 py-2 text-sm font-semibold text-white bg-[var(--primary)] rounded-full shadow-md shadow-[var(--primary)]/30 hover:opacity-90 hover:-translate-y-px transition"
          >
            Get started
          </a>
        </div>

        <button
          className="md:hidden p-2 text-gray-700"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close menu" : "Open menu"}
        >
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden overflow-hidden border-t border-[var(--border)] bg-white/95 backdrop-blur-xl"
          >
            <div className="px-4 py-4 flex flex-col gap-1">
              {links.map((link) => (
                <button
                  key={link.id}
                  onClick={() => scrollTo(link.id)}
                  className="px-3 py-2.5 text-left text-sm font-medium text-gray-700 rounded-lg hover:bg-[var(--secondary)]/60 hover:text-[var(--primary)] transition-colors"
                >
                  {link.label}
                </button>
              ))}
              <div className="flex gap-3 pt-3 mt-2 border-t border-[var(--border)]">
                <a
                  href="/login"
                  className="flex-1 px-4 py-2.5 text-center text-sm font-medium text-gray-700 border border-[var(--border)] rounded-full"
                >
                  Sign in
                </a>
                <a
                  href="/register"
                  className="flex-1 px-4 py-2.5 text-center text-sm font-semibold text-white bg-[var(--primary)] rounded-full"
                >
                  Get started
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
