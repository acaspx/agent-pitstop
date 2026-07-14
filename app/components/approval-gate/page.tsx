import Link from "next/link";
import { ApprovalGateDemo } from "./demo";

export const metadata = {
  title: "Approval Gate — Agent Pit Stop",
  description: "An inline permission request with itemized scope. Nothing moves until the human says so.",
};

export default function ApprovalGatePage() {
  return (
    <main className="space-y-10">
      <div>
        <Link href="/" className="text-[13px] text-smoke hover:text-chalk">
          ← Agent Pit Stop
        </Link>
        <h1 className="mt-4 text-2xl font-semibold tracking-tight">Approval Gate</h1>
        <p className="mt-2 max-w-prose text-[15px] leading-relaxed text-smoke">
          The core of a delegation contract. The agent states what it wants to do, itemizes
          the exact scope, and marks what can&apos;t be undone. Denying is as prominent as
          approving. After the decision, the gate collapses to a one-line receipt so the
          transcript keeps its audit trail without the clutter.
        </p>
      </div>

      <ApprovalGateDemo />

      <div>
        <h2 className="text-sm font-medium uppercase tracking-wide text-ash">Install</h2>
        <pre className="mt-2 overflow-x-auto rounded-xl border border-line bg-asphalt p-4 font-mono text-[13px] text-smoke">
          {"npx shadcn@latest add https://agent-pitstop.vercel.app/r/approval-gate.json"}
        </pre>
        <p className="mt-2 text-[13px] text-ash">
          Or copy the source from{" "}
          <a
            className="text-pit hover:underline"
            href="https://github.com/acaspx/agent-pitstop/blob/main/registry/approval-gate/approval-gate.tsx"
          >
            registry/approval-gate
          </a>
          . MIT licensed.
        </p>
      </div>
    </main>
  );
}
