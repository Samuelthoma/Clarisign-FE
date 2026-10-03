"use client";

import { motion } from "framer-motion";
import {
  BadgeCheck,
  CheckCircle2,
  CircleDashed,
  Clock3,
  CloudUpload,
  FileText,
  FileUp,
  Loader2,
  Mail,
  MailCheck,
  PenLine,
  Users,
} from "lucide-react";

const cardClass =
  "w-full max-w-md bg-white rounded-2xl border border-[var(--border)] shadow-2xl shadow-[var(--primary)]/15 p-6 md:p-7";

function CardHeader({
  icon: Icon,
  title,
  sub,
  badge,
}: {
  icon: typeof FileUp;
  title: string;
  sub: string;
  badge: string;
}) {
  return (
    <div className="flex items-center gap-2.5 mb-6">
      <span className="w-9 h-9 rounded-lg bg-[var(--secondary)]/70 flex items-center justify-center">
        <Icon className="w-4.5 h-4.5 text-[var(--primary)]" />
      </span>
      <div>
        <p className="text-sm font-bold text-[var(--foreground)]">{title}</p>
        <p className="text-[11px] text-gray-500">{sub}</p>
      </div>
      <span className="ml-auto text-[10px] font-semibold uppercase tracking-wider text-[var(--primary)] bg-[var(--secondary)]/70 px-2 py-0.5 rounded-full">
        {badge}
      </span>
    </div>
  );
}

const fields = [
  { name: "Budi", order: 1, pos: "left-4 top-[4.25rem]" },
  { name: "Citra", order: 2, pos: "right-4 top-[4.25rem]" },
  { name: "Dewi", order: 3, pos: "left-4 bottom-4" },
];

export function UploadVisual() {
  return (
    <div className={cardClass}>
      <CardHeader icon={CloudUpload} title="New document" sub="Upload, then place signature fields" badge="Draft" />

      <div className="flex items-center gap-3 rounded-xl border border-[var(--border)] px-3.5 py-3 mb-4">
        <FileText className="w-5 h-5 text-[var(--primary)] shrink-0" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1.5">
            <p className="text-[13px] font-semibold text-[var(--foreground)] truncate">Vendor-Contract.pdf</p>
            <p className="text-[10px] text-gray-500">2.4 MB</p>
          </div>
          <div className="h-1.5 rounded-full bg-gray-100 overflow-hidden">
            <motion.div
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 1.1, ease: "easeOut" }}
              className="h-full rounded-full bg-gradient-to-r from-[var(--primary)] to-indigo-400"
            />
          </div>
        </div>
        <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 1.1, type: "spring" }}>
          <CheckCircle2 className="w-5 h-5 text-emerald-500" />
        </motion.span>
      </div>

      <div className="relative h-44 rounded-xl border border-[var(--border)] bg-gray-50/60 p-4">
        <div className="space-y-2">
          <div className="h-1.5 rounded bg-gray-200/80 w-full" />
          <div className="h-1.5 rounded bg-gray-200/80 w-11/12" />
          <div className="h-1.5 rounded bg-gray-200/80 w-3/5" />
        </div>
        {fields.map((field, i) => (
          <motion.div
            key={field.name}
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.3 + i * 0.25, duration: 0.35 }}
            className={`absolute ${field.pos} w-[42%] rounded-lg border-2 border-dashed border-[var(--primary)]/45 bg-[var(--secondary)]/40 px-2.5 py-2`}
          >
            <div className="flex items-center gap-1.5">
              <span className="w-4 h-4 rounded-full bg-[var(--primary)] text-white text-[9px] font-bold flex items-center justify-center">
                {field.order}
              </span>
              <span className="text-[10px] font-semibold text-[var(--secondary-foreground)]">{field.name}</span>
              <PenLine className="w-3 h-3 ml-auto text-[var(--primary)]/70" />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

const signers = [
  { initial: "B", name: "Budi Santoso", email: "budi@vendor.co", state: "sent" },
  { initial: "C", name: "Citra Lestari", email: "citra@vendor.co", state: "queued" },
  { initial: "D", name: "Dewi Anggraini", email: "dewi@vendor.co", state: "queued" },
];

export function InviteVisual() {
  return (
    <div className="relative w-full max-w-md">
      <div className={cardClass}>
        <CardHeader icon={Users} title="Signing order" sub="Each signer is invited on their turn" badge="Published" />

        <ul className="space-y-3">
          {signers.map((signer, i) => (
            <motion.li
              key={signer.email}
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 + i * 0.15, duration: 0.35 }}
              className="flex items-center gap-3 rounded-xl border border-[var(--border)] px-3.5 py-2.5"
            >
              <span className="w-5 text-center text-xs font-bold text-gray-400">{i + 1}</span>
              <span className="w-8 h-8 rounded-full bg-[var(--primary)] text-white text-xs font-bold flex items-center justify-center">
                {signer.initial}
              </span>
              <div className="min-w-0">
                <p className="text-[13px] font-semibold text-[var(--foreground)] truncate">{signer.name}</p>
                <p className="text-[10px] text-gray-500 truncate">{signer.email}</p>
              </div>
              {signer.state === "sent" ? (
                <span className="ml-auto shrink-0 inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                  <MailCheck className="w-3 h-3" /> Invited
                </span>
              ) : (
                <span className="ml-auto shrink-0 inline-flex items-center gap-1 text-[10px] font-semibold text-gray-500 bg-gray-50 border border-gray-200 px-2 py-0.5 rounded-full">
                  <Clock3 className="w-3 h-3" /> Next
                </span>
              )}
            </motion.li>
          ))}
        </ul>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ delay: 0.75, duration: 0.45 }}
        className="absolute -bottom-8 -right-3 md:-right-8 w-64 bg-white rounded-xl border border-[var(--border)] shadow-xl p-3.5"
      >
        <div className="flex items-center gap-2 mb-2">
          <span className="w-7 h-7 rounded-full bg-[var(--secondary)] flex items-center justify-center">
            <Mail className="w-3.5 h-3.5 text-[var(--primary)]" />
          </span>
          <div className="min-w-0">
            <p className="text-[11px] font-bold text-[var(--foreground)] truncate">It's your turn to sign</p>
            <p className="text-[10px] text-gray-500 truncate">To budi@vendor.co</p>
          </div>
        </div>
        <div className="h-6 rounded-md bg-[var(--primary)] text-white text-[10px] font-semibold flex items-center justify-center">
          Review & sign
        </div>
      </motion.div>
    </div>
  );
}

const timeline = [
  { icon: CheckCircle2, label: "Uploaded by Andi", sub: "Encrypted · AES-256-GCM", state: "done" },
  { icon: CheckCircle2, label: "Signed — Budi (1 of 3)", sub: "Ed25519 · verified identity", state: "done" },
  { icon: Loader2, label: "Waiting — Citra (2 of 3)", sub: "Invitation sent, her turn now", state: "active" },
  { icon: CircleDashed, label: "Queued — Dewi (3 of 3)", sub: "Notified after Citra signs", state: "todo" },
];

export function TrackVisual() {
  return (
    <div className={cardClass}>
      <div className="flex items-center gap-2.5 mb-6">
        <span className="w-9 h-9 rounded-lg bg-[var(--secondary)]/70 flex items-center justify-center">
          <FileUp className="w-4.5 h-4.5 text-[var(--primary)]" />
        </span>
        <div>
          <p className="text-sm font-bold text-[var(--foreground)]">Vendor-Contract.pdf</p>
          <p className="text-[11px] text-gray-500">Sequential signing · 2 of 3 complete</p>
        </div>
        <span className="ml-auto text-[10px] font-semibold uppercase tracking-wider text-[var(--primary)] bg-[var(--secondary)]/70 px-2 py-0.5 rounded-full">
          Live
        </span>
      </div>

      <div className="h-1.5 rounded-full bg-gray-100 mb-7 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: "58%" }}
          transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
          className="h-full rounded-full bg-gradient-to-r from-[var(--primary)] to-indigo-400"
        />
      </div>

      <ul className="space-y-4 mb-6">
        {timeline.map(({ icon: Icon, label, sub, state }) => (
          <li key={label} className="flex items-start gap-3">
            <Icon
              className={
                state === "done"
                  ? "w-5 h-5 mt-0.5 text-emerald-500"
                  : state === "active"
                    ? "w-5 h-5 mt-0.5 text-[var(--primary)] animate-spin [animation-duration:2.5s]"
                    : "w-5 h-5 mt-0.5 text-gray-300"
              }
            />
            <div>
              <p
                className={
                  state === "todo"
                    ? "text-sm font-semibold text-gray-400"
                    : "text-sm font-semibold text-[var(--foreground)]"
                }
              >
                {label}
              </p>
              <p className="text-[11px] text-gray-500">{sub}</p>
            </div>
          </li>
        ))}
      </ul>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.4 }}
        className="flex items-center gap-2.5 rounded-xl border border-emerald-200 bg-emerald-50/70 px-3.5 py-2.5"
      >
        <BadgeCheck className="w-5 h-5 text-emerald-600 shrink-0" />
        <p className="text-[12px] font-semibold text-emerald-800">
          Signatures valid · document untampered
        </p>
      </motion.div>
    </div>
  );
}
