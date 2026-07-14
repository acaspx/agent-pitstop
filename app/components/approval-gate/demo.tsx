"use client";

import { useState } from "react";
import { ApprovalGate } from "@/registry/approval-gate/approval-gate";

export function ApprovalGateDemo() {
  const [key, setKey] = useState(0);

  return (
    <div className="space-y-4">
      <ApprovalGate
        key={key}
        title="Send the Q3 summary email?"
        reason="Draft is ready. I want to send it to the three stakeholders you mentioned this morning."
        scope={[
          { label: "Send email to 3 recipients", detail: "alice@, bob@, carol@acme.com", risky: true },
          { label: "Attach Q3-summary.pdf", detail: "412 KB, generated 2 min ago" },
          { label: "CC yourself", detail: "ac.design.px@gmail.com" },
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
