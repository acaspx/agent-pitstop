"use client";

import type { ReactNode } from "react";
import { ToolCallCard } from "@/registry/tool-call-card/tool-call-card";
import { AgentTaskList } from "@/registry/agent-task-list/agent-task-list";
import { ApprovalGate } from "@/registry/approval-gate/approval-gate";
import { InterruptBar } from "@/registry/interrupt-bar/interrupt-bar";
import { ConfidenceMeter } from "@/registry/confidence-meter/confidence-meter";
import { AgentRoster } from "@/registry/agent-roster/agent-roster";
import { AgentInbox } from "@/registry/agent-inbox/agent-inbox";
import { ContextBudget } from "@/registry/context-budget/context-budget";
import { CitationChip } from "@/registry/citation-chip/citation-chip";
import { DiffReviewCard } from "@/registry/diff-review-card/diff-review-card";

export const minis: Record<string, ReactNode> = {
  "tool-call-card": (
    <ToolCallCard name="search_flights" intent="Searching SFO → JFK, Aug 12" state="running" elapsed={3} />
  ),
  "agent-task-list": (
    <AgentTaskList
      tasks={[
        { title: "Find flights", status: "done" },
        { title: "Compare prices", status: "active", detail: "14 flights vs $400 cap" },
        { title: "Hold best option", status: "pending" },
      ]}
    />
  ),
  "approval-gate": (
    <ApprovalGate
      title="Send the Q3 summary email?"
      state="awaiting"
      scope={[{ label: "Send email to 3 recipients", risky: true }]}
    />
  ),
  "interrupt-bar": <InterruptBar activity="Comparing 14 flights…" elapsed={12} state="running" />,
  "confidence-meter": (
    <ConfidenceMeter claim="This invoice matches PO #4412" basis="3 matching fields, 1 OCR gap" confidence={0.55} />
  ),
  "agent-roster": (
    <AgentRoster
      label="Report crew"
      agents={[
        { id: "r", name: "Researcher", state: "working", activity: "reading 4 filings" },
        { id: "w", name: "Writer", state: "waiting", activity: "waiting on research" },
        { id: "c", name: "Checker", state: "idle" },
      ]}
    />
  ),
  "agent-inbox": (
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
      ]}
    />
  ),
  "context-budget": (
    <ContextBudget
      lines={[
        { label: "Spend", used: 4.1, cap: 5, format: (n) => `$${n.toFixed(2)}` },
        { label: "Time", used: 21, cap: 45, format: (n) => `${n}m` },
      ]}
    />
  ),
  "citation-chip": (
    <div className="rounded-xl border border-line bg-asphalt px-4 py-3 text-[13px] leading-relaxed text-chalk">
      On-time rate improved to 92%
      <CitationChip
        n={1}
        source={{
          title: "DOT Air Travel Consumer Report",
          publisher: "transportation.gov",
          quote: "…an on-time arrival rate of 92.1 percent…",
          retrieved: "2h ago",
        }}
      />
      this quarter.
    </div>
  ),
  "diff-review-card": (
    <DiffReviewCard
      title="Tighten the pricing copy"
      target="pricing.md"
      hunks={[
        {
          id: "h1",
          label: "Hero headline",
          before: ["Powerful plans for every team"],
          after: ["Plans that scale with your team"],
        },
      ]}
    />
  ),
};
