import { ComponentDoc } from "@/components/docs/doc-page";
import { ConfidenceMeterDemo } from "./demo";

export const metadata = {
  title: "Confidence Meter — Agent Pit Stop",
  description: "Honest uncertainty as coarse bands, paired with verification exactly when doubt is warranted.",
};

export default function Page() {
  return (
    <ComponentDoc
      slug="confidence-meter"
      intro="Decimal confidence is theater: a model that says 87.3% invites trust it hasn't earned. The meter renders confidence as three honest bands, keeps the claim and its basis together, and turns into a verification request below the threshold, so human attention is spent exactly where doubt is warranted."
      chatPrompt="Reconcile this invoice against our purchase orders."
      preview={<ConfidenceMeterDemo />}
      sections={[
        {
          heading: "When to use",
          body: "Any agent output that will be used downstream: extractions, matches, classifications, summaries feeding decisions. Skip it for chitchat; a confidence band on small talk is noise.",
        },
        {
          heading: "Behavior",
          body: "Confidence maps to low / medium / high bands, never a decimal. Below the threshold (default 0.75), a verification affordance appears with a plain-language nudge. After human verification, re-render with the updated claim; trust earned by a person outranks any model score.",
        },
        {
          heading: "Usage",
          code: `import { ConfidenceMeter } from "@/components/confidence-meter";

<ConfidenceMeter
  claim="This invoice matches PO #4412"
  basis="3 matching fields, 1 OCR gap on the total"
  confidence={0.55}
  threshold={0.75}
  onVerify={openSideBySideReview}
/>`,
        },
      ]}
    />
  );
}
