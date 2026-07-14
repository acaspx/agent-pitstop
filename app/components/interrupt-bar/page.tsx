import Link from "next/link";
import { InterruptBarDemo } from "./demo";

export const metadata = {
  title: "Interrupt Bar — Agent Pit Stop",
  description: "The steering wheel and the brake for a running agent.",
};

export default function InterruptBarPage() {
  return (
    <main className="space-y-10">
      <div>
        <Link href="/" className="text-[13px] text-smoke hover:text-chalk">
          ← Agent Pit Stop
        </Link>
        <h1 className="mt-4 text-2xl font-semibold tracking-tight">Interrupt Bar</h1>
        <p className="mt-2 max-w-prose text-[15px] leading-relaxed text-smoke">
          Stop and steer, visible for the entire run. Stop is never destructive: partial
          work is kept and the receipt says exactly what survived. Steering redirects the
          agent mid-run and gets an immediate acknowledgment, because a correction that
          might have been ignored is worse than no correction at all.
        </p>
      </div>

      <InterruptBarDemo />

      <div>
        <h2 className="text-sm font-medium uppercase tracking-wide text-ash">Install</h2>
        <pre className="mt-2 overflow-x-auto rounded-xl border border-line bg-asphalt p-4 font-mono text-[13px] text-smoke">
          {"npx shadcn@latest add https://agent-pitstop.vercel.app/r/interrupt-bar.json"}
        </pre>
        <p className="mt-2 text-[13px] text-ash">
          Or copy the source from{" "}
          <a
            className="text-pit hover:underline"
            href="https://github.com/acaspx/agent-pitstop/blob/main/registry/interrupt-bar/interrupt-bar.tsx"
          >
            registry/interrupt-bar
          </a>
          . MIT licensed.
        </p>
      </div>
    </main>
  );
}
