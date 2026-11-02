"use client";

import { useEffect, useState } from "react";
import { TakeoverBanner, type TakeoverState } from "@/registry/takeover-banner/takeover-banner";

const REASON: Record<TakeoverState, string> = {
  agent: "Filling in passenger details on jetblue.com",
  "needs-you": "Sign in to JetBlue to continue. I don't type passwords.",
  you: "",
  resuming: "Checking you're signed in, then picking a seat",
};

export function TakeoverBannerDemo() {
  const [state, setState] = useState<TakeoverState>("agent");

  useEffect(() => {
    if (state === "agent") {
      const t = setTimeout(() => setState("needs-you"), 2600);
      return () => clearTimeout(t);
    }
    if (state === "resuming") {
      const t = setTimeout(() => setState("agent"), 1800);
      return () => clearTimeout(t);
    }
  }, [state]);

  return (
    <div className="space-y-4">
      <TakeoverBanner
        state={state}
        reason={REASON[state]}
        onTakeOver={() => setState("you")}
        onHandBack={() => setState("resuming")}
      />
      <div className="flex flex-wrap gap-2">
        {(["agent", "needs-you", "you", "resuming"] as TakeoverState[]).map((s) => (
          <button
            key={s}
            onClick={() => setState(s)}
            className={`rounded-full border px-3 py-1 text-[12px] transition-colors ${
              s === state ? "border-chalk text-chalk" : "border-line text-smoke hover:text-chalk"
            }`}
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}
