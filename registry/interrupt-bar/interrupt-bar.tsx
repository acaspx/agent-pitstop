"use client";

/**
 * InterruptBar — Agent Pit Stop
 * The steering wheel and the brake for a running agent. Stop is always
 * one click away and never destructive; steering redirects the run
 * without cancelling it.
 *
 * Principles applied:
 * - Interruptibility: stop and steer are visible the entire run, not
 *   buried in a menu; the agent acknowledges interrupts immediately
 * - Graceful failure: stopping preserves partial work and says so,
 *   because a brake you're afraid to use is not a brake
 * - Legible thinking: the bar shows what the agent is doing right now,
 *   so the user knows what they'd be interrupting
 */

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";

export type InterruptBarState = "running" | "stopped";

export interface InterruptBarProps {
  /** What the agent is doing right now, e.g. "Comparing 14 flights" */
  activity: string;
  /** Seconds elapsed in the run */
  elapsed?: number;
  state?: InterruptBarState;
  /** What was kept when stopped, e.g. "Search results saved" */
  keptOnStop?: string;
  onStop?: () => void;
  /** Called with the user's mid-run redirect */
  onSteer?: (message: string) => void;
  /** The agent's acknowledgment of the last steer, shown inline */
  acknowledgment?: string;
  /** Extra classes merged onto the root element */
  className?: string;
}

export function InterruptBar({
  activity,
  elapsed,
  state: controlled,
  keptOnStop = "Partial work kept",
  onStop,
  onSteer,
  acknowledgment,
  className,
}: InterruptBarProps) {
  const [internal, setInternal] = useState<InterruptBarState>("running");
  const [draft, setDraft] = useState("");
  const state = controlled ?? internal;

  const stop = () => {
    if (controlled === undefined) setInternal("stopped");
    onStop?.();
  };

  const steer = () => {
    const msg = draft.trim();
    if (!msg) return;
    setDraft("");
    onSteer?.(msg);
  };

  return (
    <div className={`w-full overflow-hidden rounded-xl border border-line bg-asphalt ${className ?? ""}`}>
      <AnimatePresence mode="wait" initial={false}>
        {state === "running" ? (
          <motion.div key="running" exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
            <div className="flex items-center gap-3 px-4 py-3">
              <span className="relative flex h-2 w-2 shrink-0">
                <motion.span
                  className="absolute inline-flex h-full w-full rounded-full bg-pit"
                  animate={{ scale: [1, 2.2], opacity: [0.6, 0] }}
                  transition={{ duration: 1.2, repeat: Infinity, ease: "easeOut" }}
                />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-pit" />
              </span>
              <span className="min-w-0 flex-1 truncate text-[13px] text-chalk">{activity}</span>
              {typeof elapsed === "number" && (
                <span className="shrink-0 font-mono text-[12px] text-ash">{elapsed}s</span>
              )}
              <button
                type="button"
                onClick={stop}
                className="min-h-9 shrink-0 rounded-lg border border-line px-3 py-1.5 text-[13px] font-medium text-smoke transition-colors hover:border-flag/50 hover:text-flag pointer-coarse:min-h-11"
              >
                Stop
              </button>
            </div>

            <AnimatePresence initial={false}>
              {acknowledgment && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25, ease: [0.32, 0.72, 0, 1] }}
                >
                  <div className="flex items-center gap-2 border-t border-line px-4 py-2">
                    <span className="inline-flex h-1.5 w-1.5 shrink-0 rounded-full bg-signal" aria-hidden />
                    <span className="truncate text-[12px] text-smoke">{acknowledgment}</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex items-center gap-2 border-t border-line px-4 py-2.5">
              <input
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && steer()}
                placeholder="Steer the agent without stopping it…"
                aria-label="Steer the agent"
                className="min-w-0 flex-1 bg-transparent text-[13px] text-chalk outline-none placeholder:text-ash"
              />
              <button
                type="button"
                onClick={steer}
                disabled={!draft.trim()}
                className="min-h-9 shrink-0 rounded-lg bg-barrier px-3 py-1 text-[12px] font-medium text-smoke transition-colors enabled:hover:text-chalk disabled:opacity-40 pointer-coarse:min-h-11"
              >
                Send
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="stopped"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="flex items-center gap-3 px-4 py-3"
          >
            <span className="inline-flex h-2 w-2 shrink-0 rounded-full bg-caution" aria-hidden />
            <span className="min-w-0 flex-1 truncate text-[13px] text-smoke">
              Stopped by you · {keptOnStop}
            </span>
            <span className="shrink-0 text-[12px] font-medium text-caution">Stopped</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
