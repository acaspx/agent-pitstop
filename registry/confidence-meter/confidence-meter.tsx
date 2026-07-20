"use client";

/**
 * ConfidenceMeter — Agent Pit Stop
 * Honest uncertainty display: confidence as coarse bands, never
 * decimal theater, paired with a verification affordance exactly
 * when doubt is warranted.
 *
 * Principles applied:
 * - Calibrated trust: three bands, not "87.3%"; the display can't
 *   pretend to precision the model doesn't have
 * - Legible thinking: the claim and its basis stay together
 * - Delegation contracts: below the threshold, the meter turns into
 *   a request for human judgment instead of a decoration
 */

import { motion } from "motion/react";

export type ConfidenceBand = "low" | "medium" | "high";

export interface ConfidenceMeterProps {
  /** The claim being qualified, e.g. "This invoice matches PO #4412" */
  claim: string;
  /** Model confidence 0..1; rendered as a band, not a number */
  confidence: number;
  /** What the confidence is based on, e.g. "3 matching fields, 1 OCR gap" */
  basis?: string;
  /** Below this, the verify affordance becomes prominent (default 0.75) */
  threshold?: number;
  onVerify?: () => void;
  verifyLabel?: string;
}

export function bandOf(confidence: number): ConfidenceBand {
  if (confidence >= 0.75) return "high";
  if (confidence >= 0.45) return "medium";
  return "low";
}

const bandMeta: Record<ConfidenceBand, { label: string; segments: number; color: string; text: string }> = {
  low: { label: "Low confidence", segments: 1, color: "bg-flag", text: "text-flag" },
  medium: { label: "Medium confidence", segments: 2, color: "bg-caution", text: "text-caution" },
  high: { label: "High confidence", segments: 3, color: "bg-signal", text: "text-signal" },
};

export function ConfidenceMeter({
  claim,
  confidence,
  basis,
  threshold = 0.75,
  onVerify,
  verifyLabel = "Check this",
}: ConfidenceMeterProps) {
  const band = bandOf(confidence);
  const meta = bandMeta[band];
  const needsVerification = confidence < threshold;

  return (
    <div className="w-full rounded-xl border border-line bg-asphalt px-4 py-3">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="text-[13px] leading-snug text-chalk">{claim}</div>
          {basis && <div className="mt-0.5 truncate text-[12px] text-ash">Based on: {basis}</div>}
        </div>
        <div className="shrink-0 text-right">
          <div className="flex justify-end gap-1" role="img" aria-label={meta.label}>
            {[0, 1, 2].map((i) => (
              <motion.span
                key={i}
                initial={false}
                animate={{ opacity: i < meta.segments ? 1 : 0.18 }}
                transition={{ duration: 0.3, delay: i * 0.06 }}
                className={`h-1.5 w-5 rounded-full ${i < meta.segments ? meta.color : "bg-smoke"}`}
              />
            ))}
          </div>
          <div className={`mt-1 text-[11px] font-medium ${meta.text}`}>{meta.label}</div>
        </div>
      </div>

      {needsVerification && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          transition={{ duration: 0.25, ease: [0.32, 0.72, 0, 1] }}
          className="overflow-hidden"
        >
          <div className="mt-3 flex items-center justify-between gap-3 border-t border-line pt-3">
            <span className="text-[12px] text-smoke">
              Worth a human look before this is used downstream.
            </span>
            <button
              type="button"
              onClick={onVerify}
              className="min-h-9 shrink-0 rounded-lg bg-chalk px-3 py-1.5 text-[12px] font-medium text-track transition-opacity hover:opacity-85 pointer-coarse:min-h-11"
            >
              {verifyLabel}
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
