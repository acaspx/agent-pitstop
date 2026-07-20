export type Format = "web" | "mobile" | "chat" | "cli" | "ide" | "extension" | "widget";

export interface ComponentEntry {
  slug: string;
  title: string;
  description: string;
  category: string;
  formats: Format[];
}

export interface PrincipleEntry {
  slug: string;
  title: string;
  status: "live" | "writing" | "planned";
}

export const principles: PrincipleEntry[] = [
  { slug: "legible-thinking", title: "Legible Thinking", status: "live" },
  { slug: "interruptibility", title: "Interruptibility", status: "live" },
  { slug: "delegation-contracts", title: "Delegation Contracts", status: "live" },
  { slug: "calibrated-trust", title: "Calibrated Trust", status: "live" },
  { slug: "graceful-failure", title: "Graceful Failure", status: "live" },
];

export const components: ComponentEntry[] = [
  {
    slug: "tool-call-card",
    title: "Tool Call Card",
    description: "Show an agent's tool use with legible, progressive disclosure.",
    category: "Legibility",
    formats: ["web", "mobile", "chat", "cli"],
  },
  {
    slug: "agent-task-list",
    title: "Agent Task List",
    description: "The agent's plan, made visible: pending, active, done, and failed.",
    category: "Legibility",
    formats: ["web", "mobile", "chat", "cli"],
  },
  {
    slug: "approval-gate",
    title: "Approval Gate",
    description: "Inline permission request with itemized scope.",
    category: "Control",
    formats: ["web", "mobile", "chat"],
  },
  {
    slug: "interrupt-bar",
    title: "Interrupt Bar",
    description: "The steering wheel and the brake for a running agent.",
    category: "Control",
    formats: ["web", "mobile", "chat"],
  },
  {
    slug: "confidence-meter",
    title: "Confidence Meter",
    description: "Honest uncertainty bands with a verification affordance.",
    category: "Trust",
    formats: ["web", "mobile", "chat"],
  },
  {
    slug: "agent-roster",
    title: "Agent Roster",
    description: "The team sheet for multi-agent runs: who's working, waiting, or blocked.",
    category: "Legibility",
    formats: ["web", "mobile", "chat"],
  },
  {
    slug: "agent-inbox",
    title: "Agent Inbox",
    description: "The review queue for background agents, ordered by what needs you most.",
    category: "Control",
    formats: ["web", "mobile"],
  },
  {
    slug: "context-budget",
    title: "Context Budget",
    description: "Tokens, spend, and time against their caps, in honest bands.",
    category: "Trust",
    formats: ["web", "mobile", "chat"],
  },
];

export const componentCategories = ["Legibility", "Control", "Trust"] as const;

export function componentsIn(category: string): ComponentEntry[] {
  return components.filter((c) => c.category === category);
}

export function adjacentComponents(slug: string): { prev?: ComponentEntry; next?: ComponentEntry } {
  const entry = components.find((c) => c.slug === slug);
  if (!entry) return {};
  const list = componentsIn(entry.category);
  const i = list.findIndex((c) => c.slug === slug);
  return { prev: list[i - 1], next: list[i + 1] };
}
