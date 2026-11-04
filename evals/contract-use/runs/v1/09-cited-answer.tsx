import { useState } from "react";
import { ReasoningTrace } from "@/components/reasoning-trace";
import { CitationChip } from "@/components/citation-chip";

const QUESTION = "Is the cheapest SFO to JFK fare still cheapest with a carry-on?";

const steps = [
  { label: "Searched fare tables", status: "done" as const },
  { label: "Checked carry-on rules", status: "done" as const },
  { label: "Compared totals", status: "done" as const },
];

const sources = [
  {
    title: "JetBlue: Blue Basic fare",
    url: "https://www.jetblue.com",
    quote: "Carry-on bags are not included with Blue Basic.",
  },
  {
    title: "United: Basic Economy fare",
    url: "https://www.united.com",
    unreachable: true,
  },
];

export default function Screen() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) =>
    setOpenIndex((current) => (current === index ? null : index));

  return (
    <main className="mx-auto flex max-w-2xl flex-col gap-4 p-6">
      <div className="self-end rounded-2xl bg-neutral-100 px-4 py-2 text-sm text-neutral-900">
        {QUESTION}
      </div>

      <section aria-label="Agent answer" className="flex flex-col gap-3">
        <ReasoningTrace steps={steps} streaming={false} seconds={4} />

        <p className="text-base leading-relaxed text-neutral-900">
          No. JetBlue&apos;s cheapest fare doesn&apos;t include a carry-on
          <CitationChip
            index={1}
            source={sources[0]}
            active={openIndex === 1}
            onOpen={toggle}
            className="mx-1 align-baseline"
          />
          , so United Basic is $19 cheaper all in.
          <CitationChip
            index={2}
            source={sources[1]}
            active={openIndex === 2}
            onOpen={toggle}
            className="ml-1 align-baseline"
          />
        </p>
      </section>
    </main>
  );
}
