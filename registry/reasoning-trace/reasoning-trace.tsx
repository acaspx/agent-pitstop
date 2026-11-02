"use client";

/**
 * ReasoningTrace — Agent Pit Stop
 * The agent's thinking as a short list of steps the user can follow: open
 * while it works, folded to a one-line summary when it's done, and never
 * gone. Each step says what the agent is doing and what it looked at.
 *
 * Principles applied:
 * - Legible thinking: the trace is the plan as it unfolds, written as
 *   actions ("Reading 3 filings") rather than raw tokens
 * - Calibrated trust: the sources a step used sit on the step, so the user
 *   can judge the answer by what it rests on
 * - Interruptibility: the open trace is where a user notices drift early;
 *   folding is a choice the user can undo at any time
 */

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";

export type ReasoningStepStatus = "pending" | "active" | "done";

export interface ReasoningStep {
  /** What the agent is doing, as an action, e.g. "Searching state filings" */
  label: string;
  status: ReasoningStepStatus;
  /** One line of what it found or is looking at */
  detail?: string;
  /** Short source names the step used, e.g. ["sec.gov", "reuters.com"] */
  sources?: string[];
}

export interface ReasoningTraceProps {
  steps: ReasoningStep[];
  /** True while the agent is still thinking; the trace stays open */
  streaming?: boolean;
  /** Seconds spent thinking, shown in the folded summary */
  seconds?: number;
  /** Start open after the run is done (default false: folds when finished) */
  defaultOpen?: boolean;
  /** Extra classes merged onto the root element */
  className?: string;
}

const EASE = [0.32, 0.72, 0, 1] as const;

function StepMark({ status }: { status: ReasoningStepStatus }) {
  if (status === "done") {
    return <span className="mt-[7px] inline-flex h-1.5 w-1.5 shrink-0 rounded-full bg-ash" aria-hidden />;
  }
  if (status === "active") {
    return (
      <span className="relative mt-[5px] inline-flex h-2.5 w-2.5 shrink-0 items-center justify-center" aria-hidden>
        <motion.span
          className="absolute inline-flex h-full w-full rounded-full bg-pit"
          animate={{ scale: [1, 1.9], opacity: [0.5, 0] }}
          transition={{ duration: 1.2, repeat: Infinity, ease: "easeOut" }}
        />
        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-pit" />
      </span>
    );
  }
  return <span className="mt-[6px] inline-flex h-2 w-2 shrink-0 rounded-full border border-line" aria-hidden />;
}

export function ReasoningTrace({ steps, streaming = false, seconds, defaultOpen = false, className }: ReasoningTraceProps) {
  const [open, setOpen] = useState(streaming || defaultOpen);
  // open while streaming; fold once when the run finishes
  useEffect(() => {
    if (streaming) setOpen(true);
    else if (!defaultOpen) setOpen(false);
  }, [streaming, defaultOpen]);

  const done = steps.filter((s) => s.status === "done").length;
  const summary = streaming
    ? "Thinking"
    : `Thought${typeof seconds === "number" ? ` for ${seconds}s` : ""} · ${done} step${done === 1 ? "" : "s"}`;

  return (
    <div className={`w-full overflow-hidden rounded-xl border border-line bg-asphalt ${className ?? ""}`}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex min-h-11 w-full items-center gap-2.5 px-4 py-2.5 text-left"
      >
        <AnimatePresence initial={false} mode="wait">
          <motion.span
            key={streaming ? "thinking" : "done"}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.14 }}
            className="flex items-baseline gap-2.5"
          >
            <span className={`text-[13px] font-medium ${streaming ? "text-pit" : "text-smoke"}`}>{summary}</span>
            {streaming && <span className="text-[12px] tabular-nums text-ash">{done} of {steps.length}</span>}
          </motion.span>
        </AnimatePresence>
        <motion.span
          aria-hidden
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="ml-auto text-[11px] text-ash"
        >
          ▾
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: EASE }}
          >
            <ol className="border-t border-line px-4 py-2">
              {steps.map((step) => (
                <li key={step.label} className="flex gap-3 py-1.5">
                  <span className="relative inline-grid w-2.5 shrink-0 justify-items-center">
                    <AnimatePresence initial={false} mode="popLayout">
                      <motion.span
                        key={step.status}
                        className="col-start-1 row-start-1 inline-flex"
                        initial={{ opacity: 0, scale: 0.6 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.6 }}
                        transition={{ duration: 0.2 }}
                      >
                        <StepMark status={step.status} />
                      </motion.span>
                    </AnimatePresence>
                  </span>
                  <div className="min-w-0 flex-1">
                    <div
                      className={`text-[13px] leading-snug transition-colors duration-300 ${
                        step.status === "active" ? "text-chalk" : step.status === "done" ? "text-smoke" : "text-ash"
                      }`}
                    >
                      {step.label}
                    </div>
                    <AnimatePresence initial={false}>
                      {step.status !== "pending" && (step.detail || step.sources?.length) && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.26, ease: EASE }}
                          className="overflow-hidden"
                        >
                          {step.detail && <div className="mt-0.5 text-[12px] leading-snug text-ash">{step.detail}</div>}
                          {step.sources && step.sources.length > 0 && (
                            <div className="mt-1.5 flex flex-wrap gap-1.5">
                              {step.sources.map((s) => (
                                <span key={s} className="rounded border border-line px-1.5 py-px font-mono text-[11px] text-ash">
                                  {s}
                                </span>
                              ))}
                            </div>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </li>
              ))}
            </ol>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
