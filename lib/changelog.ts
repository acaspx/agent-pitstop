/**
 * The changelog, month by month: one source for the /changelog page and
 * /changelog.md. Newest month first. Each entry names what changed, links to
 * its page when it has one, and cites the commits or PRs it came from.
 *
 * Writing rules: present tense, what the reader gets, one or two sentences.
 * Wrap identifiers in backticks. No em dashes.
 */

export type Ref = { pr: number } | { commit: string };

export interface ChangeEntry {
  title: string;
  /** Docs page for the thing that changed, if it has one */
  href?: string;
  refs?: Ref[];
  body: string;
  /** Breaking changes only: the before and after, shown as a diff */
  migration?: { before: string; after: string };
}

export interface ChangeMonth {
  /** yyyy-mm, used as the anchor */
  id: string;
  label: string;
  /** Released version this month, if any */
  version?: string;
  headline: string;
  summary: string;
  added?: ChangeEntry[];
  breaking?: ChangeEntry[];
  updated?: ChangeEntry[];
}

export const REPO = "https://github.com/acaspx/agent-pitstop";

export function refHref(ref: Ref) {
  return "pr" in ref ? `${REPO}/pull/${ref.pr}` : `${REPO}/commit/${ref.commit}`;
}

export function refLabel(ref: Ref) {
  return "pr" in ref ? `#${ref.pr}` : ref.commit;
}

export const changelog: ChangeMonth[] = [
  {
    id: "2026-11",
    label: "November 2026",
    headline: "One pit stop, shown in a real product, and this changelog",
    summary: "The landing page now opens on the system at work. Nothing needs a migration.",
    added: [
      {
        title: "Landing demo",
        href: "/",
        refs: [{ commit: "919c781" }],
        body: "One pit stop in a believable travel app, built from Tool Call Card, Approval Gate and Agent Task List. The agent holds a seat, stops at the booking, and waits for Approve; it plays once in view and replays on demand. Built with Stageshow.",
      },
      {
        title: "Changelog",
        href: "/changelog",
        body: "Every change, month by month, with the commits behind it. Also served as Markdown at `/changelog.md` for agents and feeds.",
      },
    ],
  },
  {
    id: "2026-07",
    label: "July 2026",
    version: "0.1.0",
    headline: "v0.1.0: five principles, eight components, and a contract agents can read",
    summary: "The first release, built in the open over three weeks. Nothing needs a migration.",
    added: [
      {
        title: "Tool Call Card",
        href: "/components/tool-call-card",
        refs: [{ commit: "ac8f67c" }],
        body: "A tool call people can read: its name, the intent in plain language, and its state in words, with arguments and results one tap away.",
      },
      {
        title: "Approval Gate",
        href: "/components/approval-gate",
        refs: [{ commit: "ac8f67c" }],
        body: "An inline permission request. Scope is itemized before consent, the irreversible part is marked, and Deny is as easy as Approve. After the decision it folds to a receipt.",
      },
      {
        title: "Agent Task List",
        href: "/components/agent-task-list",
        refs: [{ commit: "ac8f67c" }],
        body: "The agent's plan made visible as pending, active, done and failed, with a live detail line on the step in progress.",
      },
      {
        title: "Interrupt Bar",
        href: "/components/interrupt-bar",
        refs: [{ pr: 1 }],
        body: "The steering wheel and the brake for a running agent. Stop keeps the work done so far, and steering is acknowledged before it applies.",
      },
      {
        title: "Confidence Meter",
        href: "/components/confidence-meter",
        refs: [{ pr: 6 }],
        body: "Confidence as a band, never a decimal, with what it rests on and a verify action that comes forward below the `threshold`.",
      },
      {
        title: "Agent Inbox, Agent Roster, Context Budget",
        href: "/components",
        refs: [{ pr: 10 }],
        body: "A review queue for background agents ordered by what needs you most, a team sheet for multi-agent runs, and tokens, spend and time against their caps.",
      },
      {
        title: "Principles",
        href: "/principles",
        refs: [{ pr: 1 }, { pr: 6 }],
        body: "Five argued chapters with live demos: Legible Thinking, Interruptibility, Delegation Contracts, Calibrated Trust and Graceful Failure.",
      },
      {
        title: "The Full Lap",
        href: "/full-lap",
        refs: [{ pr: 15 }],
        body: "Every component driven through one scripted agent run. The stop button really stops it, and nothing books until you say so.",
      },
      {
        title: "Agent contract",
        href: "/how-it-works",
        refs: [{ pr: 17 }],
        body: "`/r/contract.json`, generated from component source at build time: props, principle tags and five behavioral guarantees, with `llms.txt` and a registry index beside it.",
      },
      {
        title: "How it works",
        href: "/how-it-works",
        refs: [{ pr: 7 }],
        body: "The problem the system was built for, the loop it is designed around, and what it is made of.",
      },
    ],
    updated: [
      {
        title: "All components",
        refs: [{ pr: 14 }],
        body: "`className` passes through to every root, so a component restyles without edits, and every touch target is at least 44px.",
      },
      {
        title: "Theming",
        refs: [{ pr: 18 }],
        body: "A light token set beside the dark one, both checked to 4.5:1 contrast, and a dark and light toggle on every gallery card and preview.",
      },
      {
        title: "Guarantees in CI",
        refs: [{ pr: 18 }],
        body: "Interaction tests assert the contract's guarantees: stop preserves work, nothing irreversible without consent, bands not decimals, failures keep their inputs, states never by color alone. They run on every PR.",
      },
      {
        title: "Headlights",
        href: "/principles",
        refs: [{ pr: 16 }],
        body: "Pit-lane orange becomes the one lit color, with the headlights language: one bright thing per surface, the past dimmed, the present lit, the future outlined.",
      },
      {
        title: "Accessibility",
        refs: [{ pr: 10 }],
        body: "Text contrast, visible focus, a phone navigation bar and highlighted code across the docs.",
      },
      {
        title: "Docs",
        href: "/components",
        refs: [{ pr: 2 }, { pr: 3 }],
        body: "Sidebar navigation, two-pane component pages, a platform preview toggle and a gallery, with the checkered flag mark across the site.",
      },
    ],
  },
];

/** The same changelog as Markdown, for /changelog.md. */
export function changelogMarkdown(site: string) {
  const lines: string[] = [
    "# Changelog",
    "",
    "Every change to Agent Pit Stop, month by month. Versions follow semver.",
    "",
  ];
  const section = (name: string, entries?: ChangeEntry[]) => {
    if (!entries?.length) return;
    lines.push(`### ${name}`, "");
    for (const e of entries) {
      const title = e.href ? `[${e.title}](${site}${e.href})` : e.title;
      const refs = e.refs?.length ? ` (${e.refs.map((r) => `[${refLabel(r)}](${refHref(r)})`).join(", ")})` : "";
      lines.push(`- **${title}**${refs}: ${e.body}`);
      if (e.migration) lines.push("", "  ```diff", `  - ${e.migration.before}`, `  + ${e.migration.after}`, "  ```");
    }
    lines.push("");
  };
  for (const m of changelog) {
    lines.push(`## ${m.label}${m.version ? ` (v${m.version})` : ""}`, "", `**${m.headline}**`, "", m.summary, "");
    section("New", m.added);
    section("Breaking", m.breaking);
    section("Updated", m.updated);
  }
  return lines.join("\n");
}
