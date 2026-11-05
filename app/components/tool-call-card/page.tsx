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
          body: "Seven states: queued, running (with elapsed time), needs you, done, failed, denied and stopped. The card expands to show arguments and result, and opens on its own when a call fails or needs permission. On failure the arguments stay attached to the error, because the wrong assumption usually lives in the inputs, not the stack trace.",
        },
        {
          heading: "Approval inside the call",
          body: "When a call needs permission, set state to \"awaiting\" and pass `approval`: the question, and a sentence on what allowing does. Deny and Allow appear inside the card, Deny first and quiet, because saying no loses nothing. When the person refuses, move the card to \"denied\", not \"error\": a refusal is their choice, not a failure, so it reads grey, never red. Use this for permission on one call; for a decision about a whole action with itemized scope, use Approval Gate.",
          code: `<ToolCallCard
  name="charge_card"
  intent="Booking TAP 202 for $612"
  state={state}            // "awaiting" → "running" or "denied"
  args={JSON.stringify(params, null, 2)}
  approval={{
    question: "Charge $612 to the Visa ending 4242?",
    consequence: "Nonrefundable. The fare is booked at once.",
  }}
  onAllow={() => setState("running")}
  onDeny={() => setState("denied")}
/>`,
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
