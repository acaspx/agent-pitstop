import { PlanReview } from "@/components/plan-review";

export default function Screen({ onRun }: { onRun: (stepTitles: string[]) => void }) {
  return (
    <PlanReview
      goal="Migrate billing to the v2 payments API"
      steps={[
        { title: "Read the billing client" },
        { title: "Swap charge() for createPayment()" },
        { title: "Run the migration on the staging database", risky: true },
        { title: "Open a pull request" },
      ]}
      onApprove={(steps) => onRun(steps.map((s) => s.title))}
    />
  );
}
