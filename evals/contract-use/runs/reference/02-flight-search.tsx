import { ToolCallCard } from "@/components/tool-call-card";
import { InterruptBar } from "@/components/interrupt-bar";

export default function Screen({ onStop }: { onStop: () => void }) {
  return (
    <div className="space-y-3">
      <ToolCallCard name="search_flights" intent="Searching SFO → JFK, Aug 12, nonstop" state="running" elapsed={4} />
      <InterruptBar activity="Comparing 14 flights against your $400 cap" elapsed={4} keptOnStop="14 flights found so far are saved" onStop={onStop} />
    </div>
  );
}
