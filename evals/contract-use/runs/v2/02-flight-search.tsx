import { useState } from "react";
import { ToolCallCard, type ToolCallState } from "@/components/tool-call-card";
import { InterruptBar, type InterruptBarState } from "@/components/interrupt-bar";

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
  const [barState, setBarState] = useState<InterruptBarState>("running");
  const [callState, setCallState] = useState<ToolCallState>("running");
  const [detail, setDetail] = useState<string | undefined>(
    "14 nonstop flights found so far. Checking each one against your $400 cap.",
  );

  const stopped = barState === "stopped";

  function handleStop() {
    if (stopped) return;
    setBarState("stopped");
    // Same card, new state: its place in the transcript holds.
    setCallState("success");
    setDetail(
      "Stopped by you. The 14 nonstop flights found so far are kept. The $400 comparison wasn't finished.",
    );
    onStop();
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-2xl flex-col gap-4 p-6">
      <h1 className="text-lg font-semibold">Finding your flight to New York</h1>

      <ToolCallCard
        name="search_flights"
        intent="Searching nonstop SFO → JFK flights for Aug 12"
        state={callState}
        args={SEARCH_ARGS}
        detail={detail}
        elapsed={stopped ? undefined : 4}
      />

      <div className="sticky bottom-4 mt-auto">
        <InterruptBar
          activity="Comparing 14 flights against your $400 cap"
          elapsed={4}
          state={barState}
          keptOnStop="14 flight results saved"
          onStop={handleStop}
        />
      </div>
    </main>
  );
}
