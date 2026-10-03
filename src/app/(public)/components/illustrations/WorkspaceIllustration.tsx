"use client";

import { motion } from "framer-motion";
import { BellRing, FileText, LayoutDashboard } from "lucide-react";

const stats = [
  { label: "Your turn", value: 2, tone: "text-[var(--primary)]" },
  { label: "In progress", value: 5, tone: "text-amber-600" },
  { label: "Completed", value: 12, tone: "text-emerald-600" },
];

const documents = [
  {
    name: "NDA-Q4.pdf",
    signers: ["A", "B"],
    status: "Your turn",
    pill: "text-[var(--primary)] bg-[var(--secondary)]/70 border-[var(--primary)]/20",
  },
  {
    name: "Vendor-Contract.pdf",
    signers: ["B", "C", "D"],
    status: "Waiting finalize",
    pill: "text-amber-700 bg-amber-50 border-amber-200",
  },
  {
    name: "Offer-Letter.pdf",
    signers: ["E"],
    status: "Completed",
    pill: "text-emerald-700 bg-emerald-50 border-emerald-200",
  },
  {
    name: "Lease-Renewal.pdf",
    signers: ["F", "G"],
    status: "Draft",
    pill: "text-gray-600 bg-gray-50 border-gray-200",
  },
];

const avatarTones = [
  "bg-[var(--primary)]",
  "bg-indigo-400",
  "bg-sky-400",
  "bg-violet-300",
];

export default function WorkspaceIllustration() {
  return (
    <div className="relative w-full max-w-md" aria-hidden>
      <div className="bg-white rounded-2xl border border-[var(--border)] shadow-2xl shadow-[var(--primary)]/15 p-6 md:p-7">
        <div className="flex items-center gap-2.5 mb-5">
          <span className="w-9 h-9 rounded-lg bg-[var(--secondary)]/70 flex items-center justify-center">
            <LayoutDashboard className="w-4.5 h-4.5 text-[var(--primary)]" />
          </span>
          <div>
            <p className="text-sm font-bold text-[var(--foreground)]">Documents</p>
            <p className="text-[11px] text-gray-500">Everything you send and sign</p>
          </div>
          <div className="ml-auto h-7 w-24 rounded-full bg-gray-50 border border-[var(--border)]" />
        </div>

        <div className="grid grid-cols-3 gap-2.5 mb-5">
          {stats.map((stat) => (
            <div key={stat.label} className="rounded-xl border border-[var(--border)] px-3 py-2.5">
              <p className={`text-lg font-extrabold leading-none mb-1 ${stat.tone}`}>{stat.value}</p>
              <p className="text-[10px] text-gray-500">{stat.label}</p>
            </div>
          ))}
        </div>

        <motion.ul
          className="divide-y divide-[var(--border)]"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{ visible: { transition: { staggerChildren: 0.12, delayChildren: 0.2 } } }}
        >
          {documents.map((doc) => (
            <motion.li
              key={doc.name}
              variants={{
                hidden: { opacity: 0, y: 8 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.35 } },
              }}
              className="flex items-center gap-3 py-3"
            >
              <FileText className="w-4.5 h-4.5 text-gray-400 shrink-0" />
              <p className="text-[13px] font-semibold text-[var(--foreground)] truncate">{doc.name}</p>
              <div className="flex -space-x-1.5 ml-auto">
                {doc.signers.map((initial, i) => (
                  <span
                    key={initial}
                    className={`w-5.5 h-5.5 rounded-full border-2 border-white text-[9px] font-bold text-white flex items-center justify-center ${avatarTones[i % avatarTones.length]}`}
                  >
                    {initial}
                  </span>
                ))}
              </div>
              <span
                className={`shrink-0 text-[10px] font-semibold px-2 py-0.5 rounded-full border ${doc.pill}`}
              >
                {doc.status}
              </span>
            </motion.li>
          ))}
        </motion.ul>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.9 }}
        className="absolute -top-7 -right-3 md:-right-8"
      >
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
          className="flex items-center gap-2.5 bg-white rounded-xl border border-[var(--border)] shadow-xl px-4 py-3"
        >
          <span className="w-9 h-9 rounded-full bg-[var(--secondary)] flex items-center justify-center">
            <BellRing className="w-4.5 h-4.5 text-[var(--primary)]" />
          </span>
          <div>
            <p className="text-xs font-bold text-[var(--foreground)]">It's your turn to sign</p>
            <p className="text-[10px] text-gray-500">NDA-Q4.pdf • from Andi</p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
