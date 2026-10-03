"use client";

import { motion } from "framer-motion";
import { FileCheck2, Fingerprint, KeyRound, Workflow } from "lucide-react";
import KycIllustration from "./illustrations/KycIllustration";
import WorkspaceIllustration from "./illustrations/WorkspaceIllustration";

const cards = [
  {
    icon: Fingerprint,
    title: "KYC with liveness",
    text: "Signers verify a government ID and pass a real-time liveness check before they can ever sign.",
  },
  {
    icon: KeyRound,
    title: "Envelope encryption",
    text: "Every document is sealed with AES-256-GCM and per-user keys wrapped by a dedicated KMS.",
  },
  {
    icon: Workflow,
    title: "Sequential signing",
    text: "Order your signers, gate every turn, and notify the right person the moment it is theirs.",
  },
  {
    icon: FileCheck2,
    title: "Instant verification",
    text: "Anyone can prove a document's authenticity in seconds — tampering is mathematically evident.",
  },
];

export default function FeaturesSection() {
  return (
    <section id="features" className="bg-white">
      <div className="max-w-6xl mx-auto px-6 py-20 md:py-28">
        <motion.div
          className="text-center max-w-2xl mx-auto mb-14 md:mb-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <p className="text-sm font-semibold uppercase tracking-widest text-[var(--primary)] mb-3">
            Why Clarisign
          </p>
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-[var(--foreground)]">
            Security isn't a feature. It's the foundation.
          </h2>
        </motion.div>

        <motion.div
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-24 md:mb-32"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
        >
          {cards.map(({ icon: Icon, title, text }) => (
            <motion.div
              key={title}
              variants={{
                hidden: { opacity: 0, y: 24 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
              }}
              className="group rounded-2xl border border-[var(--border)] bg-white p-6 shadow-sm hover:shadow-xl hover:shadow-[var(--primary)]/10 hover:-translate-y-1 hover:border-[var(--primary)]/30 transition"
            >
              <span className="w-11 h-11 mb-4 rounded-xl bg-[var(--secondary)]/70 flex items-center justify-center group-hover:bg-[var(--primary)] transition-colors">
                <Icon className="w-5.5 h-5.5 text-[var(--primary)] group-hover:text-white transition-colors" />
              </span>
              <h3 className="font-bold text-[var(--foreground)] mb-2">{title}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{text}</p>
            </motion.div>
          ))}
        </motion.div>

        <div className="space-y-24 md:space-y-32">
          <div className="flex flex-col-reverse md:flex-row items-center justify-between gap-12">
            <motion.div
              className="max-w-xl md:w-1/2 text-center md:text-left"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              viewport={{ once: true }}
            >
              <p className="text-sm font-semibold uppercase tracking-widest text-[var(--primary)] mb-3">
                Trusted identities
              </p>
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-4 text-[var(--foreground)]">
                Trust starts with strong authentication
              </h2>
              <p className="text-gray-600 leading-relaxed">
                Give your users secure and reliable access to your platform. Clarisign
                protects your data with industry-grade encryption and strict access
                control, ensuring every login, every document, and every action remains
                safe and compliant.
              </p>
            </motion.div>

            <motion.div
              className="flex justify-center md:justify-end w-full md:w-1/2 shrink-0"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              viewport={{ once: true }}
            >
              <KycIllustration />
            </motion.div>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between gap-12">
            <motion.div
              className="flex justify-center md:justify-start w-full md:w-1/2 shrink-0"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              viewport={{ once: true }}
            >
              <WorkspaceIllustration />
            </motion.div>

            <motion.div
              className="max-w-xl md:w-1/2 text-center md:text-left"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              viewport={{ once: true }}
            >
              <p className="text-sm font-semibold uppercase tracking-widest text-[var(--primary)] mb-3">
                One workspace
              </p>
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-4 text-[var(--foreground)]">
                One platform for every signing workflow
              </h2>
              <p className="text-gray-600 leading-relaxed">
                Clarisign lets you sign and manage documents in one seamless platform,
                making digital signing faster, more organized, and fully compliant
                wherever your team collaborates.
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
