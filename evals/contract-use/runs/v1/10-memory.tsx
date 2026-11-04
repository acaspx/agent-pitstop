import { MemoryPanel } from "@/components/ui/memory-panel";

// The contract gives MemoryPanel's props but not the fields of `Memory`.
// The fields used below (id, text, source, date) are assumptions; check
// them against the installed component's exported `Memory` type.
const memories = [
  {
    id: "m1",
    text: "Prefers aisle seats on long flights",
    source: "From a chat about a New York trip",
    date: "Oct 12",
  },
  {
    id: "m2",
    text: "Flies out of SFO, not OAK",
    source: "From a chat about a New York trip",
    date: "Oct 12",
  },
  {
    id: "m3",
    text: "Expense reports go to finance@ on Fridays",
    source: "You told me",
    date: "Sep 30",
  },
];

export default function Screen({ onForget }: { onForget: (id: string) => void }) {
  return (
    <main className="mx-auto w-full max-w-xl p-6">
      <h1 className="mb-1 text-lg font-semibold">What I remember about you</h1>
      <p className="mb-4 text-sm text-neutral-600">
        Forgetting a memory deletes it for good once the undo window closes.
      </p>
      {/* MemoryPanel handles Forget, Undo and the remembering switch.
          It calls onForget only after the undo window ends, so the
          server delete happens only when the forget is final. */}
      <MemoryPanel memories={memories} onForget={onForget} />
    </main>
  );
}
