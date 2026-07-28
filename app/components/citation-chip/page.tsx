import { ComponentDoc } from "@/components/docs/doc-page";
import { CitationChipDemo } from "./demo";

export const metadata = {
  title: "Citation Chip — Agent Pit Stop",
  description: "A claim's basis, one tap away: the exact source passage, verbatim, with a link out.",
};

export default function Page() {
  return (
    <ComponentDoc
      slug="citation-chip"
      intro="Every RAG product rebuilds this primitive, and most get it wrong by linking to a whole document. The chip marks a cited claim inline; opening it reveals the exact passage supporting the claim, quoted verbatim, with the link out. Paraphrase is not evidence, and a source the agent couldn't retrieve renders honestly as unverified instead of as a naked claim."
      chatPrompt="How reliable is Jetline these days?"
      preview={<CitationChipDemo />}
      sections={[
        {
          heading: "When to use",
          body: "Any agent claim a user might act on: statistics, quotes, extracted facts, summarized positions. One chip per claim, placed at the claim, not footnoted at the bottom. Skip it for conversational filler; citing small talk is noise.",
        },
        {
          heading: "Behavior",
          body: "Closed, the chip shows the citation number and publisher. Open, it expands inline with the verbatim passage, retrieval time, and link. Sources without a supporting passage show an explicit unverified state. Works controlled or uncontrolled; tap targets meet 44px on touch.",
        },
        {
          heading: "Usage",
          code: `import { CitationChip } from "@/components/citation-chip";

<p>
  On-time rate improved to 92%
  <CitationChip
    n={1}
    source={{
      title: "DOT Air Travel Consumer Report",
      publisher: "transportation.gov",
      url: "https://...",
      quote: "…an on-time arrival rate of 92.1 percent…",
      retrieved: "2h ago",
    }}
  />
  .
</p>`,
        },
      ]}
    />
  );
}
