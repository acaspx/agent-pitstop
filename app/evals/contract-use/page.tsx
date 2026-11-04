import { readFileSync } from "node:fs";
import path from "node:path";
import Link from "next/link";
import { CodeBlock } from "@/components/docs/code-block";
import { REPO } from "@/lib/changelog";
import { evals, loadEval, passByCheck, pct, SHARED_CHECKS, type EvalRun } from "@/lib/evals";

export const metadata = {
  title: "Contract use eval — Agent Pit Stop",
  description:
    "Ten product requests, each given to a fresh agent with only the contract. Baseline 0/10 correct screens; after tightening the contract, 10/10.",
};

const SLUG = "contract-use";
const SRC = `${REPO}/blob/main/evals/${SLUG}`;

/** One component's entry in a snapshot of the contract, as the agents saw it. */
function entry(version: string, name: string) {
  const file = path.join(process.cwd(), "evals", SLUG, "contracts", version, "contract.json");
  const c = JSON.parse(readFileSync(file, "utf8")) as { components: Record<string, unknown>[] };
  const e = c.components.find((x) => x.n === name) ?? {};
  const keep = Object.fromEntries(Object.entries(e).filter(([k]) => ["n", "c", "i", "p", "t", "x"].includes(k)));
  return JSON.stringify(keep, null, 1);
}

function Score({ run, tone }: { run: EvalRun; tone: "before" | "after" }) {
  return (
    <div className={`rounded-2xl border p-5 ${tone === "after" ? "border-signal/40" : "border-line"} bg-carbon`}>
      <div className="text-[12px] font-medium uppercase tracking-wide text-ash">
        {tone === "before" ? "Before" : "After"} · contract {run.run}
      </div>
      <div className={`mt-2 text-4xl font-semibold tracking-tight ${tone === "after" ? "text-signal" : "text-chalk"}`}>
        {run.totals.promptsPassed}/{run.totals.prompts}
      </div>
      <div className="mt-1 text-[13px] text-smoke">screens fully correct</div>
      <div className="mt-3 font-mono text-[13px] text-chalk">
        {run.totals.checksPassed}/{run.totals.checks} checks · {pct(run.totals)}%
      </div>
    </div>
  );
}

export default function ContractUseEval() {
  const meta = evals.find((e) => e.slug === SLUG)!;
  const { prompts, runs } = loadEval(SLUG);
  const [before, after] = meta.compare.map((r) => runs[r]!);
  const reference = runs.reference;
  const shared = SHARED_CHECKS.map((name, i) => ({
    name,
    before: passByCheck(before, SHARED_CHECKS)[i]!,
    after: passByCheck(after, SHARED_CHECKS)[i]!,
  }));

  return (
    <main className="max-w-4xl">
      <div className="text-[11px] font-medium uppercase tracking-wide text-ash">Evals</div>
      <h1 className="mt-2 text-2xl font-semibold tracking-tight">{meta.question}</h1>
      <p className="mt-3 max-w-prose text-[15px] leading-relaxed text-smoke">
        Ten product requests of the kind a coding agent gets. Each went to a fresh agent that could read only{" "}
        <code className="font-mono text-[13px] text-chalk">llms.txt</code> and{" "}
        <code className="font-mono text-[13px] text-chalk">contract.json</code>: no component source, no docs site. Its
        code was then compiled against the real types and driven against the real components. The baseline found the
        gaps; fixing them in the contract generator, and nowhere else, closed them.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <Score run={before} tone="before" />
        <Score run={after} tone="after" />
      </div>
      <p className="mt-3 text-[13px] text-ash">
        Agent: {after.agent}. Same prompts, same brief, scored by the same checks.
        {reference && ` Hand-written reference answers score ${reference.totals.checksPassed}/${reference.totals.checks}, so every check can pass.`}
      </p>

      <section className="mt-12">
        <h2 className="text-sm font-medium uppercase tracking-wide text-ash">Where the baseline broke</h2>
        <div className="mt-3 overflow-hidden rounded-xl border border-line">
          <table className="w-full text-left text-[14px]">
            <thead className="bg-asphalt text-[12px] uppercase tracking-wide text-ash">
              <tr>
                <th className="px-4 py-2.5 font-medium">Check, on every screen</th>
                <th className="px-4 py-2.5 text-right font-medium">{before.run}</th>
                <th className="px-4 py-2.5 text-right font-medium">{after.run}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {shared.map((r) => (
                <tr key={r.name}>
                  <td className="px-4 py-2.5 text-smoke">{r.name}</td>
                  <td className={`px-4 py-2.5 text-right font-mono ${r.before.passed < r.before.of ? "text-flag" : "text-chalk"}`}>
                    {r.before.passed}/{r.before.of}
                  </td>
                  <td className={`px-4 py-2.5 text-right font-mono ${r.after.passed < r.after.of ? "text-flag" : "text-signal"}`}>
                    {r.after.passed}/{r.after.of}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <ul className="mt-5 space-y-3 text-[15px] leading-relaxed text-smoke">
          <li>
            <strong className="font-medium text-chalk">No import path.</strong> The contract gave the install command but
            not where files land, so nine of ten agents guessed shadcn&apos;s <code className="font-mono text-[13px]">ui/</code>{" "}
            folder.
          </li>
          <li>
            <strong className="font-medium text-chalk">Types named, never defined.</strong> Props said{" "}
            <code className="font-mono text-[13px]">hunks: DiffHunk[]</code> and stopped. Agents invented the fields:{" "}
            <code className="font-mono text-[13px]">lines</code> instead of{" "}
            <code className="font-mono text-[13px]">removed</code> and <code className="font-mono text-[13px]">added</code>,{" "}
            <code className="font-mono text-[13px]">error</code> instead of <code className="font-mono text-[13px]">detail</code>,
            takeover states that don&apos;t exist. The diff review crashed; the failed plan lost its error.
          </li>
          <li>
            <strong className="font-medium text-chalk">Hidden components.</strong> The contract listed one component per
            file, so no agent knew <code className="font-mono text-[13px]">SourceDrawer</code> existed, and the cited answer
            couldn&apos;t open its sources.
          </li>
        </ul>
        <p className="mt-4 text-[15px] leading-relaxed text-smoke">
          Every agent said so itself: each run ended with a note listing what it had to guess. The behavior the contract
          did describe (call onSend only from the gate, never print the confidence number, forget only after the undo
          window) every agent got right in both runs.
        </p>
      </section>

      <section className="mt-12">
        <h2 className="text-sm font-medium uppercase tracking-wide text-ash">What changed in the contract</h2>
        <p className="mt-2 max-w-prose text-[15px] leading-relaxed text-smoke">
          Three additions, all made in the generator so they hold for every component: the exact import line, every
          exported type with its fields or values, and every component in the file. The registry also pins each file&apos;s
          install target, so the import line is true. The contract grew from 14 KB to 22 KB.
        </p>
        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          <CodeBlock code={entry(before.run, "diff-review-card")} title={`${before.run}: diff-review-card`} />
          <CodeBlock code={entry(after.run, "diff-review-card")} title={`${after.run}: diff-review-card`} />
        </div>
      </section>

      <section className="mt-12">
        <h2 className="text-sm font-medium uppercase tracking-wide text-ash">Every prompt</h2>
        <ul className="mt-3 divide-y divide-line rounded-xl border border-line">
          {prompts.map((p) => {
            const a = before.prompts.find((x) => x.id === p.id)!;
            const b = after.prompts.find((x) => x.id === p.id)!;
            const failed = a.checks.filter((c) => !c.pass);
            const n = (r: typeof a) => `${r.checks.filter((c) => c.pass).length}/${r.checks.length}`;
            return (
              <li key={p.id} className="px-4 py-4">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <span className="font-mono text-[13px] text-chalk">{p.id}</span>
                  <span className="font-mono text-[13px]">
                    <a href={`${SRC}/runs/${before.run}/${p.id}.tsx`} className={a.pass ? "text-chalk" : "text-flag"}>
                      {before.run} {n(a)}
                    </a>
                    <span className="text-ash"> → </span>
                    <a href={`${SRC}/runs/${after.run}/${p.id}.tsx`} className={b.pass ? "text-signal" : "text-flag"}>
                      {after.run} {n(b)}
                    </a>
                  </span>
                </div>
                <p className="mt-1.5 text-[14px] leading-relaxed text-smoke">{p.prompt}</p>
                {failed.length > 0 && (
                  <p className="mt-1.5 text-[13px] text-ash">
                    {before.run} missed: {failed.map((c) => c.name).join("; ")}
                  </p>
                )}
              </li>
            );
          })}
        </ul>
      </section>

      <section className="mt-12 grid gap-8 md:grid-cols-2">
        <div>
          <h2 className="text-sm font-medium uppercase tracking-wide text-ash">Method</h2>
          <ul className="mt-3 space-y-2 text-[14px] leading-relaxed text-smoke">
            <li>The prompts were written before the first run and haven&apos;t changed. The checks changed once, noted below.</li>
            <li>
              Each agent got the same <a className="text-pit hover:underline" href={`${SRC}/agent-brief.md`}>brief</a> and
              read only the run&apos;s two contract files. Its code is saved as written.
            </li>
            <li>
              <a className="text-pit hover:underline" href={`${SRC}/checks.test.tsx`}>Checks</a>: compiles with strict tsc;
              uses the right component from the documented path; renders; passes axe; and the request&apos;s own behavior,
              driven through the real components.
            </li>
            <li>
              One check was fixed after the baseline: the approval check looked for the words &ldquo;Approve&rdquo; and
              &ldquo;Deny&rdquo;, but the contract allows relabelling them. The baseline was rescored with the fix before
              v2 ran.
            </li>
          </ul>
        </div>
        <div>
          <h2 className="text-sm font-medium uppercase tracking-wide text-ash">What it doesn&apos;t show</h2>
          <ul className="mt-3 space-y-2 text-[14px] leading-relaxed text-smoke">
            <li>One run per prompt and one model. Agents are not deterministic; run it again before quoting decimals.</li>
            <li>The maintainer wrote the prompts and the checks. They test what the contract promises, not taste or layout.</li>
            <li>100% on ten prompts means these gaps are closed, not that there are no others. The next eval should use prompts written by someone else.</li>
          </ul>
          <h2 className="mt-8 text-sm font-medium uppercase tracking-wide text-ash">Run it yourself</h2>
          <div className="mt-3">
            <CodeBlock code={`npm install\nnpm run eval -- v1\nnpm run eval -- v2`} title="shell" />
          </div>
        </div>
      </section>

      <p className="mt-12 text-[13px] text-ash">
        Scored {after.scoredAt}. <Link href="/evals" className="text-smoke hover:text-chalk">All evals</Link>
      </p>
    </main>
  );
}
