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

/**
 * Parse the header's "Accessibility:" block: what the component guarantees on its own
 * (keyboard, screen reader, motion) and what the host has to do for it to hold. Agents
 * read the host line most: it is the part they get wrong. Every component must have all
 * four; the build fails otherwise, so the contract can never go silent on accessibility.
 */
const A11Y_KEYS = { Keyboard: "keyboard", "Screen reader": "screenReader", Motion: "motion", Host: "host" };
function parseA11y(src, name) {
  const block = src.match(/\/\*\*([\s\S]*?)\*\//);
  const lines = (block?.[1] ?? "").split("\n").map((l) => l.replace(/^\s*\*\s?/, "").trim());
  const start = lines.findIndex((l) => l.startsWith("Accessibility"));
  const out = {};
  if (start !== -1) {
    let key = null;
    for (const l of lines.slice(start + 1)) {
      const m = l.match(/^-\s*(Keyboard|Screen reader|Motion|Host):\s*(.*)$/);
      if (m) {
        key = A11Y_KEYS[m[1]];
        out[key] = m[2];
      } else if (key && l && !l.startsWith("-")) {
        out[key] += ` ${l}`; // a wrapped line continues the bullet above
      } else if (!l) {
        key = null;
      }
    }
  }
  const missing = Object.values(A11Y_KEYS).filter((k) => !out[k]);
  if (missing.length) throw new Error(`registry/${name}: header is missing Accessibility lines for ${missing.join(", ")}`);
  return out;
}

/** Parse `export interface <Name> { ... }` into structured fields (props, or a data type's fields). */
function parseFields(src, ifaceName) {
  const iface = src.match(new RegExp(`export interface ${ifaceName} \\{([\\s\\S]*?)\\n\\}`));
  if (!iface) return [];
  const body = iface[1];
  const fields = [];
  const re = /(?:\/\*\*\s*([\s\S]*?)\s*\*\/\s*)?(\w+)(\?)?:\s*([^;]+);/g;
  let m;
  while ((m = re.exec(body)) !== null) {
    fields.push({
      name: m[2],
      type: m[4].trim().replace(/\s+/g, " "),
      required: m[3] !== "?",
      description: (m[1] ?? "").replace(/^\s*\*\s?/gm, "").replace(/\s+/g, " ").trim(),
    });
  }
  return fields;
}
const parseProps = (src, componentName) => parseFields(src, `${componentName}Props`);
const denseField = (f) => `${f.name}${f.required ? "" : "?"}:${f.type}${f.description ? ` // ${f.description}` : ""}`;

/**
 * Everything a file exports that an agent needs to write correct code against it: the
 * components (any exported PascalCase function with a <Name>Props interface), and every
 * other exported type, unions spelled out and interfaces as fields. The v1 contract named
 * types like ScopeItem without defining them, and agents guessed their fields wrong.
 */
function parseExports(src) {
  const components = [...src.matchAll(/export function ([A-Z]\w*)\(/g)]
    .map((m) => m[1])
    .filter((c) => new RegExp(`export interface ${c}Props \\{`).test(src));
  const types = {};
  for (const m of src.matchAll(/export type (\w+) = ([^;]+);/g)) types[m[1]] = m[2].replace(/\s+/g, " ").trim();
  for (const m of src.matchAll(/export interface (\w+) \{/g)) {
    if (m[1].endsWith("Props")) continue;
    types[m[1]] = parseFields(src, m[1]);
  }
  return { components, types };
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
  const a11y = parseA11y(mainSrc, name);
  const componentName = pascal(name);
  const props = parseProps(mainSrc, componentName);
  const exported = parseExports(mainSrc);
  const extra = exported.components.filter((c) => c !== componentName);
  // Where the installer puts it (each file's `target` below) and the line to import it with.
  const importLine = `import { ${[...exported.components, ...Object.keys(exported.types).map((t) => `type ${t}`)].join(", ")} } from "@/components/${name}";`;
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
      import: importLine,
      types: exported.types,
      ...(extra.length ? { alsoExports: extra.map((c) => ({ component: c, props: parseProps(mainSrc, c) })) } : {}),
      accessibility: a11y,
      docs: `${SITE}/components/${name}`,
    },
    files: await Promise.all(
      files.map(async (f) => ({
        path: `registry/${name}/${f}`,
        type: "registry:component",
        // Pinned, so the install location is what the contract says, not a CLI default.
        target: `components/${f}`,
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
    accessibility: a11y,
    url: `${SITE}/r/${name}.json`,
    docs: `${SITE}/components/${name}`,
  });
  dense.push({
    n: name,
    c: componentName,
    d: oneLiner,
    pr: header.principles,
    i: importLine,
    p: props.map(denseField),
    // t: every exported type the props use: unions as strings, interfaces as fields
    t: Object.fromEntries(Object.entries(exported.types).map(([k, v]) => [k, typeof v === "string" ? v : v.map(denseField)])),
    ...(extra.length ? { x: extra.map((c) => ({ c, p: parseProps(mainSrc, c).map(denseField) })) } : {}),
    // a11y: k keyboard, sr screen reader, m motion, h what the host must do
    a: { k: a11y.keyboard, sr: a11y.screenReader, m: a11y.motion, h: a11y.host },
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
      importFrom: "@/components/<n>",
      legend: "n name, c component, i import line, d description, pr principles, p props, t exported types (unions as strings, interfaces as fields), x other components in the file, a accessibility (k keyboard, sr screen reader, m motion, h what the host must do)",
      deps: ["react", "tailwind", "motion"],
      guarantees: [
        "state is never communicated by color alone",
        "failures keep their inputs visible",
        "stopping preserves partial work",
        "nothing irreversible without explicit consent",
        "confidence renders as bands, never decimals",
        "focus is never dropped: when a control goes away after use, focus moves to what replaced it",
        "continuous motion stops under prefers-reduced-motion",
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
It installs to components/<name>.tsx. Import it from "@/components/<name>"; the contract gives each component's exact import line and every type it uses.
Catalog (JSON): ${SITE}/r/index.json
Dense contract for agents (props, principles, guarantees, accessibility): ${SITE}/r/contract.json
This file, the catalog, and the contract are generated from component source at build time; they cannot drift.

## Components

${index.map((i) => `- [${i.title}](${i.docs}): ${i.description} (source: ${i.url})\n  Host must: ${i.accessibility.host}`).join("\n")}

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
