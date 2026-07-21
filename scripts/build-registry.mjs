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
  "agent-roster": {
    title: "Agent Roster",
    description: "The team sheet for multi-agent runs: role, state, and live activity per agent, blockers named.",
  },
  "agent-inbox": {
    title: "Agent Inbox",
    description: "The review queue for background agents. Needs-review items carry the reason, not just a red dot.",
  },
  "context-budget": {
    title: "Context Budget",
    description: "A delegation contract's limits made visible: consumption vs caps in honest bands, cap-hit as a rendered state.",
  },
};

await mkdir(OUT_DIR, { recursive: true });

const entries = await readdir(REGISTRY_DIR, { withFileTypes: true });
let count = 0;
const index = [];

for (const entry of entries) {
  if (!entry.isDirectory() || entry.name.startsWith("_")) continue;
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
  index.push({
    name,
    title: item.title,
    description: item.description,
    url: `https://agent-pitstop.vercel.app/r/${name}.json`,
    docs: `https://agent-pitstop.vercel.app/components/${name}`,
  });
  count++;
}

// machine-readable catalog: one fetch discovers every component
await writeFile(path.join(OUT_DIR, "index.json"), JSON.stringify({ items: index }, null, 2));

// llms.txt: the whole system, consumable by an AI assistant in one request
const llms = `# Agent Pit Stop

> An open source design system for agent interfaces: UX principles with live
> demos and production React components for the moments where agents and
> humans sync (approval, inspection, handoff, recovery). MIT licensed.
> Components depend only on React, Tailwind, and Motion, and install via the
> shadcn registry. Site: https://agent-pitstop.vercel.app

## Install

Any component: npx shadcn@latest add https://agent-pitstop.vercel.app/r/<name>.json
Catalog (JSON): https://agent-pitstop.vercel.app/r/index.json

## Components

${index.map((i) => `- [${i.title}](${i.docs}): ${i.description} (source: ${i.url})`).join("\n")}

## Principles

- [Legible Thinking](https://agent-pitstop.vercel.app/principles/legible-thinking): agents lose trust by being wrong invisibly; show intent, state, and evidence
- [Interruptibility](https://agent-pitstop.vercel.app/principles/interruptibility): users delegate more to agents they can stop; steer beats stop
- [Delegation Contracts](https://agent-pitstop.vercel.app/principles/delegation-contracts): itemize scope before consent; boundaries beat permissions
- [Calibrated Trust](https://agent-pitstop.vercel.app/principles/calibrated-trust): bands not decimals; verification cheaper than redoing
- [Graceful Failure](https://agent-pitstop.vercel.app/principles/graceful-failure): failure is a rendered state; partial work is never discarded

## Docs

- [How it works](https://agent-pitstop.vercel.app/how-it-works)
- [Rules for the pit](https://agent-pitstop.vercel.app/principles)
- [Contributing](https://github.com/acaspx/agent-pitstop/blob/main/CONTRIBUTING.md)
`;
await writeFile(path.join(ROOT, "public", "llms.txt"), llms);

console.log(`registry: wrote ${count} item(s) + index.json + llms.txt to public/`);
