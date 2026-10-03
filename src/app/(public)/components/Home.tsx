"use client";

import { motion } from "framer-motion";
import { ArrowRight, BadgeCheck, Fingerprint, Lock, ShieldCheck } from "lucide-react";

const trustChips = [
  { icon: Lock, label: "AES-256-GCM encryption" },
  { icon: Fingerprint, label: "KYC + liveness onboarding" },
  { icon: ShieldCheck, label: "Ed25519 signatures" },
];

export default function HomeSection() {
  const scrollTo = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <section
      id="home"
      className="relative overflow-hidden bg-gradient-to-b from-[var(--secondary)]/40 via-white to-white px-6 pt-32 pb-20 md:pt-40 md:pb-28"
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.4 }}
        transition={{ duration: 1.2 }}
        className="absolute inset-0"
        aria-hidden
      >
        <motion.div
          animate={{ x: ["0%", "-6%"], y: ["0%", "-6%"] }}
          transition={{ duration: 18, repeat: Infinity, repeatType: "mirror", ease: "linear" }}
          className="w-[200%] h-[200%]"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(110,86,207,0.10) 1px, transparent 1px), linear-gradient(to bottom, rgba(110,86,207,0.10) 1px, transparent 1px)",
            backgroundSize: "44px 44px",
            maskImage: "radial-gradient(ellipse 80% 60% at 50% 35%, black 40%, transparent 100%)",
            WebkitMaskImage:
              "radial-gradient(ellipse 80% 60% at 50% 35%, black 40%, transparent 100%)",
          }}
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.3, scale: 1 }}
        transition={{ duration: 1.2 }}
        className="absolute -top-20 -left-20 w-96 h-96 bg-[var(--primary)] rounded-full blur-3xl"
        aria-hidden
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.2, scale: 1 }}
        transition={{ duration: 1.4 }}
        className="absolute bottom-0 -right-24 w-[28rem] h-[28rem] bg-indigo-400 rounded-full blur-3xl"
        aria-hidden
      />

      <div className="relative z-10 max-w-6xl mx-auto grid lg:grid-cols-[1.1fr_0.9fr] gap-14 lg:gap-10 items-center">
        <div className="text-center lg:text-left">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 mb-6 rounded-full border border-[var(--primary)]/25 bg-white/70 backdrop-blur text-xs font-medium text-[var(--secondary-foreground)] shadow-sm"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-[var(--primary)]" />
            Identity-verified digital signatures
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="text-4xl md:text-6xl font-extrabold tracking-tight leading-[1.08] mb-5 text-[var(--foreground)]"
          >
            Sign documents with{" "}
            <span className="bg-gradient-to-r from-[var(--primary)] via-indigo-500 to-[var(--primary)] bg-clip-text text-transparent">
              cryptographic certainty
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="text-gray-600 text-lg md:text-xl leading-relaxed max-w-xl mx-auto lg:mx-0 mb-8"
          >
            Every signer is KYC-verified, every document is encrypted end to end, and
            every signature can be proven in seconds — all in one elegant workflow.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 mb-10"
          >
            <a
              href="/register"
              className="group inline-flex items-center gap-2 px-6 py-3.5 text-sm md:text-base font-semibold text-white bg-[var(--primary)] rounded-full shadow-lg shadow-[var(--primary)]/35 hover:opacity-90 hover:-translate-y-0.5 transition"
            >
              Get started free
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </a>
            <button
              onClick={() => scrollTo("how-it-works")}
              className="inline-flex items-center gap-2 px-6 py-3.5 text-sm md:text-base font-semibold text-[var(--foreground)] bg-white/80 backdrop-blur border border-[var(--border)] rounded-full hover:border-[var(--primary)]/40 hover:text-[var(--primary)] transition"
            >
              See how it works
            </button>
          </motion.div>

          <motion.ul
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-wrap items-center justify-center lg:justify-start gap-x-5 gap-y-2.5"
          >
            {trustChips.map(({ icon: Icon, label }) => (
              <li key={label} className="flex items-center gap-1.5 text-xs md:text-sm text-gray-500">
                <Icon className="w-4 h-4 text-[var(--primary)]" />
                {label}
              </li>
            ))}
          </motion.ul>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="relative mx-auto w-full max-w-md lg:max-w-none"
          aria-hidden
        >
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="relative bg-white rounded-2xl border border-[var(--border)] shadow-2xl shadow-[var(--primary)]/15 p-6 md:p-8"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[var(--primary)]" />
                <span className="text-sm font-semibold text-[var(--foreground)]">
                  Partnership-Agreement.pdf
                </span>
              </div>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                In signing
              </span>
            </div>

            <div className="space-y-2.5 mb-7">
              <div className="h-2 rounded bg-gray-100 w-full" />
              <div className="h-2 rounded bg-gray-100 w-11/12" />
              <div className="h-2 rounded bg-gray-100 w-4/6" />
              <div className="h-2 rounded bg-gray-100 w-9/12" />
            </div>

            <div className="rounded-xl border-2 border-dashed border-[var(--primary)]/40 bg-[var(--secondary)]/30 px-5 py-4">
              <p className="text-[10px] uppercase tracking-wider font-semibold text-[var(--secondary-foreground)] mb-1">
                Signature
              </p>
              <svg viewBox="0 0 220 48" className="w-40 h-10" fill="none">
                <motion.path
                  d="M8 36 C 28 10, 42 8, 50 24 C 56 36, 64 38, 74 26 C 84 14, 92 16, 98 28 C 104 38, 116 40, 130 24 C 142 11, 158 10, 168 22 C 176 31, 196 34, 212 18"
                  stroke="var(--primary)"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{
                    duration: 2.2,
                    delay: 1,
                    repeat: Infinity,
                    repeatDelay: 4,
                  }}
                />
              </svg>
            </div>
          </motion.div>

          <motion.div
            animate={{ y: [0, -14, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
            className="absolute -top-5 -right-3 md:-right-8 flex items-center gap-2.5 bg-white rounded-xl border border-[var(--border)] shadow-xl px-4 py-3"
          >
            <span className="w-9 h-9 rounded-full bg-emerald-50 flex items-center justify-center">
              <BadgeCheck className="w-5 h-5 text-emerald-600" />
            </span>
            <div>
              <p className="text-xs font-bold text-[var(--foreground)]">Signature verified</p>
              <p className="text-[10px] text-gray-500">Ed25519 • just now</p>
            </div>
          </motion.div>

          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
            className="absolute -bottom-5 -left-3 md:-left-8 flex items-center gap-2.5 bg-white rounded-xl border border-[var(--border)] shadow-xl px-4 py-3"
          >
            <span className="w-9 h-9 rounded-full bg-[var(--secondary)] flex items-center justify-center">
              <Fingerprint className="w-5 h-5 text-[var(--primary)]" />
            </span>
            <div>
              <p className="text-xs font-bold text-[var(--foreground)]">Identity confirmed</p>
              <p className="text-[10px] text-gray-500">KYC + liveness check</p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
