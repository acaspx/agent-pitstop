"use client";

import { useEffect, useState } from "react";
import { ToolCallCard, type ToolCallState } from "@/registry/tool-call-card/tool-call-card";

const sequence: ToolCallState[] = ["pending", "running", "success", "error"];

export function ToolCallCardDemo() {
  const [i, setI] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const state = sequence[i];

  useEffect(() => {
    if (state !== "running") return;
    setElapsed(0);
    const t = setInterval(() => setElapsed((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, [state]);

  return (
    <div className="space-y-4">
      <ToolCallCard
        name="search_flights"
        intent="Searching SFO → JFK, Aug 12, nonstop"
        state={state}
        elapsed={elapsed}
        args={'{\n  "from": "SFO",\n  "to": "JFK",\n  "date": "2026-08-12",\n  "nonstop": true\n}'}
        detail={
          state === "error"
            ? "RateLimitError: provider returned 429. Retrying in 30s (attempt 2/3)."
            : state === "success"
              ? "14 flights found. Cheapest nonstop: $278 (JetBlue 616, 7:15am)."
              : undefined
        }
      />
      <div className="flex gap-2">
        {sequence.map((s, idx) => (
          <button
            key={s}
            onClick={() => setI(idx)}
            className={`rounded-full border px-3 py-1 text-[12px] capitalize transition-colors ${
              idx === i ? "border-chalk text-chalk" : "border-line text-smoke hover:text-chalk"
            }`}
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}
