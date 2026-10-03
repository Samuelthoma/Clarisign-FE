"use client";

import { useEffect, useRef, useState, type Dispatch, type SetStateAction } from "react";
import { AnimatePresence, motion, useInView } from "framer-motion";
import { InviteVisual, TrackVisual, UploadVisual } from "./illustrations/HowItWorkVisuals";

const steps = [
  {
    short: "Upload",
    title: "Upload a document",
    text: "Upload a document or use a template. Add signature fields exactly where needed and set the signing order.",
    Visual: UploadVisual,
  },
  {
    short: "Invite",
    title: "Invite your signers",
    text: "Each signer gets a secure link by email and is notified the moment it is their turn to sign.",
    Visual: InviteVisual,
  },
  {
    short: "Track",
    title: "Track and verify",
    text: "Monitor status in real time, finalize when everyone has signed, and verify authenticity anytime.",
    Visual: TrackVisual,
  },
];

function StepVisual({ active }: { active: number }) {
  const { Visual } = steps[active];
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={active}
        initial={{ opacity: 0, y: 18, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -12, scale: 0.98 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="w-full flex justify-center"
      >
        <Visual />
      </motion.div>
    </AnimatePresence>
  );
}

function DesktopStep({
  index,
  active,
  setActive,
}: {
  index: number;
  active: number;
  setActive: Dispatch<SetStateAction<number>>;
}) {
  const ref = useRef<HTMLButtonElement>(null);
  // The step crossing the viewport's horizontal midline drives the visual.
  const atCenter = useInView(ref, { margin: "-50% 0px -50% 0px" });

  useEffect(() => {
    if (atCenter) setActive(index);
  }, [atCenter, index, setActive]);

  const step = steps[index];
  const isActive = index === active;
  const isDone = index < active;

  return (
    <div className="min-h-[42vh] flex items-center">
      <button
        ref={ref}
        type="button"
        onClick={() => {
          setActive(index);
          ref.current?.scrollIntoView({ behavior: "smooth", block: "center" });
        }}
        aria-current={isActive ? "step" : undefined}
        className={`w-full text-left flex items-start gap-5 rounded-2xl border-l-4 px-6 py-6 transition-all duration-300 ${
          isActive
            ? "bg-white border-[var(--primary)] shadow-xl shadow-[var(--primary)]/10"
            : isDone
              ? "border-[var(--primary)]/35 hover:bg-white/60"
              : "border-gray-200 hover:bg-white/60"
        }`}
      >
        <span
          className={`shrink-0 w-12 h-12 rounded-xl flex items-center justify-center text-xl font-bold transition-colors duration-300 ${
            isActive
              ? "bg-[var(--primary)] text-white shadow-md shadow-[var(--primary)]/30"
              : isDone
                ? "bg-[var(--secondary)] text-[var(--primary)]"
                : "bg-gray-100 text-gray-400"
          }`}
        >
          {index + 1}
        </span>
        <span>
          <span
            className={`block text-lg font-bold mb-1 transition-colors ${
              isActive ? "text-[var(--foreground)]" : "text-gray-500"
            }`}
          >
            {step.title}
          </span>
          <span
            className={`block leading-relaxed max-w-md transition-colors ${
              isActive ? "text-gray-600" : "text-gray-400"
            }`}
          >
            {step.text}
          </span>
        </span>
      </button>
    </div>
  );
}

export default function HowItWorkSection() {
  const [active, setActive] = useState(0);

  return (
    <section id="how-it-works" className="bg-gradient-to-b from-[var(--secondary)]/35 to-white">
      <div className="max-w-6xl mx-auto px-6 py-20 md:py-28">
        <motion.div
          className="text-center max-w-2xl mx-auto mb-12 md:mb-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <p className="text-sm font-semibold uppercase tracking-widest text-[var(--primary)] mb-3">
            How it works
          </p>
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-[var(--foreground)]">
            Generate, share, and sign documents faster than ever
          </h2>
        </motion.div>

        <div className="hidden md:grid grid-cols-2 gap-16">
          <div className="sticky top-28 self-start h-[calc(100vh-9rem)] max-h-[600px] flex items-center justify-center">
            <StepVisual active={active} />
          </div>
          <div className="py-[8vh]">
            {steps.map((step, i) => (
              <DesktopStep key={step.title} index={i} active={active} setActive={setActive} />
            ))}
          </div>
        </div>

        <div className="md:hidden">
          <div className="grid grid-cols-3 gap-2 p-1.5 mb-10 rounded-full bg-white border border-[var(--border)] shadow-sm">
            {steps.map((step, i) => (
              <button
                key={step.short}
                type="button"
                onClick={() => setActive(i)}
                aria-current={i === active ? "step" : undefined}
                className={`flex items-center justify-center gap-1.5 py-2 rounded-full text-sm font-semibold transition-colors ${
                  i === active ? "bg-[var(--primary)] text-white shadow-md shadow-[var(--primary)]/30" : "text-gray-500"
                }`}
              >
                <span className="text-xs opacity-80">{i + 1}</span>
                {step.short}
              </button>
            ))}
          </div>

          <div className="min-h-[470px] flex items-start justify-center pb-12">
            <StepVisual active={active} />
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.25 }}
              className="text-center"
            >
              <h3 className="text-lg font-bold text-[var(--foreground)] mb-1.5">{steps[active].title}</h3>
              <p className="text-gray-600 leading-relaxed">{steps[active].text}</p>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
