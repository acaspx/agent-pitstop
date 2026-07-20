"use client";

/**
 * ContextBudget — Agent Pit Stop
 * A delegation contract's limits, made visible: tokens, spend, or time
 * against their caps. Budgets nobody can see are budgets nobody trusts.
 *
 * Principles applied:
 * - Delegation contracts: the cap is part of the agreed scope; showing
 *   consumption is honoring the contract in public
 * - Calibrated trust: honest bands (fine / near cap / over), labeled in
 *   words, never color alone
 * - Graceful failure: hitting a cap is a rendered state with a next step,
 *   not a silent stall
 */

import { motion } from "motion/react";

export interface BudgetLine {
  /** e.g. "Spend", "Tokens", "Time" */
  label: string;
  used: number;
  cap: number;
  /** Formatter for display, e.g. (n) => `$${n}` */
  format?: (n: number) => string;
}

export interface ContextBudgetProps {
  lines: BudgetLine[];
  label?: string;
  /** Called when the human raises a cap after one is hit */
  onRaise?: (label: string) => void;
}

function bandFor(pct: number): { word: string; bar: string; text: string } {
  if (pct >= 1) return { word: "At cap", bar: "bg-flag", text: "text-flag" };
  if (pct >= 0.8) return { word: "Near cap", bar: "bg-caution", text: "text-caution" };
  return { word: "Fine", bar: "bg-pit", text: "text-smoke" };
}

export function ContextBudget({ lines, label = "Run budget", onRaise }: ContextBudgetProps) {
  return (
    <div className="w-full rounded-xl border border-line bg-asphalt px-4 py-3">
      <div className="flex items-center justify-between pb-1">
        <span className="text-[13px] font-medium text-chalk">{label}</span>
      </div>
      <ul className="space-y-3 pt-1">
        {lines.map((line) => {
          const pct = Math.min(line.used / line.cap, 1);
          const band = bandFor(line.used / line.cap);
          const fmt = line.format ?? ((n: number) => String(n));
          const atCap = line.used >= line.cap;
          return (
            <li key={line.label}>
              <div className="flex items-baseline justify-between gap-3 text-[12.5px]">
                <span className="text-smoke">{line.label}</span>
                <span className="font-mono text-[12px]">
                  <span className="text-chalk">{fmt(line.used)}</span>
                  <span className="text-ash"> / {fmt(line.cap)}</span>
                  <span className={`ml-2 ${band.text}`}>{band.word}</span>
                </span>
              </div>
              <div
                className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-barrier"
                role="progressbar"
                aria-label={`${line.label}: ${fmt(line.used)} of ${fmt(line.cap)}`}
                aria-valuenow={line.used}
                aria-valuemin={0}
                aria-valuemax={line.cap}
              >
                <motion.div
                  className={`h-full rounded-full ${band.bar}`}
                  initial={false}
                  animate={{ width: `${pct * 100}%` }}
                  transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
                />
              </div>
              {atCap && (
                <div className="mt-2 flex items-center justify-between gap-3">
                  <span className="text-[12px] text-smoke">
                    Paused at the {line.label.toLowerCase()} cap. Nothing spent past it.
                  </span>
                  {onRaise && (
                    <button
                      type="button"
                      onClick={() => onRaise(line.label)}
                      className="min-h-9 shrink-0 rounded-lg bg-chalk px-3 py-1.5 text-[12px] font-medium text-track transition-opacity hover:opacity-85 pointer-coarse:min-h-11"
                    >
                      Raise cap
                    </button>
                  )}
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
