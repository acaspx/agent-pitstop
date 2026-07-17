/**
 * Generates shadcn-compatible registry JSON for every component in /registry.
 * Output: public/r/<name>.json — consumed by:
 *   npx shadcn@latest add https://agent-pitstop.vercel.app/r/<name>.json
 * Runs automatically before `next build` (see "prebuild" in package.json).
 */
import { readdir, readFile, mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const ROOT = process.cwd();
const REGISTRY_DIR = path.join(ROOT, "registry");
const OUT_DIR = path.join(ROOT, "public", "r");

const meta = {
  "tool-call-card": {
    title: "Tool Call Card",
    description: "Show an agent's tool use with legible, progressive disclosure.",
  },
  "approval-gate": {
    title: "Approval Gate",
    description: "Inline permission request with itemized scope. Nothing moves until the human says so.",
  },
  "agent-task-list": {
    title: "Agent Task List",
    description: "The agent's plan, made visible: pending, active, done, and failed.",
  },
  "interrupt-bar": {
    title: "Interrupt Bar",
    description: "The steering wheel and the brake for a running agent. Stop keeps partial work; steering redirects without restarting.",
  },
  "confidence-meter": {
    title: "Confidence Meter",
    description: "Honest uncertainty as coarse bands, paired with a verification affordance below the threshold.",
  },
};

await mkdir(OUT_DIR, { recursive: true });

const entries = await readdir(REGISTRY_DIR, { withFileTypes: true });
let count = 0;

for (const entry of entries) {
  if (!entry.isDirectory()) continue;
  const name = entry.name;
  const dir = path.join(REGISTRY_DIR, name);
  const files = (await readdir(dir)).filter((f) => f.endsWith(".tsx") || f.endsWith(".ts"));

  const item = {
    $schema: "https://ui.shadcn.com/schema/registry-item.json",
    name,
    type: "registry:component",
    title: meta[name]?.title ?? name,
    description: meta[name]?.description ?? "",
    author: "Anton Castro <https://github.com/acaspx>",
    dependencies: ["motion"],
    files: await Promise.all(
      files.map(async (f) => ({
        path: `registry/${name}/${f}`,
        type: "registry:component",
        content: await readFile(path.join(dir, f), "utf8"),
      })),
    ),
  };

  await writeFile(path.join(OUT_DIR, `${name}.json`), JSON.stringify(item, null, 2));
  count++;
}

console.log(`registry: wrote ${count} item(s) to public/r/`);
