import Link from "next/link";
import { PitFlag } from "@/components/docs/pit-flag";
import { Reveal } from "@/components/docs/reveal";

const principles = [
  { title: "Legible thinking", href: "/principles/legible-thinking", status: "Live" },
  { title: "Interruptibility", href: "/principles/interruptibility", status: "Live" },
  { title: "Delegation contracts", href: null, status: "Planned" },
  { title: "Calibrated trust", href: null, status: "Planned" },
  { title: "Graceful failure", href: null, status: "Planned" },
];

const components = [
  { title: "Tool Call Card", href: "/components/tool-call-card", status: "Live" },
  { title: "Approval Gate", href: "/components/approval-gate", status: "Live" },
  { title: "Agent Task List", href: "/components/agent-task-list", status: "Live" },
  { title: "Interrupt Bar", href: "/components/interrupt-bar", status: "Live" },
];

export default function Home() {
  return (
    <main className="mx-auto max-w-3xl space-y-14 px-6 py-16">
      <Reveal>
      <header className="space-y-4">
        <div className="flex items-center gap-2.5 font-mono text-[13px] text-pit">
          <PitFlag size={26} />
          AGENT PIT STOP
        </div>
        <h1 className="max-w-xl text-3xl font-semibold leading-tight tracking-tight">
          A design system for the moments where agents and humans sync.
        </h1>
        <p className="max-w-prose text-[15px] leading-relaxed text-smoke">
          Agents run laps on their own. The interface moments that matter are the pit
          stops: approval, inspection, handoff, recovery. Agent Pit Stop is an open set of
          principles and React components for designing those moments, written by a
          designer who has shipped agentic products since 2021. Free, MIT, and built to
          be copied.
        </p>
      </header>
      </Reveal>

      <Reveal delay={0.08}>
      <section>
        <h2 className="text-sm font-medium uppercase tracking-wide text-ash">Principles</h2>
        <ul className="mt-3 divide-y divide-line border-y border-line">
          {principles.map((p) => (
            <li key={p.title} className="flex items-center justify-between py-3">
              {p.href ? (
                <Link href={p.href} className="text-[15px] text-chalk hover:text-pit">
                  {p.title}
                </Link>
              ) : (
                <span className="text-[15px] text-smoke">{p.title}</span>
              )}
              <span className={`text-[12px] ${p.status === "Live" ? "text-signal" : "text-ash"}`}>
                {p.status}
              </span>
            </li>
          ))}
        </ul>
      </section>
      </Reveal>

      <Reveal delay={0.14}>
      <section>
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-medium uppercase tracking-wide text-ash">Components</h2>
          <Link href="/components" className="text-[13px] text-smoke hover:text-pit">
            Browse all →
          </Link>
        </div>
        <ul className="mt-3 divide-y divide-line border-y border-line">
          {components.map((c) => (
            <li key={c.title} className="flex items-center justify-between py-3">
              {c.href ? (
                <Link href={c.href} className="text-[15px] text-chalk hover:text-pit">
                  {c.title}
                </Link>
              ) : (
                <span className="text-[15px] text-smoke">{c.title}</span>
              )}
              <span className={`text-[12px] ${c.status === "Live" ? "text-signal" : "text-ash"}`}>
                {c.status}
              </span>
            </li>
          ))}
        </ul>
      </section>
      </Reveal>

      <Reveal delay={0.2}>
      <footer className="text-[13px] text-ash">
        By{" "}
        <a href="https://github.com/acaspx" className="text-smoke hover:text-chalk">
          Anton Castro
        </a>
        . Source on{" "}
        <a href="https://github.com/acaspx/agent-pitstop" className="text-smoke hover:text-chalk">
          GitHub
        </a>
        .
      </footer>
      </Reveal>
    </main>
  );
}
