"use client";

import { useEffect, useRef, useState } from "react";
import { AgentTaskList, type AgentTask } from "@/registry/agent-task-list/agent-task-list";

const script: AgentTask[][] = [
  [
    { title: "Find flights SFO → JFK", status: "active", detail: "Checking 3 providers…" },
    { title: "Compare prices with your budget", status: "pending" },
    { title: "Hold the best option", status: "pending" },
    { title: "Draft itinerary email", status: "pending" },
  ],
  [
    { title: "Find flights SFO → JFK", status: "done" },
    { title: "Compare prices with your budget", status: "active", detail: "14 flights vs $400 cap" },
    { title: "Hold the best option", status: "pending" },
    { title: "Draft itinerary email", status: "pending" },
  ],
  [
    { title: "Find flights SFO → JFK", status: "done" },
    { title: "Compare prices with your budget", status: "done" },
    { title: "Hold the best option", status: "failed", detail: "Hold expired: fare no longer available. Trying next option." },
    { title: "Draft itinerary email", status: "pending" },
  ],
  [
    { title: "Find flights SFO → JFK", status: "done" },
    { title: "Compare prices with your budget", status: "done" },
    { title: "Hold the best option", status: "done" },
    { title: "Draft itinerary email", status: "active", detail: "Writing…" },
  ],
  [
    { title: "Find flights SFO → JFK", status: "done" },
    { title: "Compare prices with your budget", status: "done" },
    { title: "Hold the best option", status: "done" },
    { title: "Draft itinerary email", status: "done" },
  ],
];

export function AgentTaskListDemo() {
  const [step, setStep] = useState(0);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    timer.current = setInterval(() => {
      setStep((s) => (s + 1) % script.length);
    }, 2200);
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, []);

  return (
    <div className="space-y-4">
      <AgentTaskList label="Booking your trip" tasks={script[step]} />
      <div className="flex gap-2">
        {script.map((_, idx) => (
          <button
            key={idx}
            onClick={() => {
              if (timer.current) clearInterval(timer.current);
              setStep(idx);
            }}
            aria-label={`Step ${idx + 1}`}
            className={`h-1.5 w-6 rounded-full transition-colors ${
              idx === step ? "bg-chalk" : "bg-line hover:bg-ash"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
