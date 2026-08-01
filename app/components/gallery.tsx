"use client";

import { useState } from "react";
import Link from "next/link";
import { componentCategories, componentsIn, type ComponentEntry } from "@/lib/nav";
import { ThemeToggle, type PreviewTheme } from "@/components/docs/theme-toggle";
import { minis } from "./gallery-minis";

function GalleryCard({ entry }: { entry: ComponentEntry }) {
  const [theme, setTheme] = useState<PreviewTheme>("dark");

  return (
    <div className="group rounded-3xl border border-line bg-carbon p-5 transition-all duration-300 ease-out hover:-translate-y-1 hover:border-ash hover:shadow-[0_12px_32px_rgba(0,0,0,0.45)]">
      <div
        data-theme={theme === "light" ? "light" : undefined}
        className="pointer-events-none rounded-2xl bg-track p-3 transition-colors duration-300"
      >
        {minis[entry.slug]}
      </div>

      <div className="mt-4 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <Link
            href={`/components/${entry.slug}`}
            className="text-[15px] font-medium text-chalk transition-colors hover:text-pit"
          >
            {entry.title}
          </Link>
          <p className="mt-1 text-[13px] leading-relaxed text-smoke">{entry.description}</p>
        </div>
        <ThemeToggle value={theme} onChange={setTheme} className="mt-0.5" />
      </div>
    </div>
  );
}

export function Gallery() {
  return (
    <>
      {componentCategories.map((cat) => (
        <section key={cat} className="mt-12">
          <h2 className="text-sm font-medium uppercase tracking-wide text-ash">{cat}</h2>
          <div className="dim-siblings mt-4 grid gap-5 md:grid-cols-2">
            {componentsIn(cat).map((c) => (
              <GalleryCard key={c.slug} entry={c} />
            ))}
          </div>
        </section>
      ))}
    </>
  );
}
