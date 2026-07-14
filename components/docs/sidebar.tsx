"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { componentCategories, componentsIn, principles } from "@/lib/nav";

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
      className={`block rounded-md px-2.5 py-1.5 text-[13px] transition-colors ${
        active
          ? "bg-barrier text-chalk"
          : muted
            ? "text-ash hover:text-smoke"
            : "text-smoke hover:text-chalk"
      }`}
    >
      {label}
    </Link>
  );
}

export function Sidebar() {
  return (
    <nav aria-label="Documentation" className="w-52 shrink-0 max-lg:hidden">
      <div className="sticky top-12 space-y-7">
        <Link href="/" className="block px-2.5 font-mono text-[12px] tracking-[0.2em] text-pit">
          AGENT PIT STOP
        </Link>

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
