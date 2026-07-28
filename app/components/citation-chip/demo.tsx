"use client";

import { CitationChip } from "@/registry/citation-chip/citation-chip";

export function CitationChipDemo() {
  return (
    <div className="rounded-xl border border-line bg-asphalt px-4 py-3 text-[13.5px] leading-relaxed text-chalk">
      Jetline&apos;s on-time rate improved to 92% this quarter
      <CitationChip
        n={1}
        source={{
          title: "DOT Air Travel Consumer Report, June 2026",
          publisher: "transportation.gov",
          url: "https://www.transportation.gov/air-consumer",
          quote:
            "Jetline Airways reported an on-time arrival rate of 92.1 percent for the quarter, up from 87.4 percent in the prior period.",
          retrieved: "2h ago",
        }}
      />
      , while cancellations fell to a three-year low
      <CitationChip
        n={2}
        source={{
          title: "Jetline Q2 operations update",
          publisher: "jetline.com",
          retrieved: "2h ago",
        }}
      />
      .
    </div>
  );
}
