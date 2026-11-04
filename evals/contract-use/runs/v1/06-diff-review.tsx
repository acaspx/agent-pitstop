import { useRef } from "react";
import {
  DiffReviewCard,
  type DiffHunk,
  type HunkDecision,
} from "@/components/ui/diff-review-card";

const HUNKS: DiffHunk[] = [
  {
    id: "retry",
    summary: "Retry once on timeout",
    lines: [
      { type: "remove", text: "return fetch(url, opts);" },
      { type: "add", text: "return withRetry(() => fetch(url, opts));" },
    ],
  },
  {
    id: "log",
    summary: "Log the request id with errors",
    lines: [
      { type: "remove", text: 'console.error("failed");' },
      { type: "add", text: 'console.error("failed", { id });' },
    ],
  },
];

export default function Screen({ onApply }: { onApply: (changeId: string) => void }) {
  // A change is applied at most once, and only after the person accepts it.
  const applied = useRef<Set<string>>(new Set());

  function handleDecide(id: string, decision: Exclude<HunkDecision, "pending">) {
    if (decision !== "accepted") return;
    if (applied.current.has(id)) return;
    applied.current.add(id);
    onApply(id);
  }

  return (
    <main className="mx-auto flex max-w-2xl flex-col gap-4 p-6">
      <header className="flex flex-col gap-1">
        <h1 className="text-lg font-semibold">Review proposed changes</h1>
        <p className="text-sm text-muted-foreground">
          The agent wants to make two changes to the API client. Accept or reject each one on
          its own. Only the changes you accept will be applied.
        </p>
      </header>
      <DiffReviewCard file="src/api/client.ts" hunks={HUNKS} onDecide={handleDecide} />
    </main>
  );
}
