import Link from "next/link";
import { principles } from "@/lib/nav";
import { PitFlag } from "@/components/docs/pit-flag";

export const metadata = {
  title: "Principles — Agent Pit Stop",
  description:
    "The philosophy, rules, and anti-patterns for building agent interfaces. Concise on purpose; the deep dives live in the chapters.",
};

const rules = [
  "Show intent before action, state during, evidence on demand.",
  "Never communicate state by color alone; icon and label, always.",
  "Render the plan before execution; done stays visible, failed stays in place.",
  "Itemize scope before consent; mark what can't be undone.",
  "Gate irreversible actions only; never ask permission to read.",
  "Stop is always visible and never destructive; the receipt says what survived.",
  "Acknowledge every steer the moment it lands.",
  "Confidence comes in bands, never decimals; claims travel with their basis.",
  "Verification is one tap away and cheaper than redoing.",
  "Failure is a rendered state; keep the inputs attached, bound the retries.",
];

const donts = [
  ["Dump raw chain-of-thought and call it transparency.", "Structure beats volume; that's Legible Thinking."],
  ["Fake a progress bar over indeterminate work.", "An honest pulse beats a lying percentage."],
  ["Offer blanket “always allow.”", "Scope a remembered choice as narrowly as the choice."],
  ["Show “87.3% confident.”", "Decimal confidence is theater; use bands."],
  ["Narrate (“Let me search…”) instead of showing.", "Narration is prose about work; legibility is the work."],
  ["Discard partial work on failure or stop.", "Three done steps are three done steps."],
  ["Retry silently.", "Show the attempt count and the bound."],
  ["Hide the stop control in a menu.", "A brake you have to find is not a brake."],
];

const essentials = [
  { need: "A visible plan", href: "/components/agent-task-list", comp: "Agent Task List" },
  { need: "Legible tool use", href: "/components/tool-call-card", comp: "Tool Call Card" },
  { need: "Consent before irreversible actions", href: "/components/approval-gate", comp: "Approval Gate" },
  { need: "Stop and steer, always reachable", href: "/components/interrupt-bar", comp: "Interrupt Bar" },
  { need: "Honest uncertainty with verification", href: "/components/confidence-meter", comp: "Confidence Meter" },
];

export default function PrinciplesOverview() {
  return (
    <main>
      <div className="text-[11px] font-medium uppercase tracking-wide text-ash">Principles</div>
      <h1 className="mt-2 flex items-center gap-3 font-mono text-2xl font-semibold tracking-tight text-chalk">
        <PitFlag size={30} className="shrink-0 text-chalk" />
        Rules for the pit
      </h1>
      <p className="mt-3 max-w-prose text-[15px] leading-relaxed text-smoke">
        The short version of the whole system. Concise on purpose; each idea gets its
        full argument, with live demos, in the chapters below.
      </p>

      <h2 className="mt-12 font-mono text-lg font-semibold tracking-tight text-chalk">Philosophy</h2>
      <ul className="mt-4 max-w-prose space-y-3 text-[15px] leading-relaxed text-smoke">
        <li>
          <strong className="text-chalk">Agents run laps; humans work the pit.</strong> Design
          effort goes to the sync moments: approval, inspection, handoff, recovery.
        </li>
        <li>
          <strong className="text-chalk">Interface, not architecture.</strong> This system covers
          what people see, approve, interrupt, and trust, not how the agent is orchestrated.
        </li>
        <li>
          <strong className="text-chalk">Evidence over opinion.</strong> A principle that can&apos;t
          be demonstrated with a working component isn&apos;t done being designed.
        </li>
        <li>
          <strong className="text-chalk">Built to be copied.</strong> Single-file components, three
          dependencies, MIT. Take the code and own it.
        </li>
        <li>
          <strong className="text-chalk">One system for humans and agents.</strong> The registry is
          machine-readable, so AI assistants install these components the same way you do.
        </li>
      </ul>

      <h2 className="mt-12 font-mono text-lg font-semibold tracking-tight text-chalk">The rules</h2>
      <ol className="mt-4 max-w-prose space-y-2.5">
        {rules.map((r, i) => (
          <li key={i} className="flex gap-3 text-[15px] leading-relaxed text-smoke">
            <span className="shrink-0 font-mono text-[13px] text-pit">{String(i + 1).padStart(2, "0")}</span>
            <span>{r}</span>
          </li>
        ))}
      </ol>

      <h2 className="mt-12 font-mono text-lg font-semibold tracking-tight text-chalk">Don&apos;t</h2>
      <ul className="mt-4 max-w-prose space-y-3">
        {donts.map(([bad, why], i) => (
          <li key={i} className="text-[15px] leading-relaxed">
            <span className="text-chalk">{bad}</span>{" "}
            <span className="text-smoke">{why}</span>
          </li>
        ))}
      </ul>

      <h2 className="mt-12 font-mono text-lg font-semibold tracking-tight text-chalk">
        The design language: headlights
      </h2>
      <p className="mt-3 max-w-prose text-[15px] leading-relaxed text-smoke">
        A night race. The interface is dark and calm; light is spent only on what matters
        right now. Attention is the scarcest resource in an agent product, so the visual
        system is built to spend it deliberately.
      </p>
      <ul className="mt-4 max-w-prose space-y-3 text-[15px] leading-relaxed text-smoke">
        <li>
          <strong className="text-chalk">One bright thing per surface.</strong> The current
          element renders at full strength; supporting context ghosts back to ~45–60%.
          If everything is lit, nothing is.
        </li>
        <li>
          <strong className="text-chalk">The past dims, the present glows, the future is
          outlined.</strong> Completed work fades to smoke, the active step holds chalk with
          a pit-orange pulse, pending work is drawn in ash outlines. Time is rendered as
          light.
        </li>
        <li>
          <strong className="text-chalk">Large calm containers.</strong> Feature surfaces use
          24px radius, generous padding, hairline borders one step above their background,
          and a whisper of dot-grid texture. Components inside stay tighter at 12px.
        </li>
        <li>
          <strong className="text-chalk">Pit-lane orange is earned.</strong> The accent marks
          the live thing: the running dot, the agent car, the primary action. It never
          decorates. Caution is yellow, success is green, danger is red, and none of them
          ever speak through color alone.
        </li>
      </ul>

      <h2 className="mt-12 font-mono text-lg font-semibold tracking-tight text-chalk">Motion</h2>
      <ul className="mt-4 max-w-prose space-y-3 text-[15px] leading-relaxed text-smoke">
        <li>
          <strong className="text-chalk">Motion is state change, never decoration.</strong>{" "}
          Every animation answers one question: what just happened, or where should I look?
        </li>
        <li>
          <strong className="text-chalk">Three speeds.</strong> Micro-feedback at ~150ms,
          element entrances and collapses at 250–400ms with the house ease
          (0.32, 0.72, 0, 1), ambient pulses at 1.2–1.4s. Nothing else.
        </li>
        <li>
          <strong className="text-chalk">Arrive rising, leave collapsing.</strong> New
          information enters with a small rise and settle; resolved information collapses
          to a receipt. Closing is always faster than opening.
        </li>
        <li>
          <strong className="text-chalk">Ambient means honest.</strong> Pulses mark genuinely
          live processes only; no fake progress, no decorative loops. All motion respects
          prefers-reduced-motion.
        </li>
      </ul>

      <h2 className="mt-12 font-mono text-lg font-semibold tracking-tight text-chalk">
        The essentials
      </h2>
      <p className="mt-3 max-w-prose text-[15px] leading-relaxed text-smoke">
        The minimum kit for any agent interface. If your product has an agent and is
        missing one of these, that&apos;s the next thing to design.
      </p>
      <ul className="mt-4 max-w-prose divide-y divide-line border-y border-line">
        {essentials.map((e) => (
          <li key={e.comp} className="flex items-center justify-between gap-4 py-3 text-[15px]">
            <span className="text-smoke">{e.need}</span>
            <Link href={e.href} className="shrink-0 text-[13px] text-chalk hover:text-pit">
              {e.comp} →
            </Link>
          </li>
        ))}
      </ul>

      <h2 className="mt-12 font-mono text-lg font-semibold tracking-tight text-chalk">
        Going deeper
      </h2>
      <ul className="mt-4 max-w-prose divide-y divide-line border-y border-line">
        {principles.map((p) => (
          <li key={p.slug} className="py-3">
            <Link href={`/principles/${p.slug}`} className="text-[15px] text-chalk hover:text-pit">
              {p.title} →
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
