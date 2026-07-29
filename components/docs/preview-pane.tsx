"use client";

/**
 * PreviewPane — sticky live preview with a platform toggle.
 * Formats render the same component inside different contexts:
 * web (canvas), mobile (device frame), chat (transcript), cli (terminal).
 * Pass `variants` to override the rendering for a specific format
 * (e.g. a text-based CLI rendering). Icons only show for formats
 * a component actually supports.
 */

import { useState, type ReactNode } from "react";
import type { Format } from "@/lib/nav";

const formatMeta: Record<Format, { label: string; icon: ReactNode }> = {
  web: {
    label: "Web",
    icon: (
      <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3">
        <rect x="1.5" y="2.5" width="13" height="9" rx="1.5" />
        <path d="M5.5 14.5h5M8 11.5v3" />
      </svg>
    ),
  },
  mobile: {
    label: "Mobile",
    icon: (
      <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3">
        <rect x="4.5" y="1.5" width="7" height="13" rx="1.5" />
        <path d="M7 12.5h2" strokeLinecap="round" />
      </svg>
    ),
  },
  chat: {
    label: "Chat",
    icon: (
      <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3">
        <path d="M14.5 8a6.5 6.5 0 1 1-2.2-4.9L14.5 2.5l-.6 3A6.47 6.47 0 0 1 14.5 8Z" transform="rotate(180 8 8)" />
      </svg>
    ),
  },
  cli: {
    label: "CLI",
    icon: (
      <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3">
        <rect x="1.5" y="2.5" width="13" height="11" rx="1.5" />
        <path d="M4.5 6l2.5 2-2.5 2M8.5 10.5h3" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  ide: {
    label: "IDE",
    icon: (
      <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3">
        <path d="M5.5 4.5L2 8l3.5 3.5M10.5 4.5L14 8l-3.5 3.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  extension: {
    label: "Extension",
    icon: (
      <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3">
        <path d="M6.5 2.5h3v3h3v3h-3v3h-3v-3h-3v-3h3v-3Z" strokeLinejoin="round" />
      </svg>
    ),
  },
  widget: {
    label: "Widget",
    icon: (
      <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3">
        <rect x="1.5" y="1.5" width="5.5" height="5.5" rx="1" />
        <rect x="9" y="1.5" width="5.5" height="5.5" rx="1" />
        <rect x="1.5" y="9" width="5.5" height="5.5" rx="1" />
        <rect x="9" y="9" width="5.5" height="5.5" rx="1" />
      </svg>
    ),
  },
};

export interface PreviewPaneProps {
  formats: Format[];
  children: ReactNode;
  /** Optional per-format rendering override */
  variants?: Partial<Record<Format, ReactNode>>;
  /** Example user message for chat context */
  chatPrompt?: string;
}

export function PreviewPane({ formats, children, variants, chatPrompt }: PreviewPaneProps) {
  const [format, setFormat] = useState<Format>(formats[0] ?? "web");
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const content = variants?.[format] ?? children;

  return (
    <div>
      <div className="mb-2 flex items-center justify-end gap-1">
        <button
          type="button"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          title={theme === "dark" ? "Preview light theme" : "Preview dark theme"}
          aria-label={theme === "dark" ? "Preview light theme" : "Preview dark theme"}
          aria-pressed={theme === "light"}
          className="mr-1 flex h-7 w-7 items-center justify-center rounded-md border border-transparent text-ash transition-colors hover:text-smoke"
        >
          {theme === "dark" ? (
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3">
              <circle cx="8" cy="8" r="3.2" />
              <path d="M8 1.5v1.8M8 12.7v1.8M1.5 8h1.8M12.7 8h1.8M3.4 3.4l1.3 1.3M11.3 11.3l1.3 1.3M12.6 3.4l-1.3 1.3M4.7 11.3l-1.3 1.3" strokeLinecap="round" />
            </svg>
          ) : (
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3">
              <path d="M13.5 9.5A6 6 0 1 1 6.5 2.5a4.8 4.8 0 0 0 7 7Z" strokeLinejoin="round" />
            </svg>
          )}
        </button>
        {formats.map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFormat(f)}
            title={formatMeta[f].label}
            aria-label={`Preview in ${formatMeta[f].label}`}
            aria-pressed={format === f}
            className={`flex h-7 w-7 items-center justify-center rounded-md border transition-colors ${
              format === f
                ? "border-line bg-barrier text-chalk"
                : "border-transparent text-ash hover:text-smoke"
            }`}
          >
            {formatMeta[f].icon}
          </button>
        ))}
      </div>

      <div data-theme={theme === "light" ? "light" : undefined} className="rounded-3xl border border-line bg-carbon bg-dots p-6 transition-colors duration-300">
        {format === "mobile" ? (
          <div className="mx-auto w-[300px] rounded-[2rem] border border-line bg-track p-3 pt-6 shadow-2xl">
            <div className="mx-auto mb-3 h-1.5 w-16 rounded-full bg-barrier" aria-hidden />
            <div className="[&_*]:!text-[12px] [&_pre]:!text-[10px]">{content}</div>
            <div className="mx-auto mt-4 h-1 w-24 rounded-full bg-barrier" aria-hidden />
          </div>
        ) : format === "chat" ? (
          <div className="space-y-3">
            <div className="flex justify-end">
              <div className="max-w-[75%] rounded-2xl rounded-br-md bg-barrier px-3.5 py-2 text-[13px] text-chalk">
                {chatPrompt ?? "Find me a nonstop flight to New York on Aug 12."}
              </div>
            </div>
            <div className="flex items-start gap-2.5">
              <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-pit/20 font-mono text-[9px] text-pit">
                AI
              </span>
              <div className="min-w-0 flex-1">{content}</div>
            </div>
          </div>
        ) : format === "cli" ? (
          <div className="overflow-hidden rounded-lg border border-line bg-track">
            <div className="flex items-center gap-1.5 border-b border-line px-3 py-2">
              <span className="h-2 w-2 rounded-full bg-line" />
              <span className="h-2 w-2 rounded-full bg-line" />
              <span className="h-2 w-2 rounded-full bg-line" />
            </div>
            <div className="p-4">{content}</div>
          </div>
        ) : (
          <div>{content}</div>
        )}
      </div>
    </div>
  );
}
