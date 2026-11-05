import { ComponentDoc } from "@/components/docs/doc-page";
import { QuestionFlowDemo } from "./demo";

export const metadata = {
  title: "Question Flow — Agent Pit Stop",
  description: "A few questions before the run, one at a time, reviewed and sent together.",
};

export default function Page() {
  return (
    <ComponentDoc
      slug="question-flow"
      intro="When the agent needs more than one answer before it starts, ask them as a short flow: one question at a time, each saying why it matters, then a review of every answer before anything is sent. The answers are the brief for the run, so the person signs off on all of them together, and can change any one first."
      chatPrompt="Book me the cheapest nonstop to JFK on the 12th."
      preview={<QuestionFlowDemo />}
      sections={[
        {
          heading: "When to use",
          body: "Two to four questions that each change the outcome. For one question, use Clarifying Question. If the agent can pick a sensible default, give it as `fallback` so the question can be skipped.",
        },
        {
          heading: "Behavior",
          body: "Picking an option (or pressing its number) moves to the next question. Back steps back. After the last, a review lists every answer with Change. Send answers calls onComplete once with an answer per id, or null where the person skipped and the fallback applies.",
        },
        {
          heading: "Usage",
          code: `import { QuestionFlow } from "@/components/question-flow";

<QuestionFlow
  questions={[
    { id: "seat", question: "Which seat should I hold?",
      options: [{ label: "Aisle" }, { label: "Window" }],
      fallback: "I'll take the earlier flight" },
    { id: "bag", question: "Are you checking a bag?",
      options: [{ label: "Carry-on only" }, { label: "One checked bag" }] },
  ]}
  onComplete={(answers) => agent.start(answers)}
/>`,
        },
      ]}
    />
  );
}
