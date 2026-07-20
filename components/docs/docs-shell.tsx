import Link from "next/link";
import { Sidebar } from "./sidebar";
import { PitFlag } from "./pit-flag";

export function DocsShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      {/* mobile nav: the sidebar is desktop-only, so phones get a top bar */}
      <nav aria-label="Main" className="mb-8 flex flex-wrap items-center gap-x-5 gap-y-2 lg:hidden">
        <Link href="/" className="flex min-h-11 items-center gap-2 font-mono text-[12px] tracking-[0.2em] text-pit">
          <PitFlag size={18} className="shrink-0 text-chalk" />
          AGENT PIT STOP
        </Link>
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-[13px]">
          <Link href="/how-it-works" className="flex min-h-11 items-center text-smoke hover:text-chalk">
            How it works
          </Link>
          <Link href="/principles" className="flex min-h-11 items-center text-smoke hover:text-chalk">
            Principles
          </Link>
          <Link href="/components" className="flex min-h-11 items-center text-smoke hover:text-chalk">
            Components
          </Link>
        </div>
      </nav>

      <div className="flex gap-10">
        <Sidebar />
        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </div>
  );
}
