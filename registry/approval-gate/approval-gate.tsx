"use client";

/**
 * ApprovalGate — Agent Pit Stop
 * An inline permission request: the agent states what it wants to do,
 * shows the exact scope, and waits. Nothing moves until the human says so.
 *
 * Principles applied:
 * - Delegation contracts: scope is itemized before consent, never after
 * - Calibrated trust: the risky part of the action is visually distinct
 * - Interruptibility: denying is as easy and as prominent as approving
 * - Legible thinking: after the decision, the gate collapses to a receipt,
 *   preserving an audit trail without hogging the transcript
 */

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";

export interface ScopeItem {
  /** What the agent will do, e.g. "Send email to 3 recipients" */
  label: string;
  /** The concrete detail, e.g. "alice@, bob@, carol@acme.com" */
  detail?: string;
  /** Marks irreversible or externally visible actions */
  risky?: boolean;
}

export type ApprovalState = "awaiting" | "approved" | "denied";

export interface ApprovalGateProps {
  /** Plain-language request, e.g. "Send the Q3 summary email?" */
  title: string;
  /** Why the agent wants to do this */
  reason?: string;
  scope: ScopeItem[];
  /** Controlled state; omit to let the component manage it */
  state?: ApprovalState;
  onApprove?: () => void;
  onDeny?: () => void;
  approveLabel?: string;
  denyLabel?: string;
}

export function ApprovalGate({
  title,
  reason,
  scope,
  state: controlled,
  onApprove,
  onDeny,
  approveLabel = "Approve",
  denyLabel = "Deny",
}: ApprovalGateProps) {
  const [internal, setInternal] = useState<ApprovalState>("awaiting");
  const state = controlled ?? internal;

  const decide = (next: Exclude<ApprovalState, "awaiting">) => {
    if (controlled === undefined) setInternal(next);
    (next === "approved" ? onApprove : onDeny)?.();
  };

  return (
    <div className="w-full overflow-hidden rounded-xl border border-line bg-asphalt">
      <AnimatePresence mode="wait" initial={false}>
        {state === "awaiting" ? (
          <motion.div
            key="awaiting"
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: [0.32, 0.72, 0, 1] }}
          >
            <div className="border-b border-line px-4 py-3">
              <div className="flex items-center gap-2">
                <span className="inline-flex h-2 w-2 rounded-full bg-caution" aria-hidden />
                <span className="text-[12px] font-medium uppercase tracking-wide text-caution">
                  Waiting for you
                </span>
              </div>
              <div className="mt-1.5 text-[15px] font-medium text-chalk">{title}</div>
              {reason && <div className="mt-1 text-[13px] leading-relaxed text-smoke">{reason}</div>}
            </div>

            <ul className="px-4 py-2">
              {scope.map((item) => (
                <li key={item.label} className="flex items-start gap-2.5 py-2">
                  <span
                    aria-hidden
                    className={`mt-1.5 inline-flex h-1.5 w-1.5 shrink-0 rounded-full ${
                      item.risky ? "bg-flag" : "bg-ash"
                    }`}
                  />
                  <span className="min-w-0">
                    <span className="block text-[13px] text-chalk">
                      {item.label}
                      {item.risky && (
                        <span className="ml-2 rounded border border-flag/40 px-1.5 py-px text-[10px] font-medium uppercase tracking-wide text-flag">
                          Can&apos;t undo
                        </span>
                      )}
                    </span>
                    {item.detail && (
                      <span className="block truncate font-mono text-[12px] text-ash">{item.detail}</span>
                    )}
                  </span>
                </li>
              ))}
            </ul>

            <div className="flex gap-2 border-t border-line px-4 py-3">
              <button
                type="button"
                onClick={() => decide("approved")}
                className="rounded-lg bg-chalk px-3.5 py-1.5 text-[13px] font-medium text-track transition-opacity hover:opacity-85"
              >
                {approveLabel}
              </button>
              <button
                type="button"
                onClick={() => decide("denied")}
                className="rounded-lg border border-line px-3.5 py-1.5 text-[13px] font-medium text-smoke transition-colors hover:border-flag/50 hover:text-flag"
              >
                {denyLabel}
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="receipt"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="flex items-center gap-3 px-4 py-3"
          >
            <span
              aria-hidden
              className={`inline-flex h-2 w-2 rounded-full ${
                state === "approved" ? "bg-signal" : "bg-flag"
              }`}
            />
            <span className="min-w-0 flex-1 truncate text-[13px] text-smoke">{title}</span>
            <span
              className={`shrink-0 text-[12px] font-medium ${
                state === "approved" ? "text-signal" : "text-flag"
              }`}
            >
              {state === "approved" ? "Approved" : "Denied"}
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
