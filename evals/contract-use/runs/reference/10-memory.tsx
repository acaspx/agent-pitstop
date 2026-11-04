import { MemoryPanel } from "@/components/memory-panel";

export default function Screen({ onForget }: { onForget: (id: string) => void }) {
  return (
    <MemoryPanel
      memories={[
        { id: "m1", text: "Prefers aisle seats on long flights", source: "Chat about a New York trip", learnedAt: "Oct 12" },
        { id: "m2", text: "Flies out of SFO, not OAK", source: "Chat about a New York trip", learnedAt: "Oct 12" },
        { id: "m3", text: "Expense reports go to finance@ on Fridays", source: "You told me", learnedAt: "Sep 30" },
      ]}
      onForget={onForget}
    />
  );
}
