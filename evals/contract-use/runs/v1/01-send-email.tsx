import { ApprovalGate } from "@/components/ui/approval-gate";

export default function Screen({ onSend }: { onSend: () => void }) {
  return (
    <main className="mx-auto flex w-full max-w-xl flex-col gap-4 p-6">
      <p className="text-sm text-neutral-600">
        I've drafted the Q3 summary email and attached the report. It won't go
        out until you say so.
      </p>

      <ApprovalGate
        title="Send the Q3 summary email?"
        reason="You asked me to share the Q3 summary with the team. The draft is ready, with the report attached."
        scope={[
          { label: "To: alice@acme.com" },
          { label: "To: bob@acme.com" },
          { label: "To: carol@acme.com" },
          { label: "Attachment: Q3-summary.pdf" },
          { label: "Sends the email to 3 recipients", risky: true },
        ]}
        approveLabel="Send email"
        denyLabel="Don't send"
        onApprove={onSend}
      />
    </main>
  );
}
