/**
 * Score a run of the contract-use eval.
 *
 *   npm run eval -- v1
 *
 * Reads the screens agents wrote (evals/contract-use/runs/<run>/*.tsx) and writes
 * evals/contract-use/results/<run>.json, which the /evals page shows. Two passes:
 *
 *   1. Types: every screen is compiled with tsc, strict, against the real component
 *      types. Wrong prop names or shapes fail here even when the screen happens to render.
 *   2. Behavior: checks.test.tsx renders each screen against the real components and
 *      drives it (axe, plus what the request asked for).
 */
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";

const ROOT = process.cwd();
// Run the project's own tsc and vitest (not whatever npx would fetch).
const require = createRequire(path.join(ROOT, "package.json"));
const bin = (pkg, file) => path.join(path.dirname(require.resolve(`${pkg}/package.json`)), file);
const EVAL = path.join(ROOT, "evals", "contract-use");
const run = process.argv[2];
if (!run) {
  console.error("usage: npm run eval -- <run>   (a folder in evals/contract-use/runs)");
  process.exit(2);
}
const runDir = path.join(EVAL, "runs", run);
if (!existsSync(runDir)) {
  console.error(`no run at ${path.relative(ROOT, runDir)}`);
  process.exit(2);
}
const { prompts } = JSON.parse(readFileSync(path.join(EVAL, "prompts.json"), "utf8"));
const meta = existsSync(path.join(runDir, "meta.json")) ? JSON.parse(readFileSync(path.join(runDir, "meta.json"), "utf8")) : {};
const slugs = readdirSync(path.join(ROOT, "registry")).filter((d) => !d.startsWith("_"));

// ------------------------------------------------------------------ 1. types
// Copy each screen with its component imports pointed at the real source (whatever path
// the agent guessed: the import-path check scores that), then compile them all at once.
const tmp = path.join(EVAL, ".tmp", run);
rmSync(tmp, { recursive: true, force: true });
mkdirSync(path.join(tmp, "shim"), { recursive: true });
for (const slug of slugs) {
  writeFileSync(path.join(tmp, "shim", `${slug}.ts`), `export * from ${JSON.stringify(path.join(ROOT, "registry", slug, slug))};\n`);
}
const pitstop = new RegExp(`(from\\s+["'])(?:@/|~/|\\./|\\.\\./)?(?:[\\w.-]+/)*(${slugs.join("|")})(?:\\.tsx)?(["'])`, "g");
for (const p of prompts) {
  const f = path.join(runDir, `${p.id}.tsx`);
  if (existsSync(f)) writeFileSync(path.join(tmp, `${p.id}.tsx`), readFileSync(f, "utf8").replace(pitstop, "$1@pitstop/$2$3"));
}
writeFileSync(
  path.join(tmp, "tsconfig.json"),
  JSON.stringify({
    compilerOptions: {
      strict: true, noEmit: true, skipLibCheck: true, jsx: "react-jsx", target: "es2022",
      module: "esnext", moduleResolution: "bundler", esModuleInterop: true, isolatedModules: true,
      baseUrl: ".", paths: { "@pitstop/*": ["shim/*"] }, types: ["react", "react-dom"],
    },
    include: ["*.tsx"],
  }),
);
let tscOut = "";
try {
  execFileSync(process.execPath, [bin("typescript", "bin/tsc"), "-p", path.join(tmp, "tsconfig.json"), "--pretty", "false"], { cwd: ROOT, encoding: "utf8" });
} catch (e) {
  tscOut = `${e.stdout ?? ""}${e.stderr ?? ""}`;
}
const typeErrors = {};
for (const line of tscOut.split("\n")) {
  const m = line.match(/([\w-]+)\.tsx\(\d+,\d+\): error (TS\d+: .*)$/);
  if (m && prompts.some((p) => p.id === m[1])) (typeErrors[m[1]] ??= []).push(m[2]);
}

// ------------------------------------------------------------------ 2. behavior
const report = path.join(tmp, "vitest.json");
let vitestErr = "";
try {
  execFileSync(process.execPath, [bin("vitest", "vitest.mjs"), "run", "--config", "evals/vitest.config.mts", "--reporter=json", `--outputFile=${report}`], {
    cwd: ROOT, encoding: "utf8", env: { ...process.env, EVAL_RUN: run }, stdio: ["ignore", "ignore", "pipe"],
  });
} catch (e) {
  // failing checks exit non-zero; the report still has every result
  vitestErr = String(e.stderr ?? "");
}
if (!existsSync(report)) {
  console.error(`vitest wrote no report:\n${vitestErr.slice(0, 2000)}`);
  process.exit(1);
}
const vitest = JSON.parse(readFileSync(report, "utf8"));
const byPrompt = {};
for (const file of vitest.testResults) {
  for (const a of file.assertionResults) {
    const id = a.ancestorTitles[0];
    (byPrompt[id] ??= []).push({
      name: a.title,
      pass: a.status === "passed",
      ...(a.status === "passed" ? {} : { why: (a.failureMessages?.[0] ?? "").split("\n")[0].slice(0, 240) }),
    });
  }
}

// ------------------------------------------------------------------ results
const results = prompts.map((p) => {
  const exists = existsSync(path.join(runDir, `${p.id}.tsx`));
  const types = { name: "compiles against the real types", pass: exists && !typeErrors[p.id], ...(typeErrors[p.id] ? { why: typeErrors[p.id].slice(0, 3).join(" | ").slice(0, 240) } : exists ? {} : { why: "no output" }) };
  const checks = [types, ...(byPrompt[p.id] ?? [])];
  return { id: p.id, components: p.components, pass: checks.every((c) => c.pass), checks };
});
const checks = results.flatMap((r) => r.checks);
const out = {
  eval: "contract-use",
  run,
  scoredAt: new Date().toISOString().slice(0, 10),
  agent: meta.agent ?? null,
  contract: meta.contract ?? run,
  notes: meta.notes ?? null,
  totals: {
    prompts: results.length,
    promptsPassed: results.filter((r) => r.pass).length,
    checks: checks.length,
    checksPassed: checks.filter((c) => c.pass).length,
  },
  prompts: results,
};
mkdirSync(path.join(EVAL, "results"), { recursive: true });
writeFileSync(path.join(EVAL, "results", `${run}.json`), JSON.stringify(out, null, 2) + "\n");

for (const r of results) {
  const n = r.checks.filter((c) => c.pass).length;
  console.log(`${r.pass ? "PASS" : "fail"}  ${r.id.padEnd(24)} ${n}/${r.checks.length}`);
  for (const c of r.checks) if (!c.pass) console.log(`        ✗ ${c.name}${c.why ? `: ${c.why}` : ""}`);
}
const t = out.totals;
console.log(`\n${run}: ${t.promptsPassed}/${t.prompts} prompts fully correct, ${t.checksPassed}/${t.checks} checks (${Math.round((100 * t.checksPassed) / t.checks)}%)`);
