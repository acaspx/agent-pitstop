import { ComponentDoc } from "@/components/docs/doc-page";
import { ReasoningTraceDemo } from "./demo";

export const metadata = {
  title: "Reasoning Trace — Agent Pit Stop",
  description: "The agent's thinking as steps you can follow, folded to one line when it's done.",
};

export default function Page() {
  return (
    <ComponentDoc
      slug="reasoning-trace"
      intro="Reasoning products from Vercel's AI Elements to Grok's Think mode all land on the same shape: thinking shown while it happens, folded once the answer arrives. Reasoning Trace writes each step as an action with what it found, attaches the sources a step used, and keeps the folded summary in the thread so the work behind an answer is never more than a click away."
      chatPrompt="Which nonstop SFO to JFK fare on Aug 12 is cheapest once bags are included?"
      preview={<ReasoningTraceDemo />}
      sections={[
        {
          heading: "When to use",
          body: "Any answer that took more than a few seconds or more than one lookup. Skip it for instant replies; a trace with one step is noise. Write steps as actions, not raw model tokens: \"Checking baggage rules\" is legible, a paragraph of chain of thought is not.",
        },
        {
          heading: "Behavior",
          body: "Open while streaming, with the active step pulsing and a count of steps done. When streaming ends it folds to \"Thought for Ns · N steps\". The person can reopen or fold it at any time. Step sources render as small chips under the step that used them.",
        },
        {
          heading: "Usage",
          code: `import { ReasoningTrace } from "@/components/reasoning-trace";

<ReasoningTrace
  streaming={isStreaming}
  seconds={5}
  steps={[
    { label: "Searching fare tables", status: "done", sources: ["united.com"] },
    { label: "Checking baggage rules", status: "active" },
    { label: "Comparing total cost", status: "pending" },
  ]}
/>`,
        },
      ]}
    />
  );
}
