"use client";

import { useEffect, useState } from "react";
import { ReasoningTrace, type ReasoningStep } from "@/registry/reasoning-trace/reasoning-trace";

const SCRIPT: Omit<ReasoningStep, "status">[] = [
  { label: "Reading your question", detail: "Which carriers fly SFO to JFK nonstop on Aug 12?" },
  { label: "Searching fare tables", detail: "14 nonstop options across 4 carriers", sources: ["jetblue.com", "united.com"] },
  { label: "Checking baggage rules", detail: "JetBlue Blue fare excludes a carry-on", sources: ["jetblue.com"] },
  { label: "Comparing total cost", detail: "United Basic is $31 cheaper once bags are in" },
];

export function ReasoningTraceDemo() {
  const [at, setAt] = useState(0);
  const [run, setRun] = useState(0);
  const streaming = at < SCRIPT.length;

  useEffect(() => {
    if (!streaming) return;
    const t = setTimeout(() => setAt((n) => n + 1), 1100);
    return () => clearTimeout(t);
  }, [at, streaming, run]);

  const steps: ReasoningStep[] = SCRIPT.map((s, i) => ({
    ...s,
    status: i < at ? "done" : i === at ? "active" : "pending",
  }));

  return (
    <div className="space-y-4">
      <ReasoningTrace steps={steps} streaming={streaming} seconds={5} />
      <button
        onClick={() => {
          setAt(0);
          setRun((r) => r + 1);
        }}
        className="rounded-full border border-line px-3 py-1 text-[12px] text-smoke transition-colors hover:text-chalk"
      >
        Replay
      </button>
    </div>
  );
}
