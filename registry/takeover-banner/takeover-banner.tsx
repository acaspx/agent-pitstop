"use client";

/**
 * TakeoverBanner — Agent Pit Stop
 * Who has the wheel, said plainly. When an agent is driving a browser or
 * an app, this bar shows whether it is acting, waiting for you, or paused
 * while you act, and moves control between you in one click each way.
 *
 * Principles applied:
 * - Interruptibility: taking over is always one click, whatever the agent
 *   is doing
 * - Delegation contracts: the agent hands over for sign-ins, payments and
 *   anything it shouldn't type, and says why
 * - Calibrated trust: while you drive, the agent isn't watching, and the
 *   banner says so
 */

import { AnimatePresence, motion } from "motion/react";

export type TakeoverState = "agent" | "needs-you" | "you" | "resuming";

export interface TakeoverBannerProps {
  state: TakeoverState;
  /** What the agent is doing, or why it needs you, e.g. "Sign in to continue" */
  reason?: string;
  onTakeOver?: () => void;
  onHandBack?: () => void;
  /** Shown while the person drives (default: the agent can't see the screen) */
  privacyNote?: string;
  /** Extra classes merged onto the root element */
  className?: string;
}

const COPY: Record<TakeoverState, { lead: string; tone: string; dot: string }> = {
  agent: { lead: "Agent is driving", tone: "text-chalk", dot: "bg-pit" },
  "needs-you": { lead: "Your turn", tone: "text-caution", dot: "bg-caution" },
  you: { lead: "You're driving", tone: "text-signal", dot: "bg-signal" },
  resuming: { lead: "Agent is picking up where you left off", tone: "text-smoke", dot: "bg-ash" },
};

export function TakeoverBanner({
  state,
  reason,
  onTakeOver,
  onHandBack,
  privacyNote = "The agent can't see the screen while you drive.",
  className,
}: TakeoverBannerProps) {
  const c = COPY[state];
  return (
    <div
      role="status"
      aria-live="polite"
      className={`w-full overflow-hidden rounded-xl border bg-asphalt transition-colors duration-300 ${
        state === "needs-you" ? "border-caution/40" : state === "you" ? "border-signal/40" : "border-line"
      } ${className ?? ""}`}
    >
      <div className="flex min-h-14 items-center gap-3 px-4 py-2.5">
        <span className="relative inline-flex h-2 w-2 shrink-0" aria-hidden>
          {(state === "agent" || state === "needs-you") && (
            <motion.span
              className={`absolute inline-flex h-full w-full rounded-full ${c.dot}`}
              animate={{ scale: [1, 2.2], opacity: [0.5, 0] }}
              transition={{ duration: 1.3, repeat: Infinity, ease: "easeOut" }}
            />
          )}
          <span className={`relative inline-flex h-2 w-2 rounded-full ${c.dot}`} />
        </span>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={state}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.18 }}
            className="min-w-0 flex-1"
          >
            <div className={`text-[13px] font-medium ${c.tone}`}>{c.lead}</div>
            {state === "you" ? (
              <div className="mt-0.5 text-[12px] text-ash">{privacyNote}</div>
            ) : (
              reason && <div className="mt-0.5 truncate text-[12px] text-ash">{reason}</div>
            )}
          </motion.div>
        </AnimatePresence>
        {(state === "agent" || state === "needs-you") && (
          <button
            type="button"
            onClick={onTakeOver}
            className={`min-h-9 shrink-0 rounded-lg px-3 text-[12px] font-medium transition-opacity pointer-coarse:min-h-11 ${
              state === "needs-you" ? "bg-chalk text-track hover:opacity-85" : "border border-line text-smoke hover:text-chalk"
            }`}
          >
            Take over
          </button>
        )}
        {state === "you" && (
          <button
            type="button"
            onClick={onHandBack}
            className="min-h-9 shrink-0 rounded-lg bg-chalk px-3 text-[12px] font-medium text-track hover:opacity-85 pointer-coarse:min-h-11"
          >
            Hand back
          </button>
        )}
      </div>
    </div>
  );
}
