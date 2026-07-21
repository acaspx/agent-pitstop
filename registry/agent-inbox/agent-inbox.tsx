"use client";

/**
 * AgentInbox — Agent Pit Stop
 * The review queue for background agents. Long-running agents finish
 * laps while you're elsewhere; the inbox is where their results wait
 * for human eyes, ordered by what needs you most.
 *
 * Principles applied:
 * - Delegation contracts: runs that need review say exactly what they're
 *   waiting on; nothing auto-completes past a consent point
 * - Legible thinking: each item is a one-line intent + status, never a wall
 * - Calibrated trust: needs-review items surface the reason (low
 *   confidence, irreversible step, failure), not just a red dot
 */

import { AnimatePresence, motion } from "motion/react";

export type InboxStatus = "needs_review" | "running" | "done" | "failed";

export interface InboxItem {
  id: string;
  /** What the run is, e.g. "Reconcile March invoices" */
  title: string;
  /** One-line current state, e.g. "12 matched, 2 need a decision" */
  summary: string;
  status: InboxStatus;
  /** Why it needs review, when it does */
  reason?: string;
  /** Relative time, e.g. "2h ago" */
  time?: string;
}

export interface AgentInboxProps {
  items: InboxItem[];
  /** Called when the human opens a run for review */
  onOpen?: (id: string) => void;
  label?: string;
  /** Extra classes merged onto the root element */
  className?: string;
}

const statusMeta: Record<InboxStatus, { label: string; dot: string; text: string }> = {
  needs_review: { label: "Needs you", dot: "bg-caution", text: "text-caution" },
  running: { label: "Running", dot: "bg-pit", text: "text-pit" },
  done: { label: "Done", dot: "bg-signal", text: "text-signal" },
  failed: { label: "Failed", dot: "bg-flag", text: "text-flag" },
};

export function AgentInbox({ items, onOpen, label = "Agent inbox", className }: AgentInboxProps) {
  const needsYou = items.filter((i) => i.status === "needs_review").length;

  return (
    <div className={`w-full rounded-xl border border-line bg-asphalt ${className ?? ""}`}>
      <div className="flex items-center justify-between border-b border-line px-4 py-2.5">
        <span className="text-[13px] font-medium text-chalk">{label}</span>
        <span className="font-mono text-[12px] text-smoke">
          {needsYou > 0 ? `${needsYou} need${needsYou === 1 ? "s" : ""} you` : "all clear"}
        </span>
      </div>
      <ul>
        <AnimatePresence initial={false}>
          {items.map((item) => {
            const meta = statusMeta[item.status];
            return (
              <motion.li
                key={item.id}
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, height: 0 }}
                className="border-b border-line last:border-b-0"
              >
                <button
                  type="button"
                  onClick={() => onOpen?.(item.id)}
                  className="flex min-h-11 w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-barrier/40"
                >
                  <span className={`inline-flex h-2 w-2 shrink-0 rounded-full ${meta.dot}`} aria-hidden />
                  <span className="min-w-0 flex-1">
                    <span className="flex items-baseline justify-between gap-3">
                      <span className="truncate text-[13px] text-chalk">{item.title}</span>
                      {item.time && (
                        <span className="shrink-0 font-mono text-[11px] text-ash">{item.time}</span>
                      )}
                    </span>
                    <span className="block truncate text-[12.5px] text-smoke">{item.summary}</span>
                    {item.status === "needs_review" && item.reason && (
                      <span className="mt-0.5 block truncate text-[12px] text-caution">
                        Waiting on you: {item.reason}
                      </span>
                    )}
                  </span>
                  <span className={`shrink-0 text-[12px] font-medium ${meta.text}`}>{meta.label}</span>
                </button>
              </motion.li>
            );
          })}
        </AnimatePresence>
      </ul>
    </div>
  );
}
