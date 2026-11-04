import { useRef, useState } from "react";
import { PlanReview, type PlanReviewState, type PlanStep } from "@/components/plan-review";

const STEPS: PlanStep[] = [
  {
    title: "Read the billing client",
    detail: "Find every place the billing client calls charge(). Read only, nothing is changed.",
  },
  {
    title: "Swap charge() for createPayment()",
    detail: "Replace each charge() call with the v2 payments API's createPayment(), on a local branch.",
  },
  {
    title: "Run the migration on the staging database",
    detail: "Writes to the shared staging database. Other people using staging will see the change.",
    risky: true,
  },
  {
    title: "Open a pull request",
    detail: "Push the branch and open a PR with the createPayment() changes for review.",
    risky: true,
  },
];

export default function Screen({ onRun }: { onRun: (stepTitles: string[]) => void }) {
  const [state, setState] = useState<PlanReviewState>("reviewing");
  const ran = useRef(false);

  function handleApprove(approved: PlanStep[]) {
    // onApprove only fires from the person's Approve plan click; the ref guards against a double fire.
    if (ran.current) return;
    ran.current = true;
    setState("approved");
    onRun(approved.map((step) => step.title));
  }

  return (
    <main className="mx-auto w-full max-w-2xl p-6">
      <PlanReview
        goal="Migrate billing to the v2 payments API"
        steps={STEPS}
        state={state}
        onApprove={handleApprove}
      />
    </main>
  );
}
