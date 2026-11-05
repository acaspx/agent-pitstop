"use client";

/**
 * ToolCallCard — Agent Pit Stop
 * Shows an agent's tool call with legible, progressive disclosure.
 *
 * Principles applied:
 * - Legible thinking: name + one-line intent always visible; args/result on demand
 * - Calibrated trust: state is color + icon + label, never color alone
 * - Graceful failure: errors keep the args visible so the human can diagnose,
 *   and open on their own the moment they arrive
 * - Delegation contracts: a call that needs permission waits inside its own
 *   card, saying what allowing does; Deny is never the loud button
 *
 * Accessibility:
 * - Keyboard: the header is one button; Enter or Space shows and hides the arguments and result. A waiting call's Deny and Allow are buttons, Deny first in tab order; after either, focus returns to the header.
 * - Screen reader: reads the tool name, the intent and the state in words ("Running · 3s", "Needs you", "Denied"); aria-expanded reports the disclosure; the approval is a group named by its question.
 * - Motion: the running pulse stops under prefers-reduced-motion.
 * - Host: update `state` on the same card instead of swapping cards, so its place in the transcript holds; write `intent` in the person's words, not the API's. For a waiting call, set `approval.consequence` to what allowing does, and move to "denied" (not "error") when the person says no.
 */

import { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";

export type ToolCallState = "pending" | "running" | "awaiting" | "success" | "error" | "denied" | "stopped";

export interface ToolCallApproval {
  /** The question, e.g. "Charge $612 to the Visa ending 4242?" */
  question: string;
  /** What allowing does, in a sentence, e.g. "Nonrefundable. The fare is booked at once." */
  consequence?: string;
}

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
  /** With state "awaiting": what the call needs permission for */
  approval?: ToolCallApproval;
  /** The person allowed the call; set state back to "running" */
  onAllow?: () => void;
  /** The person refused; set state to "denied", with their reason in `detail` if they gave one */
  onDeny?: () => void;
  allowLabel?: string;
  denyLabel?: string;
  /** Extra classes merged onto the root element */
  className?: string;
}

const stateMeta: Record<ToolCallState, { label: string; dot: string; text: string }> = {
  pending: { label: "Queued", dot: "bg-ash", text: "text-smoke" },
  running: { label: "Running", dot: "bg-pit", text: "text-pit" },
  awaiting: { label: "Needs you", dot: "bg-caution", text: "text-caution" },
  success: { label: "Done", dot: "bg-signal", text: "text-signal" },
  error: { label: "Failed", dot: "bg-flag", text: "text-flag" },
  // A refusal is the person's choice, not a failure: quiet, never red.
  denied: { label: "Denied", dot: "bg-ash", text: "text-smoke" },
  stopped: { label: "Stopped", dot: "bg-caution", text: "text-caution" },
};

export function ToolCallCard({
  name,
  intent,
  state,
  args,
  detail,
  elapsed,
  approval,
  onAllow,
  onDeny,
  allowLabel = "Allow",
  denyLabel = "Deny",
  className,
}: ToolCallCardProps) {
  // A failure or a question opens the card the moment it arrives.
  const [open, setOpen] = useState(state === "error" || state === "awaiting");
  useEffect(() => {
    if (state === "error" || state === "awaiting") setOpen(true);
  }, [state]);
  const meta = stateMeta[state];
  const expandable = Boolean(args || detail);
  const waiting = state === "awaiting";
  const questionId = useId();

  // Deny and Allow go away once the host moves the state on: hand focus back to the header.
  const header = useRef<HTMLButtonElement>(null);
  const decided = useRef(false);
  useEffect(() => {
    if (!waiting && decided.current) {
      decided.current = false;
      header.current?.focus();
    }
  }, [waiting]);
  const decide = (fn?: () => void) => () => {
    decided.current = true;
    fn?.();
  };

  return (
    <div className={`w-full overflow-hidden rounded-xl border border-line bg-asphalt ${className ?? ""}`}>
      <button
        ref={header}
        type="button"
        onClick={() => expandable && setOpen((v) => !v)}
        aria-expanded={expandable ? open : undefined}
        className="flex w-full items-center gap-3 px-4 py-3 text-left"
      >
        <span className="relative flex h-2 w-2 shrink-0">
          {state === "running" && (
            <motion.span
              className="motion-reduce:hidden absolute inline-flex h-full w-full rounded-full bg-pit"
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
                    {state === "error" ? "Error" : state === "denied" ? "Why" : state === "stopped" ? "Kept" : "Result"}
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

      <AnimatePresence initial={false}>
        {waiting && approval && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.32, 0.72, 0, 1] }}
          >
            <div role="group" aria-labelledby={questionId} className="border-t border-caution/30 bg-caution/5 px-4 py-3">
              <div id={questionId} className="text-[13px] font-medium text-chalk">
                {approval.question}
              </div>
              {approval.consequence && <div className="mt-1 text-[12px] leading-relaxed text-smoke">{approval.consequence}</div>}
              <div className="mt-3 flex gap-2">
                <button
                  type="button"
                  onClick={decide(onDeny)}
                  className="min-h-9 rounded-lg border border-line px-3 py-1.5 text-[12px] font-medium text-smoke transition-colors hover:text-chalk pointer-coarse:min-h-11"
                >
                  {denyLabel}
                </button>
                <button
                  type="button"
                  onClick={decide(onAllow)}
                  className="min-h-9 rounded-lg bg-chalk px-3 py-1.5 text-[12px] font-medium text-track transition-opacity hover:opacity-85 pointer-coarse:min-h-11"
                >
                  {allowLabel}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
