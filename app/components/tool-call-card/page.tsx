import Link from "next/link";
import { ToolCallCardDemo } from "./demo";

export const metadata = {
  title: "Tool Call Card — Agent Pit Stop",
  description: "Show an agent's tool use with legible, progressive disclosure.",
};

export default function ToolCallCardPage() {
  return (
    <main className="space-y-10">
      <div>
        <Link href="/" className="text-[13px] text-smoke hover:text-chalk">
          ← Agent Pit Stop
        </Link>
        <h1 className="mt-4 text-2xl font-semibold tracking-tight">Tool Call Card</h1>
        <p className="mt-2 max-w-prose text-[15px] leading-relaxed text-smoke">
          The atomic unit of agent legibility. The name and intent stay visible at all
          times; arguments and results are one tap away. State is never communicated by
          color alone, and failures keep the arguments on screen so a human can diagnose
          without re-running.
        </p>
      </div>

      <ToolCallCardDemo />

      <div>
        <h2 className="text-sm font-medium uppercase tracking-wide text-ash">Install</h2>
        <pre className="mt-2 overflow-x-auto rounded-xl border border-line bg-asphalt p-4 font-mono text-[13px] text-smoke">
          {"npx shadcn@latest add https://agent-pitstop.vercel.app/r/tool-call-card.json"}
        </pre>
        <p className="mt-2 text-[13px] text-ash">
          Or copy the source from{" "}
          <a
            className="text-pit hover:underline"
            href="https://github.com/acaspx/agent-pitstop/blob/main/registry/tool-call-card/tool-call-card.tsx"
          >
            registry/tool-call-card
          </a>
          . MIT licensed.
        </p>
      </div>
    </main>
  );
}
