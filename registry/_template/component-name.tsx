"use client";

/**
 * ComponentName — Agent Pit Stop
 * One sentence: the sync moment this serves and the stance it takes.
 *
 * Principles applied:
 * - <Principle>: how this component embodies it, concretely
 * - <Principle>: state is never color alone; failures keep their inputs
 *
 * Accessibility: (all four lines are required; the registry build fails without them)
 * - Keyboard: what can be operated, and with which keys
 * - Screen reader: roles, names, and what is announced when state changes
 * - Motion: what moves; any looping motion must stop under prefers-reduced-motion
 *   (add motion-reduce:hidden to a decorative pulse)
 * - Host: what the code using it must do for the above to hold (agents read this line)
 *
 * Contributor notes (delete before submitting):
 * - Single file. Dependencies: React, Tailwind tokens, Motion. Nothing else.
 * - Tokens only: bg-asphalt / bg-carbon surfaces, text-chalk / text-smoke /
 *   text-ash text, border-line, accents pit / signal / caution / flag.
 * - Every state gets an icon or label beside its color, and its word reaches
 *   screen readers (an sr-only span if the word isn't visible).
 * - If a control disappears after use, move focus to what replaced it.
 * - Action buttons: min-h-9 + pointer-coarse:min-h-11.
 * - Accept className, merged onto the root.
 * - Pair with app/components/<name>/{demo,page}.tsx, register in lib/nav.ts
 *   and scripts/build-registry.mjs. See CONTRIBUTING.md for the full
 *   definition of done.
 */

import { useState } from "react";
import { motion } from "motion/react";

export type ComponentNameState = "idle" | "active";

export interface ComponentNameProps {
  /** Document every prop with the concrete example it expects */
  label: string;
  state?: ComponentNameState;
  /** Extra classes merged onto the root element */
  className?: string;
}

export function ComponentName({ label, state: controlled, className }: ComponentNameProps) {
  const [internal, setInternal] = useState<ComponentNameState>("idle");
  const state = controlled ?? internal;

  return (
    <div className={`w-full rounded-xl border border-line bg-asphalt px-4 py-3 ${className ?? ""}`}>
      <div className="flex items-center justify-between gap-3">
        <span className="text-[13px] text-chalk">{label}</span>
        <button
          type="button"
          onClick={() => setInternal(state === "idle" ? "active" : "idle")}
          className="min-h-9 rounded-lg border border-line px-3 py-1.5 text-[13px] font-medium text-smoke transition-colors hover:text-chalk pointer-coarse:min-h-11"
        >
          {state === "idle" ? "Start" : "Stop"}
        </button>
      </div>
      {state === "active" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-2 text-[12px] text-smoke"
        >
          Active. States are words, never color alone.
        </motion.div>
      )}
    </div>
  );
}
