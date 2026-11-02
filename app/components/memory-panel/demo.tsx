"use client";

import { useState } from "react";
import { MemoryPanel } from "@/registry/memory-panel/memory-panel";

export function MemoryPanelDemo() {
  const [key, setKey] = useState(0);
  return (
    <div className="space-y-4">
      <MemoryPanel
        key={key}
        memories={[
          { id: "m1", text: "Prefers aisle seats on flights over 3 hours", source: "Trip to New York", learnedAt: "Oct 12" },
          { id: "m2", text: "Flies out of SFO, not OAK", source: "Trip to New York", learnedAt: "Oct 12" },
          { id: "m3", text: "Expense reports go to finance@ on Fridays", source: "You told me", learnedAt: "Sep 30" },
          { id: "m4", text: "Writes in short, plain sentences", source: "Drafting the Q3 summary", learnedAt: "Sep 2" },
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
