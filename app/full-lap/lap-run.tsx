"use client";

/**
 * LapRun — the whole system on one circuit.
 * A scripted agent run drives every component through a real sequence:
 * contract, telemetry, budget, failure, recovery, and a final gate.
 * The controls are not decoration: Stop actually stops the run, steering
 * is acknowledged, and the irreversible step waits for a real click.
 */

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ToolCallCard } from "@/registry/tool-call-card/tool-call-card";
import { ApprovalGate } from "@/registry/approval-gate/approval-gate";
import { AgentTaskList, type AgentTask } from "@/registry/agent-task-list/agent-task-list";
import { InterruptBar } from "@/registry/interrupt-bar/interrupt-bar";
import { ConfidenceMeter } from "@/registry/confidence-meter/confidence-meter";
import { ContextBudget } from "@/registry/context-budget/context-budget";
import { PitFlag } from "@/components/docs/pit-flag";

/** step machine: each step runs for `dur` ticks; gates hold until decided */
const STEPS = [
  { id: "contract", dur: 3 },
  { id: "plan", dur: 2 },
  { id: "search", dur: 3 },
  { id: "compare", dur: 3 },
  { id: "confidence", dur: 3 },
  { id: "hold-fail", dur: 3 },
  { id: "hold-retry", dur: 3 },
  { id: "book-gate", dur: Infinity },
  { id: "booked", dur: 2 },
  { id: "done", dur: Infinity },
] as const;

type StepId = (typeof STEPS)[number]["id"];
type Phase = "running" | "stopped" | "denied";

export function LapRun() {
  const [stepIndex, setStepIndex] = useState(0);
  const [tick, setTick] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [phase, setPhase] = useState<Phase>("running");
  const [ack, setAck] = useState<string | undefined>(undefined);

  const step: StepId = STEPS[stepIndex].id;
  const atOrPast = (id: StepId) =>
    STEPS.findIndex((s) => s.id === id) <= stepIndex;
  const past = (id: StepId) => STEPS.findIndex((s) => s.id === id) < stepIndex;

  useEffect(() => {
    if (phase !== "running" || STEPS[stepIndex].dur === Infinity) return;
    const t = setInterval(() => {
      setElapsed((e) => e + 1);
      setTick((s) => {
        if (s + 1 >= STEPS[stepIndex].dur) {
          setStepIndex((i) => Math.min(i + 1, STEPS.length - 1));
          return 0;
        }
        return s + 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [phase, stepIndex]);

  const reset = () => {
    setStepIndex(0);
    setTick(0);
    setElapsed(0);
    setPhase("running");
    setAck(undefined);
  };

  const advance = () => {
    setStepIndex((i) => Math.min(i + 1, STEPS.length - 1));
    setTick(0);
  };

  const tasks: AgentTask[] = useMemo(() => {
    const holdStatus =
      step === "hold-fail" && tick >= 1
        ? "failed"
        : past("hold-retry")
          ? "done"
          : step === "hold-retry"
            ? "active"
            : step === "hold-fail"
              ? "active"
              : "pending";
    return [
      { title: "Find flights SFO → JFK", status: past("search") ? "done" : atOrPast("search") ? "active" : "pending" },
      {
        title: "Compare against the $400 cap",
        status: past("compare") ? "done" : step === "compare" ? "active" : "pending",
        detail: step === "compare" ? "14 flights found" : undefined,
      },
      {
        title: "Hold the best option",
        status: holdStatus as AgentTask["status"],
        detail:
          holdStatus === "failed"
            ? "Fare expired. Trying the next option."
            : step === "hold-retry"
              ? "Holding JetBlue 616…"
              : undefined,
      },
      {
        title: "Book with your approval",
        status: past("booked") || step === "done" ? "done" : step === "book-gate" || step === "booked" ? "active" : "pending",
        detail: step === "book-gate" ? "Waiting at the gate" : undefined,
      },
    ];
  }, [step, tick, stepIndex]);

  const spend = atOrPast("booked") ? 278 : past("hold-retry") ? 278 : 0;
  const finished = step === "done";
  const interrupted = phase !== "running";

  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)]">
      {/* transcript */}
      <div className="space-y-3">
        <div className="flex justify-end">
          <div className="max-w-[85%] rounded-2xl rounded-br-md bg-barrier px-4 py-2.5 text-[13.5px] text-chalk">
            Book my New York trip, Aug 12. Keep it under $400.
          </div>
        </div>

        <ApprovalGate
          title="Start the booking run?"
          reason="I'll search, compare, and hold the best fare. Nothing gets charged without you."
          state={past("contract") || step !== "contract" ? "approved" : "awaiting"}
          className={`transition-opacity duration-700 ${past("plan") ? "opacity-60" : ""}`}
          scope={[
            { label: "Search flights across 3 providers" },
            { label: "Hold one fare (free to cancel)" },
            { label: "Spend cap: $400", detail: "run pauses at the cap" },
          ]}
        />

        <AnimatePresence>
          {atOrPast("search") && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
              <ToolCallCard
                name="search_flights"
                intent="Searching SFO → JFK, Aug 12, nonstop"
                state={past("search") ? "success" : interrupted ? "pending" : "running"}
                elapsed={step === "search" ? tick + 1 : undefined}
                detail={past("search") ? "14 flights found. Cheapest nonstop: $278 (JetBlue 616)." : undefined}
                className={`transition-opacity duration-700 ${past("confidence") ? "opacity-60" : ""}`}
              />
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {atOrPast("confidence") && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
              <ConfidenceMeter
                claim="JetBlue 616 is your best option: $278, nonstop, aisle available"
                basis="price, your seat history, 92% on-time"
                confidence={0.86}
                className={`transition-opacity duration-700 ${atOrPast("book-gate") ? "opacity-60" : ""}`}
              />
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {(step === "hold-fail" || atOrPast("hold-retry")) && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
              <ToolCallCard
                name="hold_fare"
                intent="Holding JetBlue 616 at $278"
                state={
                  step === "hold-fail" && tick >= 1
                    ? "error"
                    : past("hold-retry")
                      ? "success"
                      : "running"
                }
                args={'{ "flight": "B6-616", "fare": 278 }'}
                detail={
                  step === "hold-fail" && tick >= 1
                    ? "FareExpiredError: retrying with next fare class (attempt 2/3)"
                    : past("hold-retry")
                      ? "Held for 20 minutes. No charge yet."
                      : undefined
                }
                className={`transition-opacity duration-700 ${atOrPast("booked") ? "opacity-60" : ""}`}
              />
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {atOrPast("book-gate") && !interrupted && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
              <ApprovalGate
                title="Book JetBlue 616 for $278?"
                reason="The hold expires in 20 minutes. This is the step that can't be undone."
                state={atOrPast("booked") ? "approved" : step === "book-gate" ? undefined : "awaiting"}
                onApprove={advance}
                onDeny={() => setPhase("denied")}
                scope={[
                  { label: "Charge your saved card $278", risky: true },
                  { label: "Send confirmation to your email" },
                ]}
                approveLabel="Book it"
                denyLabel="Not now"
              />
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {finished && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-3 rounded-xl border border-line bg-asphalt px-4 py-3"
            >
              <PitFlag size={26} className="shrink-0 text-chalk" />
              <div className="min-w-0 text-[13px] leading-relaxed text-smoke">
                <span className="font-medium text-chalk">Lap complete in {elapsed}s.</span>{" "}
                One failure recovered, one steer honored, nothing irreversible without you.
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {phase === "denied" && (
          <div className="flex items-center gap-3 rounded-xl border border-line bg-asphalt px-4 py-3 text-[13px] text-smoke">
            <span className="inline-flex h-2 w-2 shrink-0 rounded-full bg-caution" aria-hidden />
            Stopped at the gate. The hold and the plan are kept; nothing was charged.
          </div>
        )}
      </div>

      {/* pit wall */}
      <div className="space-y-3 lg:sticky lg:top-6 lg:self-start">
        <InterruptBar
          activity={
            finished
              ? "Lap complete"
              : step === "book-gate"
                ? "Waiting for your call at the gate"
                : tasks.find((t) => t.status === "active")?.title ?? "Starting the run…"
          }
          elapsed={elapsed}
          state={phase === "stopped" ? "stopped" : "running"}
          keptOnStop="Plan and 14 search results kept"
          onStop={() => setPhase("stopped")}
          onSteer={(msg) => setAck(`Got it: "${msg}". Adjusting without restarting.`)}
          acknowledgment={ack}
        />
        <AgentTaskList label="The plan" tasks={tasks} />
        <ContextBudget
          label="Run budget"
          lines={[
            { label: "Spend", used: spend, cap: 400, format: (n) => `$${n}` },
            { label: "Time", used: elapsed, cap: 120, format: (n) => `${n}s` },
          ]}
        />
        <button
          type="button"
          onClick={reset}
          className="min-h-9 w-full rounded-xl border border-line px-3 py-2 font-mono text-[12px] tracking-wide text-smoke transition-colors hover:text-chalk pointer-coarse:min-h-11"
        >
          ↻ RUN ANOTHER LAP
        </button>
      </div>
    </div>
  );
}
