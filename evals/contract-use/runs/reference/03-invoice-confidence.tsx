import { ConfidenceMeter } from "@/components/confidence-meter";

export default function Screen({ onVerify }: { onVerify: () => void }) {
  return (
    <ConfidenceMeter
      claim="Invoice #2231 matches PO #4412"
      confidence={0.62}
      basis="Vendor, PO number and line items match; the total is a blurry scan"
      onVerify={onVerify}
    />
  );
}
