import { ComponentDoc } from "@/components/docs/doc-page";
import { ClarifyingQuestionDemo } from "./demo";

export const metadata = {
  title: "Clarifying Question — Agent Pit Stop",
  description: "The agent asks instead of guessing, with the likely answers ready to tap.",
};

export default function Page() {
  return (
    <ComponentDoc
      slug="clarifying-question"
      intro="Planning agents now ask before they build: Cursor's Plan Mode, deep-research tools and coding CLIs all open with a few targeted questions. Clarifying Question is that pause done well. The agent says why it is asking, offers the likely answers as one-tap options with number keys, leaves room for something else, and states what it will do if you skip."
      chatPrompt="Book me the cheapest nonstop to JFK on the 12th."
      preview={<ClarifyingQuestionDemo />}
      sections={[
        {
          heading: "When to use",
          body: "Only when the answer changes the outcome. If the agent can pick a sensible default and the person can easily change it later, it should proceed and say so. Ask one question at a time; a form of five questions is a survey, not a conversation.",
        },
        {
          heading: "Behavior",
          body: "Single choice answers on tap. Multi choice collects picks and continues on a button. Keys 1 to 9 pick options while the question is open. Once answered, the card folds to a line: the question and \"You chose ...\". With a fallback set, Skip appears and the folded line records the default taken.",
        },
        {
          heading: "Usage",
          code: `import { ClarifyingQuestion } from "@/components/clarifying-question";

<ClarifyingQuestion
  question="Which seat should I hold?"
  why="Seat choice decides which fare I book."
  options={[{ label: "Aisle" }, { label: "Window" }]}
  allowOther
  fallback="I'll pick the earlier flight"
  onAnswer={(a) => agent.reply(a)}
/>`,
        },
      ]}
    />
  );
}
