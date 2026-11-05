"use client";

/**
 * QuestionFlow — Agent Pit Stop
 * A short run of questions the agent needs answered before it starts, one at a time,
 * then a review of every answer before anything is sent. Each question can be skipped
 * when the agent has a sensible default, and any answer can be changed from the review.
 *
 * Principles applied:
 * - Delegation contracts: the answers are the brief, so the person sees all of them
 *   together and sends them once, instead of committing one tap at a time
 * - Interruptibility: Back and Change are always there; nothing is final until Send
 * - Legible thinking: each question says why it is being asked
 *
 * Accessibility:
 * - Keyboard: options are buttons; keys 1 to 9 pick one while a question is open (not while typing); Back, Skip, Change and Send answers are buttons.
 * - Screen reader: the progress ("Question 2 of 4") is announced as it changes, and focus moves to each new question, so the person always knows where they are.
 * - Motion: questions slide a few pixels as they change; nothing loops.
 * - Host: keep it to the questions that change the outcome (4 or fewer is a good limit); give `fallback` whenever the agent has a default; act only on onComplete.
 */

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";

export interface FlowOption {
  label: string;
  /** One line on what this choice means for the run */
  detail?: string;
}

export interface FlowQuestion {
  id: string;
  question: string;
  /** Why the agent is asking, e.g. "This decides which files I touch" */
  why?: string;
  options: FlowOption[];
  /** What the agent does if this is skipped; shows a Skip button when set */
  fallback?: string;
}

/** An answer per question id: the chosen label, or null when skipped (the fallback applies). */
export type FlowAnswers = Record<string, string | null>;

export interface QuestionFlowProps {
  questions: FlowQuestion[];
  /** Called once, with every answer, when the person sends them from the review */
  onComplete?: (answers: FlowAnswers) => void;
  /** Extra classes merged onto the root element */
  className?: string;
}

export function QuestionFlow({ questions, onComplete, className }: QuestionFlowProps) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<FlowAnswers>({});
  const [sent, setSent] = useState(false);
  const reviewing = step >= questions.length;
  const q = questions[step];
  const root = useRef<HTMLDivElement>(null);
  const heading = useRef<HTMLDivElement>(null);
  const moved = useRef(false);

  // Each new question (or the review) takes focus, so a keyboard or screen reader follows along.
  useEffect(() => {
    if (moved.current) heading.current?.focus();
  }, [step]);

  const go = (next: number) => {
    moved.current = true;
    setStep(next);
  };
  const answer = (value: string | null) => {
    if (!q) return;
    setAnswers((a) => ({ ...a, [q.id]: value }));
    // From a Change in the review, go straight back to the review.
    go(Object.keys(answers).length >= questions.length ? questions.length : step + 1);
  };

  useEffect(() => {
    if (!q || sent) return;
    const onKey = (e: KeyboardEvent) => {
      // A copy shown for reference (inside an inert region, like a states grid) ignores keys.
      if (root.current?.closest("[inert]")) return;
      const t = e.target as HTMLElement | null;
      if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable)) return;
      const n = Number(e.key);
      if (n >= 1 && n <= q.options.length) answer(q.options[n - 1]!.label);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q, sent, answers]);

  if (sent) {
    return (
      <div className={`flex w-full items-center gap-2 rounded-xl border border-line bg-asphalt px-4 py-3 text-[13px] ${className ?? ""}`} role="status">
        <span aria-hidden className="inline-flex h-2 w-2 rounded-full bg-signal" />
        <span className="text-chalk">
          Sent {questions.length} answer{questions.length === 1 ? "" : "s"}
        </span>
      </div>
    );
  }

  return (
    <div ref={root} className={`w-full overflow-hidden rounded-xl border border-line bg-asphalt ${className ?? ""}`}>
      <div className="flex items-center gap-3 border-b border-line px-4 py-2.5">
        <span className="text-[12px] font-medium text-smoke" aria-live="polite">
          {reviewing ? "Review your answers" : `Question ${step + 1} of ${questions.length}`}
        </span>
        <span aria-hidden className="ml-auto flex gap-1">
          {questions.map((x, i) => (
            <span key={x.id} className={`h-1 w-5 rounded-full transition-colors ${i < step || reviewing ? "bg-pit" : i === step ? "bg-chalk" : "bg-line"}`} />
          ))}
        </span>
      </div>

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={reviewing ? "review" : q!.id}
          initial={{ opacity: 0, x: 8 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -8 }}
          transition={{ duration: 0.18, ease: [0.32, 0.72, 0, 1] }}
        >
          {reviewing ? (
            <div className="px-4 py-3">
              <div ref={heading} tabIndex={-1} className="text-[14px] font-medium text-chalk outline-none">
                Send these answers?
              </div>
              <ul className="mt-2 divide-y divide-line">
                {questions.map((x, i) => {
                  const a = answers[x.id];
                  return (
                    <li key={x.id} className="flex items-start gap-3 py-2">
                      <div className="min-w-0 flex-1">
                        <div className="text-[12px] text-ash">{x.question}</div>
                        <div className="text-[13px] text-chalk">{a ?? `Skipped · ${x.fallback ?? "agent's default"}`}</div>
                      </div>
                      <button
                        type="button"
                        onClick={() => go(i)}
                        aria-label={`Change: ${x.question}`}
                        className="min-h-8 shrink-0 rounded-md px-2 text-[12px] text-smoke hover:text-chalk pointer-coarse:min-h-11"
                      >
                        Change
                      </button>
                    </li>
                  );
                })}
              </ul>
              <div className="mt-2 flex justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setSent(true);
                    onComplete?.(answers);
                  }}
                  className="min-h-9 rounded-lg bg-chalk px-3.5 text-[12px] font-medium text-track hover:opacity-85 pointer-coarse:min-h-11"
                >
                  Send answers
                </button>
              </div>
            </div>
          ) : (
            <div>
              <div className="px-4 pb-2 pt-3.5">
                <div ref={heading} tabIndex={-1} className="text-[14px] font-medium leading-snug text-chalk outline-none">
                  {q!.question}
                </div>
                {q!.why && <div className="mt-1 text-[12px] leading-snug text-ash">{q!.why}</div>}
              </div>
              <ul className="px-2 pb-2" aria-label={q!.question}>
                {q!.options.map((o, i) => {
                  const chosen = answers[q!.id] === o.label;
                  return (
                    <li key={o.label}>
                      <button
                        type="button"
                        aria-pressed={chosen}
                        onClick={() => answer(o.label)}
                        className={`flex min-h-11 w-full items-start gap-3 rounded-lg px-2 py-2 text-left transition-colors hover:bg-carbon ${chosen ? "bg-carbon" : ""}`}
                      >
                        <span
                          className={`mt-px inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-md border font-mono text-[11px] ${
                            chosen ? "border-pit bg-pit/15 text-pit" : "border-line text-ash"
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
              <div className="flex items-center gap-2 border-t border-line px-4 py-2.5">
                {step > 0 && (
                  <button type="button" onClick={() => go(step - 1)} className="min-h-8 rounded-md text-[12px] text-smoke hover:text-chalk pointer-coarse:min-h-11">
                    Back
                  </button>
                )}
                {q!.fallback && (
                  <button type="button" onClick={() => answer(null)} className="ml-auto min-h-8 rounded-md text-[12px] text-ash hover:text-smoke pointer-coarse:min-h-11">
                    Skip, {q!.fallback}
                  </button>
                )}
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
