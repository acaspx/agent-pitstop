import { ClarifyingQuestion, type ClarifyingOption } from "@/components/clarifying-question";

const options: ClarifyingOption[] = [
  {
    label: "Aisle on United 1532",
    detail: "I'll hold an aisle seat and book United 1532.",
  },
  {
    label: "Window on JetBlue 616",
    detail: "I'll hold a window seat and book JetBlue 616.",
  },
];

export default function Screen({
  onAnswer,
  onSkip,
}: {
  onAnswer: (choice: string) => void;
  onSkip: () => void;
}) {
  return (
    <div className="mx-auto w-full max-w-xl p-4">
      <ClarifyingQuestion
        question="Which seat should I hold before I book?"
        why="United 1532 and JetBlue 616 cost the same, so your seat decides which flight I book."
        options={options}
        fallback="I'll take the earlier flight"
        onAnswer={(answer) => {
          const choice = answer[0];
          if (choice) onAnswer(choice);
        }}
        onSkip={onSkip}
      />
    </div>
  );
}
