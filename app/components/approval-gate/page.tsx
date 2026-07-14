import { ComponentDoc } from "@/components/docs/doc-page";
import { ApprovalGateDemo } from "./demo";

export const metadata = {
  title: "Approval Gate — Agent Pit Stop",
  description: "An inline permission request with itemized scope. Nothing moves until the human says so.",
};

export default function Page() {
  return (
    <ComponentDoc
      slug="approval-gate"
      intro="The core of a delegation contract. The agent states what it wants to do, itemizes the exact scope, and marks what can't be undone. Denying is as prominent as approving. After the decision, the gate collapses to a one-line receipt so the transcript keeps its audit trail without the clutter."
      chatPrompt="Send the Q3 summary to the stakeholders when it's ready."
      preview={<ApprovalGateDemo />}
      sections={[
        {
          heading: "When to use",
          body: "Before irreversible or externally visible actions only: sending, publishing, purchasing, deleting. Never gate reads or reversible operations; an agent that asks permission to read a file trains users to click through permission to send an email.",
        },
        {
          heading: "Behavior",
          body: "Three states: awaiting, approved, denied. Scope items marked risky get a visible can't-undo tag. The decision collapses the gate into a compact receipt, preserving the audit trail. Works controlled (pass state) or uncontrolled.",
        },
        {
          heading: "Usage",
          code: `import { ApprovalGate } from "@/components/approval-gate";

<ApprovalGate
  title="Send the Q3 summary email?"
  reason="Draft is ready for the three stakeholders."
  scope={[
    { label: "Send email to 3 recipients", detail: "alice@, bob@, carol@", risky: true },
    { label: "Attach Q3-summary.pdf", detail: "412 KB" },
  ]}
  onApprove={send}
  onDeny={cancel}
/>`,
        },
      ]}
    />
  );
}
