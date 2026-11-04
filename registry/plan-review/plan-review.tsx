"use client";

/**
 * PlanReview — Agent Pit Stop
 * The agent's plan, shown before it starts, as steps the person can drop
 * or reword. Risky steps are marked. Nothing runs until the plan is
 * approved, and the approved version is the one the agent follows.
 *
 * Principles applied:
 * - Delegation contracts: the plan is the contract, and the person edits it
 *   before signing rather than correcting the run after
 * - Legible thinking: the agent's intent is readable before it acts
 * - Calibrated trust: risky steps are named so review time goes where it
 *   matters
 *
 * Accessibility:
 * - Keyboard: Edit opens an inline field (Enter or Escape to finish); Drop and Keep toggle a step; Approve plan submits.
 * - Screen reader: Edit and Drop name their step ("Drop step 3: Run the migration on staging"); dropped steps read "Dropped".
 * - Motion: opacity and height only.
 * - Host: mark steps that change things outside the sandbox `risky`; run only the steps passed to onApprove.
 */

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";

export interface PlanStep {
  title: string;
  detail?: string;
  /** Marks a step that changes or sends something outside the sandbox */
  risky?: boolean;
}

export type PlanReviewState = "reviewing" | "approved";

export interface PlanReviewProps {
  /** What the plan is for, e.g. "Migrate billing to the new API" */
  goal: string;
  steps: PlanStep[];
  /** Controlled state; omit to let the component manage it */
  state?: PlanReviewState;
  /** Called with the steps as edited, minus any the person dropped */
  onApprove?: (steps: PlanStep[]) => void;
  onRevise?: () => void;
  /** Controlled indexes of dropped steps; omit to let the component manage them */
  dropped?: number[];
  onDroppedChange?: (dropped: number[]) => void;
  /** Extra classes merged onto the root element */
  className?: string;
}

export function PlanReview({
  goal,
  steps: initial,
  state: controlled,
  onApprove,
  onRevise,
  dropped: controlledDropped,
  onDroppedChange,
  className,
}: PlanReviewProps) {
  const [edited, setSteps] = useState(() => initial.map((s) => ({ ...s, on: true })));
  const steps = controlledDropped ? edited.map((s, i) => ({ ...s, on: !controlledDropped.includes(i) })) : edited;
  const toggleStep = (i: number) => {
    const next = steps.map((x, j) => (j === i ? !x.on : x.on));
    if (!controlledDropped) setSteps((all) => all.map((x, j) => ({ ...x, on: next[j] })));
    onDroppedChange?.(next.flatMap((on, j) => (on ? [] : [j])));
  };
  const [editing, setEditing] = useState<number | null>(null);
  const [internal, setInternal] = useState<PlanReviewState>("reviewing");
  const state = controlled ?? internal;
  const kept = steps.filter((s) => s.on);

  const approve = () => {
    if (!controlled) setInternal("approved");
    onApprove?.(kept.map(({ on: _on, ...s }) => s));
  };

  return (
    <div className={`w-full overflow-hidden rounded-xl border border-line bg-asphalt ${className ?? ""}`}>
      <div className="flex items-center gap-2 border-b border-line px-4 py-2.5">
        <span className="text-[12px] font-medium uppercase tracking-wide text-ash">Plan</span>
        <span className="min-w-0 flex-1 truncate text-[13px] text-chalk">{goal}</span>
        {state === "approved" && <span className="shrink-0 text-[12px] font-medium text-signal">Approved</span>}
      </div>
      <ol className="px-2 py-2">
        {steps.map((s, i) => (
          <li key={i} className={`flex items-start gap-2 rounded-lg px-2 py-1.5 ${state === "reviewing" ? "hover:bg-carbon" : ""}`}>
            <span className={`mt-[3px] w-4 shrink-0 text-right font-mono text-[12px] ${s.on ? "text-ash" : "text-line"}`}>{i + 1}</span>
            <div className="min-w-0 flex-1">
              {editing === i ? (
                <input
                  autoFocus
                  defaultValue={s.title}
                  aria-label={`Edit step ${i + 1}`}
                  onBlur={(e) => {
                    const v = e.target.value.trim();
                    if (v) setSteps((all) => all.map((x, j) => (j === i ? { ...x, title: v } : x)));
                    setEditing(null);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === "Escape") (e.target as HTMLInputElement).blur();
                  }}
                  className="w-full rounded-md border border-ash bg-carbon px-2 py-0.5 text-[13px] text-chalk focus:outline-none"
                />
              ) : (
                <div className={`text-[13px] leading-snug ${s.on ? "text-chalk" : "text-ash line-through"}`}>
                  {!s.on && <span className="sr-only">Dropped: </span>}
                  {s.title}
                  {s.risky && s.on && (
                    <span className="ml-2 rounded border border-caution/40 px-1 py-px align-middle text-[10px] font-medium uppercase tracking-wide text-caution">
                      Risky
                    </span>
                  )}
                </div>
              )}
              {s.detail && s.on && editing !== i && <div className="mt-0.5 text-[12px] text-ash">{s.detail}</div>}
            </div>
            {state === "reviewing" && (
              <div className="flex shrink-0 gap-1">
                {s.on && (
                  <button
                    type="button"
                    onClick={() => setEditing(i)}
                    aria-label={`Edit step ${i + 1}: ${s.title}`}
                    className="min-h-7 rounded-md px-1.5 text-[12px] text-ash hover:text-chalk pointer-coarse:min-h-11"
                  >
                    Edit
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => toggleStep(i)}
                  aria-pressed={!s.on}
                  aria-label={`${s.on ? "Drop" : "Keep"} step ${i + 1}: ${s.title}`}
                  className="min-h-7 rounded-md px-1.5 text-[12px] text-ash hover:text-chalk pointer-coarse:min-h-11"
                >
                  {s.on ? "Drop" : "Keep"}
                </button>
              </div>
            )}
          </li>
        ))}
      </ol>
      <AnimatePresence initial={false}>
        {state === "reviewing" && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: [0.32, 0.72, 0, 1] }}
          >
            <div className="flex items-center gap-2 border-t border-line px-4 py-2.5">
              <span className="text-[12px] text-ash">
                {kept.length} of {steps.length} steps · nothing runs until you approve
              </span>
              {onRevise && (
                <button
                  type="button"
                  onClick={onRevise}
                  className="ml-auto min-h-8 rounded-lg border border-line px-3 text-[12px] font-medium text-smoke hover:text-chalk pointer-coarse:min-h-11"
                >
                  Revise
                </button>
              )}
              <button
                type="button"
                onClick={approve}
                disabled={!kept.length}
                className={`${onRevise ? "" : "ml-auto"} min-h-8 rounded-lg bg-chalk px-3 text-[12px] font-medium text-track enabled:hover:opacity-85 disabled:opacity-40 pointer-coarse:min-h-11`}
              >
                Approve plan
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
