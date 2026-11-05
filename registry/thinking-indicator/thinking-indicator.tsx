"use client";

/**
 * ThinkingIndicator — Agent Pit Stop
 * The smallest honest signal that the agent is working: what it is doing right now,
 * in words, and for how long. Folds to "Thought for Ns" when it's done. Use it where a
 * full Reasoning Trace would be too much: a chat reply that is still coming, a field
 * that is filling in.
 *
 * Principles applied:
 * - Legible thinking: says what the agent is doing ("Reading 3 filings"), never just "…"
 * - Calibrated trust: the elapsed time is real, so a slow run looks slow
 *
 * Accessibility:
 * - Keyboard: nothing to operate.
 * - Screen reader: a polite status region; it announces the label and what the agent is doing, and once more when it's done. The ticking seconds are hidden from it, so they don't chatter.
 * - Motion: the three dots bounce; under prefers-reduced-motion they are hidden and the words carry it.
 * - Host: update `detail` when the agent moves to a new step, not on every token; set `state` to "done" when the answer lands.
 */

import { motion } from "motion/react";

export type ThinkingState = "thinking" | "done";

export interface ThinkingIndicatorProps {
  /** What it is, while it works (default "Thinking") */
  label?: string;
  /** What the agent is doing right now, e.g. "Reading 3 filings" */
  detail?: string;
  /** Seconds so far, or in total when done */
  elapsed?: number;
  state?: ThinkingState;
  /** Extra classes merged onto the root element */
  className?: string;
}

export function ThinkingIndicator({ label = "Thinking", detail, elapsed, state = "thinking", className }: ThinkingIndicatorProps) {
  const done = state === "done";
  return (
    <div role="status" aria-live="polite" className={`inline-flex min-h-8 max-w-full items-center gap-2.5 text-[13px] ${className ?? ""}`}>
      {done ? (
        <span aria-hidden className="inline-flex h-1.5 w-1.5 shrink-0 rounded-full bg-ash" />
      ) : (
        <span aria-hidden className="inline-flex shrink-0 items-center gap-[3px]">
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              className="motion-reduce:hidden inline-flex h-1 w-1 rounded-full bg-pit"
              animate={{ y: [0, -3, 0], opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.15, ease: "easeInOut" }}
            />
          ))}
        </span>
      )}
      <span className={`shrink-0 font-medium ${done ? "text-smoke" : "text-pit"}`}>
        {done ? `Thought${typeof elapsed === "number" ? ` for ${elapsed}s` : ""}` : label}
      </span>
      {!done && detail && <span className="min-w-0 truncate text-smoke">{detail}</span>}
      {!done && typeof elapsed === "number" && (
        <span aria-hidden className="shrink-0 font-mono text-[12px] text-ash">
          {elapsed}s
        </span>
      )}
    </div>
  );
}
