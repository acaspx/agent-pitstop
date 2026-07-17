"use client";

import { useState } from "react";
import { ConfidenceMeter } from "@/registry/confidence-meter/confidence-meter";

export function ConfidenceMeterDemo() {
  const [confidence, setConfidence] = useState(0.55);
  const [verified, setVerified] = useState(false);

  return (
    <div className="space-y-4">
      <ConfidenceMeter
        claim={verified ? "This invoice matches PO #4412 (verified by you)" : "This invoice matches PO #4412"}
        basis="3 matching fields, 1 OCR gap on the total"
        confidence={verified ? 1 : confidence}
        onVerify={() => setVerified(true)}
      />
      <div className="flex items-center gap-3">
        <label htmlFor="conf" className="text-[12px] text-smoke">
          Model confidence
        </label>
        <input
          id="conf"
          type="range"
          min="0"
          max="100"
          value={Math.round(confidence * 100)}
          onChange={(e) => {
            setVerified(false);
            setConfidence(Number(e.target.value) / 100);
          }}
          className="h-1 flex-1 accent-[#60a5fa]"
        />
        <span className="w-9 text-right font-mono text-[12px] text-ash">
          {Math.round(confidence * 100)}%
        </span>
      </div>
    </div>
  );
}
