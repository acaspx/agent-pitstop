import Link from "next/link";
import { evals, loadEval, pct } from "@/lib/evals";

export const metadata = {
  title: "Evals — Agent Pit Stop",
  description: "How we test that agents can build correct interfaces with Agent Pit Stop, and the results.",
};

export default function EvalsOverview() {
  return (
    <main className="max-w-3xl">
      <h1 className="text-2xl font-semibold tracking-tight">Evals</h1>
      <p className="mt-3 text-[15px] leading-relaxed text-smoke">
        Agent Pit Stop is built mostly for coding agents to assemble interfaces from. The claim worth testing is
        whether they get it right. Each eval here gives fresh agents real product requests, scores the code they
        write against the real components, and keeps every run: the prompts, the code, and the scores.
      </p>

      <ul className="mt-10 space-y-4">
        {evals.map((e) => {
          const { runs } = loadEval(e.slug);
          const [a, b] = e.compare.map((r) => runs[r]);
          return (
            <li key={e.slug}>
              <Link
                href={`/evals/${e.slug}`}
                className="group block rounded-2xl border border-line bg-carbon p-5 transition-colors hover:border-ash"
              >
                <div className="text-[15px] font-medium text-chalk group-hover:text-pit">{e.title}</div>
                <p className="mt-1 text-[14px] text-smoke">{e.question}</p>
                {a && b && (
                  <dl className="mt-4 flex flex-wrap gap-x-8 gap-y-2 text-[13px]">
                    <div>
                      <dt className="text-ash">Before ({a.run})</dt>
                      <dd className="font-mono text-chalk">
                        {a.totals.promptsPassed}/{a.totals.prompts} screens correct · {pct(a.totals)}% of checks
                      </dd>
                    </div>
                    <div>
                      <dt className="text-ash">After ({b.run})</dt>
                      <dd className="font-mono text-signal">
                        {b.totals.promptsPassed}/{b.totals.prompts} screens correct · {pct(b.totals)}% of checks
                      </dd>
                    </div>
                  </dl>
                )}
              </Link>
            </li>
          );
        })}
      </ul>

      <section className="mt-12">
        <h2 className="text-sm font-medium uppercase tracking-wide text-ash">How an eval here works</h2>
        <ol className="mt-3 list-decimal space-y-2 pl-5 text-[15px] leading-relaxed text-smoke">
          <li>Write the prompts and the checks first, and prove every check can pass with hand-written answers.</li>
          <li>Run fresh agents that see only what a real agent would get, and save what they write, unedited.</li>
          <li>Score it: compile against the real types, render it, drive it, run axe.</li>
          <li>Fix what the failures point at in the system, never in the prompts, then rerun the same prompts.</li>
        </ol>
      </section>
    </main>
  );
}
