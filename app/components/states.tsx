"use client";

/**
 * Every state of every component, side by side, for the States grid on each doc page.
 * The live demo above shows one state at a time; this shows them all at once, so a
 * designer (or an agent reading the page) can compare them without clicking through.
 * Each entry renders the real component in that state, with no-op handlers.
 */

import type { ReactNode } from "react";
import { ToolCallCard } from "@/registry/tool-call-card/tool-call-card";
import { AgentTaskList } from "@/registry/agent-task-list/agent-task-list";
import { ApprovalGate } from "@/registry/approval-gate/approval-gate";
import { InterruptBar } from "@/registry/interrupt-bar/interrupt-bar";
import { ConfidenceMeter } from "@/registry/confidence-meter/confidence-meter";
import { AgentRoster } from "@/registry/agent-roster/agent-roster";
import { AgentInbox } from "@/registry/agent-inbox/agent-inbox";
import { ContextBudget } from "@/registry/context-budget/context-budget";
import { ReasoningTrace } from "@/registry/reasoning-trace/reasoning-trace";
import { CitationChip } from "@/registry/citation-chip/citation-chip";
import { PlanReview } from "@/registry/plan-review/plan-review";
import { ClarifyingQuestion } from "@/registry/clarifying-question/clarifying-question";
import { DiffReviewCard } from "@/registry/diff-review-card/diff-review-card";
import { TakeoverBanner } from "@/registry/takeover-banner/takeover-banner";
import { Checkpoint } from "@/registry/checkpoint/checkpoint";
import { MemoryPanel } from "@/registry/memory-panel/memory-panel";
import { ThinkingIndicator } from "@/registry/thinking-indicator/thinking-indicator";

type State = { label: string; render: () => ReactNode };
const noop = () => {};

const call = (state: Parameters<typeof ToolCallCard>[0]["state"], detail?: string) => () => (
  <ToolCallCard
    name="search_flights"
    intent="Searching SFO → JFK, Aug 12"
    state={state}
    elapsed={3}
    args={'{ "from": "SFO", "to": "JFK" }'}
    detail={detail}
    approval={{ question: "Use the paid fare provider?", consequence: "$0.40 per search." }}
    onAllow={noop}
    onDeny={noop}
  />
);

const scope = [{ label: "Send email to 3 recipients", detail: "alice@, bob@, carol@", risky: true }, { label: "Attach Q3-summary.pdf" }];
const plan = [{ title: "Read the billing client" }, { title: "Swap charge() for createPayment()" }, { title: "Run the migration on staging", risky: true }];
const hunks = [
  { id: "retry", summary: "Retry once on timeout", removed: ["return fetch(url);"], added: ["return withRetry(() => fetch(url));"] },
  { id: "log", summary: "Log the request id", removed: ['console.error("failed");'], added: ['console.error("failed", { id });'] },
];
const checkpoints = [
  { id: "c2", label: "Refactored the client", time: "just now" },
  { id: "c1", label: "Tests passing", time: "4 min ago", undoes: "the refactor" },
];
const memories = [
  { id: "m1", text: "Prefers aisle seats", source: "Trip to New York", learnedAt: "Oct 12" },
  { id: "m2", text: "Flies out of SFO", source: "Trip to New York", learnedAt: "Oct 12" },
];
const source = { title: "Fare rules", domain: "jetblue.com", quote: "Carry-ons are not included." };
const trace = (streaming: boolean) => () => (
  <ReasoningTrace
    streaming={streaming}
    seconds={4}
    defaultOpen={!streaming}
    steps={[
      { label: "Searching fare tables", status: "done", sources: ["jetblue.com"] },
      { label: "Checking carry-on rules", status: streaming ? "active" : "done" },
      { label: "Comparing totals", status: streaming ? "pending" : "done" },
    ]}
  />
);

export const STATES: Record<string, State[]> = {
  "tool-call-card": [
    { label: "Queued", render: call("pending") },
    { label: "Running", render: call("running") },
    { label: "Needs you", render: call("awaiting") },
    { label: "Done", render: call("success", "14 flights found.") },
    { label: "Failed", render: call("error", "RateLimitError: 429") },
    { label: "Denied", render: call("denied", "You kept the free provider.") },
    { label: "Stopped", render: call("stopped", "9 flights kept.") },
  ],
  "agent-task-list": [
    { label: "Running", render: () => <AgentTaskList label="Trip" tasks={[{ title: "Compare fares", status: "done" }, { title: "Hold seat 14A", status: "active", detail: "Holding on TAP 202" }, { title: "Book flight", status: "pending" }]} /> },
    { label: "A step failed", render: () => <AgentTaskList label="Trip" tasks={[{ title: "Compare fares", status: "done" }, { title: "Book flight", status: "failed", detail: "Card declined" }, { title: "Email itinerary", status: "pending" }]} /> },
    { label: "All done", render: () => <AgentTaskList label="Trip" tasks={[{ title: "Compare fares", status: "done" }, { title: "Book flight", status: "done" }]} /> },
  ],
  "approval-gate": [
    { label: "Waiting for you", render: () => <ApprovalGate title="Send the Q3 summary?" scope={scope} /> },
    { label: "Approved", render: () => <ApprovalGate title="Send the Q3 summary?" scope={scope} state="approved" /> },
    { label: "Denied", render: () => <ApprovalGate title="Send the Q3 summary?" scope={scope} state="denied" /> },
  ],
  "interrupt-bar": [
    { label: "Running", render: () => <InterruptBar activity="Comparing 14 flights" elapsed={12} /> },
    { label: "Steer taken", render: () => <InterruptBar activity="Comparing 14 flights" elapsed={12} acknowledgment="Got it: aisle seats only" /> },
    { label: "Stopped", render: () => <InterruptBar activity="Comparing 14 flights" state="stopped" keptOnStop="14 results kept" /> },
  ],
  "confidence-meter": [
    { label: "Low", render: () => <ConfidenceMeter claim="Invoice matches PO #4412" confidence={0.3} basis="1 of 4 fields" onVerify={noop} /> },
    { label: "Medium", render: () => <ConfidenceMeter claim="Invoice matches PO #4412" confidence={0.62} basis="3 of 4 fields" onVerify={noop} /> },
    { label: "High", render: () => <ConfidenceMeter claim="Invoice matches PO #4412" confidence={0.94} basis="All fields match" /> },
  ],
  "agent-roster": [
    { label: "Every state", render: () => <AgentRoster agents={[{ id: "a", name: "Researcher", state: "working", activity: "reading 4 filings" }, { id: "b", name: "Writer", state: "waiting", activity: "waiting on research" }, { id: "c", name: "Checker", state: "blocked", activity: "no access to the drive" }, { id: "d", name: "Editor", state: "idle" }]} /> },
  ],
  "agent-inbox": [
    { label: "Every status", render: () => <AgentInbox onOpen={noop} items={[{ id: "1", title: "Reconcile invoices", summary: "2 need a decision", status: "needs_review", reason: "low confidence", time: "2h" }, { id: "2", title: "Competitor scan", summary: "Reading 12 pages", status: "running", time: "now" }, { id: "3", title: "Q3 summary", summary: "Ready", status: "done", time: "9:40" }, { id: "4", title: "Sync CRM", summary: "Token expired", status: "failed", time: "8:02" }]} /> },
    { label: "All clear", render: () => <AgentInbox items={[{ id: "3", title: "Q3 summary", summary: "Ready", status: "done", time: "9:40" }]} /> },
  ],
  "context-budget": [
    { label: "Within budget", render: () => <ContextBudget lines={[{ label: "Spend", used: 1.2, cap: 5 }, { label: "Time", used: 8, cap: 45 }]} /> },
    { label: "Near a cap", render: () => <ContextBudget lines={[{ label: "Spend", used: 4.3, cap: 5 }, { label: "Time", used: 21, cap: 45 }]} /> },
    { label: "At a cap", render: () => <ContextBudget onRaise={noop} lines={[{ label: "Spend", used: 5, cap: 5 }, { label: "Time", used: 21, cap: 45 }]} /> },
  ],
  "reasoning-trace": [
    { label: "Thinking", render: trace(true) },
    { label: "Done, open", render: trace(false) },
  ],
  "citation-chip": [
    { label: "Closed", render: () => <p className="text-[13px] text-smoke">Basic fares skip the carry-on <CitationChip index={1} source={source} /></p> },
    { label: "Open", render: () => <p className="text-[13px] text-smoke">Basic fares skip the carry-on <CitationChip index={1} source={source} active /></p> },
    { label: "Couldn't be reached", render: () => <p className="text-[13px] text-smoke">United includes one <CitationChip index={2} source={{ title: "Bags", domain: "united.com", unreachable: true }} /></p> },
  ],
  "plan-review": [
    { label: "Reviewing", render: () => <PlanReview goal="Move billing to v2" steps={plan} /> },
    { label: "A step dropped", render: () => <PlanReview goal="Move billing to v2" steps={plan} dropped={[2]} /> },
    { label: "Approved", render: () => <PlanReview goal="Move billing to v2" steps={plan} dropped={[2]} state="approved" /> },
  ],
  "clarifying-question": [
    { label: "Asking", render: () => <ClarifyingQuestion question="Which seat?" why="Seat decides the fare" options={[{ label: "Aisle" }, { label: "Window" }]} fallback="earlier flight" /> },
    { label: "Answered", render: () => <ClarifyingQuestion question="Which seat?" options={[{ label: "Aisle" }, { label: "Window" }]} answer={["Aisle"]} /> },
  ],
  "diff-review-card": [
    { label: "Pending", render: () => <DiffReviewCard file="src/api/client.ts" hunks={hunks} /> },
    { label: "Decided", render: () => <DiffReviewCard file="src/api/client.ts" hunks={hunks} decisions={{ retry: "accepted", log: "rejected" }} /> },
  ],
  "takeover-banner": [
    { label: "Agent driving", render: () => <TakeoverBanner state="agent" reason="Filling in passenger details" /> },
    { label: "Needs you", render: () => <TakeoverBanner state="needs-you" reason="Sign in to continue" /> },
    { label: "You're driving", render: () => <TakeoverBanner state="you" /> },
    { label: "Resuming", render: () => <TakeoverBanner state="resuming" reason="Checking you're signed in" /> },
  ],
  checkpoint: [
    { label: "At the latest", render: () => <Checkpoint checkpoints={checkpoints} /> },
    { label: "Confirming a restore", render: () => <Checkpoint checkpoints={checkpoints} confirming="c1" /> },
    { label: "Restored", render: () => <Checkpoint checkpoints={checkpoints} current="c1" /> },
  ],
  "memory-panel": [
    { label: "Remembering", render: () => <MemoryPanel memories={memories} /> },
    { label: "Paused", render: () => <MemoryPanel memories={memories} paused /> },
    { label: "Empty", render: () => <MemoryPanel memories={[]} /> },
  ],
  "thinking-indicator": [
    { label: "Thinking", render: () => <ThinkingIndicator detail="Checking carry-on rules" elapsed={3} /> },
    { label: "Done", render: () => <ThinkingIndicator state="done" elapsed={6} /> },
  ],
};

/** Every state, side by side. Not interactive: it is for comparing, the demo above is for trying. */
export function StatesGrid({ slug }: { slug: string }) {
  const states = STATES[slug];
  if (!states?.length) return null;
  return (
    <section aria-labelledby="states" className="mt-14">
      <h2 id="states" className="text-sm font-medium uppercase tracking-wide text-ash">
        States <span className="ml-1 font-mono normal-case tracking-normal">{states.length}</span>
      </h2>
      <ul className="mt-4 grid items-start gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {states.map((s) => (
          <li key={s.label} className="rounded-2xl border border-line bg-carbon p-3">
            <div className="px-1 pb-2.5 text-[12px] font-medium text-smoke">{s.label}</div>
            {/* inert: a picture of the state, so keyboard and screen readers skip it */}
            <div className="rounded-xl bg-track p-3" inert>
              {s.render()}
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
