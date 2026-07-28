"use client";

/**
 * DiffReviewCard — Agent Pit Stop
 * The approval gate for edits. The agent proposes a change; the human
 * sees exactly what would change, old against new, and accepts or
 * rejects each hunk. Nothing applies until the human says so.
 *
 * Principles applied:
 * - Delegation contracts: consent is per hunk, never a bundled yes;
 *   applying is an explicit, separate act
 * - Legible thinking: the exact change is shown verbatim, additions and
 *   removals marked by glyph and label, never color alone
 * - Graceful failure: rejected hunks stay visible in the receipt, so
 *   the record shows what was declined, not just what landed
 */

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";

export type HunkDecision = "pending" | "accepted" | "rejected";

export interface DiffHunk {
  id: string;
  /** Where in the target this change applies, e.g. "Hero headline" */
  label: string;
  /** Lines being removed */
  before: string[];
  /** Lines being added */
  after: string[];
}

export interface DiffReviewCardProps {
  /** What the agent proposes, e.g. "Update pricing page copy" */
  title: string;
  /** The file or document being changed, e.g. "pricing.md" */
  target: string;
  hunks: DiffHunk[];
  /** Called when the human applies the reviewed changes */
  onApply?: (decisions: Record<string, HunkDecision>) => void;
  /** Extra classes merged onto the root element */
  className?: string;
}

export function DiffReviewCard({ title, target, hunks, onApply, className }: DiffReviewCardProps) {
  const [decisions, setDecisions] = useState<Record<string, HunkDecision>>(
    Object.fromEntries(hunks.map((h) => [h.id, "pending"])),
  );
  const [applied, setApplied] = useState(false);

  const decide = (id: string, d: HunkDecision) =>
    setDecisions((prev) => ({ ...prev, [id]: prev[id] === d ? "pending" : d }));

  const accepted = Object.values(decisions).filter((d) => d === "accepted").length;
  const rejected = Object.values(decisions).filter((d) => d === "rejected").length;
  const allDecided = accepted + rejected === hunks.length;

  if (applied) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={`flex items-center gap-3 rounded-xl border border-line bg-asphalt px-4 py-3 ${className ?? ""}`}
      >
        <span className="inline-flex h-2 w-2 shrink-0 rounded-full bg-signal" aria-hidden />
        <span className="min-w-0 flex-1 truncate text-[13px] text-smoke">
          {title} · {target}
        </span>
        <span className="shrink-0 text-[12px] font-medium text-signal">
          {accepted} applied{rejected > 0 ? ` · ${rejected} rejected` : ""}
        </span>
      </motion.div>
    );
  }

  return (
    <div className={`w-full overflow-hidden rounded-xl border border-line bg-asphalt ${className ?? ""}`}>
      <div className="border-b border-line px-4 py-3">
        <div className="text-[15px] font-medium text-chalk">{title}</div>
        <div className="mt-0.5 font-mono text-[12px] text-ash">{target}</div>
      </div>

      <ul>
        {hunks.map((hunk) => {
          const d = decisions[hunk.id];
          const resolved = d !== "pending";
          return (
            <li
              key={hunk.id}
              className={`border-b border-line px-4 py-3 transition-opacity duration-500 last:border-b-0 ${
                resolved ? "opacity-60" : ""
              }`}
            >
              <div className="flex items-center justify-between gap-3">
                <span className="text-[12.5px] text-smoke">{hunk.label}</span>
                <span
                  className={`text-[12px] font-medium ${
                    d === "accepted" ? "text-signal" : d === "rejected" ? "text-flag" : "text-ash"
                  }`}
                >
                  {d === "accepted" ? "Accepted" : d === "rejected" ? "Rejected" : "Needs review"}
                </span>
              </div>

              <div className="mt-2 overflow-x-auto rounded-lg bg-track p-3 font-mono text-[12px] leading-relaxed">
                {hunk.before.map((line, i) => (
                  <div key={`b${i}`} className="flex gap-2 text-flag">
                    <span aria-hidden className="select-none">−</span>
                    <span className={d === "accepted" ? "line-through" : ""}>{line}</span>
                    <span className="sr-only">removed:</span>
                  </div>
                ))}
                {hunk.after.map((line, i) => (
                  <div key={`a${i}`} className="flex gap-2 text-signal">
                    <span aria-hidden className="select-none">+</span>
                    <span className={d === "rejected" ? "line-through" : ""}>{line}</span>
                    <span className="sr-only">added:</span>
                  </div>
                ))}
              </div>

              <div className="mt-2.5 flex gap-2">
                <button
                  type="button"
                  onClick={() => decide(hunk.id, "accepted")}
                  aria-pressed={d === "accepted"}
                  className={`min-h-9 rounded-lg px-3 py-1.5 text-[12.5px] font-medium transition-colors pointer-coarse:min-h-11 ${
                    d === "accepted"
                      ? "bg-signal/15 text-signal"
                      : "border border-line text-smoke hover:text-chalk"
                  }`}
                >
                  Accept
                </button>
                <button
                  type="button"
                  onClick={() => decide(hunk.id, "rejected")}
                  aria-pressed={d === "rejected"}
                  className={`min-h-9 rounded-lg px-3 py-1.5 text-[12.5px] font-medium transition-colors pointer-coarse:min-h-11 ${
                    d === "rejected"
                      ? "bg-flag/15 text-flag"
                      : "border border-line text-smoke hover:text-chalk"
                  }`}
                >
                  Reject
                </button>
              </div>
            </li>
          );
        })}
      </ul>

      <div className="flex items-center justify-between gap-3 border-t border-line px-4 py-3">
        <span className="text-[12.5px] text-smoke" aria-live="polite">
          {accepted} accepted · {rejected} rejected · {hunks.length - accepted - rejected} pending
        </span>
        <AnimatePresence initial={false}>
          <motion.button
            type="button"
            disabled={!allDecided || accepted === 0}
            onClick={() => {
              setApplied(true);
              onApply?.(decisions);
            }}
            initial={false}
            animate={{ opacity: allDecided ? 1 : 0.4 }}
            className="min-h-9 shrink-0 rounded-lg bg-chalk px-3.5 py-1.5 text-[13px] font-medium text-track transition-opacity enabled:hover:opacity-85 pointer-coarse:min-h-11"
          >
            Apply {accepted > 0 ? accepted : ""} change{accepted === 1 ? "" : "s"}
          </motion.button>
        </AnimatePresence>
      </div>
    </div>
  );
}
