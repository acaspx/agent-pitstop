import { ComponentDoc } from "@/components/docs/doc-page";
import { PlanReviewDemo } from "./demo";

export const metadata = {
  title: "Plan Review — Agent Pit Stop",
  description: "Edit the agent's plan before it runs. Nothing starts until you approve.",
};

export default function Page() {
  return (
    <ComponentDoc
      slug="plan-review"
      intro="Cursor's Plan Mode and the planning steps in coding agents made one thing clear: correcting a plan is cheap, correcting a run is not. Plan Review shows the agent's steps before anything happens. The person can drop a step, reword one, and see the risky ones marked. The approved version is the contract the agent follows."
      chatPrompt="Move our billing over to the v2 payments API."
      preview={<PlanReviewDemo />}
      sections={[
        {
          heading: "When to use",
          body: "Before long or multi-step runs, and before any run with a risky step. For a single action, use Approval Gate instead; a one-step plan is a permission request.",
        },
        {
          heading: "Behavior",
          body: "Reviewing state shows Edit and Drop on each step, a count of kept steps, and Approve plan. Dropped steps stay visible, struck through, and can be kept again. Approving folds the controls away and marks the plan Approved. onApprove receives the edited steps.",
        },
        {
          heading: "Usage",
          code: `import { PlanReview } from "@/components/plan-review";

<PlanReview
  goal="Move billing to the v2 payments API"
  steps={[
    { title: "Swap charge() for createPayment()" },
    { title: "Run the migration on staging", risky: true },
  ]}
  onApprove={(steps) => agent.run(steps)}
  onRevise={askForNewPlan}
/>`,
        },
      ]}
    />
  );
}
