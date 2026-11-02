import { ComponentDoc } from "@/components/docs/doc-page";
import { CitationChipDemo } from "./demo";

export const metadata = {
  title: "Citation Chip — Agent Pit Stop",
  description: "Inline sources on every claim, with the exact passage one tap away.",
};

export default function Page() {
  return (
    <ComponentDoc
      slug="citation-chip"
      intro="Search agents from Perplexity to Grok DeepSearch put numbered sources inline because a claim with nothing behind it should look different from one with evidence. Citation Chip sits right after the sentence it supports; the Source Drawer shows the passage the agent relied on. A source the agent couldn't reach says so, so the person knows which claims are unverified."
      chatPrompt="Which of these fares includes a carry-on?"
      preview={<CitationChipDemo />}
      sections={[
        {
          heading: "When to use",
          body: "Any factual claim that came from somewhere the person can't see: a web page, a file, a database row. Put the chip after the sentence, not at the end of the paragraph, so each claim carries its own evidence.",
        },
        {
          heading: "Behavior",
          body: "Tapping a chip opens the drawer on that source; tapping it again closes it. The drawer lists every source as chips so the person can move between them. Unreachable sources render with a dashed border and a caution line instead of a quote.",
        },
        {
          heading: "Usage",
          code: `import { CitationChip, SourceDrawer } from "@/components/citation-chip";

<p>
  Basic fares exclude a carry-on
  <CitationChip index={1} source={sources[0]} onOpen={setActive} />.
</p>
<SourceDrawer sources={sources} activeIndex={active} onClose={() => setActive(null)} />`,
        },
      ]}
    />
  );
}
