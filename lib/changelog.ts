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
    headline: "Eight new components, a live showcase, and every principle shown in a product",
    summary:
      "The system doubles to 16 components, drawn from how Vercel, Cursor, OpenAI, Grok and Meta now ship agents. Every component is live on the showcase, and every principle opens on a short demo of it at work. Nothing needs a migration.",
    added: [
      {
        title: "Approval inside a tool call",
        href: "/components/tool-call-card",
        body: "Tool Call Card gains three states: `awaiting` (Needs you), `denied` and `stopped`. A waiting call asks inside its own card, with what allowing does, Deny first and quiet. A refusal reads as Denied, grey, never as a failure. Failures and questions now open the card on their own.",
      },
      {
        title: "Thinking Indicator",
        href: "/components/thinking-indicator",
        body: "One line that says what the agent is doing right now and for how long, folding to \"Thought for Ns\". For short waits where a Reasoning Trace is too much.",
      },
      {
        title: "Question Flow",
        href: "/components/question-flow",
        body: "Two to four questions before a run, one at a time, each skippable when the agent has a default, then a review of every answer, sent together.",
      },
      {
        title: "States grid, ⌘K search, radius and density",
        href: "/components",
        body: "Every component page now shows all its states side by side. ⌘K (or /) searches components, principles, evals and pages. Make them yours adds radius and density, and Copy CSS gives you the overrides. Compact density never shrinks touch targets on a touch screen.",
      },
      {
        title: "Reasoning Trace",
        href: "/components/reasoning-trace",
        body: "The agent's thinking as steps you can follow: open while it works, folded to \"Thought for Ns\" when it's done, with the sources each step used.",
      },
      {
        title: "Citation Chip and Source Drawer",
        href: "/components/citation-chip",
        body: "Inline numbered sources on each claim. The drawer shows the exact passage relied on; a source the agent couldn't reach says so.",
      },
      {
        title: "Plan Review",
        href: "/components/plan-review",
        body: "The plan before the run. Drop or reword steps, see risky ones marked, and approve. Nothing starts until you do.",
      },
      {
        title: "Clarifying Question",
        href: "/components/clarifying-question",
        body: "The agent asks instead of guessing: one question, tappable answers with number keys, room for your own, and a stated default if you skip.",
      },
      {
        title: "Diff Review Card",
        href: "/components/diff-review-card",
        body: "Accept or reject an agent's edits hunk by hunk, each with a one-line reason.",
      },
      {
        title: "Takeover Banner",
        href: "/components/takeover-banner",
        body: "Who has the wheel when an agent drives a browser, with a one-click handoff each way and a privacy note while you drive.",
      },
      {
        title: "Checkpoint",
        href: "/components/checkpoint",
        body: "Save points for a run. Restore asks once, inline, and names what it will undo.",
      },
      {
        title: "Memory Panel",
        href: "/components/memory-panel",
        body: "What the agent remembers, where it learned it, and Forget with a few seconds of Undo. Remembering pauses with one switch.",
      },
      {
        title: "Live showcase",
        href: "/components",
        body: "Every component, interactive, in one masonry of tiles. Re-theme them all at once with Make them yours: dark or light, and four accents. The landing shows six.",
      },
      {
        title: "Principle demos",
        href: "/principles/legible-thinking",
        body: "Each of the five principles opens on a short Stageshow demo in a believable product: a cited research answer, a stopped search, an edited plan, a checked invoice, and a restored checkpoint.",
      },
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
    updated: [
      {
        title: "Evals, and a tighter contract",
        href: "/evals/contract-use",
        body: "A new Evals section. The first eval gives ten product requests to fresh agents that see only the contract, then compiles and drives what they write against the real components. Baseline: 0/10 screens fully correct (73% of checks). The contract never said where components install, named types like `DiffHunk` without defining them, and hid second components like `SourceDrawer`. The generator now emits each component's import line, every exported type, and every component in the file, and the registry pins the install path. Rerun: 10/10 (100%). Rerun it with `npm run eval -- v2`.",
      },
      {
        title: "Accessibility, in the contract",
        href: "https://github.com/acaspx/agent-pitstop/blob/main/docs/accessibility.md",
        body: "Every component now states its keyboard, screen-reader and motion behavior, and what the host must do, in its header. The build publishes it to `contract.json` (the `a` field), the registry items and each doc page. Two new guarantees: focus is never dropped, and looping motion stops under reduced motion. CI runs axe over every component state and checks token contrast in both themes.",
      },
      {
        title: "Fixes from the accessibility pass",
        body: "Task and reasoning steps read their status to screen readers. Approval Gate and Interrupt Bar move focus to their receipt and announce it. Checkpoint focuses its confirm, and Escape backs out. Diff Review and Plan Review buttons name their hunk or step. Clarifying Question uses plain buttons instead of radios that ignored arrow keys. The Source Drawer closes on Escape.",
      },
      {
        title: "Components page",
        href: "/components",
        body: "The static preview gallery is replaced by the live showcase, with a compact index by category underneath.",
      },
      {
        title: "Checkpoint and Plan Review are controllable",
        body: "Checkpoint takes `confirming`, and Plan Review takes `dropped`, so a host can drive them. Both stay uncontrolled by default.",
      },
      {
        title: "Guarantee tests",
        body: "Seven more tests cover the new components: review before apply, plans that run only as approved, undoable forgetting, and take-over always on offer.",
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
