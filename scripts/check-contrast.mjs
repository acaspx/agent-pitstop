/**
 * Color contrast, computed from the tokens themselves (app/globals.css), for both themes.
 *
 * Every text token is checked on every surface it is allowed to sit on, and must clear
 * WCAG AA for normal text, 4.5:1. The page surfaces (track, carbon, asphalt) take any
 * text token. barrier is the raised fill (chips, the selected tab, chat bubbles) and by
 * rule carries only chalk and smoke: ash and the status colors are too faint on it in
 * one theme or the other. Those pairs are listed as "not allowed", not checked.
 * Hairlines (line) are not text.
 *
 *   node scripts/check-contrast.mjs          check; exit 1 if any pair fails
 *   node scripts/check-contrast.mjs --write  also write the table into docs/accessibility.md
 *
 * Runs in CI, so a token change that breaks contrast fails the build.
 */
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const ROOT = process.cwd();
const css = await readFile(path.join(ROOT, "app", "globals.css"), "utf8");

function tokens(block) {
  const out = {};
  for (const m of block.matchAll(/--color-([a-z]+):\s*(#[0-9a-f]{6})/gi)) out[m[1]] = m[2];
  return out;
}
const dark = tokens(css.match(/@theme\s*\{([\s\S]*?)\}/)[1]);
const light = { ...dark, ...tokens(css.match(/\[data-theme="light"\]\s*\{([\s\S]*?)\}/)[1]) };

const lum = (hex) => {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255).map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const ratio = (a, b) => {
  const [hi, lo] = [lum(a), lum(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};

const SURFACES = ["track", "carbon", "asphalt", "barrier"];
const TEXT = ["chalk", "smoke", "ash", "signal", "caution", "flag", "pit"];
const AA = 4.5;
/** Text tokens allowed on each surface (see the header). */
const ALLOWED = { barrier: ["chalk", "smoke"] };
const allowed = (fg, bg) => !ALLOWED[bg] || ALLOWED[bg].includes(fg);

let failures = 0;
const rows = [];
for (const [theme, t] of [["Dark", dark], ["Light", light]]) {
  for (const fg of TEXT) {
    const cells = SURFACES.map((bg) => {
      const r = ratio(t[fg], t[bg]);
      if (!allowed(fg, bg)) return `(${r.toFixed(1)}) not allowed`;
      if (r < AA) failures++;
      return `${r.toFixed(1)}${r < AA ? " ✗" : ""}`;
    });
    rows.push(`| ${theme} | ${fg} \`${t[fg]}\` | ${cells.join(" | ")} |`);
  }
}
const table = [
  `| Theme | Text token | ${SURFACES.join(" | ")} |`,
  `| --- | --- | ${SURFACES.map(() => "---:").join(" | ")} |`,
  ...rows,
].join("\n");

console.log(table);
if (process.argv.includes("--write")) {
  const file = path.join(ROOT, "docs", "accessibility.md");
  const doc = await readFile(file, "utf8");
  const next = doc.replace(/<!-- contrast:start -->[\s\S]*<!-- contrast:end -->/, `<!-- contrast:start -->\n${table}\n<!-- contrast:end -->`);
  await writeFile(file, next);
}
if (failures) {
  console.error(`\n${failures} text/surface pair(s) below WCAG AA ${AA}:1`);
  process.exit(1);
}
console.log(`\nEvery allowed text/surface pair clears WCAG AA ${AA}:1.`);
