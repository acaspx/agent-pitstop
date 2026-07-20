"use client";

import { useMemo, useState } from "react";

/**
 * Lightweight syntax highlighting: strings, comments, keywords, and
 * numbers get token colors; everything else stays smoke. No dependencies,
 * safe output (renders via React text nodes, never innerHTML).
 */

const KEYWORDS = new Set([
  "import", "from", "export", "default", "const", "let", "var", "function",
  "return", "if", "else", "type", "interface", "extends", "true", "false",
  "null", "undefined", "new", "async", "await", "npx", "npm", "git",
]);

type Token = { text: string; kind: "plain" | "string" | "comment" | "keyword" | "number" };

function tokenize(code: string): Token[] {
  const tokens: Token[] = [];
  const re = /("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`)|(\/\/[^\n]*|\/\*[\s\S]*?\*\/|#[^\n]*)|\b(\d+(?:\.\d+)?)\b|([A-Za-z_$][\w$]*)|([\s\S])/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(code)) !== null) {
    const [, str, comment, num, word, other] = m;
    if (str !== undefined) tokens.push({ text: str, kind: "string" });
    else if (comment !== undefined) tokens.push({ text: comment, kind: "comment" });
    else if (num !== undefined) tokens.push({ text: num, kind: "number" });
    else if (word !== undefined)
      tokens.push({ text: word, kind: KEYWORDS.has(word) ? "keyword" : "plain" });
    else tokens.push({ text: other ?? "", kind: "plain" });
  }
  return tokens;
}

const kindClass: Record<Token["kind"], string> = {
  plain: "",
  string: "text-signal",
  comment: "text-ash italic",
  keyword: "text-pit",
  number: "text-caution",
};

export function CodeBlock({ code, title }: { code: string; title?: string }) {
  const [copied, setCopied] = useState(false);
  const tokens = useMemo(() => tokenize(code), [code]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      /* clipboard unavailable */
    }
  };

  return (
    <div className="overflow-hidden rounded-xl border border-line bg-asphalt">
      <div className="flex items-center justify-between border-b border-line px-4">
        <span className="font-mono text-[11px] text-ash">{title ?? "tsx"}</span>
        <button
          type="button"
          onClick={copy}
          aria-label="Copy code"
          className="flex min-h-9 items-center px-1 text-[11px] font-medium text-smoke transition-colors hover:text-chalk pointer-coarse:min-h-11"
        >
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <pre className="overflow-x-auto p-4 font-mono text-[12.5px] leading-relaxed text-smoke">
        {tokens.map((t, i) => (
          <span key={i} className={kindClass[t.kind]}>
            {t.text}
          </span>
        ))}
      </pre>
    </div>
  );
}
