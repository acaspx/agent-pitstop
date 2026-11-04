import { ConfidenceMeter } from "@/components/confidence-meter";

export default function Screen({ onVerify }: { onVerify: () => void }) {
  return (
    <main className="mx-auto flex min-h-screen max-w-xl flex-col gap-6 p-6">
      <header className="flex flex-col gap-1">
        <h1 className="text-lg font-semibold">Invoice #2231</h1>
        <p className="text-sm text-neutral-600">
          Matched against purchase order #4412
        </p>
      </header>

      <ConfidenceMeter
        claim="Invoice #2231 matches purchase order #4412"
        confidence={0.62}
        basis="Vendor, PO number and line items match; the total is a blurry scan"
        onVerify={onVerify}
        verifyLabel="Check the total yourself"
      />
    </main>
  );
}
