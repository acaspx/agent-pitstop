"use client";

import { useState } from "react";
import { PlanReview } from "@/registry/plan-review/plan-review";

export function PlanReviewDemo() {
  const [key, setKey] = useState(0);
  return (
    <div className="space-y-4">
      <PlanReview
        key={key}
        goal="Move billing to the v2 payments API"
        onRevise={() => setKey((k) => k + 1)}
        steps={[
          { title: "Read the current billing client", detail: "src/billing/*.ts, 6 files" },
          { title: "Swap charge() for the v2 createPayment()", detail: "Keeps the same retry rules" },
          { title: "Update the 14 billing tests" },
          { title: "Run the migration on staging data", detail: "Writes to the staging database", risky: true },
          { title: "Open a pull request for review" },
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
