"use client";

/**
 * MemoryPanel — Agent Pit Stop
 * What the agent remembers about you, in its own words, with where each
 * memory came from and a way to forget it. Remembering can be paused, and
 * a forgotten memory can be brought back for a few seconds in case of a
 * slip.
 *
 * Principles applied:
 * - Calibrated trust: you can see exactly what shapes the agent's answers,
 *   and nothing it remembers is hidden
 * - Delegation contracts: remembering is something you allow, and pausing
 *   it is one switch
 * - Graceful failure: forgetting is undoable for a moment, then final
 */

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";

export interface Memory {
  id: string;
  /** The memory, written as the agent would say it back */
  text: string;
  /** Where it was learned, e.g. "Chat about travel" */
  source?: string;
  /** When, as shown to the person, e.g. "Oct 12" */
  learnedAt?: string;
}

export interface MemoryPanelProps {
  memories: Memory[];
  /** Called once a forget is final (after the undo window) */
  onForget?: (id: string) => void;
  /** Controlled paused state; omit to let the panel manage it */
  paused?: boolean;
  onPausedChange?: (paused: boolean) => void;
  /** How long Undo stays available, in ms (default 5000) */
  undoMs?: number;
  /** Extra classes merged onto the root element */
  className?: string;
}

export function MemoryPanel({ memories, onForget, paused: controlled, onPausedChange, undoMs = 5000, className }: MemoryPanelProps) {
  const [gone, setGone] = useState<string[]>([]);
  const [pending, setPending] = useState<Memory | null>(null);
  const [internalPaused, setInternalPaused] = useState(false);
  const paused = controlled ?? internalPaused;
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  const forget = (m: Memory) => {
    // finalize any earlier pending forget first
    if (timer.current) clearTimeout(timer.current);
    if (pending) onForget?.(pending.id);
    setGone((g) => [...g, m.id]);
    setPending(m);
    timer.current = setTimeout(() => {
      onForget?.(m.id);
      setPending(null);
    }, undoMs);
  };

  const undo = () => {
    if (!pending) return;
    if (timer.current) clearTimeout(timer.current);
    setGone((g) => g.filter((id) => id !== pending.id));
    setPending(null);
  };

  const togglePaused = () => {
    if (controlled === undefined) setInternalPaused(!paused);
    onPausedChange?.(!paused);
  };

  const shown = memories.filter((m) => !gone.includes(m.id));

  return (
    <div className={`w-full overflow-hidden rounded-xl border border-line bg-asphalt ${className ?? ""}`}>
      <div className="flex items-center gap-3 border-b border-line px-4 py-2.5">
        <span className="text-[13px] font-medium text-chalk">Memory</span>
        <span className="font-mono text-[12px] text-ash">{shown.length}</span>
        <button
          type="button"
          role="switch"
          aria-checked={!paused}
          onClick={togglePaused}
          className="ml-auto flex min-h-8 items-center gap-2 text-[12px] text-smoke hover:text-chalk pointer-coarse:min-h-11"
        >
          {paused ? "Paused" : "Remembering"}
          <span className={`relative inline-flex h-4 w-7 rounded-full transition-colors ${paused ? "bg-line" : "bg-pit"}`}>
            <motion.span
              className="absolute top-0.5 h-3 w-3 rounded-full bg-chalk"
              animate={{ left: paused ? 2 : 14 }}
              transition={{ type: "spring", stiffness: 500, damping: 32 }}
            />
          </span>
        </button>
      </div>
      {paused && (
        <div className="border-b border-line bg-carbon px-4 py-2 text-[12px] text-ash">
          Nothing new is saved while paused. What&apos;s here still applies.
        </div>
      )}
      <ul className="max-h-72 overflow-y-auto">
        <AnimatePresence initial={false}>
          {shown.map((m) => (
            <motion.li
              key={m.id}
              layout
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.22, ease: [0.32, 0.72, 0, 1] }}
              className="border-b border-line last:border-b-0"
            >
              <div className="flex items-start gap-3 px-4 py-2.5">
                <div className="min-w-0 flex-1">
                  <div className="text-[13px] leading-snug text-chalk">{m.text}</div>
                  {(m.source || m.learnedAt) && (
                    <div className="mt-0.5 text-[12px] text-ash">
                      {[m.source, m.learnedAt].filter(Boolean).join(" · ")}
                    </div>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => forget(m)}
                  aria-label={`Forget: ${m.text}`}
                  className="min-h-8 shrink-0 rounded-md px-2 text-[12px] text-ash transition-colors hover:text-flag pointer-coarse:min-h-11"
                >
                  Forget
                </button>
              </div>
            </motion.li>
          ))}
        </AnimatePresence>
        {shown.length === 0 && <li className="px-4 py-6 text-center text-[12px] text-ash">Nothing remembered yet.</li>}
      </ul>
      <AnimatePresence>
        {pending && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            className="flex items-center gap-2 border-t border-line bg-carbon px-4 py-2"
            role="status"
          >
            <span className="min-w-0 flex-1 truncate text-[12px] text-smoke">Forgot &ldquo;{pending.text}&rdquo;</span>
            <button
              type="button"
              onClick={undo}
              className="min-h-8 shrink-0 rounded-md px-2 text-[12px] font-medium text-pit hover:underline pointer-coarse:min-h-11"
            >
              Undo
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
