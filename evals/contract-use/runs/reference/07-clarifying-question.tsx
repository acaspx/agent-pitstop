import { ClarifyingQuestion } from "@/components/clarifying-question";

export default function Screen({ onAnswer, onSkip }: { onAnswer: (choice: string) => void; onSkip: () => void }) {
  return (
    <ClarifyingQuestion
      question="Which seat should I hold?"
      why="Two fares tie on price; the seat decides which one I book."
      options={[
        { label: "Aisle", detail: "United 1532" },
        { label: "Window", detail: "JetBlue 616" },
      ]}
      fallback="I'll take the earlier flight"
      onAnswer={([choice]) => onAnswer(choice!)}
      onSkip={onSkip}
    />
  );
}
