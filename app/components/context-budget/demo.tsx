"use client";

import { useState } from "react";
import { ContextBudget } from "@/registry/context-budget/context-budget";

export function ContextBudgetDemo() {
  const [spendCap, setSpendCap] = useState(5);
  const [raised, setRaised] = useState(false);

  return (
    <div className="space-y-3">
      <ContextBudget
        label="Research run budget"
        lines={[
          { label: "Spend", used: 5, cap: spendCap, format: (n) => `$${n.toFixed(2)}` },
          { label: "Tokens", used: 412_000, cap: 1_000_000, format: (n) => `${Math.round(n / 1000)}k` },
          { label: "Time", used: 21, cap: 45, format: (n) => `${n}m` },
        ]}
        onRaise={() => {
          setSpendCap(10);
          setRaised(true);
        }}
      />
      <p className="text-[12px] text-smoke" aria-live="polite">
        {raised
          ? "Cap raised to $10.00 by you. The run resumes; the receipt records who raised it."
          : "The run hit its $5 spend cap and paused. Raising the cap is a human decision."}
      </p>
    </div>
  );
}
