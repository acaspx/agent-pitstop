"use client";

import { useLayoutEffect, useRef, useState, type ReactNode } from "react";
import "./principle-lap.css";

/** Stage size shared by the five principle demos: the prose column, and a phone column. */
export const SIZE = { width: 672, height: 400, compact: { below: 560, width: 358, height: 400 } } as const;
export const REST = { wide: { x: 96, y: 372 }, compact: { x: 320, y: 372 } };

/**
 * Names buttons inside real registry components for the cursor, by their
 * visible text (and which match, when several share it). The components stay
 * untouched; the names are added after each render.
 */
export function Targets({ names, children }: { names: Record<string, { text: string; nth?: number }>; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    const root = ref.current;
    if (!root) return;
    const buttons = Array.from(root.querySelectorAll("button"));
    for (const [name, { text, nth = 0 }] of Object.entries(names)) {
      root.querySelectorAll(`[data-target="${name}"]`).forEach((el) => el.removeAttribute("data-target"));
      const hit = buttons.filter((b) => b.textContent?.trim().startsWith(text))[nth];
      hit?.setAttribute("data-target", name);
    }
  });
  return <div ref={ref}>{children}</div>;
}

/** The thread's last line, as the product draws it: filler, fading out with the crop. */
export function Composer() {
  return (
    <div className="pl-composer" aria-hidden>
      <span style={{ width: 160, height: 7, borderRadius: 4, background: "var(--color-line)" }} />
    </div>
  );
}

/** Host: the demo plus a Replay control that remounts it at the story boundary. */
export function Host({ label, children }: { label: string; children: (run: number) => ReactNode }) {
  const [run, setRun] = useState(0);
  return (
    <figure className="pl-host" aria-label={label}>
      {children(run)}
      <button type="button" className="pl-replay" onClick={() => setRun((n) => n + 1)}>
        <span aria-hidden>↻</span> Replay
      </button>
    </figure>
  );
}
