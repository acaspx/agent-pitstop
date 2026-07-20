import { ComponentDoc } from "@/components/docs/doc-page";
import { ContextBudgetDemo } from "./demo";

export const metadata = {
  title: "Context Budget — Agent Pit Stop",
  description: "A delegation contract's limits made visible: tokens, spend, or time against their caps.",
};

export default function Page() {
  return (
    <ComponentDoc
      slug="context-budget"
      intro="Every delegation contract has limits; almost no interface shows them. The budget renders consumption against caps in honest bands, and when a cap is hit, the run pauses into a rendered state with a human decision attached. Budgets nobody can see are budgets nobody trusts, and surprise bills are how agent products lose customers."
      chatPrompt="Research this market, but keep it under $5."
      preview={<ContextBudgetDemo />}
      sections={[
        {
          heading: "When to use",
          body: "Any run where the user set or implied a limit: spend, tokens, time, API calls. Show it during the run, not in a postmortem. Skip it for instant, effectively-free actions.",
        },
        {
          heading: "Behavior",
          body: "Three bands, each labeled in words: fine, near cap, at cap. Hitting a cap pauses the run and states that nothing was spent past it; raising the cap is an explicit human action that belongs in the receipt trail. Bars carry ARIA progressbar semantics.",
        },
        {
          heading: "Usage",
          code: `import { ContextBudget } from "@/components/context-budget";

<ContextBudget
  lines={[
    { label: "Spend", used: 4.1, cap: 5, format: (n) => \`$\${n.toFixed(2)}\` },
    { label: "Time", used: 21, cap: 45, format: (n) => \`\${n}m\` },
  ]}
  onRaise={(which) => askUserToRaise(which)}
/>`,
        },
      ]}
    />
  );
}
