import { useRef } from "react";
import { PlanReview, type PlanStep } from "@/components/ui/plan-review";

const steps: PlanStep[] = [
  { title: "Read the billing client" },
  { title: "Swap charge() for createPayment()" },
  { title: "Run the migration on the staging database", risky: true },
  { title: "Open a pull request" },
];

export default function Screen({ onRun }: { onRun: (stepTitles: string[]) => void }) {
  const ran = useRef(false);

  function handleApprove(approved: PlanStep[]) {
    if (ran.current) return;
    ran.current = true;
    onRun(approved.map((step) => step.title));
  }

  return (
    <main className="mx-auto max-w-2xl p-6">
      <PlanReview
        goal="Migrate billing to the v2 payments API"
        steps={steps}
        onApprove={handleApprove}
      />
    </main>
  );
}
