import type { ComponentProps } from "react";
import { ClarifyingQuestion } from "@/components/ui/clarifying-question";

type Option = ComponentProps<typeof ClarifyingQuestion>["options"][number];

const OPTIONS: Option[] = [
  { label: "Aisle on United 1532" },
  { label: "Window on JetBlue 616" },
];

export default function Screen({
  onAnswer,
  onSkip,
}: {
  onAnswer: (choice: string) => void;
  onSkip: () => void;
}) {
  return (
    <main className="mx-auto w-full max-w-xl p-6">
      <ClarifyingQuestion
        question="Which seat should I hold before I book?"
        why="Both fares are the same price, so your seat is the tiebreaker."
        options={OPTIONS}
        fallback="I'll take the earlier of the two flights."
        onAnswer={(answer) => {
          const choice = answer[0];
          if (choice) onAnswer(choice);
        }}
        onSkip={onSkip}
      />
    </main>
  );
}
