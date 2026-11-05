"use client";

/**
 * The live showcase: every registry component, interactive, in a masonry
 * of tiles. Each tile is the real component (not a picture of it), with
 * its name linking to the docs and a Reset that remounts it.
 *
 * "Make them yours" re-themes every tile at once by overriding the same
 * tokens the components read, which is the system's promise made visible:
 * the components never change, only the tokens underneath them.
 */

import { useState, type CSSProperties } from "react";
import Link from "next/link";
import { components } from "@/lib/nav";
import { tiles } from "./tiles";

const ACCENTS = [
  { name: "Pit", dark: "#fb923c", light: "#b45309" },
  { name: "Lime", dark: "#a3e635", light: "#4d7c0f" },
  { name: "Sky", dark: "#38bdf8", light: "#0369a1" },
  { name: "Rose", dark: "#fb7185", light: "#be123c" },
];

/**
 * Radius and density reach every component through the theme variables Tailwind's
 * utilities read (rounded-xl is var(--radius-xl), p-4 is calc(var(--spacing) * 4)), so
 * nothing in the components changes. The tile frames use 2xl and 3xl, which stay put.
 */
const RADII = {
  sharp: { label: "Sharp", vars: { "--radius-sm": "2px", "--radius-md": "3px", "--radius-lg": "4px", "--radius-xl": "6px" } },
  default: { label: "Default", vars: {} },
  round: { label: "Round", vars: { "--radius-sm": "6px", "--radius-md": "8px", "--radius-lg": "12px", "--radius-xl": "18px" } },
} as const;
const DENSITIES = {
  compact: { label: "Compact", spacing: "0.22rem" },
  default: { label: "Default", spacing: "" },
  comfortable: { label: "Comfortable", spacing: "0.29rem" },
} as const;
type Radius = keyof typeof RADII;
type Density = keyof typeof DENSITIES;

/** A small segmented control for the customizer bar. */
function Choice<T extends string>({ label, value, options, onChange }: { label: string; value: T; options: [T, string][]; onChange: (v: T) => void }) {
  return (
    <div role="group" aria-label={label} className="flex items-center gap-2">
      <span className="text-[12px] text-ash">{label}</span>
      <div className="inline-flex overflow-hidden rounded-lg border border-line">
        {options.map(([id, text]) => (
          <button
            key={id}
            type="button"
            aria-pressed={value === id}
            onClick={() => onChange(id)}
            className={`min-h-8 px-2.5 text-[12px] transition-colors pointer-coarse:min-h-11 ${value === id ? "bg-asphalt text-chalk" : "text-ash hover:text-smoke"}`}
          >
            {text}
          </button>
        ))}
      </div>
    </div>
  );
}

function Tile({ slug, hint, render }: (typeof tiles)[number]) {
  const [key, setKey] = useState(0);
  const entry = components.find((c) => c.slug === slug);
  if (!entry) return null;
  return (
    <figure className="group mb-4 break-inside-avoid rounded-3xl border border-line bg-carbon p-3 transition-colors duration-300 hover:border-ash">
      <div className="rounded-2xl bg-track p-3" key={key}>
        {render()}
      </div>
      <figcaption className="flex items-center gap-2 px-2 pb-1 pt-3">
        <Link href={`/components/${slug}`} className="shrink-0 whitespace-nowrap text-[14px] font-medium text-chalk transition-colors hover:text-pit">
          {entry.title}
        </Link>
        <span className="hidden min-w-0 truncate text-[12px] text-ash sm:inline">{hint}</span>
        <button
          type="button"
          onClick={() => setKey((k) => k + 1)}
          aria-label={`Reset ${entry.title}`}
          className="ml-auto min-h-8 rounded-md px-2 text-[12px] text-ash opacity-100 transition-[opacity,color] hover:text-chalk md:opacity-0 md:group-hover:opacity-100 md:focus-visible:opacity-100 pointer-coarse:min-h-11"
        >
          Reset
        </button>
      </figcaption>
    </figure>
  );
}

export function Showcase({ limit, className }: { limit?: number; className?: string }) {
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [accent, setAccent] = useState(0);
  const [radius, setRadius] = useState<Radius>("default");
  const [density, setDensity] = useState<Density>("default");
  const [copied, setCopied] = useState(false);
  const a = ACCENTS[accent];
  const accentHex = theme === "light" ? a.light : a.dark;
  const vars: Record<string, string> = {
    "--color-pit": accentHex,
    ...RADII[radius].vars,
    ...(DENSITIES[density].spacing ? { "--spacing": DENSITIES[density].spacing } : {}),
  };
  const style = vars as CSSProperties;
  // The same overrides, as CSS to paste into your own globals.
  const css = `:root {\n${Object.entries(vars).map(([k, v]) => `  ${k}: ${v};`).join("\n")}\n}`;
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(css);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      // clipboard unavailable: nothing to do
    }
  };
  const shown = typeof limit === "number" ? tiles.slice(0, limit) : tiles;

  return (
    <div className={className}>
      <div className="mb-5 flex flex-wrap items-center gap-x-5 gap-y-3 rounded-2xl border border-line bg-carbon px-4 py-3">
        <span className="text-[13px] font-medium text-chalk">Make them yours</span>
        <div role="group" aria-label="Theme" className="inline-flex overflow-hidden rounded-lg border border-line">
          {(["dark", "light"] as const).map((t) => (
            <button
              key={t}
              type="button"
              aria-pressed={theme === t}
              onClick={() => setTheme(t)}
              className={`min-h-8 px-3 text-[12px] capitalize transition-colors pointer-coarse:min-h-11 ${
                theme === t ? "bg-asphalt text-chalk" : "text-ash hover:text-smoke"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
        <div role="group" aria-label="Accent" className="flex items-center gap-2">
          {ACCENTS.map((x, i) => (
            <button
              key={x.name}
              type="button"
              aria-pressed={accent === i}
              aria-label={`${x.name} accent`}
              title={x.name}
              onClick={() => setAccent(i)}
              className={`h-6 w-6 rounded-full ring-offset-2 ring-offset-carbon transition-shadow pointer-coarse:h-9 pointer-coarse:w-9 ${
                accent === i ? "ring-2 ring-chalk" : "ring-1 ring-line hover:ring-ash"
              }`}
              style={{ background: theme === "light" ? x.light : x.dark }}
            />
          ))}
          <span className="text-[12px] text-ash">{a.name}</span>
        </div>
        <Choice label="Radius" value={radius} onChange={setRadius} options={Object.entries(RADII).map(([k, v]) => [k as Radius, v.label])} />
        <Choice label="Density" value={density} onChange={setDensity} options={Object.entries(DENSITIES).map(([k, v]) => [k as Density, v.label])} />
        <div className="flex basis-full items-center gap-3">
          <span className="text-[12px] text-ash">Every tile is live. Click around.</span>
          <button
            type="button"
            onClick={copy}
            className="ml-auto min-h-8 rounded-lg border border-line px-2.5 text-[12px] text-smoke transition-colors hover:text-chalk pointer-coarse:min-h-11"
          >
            <span aria-live="polite">{copied ? "Copied" : "Copy CSS"}</span>
          </button>
        </div>
      </div>

      <div
        data-theme={theme === "light" ? "light" : undefined}
        style={style}
        className={`columns-1 gap-4 rounded-3xl md:columns-2 ${density === "compact" ? "density-compact" : ""}`}
      >
        {shown.map((t) => (
          <Tile key={t.slug} {...t} />
        ))}
      </div>
    </div>
  );
}
