import Link from "next/link";
import { DocsShell } from "@/components/docs/docs-shell";
import { changelog, refHref, refLabel, REPO, type ChangeEntry } from "@/lib/changelog";

export const metadata = {
  title: "Changelog — Agent Pit Stop",
  description: "Every change to Agent Pit Stop, month by month, with the commits behind it.",
};

/** Body text with `backticks` set as inline code. */
function Prose({ text }: { text: string }) {
  return (
    <>
      {text.split(/(`[^`]+`)/g).map((part, i) =>
        part.startsWith("`") ? (
          <code key={i} className="rounded bg-barrier px-1 py-px font-mono text-[12.5px] text-chalk">
            {part.slice(1, -1)}
          </code>
        ) : (
          part
        ),
      )}
    </>
  );
}

function Entry({ e }: { e: ChangeEntry }) {
  return (
    <li className="py-4">
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1.5">
        <h4 className="text-[15px] font-medium text-chalk">
          {e.href ? (
            <Link href={e.href} className="hover:text-pit">
              {e.title}
            </Link>
          ) : (
            e.title
          )}
        </h4>
        {e.refs && (
          <span className="flex flex-wrap gap-1.5">
            {e.refs.map((r) => (
              <a
                key={refLabel(r)}
                href={refHref(r)}
                className="rounded border border-line px-1.5 py-px font-mono text-[11px] text-ash transition-colors hover:border-ash hover:text-chalk"
              >
                {refLabel(r)}
              </a>
            ))}
          </span>
        )}
      </div>
      <p className="mt-1.5 max-w-prose text-[14px] leading-relaxed text-smoke">
        <Prose text={e.body} />
      </p>
      {e.migration && (
        <pre className="mt-3 overflow-x-auto rounded-lg border border-line bg-carbon p-3 font-mono text-[12.5px] leading-relaxed">
          <span className="block text-flag">- {e.migration.before}</span>
          <span className="block text-signal">+ {e.migration.after}</span>
        </pre>
      )}
    </li>
  );
}

function Group({ name, entries, tone }: { name: string; entries?: ChangeEntry[]; tone: string }) {
  if (!entries?.length) return null;
  return (
    <div className="mt-8">
      <div className="flex items-center gap-2 border-b border-line pb-2">
        <span className={`font-mono text-[11px] font-medium uppercase tracking-[0.18em] ${tone}`}>{name}</span>
        <span className="rounded-full bg-barrier px-1.5 font-mono text-[11px] text-smoke">{entries.length}</span>
      </div>
      <ul className="divide-y divide-line/60">
        {entries.map((e) => (
          <Entry key={e.title} e={e} />
        ))}
      </ul>
    </div>
  );
}

export default function ChangelogPage() {
  return (
    <DocsShell>
      <main className="max-w-2xl">
        <div className="text-[11px] font-medium uppercase tracking-wide text-ash">About · Releases</div>
        <h1 className="mt-2 font-mono text-2xl font-semibold tracking-tight text-chalk">Changelog</h1>
        <p className="mt-3 text-[15px] leading-relaxed text-smoke">
          Every change, month by month, with the commits behind it.
        </p>
        <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 font-mono text-[12px] tracking-wide">
          <a href="/changelog.md" className="text-pit hover:underline">
            View as Markdown
          </a>
          <a href={`${REPO}/commits/main`} className="text-smoke hover:text-chalk">
            All commits on GitHub ↗
          </a>
        </div>

        {changelog.map((m) => (
          <section key={m.id} id={m.id} className="mt-16 scroll-mt-12">
            <h2 className="flex items-center gap-3">
              <a href={`#${m.id}`} className="font-mono text-[13px] uppercase tracking-[0.2em] text-ash hover:text-chalk">
                {m.label}
              </a>
              {m.version && (
                <span className="rounded bg-pit px-1.5 py-px font-mono text-[11px] font-medium text-track">
                  v{m.version}
                </span>
              )}
            </h2>
            <h3 className="mt-3 text-balance text-[20px] font-semibold leading-snug tracking-tight text-chalk">
              {m.headline}
            </h3>
            <p className="mt-2 text-[14.5px] leading-relaxed text-smoke">{m.summary}</p>
            <Group name="New" entries={m.added} tone="text-signal" />
            <Group name="Breaking" entries={m.breaking} tone="text-flag" />
            <Group name="Updated" entries={m.updated} tone="text-pit" />
          </section>
        ))}
      </main>
    </DocsShell>
  );
}
