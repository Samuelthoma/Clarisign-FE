"use client";

import { motion } from "framer-motion";
import { MessageSquareText, Send, ShieldCheck, Users } from "lucide-react";

const highlights = [
  {
    icon: MessageSquareText,
    title: "Questions & demos",
    text: "Tell us about your signing workflow and we'll show you how Clarisign fits.",
  },
  {
    icon: ShieldCheck,
    title: "Security first",
    text: "Ask anything about encryption, identity verification, or signature validation.",
  },
  {
    icon: Users,
    title: "For teams",
    text: "We'll help you set up sequential signing for your whole organization.",
  },
];

const inputClass =
  "w-full rounded-xl border border-[var(--border)] bg-gray-50/70 px-4 py-3 text-sm text-[var(--foreground)] placeholder:text-gray-400 focus:bg-white focus:outline-none focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary)]/10 transition";

const labelClass = "block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2";

export default function ContactSection() {
  return (
    <section id="contact" className="relative bg-white py-20 md:py-28 px-6 overflow-hidden">
      <div
        className="absolute top-1/3 -left-40 w-96 h-96 rounded-full bg-[var(--primary)]/10 blur-3xl"
        aria-hidden
      />

      <div className="relative max-w-6xl mx-auto grid lg:grid-cols-[0.95fr_1.05fr] gap-12 lg:gap-16 items-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center lg:text-left"
        >
          <p className="text-sm font-semibold uppercase tracking-widest text-[var(--primary)] mb-3">
            Contact
          </p>
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-[var(--foreground)] mb-4">
            Let's talk about
            <br className="hidden sm:block" /> secure signing
          </h2>
          <p className="text-gray-600 md:text-lg leading-relaxed max-w-md mx-auto lg:mx-0 mb-10">
            We'd love to hear from you. Send us a message and we'll get back to you soon.
          </p>

          <ul className="space-y-6 text-left max-w-md mx-auto lg:mx-0">
            {highlights.map(({ icon: Icon, title, text }) => (
              <li key={title} className="flex items-start gap-4">
                <span className="shrink-0 w-11 h-11 rounded-xl bg-[var(--secondary)]/70 flex items-center justify-center">
                  <Icon className="w-5 h-5 text-[var(--primary)]" />
                </span>
                <div>
                  <p className="font-semibold text-[var(--foreground)] mb-0.5">{title}</p>
                  <p className="text-sm text-gray-500 leading-relaxed">{text}</p>
                </div>
              </li>
            ))}
          </ul>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.15 }}
          onSubmit={(e) => e.preventDefault()}
          className="relative w-full max-w-xl mx-auto lg:max-w-none bg-white rounded-3xl border border-[var(--border)] shadow-2xl shadow-[var(--primary)]/10 p-7 md:p-10"
        >
          <div
            className="absolute inset-x-10 -top-px h-px bg-gradient-to-r from-transparent via-[var(--primary)]/60 to-transparent"
            aria-hidden
          />

          <h3 className="text-xl font-bold text-[var(--foreground)] mb-1">Send us a message</h3>
          <p className="text-sm text-gray-500 mb-8">All fields are required.</p>

          <div className="space-y-5">
            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label htmlFor="name" className={labelClass}>
                  Name
                </label>
                <input id="name" type="text" placeholder="Your name" className={inputClass} />
              </div>
              <div>
                <label htmlFor="email" className={labelClass}>
                  Email
                </label>
                <input id="email" type="email" placeholder="you@company.com" className={inputClass} />
              </div>
            </div>

            <div>
              <label htmlFor="message" className={labelClass}>
                Message
              </label>
              <textarea
                id="message"
                rows={5}
                placeholder="How can we help?"
                className={`${inputClass} resize-none`}
              ></textarea>
            </div>

            <button
              type="submit"
              className="group w-full inline-flex items-center justify-center gap-2 py-3.5 bg-[var(--primary)] text-white text-sm font-semibold rounded-full shadow-lg shadow-[var(--primary)]/30 hover:opacity-90 hover:-translate-y-px transition"
            >
              Send message
              <Send className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </button>
          </div>
        </motion.form>
      </div>
    </section>
  );
}
