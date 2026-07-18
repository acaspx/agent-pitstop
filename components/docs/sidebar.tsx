"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "motion/react";
import { componentCategories, componentsIn, principles } from "@/lib/nav";
import { PitFlag } from "./pit-flag";

function NavLink({ href, label, muted }: { href: string | null; label: string; muted?: boolean }) {
  const pathname = usePathname();
  const active = href !== null && pathname === href;

  if (!href) {
    return (
      <span className="block rounded-md px-2.5 py-1.5 text-[13px] text-ash">
        {label}
        <span className="ml-2 text-[10px] uppercase tracking-wide">soon</span>
      </span>
    );
  }
  return (
    <Link
      href={href}
      className={`relative block rounded-md px-2.5 py-1.5 text-[13px] transition-colors ${
        active ? "text-chalk" : muted ? "text-ash hover:text-smoke" : "text-smoke hover:text-chalk"
      }`}
    >
      {active && (
        <motion.span
          layoutId="nav-active"
          className="absolute inset-0 rounded-md bg-barrier"
          transition={{ type: "spring", stiffness: 420, damping: 34 }}
        />
      )}
      <span className="relative">{label}</span>
    </Link>
  );
}

export function Sidebar() {
  return (
    <nav aria-label="Documentation" className="w-52 shrink-0 max-lg:hidden">
      <div className="sticky top-12 space-y-7">
        <Link
          href="/"
          className="flex items-center gap-2 px-2.5 font-mono text-[12px] tracking-[0.2em] text-pit"
        >
          <PitFlag size={20} className="shrink-0 text-chalk" />
          AGENT PIT STOP
        </Link>

        <div>
          <NavLink href="/how-it-works" label="How it works" />
        </div>

        <div>
          <div className="px-2.5 pb-1.5 text-[11px] font-medium uppercase tracking-wide text-ash">
            Principles
          </div>
          {principles.map((p) => (
            <NavLink
              key={p.slug}
              href={p.status === "live" ? `/principles/${p.slug}` : null}
              label={p.title}
            />
          ))}
        </div>

        <div>
          <div className="px-2.5 pb-1.5 text-[11px] font-medium uppercase tracking-wide text-ash">
            Components
          </div>
          <NavLink href="/components" label="Overview" muted />
          {componentCategories.map((cat) => (
            <div key={cat} className="mt-2">
              <div className="px-2.5 pb-1 text-[11px] text-ash">{cat}</div>
              {componentsIn(cat).map((c) => (
                <NavLink key={c.slug} href={`/components/${c.slug}`} label={c.title} />
              ))}
            </div>
          ))}
        </div>
      </div>
    </nav>
  );
}
