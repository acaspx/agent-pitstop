"use client";

/**
 * DiffReviewCard — Agent Pit Stop
 * An agent's proposed change to a file, reviewed hunk by hunk before it
 * lands. Each hunk is accepted or rejected on its own; nothing applies
 * until the person says so, and the card keeps a count of what's decided.
 *
 * Principles applied:
 * - Delegation contracts: the agent proposes, the person disposes; a
 *   change is a request until it is accepted
 * - Legible thinking: each hunk carries a one-line why, so review is
 *   judging intent, not reading tea leaves
 * - Interruptibility: rejecting one hunk never throws away the others
 *
 * Accessibility:
 * - Keyboard: Accept and Reject per hunk, and Accept all, are buttons in tab order.
 * - Screen reader: each button names its hunk ("Accept: Retry once on timeout"); removed and added lines are announced as such.
 * - Motion: opacity and height only.
 * - Host: give every hunk a `summary`; apply a hunk only from onDecide.
 */

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";

export type HunkDecision = "pending" | "accepted" | "rejected";

export interface DiffHunk {
  id: string;
  /** One line of why, e.g. "Retry the request once on timeout" */
  summary?: string;
  removed: string[];
  added: string[];
}

export interface DiffReviewCardProps {
  /** File path, e.g. "src/api/client.ts" */
  file: string;
  hunks: DiffHunk[];
  /** Controlled decisions by hunk id; omit to let the card manage them */
  decisions?: Record<string, HunkDecision>;
  onDecide?: (id: string, decision: Exclude<HunkDecision, "pending">) => void;
  /** Extra classes merged onto the root element */
  className?: string;
}

export function DiffReviewCard({ file, hunks, decisions: controlled, onDecide, className }: DiffReviewCardProps) {
  const [internal, setInternal] = useState<Record<string, HunkDecision>>({});
  const decisions = controlled ?? internal;
  const decide = (id: string, d: Exclude<HunkDecision, "pending">) => {
    if (!controlled) setInternal((m) => ({ ...m, [id]: d }));
    onDecide?.(id, d);
  };
  const decided = hunks.filter((h) => (decisions[h.id] ?? "pending") !== "pending").length;
  const pendingAll = hunks.filter((h) => (decisions[h.id] ?? "pending") === "pending");

  return (
    <div className={`w-full overflow-hidden rounded-xl border border-line bg-asphalt ${className ?? ""}`}>
      <div className="flex items-center gap-3 border-b border-line px-4 py-2.5">
        <span className="min-w-0 flex-1 truncate font-mono text-[13px] text-chalk">{file}</span>
        <span className="shrink-0 font-mono text-[12px] text-ash">
          {decided}/{hunks.length} reviewed
        </span>
        {pendingAll.length > 1 && (
          <button
            type="button"
            onClick={() => pendingAll.forEach((h) => decide(h.id, "accepted"))}
            className="min-h-8 shrink-0 rounded-md px-2 text-[12px] font-medium text-smoke hover:text-chalk pointer-coarse:min-h-11"
          >
            Accept all
          </button>
        )}
      </div>
      <ul>
        {hunks.map((h, hi) => {
          const d = decisions[h.id] ?? "pending";
          const what = h.summary ?? `change ${hi + 1} in ${file}`;
          return (
            <li key={h.id} className="border-b border-line last:border-b-0">
              {h.summary && (
                <div className="flex items-center gap-2 px-4 pt-3 text-[12px] text-smoke">
                  <span className="min-w-0 flex-1 truncate">{h.summary}</span>
                  {d !== "pending" && (
                    <span className={`shrink-0 font-medium ${d === "accepted" ? "text-signal" : "text-flag"}`}>
                      {d === "accepted" ? "Accepted" : "Rejected"}
                    </span>
                  )}
                </div>
              )}
              <motion.pre
                animate={{ opacity: d === "rejected" ? 0.45 : 1 }}
                transition={{ duration: 0.2 }}
                className="mx-4 mt-2 overflow-x-auto rounded-lg border border-line bg-carbon py-2 font-mono text-[12px] leading-[20px]"
              >
                {h.removed.map((l, i) => (
                  <div key={`r${i}`} className="bg-flag/10 px-3 text-flag">
                    <span aria-hidden className="mr-2 select-none opacity-70">−</span>
                    <span className="sr-only">Removed: </span>
                    <span className={d === "accepted" ? "line-through decoration-flag/50" : ""}>{l}</span>
                  </div>
                ))}
                {h.added.map((l, i) => (
                  <div key={`a${i}`} className="bg-signal/10 px-3 text-signal">
                    <span aria-hidden className="mr-2 select-none opacity-70">+</span>
                    <span className="sr-only">Added: </span>
                    <span className={d === "rejected" ? "line-through decoration-signal/50" : ""}>{l}</span>
                  </div>
                ))}
              </motion.pre>
              <AnimatePresence initial={false}>
                {d === "pending" && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.22, ease: [0.32, 0.72, 0, 1] }}
                  >
                    <div className="flex gap-2 px-4 pb-3 pt-2.5">
                      <button
                        type="button"
                        onClick={() => decide(h.id, "accepted")}
                        aria-label={`Accept: ${what}`}
                        className="min-h-8 rounded-lg bg-chalk px-3 py-1 text-[12px] font-medium text-track transition-opacity hover:opacity-85 pointer-coarse:min-h-11"
                      >
                        Accept
                      </button>
                      <button
                        type="button"
                        onClick={() => decide(h.id, "rejected")}
                        aria-label={`Reject: ${what}`}
                        className="min-h-8 rounded-lg border border-line px-3 py-1 text-[12px] font-medium text-smoke transition-colors hover:border-flag/50 hover:text-flag pointer-coarse:min-h-11"
                      >
                        Reject
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              {d !== "pending" && <div className="h-3" />}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
