import Link from "next/link";
import { AgentTaskListDemo } from "./demo";

export const metadata = {
  title: "Agent Task List — Agent Pit Stop",
  description: "The agent's plan, made visible: pending, active, done, and failed.",
};

export default function AgentTaskListPage() {
  return (
    <main className="space-y-10">
      <div>
        <Link href="/" className="text-[13px] text-smoke hover:text-chalk">
          ← Agent Pit Stop
        </Link>
        <h1 className="mt-4 text-2xl font-semibold tracking-tight">Agent Task List</h1>
        <p className="mt-2 max-w-prose text-[15px] leading-relaxed text-smoke">
          A spinner says &quot;trust me.&quot; A plan says &quot;check me.&quot; The task list shows
          the agent&apos;s intent before execution, keeps exactly one task active with a live
          sublabel, and leaves failures in place with the error attached, because the plan
          itself is the best recovery interface.
        </p>
      </div>

      <AgentTaskListDemo />

      <div>
        <h2 className="text-sm font-medium uppercase tracking-wide text-ash">Install</h2>
        <pre className="mt-2 overflow-x-auto rounded-xl border border-line bg-asphalt p-4 font-mono text-[13px] text-smoke">
          {"npx shadcn@latest add https://agent-pitstop.vercel.app/r/agent-task-list.json"}
        </pre>
        <p className="mt-2 text-[13px] text-ash">
          Or copy the source from{" "}
          <a
            className="text-pit hover:underline"
            href="https://github.com/acaspx/agent-pitstop/blob/main/registry/agent-task-list/agent-task-list.tsx"
          >
            registry/agent-task-list
          </a>
          . MIT licensed.
        </p>
      </div>
    </main>
  );
}
