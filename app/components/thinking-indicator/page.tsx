import { ComponentDoc } from "@/components/docs/doc-page";
import { ThinkingIndicatorDemo } from "./demo";

export const metadata = {
  title: "Thinking Indicator — Agent Pit Stop",
  description: "One line that says what the agent is doing right now, and for how long.",
};

export default function Page() {
  return (
    <ComponentDoc
      slug="thinking-indicator"
      intro="The smallest honest signal that work is happening. Not three dots and a shrug: what the agent is doing now, in words, with a real clock beside it. It folds to “Thought for 6s” when the answer lands. Use it where a full Reasoning Trace would be too much, like a chat reply still on its way."
      chatPrompt="Is the cheapest fare still cheapest with a carry-on?"
      preview={<ThinkingIndicatorDemo />}
      sections={[
        {
          heading: "When to use",
          body: "Short waits inside a conversation or a field. For multi-step work the person may want to check, use Reasoning Trace; for a run they may need to stop, add an Interrupt Bar.",
        },
        {
          heading: "Behavior",
          body: "thinking: bouncing dots, the label, the current step and the seconds so far. done: “Thought for Ns”. The seconds are hidden from screen readers so they don't announce every tick; the step is announced when it changes.",
        },
        {
          heading: "Usage",
          code: `import { ThinkingIndicator } from "@/components/thinking-indicator";

<ThinkingIndicator
  detail="Checking carry-on rules"
  elapsed={seconds}
  state={answer ? "done" : "thinking"}
/>`,
        },
      ]}
    />
  );
}
