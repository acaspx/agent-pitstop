/**
 * Automated accessibility checks: axe-core over every registry component, in the
 * states that matter (waiting, running, failed, decided, open). jsdom has no layout
 * or paint, so color contrast is checked separately, from the tokens themselves, by
 * scripts/check-contrast.mjs. What axe can't judge (whether an announcement makes
 * sense, whether focus order is sensible) is covered by the guarantee tests and the
 * screen-reader notes in docs/accessibility.md.
 */
import { describe, it, expect } from "vitest";
import { render, fireEvent, screen } from "@testing-library/react";
import axe from "axe-core";
import type { ReactElement } from "react";

import { ToolCallCard } from "@/registry/tool-call-card/tool-call-card";
import { AgentTaskList } from "@/registry/agent-task-list/agent-task-list";
import { ApprovalGate } from "@/registry/approval-gate/approval-gate";
import { InterruptBar } from "@/registry/interrupt-bar/interrupt-bar";
import { ConfidenceMeter } from "@/registry/confidence-meter/confidence-meter";
import { AgentRoster } from "@/registry/agent-roster/agent-roster";
import { AgentInbox } from "@/registry/agent-inbox/agent-inbox";
import { ContextBudget } from "@/registry/context-budget/context-budget";
import { ReasoningTrace } from "@/registry/reasoning-trace/reasoning-trace";
import { CitationChip, SourceDrawer } from "@/registry/citation-chip/citation-chip";
import { PlanReview } from "@/registry/plan-review/plan-review";
import { ClarifyingQuestion } from "@/registry/clarifying-question/clarifying-question";
import { DiffReviewCard } from "@/registry/diff-review-card/diff-review-card";
import { TakeoverBanner } from "@/registry/takeover-banner/takeover-banner";
import { Checkpoint } from "@/registry/checkpoint/checkpoint";
import { MemoryPanel } from "@/registry/memory-panel/memory-panel";

async function violations(ui: ReactElement, act?: () => void) {
  const { container } = render(<main>{ui}</main>);
  act?.();
  const result = await axe.run(container, {
    // jsdom can't compute colors; contrast is enforced from the tokens instead.
    rules: { "color-contrast": { enabled: false } },
  });
  return result.violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(" ")).join(", ")}`);
}

const SOURCES = [
  { title: "Fare rules", domain: "jetblue.com", quote: "Carry-ons are not included." },
  { title: "Delays", domain: "bts.gov", unreachable: true },
];

const cases: [string, () => ReactElement, (() => void)?][] = [
  ["Tool Call Card, running", () => <ToolCallCard name="search" intent="Searching fares" state="running" elapsed={3} />],
  ["Tool Call Card, failed and open", () => <ToolCallCard name="search" intent="Searching fares" state="error" args='{"q":1}' detail="429" />,
    () => fireEvent.click(screen.getByRole("button"))],
  ["Agent Task List", () => (
    <AgentTaskList label="Trip" tasks={[{ title: "Find", status: "done" }, { title: "Hold", status: "active", detail: "Holding" }, { title: "Book", status: "failed", detail: "Card declined" }, { title: "Mail", status: "pending" }]} />
  )],
  ["Approval Gate, waiting", () => <ApprovalGate title="Send it?" reason="Ready" scope={[{ label: "Send", detail: "3 people", risky: true }]} />],
  ["Approval Gate, approved", () => <ApprovalGate title="Send it?" scope={[{ label: "Send" }]} />, () => fireEvent.click(screen.getByRole("button", { name: "Approve" }))],
  ["Interrupt Bar, running with acknowledgment", () => <InterruptBar activity="Comparing" elapsed={4} acknowledgment="Got it" />],
  ["Interrupt Bar, stopped", () => <InterruptBar activity="Comparing" state="stopped" keptOnStop="14 kept" />],
  ["Confidence Meter, needs a check", () => <ConfidenceMeter claim="Invoice matches" confidence={0.5} basis="3 of 4" onVerify={() => {}} />],
  ["Agent Roster", () => <AgentRoster agents={[{ id: "a", name: "Researcher", state: "working", activity: "reading" }, { id: "b", name: "Writer", state: "blocked", activity: "no access" }]} />],
  ["Agent Inbox", () => <AgentInbox onOpen={() => {}} items={[{ id: "1", title: "Invoices", summary: "2 to check", status: "needs_review", reason: "low confidence", time: "2h" }, { id: "2", title: "Scan", summary: "Reading", status: "running" }]} />],
  ["Context Budget, at cap", () => <ContextBudget onRaise={() => {}} lines={[{ label: "Spend", used: 5, cap: 5 }, { label: "Time", used: 10, cap: 45 }]} />],
  ["Reasoning Trace, streaming", () => <ReasoningTrace streaming steps={[{ label: "Search", status: "done", sources: ["a.com"] }, { label: "Compare", status: "active" }, { label: "Answer", status: "pending" }]} />],
  ["Citation Chip and open Source Drawer", () => (
    <div>
      <p>Claim <CitationChip index={1} source={SOURCES[0]!} active /> and <CitationChip index={2} source={SOURCES[1]!} /></p>
      <SourceDrawer sources={SOURCES} activeIndex={1} onClose={() => {}} />
    </div>
  )],
  ["Plan Review, a step dropped", () => <PlanReview goal="Migrate" onRevise={() => {}} steps={[{ title: "Read" }, { title: "Migrate", risky: true }]} />,
    () => fireEvent.click(screen.getByRole("button", { name: /Drop step 2/ }))],
  ["Clarifying Question, single", () => <ClarifyingQuestion question="Which seat?" why="Decides the fare" options={[{ label: "Aisle" }, { label: "Window" }]} allowOther fallback="earlier flight" />],
  ["Clarifying Question, multi", () => <ClarifyingQuestion multi question="Which days?" options={[{ label: "Mon" }, { label: "Tue" }]} />],
  ["Diff Review Card", () => <DiffReviewCard file="a.ts" hunks={[{ id: "1", summary: "Retry", removed: ["a"], added: ["b"] }, { id: "2", removed: ["c"], added: ["d"] }]} />],
  ["Takeover Banner, needs you", () => <TakeoverBanner state="needs-you" reason="Sign in" />],
  ["Takeover Banner, you drive", () => <TakeoverBanner state="you" />],
  ["Checkpoint, confirm open", () => <Checkpoint checkpoints={[{ id: "b", label: "Now", time: "now" }, { id: "a", label: "Earlier", time: "4m", undoes: "2 edits" }]} />,
    () => fireEvent.click(screen.getByRole("button", { name: "Restore to Earlier" }))],
  ["Memory Panel", () => <MemoryPanel memories={[{ id: "1", text: "Likes aisle seats", source: "Trip", learnedAt: "Oct 12" }]} />],
];

describe("axe: no accessibility violations", () => {
  for (const [name, ui, act] of cases) {
    it(name, async () => {
      expect(await violations(ui(), act)).toEqual([]);
    });
  }
});
