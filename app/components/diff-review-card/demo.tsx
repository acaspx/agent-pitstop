"use client";

import { useState } from "react";
import { DiffReviewCard } from "@/registry/diff-review-card/diff-review-card";

export function DiffReviewCardDemo() {
  const [key, setKey] = useState(0);

  return (
    <div className="space-y-4">
      <DiffReviewCard
        key={key}
        title="Tighten the pricing page copy"
        target="pricing.md"
        hunks={[
          {
            id: "h1",
            label: "Hero headline",
            before: ["Powerful plans for teams of every size"],
            after: ["Plans that scale with your team"],
          },
          {
            id: "h2",
            label: "Pro tier description",
            before: ["Unlock advanced features and integrations", "to supercharge your workflow."],
            after: ["Advanced features and every integration.", "No workflow supercharging required."],
          },
          {
            id: "h3",
            label: "CTA button",
            before: ["Get started today!"],
            after: ["Start free"],
          },
        ]}
      />
      <button
        onClick={() => setKey((k) => k + 1)}
        className="min-h-9 rounded-full border border-line px-3 py-1 text-[12px] text-smoke transition-colors hover:text-chalk pointer-coarse:min-h-11"
      >
        Reset
      </button>
    </div>
  );
}
