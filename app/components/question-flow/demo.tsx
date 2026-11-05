"use client";

import { useState } from "react";
import { QuestionFlow, type FlowAnswers } from "@/registry/question-flow/question-flow";

export function QuestionFlowDemo() {
  const [key, setKey] = useState(0);
  const [sent, setSent] = useState<FlowAnswers | null>(null);
  return (
    <div className="space-y-4">
      <QuestionFlow
        key={key}
        onComplete={setSent}
        questions={[
          { id: "seat", question: "Which seat should I hold?", why: "Two fares tie on price; the seat decides which I book.", options: [{ label: "Aisle", detail: "United 1532" }, { label: "Window", detail: "JetBlue 616" }], fallback: "I'll take the earlier flight" },
          { id: "bag", question: "Are you checking a bag?", why: "It changes which fare is cheapest all in.", options: [{ label: "Carry-on only" }, { label: "One checked bag", detail: "Adds $35 on JetBlue" }] },
          { id: "pay", question: "Which card should I use?", options: [{ label: "Visa ending 4242" }, { label: "Amex ending 1005" }], fallback: "I'll use your default card" },
        ]}
      />
      {sent && <p className="font-mono text-[12px] text-ash">onComplete → {JSON.stringify(sent)}</p>}
      <button onClick={() => { setKey((k) => k + 1); setSent(null); }} className="rounded-full border border-line px-3 py-1 text-[12px] text-smoke transition-colors hover:text-chalk">
        Reset
      </button>
    </div>
  );
}
