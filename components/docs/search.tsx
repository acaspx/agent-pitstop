"use client";

/**
 * ⌘K search over the whole site: components, principles, evals and pages.
 *
 * <Search /> is mounted once, in the root layout. It listens for ⌘K / Ctrl+K anywhere,
 * "/" when nothing is being typed into, and the `pitstop:search` event that every
 * <SearchButton /> fires, so the triggers can live in any nav without sharing state.
 *
 * It is a modal combobox: the input owns focus, arrows move the highlight through a
 * listbox (aria-activedescendant), Enter opens, Escape closes and focus goes back to
 * whatever opened it.
 */

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { components, principles } from "@/lib/nav";

interface Item { title: string; href: string; section: string; description: string }

const ITEMS: Item[] = [
  { title: "How it works", href: "/how-it-works", section: "Docs", description: "The problem, the loop, and the system." },
  { title: "The Full Lap", href: "/full-lap", section: "Docs", description: "Every component driven through one interruptible agent run." },
  { title: "Changelog", href: "/changelog", section: "Docs", description: "Every change, month by month." },
  { title: "Rules for the pit", href: "/principles", section: "Principles", description: "Philosophy, ten rules, anti-patterns, the design language and motion." },
  ...principles.filter((p) => p.status === "live").map((p) => ({ title: p.title, href: `/principles/${p.slug}`, section: "Principles", description: "Principle chapter with live demos." })),
  { title: "Components overview", href: "/components", section: "Components", description: "Every component, live, with the theme customizer." },
  ...components.map((c) => ({ title: c.title, href: `/components/${c.slug}`, section: `Components · ${c.category}`, description: c.description })),
  { title: "Evals", href: "/evals", section: "Evals", description: "How agents are tested against the system, and the results." },
  { title: "Contract use", href: "/evals/contract-use", section: "Evals", description: "Can an agent build correct screens from the contract alone? 0/10 to 10/10." },
];

const OPEN_EVENT = "pitstop:search";

/** Title matches first (start of a word, then anywhere), then description and section. */
function rank(items: Item[], query: string): Item[] {
  const q = query.trim().toLowerCase();
  if (!q) return items;
  const words = q.split(/\s+/);
  return items
    .map((it) => {
      const title = it.title.toLowerCase();
      const rest = `${it.description} ${it.section}`.toLowerCase();
      let score = 0;
      for (const w of words) {
        if (new RegExp(`\\b${w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}`).test(title)) score += 10;
        else if (title.includes(w)) score += 6;
        else if (rest.includes(w)) score += 2;
        else return { it, score: -1 };
      }
      return { it, score };
    })
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((r) => r.it);
}

export function SearchButton({ className }: { className?: string }) {
  const [mac, setMac] = useState(true);
  useEffect(() => setMac(/Mac|iPhone|iPad/.test(navigator.platform)), []);
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event(OPEN_EVENT))}
      className={`flex min-h-9 items-center gap-2 rounded-lg border border-line px-2.5 text-[13px] text-ash transition-colors hover:border-ash hover:text-smoke pointer-coarse:min-h-11 ${className ?? ""}`}
    >
      <svg width="13" height="13" viewBox="0 0 16 16" fill="none" aria-hidden>
        <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.6" />
        <path d="M11 11l3.5 3.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
      <span>Search</span>
      <kbd className="ml-auto font-mono text-[11px] text-ash">{mac ? "⌘K" : "Ctrl K"}</kbd>
    </button>
  );
}

export function Search() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const input = useRef<HTMLInputElement>(null);
  const list = useRef<HTMLUListElement>(null);
  const opener = useRef<Element | null>(null);
  const results = useMemo(() => rank(ITEMS, query), [query]);

  const show = () => {
    opener.current = document.activeElement;
    setQuery("");
    setActive(0);
    setOpen(true);
  };
  const close = () => {
    setOpen(false);
    (opener.current as HTMLElement | null)?.focus?.();
  };
  const go = (it: Item | undefined) => {
    if (!it) return;
    setOpen(false);
    router.push(it.href);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (open) close();
        else show();
        return;
      }
      const t = e.target as HTMLElement | null;
      const typing = t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable);
      if (e.key === "/" && !open && !typing) {
        e.preventDefault();
        show();
      }
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener(OPEN_EVENT, show);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener(OPEN_EVENT, show);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  useEffect(() => {
    if (!open) return;
    input.current?.focus();
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  // Keep the highlighted result in view as the arrows move it.
  useEffect(() => {
    list.current?.querySelector(`[data-index="${active}"]`)?.scrollIntoView({ block: "nearest" });
  }, [active]);

  if (!open) return null;

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => Math.min(results.length - 1, a + 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => Math.max(0, a - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      go(results[active]);
    } else if (e.key === "Escape") {
      e.preventDefault();
      close();
    } else if (e.key === "Tab") {
      // The dialog has one control; keep focus in it.
      e.preventDefault();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-track/70 px-4 pt-[12vh] backdrop-blur-sm" onMouseDown={close}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Search Agent Pit Stop"
        className="w-full max-w-lg overflow-hidden rounded-2xl border border-line bg-asphalt shadow-[0_24px_60px_rgba(0,0,0,0.5)]"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-2.5 border-b border-line px-4">
          <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden className="shrink-0 text-ash">
            <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.6" />
            <path d="M11 11l3.5 3.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
          <input
            ref={input}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActive(0);
            }}
            onKeyDown={onKeyDown}
            placeholder="Search components, principles, evals…"
            role="combobox"
            aria-expanded="true"
            aria-controls="search-results"
            aria-activedescendant={results[active] ? `search-${active}` : undefined}
            aria-autocomplete="list"
            className="min-h-12 flex-1 bg-transparent text-[15px] text-chalk outline-none placeholder:text-ash"
            // the dialog is the focus indicator; the global ring would box the field
            style={{ outline: "none" }}
          />
          <kbd className="shrink-0 rounded border border-line px-1.5 font-mono text-[11px] text-ash">esc</kbd>
        </div>
        <ul ref={list} id="search-results" role="listbox" aria-label="Results" className="max-h-[50vh] overflow-y-auto p-2">
          {results.length === 0 && <li className="px-3 py-6 text-center text-[13px] text-ash">Nothing matches &ldquo;{query}&rdquo;.</li>}
          {results.map((it, i) => (
            <li
              key={it.href}
              id={`search-${i}`}
              data-index={i}
              role="option"
              aria-selected={i === active}
              onMouseMove={() => setActive(i)}
              onClick={() => go(it)}
              className={`flex cursor-pointer items-baseline gap-3 rounded-lg px-3 py-2 ${i === active ? "bg-barrier" : ""}`}
            >
              <span className="min-w-0 flex-1">
                <span className="block text-[14px] text-chalk">{it.title}</span>
                <span className="block truncate text-[12px] text-smoke">{it.description}</span>
              </span>
              {/* on the highlight (barrier), only chalk and smoke text clear AA */}
              <span className={`shrink-0 text-[11px] ${i === active ? "text-smoke" : "text-ash"}`}>{it.section}</span>
            </li>
          ))}
        </ul>
        <div className="flex gap-4 border-t border-line px-4 py-2 font-mono text-[11px] text-ash">
          <span>↑↓ move</span>
          <span>↵ open</span>
          <span>esc close</span>
        </div>
      </div>
    </div>
  );
}
