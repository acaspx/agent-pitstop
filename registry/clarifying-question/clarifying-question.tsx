"use client";

/**
 * ClarifyingQuestion — Agent Pit Stop
 * One question the agent needs answered before it goes further, with the
 * likely answers ready to tap and room for your own. Once answered it folds
 * to a single line that says what you chose, so the run's history keeps it.
 *
 * Principles applied:
 * - Delegation contracts: the agent asks instead of guessing when a choice
 *   would change the outcome, and says why it is asking
 * - Interruptibility: asking is a planned pause; skipping lets the agent go
 *   on with its stated default
 * - Legible thinking: the folded answer stays in the thread as a record
 *
 * Accessibility:
 * - Keyboard: each option is a button; keys 1 to 9 pick an option while it is open (not while typing); in multi mode options are checkboxes toggled with Space.
 * - Screen reader: the options are a list named by the question; once answered it reads "You chose …".
 * - Motion: opacity only.
 * - Host: ask one question at a time; set `fallback` whenever the agent has a sensible default.
 */

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";

export interface ClarifyingOption {
  label: string;
  /** One line on what this choice means for the run */
  detail?: string;
}

export interface ClarifyingQuestionProps {
  question: string;
  /** Why the agent is asking, e.g. "This changes which files I edit" */
  why?: string;
  options: ClarifyingOption[];
  /** Allow choosing more than one option */
  multi?: boolean;
  /** Show a free-text "Something else" field */
  allowOther?: boolean;
  /** What the agent does if the person skips; shows a Skip button when set */
  fallback?: string;
  /** Controlled answer; omit to let the component manage it */
  answer?: string[] | null;
  onAnswer?: (answer: string[]) => void;
  onSkip?: () => void;
  /** Extra classes merged onto the root element */
  className?: string;
}

export function ClarifyingQuestion({
  question,
  why,
  options,
  multi = false,
  allowOther = false,
  fallback,
  answer: controlled,
  onAnswer,
  onSkip,
  className,
}: ClarifyingQuestionProps) {
  const root = useRef<HTMLDivElement>(null);
  const [picked, setPicked] = useState<string[]>([]);
  const [other, setOther] = useState("");
  const [internal, setInternal] = useState<string[] | null>(null);
  const [skipped, setSkipped] = useState(false);
  const answer = controlled !== undefined ? controlled : internal;

  const submit = (values: string[]) => {
    if (!values.length) return;
    if (controlled === undefined) setInternal(values);
    onAnswer?.(values);
  };

  const toggle = (label: string) => {
    if (!multi) return submit([label]);
    setPicked((p) => (p.includes(label) ? p.filter((x) => x !== label) : [...p, label]));
  };

  // number keys pick options while the question is open
  useEffect(() => {
    if (answer || skipped) return;
    const onKey = (e: KeyboardEvent) => {
      // A copy shown for reference (inside an inert region, like a states grid) ignores keys.
      if (root.current?.closest("[inert]")) return;
      const t = e.target as HTMLElement | null;
      if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable)) return;
      const n = Number(e.key);
      if (n >= 1 && n <= options.length) toggle(options[n - 1].label);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [answer, skipped, options, multi]);

  const closed = Boolean(answer) || skipped;

  return (
    <div ref={root} className={`w-full overflow-hidden rounded-xl border border-line bg-asphalt ${className ?? ""}`}>
      <AnimatePresence initial={false} mode="wait">
        {closed ? (
          <motion.div
            key="closed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-2 px-4 py-3 text-[13px]"
          >
            <span className="text-ash">{question}</span>
            <span className="ml-auto shrink-0 text-chalk">
              {skipped ? `Skipped · ${fallback ?? "agent's default"}` : `You chose ${answer!.join(", ")}`}
            </span>
          </motion.div>
        ) : (
          <motion.div key="open" exit={{ opacity: 0 }} transition={{ duration: 0.15 }}>
            <div className="px-4 pb-2 pt-3.5">
              <div className="text-[14px] font-medium leading-snug text-chalk">{question}</div>
              {why && <div className="mt-1 text-[12px] leading-snug text-ash">{why}</div>}
            </div>
            <ul className="px-2 pb-2" aria-label={question}>
              {options.map((o, i) => {
                const on = picked.includes(o.label);
                return (
                  <li key={o.label}>
                    <button
                      type="button"
                      role={multi ? "checkbox" : undefined}
                      aria-checked={multi ? on : undefined}
                      onClick={() => toggle(o.label)}
                      className={`flex min-h-11 w-full items-start gap-3 rounded-lg px-2 py-2 text-left transition-colors hover:bg-carbon ${
                        on ? "bg-carbon" : ""
                      }`}
                    >
                      <span
                        className={`mt-px inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-md border font-mono text-[11px] ${
                          on ? "border-pit bg-pit/15 text-pit" : "border-line text-ash"
                        }`}
                      >
                        {i + 1}
                      </span>
                      <span className="min-w-0">
                        <span className="block text-[13px] text-chalk">{o.label}</span>
                        {o.detail && <span className="mt-0.5 block text-[12px] text-ash">{o.detail}</span>}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
            {allowOther && (
              <form
                className="flex gap-2 border-t border-line px-4 py-2.5"
                onSubmit={(e) => {
                  e.preventDefault();
                  if (other.trim()) submit([...picked, other.trim()]);
                }}
              >
                <input
                  value={other}
                  onChange={(e) => setOther(e.target.value)}
                  placeholder="Something else…"
                  aria-label="Something else"
                  className="min-h-9 min-w-0 flex-1 rounded-lg border border-line bg-carbon px-3 text-[13px] text-chalk placeholder:text-ash focus:border-ash focus:outline-none pointer-coarse:min-h-11"
                />
                <button
                  type="submit"
                  disabled={!other.trim()}
                  className="min-h-9 shrink-0 rounded-lg border border-line px-3 text-[12px] font-medium text-smoke enabled:hover:text-chalk disabled:opacity-40 pointer-coarse:min-h-11"
                >
                  Send
                </button>
              </form>
            )}
            {(multi || fallback) && (
              <div className="flex items-center gap-2 border-t border-line px-4 py-2.5">
                {fallback && (
                  <button
                    type="button"
                    onClick={() => {
                      setSkipped(true);
                      onSkip?.();
                    }}
                    className="min-h-8 rounded-md text-[12px] text-ash hover:text-smoke pointer-coarse:min-h-11"
                  >
                    Skip, {fallback}
                  </button>
                )}
                {multi && (
                  <button
                    type="button"
                    disabled={!picked.length}
                    onClick={() => submit(picked)}
                    className="ml-auto min-h-8 rounded-lg bg-chalk px-3 text-[12px] font-medium text-track enabled:hover:opacity-85 disabled:opacity-40 pointer-coarse:min-h-11"
                  >
                    Continue with {picked.length || "none"}
                  </button>
                )}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
