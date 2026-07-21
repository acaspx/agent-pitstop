import Link from "next/link";
import { PitFlag } from "@/components/docs/pit-flag";
import { LapRun } from "./lap-run";

export const metadata = {
  title: "The Full Lap — Agent Pit Stop",
  description:
    "Every component, one agent run: contract, telemetry, budget, a failure recovered, and a gate that waits for you. The stop button is real.",
};

export default function FullLapPage() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      <div className="mb-8 flex items-center justify-between">
        <Link
          href="/"
          className="flex min-h-11 items-center gap-3 font-mono text-[12px] tracking-[0.25em] text-pit"
        >
          <PitFlag size={20} className="shrink-0 text-chalk" />
          AGENT PIT STOP
        </Link>
        <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-ash">
          The Full Lap
        </span>
      </div>

      <div className="mb-8 max-w-2xl">
        <h1 className="text-[24px] font-semibold leading-tight tracking-tight text-chalk">
          Every component. One lap.
        </h1>
        <p className="mt-2 text-[14.5px] leading-relaxed text-smoke">
          A scripted agent run drives the whole system: contract at the start line, live
          telemetry, a budget, one failure recovered, and an irreversible step that waits
          for you. The controls aren&apos;t a movie. Stop actually stops it, steering is
          acknowledged, and nothing books until you say so.
        </p>
      </div>

      <LapRun />

      <p className="mt-10 border-t border-dotted border-line pt-5 text-[13px] text-ash">
        Built entirely from the{" "}
        <Link href="/components" className="text-smoke hover:text-pit">
          8 open components
        </Link>
        , unmodified. Install any of them with one command.
      </p>
    </main>
  );
}
