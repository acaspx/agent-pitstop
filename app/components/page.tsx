import Link from "next/link";
import { Showcase } from "@/components/showcase/Showcase";
import { components, componentCategories, componentsIn } from "@/lib/nav";

export const metadata = {
  title: "Components — Agent Pit Stop",
  description: "Every component, live and interactive. Installable via the shadcn registry.",
};

export default function ComponentsOverview() {
  return (
    <main>
      <h1 className="text-2xl font-semibold tracking-tight">Components</h1>
      <p className="mt-2 max-w-prose text-[15px] leading-relaxed text-smoke">
        {components.length} components, every one of them live. Approve, stop, forget, restore:
        each tile is the real component, not a screenshot. Re-theme them all at once; the
        components never change, only the tokens underneath them. Each installs with one
        shadcn command or copies as a single file.
      </p>

      <Showcase className="mt-8" />

      <section className="mt-16 grid gap-8 border-t border-line pt-8 md:grid-cols-3">
        {componentCategories.map((cat) => (
          <div key={cat}>
            <h2 className="text-sm font-medium uppercase tracking-wide text-ash">{cat}</h2>
            <ul className="mt-3 space-y-2.5">
              {componentsIn(cat).map((c) => (
                <li key={c.slug}>
                  <Link href={`/components/${c.slug}`} className="text-[14px] text-chalk hover:text-pit">
                    {c.title}
                  </Link>
                  <p className="text-[12px] leading-relaxed text-ash">{c.description}</p>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </section>
    </main>
  );
}
