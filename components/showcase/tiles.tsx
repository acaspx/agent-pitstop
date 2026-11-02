"use client";

/**
 * Live tiles for the showcase. Each tile is the real registry component,
 * fully interactive, wired to just enough local state to be played with.
 * Tiles that tell a story over time (a tool call running, a trace
 * streaming) loop on their own; the rest wait for a click.
 */

import { useEffect, useState, type ReactNode } from "react";
import { ToolCallCard, type ToolCallState } from "@/registry/tool-call-card/tool-call-card";
import { AgentTaskList, type AgentTask } from "@/registry/agent-task-list/agent-task-list";
import { ApprovalGate } from "@/registry/approval-gate/approval-gate";
import { InterruptBar, type InterruptBarState } from "@/registry/interrupt-bar/interrupt-bar";
import { ConfidenceMeter } from "@/registry/confidence-meter/confidence-meter";
import { AgentRoster } from "@/registry/agent-roster/agent-roster";
import { AgentInbox } from "@/registry/agent-inbox/agent-inbox";
import { ContextBudget } from "@/registry/context-budget/context-budget";
import { ReasoningTrace, type ReasoningStep } from "@/registry/reasoning-trace/reasoning-trace";
import { CitationChip, SourceDrawer, type Source } from "@/registry/citation-chip/citation-chip";
import { PlanReview } from "@/registry/plan-review/plan-review";
import { ClarifyingQuestion } from "@/registry/clarifying-question/clarifying-question";
import { DiffReviewCard } from "@/registry/diff-review-card/diff-review-card";
import { TakeoverBanner, type TakeoverState } from "@/registry/takeover-banner/takeover-banner";
import { Checkpoint } from "@/registry/checkpoint/checkpoint";
import { MemoryPanel } from "@/registry/memory-panel/memory-panel";

/** Advance an index every `ms` while `on`, looping back to 0 after `max`. */
function useTicker(max: number, ms: number, on = true) {
  const [i, setI] = useState(0);
  useEffect(() => {
    if (!on) return;
    const t = setTimeout(() => setI((n) => (n + 1) % (max + 1)), ms);
    return () => clearTimeout(t);
  }, [i, max, ms, on]);
  return i;
}

function ToolCallTile() {
  const seq: ToolCallState[] = ["pending", "running", "running", "success"];
  const i = useTicker(seq.length - 1, 1400);
  return (
    <ToolCallCard
      name="search_flights"
      intent="Searching SFO → JFK, Aug 12, nonstop"
      state={seq[i]}
      elapsed={i}
      args={'{ "from": "SFO", "to": "JFK", "nonstop": true }'}
      detail={seq[i] === "success" ? "14 flights. Cheapest nonstop: $278." : undefined}
    />
  );
}

function TaskListTile() {
  const titles = ["Find flights", "Compare prices", "Hold best option"];
  const at = useTicker(titles.length, 1500);
  const tasks: AgentTask[] = titles.map((title, i) => ({
    title,
    status: i < at ? "done" : i === at ? "active" : "pending",
    detail: i === 1 && at === 1 ? "14 flights vs $400 cap" : undefined,
  }));
  return <AgentTaskList label="Trip to New York" tasks={tasks} />;
}

function ApprovalTile() {
  return (
    <ApprovalGate
      title="Send the Q3 summary email?"
      reason="Draft is ready for the three stakeholders."
      scope={[
        { label: "Send email to 3 recipients", detail: "alice@, bob@, carol@", risky: true },
        { label: "Attach Q3-summary.pdf", detail: "412 KB" },
      ]}
    />
  );
}

function InterruptTile() {
  const [state, setState] = useState<InterruptBarState>("running");
  const [elapsed, setElapsed] = useState(0);
  const [ack, setAck] = useState<string>();
  useEffect(() => {
    if (state !== "running") return;
    const t = setInterval(() => setElapsed((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, [state]);
  return (
    <InterruptBar
      activity="Comparing 14 flights against your $400 cap…"
      elapsed={elapsed}
      state={state}
      keptOnStop="14 results saved to the thread"
      onStop={() => setState("stopped")}
      onSteer={(m) => setAck(`Got it: "${m}"`)}
      acknowledgment={ack}
    />
  );
}

function ConfidenceTile() {
  const [verified, setVerified] = useState(false);
  return (
    <ConfidenceMeter
      claim="This invoice matches PO #4412"
      basis={verified ? "You checked the OCR gap: total matches" : "3 matching fields, 1 OCR gap"}
      confidence={verified ? 0.94 : 0.55}
      onVerify={verified ? undefined : () => setVerified(true)}
    />
  );
}

function RosterTile() {
  const i = useTicker(2, 1800);
  const states = [
    ["working", "waiting", "idle"],
    ["working", "working", "idle"],
    ["idle", "working", "working"],
  ] as const;
  const acts = [
    ["reading 4 filings", "waiting on research", undefined],
    ["summarizing filings", "outlining the brief", undefined],
    [undefined, "drafting section 2", "checking 6 figures"],
  ];
  return (
    <AgentRoster
      label="Report crew"
      agents={["Researcher", "Writer", "Checker"].map((name, j) => ({
        id: name,
        name,
        state: states[i][j],
        activity: acts[i][j],
      }))}
    />
  );
}

function InboxTile() {
  return (
    <AgentInbox
      items={[
        {
          id: "1",
          title: "Reconcile March invoices",
          summary: "14 matched, 2 need a decision",
          status: "needs_review",
          reason: "2 below confidence threshold",
          time: "2h ago",
        },
        { id: "2", title: "Weekly competitor scan", summary: "Reading 12 pages…", status: "running", time: "now" },
        { id: "3", title: "Draft Q3 summary", summary: "Ready, 2 pages", status: "done", time: "9:40" },
      ]}
    />
  );
}

function BudgetTile() {
  const [cap, setCap] = useState(5);
  return (
    <ContextBudget
      label="This run"
      onRaise={() => setCap((c) => c + 2)}
      lines={[
        { label: "Spend", used: 4.1, cap, format: (n) => `$${n.toFixed(2)}` },
        { label: "Tokens", used: 82, cap: 200, format: (n) => `${n}k` },
        { label: "Time", used: 21, cap: 45, format: (n) => `${n}m` },
      ]}
    />
  );
}

function ReasoningTile() {
  const script = [
    { label: "Reading your question" },
    { label: "Searching fare tables", sources: ["jetblue.com", "united.com"] },
    { label: "Checking baggage rules", detail: "Blue Basic excludes a carry-on" },
    { label: "Comparing total cost" },
  ];
  // 0..3 streaming, 4 done (held a little longer by repeating)
  const i = useTicker(6, 1100);
  const at = Math.min(i, script.length);
  const steps: ReasoningStep[] = script.map((s, j) => ({
    ...s,
    status: j < at ? "done" : j === at ? "active" : "pending",
  }));
  return <ReasoningTrace steps={steps} streaming={at < script.length} seconds={5} />;
}

const SOURCES: Source[] = [
  { title: "Fare rules: Blue Basic", domain: "jetblue.com", quote: "Carry-on bags are not included with Blue Basic." },
  { title: "Basic Economy bags", domain: "united.com", quote: "One full-sized carry-on is allowed on New York routes." },
];

function CitationTile() {
  const [active, setActive] = useState<number | null>(null);
  const open = (i: number) => setActive((a) => (a === i ? null : i));
  return (
    <div className="space-y-2">
      <p className="rounded-xl border border-line bg-asphalt px-4 py-3 text-[13px] leading-[1.9] text-smoke">
        JetBlue&apos;s cheapest fare skips the carry-on
        <CitationChip index={1} source={SOURCES[0]} active={active === 1} onOpen={open} />; United Basic includes one
        <CitationChip index={2} source={SOURCES[1]} active={active === 2} onOpen={open} />.
      </p>
      <SourceDrawer sources={SOURCES} activeIndex={active} onSelect={setActive} onClose={() => setActive(null)} />
    </div>
  );
}

function PlanTile() {
  return (
    <PlanReview
      goal="Move billing to the v2 API"
      steps={[
        { title: "Read the billing client", detail: "6 files" },
        { title: "Swap charge() for createPayment()" },
        { title: "Run migration on staging", risky: true },
        { title: "Open a pull request" },
      ]}
    />
  );
}

function ClarifyTile() {
  return (
    <ClarifyingQuestion
      question="Which seat should I hold?"
      why="Two fares tie on price. Seat decides which I book."
      options={[{ label: "Aisle", detail: "United 1532" }, { label: "Window", detail: "JetBlue 616" }]}
      fallback="I'll pick the earlier one"
    />
  );
}

function DiffTile() {
  return (
    <DiffReviewCard
      file="src/api/client.ts"
      hunks={[
        {
          id: "a",
          summary: "Retry once on timeout",
          removed: ["return fetch(url, opts);"],
          added: ["return withRetry(() => fetch(url, opts));"],
        },
        {
          id: "b",
          summary: "Log the request id on errors",
          removed: ['console.error("failed");'],
          added: ['console.error("failed", { id });'],
        },
      ]}
    />
  );
}

function TakeoverTile() {
  const [state, setState] = useState<TakeoverState>("agent");
  useEffect(() => {
    const next: Partial<Record<TakeoverState, [TakeoverState, number]>> = {
      agent: ["needs-you", 2400],
      resuming: ["agent", 1600],
    };
    const n = next[state];
    if (!n) return;
    const t = setTimeout(() => setState(n[0]), n[1]);
    return () => clearTimeout(t);
  }, [state]);
  const reason: Record<TakeoverState, string> = {
    agent: "Filling in passenger details",
    "needs-you": "Sign in to JetBlue. I don't type passwords.",
    you: "",
    resuming: "Checking you're signed in",
  };
  return (
    <TakeoverBanner
      state={state}
      reason={reason[state]}
      onTakeOver={() => setState("you")}
      onHandBack={() => setState("resuming")}
    />
  );
}

function CheckpointTile() {
  return (
    <Checkpoint
      checkpoints={[
        { id: "3", label: "Refactored the billing client", time: "just now" },
        { id: "2", label: "Tests passing on v2", time: "4 min ago", undoes: "the refactor (3 files)" },
        { id: "1", label: "Before the agent started", time: "12 min ago", undoes: "every change in this run" },
      ]}
    />
  );
}

function MemoryTile() {
  return (
    <MemoryPanel
      memories={[
        { id: "1", text: "Prefers aisle seats on long flights", source: "Trip to New York", learnedAt: "Oct 12" },
        { id: "2", text: "Flies out of SFO, not OAK", source: "Trip to New York", learnedAt: "Oct 12" },
        { id: "3", text: "Expenses go to finance@ on Fridays", source: "You told me", learnedAt: "Sep 30" },
      ]}
    />
  );
}

/** Showcase order: interleaved so neighbours differ in height and kind. */
export const tiles: { slug: string; hint: string; render: () => ReactNode }[] = [
  { slug: "approval-gate", hint: "Approve or deny", render: () => <ApprovalTile /> },
  { slug: "reasoning-trace", hint: "Open the trace", render: () => <ReasoningTile /> },
  { slug: "interrupt-bar", hint: "Stop or steer", render: () => <InterruptTile /> },
  { slug: "plan-review", hint: "Drop or edit a step", render: () => <PlanTile /> },
  { slug: "citation-chip", hint: "Tap a source", render: () => <CitationTile /> },
  { slug: "tool-call-card", hint: "Expand the call", render: () => <ToolCallTile /> },
  { slug: "diff-review-card", hint: "Accept a hunk", render: () => <DiffTile /> },
  { slug: "confidence-meter", hint: "Check the claim", render: () => <ConfidenceTile /> },
  { slug: "takeover-banner", hint: "Take the wheel", render: () => <TakeoverTile /> },
  { slug: "clarifying-question", hint: "Pick an answer, or press 1", render: () => <ClarifyTile /> },
  { slug: "memory-panel", hint: "Forget something", render: () => <MemoryTile /> },
  { slug: "agent-task-list", hint: "Watch the plan run", render: () => <TaskListTile /> },
  { slug: "checkpoint", hint: "Restore a save point", render: () => <CheckpointTile /> },
  { slug: "agent-roster", hint: "Watch the crew", render: () => <RosterTile /> },
  { slug: "context-budget", hint: "Raise a cap", render: () => <BudgetTile /> },
  { slug: "agent-inbox", hint: "Open a review", render: () => <InboxTile /> },
];
