import { TakeoverBanner } from "@/components/takeover-banner";

export default function Screen({ onTakeOver }: { onTakeOver: () => void }) {
  return <TakeoverBanner state="needs-you" reason="Sign in to JetBlue to continue. I don't type passwords." onTakeOver={onTakeOver} />;
}
