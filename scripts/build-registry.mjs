/**
 * Generates the machine contract for every component in /registry.
 *
 * The rule (per the "agent-ready" bar): nothing an agent consumes is
 * hand-typed. Descriptions, props, and principle tags are parsed from
 * the component source at build time, so the contract cannot drift
 * from the truth. Outputs:
 *
 *   public/r/<name>.json   shadcn registry item (full source embedded)
 *                          + generated `meta` (description, props, principles)
 *   public/r/index.json    catalog, one fetch discovers everything
 *   public/r/contract.json dense mode: prose-free, sized for a context window
 *   public/llms.txt        human-shaped overview, generated from the same parse
 *
 * Runs automatically before `next build` (see "prebuild" in package.json).
 */
import { readdir, readFile, mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const ROOT = process.cwd();
const REGISTRY_DIR = path.join(ROOT, "registry");
const OUT_DIR = path.join(ROOT, "public", "r");
const SITE = "https://agent-pitstop.vercel.app";

/** Parse the component's header comment: title, description, principles applied. */
function parseHeader(src) {
  const block = src.match(/\/\*\*([\s\S]*?)\*\//);
  if (!block) return { title: null, description: "", principles: [] };
  const lines = block[1]
    .split("\n")
    .map((l) => l.replace(/^\s*\*\s?/, "").trim());

  const titleLine = lines.find((l) => l.includes("— Agent Pit Stop"));
  const title = titleLine ? titleLine.split("—")[0].trim() : null;

  const descLines = [];
  let started = false;
  for (const l of lines) {
    if (l.includes("— Agent Pit Stop")) {
      started = true;
      continue;
    }
    if (!started) continue;
    if (l.startsWith("Principles applied") || l.startsWith("Contributor notes")) break;
    if (l) descLines.push(l);
  }
  const description = descLines.join(" ").trim();

  const principles = [];
  const pStart = lines.findIndex((l) => l.startsWith("Principles applied"));
  if (pStart !== -1) {
    for (let i = pStart + 1; i < lines.length; i++) {
      const m = lines[i].match(/^-\s*([A-Za-z ]+?):/);
      if (m) principles.push(m[1].trim());
      else if (lines[i].startsWith("-") === false && lines[i] !== "") break;
    }
  }
  return { title, description, principles };
}

/** Parse `export interface <Component>Props { ... }` into structured props. */
function parseProps(src, componentName) {
  const iface = src.match(
    new RegExp(`export interface ${componentName}Props \\{([\\s\\S]*?)\\n\\}`),
  );
  if (!iface) return [];
  const body = iface[1];
  const props = [];
  const re = /(?:\/\*\*\s*([\s\S]*?)\s*\*\/\s*)?(\w+)(\?)?:\s*([^;]+);/g;
  let m;
  while ((m = re.exec(body)) !== null) {
    props.push({
      name: m[2],
      type: m[4].trim().replace(/\s+/g, " "),
      required: m[3] !== "?",
      description: (m[1] ?? "").replace(/\s+/g, " ").trim(),
    });
  }
  return props;
}

function pascal(name) {
  return name
    .split("-")
    .map((p) => p[0].toUpperCase() + p.slice(1))
    .join("");
}

await mkdir(OUT_DIR, { recursive: true });

const entries = await readdir(REGISTRY_DIR, { withFileTypes: true });
let count = 0;
const index = [];
const dense = [];

for (const entry of entries) {
  if (!entry.isDirectory() || entry.name.startsWith("_")) continue;
  const name = entry.name;
  const dir = path.join(REGISTRY_DIR, name);
  const files = (await readdir(dir)).filter((f) => f.endsWith(".tsx") || f.endsWith(".ts"));
  const mainSrc = await readFile(path.join(dir, `${name}.tsx`), "utf8");

  const header = parseHeader(mainSrc);
  const componentName = pascal(name);
  const props = parseProps(mainSrc, componentName);
  const title = header.title ?? componentName;
  // first sentence of the parsed description = the one-liner
  const oneLiner = (header.description.match(/^.*?[.!?](\s|$)/)?.[0] ?? header.description).trim();

  const item = {
    $schema: "https://ui.shadcn.com/schema/registry-item.json",
    name,
    type: "registry:component",
    title,
    description: oneLiner,
    author: "Anton Castro <https://github.com/acaspx>",
    dependencies: ["motion"],
    meta: {
      component: componentName,
      longDescription: header.description,
      principles: header.principles,
      props,
      docs: `${SITE}/components/${name}`,
    },
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
    title,
    description: oneLiner,
    principles: header.principles,
    url: `${SITE}/r/${name}.json`,
    docs: `${SITE}/components/${name}`,
  });
  dense.push({
    n: name,
    c: componentName,
    d: oneLiner,
    pr: header.principles,
    p: props.map((p) => `${p.name}${p.required ? "" : "?"}:${p.type}${p.description ? ` // ${p.description}` : ""}`),
  });
  count++;
}

// full catalog: one fetch discovers every component
await writeFile(path.join(OUT_DIR, "index.json"), JSON.stringify({ items: index }, null, 2));

// dense mode: prose-free, sized for an agent's context window
await writeFile(
  path.join(OUT_DIR, "contract.json"),
  JSON.stringify(
    {
      system: "agent-pitstop",
      install: `npx shadcn@latest add ${SITE}/r/<n>.json`,
      deps: ["react", "tailwind", "motion"],
      guarantees: [
        "state is never communicated by color alone",
        "failures keep their inputs visible",
        "stopping preserves partial work",
        "nothing irreversible without explicit consent",
        "confidence renders as bands, never decimals",
      ],
      components: dense,
    },
    null,
    1,
  ),
);

// llms.txt: human-shaped overview, generated from the same parse
const llms = `# Agent Pit Stop

> An open source design system for agent interfaces: UX principles with live
> demos and production React components for the moments where agents and
> humans sync (approval, inspection, handoff, recovery). MIT licensed.
> Components depend only on React, Tailwind, and Motion, and install via the
> shadcn registry. Site: ${SITE}

## Install

Any component: npx shadcn@latest add ${SITE}/r/<name>.json
Catalog (JSON): ${SITE}/r/index.json
Dense contract for agents (props, principles, guarantees): ${SITE}/r/contract.json
This file, the catalog, and the contract are generated from component source at build time; they cannot drift.

## Components

${index.map((i) => `- [${i.title}](${i.docs}): ${i.description} (source: ${i.url})`).join("\n")}

## Principles

- [Legible Thinking](${SITE}/principles/legible-thinking): agents lose trust by being wrong invisibly; show intent, state, and evidence
- [Interruptibility](${SITE}/principles/interruptibility): users delegate more to agents they can stop; steer beats stop
- [Delegation Contracts](${SITE}/principles/delegation-contracts): itemize scope before consent; boundaries beat permissions
- [Calibrated Trust](${SITE}/principles/calibrated-trust): bands not decimals; verification cheaper than redoing
- [Graceful Failure](${SITE}/principles/graceful-failure): failure is a rendered state; partial work is never discarded

## Docs

- [How it works](${SITE}/how-it-works)
- [Rules for the pit](${SITE}/principles)
- [Contributing](https://github.com/acaspx/agent-pitstop/blob/main/CONTRIBUTING.md)
`;
await writeFile(path.join(ROOT, "public", "llms.txt"), llms);

console.log(
  `registry: wrote ${count} item(s) + index.json + contract.json + llms.txt (all generated from source)`,
);
