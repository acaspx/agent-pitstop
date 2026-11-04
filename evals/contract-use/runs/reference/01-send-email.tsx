import { ApprovalGate } from "@/components/approval-gate";

export default function Screen({ onSend }: { onSend: () => void }) {
  return (
    <ApprovalGate
      title="Send the Q3 summary email?"
      reason="The draft is ready for the three stakeholders."
      scope={[
        { label: "Send email to 3 recipients", detail: "alice@acme.com, bob@acme.com, carol@acme.com", risky: true },
        { label: "Attach Q3-summary.pdf" },
      ]}
      onApprove={onSend}
    />
  );
}
