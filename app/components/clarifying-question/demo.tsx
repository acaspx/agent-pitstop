"use client";

import { useState } from "react";
import { ClarifyingQuestion } from "@/registry/clarifying-question/clarifying-question";

export function ClarifyingQuestionDemo() {
  const [key, setKey] = useState(0);
  return (
    <div className="space-y-4">
      <ClarifyingQuestion
        key={key}
        question="Which seat should I hold?"
        why="Two fares are the same price. Seat choice decides which one I book."
        options={[
          { label: "Aisle", detail: "United 1532, row 22" },
          { label: "Window", detail: "JetBlue 616, row 9" },
          { label: "Whichever leaves earlier", detail: "JetBlue 616, 7:15am" },
        ]}
        allowOther
        fallback="I'll pick the earlier flight"
      />
      <button
        onClick={() => setKey((k) => k + 1)}
        className="rounded-full border border-line px-3 py-1 text-[12px] text-smoke transition-colors hover:text-chalk"
      >
        Reset
      </button>
    </div>
  );
}
