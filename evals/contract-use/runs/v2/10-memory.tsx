import { useCallback, useState } from "react";
import { MemoryPanel, type Memory } from "@/components/memory-panel";

const INITIAL_MEMORIES: Memory[] = [
  {
    id: "m1",
    text: "Prefers aisle seats on long flights",
    source: "Chat about your New York trip",
    learnedAt: "Oct 12",
  },
  {
    id: "m2",
    text: "Flies out of SFO, not OAK",
    source: "Chat about your New York trip",
    learnedAt: "Oct 12",
  },
  {
    id: "m3",
    text: "Expense reports go to finance@ on Fridays",
    source: "You told me",
    learnedAt: "Sep 30",
  },
];

export default function Screen({ onForget }: { onForget: (id: string) => void }) {
  const [memories, setMemories] = useState<Memory[]>(INITIAL_MEMORIES);

  // MemoryPanel calls this only once a forget is final (after its Undo window),
  // so this is the one place we delete on the server for good.
  const handleForget = useCallback(
    (id: string) => {
      onForget(id);
      setMemories((current) => current.filter((memory) => memory.id !== id));
    },
    [onForget],
  );

  return (
    <main className="mx-auto w-full max-w-xl px-4 py-8">
      <header className="mb-6">
        <h1 className="text-xl font-semibold">What I remember about you</h1>
        <p className="mt-1 text-sm opacity-70">
          These are the things I've picked up from our chats, and where each one came from.
          Forget anything you don't want me to keep. You'll have a few seconds to undo before
          it's deleted for good.
        </p>
      </header>
      <MemoryPanel memories={memories} onForget={handleForget} />
    </main>
  );
}
