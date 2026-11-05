"use client";

import { useEffect, useState } from "react";
import { ToolCallCard, type ToolCallState } from "@/registry/tool-call-card/tool-call-card";

const sequence: ToolCallState[] = ["pending", "running", "awaiting", "success", "error", "denied", "stopped"];
const LABEL: Record<ToolCallState, string> = {
  pending: "queued", running: "running", awaiting: "needs you", success: "done", error: "failed", denied: "denied", stopped: "stopped",
};

export function ToolCallCardDemo() {
  const [state, setState] = useState<ToolCallState>("pending");
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    if (state !== "running") return;
    setElapsed(0);
    const t = setInterval(() => setElapsed((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, [state]);

  const detail =
    state === "error" ? "RateLimitError: provider returned 429. Retrying in 30s (attempt 2/3)."
      : state === "success" ? "14 flights found. Cheapest nonstop: $278 (JetBlue 616, 7:15am)."
        : state === "denied" ? "You said no: “Wait until Friday's fares come out.”"
          : state === "stopped" ? "Stopped by you. 9 flights found so far are kept."
            : undefined;

  return (
    <div className="space-y-4">
      <ToolCallCard
        name="search_flights"
        intent="Searching SFO → JFK, Aug 12, nonstop"
        state={state}
        elapsed={elapsed}
        args={'{\n  "from": "SFO",\n  "to": "JFK",\n  "date": "2026-08-12",\n  "nonstop": true,\n  "provider": "premium ($0.40 per search)"\n}'}
        detail={detail}
        approval={{ question: "Use the paid fare provider?", consequence: "Costs $0.40 per search. It finds about 30% more nonstop fares." }}
        onAllow={() => setState("running")}
        onDeny={() => setState("denied")}
      />
      <div className="flex flex-wrap gap-2">
        {sequence.map((s) => (
          <button
            key={s}
            onClick={() => setState(s)}
            className={`rounded-full border px-3 py-1 text-[12px] transition-colors ${s === state ? "border-chalk text-chalk" : "border-line text-smoke hover:text-chalk"}`}
          >
            {LABEL[s]}
          </button>
        ))}
      </div>
    </div>
  );
}
