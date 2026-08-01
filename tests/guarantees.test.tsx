/**
 * The contract's guarantees, asserted.
 *
 * /r/contract.json declares five behavioral guarantees. These tests are
 * their enforcement: a change that breaks a guarantee fails CI, so the
 * philosophy cannot be broken silently. Each describe block names the
 * guarantee it protects.
 */
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";

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
    fireEvent.click(screen.getByRole("button", { expanded: false }));
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
