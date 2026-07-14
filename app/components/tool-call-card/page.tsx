import { ComponentDoc } from "@/components/docs/doc-page";
import { ToolCallCardDemo } from "./demo";

export const metadata = {
  title: "Tool Call Card — Agent Pit Stop",
  description: "Show an agent's tool use with legible, progressive disclosure.",
};

const cliVariant = (
  <pre className="font-mono text-[12px] leading-relaxed text-smoke">
    {`$ agent run "book my nyc trip"

▸ search_flights   Searching SFO → JFK, Aug 12    running 3s
  args: { from: "SFO", to: "JFK", nonstop: true }

  press [e] expand · [s] stop`}
  </pre>
);

export default function Page() {
  return (
    <ComponentDoc
      slug="tool-call-card"
      intro="The atomic unit of agent legibility. The tool name and a one-line human intent stay visible at all times; arguments and results are one tap away. State is never communicated by color alone, and failures keep the arguments on screen so a human can diagnose without re-running."
      chatPrompt="Find me a nonstop flight to New York on Aug 12."
      preview={<ToolCallCardDemo />}
      variants={{ cli: cliVariant }}
      sections={[
        {
          heading: "When to use",
          body: "Any time an agent calls a tool the user might want to verify: API requests, file operations, searches, code execution. Use one card per call, in execution order. If your agent makes dozens of rapid calls, group them under a collapsed parent rather than stacking cards.",
        },
        {
          heading: "Behavior",
          body: "Four states: queued, running (with elapsed time), done, failed. The card expands to show arguments and result. On failure the arguments stay attached to the error, because the wrong assumption usually lives in the inputs, not the stack trace.",
        },
        {
          heading: "Usage",
          code: `import { ToolCallCard } from "@/components/tool-call-card";

<ToolCallCard
  name="search_flights"
  intent="Searching SFO → JFK, Aug 12"
  state="running"
  elapsed={3}
  args={JSON.stringify(params, null, 2)}
/>`,
        },
      ]}
    />
  );
}
