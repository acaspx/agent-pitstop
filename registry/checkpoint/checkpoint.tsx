"use client";

/**
 * Checkpoint — Agent Pit Stop
 * The run's save points, newest at the top, and a way back to any of
 * them. Restoring asks once, inline, and says exactly what will be undone,
 * so rewinding is a routine move instead of a leap.
 *
 * Principles applied:
 * - Graceful failure: a bad turn costs one step back, not the whole run
 * - Interruptibility: the way back is visible during the run, not only
 *   after it fails
 * - Delegation contracts: restore names what it undoes before it undoes it
 *
 * Accessibility:
 * - Keyboard: Restore opens an inline confirm that takes focus; Escape keeps going.
 * - Screen reader: "You are here" reads in words; each Restore names its checkpoint, and the confirm says what will be undone.
 * - Motion: opacity, scale and height on the confirm only.
 * - Host: give `undoes` for every checkpoint but the current one.
 */

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";

export interface CheckpointEntry {
  id: string;
  /** What was true at this point, e.g. "Tests passing, before refactor" */
  label: string;
  /** When, as shown to the person, e.g. "2 min ago" */
  time: string;
  /** What restoring here undoes, e.g. "3 file edits" */
  undoes?: string;
}

export interface CheckpointProps {
  /** Newest first; the first entry is the current state */
  checkpoints: CheckpointEntry[];
  /** Id of the checkpoint the run is at (defaults to the first) */
  current?: string;
  onRestore?: (id: string) => void;
  /** Controlled id of the checkpoint whose restore confirm is open */
  confirming?: string | null;
  onConfirmingChange?: (id: string | null) => void;
  /** Extra classes merged onto the root element */
  className?: string;
}

export function Checkpoint({
  checkpoints,
  current,
  onRestore,
  confirming: controlledConfirming,
  onConfirmingChange,
  className,
}: CheckpointProps) {
  const [internalConfirming, setInternalConfirming] = useState<string | null>(null);
  const confirming = controlledConfirming !== undefined ? controlledConfirming : internalConfirming;
  const setConfirming = (id: string | null) => {
    if (controlledConfirming === undefined) setInternalConfirming(id);
    onConfirmingChange?.(id);
  };
  const [internal, setInternal] = useState<string | undefined>(undefined);
  const at = current ?? internal ?? checkpoints[0]?.id;

  // The confirm opens in place of the Restore button: take focus to it, so the keyboard
  // lands on the choice rather than on nothing.
  const confirmRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (confirming) confirmRef.current?.focus();
  }, [confirming]);

  const restore = (id: string) => {
    setConfirming(null);
    if (current === undefined) setInternal(id);
    onRestore?.(id);
  };

  return (
    <div className={`w-full overflow-hidden rounded-xl border border-line bg-asphalt ${className ?? ""}`}>
      <div className="flex items-center justify-between border-b border-line px-4 py-2.5">
        <span className="text-[13px] font-medium text-chalk">Checkpoints</span>
        <span className="font-mono text-[12px] text-ash">{checkpoints.length}</span>
      </div>
      <ol className="relative px-4 py-2">
        {/* the timeline rail */}
        <span aria-hidden className="absolute bottom-5 left-[21px] top-5 w-px bg-line" />
        {checkpoints.map((c) => {
          const isAt = c.id === at;
          return (
            <li key={c.id} className="relative py-1.5">
              <div className="flex items-start gap-3">
                <span
                  aria-hidden
                  className={`relative z-[1] mt-[5px] inline-flex h-2.5 w-2.5 shrink-0 rounded-full border-2 ${
                    isAt ? "border-pit bg-pit" : "border-line bg-asphalt"
                  }`}
                />
                <div className="min-w-0 flex-1">
                  <div className={`text-[13px] leading-snug ${isAt ? "text-chalk" : "text-smoke"}`}>{c.label}</div>
                  <div className="mt-0.5 text-[12px] text-ash">{isAt ? `You are here · ${c.time}` : c.time}</div>
                </div>
                <AnimatePresence initial={false}>
                {!isAt && confirming !== c.id && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0.92 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.92 }}
                    transition={{ duration: 0.18 }}
                    type="button"
                    onClick={() => setConfirming(c.id)}
                    aria-label={`Restore to ${c.label}`}
                    className="min-h-8 shrink-0 rounded-md border border-line px-2.5 text-[12px] font-medium text-smoke transition-colors hover:border-ash hover:text-chalk pointer-coarse:min-h-11"
                  >
                    Restore
                  </motion.button>
                )}
                </AnimatePresence>
              </div>
              <AnimatePresence initial={false}>
                {confirming === c.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.22, ease: [0.32, 0.72, 0, 1] }}
                  >
                    <div
                      className="ml-[22px] mt-2 rounded-lg border border-line bg-carbon px-3 py-2.5"
                      role="group"
                      aria-label={`Restore to ${c.label}?`}
                      onKeyDown={(e) => e.key === "Escape" && setConfirming(null)}
                    >
                      <p className="text-[12px] leading-relaxed text-smoke">
                        Restore to here? This undoes {c.undoes ?? "everything after it"}.
                      </p>
                      <div className="mt-2 flex gap-2">
                        <button
                          ref={confirmRef}
                          type="button"
                          onClick={() => restore(c.id)}
                          className="min-h-8 rounded-lg bg-chalk px-3 text-[12px] font-medium text-track hover:opacity-85 pointer-coarse:min-h-11"
                        >
                          Restore
                        </button>
                        <button
                          type="button"
                          onClick={() => setConfirming(null)}
                          className="min-h-8 rounded-lg border border-line px-3 text-[12px] font-medium text-smoke hover:text-chalk pointer-coarse:min-h-11"
                        >
                          Keep going
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
