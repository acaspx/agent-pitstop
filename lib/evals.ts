/**
 * Evals, read at build time from evals/: the prompts, and the scored results of every
 * run (written by `npm run eval -- <run>`). Server-only: the pages that use it render
 * statically, so the site always shows the committed results, never a live rerun.
 */
import { existsSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";

export interface EvalCheck { name: string; pass: boolean; why?: string }
export interface EvalPromptResult { id: string; components: string[]; pass: boolean; checks: EvalCheck[] }
export interface EvalRun {
  run: string;
  scoredAt: string;
  agent: string | null;
  contract: string;
  notes: string | null;
  totals: { prompts: number; promptsPassed: number; checks: number; checksPassed: number };
  prompts: EvalPromptResult[];
}
export interface EvalPrompt { id: string; components: string[]; signature: string; prompt: string }

export interface EvalEntry {
  slug: string;
  title: string;
  question: string;
  summary: string;
  /** The runs to compare on the overview, oldest first. */
  compare: [string, string];
}

export const evals: EvalEntry[] = [
  {
    slug: "contract-use",
    title: "Contract use",
    question: "Can an agent build correct screens from the contract alone?",
    summary:
      "Ten product requests, each handed to a fresh agent that sees only llms.txt and contract.json. Its code is compiled against the real types and driven against the real components.",
    compare: ["v1", "v2"],
  },
];

const dir = (slug: string) => path.join(process.cwd(), "evals", slug);

export function loadEval(slug: string) {
  const base = dir(slug);
  const { prompts } = JSON.parse(readFileSync(path.join(base, "prompts.json"), "utf8")) as { prompts: EvalPrompt[] };
  const resultsDir = path.join(base, "results");
  const runs: Record<string, EvalRun> = {};
  if (existsSync(resultsDir)) {
    for (const f of readdirSync(resultsDir).filter((x) => x.endsWith(".json"))) {
      const r = JSON.parse(readFileSync(path.join(resultsDir, f), "utf8")) as EvalRun;
      runs[r.run] = r;
    }
  }
  return { prompts, runs };
}

export const pct = (t: EvalRun["totals"]) => Math.round((100 * t.checksPassed) / t.checks);

/** For each check name, how many prompts passed it in a run (checks shared by every prompt). */
export function passByCheck(run: EvalRun, names: string[]) {
  return names.map((name) => {
    const rows = run.prompts.map((p) => p.checks.find((c) => c.name === name)).filter(Boolean) as EvalCheck[];
    return { name, passed: rows.filter((c) => c.pass).length, of: rows.length };
  });
}

export const SHARED_CHECKS = [
  "compiles against the real types",
  "imports it from the documented install path",
  "uses the component the request calls for",
  "renders",
  "passes axe",
];
