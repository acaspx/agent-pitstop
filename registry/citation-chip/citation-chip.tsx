"use client";

/**
 * CitationChip — Agent Pit Stop
 * An inline source marker on a claim, and the drawer it opens. The chip
 * sits right after the sentence it supports; the drawer shows the exact
 * passage the agent relied on, so checking a claim takes one tap, not a
 * new search.
 *
 * Principles applied:
 * - Calibrated trust: every claim points at its evidence, and a claim
 *   with no chip reads, correctly, as unsupported
 * - Legible thinking: the quoted passage shows what the agent read, not
 *   only where it went
 * - Graceful failure: a source that couldn't be reached says so on the
 *   chip instead of silently disappearing
 *
 * Accessibility:
 * - Keyboard: chips are buttons; Escape inside the drawer closes it.
 * - Screen reader: a chip reads "Source 1: <title>", and says when the source could not be reached; the drawer is a region named Sources.
 * - Motion: the drawer fades and rises 8px.
 * - Host: one chip right after the sentence it supports; keep `index` matching the drawer's order.
 */

import { AnimatePresence, motion } from "motion/react";

export interface Source {
  /** Page or document title */
  title: string;
  /** Short domain shown on the chip, e.g. "reuters.com" */
  domain: string;
  url?: string;
  /** The passage the claim rests on */
  quote?: string;
  /** True when the agent couldn't reach the source to verify it */
  unreachable?: boolean;
}

export interface CitationChipProps {
  /** 1-based number shown on the chip */
  index: number;
  source: Source;
  /** Marks the chip whose source is open in the drawer */
  active?: boolean;
  onOpen?: (index: number) => void;
  /** Extra classes merged onto the root element */
  className?: string;
}

export function CitationChip({ index, source, active, onOpen, className }: CitationChipProps) {
  return (
    <button
      type="button"
      onClick={() => onOpen?.(index)}
      aria-label={`Source ${index}: ${source.title}${source.unreachable ? " (couldn't be reached)" : ""}`}
      className={`relative -top-px mx-0.5 inline-flex items-center gap-1 rounded-md border px-1.5 align-baseline font-mono text-[11px] leading-[18px] transition-colors pointer-coarse:min-h-11 ${
        active
          ? "border-pit/60 bg-pit/10 text-pit"
          : source.unreachable
            ? "border-dashed border-line text-ash hover:text-smoke"
            : "border-line text-smoke hover:border-ash hover:text-chalk"
      } ${className ?? ""}`}
    >
      <span>{index}</span>
      <span className="max-w-[9rem] truncate">{source.domain}</span>
    </button>
  );
}

export interface SourceDrawerProps {
  sources: Source[];
  /** 1-based index of the open source, or null when closed */
  activeIndex: number | null;
  onSelect?: (index: number) => void;
  onClose?: () => void;
  /** Extra classes merged onto the root element */
  className?: string;
}

export function SourceDrawer({ sources, activeIndex, onSelect, onClose, className }: SourceDrawerProps) {
  const active = activeIndex ? sources[activeIndex - 1] : null;
  return (
    <AnimatePresence initial={false}>
      {active && (
        <motion.aside
          key="drawer"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          transition={{ duration: 0.22, ease: [0.32, 0.72, 0, 1] }}
          aria-label="Sources"
          onKeyDown={(e) => e.key === "Escape" && onClose?.()}
          className={`w-full overflow-hidden rounded-xl border border-line bg-asphalt ${className ?? ""}`}
        >
          <div className="flex items-center gap-2 border-b border-line px-4 py-2.5">
            <span className="text-[13px] font-medium text-chalk">Sources</span>
            <span className="font-mono text-[12px] text-ash">{sources.length}</span>
            <button
              type="button"
              onClick={onClose}
              className="ml-auto min-h-8 rounded-md px-2 text-[12px] text-smoke hover:text-chalk pointer-coarse:min-h-11"
            >
              Close
            </button>
          </div>
          <div className="flex gap-1.5 overflow-x-auto border-b border-line px-4 py-2">
            {sources.map((s, i) => (
              <CitationChip key={s.title} index={i + 1} source={s} active={i + 1 === activeIndex} onOpen={onSelect} />
            ))}
          </div>
          <div className="px-4 py-3">
            <div className="text-[13px] font-medium text-chalk">{active.title}</div>
            <div className="mt-0.5 font-mono text-[12px] text-ash">{active.domain}</div>
            {active.unreachable ? (
              <p className="mt-3 text-[13px] leading-relaxed text-caution">
                Couldn&apos;t reach this source to check it. Treat the claim as unverified.
              </p>
            ) : (
              active.quote && (
                <blockquote className="mt-3 border-l-2 border-pit/60 pl-3 text-[13px] leading-relaxed text-smoke">
                  {active.quote}
                </blockquote>
              )
            )}
            {active.url && !active.unreachable && (
              <a href={active.url} className="mt-3 inline-block text-[12px] text-pit hover:underline">
                Open source ↗
              </a>
            )}
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
