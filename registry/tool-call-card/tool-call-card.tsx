"use client";

/**
 * ToolCallCard — Agent Pit Stop
 * Shows an agent's tool call with legible, progressive disclosure.
 *
 * Principles applied:
 * - Legible thinking: name + one-line intent always visible; args/result on demand
 * - Calibrated trust: state is color + icon + label, never color alone
 * - Graceful failure: errors keep the args visible so the human can diagnose
 */

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";

export type ToolCallState = "pending" | "running" | "success" | "error";

export interface ToolCallCardProps {
  /** Machine name of the tool, e.g. "search_flights" */
  name: string;
  /** One-line human intent, e.g. "Searching SFO → JFK for Aug 12" */
  intent: string;
  state: ToolCallState;
  /** Pretty-printed arguments (JSON string or plain text) */
  args?: string;
  /** Result or error detail */
  detail?: string;
  /** Seconds elapsed while running (optional) */
  elapsed?: number;
}

const stateMeta: Record<ToolCallState, { label: string; dot: string; text: string }> = {
  pending: { label: "Queued", dot: "bg-ash", text: "text-smoke" },
  running: { label: "Running", dot: "bg-pit", text: "text-pit" },
  success: { label: "Done", dot: "bg-signal", text: "text-signal" },
  error: { label: "Failed", dot: "bg-flag", text: "text-flag" },
};

export function ToolCallCard({ name, intent, state, args, detail, elapsed }: ToolCallCardProps) {
  const [open, setOpen] = useState(false);
  const meta = stateMeta[state];
  const expandable = Boolean(args || detail);

  return (
    <div className="w-full overflow-hidden rounded-xl border border-line bg-asphalt">
      <button
        type="button"
        onClick={() => expandable && setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center gap-3 px-4 py-3 text-left"
      >
        <span className="relative flex h-2 w-2 shrink-0">
          {state === "running" && (
            <motion.span
              className="absolute inline-flex h-full w-full rounded-full bg-pit"
              animate={{ scale: [1, 2.2], opacity: [0.6, 0] }}
              transition={{ duration: 1.2, repeat: Infinity, ease: "easeOut" }}
            />
          )}
          <span className={`relative inline-flex h-2 w-2 rounded-full ${meta.dot}`} />
        </span>

        <span className="min-w-0 flex-1">
          <span className="block truncate font-mono text-[13px] text-chalk">{name}</span>
          <span className="block truncate text-[13px] text-smoke">{intent}</span>
        </span>

        <span className={`shrink-0 text-[12px] font-medium ${meta.text}`}>
          {meta.label}
          {state === "running" && typeof elapsed === "number" ? ` · ${elapsed}s` : null}
        </span>

        {expandable && (
          <motion.span
            aria-hidden
            animate={{ rotate: open ? 180 : 0 }}
            transition={{ duration: 0.2 }}
            className="shrink-0 text-ash"
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M2.5 4.5L6 8l3.5-3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </motion.span>
        )}
      </button>

      <AnimatePresence initial={false}>
        {open && expandable && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.32, 0.72, 0, 1] }}
          >
            <div className="space-y-3 border-t border-line px-4 py-3">
              {args && (
                <div>
                  <div className="mb-1 text-[11px] font-medium uppercase tracking-wide text-ash">Arguments</div>
                  <pre className="overflow-x-auto rounded-lg bg-track p-3 font-mono text-[12px] leading-relaxed text-smoke">{args}</pre>
                </div>
              )}
              {detail && (
                <div>
                  <div className="mb-1 text-[11px] font-medium uppercase tracking-wide text-ash">
                    {state === "error" ? "Error" : "Result"}
                  </div>
                  <pre
                    className={`overflow-x-auto rounded-lg bg-track p-3 font-mono text-[12px] leading-relaxed ${
                      state === "error" ? "text-flag" : "text-smoke"
                    }`}
                  >
                    {detail}
                  </pre>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
