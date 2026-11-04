import { useState } from "react";
import { ReasoningTrace } from "@/components/reasoning-trace";
import { CitationChip, SourceDrawer, type Source } from "@/components/citation-chip";

const SOURCES: Source[] = [
  { title: "Fare rules: Blue Basic", domain: "jetblue.com", quote: "Carry-on bags are not included with Blue Basic." },
  { title: "Basic Economy bags", domain: "united.com", unreachable: true },
];

export default function Screen() {
  const [open, setOpen] = useState<number | null>(null);
  const toggle = (i: number) => setOpen((o) => (o === i ? null : i));
  return (
    <div className="space-y-3">
      <ReasoningTrace
        seconds={4}
        steps={[
          { label: "Searched fare tables", status: "done" },
          { label: "Checked carry-on rules", status: "done" },
          { label: "Compared totals", status: "done" },
        ]}
      />
      <p>
        No. JetBlue&apos;s cheapest fare doesn&apos;t include a carry-on
        <CitationChip index={1} source={SOURCES[0]!} active={open === 1} onOpen={toggle} />, so United Basic is $19 cheaper all in
        <CitationChip index={2} source={SOURCES[1]!} active={open === 2} onOpen={toggle} />.
      </p>
      <SourceDrawer sources={SOURCES} activeIndex={open} onSelect={setOpen} onClose={() => setOpen(null)} />
    </div>
  );
}
