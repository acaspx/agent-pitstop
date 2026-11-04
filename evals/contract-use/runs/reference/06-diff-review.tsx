import { DiffReviewCard } from "@/components/diff-review-card";

export default function Screen({ onApply }: { onApply: (changeId: string) => void }) {
  return (
    <DiffReviewCard
      file="src/api/client.ts"
      hunks={[
        { id: "retry", summary: "Retry once on timeout", removed: ["return fetch(url, opts);"], added: ["return withRetry(() => fetch(url, opts));"] },
        { id: "log", summary: "Log the request id with errors", removed: ['console.error("failed");'], added: ['console.error("failed", { id });'] },
      ]}
      onDecide={(id, decision) => decision === "accepted" && onApply(id)}
    />
  );
}
