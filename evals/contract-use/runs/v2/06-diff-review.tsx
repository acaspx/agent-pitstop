import { useRef, useState } from "react";
import { DiffReviewCard, type HunkDecision, type DiffHunk } from "@/components/diff-review-card";

const FILE = "src/api/client.ts";

const HUNKS: DiffHunk[] = [
  {
    id: "retry",
    summary: "Retry the request once on timeout",
    removed: ["return fetch(url, opts);"],
    added: ["return withRetry(() => fetch(url, opts));"],
  },
  {
    id: "log",
    summary: "Log the request id with errors",
    removed: ['console.error("failed");'],
    added: ['console.error("failed", { id });'],
  },
];

export default function Screen({ onApply }: { onApply: (changeId: string) => void }) {
  const [decisions, setDecisions] = useState<Record<string, HunkDecision>>(() =>
    Object.fromEntries(HUNKS.map((h) => [h.id, "pending" as HunkDecision])),
  );
  // Guards against applying the same change twice (e.g. a repeated event).
  const applied = useRef<Set<string>>(new Set());

  function handleDecide(id: string, decision: Exclude<HunkDecision, "pending">) {
    setDecisions((prev) => ({ ...prev, [id]: decision }));
    if (decision === "accepted" && !applied.current.has(id)) {
      applied.current.add(id);
      onApply(id);
    }
  }

  return (
    <main className="mx-auto flex max-w-2xl flex-col gap-4 p-6">
      <header className="flex flex-col gap-1">
        <h1 className="text-lg font-semibold">Review proposed changes</h1>
        <p className="text-sm text-neutral-600">
          The agent wants to make two changes to {FILE}. Accept or reject each one on its own.
          Only the changes you accept will be applied.
        </p>
      </header>
      <DiffReviewCard file={FILE} hunks={HUNKS} decisions={decisions} onDecide={handleDecide} />
    </main>
  );
}
