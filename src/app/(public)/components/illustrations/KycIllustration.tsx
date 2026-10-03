"use client";

import { motion } from "framer-motion";
import { CheckCircle2, IdCard, KeyRound, ScanFace, ShieldCheck } from "lucide-react";

const checks = [
  { label: "ID card read", sub: "NIK, name and birth date extracted" },
  { label: "Liveness passed", sub: "Real person, not a photo" },
  { label: "Face matched", sub: "Selfie matches the ID photo" },
];

export default function KycIllustration() {
  return (
    <div className="relative w-full max-w-md" aria-hidden>
      <div className="bg-white rounded-2xl border border-[var(--border)] shadow-2xl shadow-[var(--primary)]/15 p-6 md:p-7">
        <div className="flex items-center gap-2.5 mb-6">
          <span className="w-9 h-9 rounded-lg bg-[var(--secondary)]/70 flex items-center justify-center">
            <ShieldCheck className="w-4.5 h-4.5 text-[var(--primary)]" />
          </span>
          <div>
            <p className="text-sm font-bold text-[var(--foreground)]">Identity verification</p>
            <p className="text-[11px] text-gray-500">Required before anyone can sign</p>
          </div>
          <span className="ml-auto text-[10px] font-semibold uppercase tracking-wider text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
            Verified
          </span>
        </div>

        <div className="grid grid-cols-[1.35fr_1fr] gap-3 mb-6">
          <div className="rounded-xl border border-[var(--border)] overflow-hidden">
            <div className="bg-gradient-to-r from-[var(--primary)] to-indigo-500 px-3 py-1.5 flex items-center gap-1.5">
              <IdCard className="w-3.5 h-3.5 text-white" />
              <span className="text-[9px] font-bold tracking-wider text-white uppercase">Identity card</span>
            </div>
            <div className="p-3 flex gap-2.5">
              <div className="w-10 h-12 rounded-md bg-[var(--secondary)]/70 shrink-0" />
              <div className="flex-1 space-y-1.5 pt-0.5">
                <p className="text-[9px] font-mono font-semibold text-[var(--foreground)] tracking-wide whitespace-nowrap">
                  3200 •••• •••• 0001
                </p>
                <div className="h-1.5 rounded bg-gray-100 w-full" />
                <div className="h-1.5 rounded bg-gray-100 w-3/4" />
                <div className="h-1.5 rounded bg-gray-100 w-5/6" />
              </div>
            </div>
          </div>

          <div className="relative rounded-xl border border-[var(--border)] bg-[var(--secondary)]/25 flex items-center justify-center overflow-hidden">
            <motion.span
              animate={{ scale: [1, 1.18, 1], opacity: [0.5, 0, 0.5] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: "easeOut" }}
              className="absolute w-16 h-16 rounded-full border-2 border-[var(--primary)]/50"
            />
            <span className="relative w-14 h-14 rounded-full bg-white border border-[var(--primary)]/30 flex items-center justify-center">
              <ScanFace className="w-7 h-7 text-[var(--primary)]" />
            </span>
            <motion.span
              animate={{ top: ["12%", "82%", "12%"] }}
              transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
              className="absolute left-3 right-3 h-0.5 rounded-full bg-gradient-to-r from-transparent via-[var(--primary)] to-transparent"
            />
          </div>
        </div>

        <motion.ul
          className="space-y-3.5"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{ visible: { transition: { staggerChildren: 0.35, delayChildren: 0.3 } } }}
        >
          {checks.map((check) => (
            <motion.li
              key={check.label}
              variants={{
                hidden: { opacity: 0, x: -10 },
                visible: { opacity: 1, x: 0, transition: { duration: 0.4 } },
              }}
              className="flex items-start gap-3"
            >
              <CheckCircle2 className="w-5 h-5 mt-0.5 text-emerald-500 shrink-0" />
              <div>
                <p className="text-sm font-semibold text-[var(--foreground)]">{check.label}</p>
                <p className="text-[11px] text-gray-500">{check.sub}</p>
              </div>
            </motion.li>
          ))}
        </motion.ul>
      </div>

      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -bottom-5 -right-3 md:-right-6 flex items-center gap-2.5 bg-white rounded-xl border border-[var(--border)] shadow-xl px-4 py-3"
      >
        <span className="w-9 h-9 rounded-full bg-[var(--secondary)] flex items-center justify-center">
          <KeyRound className="w-4.5 h-4.5 text-[var(--primary)]" />
        </span>
        <div>
          <p className="text-xs font-bold text-[var(--foreground)]">Signing keys issued</p>
          <p className="text-[10px] text-gray-500">Unique to this identity</p>
        </div>
      </motion.div>
    </div>
  );
}
