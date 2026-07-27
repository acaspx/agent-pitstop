import Link from "next/link";
import { componentCategories, componentsIn } from "@/lib/nav";
import { minis } from "./gallery-minis";

export const metadata = {
  title: "Components — Agent Pit Stop",
  description: "Every component, with live previews. Installable via the shadcn registry.",
};


export default function ComponentsOverview() {
  return (
    <main>
      <h1 className="text-2xl font-semibold tracking-tight">Components</h1>
      <p className="mt-2 max-w-prose text-[15px] leading-relaxed text-smoke">
        Every component, live. Each installs with one shadcn command or copies as a single
        file. Built with React 19, Tailwind 4, and Motion.
      </p>

      {componentCategories.map((cat) => (
        <section key={cat} className="mt-12">
          <h2 className="text-sm font-medium uppercase tracking-wide text-ash">{cat}</h2>
          <div className="dim-siblings mt-4 grid gap-5 md:grid-cols-2">
            {componentsIn(cat).map((c) => (
              <Link
                key={c.slug}
                href={`/components/${c.slug}`}
                className="group rounded-3xl border border-line bg-carbon p-5 transition-all duration-300 ease-out hover:-translate-y-1 hover:border-ash hover:shadow-[0_12px_32px_rgba(0,0,0,0.45)]"
              >
                <div className="pointer-events-none">{minis[c.slug]}</div>
                <div className="mt-4 text-[15px] font-medium text-chalk group-hover:text-pit">
                  {c.title}
                </div>
                <div className="mt-1 text-[13px] leading-relaxed text-smoke">{c.description}</div>
              </Link>
            ))}
          </div>
        </section>
      ))}
    </main>
  );
}
