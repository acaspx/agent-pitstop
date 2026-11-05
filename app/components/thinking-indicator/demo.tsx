"use client";

import { useEffect, useState } from "react";
import { ThinkingIndicator } from "@/registry/thinking-indicator/thinking-indicator";

const STEPS = ["Reading your question", "Searching fare tables", "Checking carry-on rules", "Comparing totals"];

export function ThinkingIndicatorDemo() {
  const [t, setT] = useState(0);
  const done = t >= 6;
  useEffect(() => {
    if (done) return;
    const id = setTimeout(() => setT((x) => x + 1), 1000);
    return () => clearTimeout(id);
  }, [t, done]);
  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-line bg-asphalt px-4 py-3">
        <ThinkingIndicator detail={STEPS[Math.min(STEPS.length - 1, Math.floor(t / 1.5))]} elapsed={t} state={done ? "done" : "thinking"} />
      </div>
      <button onClick={() => setT(0)} className="rounded-full border border-line px-3 py-1 text-[12px] text-smoke transition-colors hover:text-chalk">
        Replay
      </button>
    </div>
  );
}
