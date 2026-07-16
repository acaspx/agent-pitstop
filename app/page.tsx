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

function Row({ title, href, status }: { title: string; href: string | null; status: string }) {
  return (
    <li className="flex items-center justify-between py-3">
      {href ? (
        <Link href={href} className="text-[15px] text-chalk hover:text-pit">
          {title}
        </Link>
      ) : (
        <span className="text-[15px] text-smoke">{title}</span>
      )}
      <span className={`text-[12px] ${status === "Live" ? "text-signal" : "text-ash"}`}>{status}</span>
    </li>
  );
}

export default function Home() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-14">
      {/* top rule with marker + chip, like a start line */}
      <Reveal>
        <div className="relative flex items-center justify-between border-b border-line pb-3">
          <span className="h-2.5 w-2.5 rounded-full bg-pit" aria-hidden />
          <a
            href="https://github.com/acaspx/agent-pitstop"
            className="bg-pit px-2.5 py-1 font-mono text-[11px] font-medium tracking-wide text-track transition-opacity hover:opacity-85"
          >
            STAR ON GITHUB
          </a>
        </div>
      </Reveal>

      {/* two rails: flag + wordmark / nav */}
      <Reveal delay={0.06}>
        <div className="mt-14 grid gap-12 md:grid-cols-2">
          <div>
            <PitFlag size={72} className="text-chalk" />
            <div className="mt-6 font-mono text-[13px] tracking-[0.3em] text-pit">
              AGENT PIT STOP
            </div>
          </div>
          <nav className="flex flex-col gap-1.5 text-xl font-medium tracking-tight md:pt-1">
            <a href="#principles" className="w-fit text-chalk transition-colors hover:text-pit">
              Principles
            </a>
            <Link href="/components" className="w-fit text-chalk transition-colors hover:text-pit">
              Components
            </Link>
            <a
              href="https://github.com/acaspx/agent-pitstop"
              className="w-fit text-chalk transition-colors hover:text-pit"
            >
              GitHub
            </a>
          </nav>
        </div>
      </Reveal>

      {/* two-column statement */}
      <Reveal delay={0.12}>
        <div className="mt-24 grid gap-10 md:grid-cols-2">
          <h1 className="text-[26px] font-semibold leading-snug tracking-tight text-chalk md:text-[30px]">
            A design system for the moments where agents and humans sync.
          </h1>
          <p className="text-[15px] leading-relaxed text-smoke md:pt-1.5">
            Agents run laps on their own. The interface moments that matter are the pit
            stops: approval, inspection, handoff, recovery. Agent Pit Stop is an open set
            of principles and React components for designing those moments, written by a
            designer who has shipped agentic products since 2021. Free, MIT, and built to
            be copied.
          </p>
        </div>
      </Reveal>

      {/* two-rail sections */}
      <Reveal delay={0.16}>
        <section id="principles" className="mt-24 grid gap-4 border-t border-line pt-8 md:grid-cols-2 md:gap-12">
          <h2 className="font-mono text-sm font-medium uppercase tracking-[0.2em] text-ash">
            Principles
          </h2>
          <ul className="divide-y divide-line">
            {principles.map((p) => (
              <Row key={p.title} {...p} />
            ))}
          </ul>
        </section>
      </Reveal>

      <Reveal delay={0.1}>
        <section className="mt-16 grid gap-4 border-t border-line pt-8 md:grid-cols-2 md:gap-12">
          <div className="flex items-start justify-between md:flex-col md:gap-3">
            <h2 className="font-mono text-sm font-medium uppercase tracking-[0.2em] text-ash">
              Components
            </h2>
            <Link href="/components" className="text-[13px] text-smoke hover:text-pit">
              Browse all →
            </Link>
          </div>
          <ul className="divide-y divide-line">
            {components.map((c) => (
              <Row key={c.title} {...c} />
            ))}
          </ul>
        </section>
      </Reveal>

      <Reveal delay={0.1}>
        <footer className="mt-24 grid gap-4 border-t border-line pt-6 text-[13px] text-ash md:grid-cols-2 md:gap-12">
          <span className="font-mono text-[11px] tracking-[0.2em]">EVERY LAP NEEDS A PIT</span>
          <span>
            By{" "}
            <a href="https://github.com/acaspx" className="text-smoke hover:text-chalk">
              Anton Castro
            </a>
            . Source on{" "}
            <a href="https://github.com/acaspx/agent-pitstop" className="text-smoke hover:text-chalk">
              GitHub
            </a>
            . MIT.
          </span>
        </footer>
      </Reveal>
    </main>
  );
}
