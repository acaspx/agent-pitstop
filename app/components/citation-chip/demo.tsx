"use client";

import { useState } from "react";
import { CitationChip, SourceDrawer, type Source } from "@/registry/citation-chip/citation-chip";

const SOURCES: Source[] = [
  {
    title: "Fare rules: Blue Basic and Blue",
    domain: "jetblue.com",
    quote: "Blue Basic fares include one personal item. Carry-on bags are not included.",
  },
  {
    title: "Checked bag fees",
    domain: "united.com",
    quote: "Basic Economy customers may bring one full-sized carry-on bag on flights to and from New York.",
  },
  { title: "Airport delay statistics, August", domain: "bts.gov", unreachable: true },
];

export function CitationChipDemo() {
  const [active, setActive] = useState<number | null>(null);
  const open = (i: number) => setActive((a) => (a === i ? null : i));
  return (
    <div className="space-y-3">
      <p className="rounded-xl border border-line bg-asphalt px-4 py-3 text-[14px] leading-[1.9] text-smoke">
        JetBlue&apos;s cheapest fare doesn&apos;t include a carry-on
        <CitationChip index={1} source={SOURCES[0]} active={active === 1} onOpen={open} />, while United Basic does on New
        York routes
        <CitationChip index={2} source={SOURCES[1]} active={active === 2} onOpen={open} />. August evening departures run
        later on average
        <CitationChip index={3} source={SOURCES[2]} active={active === 3} onOpen={open} />.
      </p>
      <SourceDrawer sources={SOURCES} activeIndex={active} onSelect={setActive} onClose={() => setActive(null)} />
    </div>
  );
}
