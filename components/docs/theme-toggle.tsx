"use client";

/**
 * ThemeToggle — docs chrome, not a registry component.
 * A two-up segmented control for previewing a component on either
 * surface. Labeled in words, per the system's own rule: never let a
 * state be readable by color alone.
 */

export type PreviewTheme = "dark" | "light";

export function ThemeToggle({
  value,
  onChange,
  className,
}: {
  value: PreviewTheme;
  onChange: (t: PreviewTheme) => void;
  className?: string;
}) {
  return (
    <div
      role="group"
      aria-label="Preview theme"
      className={`inline-flex shrink-0 overflow-hidden rounded-lg border border-line ${className ?? ""}`}
    >
      {(["dark", "light"] as const).map((t) => (
        <button
          key={t}
          type="button"
          onClick={() => onChange(t)}
          aria-pressed={value === t}
          className={`min-h-8 px-2.5 font-mono text-[10px] uppercase tracking-wide transition-colors pointer-coarse:min-h-11 ${
            value === t ? "bg-barrier text-chalk" : "text-ash hover:text-smoke"
          }`}
        >
          {t}
        </button>
      ))}
    </div>
  );
}
