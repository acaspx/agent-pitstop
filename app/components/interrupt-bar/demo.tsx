"use client";

import { useEffect, useState } from "react";
import { InterruptBar, type InterruptBarState } from "@/registry/interrupt-bar/interrupt-bar";

const activities = [
  "Searching 3 flight providers…",
  "Comparing 14 flights against your $400 cap…",
  "Checking seat availability on the top 3…",
  "Drafting your itinerary email…",
];

export function InterruptBarDemo() {
  const [state, setState] = useState<InterruptBarState>("running");
  const [elapsed, setElapsed] = useState(0);
  const [ack, setAck] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (state !== "running") return;
    const t = setInterval(() => setElapsed((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, [state]);

  const activity = activities[Math.min(Math.floor(elapsed / 4), activities.length - 1)];

  return (
    <div className="space-y-4">
      <InterruptBar
        activity={activity}
        elapsed={elapsed}
        state={state}
        keptOnStop="14 search results saved to the thread"
        onStop={() => setState("stopped")}
        onSteer={(msg) => setAck(`Got it: "${msg}" — adjusting without restarting.`)}
        acknowledgment={ack}
      />
      <button
        onClick={() => {
          setState("running");
          setElapsed(0);
          setAck(undefined);
        }}
        className="rounded-full border border-line px-3 py-1 text-[12px] text-smoke transition-colors hover:text-chalk"
      >
        Reset
      </button>
    </div>
  );
}
