"use client";

/**
 * CitationChip — Agent Pit Stop
 * A claim's basis, one tap away. The inline chip marks a cited claim;
 * opening it reveals the exact source passage, verbatim, with a link
 * out. Paraphrase is not evidence.
 *
 * Principles applied:
 * - Calibrated trust: no claim travels without its basis; verification
 *   is one tap and cheaper than re-searching
 * - Legible thinking: evidence on demand, never dumped inline
 * - Graceful failure: a missing or dead source renders as "unverified,"
 *   not as a silently naked claim
 */

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";

export interface CitationSource {
  /** Source title, e.g. "Q3 earnings call transcript" */
  title: string;
  /** Link to the source */
  url?: string;
  /** The exact passage supporting the claim, quoted verbatim */
  quote?: string;
  /** Publisher or domain, e.g. "sec.gov" */
  publisher?: string;
  /** When the agent retrieved it, e.g. "2h ago" */
  retrieved?: string;
}

export interface CitationChipProps {
  /** Citation number shown in the chip */
  n: number;
  source: CitationSource;
  /** Controlled open state; omit to let the chip manage it */
  open?: boolean;
  onToggle?: (open: boolean) => void;
  /** Extra classes merged onto the root element */
  className?: string;
}

export function CitationChip({ n, source, open: controlled, onToggle, className }: CitationChipProps) {
  const [internal, setInternal] = useState(false);
  const open = controlled ?? internal;
  const unverified = !source.quote;

  const toggle = () => {
    const next = !open;
    if (controlled === undefined) setInternal(next);
    onToggle?.(next);
  };

  return (
    <span className={`inline ${className ?? ""}`}>
      <button
        type="button"
        onClick={toggle}
        aria-expanded={open}
        className={`mx-0.5 inline-flex min-h-6 items-center gap-1 rounded-md border px-1.5 py-0.5 align-baseline font-mono text-[11px] transition-colors pointer-coarse:min-h-8 ${
          open
            ? "border-pit/50 bg-pit/10 text-pit"
            : "border-line bg-asphalt text-smoke hover:border-ash hover:text-chalk"
        }`}
      >
        <span aria-hidden>{n}</span>
        {source.publisher && <span className="max-w-28 truncate">{source.publisher}</span>}
        <span className="sr-only">citation {n}: {source.title}</span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.span
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.32, 0.72, 0, 1] }}
            className="block overflow-hidden"
          >
            <span className="my-2 block rounded-xl border border-line bg-asphalt px-4 py-3">
              <span className="flex items-baseline justify-between gap-3">
                <span className="min-w-0 truncate text-[13px] font-medium text-chalk">
                  {source.title}
                </span>
                {source.retrieved && (
                  <span className="shrink-0 font-mono text-[11px] text-ash">{source.retrieved}</span>
                )}
              </span>
              {unverified ? (
                <span className="mt-1.5 flex items-center gap-2 text-[12.5px] text-caution">
                  <span aria-hidden>△</span> Unverified: the agent couldn&apos;t retrieve a supporting passage.
                </span>
              ) : (
                <span className="mt-1.5 block border-l-2 border-pit/50 pl-3 text-[13px] leading-relaxed text-smoke">
                  &ldquo;{source.quote}&rdquo;
                </span>
              )}
              {source.url && (
                <a
                  href={source.url}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-2 inline-flex min-h-6 items-center gap-1 text-[12px] text-pit hover:underline pointer-coarse:min-h-8"
                >
                  Open source ↗
                </a>
              )}
            </span>
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  );
}
