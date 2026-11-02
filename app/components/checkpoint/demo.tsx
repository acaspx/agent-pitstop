"use client";

import { useState } from "react";
import { Checkpoint } from "@/registry/checkpoint/checkpoint";

export function CheckpointDemo() {
  const [key, setKey] = useState(0);
  return (
    <div className="space-y-4">
      <Checkpoint
        key={key}
        checkpoints={[
          { id: "c4", label: "Refactored the billing client", time: "just now" },
          { id: "c3", label: "Tests passing on v2 API", time: "4 min ago", undoes: "the refactor (3 files)" },
          { id: "c2", label: "Swapped charge() for createPayment()", time: "9 min ago", undoes: "2 steps and 7 file edits" },
          { id: "c1", label: "Before the agent started", time: "12 min ago", undoes: "every change in this run" },
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
