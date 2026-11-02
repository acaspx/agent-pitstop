import { ComponentDoc } from "@/components/docs/doc-page";
import { DiffReviewCardDemo } from "./demo";

export const metadata = {
  title: "Diff Review Card — Agent Pit Stop",
  description: "Accept or reject an agent's proposed edits hunk by hunk.",
};

export default function Page() {
  return (
    <ComponentDoc
      slug="diff-review-card"
      intro="Every coding agent, from Cursor and Claude Code to Copilot's agent mode, converged on review before apply. Diff Review Card is that review in a portable shape: each hunk with a one-line why, accepted or rejected on its own, with a running count of what's decided. Nothing lands until someone says so."
      chatPrompt="Make the API client survive flaky networks."
      preview={<DiffReviewCardDemo />}
      sections={[
        {
          heading: "When to use",
          body: "Any agent change to something the person owns: code, a document, a config, a spreadsheet. If the change is large, split it into hunks with a reason each; a single wall of diff gets rubber-stamped.",
        },
        {
          heading: "Behavior",
          body: "Hunks start pending with Accept and Reject. A decision folds the buttons and labels the hunk. Rejected hunks dim and strike their added lines. Accept all appears while two or more hunks are pending. Works controlled (pass decisions) or uncontrolled.",
        },
        {
          heading: "Usage",
          code: `import { DiffReviewCard } from "@/components/diff-review-card";

<DiffReviewCard
  file="src/api/client.ts"
  hunks={[{ id: "retry", summary: "Retry once on timeout",
    removed: ["return fetch(url);"], added: ["return withRetry(() => fetch(url));"] }]}
  onDecide={(id, d) => d === "accepted" && apply(id)}
/>`,
        },
      ]}
    />
  );
}
