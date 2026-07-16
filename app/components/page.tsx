import Link from "next/link";
import { componentCategories, componentsIn } from "@/lib/nav";
import { ToolCallCard } from "@/registry/tool-call-card/tool-call-card";
import { AgentTaskList } from "@/registry/agent-task-list/agent-task-list";
import { ApprovalGate } from "@/registry/approval-gate/approval-gate";
import { InterruptBar } from "@/registry/interrupt-bar/interrupt-bar";

export const metadata = {
  title: "Components — Agent Pit Stop",
  description: "Every component, with live previews. Installable via the shadcn registry.",
};

const minis: Record<string, React.ReactNode> = {
  "tool-call-card": (
    <ToolCallCard name="search_flights" intent="Searching SFO → JFK, Aug 12" state="running" elapsed={3} />
  ),
  "agent-task-list": (
    <AgentTaskList
      tasks={[
        { title: "Find flights", status: "done" },
        { title: "Compare prices", status: "active", detail: "14 flights vs $400 cap" },
        { title: "Hold best option", status: "pending" },
      ]}
    />
  ),
  "approval-gate": (
    <ApprovalGate
      title="Send the Q3 summary email?"
      state="awaiting"
      scope={[{ label: "Send email to 3 recipients", risky: true }]}
    />
  ),
  "interrupt-bar": (
    <InterruptBar activity="Comparing 14 flights…" elapsed={12} state="running" />
  ),
};

export default function ComponentsOverview() {
  return (
    <main>
      <h1 className="font-mono text-2xl font-semibold tracking-tight">Components</h1>
      <p className="mt-2 max-w-prose text-[15px] leading-relaxed text-smoke">
        Every component, live. Each installs with one shadcn command or copies as a single
        file. Built with React 19, Tailwind 4, and Motion.
      </p>

      {componentCategories.map((cat) => (
        <section key={cat} className="mt-12">
          <h2 className="text-sm font-medium uppercase tracking-wide text-ash">{cat}</h2>
          <div className="mt-4 grid gap-5 md:grid-cols-2">
            {componentsIn(cat).map((c) => (
              <Link
                key={c.slug}
                href={`/components/${c.slug}`}
                className="group rounded-2xl border border-line bg-[#0e0e10] p-5 transition-colors hover:border-ash"
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
