import { ApprovalGate, type ScopeItem } from "@/components/approval-gate";

const scope: ScopeItem[] = [
  {
    label: "Send email to 3 recipients",
    detail: "alice@acme.com, bob@acme.com, carol@acme.com",
    risky: true,
  },
  {
    label: "Attach 1 file",
    detail: "Q3-summary.pdf",
  },
];

export default function Screen({ onSend }: { onSend: () => void }) {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-xl flex-col gap-4 p-6">
      <header className="flex flex-col gap-1">
        <h1 className="text-lg font-semibold">Q3 summary email</h1>
        <p className="text-sm text-neutral-600 dark:text-neutral-400">
          Your assistant has drafted the email. Nothing goes out until you say so.
        </p>
      </header>

      <ApprovalGate
        title="Send the Q3 summary email?"
        reason="The Q3 summary is drafted with Q3-summary.pdf attached and is ready to go to Alice, Bob and Carol."
        scope={scope}
        approveLabel="Send email"
        denyLabel="Don't send"
        onApprove={onSend}
      />
    </main>
  );
}
