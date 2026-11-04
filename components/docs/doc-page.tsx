import { readFileSync } from "node:fs";
import path from "node:path";
import Link from "next/link";
import type { ReactNode } from "react";
import { adjacentComponents, components, type Format } from "@/lib/nav";
import { PreviewPane } from "./preview-pane";
import { CodeBlock } from "./code-block";

export interface DocSection {
  heading?: string;
  body?: ReactNode;
  code?: string;
  codeTitle?: string;
}

export interface ComponentDocProps {
  slug: string;
  intro: string;
  sections: DocSection[];
  preview: ReactNode;
  variants?: Partial<Record<Format, ReactNode>>;
  chatPrompt?: string;
}

interface A11y { keyboard: string; screenReader: string; motion: string; host: string }

/**
 * The accessibility notes, read from the same generated registry item an agent installs
 * (public/r/<slug>.json, built from the component's header), so the page and the contract
 * can't disagree.
 */
function accessibilityOf(slug: string): A11y | null {
  try {
    const item = JSON.parse(readFileSync(path.join(process.cwd(), "public", "r", `${slug}.json`), "utf8"));
    return item.meta?.accessibility ?? null;
  } catch {
    return null;
  }
}

const A11Y_ROWS: [keyof A11y, string][] = [
  ["keyboard", "Keyboard"],
  ["screenReader", "Screen reader"],
  ["motion", "Motion"],
  ["host", "You provide"],
];

export function ComponentDoc({ slug, intro, sections, preview, variants, chatPrompt }: ComponentDocProps) {
  const entry = components.find((c) => c.slug === slug);
  if (!entry) return null;
  const { prev, next } = adjacentComponents(slug);
  const installCmd = `npx shadcn@latest add https://agent-pitstop.vercel.app/r/${slug}.json`;
  const a11y = accessibilityOf(slug);

  return (
    <main>
      <div className="grid gap-10 lg:grid-cols-[minmax(0,26rem)_minmax(0,1fr)] xl:gap-14">
        {/* Left: narrative + code */}
        <div className="space-y-8">
          <div>
            <div className="text-[11px] font-medium uppercase tracking-wide text-ash">
              Components · {entry.category}
            </div>
            <h1 className="mt-2 text-2xl font-semibold tracking-tight">{entry.title}</h1>
            <p className="mt-3 text-[15px] leading-relaxed text-smoke">{intro}</p>
          </div>

          {sections.map((s, i) => (
            <section key={i}>
              {s.heading && (
                <h2 className="text-sm font-medium uppercase tracking-wide text-ash">{s.heading}</h2>
              )}
              {s.body && <div className="mt-2 text-[15px] leading-relaxed text-smoke">{s.body}</div>}
              {s.code && (
                <div className="mt-3">
                  <CodeBlock code={s.code} title={s.codeTitle} />
                </div>
              )}
            </section>
          ))}

          {a11y && (
            <section aria-labelledby="a11y">
              <h2 id="a11y" className="text-sm font-medium uppercase tracking-wide text-ash">Accessibility</h2>
              <dl className="mt-3 divide-y divide-line rounded-xl border border-line">
                {A11Y_ROWS.map(([key, label]) => (
                  <div key={key} className="grid gap-1 px-4 py-3 sm:grid-cols-[7.5rem_1fr] sm:gap-4">
                    <dt className={`text-[13px] font-medium ${key === "host" ? "text-pit" : "text-chalk"}`}>{label}</dt>
                    <dd className="text-[14px] leading-relaxed text-smoke">{a11y[key].replace(/`/g, "")}</dd>
                  </div>
                ))}
              </dl>
            </section>
          )}

          <section>
            <h2 className="text-sm font-medium uppercase tracking-wide text-ash">Install</h2>
            <div className="mt-3">
              <CodeBlock code={installCmd} title="shell" />
            </div>
            <p className="mt-2 text-[13px] text-ash">
              Or copy the source from{" "}
              <a
                className="text-pit hover:underline"
                href={`https://github.com/acaspx/agent-pitstop/blob/main/registry/${slug}/${slug}.tsx`}
              >
                registry/{slug}
              </a>
              . MIT licensed.
            </p>
          </section>

          <nav className="flex items-center justify-between border-t border-line pt-5 text-[13px]">
            {prev ? (
              <Link href={`/components/${prev.slug}`} className="text-smoke hover:text-chalk">
                ← {prev.title}
              </Link>
            ) : (
              <span />
            )}
            {next ? (
              <Link href={`/components/${next.slug}`} className="text-smoke hover:text-chalk">
                {next.title} →
              </Link>
            ) : (
              <span />
            )}
          </nav>
        </div>

        {/* Right: sticky live preview */}
        <div className="lg:sticky lg:top-12 lg:self-start">
          <PreviewPane formats={entry.formats} variants={variants} chatPrompt={chatPrompt}>
            {preview}
          </PreviewPane>
        </div>
      </div>
    </main>
  );
}
