import { useState } from "react";
import { ToolCallCard } from "@/components/ui/tool-call-card";
import { InterruptBar } from "@/components/ui/interrupt-bar";

const SEARCH_ARGS = JSON.stringify(
  {
    origin: "SFO",
    destination: "JFK",
    date: "2026-08-12",
    nonstop: true,
    max_price_usd: 400,
  },
  null,
  2,
);

export default function Screen({ onStop }: { onStop: () => void }) {
  const [stopped, setStopped] = useState(false);

  const handleStop = () => {
    setStopped(true);
    onStop();
  };

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-2xl flex-col gap-4 p-6">
      <section aria-label="Agent transcript" className="flex flex-col gap-3">
        <p className="text-sm text-neutral-700">
          Find me a nonstop from SFO to JFK on Aug 12, under $400.
        </p>

        {/* One card for the whole call: its state changes on this card, so its place in the transcript holds */}
        <ToolCallCard
          name="search_flights"
          intent="Searching nonstop SFO → JFK flights for Aug 12"
          state={stopped ? "success" : "running"}
          args={SEARCH_ARGS}
          detail={
            stopped
              ? "Stopped by you. 14 nonstop flights found so far, all kept. Not yet checked against your $400 cap."
              : "14 nonstop flights found. Checking each against your $400 cap."
          }
          elapsed={stopped ? undefined : 4}
        />
      </section>

      {/* Stays on screen for the whole run */}
      <InterruptBar
        className="sticky bottom-4"
        activity="Comparing 14 flights against your $400 cap"
        elapsed={4}
        keptOnStop="14 flight results saved"
        onStop={handleStop}
      />
    </main>
  );
}
