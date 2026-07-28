import { ComponentDoc } from "@/components/docs/doc-page";
import { DiffReviewCardDemo } from "./demo";

export const metadata = {
  title: "Diff Review Card — Agent Pit Stop",
  description: "The approval gate for edits: old against new, accepted or rejected per hunk, nothing applied until the human says so.",
};

export default function Page() {
  return (
    <ComponentDoc
      slug="diff-review-card"
      intro="When an agent edits something you own, a bundled yes is not consent. The card shows exactly what would change, old against new, and collects a decision per hunk. Applying is a separate, explicit act, and the receipt records what was declined alongside what landed. It's the pattern behind coding-agent workflows, built here for any content: docs, records, copy."
      chatPrompt="Tighten up the pricing page copy."
      preview={<DiffReviewCardDemo />}
      sections={[
        {
          heading: "When to use",
          body: "Any agent-proposed change to content the user owns: documents, CRM records, configuration, marketing copy, code. Skip it for content the agent owns outright; reviewing an agent's private scratchpad is ceremony.",
        },
        {
          heading: "Behavior",
          body: "Each hunk shows removals and additions marked by glyph and label, never color alone. Decisions toggle, decided hunks dim per the headlights language, and Apply stays disabled until every hunk is decided with at least one acceptance. After applying, the card collapses to a receipt that includes rejections.",
        },
        {
          heading: "Usage",
          code: `import { DiffReviewCard } from "@/components/diff-review-card";

<DiffReviewCard
  title="Tighten the pricing page copy"
  target="pricing.md"
  hunks={[
    {
      id: "h1",
      label: "Hero headline",
      before: ["Powerful plans for teams of every size"],
      after: ["Plans that scale with your team"],
    },
  ]}
  onApply={(decisions) => applyAccepted(decisions)}
/>`,
        },
      ]}
    />
  );
}
