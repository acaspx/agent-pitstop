import Link from "next/link";
import { PitFlag } from "@/components/docs/pit-flag";
import { TrackLoop } from "@/components/docs/track-loop";
import { Reveal } from "@/components/docs/reveal";

const principles = [
  { title: "Legible thinking", href: "/principles/legible-thinking", status: "Live" },
  { title: "Interruptibility", href: "/principles/interruptibility", status: "Live" },
  { title: "Delegation contracts", href: "/principles/delegation-contracts", status: "Live" },
  { title: "Calibrated trust", href: "/principles/calibrated-trust", status: "Live" },
  { title: "Graceful failure", href: "/principles/graceful-failure", status: "Live" },
];

const components = [
  { title: "Tool Call Card", href: "/components/tool-call-card", status: "Live" },
  { title: "Approval Gate", href: "/components/approval-gate", status: "Live" },
  { title: "Agent Task List", href: "/components/agent-task-list", status: "Live" },
  { title: "Interrupt Bar", href: "/components/interrupt-bar", status: "Live" },
  { title: "Confidence Meter", href: "/components/confidence-meter", status: "Live" },
];

/* two-tone icons in the site accent */
function SparkIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden>
      <path
        d="M11 2l2.1 6.9L20 11l-6.9 2.1L11 20l-2.1-6.9L2 11l6.9-2.1L11 2Z"
        fill="var(--color-pit)"
        fillOpacity="0.3"
        stroke="var(--color-pit)"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function BracketsIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden>
      <rect x="7.5" y="7.5" width="7" height="7" rx="1.5" fill="var(--color-pit)" fillOpacity="0.3" stroke="var(--color-pit)" strokeWidth="1.2" />
      <path d="M8 2.5H4.5A2 2 0 0 0 2.5 4.5V8M14 2.5h3.5a2 2 0 0 1 2 2V8M8 19.5H4.5a2 2 0 0 1-2-2V14M14 19.5h3.5a2 2 0 0 0 2-2V14" stroke="var(--color-pit)" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

function DocIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden>
      <rect x="3.5" y="2.5" width="15" height="17" rx="2" stroke="var(--color-pit)" strokeWidth="1.4" />
      <path d="M7 7h8" stroke="var(--color-pit)" strokeWidth="2.4" strokeLinecap="round" opacity="0.35" />
      <path d="M7 11h8M7 15h5" stroke="var(--color-pit)" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

const heroCards = [
  {
    title: "Principles",
    description: "The why. Essays on agent UX with live demos.",
    href: "#principles",
    external: false,
    icon: <SparkIcon />,
  },
  {
    title: "Components",
    description: "The how. Production React, installable via shadcn.",
    href: "/components",
    external: false,
    icon: <BracketsIcon />,
  },
  {
    title: "How it works",
    description: "The problem, the loop, and the system.",
    href: "/how-it-works",
    external: false,
    icon: <DocIcon />,
  },
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
        <div className="relative flex items-center justify-between pb-3">
          <div className="flex items-center gap-3">
            <PitFlag size={18} className="shrink-0 text-pit" />
            <span className="font-mono text-[13px] tracking-[0.3em] text-pit">AGENT PIT STOP</span>
          </div>
          <a
            href="https://github.com/acaspx/agent-pitstop"
            className="bg-pit px-2.5 py-1 font-mono text-[11px] font-medium tracking-wide text-track transition-opacity hover:opacity-85"
          >
            STAR ON GITHUB
          </a>
        </div>
      </Reveal>

      {/* hero card grid */}
      <Reveal delay={0.1}>
        <div className="mt-10 grid gap-3 lg:grid-cols-[1.55fr_1fr]">
          {/* large card: headline / flag / paragraph */}
          <div className="relative flex min-h-[420px] flex-col justify-between overflow-hidden rounded-2xl border border-line bg-[#0e0e10] p-7 md:min-h-[540px] md:p-9">
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <TrackLoop variant="hero" className="w-[420px] max-w-[88%] opacity-95" />
            </div>
            <h1 className="relative max-w-md text-[27px] font-semibold leading-tight tracking-tight text-chalk md:text-[33px]">
              A design system for the moments where agents and humans sync.
            </h1>
            <p className="relative max-w-md text-[14.5px] leading-relaxed text-smoke">
              Agents run laps on their own. The interface moments that matter are the pit
              stops: approval, inspection, handoff, recovery. Agent Pit Stop is an open
              set of principles and React components for designing those moments, written
              by a designer who has shipped agentic products since 2021. Free and built
              to be distributed, and repurposed.
            </p>
          </div>

          {/* three link cards */}
          <div className="grid gap-3">
            {heroCards.map((card) =>
              card.external ? (
                <a
                  key={card.title}
                  href={card.href}
                  className="group flex min-h-[150px] flex-col justify-between rounded-2xl border border-line bg-[#0e0e10] p-6 transition-colors hover:border-ash md:min-h-[172px]"
                >
                  {card.icon}
                  <div>
                    <div className="text-[15px] font-medium text-chalk group-hover:text-pit">
                      {card.title}
                    </div>
                    <p className="mt-1 text-[13px] leading-relaxed text-smoke">{card.description}</p>
                  </div>
                </a>
              ) : (
                <Link
                  key={card.title}
                  href={card.href}
                  className="group flex min-h-[150px] flex-col justify-between rounded-2xl border border-line bg-[#0e0e10] p-6 transition-colors hover:border-ash md:min-h-[172px]"
                >
                  {card.icon}
                  <div>
                    <div className="text-[15px] font-medium text-chalk group-hover:text-pit">
                      {card.title}
                    </div>
                    <p className="mt-1 text-[13px] leading-relaxed text-smoke">{card.description}</p>
                  </div>
                </Link>
              ),
            )}
          </div>
        </div>
      </Reveal>

      {/* two-rail sections */}
      <Reveal delay={0.16}>
        <section id="principles" className="mt-24 grid gap-4 md:grid-cols-2 md:gap-12">
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
        <section className="mt-16 grid gap-4 md:grid-cols-2 md:gap-12">
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
        <footer className="mt-24 grid gap-4 border-t border-dotted border-line pt-6 text-[13px] text-ash md:grid-cols-2 md:gap-12">
          <span className="flex items-center gap-2.5 font-mono text-[11px] tracking-[0.2em]">
            <PitFlag size={18} animated={false} className="shrink-0 text-chalk" />
            &ldquo;I WANNA GO FAST.&rdquo; — RICKY BOBBY
          </span>
          <span className="md:text-right">
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
