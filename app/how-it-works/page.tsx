import Link from "next/link";
import { DocsShell } from "@/components/docs/docs-shell";
import { TrackLoop } from "@/components/docs/track-loop";
import { CodeBlock } from "@/components/docs/code-block";

export const metadata = {
  title: "How Agent Pit Stop works — Agent Pit Stop",
  description:
    "The problem it was built to solve, the loop it's designed around, and the system it's made of. An open-source, agent-ready design system from a designer's lens.",
};

function H2({ children }: { children: React.ReactNode }) {
  return <h2 className="mt-14 font-mono text-lg font-semibold tracking-tight text-chalk">{children}</h2>;
}

function P({ children }: { children: React.ReactNode }) {
  return <p className="mt-4 max-w-prose text-[15px] leading-relaxed text-smoke">{children}</p>;
}

export default function HowItWorksPage() {
  return (
    <DocsShell>
      <main className="max-w-2xl">
        <div className="text-[11px] font-medium uppercase tracking-wide text-ash">
          About · The system
        </div>
        <h1 className="mt-2 font-mono text-2xl font-semibold tracking-tight text-chalk">
          How Agent Pit Stop works
        </h1>
        <p className="mt-3 text-[15px] leading-relaxed text-smoke">
          The problem it was built to solve, the loop it&apos;s designed around, and the
          system it&apos;s made of.
        </p>

        <H2>What is Agent Pit Stop?</H2>
        <P>
          Agent Pit Stop is an open-source design system for agent interfaces: five UX
          principles with live demos, and production React components for the moments
          where agents and humans sync. Approval, inspection, handoff, recovery. I write
          it from a designer&apos;s lens, having shipped agentic products since 2021, and
          everything is MIT and built to be copied.
        </P>
        <div className="mt-4">
          <CodeBlock
            title="shell"
            code={`npx shadcn@latest add https://agent-pitstop.vercel.app/r/approval-gate.json`}
          />
        </div>
        <div className="mt-3">
          <CodeBlock
            title="tsx"
            code={`import { ApprovalGate } from "@/components/approval-gate";

<ApprovalGate
  title="Send the Q3 summary email?"
  scope={[{ label: "Send to 3 recipients", risky: true }]}
  onApprove={send}
  onDeny={cancel}
/>`}
          />
        </div>
        <P>
          A few things set it apart. <strong className="text-chalk">It covers the interface layer,
          not the architecture.</strong> Most agentic design writing explains orchestration and
          memory to ML engineers; this system covers what the human actually sees,
          approves, interrupts, and trusts. <strong className="text-chalk">Every claim has living
          evidence.</strong> Each principle chapter embeds the working components that prove
          it, and each component page cites the principles it applies. <strong className="text-chalk">
          You own the code.</strong> Components are single files with three dependencies
          (React, Tailwind, Motion); install them through the registry or copy the source,
          and there is no library to wrap, version, or fork.
        </P>

        <H2>The problem</H2>
        <P>
          Every team shipping an agentic product designs the same moments from scratch:
          how to show a tool call, when to ask permission, what a stop button should do to
          in-progress work, how confident an extraction should look. I rebuilt those
          moments at a conversational AI startup, at a medical documentation company, and
          in an agentic capture app I co-founded. Three products, three hand-rolled
          versions of the same interface, and each time the pattern knowledge existed only
          as scars. Agent Pit Stop is those scars written down, made installable, and
          argued for, so the next team starts from a system instead of a blank canvas.
        </P>

        <H2>The loop</H2>
        <P>
          The whole system hangs on one model. Agents run laps on their own; the pit is
          where humans intervene. Design the pit well and users delegate more laps, the
          same way drivers go faster in cars with better brakes.
        </P>
        <div className="mt-6 -mx-2 rounded-2xl border border-line bg-[#0e0e10] p-4 md:p-6">
          <TrackLoop variant="full" className="w-full" />
        </div>
        <P>
          Every component serves a station on this circuit. The Approval Gate is the
          contract at the start line. Tool Call Cards and the Agent Task List are the
          telemetry that make the lap legible. The Confidence Meter and failure states are
          pit triggers. The Interrupt Bar is the brake and the steering wheel. The
          principles are the racecraft: when to interrupt, how to show uncertainty, what a
          failure owes the driver.
        </P>

        <H2>Principles as promises</H2>
        <P>
          <strong className="text-chalk">Built to be copied.</strong> Single-file components,
          MIT, no wrapper API. The graduated path is: install from the registry, restyle
          with your tokens, or take the source and own it entirely.
        </P>
        <P>
          <strong className="text-chalk">Evidence over opinion.</strong> No pattern ships as
          prose alone. If a principle can&apos;t be demonstrated with a working component,
          it isn&apos;t done being designed.
        </P>
        <P>
          <strong className="text-chalk">One system for humans and agents.</strong> The registry
          endpoints are machine-readable JSON with full source, so an AI coding assistant
          installs and composes these components exactly the way a person does. Agent
          interfaces, installable by agents, is not a gimmick; it&apos;s the distribution
          model.
        </P>
        <P>
          <strong className="text-chalk">Designed for the pit, not the lap.</strong> The system
          spends its effort on the sync moments. What the agent does autonomously is your
          product; what happens when a human leans in is what we make excellent.
        </P>

        <H2>The name</H2>
        <P>
          A pit stop is the moment a fast autonomous thing submits to human hands: twelve
          seconds of inspection, correction, and consent, then back out at speed. That is
          exactly the shape of good agent UX, and it names both halves honestly: the
          agent&apos;s job is to run laps, and the interface&apos;s job is to make the
          stops fast, legible, and worth trusting. Also, we wanted to go fast.
        </P>

        <H2>Open source</H2>
        <div className="mt-4">
          <CodeBlock title="shell" code={`git clone https://github.com/acaspx/agent-pitstop`} />
        </div>
        <P>
          Agent Pit Stop is MIT licensed and early: five principles, five components, one
          new piece shipping weekly. The roadmap is public, issues are open, and the best
          way to shape it is to tell me which sync moment your product is struggling with.
          Welcome to the pit.
        </P>

        <div className="mt-12 flex gap-5 border-t border-dotted border-line pt-6 text-[13px]">
          <Link href="/principles/legible-thinking" className="text-smoke hover:text-pit">
            Read the principles →
          </Link>
          <Link href="/components" className="text-smoke hover:text-pit">
            Browse components →
          </Link>
        </div>
      </main>
    </DocsShell>
  );
}
