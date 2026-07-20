"use client";

import { useState } from "react";
import { AgentInbox, type InboxItem } from "@/registry/agent-inbox/agent-inbox";

const initial: InboxItem[] = [
  {
    id: "1",
    title: "Reconcile March invoices",
    summary: "14 matched, 2 need a decision",
    status: "needs_review",
    reason: "2 matches below confidence threshold",
    time: "2h ago",
  },
  {
    id: "2",
    title: "Draft outreach for 8 leads",
    summary: "Drafts ready, held before sending",
    status: "needs_review",
    reason: "sending email is irreversible",
    time: "4h ago",
  },
  {
    id: "3",
    title: "Weekly competitor scan",
    summary: "Reading 12 changelog pages…",
    status: "running",
    time: "now",
  },
  {
    id: "4",
    title: "Archive stale tickets",
    summary: "62 archived, log attached",
    status: "done",
    time: "1d ago",
  },
];

export function AgentInboxDemo() {
  const [opened, setOpened] = useState<string | null>(null);

  return (
    <div className="space-y-3">
      <AgentInbox items={initial} onOpen={(id) => setOpened(id)} />
      <p className="text-[12px] text-smoke" aria-live="polite">
        {opened
          ? `Opened run #${opened} for review. In a product, this routes to the run's transcript with its approval gates.`
          : "Tap a run to open it for review."}
      </p>
    </div>
  );
}
