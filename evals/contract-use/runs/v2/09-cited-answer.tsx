import { useState } from "react";
import { ReasoningTrace, type ReasoningStep } from "@/components/reasoning-trace";
import { CitationChip, SourceDrawer, type Source } from "@/components/citation-chip";

const question = "Is the cheapest SFO to JFK fare still cheapest with a carry-on?";

const steps: ReasoningStep[] = [
  {
    label: "Searching SFO to JFK fare tables",
    status: "done",
    detail: "JetBlue Blue Basic is the lowest base fare",
    sources: ["jetblue.com", "united.com"],
  },
  {
    label: "Checking carry-on rules",
    status: "done",
    detail: "Blue Basic doesn't include a carry-on bag",
    sources: ["jetblue.com", "united.com"],
  },
  {
    label: "Comparing totals with a carry-on",
    status: "done",
    detail: "United Basic comes out $19 cheaper all in",
  },
];

const sources: Source[] = [
  {
    title: "Blue Basic fare: what's included",
    domain: "jetblue.com",
    quote: "Carry-on bags are not included with Blue Basic.",
  },
  {
    title: "United Basic Economy fare",
    domain: "united.com",
    unreachable: true,
  },
];

export default function Screen() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const toggle = (index: number) =>
    setActiveIndex((current) => (current === index ? null : index));

  return (
    <main className="mx-auto flex max-w-2xl flex-col gap-6 p-6">
      <div className="self-end rounded-2xl bg-neutral-100 px-4 py-2 text-sm text-neutral-900 dark:bg-neutral-800 dark:text-neutral-100">
        {question}
      </div>

      <section aria-label="Agent answer" className="flex flex-col gap-4">
        <ReasoningTrace steps={steps} streaming={false} seconds={4} />

        <p className="text-base leading-relaxed text-neutral-900 dark:text-neutral-100">
          No. JetBlue's cheapest fare doesn't include a carry-on
          <CitationChip
            index={1}
            source={sources[0]}
            active={activeIndex === 1}
            onOpen={toggle}
            className="mx-1"
          />
          , so United Basic is $19 cheaper all in.
          <CitationChip
            index={2}
            source={sources[1]}
            active={activeIndex === 2}
            onOpen={toggle}
            className="ml-1"
          />
        </p>

        <SourceDrawer
          sources={sources}
          activeIndex={activeIndex}
          onSelect={setActiveIndex}
          onClose={() => setActiveIndex(null)}
        />
      </section>
    </main>
  );
}
