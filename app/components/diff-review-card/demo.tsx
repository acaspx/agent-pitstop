"use client";

import { useState } from "react";
import { DiffReviewCard } from "@/registry/diff-review-card/diff-review-card";

export function DiffReviewCardDemo() {
  const [key, setKey] = useState(0);
  return (
    <div className="space-y-4">
      <DiffReviewCard
        key={key}
        file="src/api/client.ts"
        hunks={[
          {
            id: "timeout",
            summary: "Retry once on timeout instead of failing",
            removed: ["  return fetch(url, opts);"],
            added: ["  return withRetry(() => fetch(url, opts), { tries: 2 });"],
          },
          {
            id: "log",
            summary: "Log the request id with every error",
            removed: ['  console.error("request failed");'],
            added: ['  console.error("request failed", { id: res.headers.get("x-request-id") });'],
          },
        ]}
      />
      <button
        onClick={() => setKey((k) => k + 1)}
        className="rounded-full border border-line px-3 py-1 text-[12px] text-smoke transition-colors hover:text-chalk"
      >
        Reset
      </button>
    </div>
  );
}
