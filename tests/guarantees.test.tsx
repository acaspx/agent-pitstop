/**
 * The contract's guarantees, asserted.
 *
 * /r/contract.json declares seven behavioral guarantees. These tests are
 * their enforcement: a change that breaks a guarantee fails CI, so the
 * philosophy cannot be broken silently. Each describe block names the
 * guarantee it protects.
 */
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, waitFor, within } from "@testing-library/react";

import { InterruptBar } from "@/registry/interrupt-bar/interrupt-bar";
import { ApprovalGate } from "@/registry/approval-gate/approval-gate";
import { ConfidenceMeter } from "@/registry/confidence-meter/confidence-meter";
import { ToolCallCard } from "@/registry/tool-call-card/tool-call-card";
import { AgentTaskList } from "@/registry/agent-task-list/agent-task-list";

describe("guarantee: stopping preserves partial work", () => {
  it("stop shows a receipt naming what survived and never discards silently", async () => {
    const onStop = vi.fn();
    render(
      <InterruptBar activity="Comparing flights" keptOnStop="14 results kept" onStop={onStop} />,
    );
    fireEvent.click(screen.getByRole("button", { name: "Stop" }));
    expect(onStop).toHaveBeenCalledOnce();
    expect(await screen.findByText(/Stopped by you/)).toBeTruthy();
    expect(await screen.findByText(/14 results kept/)).toBeTruthy();
  });

  it("steering redirects without stopping the run", () => {
    const onSteer = vi.fn();
    render(<InterruptBar activity="Working" onSteer={onSteer} />);
    fireEvent.change(screen.getByLabelText("Steer the agent"), {
      target: { value: "aisle seats only" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Send" }));
    expect(onSteer).toHaveBeenCalledWith("aisle seats only");
    // still running: the stop control is still present
    expect(screen.getByRole("button", { name: "Stop" })).toBeTruthy();
  });
});

describe("guarantee: nothing irreversible without explicit consent", () => {
  it("approval fires only on an explicit click, and irreversible scope is labeled", async () => {
    const onApprove = vi.fn();
    render(
      <ApprovalGate
        title="Send the email?"
        scope={[{ label: "Send to 3 recipients", risky: true }]}
        onApprove={onApprove}
      />,
    );
    // labeled in words, not color alone
    expect(screen.getByText(/Can't undo/)).toBeTruthy();
    expect(onApprove).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole("button", { name: "Approve" }));
    expect(onApprove).toHaveBeenCalledOnce();
    // collapses to a labeled receipt
    expect(await screen.findByText("Approved")).toBeTruthy();
  });

  it("denying is as available as approving and leaves a receipt", async () => {
    const onDeny = vi.fn();
    render(
      <ApprovalGate title="Send the email?" scope={[{ label: "Send" }]} onDeny={onDeny} />,
    );
    fireEvent.click(screen.getByRole("button", { name: "Deny" }));
    expect(onDeny).toHaveBeenCalledOnce();
    expect(await screen.findByText("Denied")).toBeTruthy();
  });
});

describe("guarantee: confidence renders as bands, never decimals", () => {
  it("shows a band word and no raw percentage", () => {
    render(<ConfidenceMeter claim="Match found" confidence={0.873} />);
    expect(screen.getByText("High confidence")).toBeTruthy();
    expect(screen.queryByText(/87/)).toBeNull();
    expect(screen.queryByText(/%/)).toBeNull();
  });

  it("below the threshold the meter becomes a verification request", () => {
    const onVerify = vi.fn();
    render(<ConfidenceMeter claim="Match found" confidence={0.5} onVerify={onVerify} />);
    fireEvent.click(screen.getByRole("button", { name: "Check this" }));
    expect(onVerify).toHaveBeenCalledOnce();
  });

  it("above the threshold no verification pressure is applied", () => {
    render(<ConfidenceMeter claim="Match found" confidence={0.9} />);
    expect(screen.queryByRole("button", { name: "Check this" })).toBeNull();
  });
});

describe("guarantee: failures keep their inputs visible", () => {
  it("a failed tool call still exposes its arguments beside the error", () => {
    render(
      <ToolCallCard
        name="hold_fare"
        intent="Holding JetBlue 616"
        state="error"
        args='{ "flight": "B6-616" }'
        detail="FareExpiredError"
      />,
    );
    // A failure opens on its own: the inputs are on screen without a click.
    expect(screen.getByRole("button", { expanded: true })).toBeTruthy();
    expect(screen.getByText(/B6-616/)).toBeTruthy();
    expect(screen.getByText(/FareExpiredError/)).toBeTruthy();
  });

  it("a failed plan step stays in the list with its error attached", () => {
    render(
      <AgentTaskList
        tasks={[
          { title: "Search", status: "done" },
          { title: "Hold fare", status: "failed", detail: "Fare expired" },
          { title: "Book", status: "pending" },
        ]}
      />,
    );
    expect(screen.getByText("Hold fare")).toBeTruthy();
    expect(screen.getByText("Fare expired")).toBeTruthy();
    expect(screen.getByText("Search")).toBeTruthy(); // done stays visible too
  });
});

describe("guarantee: state is never communicated by color alone", () => {
  it("tool call states carry text labels", () => {
    const { rerender } = render(<ToolCallCard name="t" intent="i" state="running" />);
    expect(screen.getByText("Running")).toBeTruthy();
    rerender(<ToolCallCard name="t" intent="i" state="error" />);
    expect(screen.getByText("Failed")).toBeTruthy();
    rerender(<ToolCallCard name="t" intent="i" state="success" />);
    expect(screen.getByText("Done")).toBeTruthy();
  });

  it("the approval gate's waiting state is labeled in words", () => {
    render(<ApprovalGate title="T" scope={[{ label: "s" }]} />);
    expect(screen.getByText(/Waiting for you/)).toBeTruthy();
  });
});

/* ---- guarantees for the second wave of components ---- */
import { DiffReviewCard } from "@/registry/diff-review-card/diff-review-card";
import { PlanReview } from "@/registry/plan-review/plan-review";
import { Checkpoint } from "@/registry/checkpoint/checkpoint";
import { MemoryPanel } from "@/registry/memory-panel/memory-panel";
import { ClarifyingQuestion } from "@/registry/clarifying-question/clarifying-question";
import { CitationChip } from "@/registry/citation-chip/citation-chip";
import { TakeoverBanner } from "@/registry/takeover-banner/takeover-banner";

describe("guarantee: nothing irreversible without explicit consent (review surfaces)", () => {
  it("a diff hunk applies only when accepted, one hunk at a time", () => {
    const onDecide = vi.fn();
    render(
      <DiffReviewCard
        file="a.ts"
        onDecide={onDecide}
        hunks={[
          { id: "1", removed: ["a"], added: ["b"] },
          { id: "2", removed: ["c"], added: ["d"] },
        ]}
      />,
    );
    expect(onDecide).not.toHaveBeenCalled();
    fireEvent.click(screen.getAllByRole("button", { name: /^Reject:/ })[0]);
    expect(onDecide).toHaveBeenCalledWith("1", "rejected");
    expect(screen.getByText("1/2 reviewed")).toBeTruthy();
  });

  it("a plan runs only as approved, without the steps the person dropped", () => {
    const onApprove = vi.fn();
    render(
      <PlanReview goal="g" onApprove={onApprove} steps={[{ title: "Read" }, { title: "Migrate", risky: true }]} />,
    );
    expect(screen.getByText("Risky")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: /^Drop step 2:/ }));
    fireEvent.click(screen.getByRole("button", { name: "Approve plan" }));
    expect(onApprove).toHaveBeenCalledWith([{ title: "Read" }]);
  });

  it("restoring a checkpoint asks once and names what it undoes", () => {
    const onRestore = vi.fn();
    render(
      <Checkpoint
        onRestore={onRestore}
        checkpoints={[
          { id: "b", label: "Now", time: "now" },
          { id: "a", label: "Earlier", time: "4m", undoes: "3 file edits" },
        ]}
      />,
    );
    fireEvent.click(screen.getByRole("button", { name: "Restore to Earlier" }));
    expect(onRestore).not.toHaveBeenCalled();
    expect(screen.getByText(/This undoes 3 file edits/)).toBeTruthy();
    const confirm = screen.getByText(/This undoes/).parentElement!;
    fireEvent.click(within(confirm).getByRole("button", { name: "Restore" }));
    expect(onRestore).toHaveBeenCalledWith("a");
  });
});

describe("guarantee: the person can always see and take back control", () => {
  it("forgetting a memory is undoable before it is final", () => {
    vi.useFakeTimers();
    const onForget = vi.fn();
    render(<MemoryPanel onForget={onForget} memories={[{ id: "m", text: "Likes aisle seats" }]} />);
    fireEvent.click(screen.getByRole("button", { name: /Forget/ }));
    fireEvent.click(screen.getByRole("button", { name: "Undo" }));
    vi.advanceTimersByTime(6000);
    expect(onForget).not.toHaveBeenCalled();
    vi.useRealTimers();
  });

  it("take over is always offered while the agent drives, and the privacy note shows while you do", async () => {
    const { rerender } = render(<TakeoverBanner state="agent" reason="Filling a form" />);
    expect(screen.getByRole("button", { name: "Take over" })).toBeTruthy();
    rerender(<TakeoverBanner state="you" />);
    expect(await screen.findByText(/can't see the screen/)).toBeTruthy();
    expect(screen.getByRole("button", { name: "Hand back" })).toBeTruthy();
  });

  it("a clarifying question records the answer in words", async () => {
    const onAnswer = vi.fn();
    render(<ClarifyingQuestion question="Which seat?" options={[{ label: "Aisle" }, { label: "Window" }]} onAnswer={onAnswer} />);
    fireEvent.click(screen.getByRole("button", { name: /Window/ }));
    expect(onAnswer).toHaveBeenCalledWith(["Window"]);
    expect(await screen.findByText("You chose Window")).toBeTruthy();
  });

  it("an unreachable source says so on the chip", () => {
    render(<CitationChip index={1} source={{ title: "Delays", domain: "bts.gov", unreachable: true }} />);
    expect(screen.getByRole("button", { name: /couldn't be reached/ })).toBeTruthy();
  });
});

/* ---- guarantees added with the accessibility pass ---- */
import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";

describe("guarantee: focus is never dropped", () => {
  it("after approving, focus moves to the receipt, which is announced", async () => {
    render(<ApprovalGate title="Send it?" scope={[{ label: "Send", risky: true }]} />);
    fireEvent.click(screen.getByRole("button", { name: "Approve" }));
    const receipt = await screen.findByRole("status");
    await waitFor(() => expect(document.activeElement).toBe(receipt));
  });

  it("after stopping, focus moves to the stopped receipt", async () => {
    render(<InterruptBar activity="Working" keptOnStop="3 results kept" />);
    fireEvent.click(screen.getByRole("button", { name: "Stop" }));
    await waitFor(() => expect(document.activeElement?.textContent).toMatch(/Stopped by you/));
  });

  it("opening a restore confirm puts focus on the confirm, and Escape backs out", async () => {
    render(
      <Checkpoint
        checkpoints={[
          { id: "b", label: "Now", time: "now" },
          { id: "a", label: "Earlier", time: "4m", undoes: "2 edits" },
        ]}
      />,
    );
    fireEvent.click(screen.getByRole("button", { name: "Restore to Earlier" }));
    const confirm = screen.getByRole("group", { name: "Restore to Earlier?" });
    expect(confirm.contains(document.activeElement)).toBe(true);
    fireEvent.keyDown(confirm, { key: "Escape" });
    await waitFor(() => expect(screen.queryByRole("group", { name: "Restore to Earlier?" })).toBeNull());
  });
});

describe("guarantee: continuous motion stops under prefers-reduced-motion", () => {
  // jsdom can't emulate the media query, so this checks the source: every animation that
  // loops forever must carry motion-reduce:hidden on the element it moves.
  it("every looping animation in the registry hides under reduced motion", () => {
    const root = path.resolve(__dirname, "../registry");
    const offenders: string[] = [];
    for (const dir of readdirSync(root)) {
      if (dir.startsWith("_")) continue;
      const src = readFileSync(path.join(root, dir, `${dir}.tsx`), "utf8").split("\n");
      src.forEach((line, i) => {
        if (!line.includes("repeat: Infinity")) return;
        const near = src.slice(Math.max(0, i - 5), i + 1).join("\n");
        if (!near.includes("motion-reduce:hidden")) offenders.push(`${dir}:${i + 1}`);
      });
    }
    expect(offenders).toEqual([]);
  });
});

/* ---- approval inside a tool call, thinking indicator, question flow ---- */
import { ThinkingIndicator } from "@/registry/thinking-indicator/thinking-indicator";
import { QuestionFlow } from "@/registry/question-flow/question-flow";

describe("guarantee: nothing irreversible without explicit consent (tool calls)", () => {
  const call = (props: Partial<Parameters<typeof ToolCallCard>[0]> = {}) => (
    <ToolCallCard name="charge_card" intent="Booking TAP 202" state="awaiting"
      approval={{ question: "Charge $612?", consequence: "Nonrefundable." }} {...props} />
  );

  it("a waiting call asks inside the card, says what allowing does, and Deny comes first", () => {
    const onAllow = vi.fn();
    render(call({ onAllow }));
    const group = screen.getByRole("group", { name: "Charge $612?" });
    expect(within(group).getByText("Nonrefundable.")).toBeTruthy();
    const [first, second] = within(group).getAllByRole("button");
    expect(first!.textContent).toBe("Deny");
    expect(second!.textContent).toBe("Allow");
    expect(onAllow).not.toHaveBeenCalled();
    fireEvent.click(second!);
    expect(onAllow).toHaveBeenCalledOnce();
  });

  it("a refusal reads as denied, not as a failure", () => {
    render(call({ state: "denied", detail: "Wait for Friday" }));
    expect(screen.getByText("Denied")).toBeTruthy();
    expect(screen.queryByText("Failed")).toBeNull();
  });

  it("after a decision, focus goes back to the call's header", async () => {
    const { rerender } = render(call({ onAllow: () => {} }));
    fireEvent.click(screen.getByRole("button", { name: "Allow" }));
    rerender(call({ state: "running" }));
    await waitFor(() => expect(document.activeElement?.textContent).toMatch(/charge_card/));
  });
});

describe("guarantee: state is never communicated by color alone (thinking)", () => {
  it("says what the agent is doing, then how long it took", () => {
    const { rerender } = render(<ThinkingIndicator detail="Checking carry-on rules" elapsed={3} />);
    expect(screen.getByRole("status").textContent).toMatch(/Thinking.*Checking carry-on rules/);
    rerender(<ThinkingIndicator state="done" elapsed={6} />);
    expect(screen.getByRole("status").textContent).toMatch(/Thought for 6s/);
  });
});

describe("guarantee: nothing irreversible without explicit consent (question flow)", () => {
  it("answers are only sent from the review, together, with skips as null", async () => {
    const onComplete = vi.fn();
    render(
      <QuestionFlow
        onComplete={onComplete}
        questions={[
          { id: "seat", question: "Which seat?", options: [{ label: "Aisle" }, { label: "Window" }] },
          { id: "card", question: "Which card?", options: [{ label: "Visa" }], fallback: "your default card" },
        ]}
      />,
    );
    fireEvent.click(screen.getByRole("button", { name: /Window/ }));
    fireEvent.click(await screen.findByRole("button", { name: /Skip, your default card/ }));
    expect(onComplete).not.toHaveBeenCalled();
    fireEvent.click(await screen.findByRole("button", { name: "Send answers" }));
    expect(onComplete).toHaveBeenCalledWith({ seat: "Window", card: null });
  });
});
