import { ComponentDoc } from "@/components/docs/doc-page";
import { InterruptBarDemo } from "./demo";

export const metadata = {
  title: "Interrupt Bar — Agent Pit Stop",
  description: "The steering wheel and the brake for a running agent.",
};

export default function Page() {
  return (
    <ComponentDoc
      slug="interrupt-bar"
      intro="Stop and steer, visible for the entire run. Stop is never destructive: partial work is kept and the receipt says exactly what survived. Steering redirects the agent mid-run and gets an immediate acknowledgment, because a correction that might have been ignored is worse than no correction at all."
      chatPrompt="Book my New York trip, budget $400."
      preview={<InterruptBarDemo />}
      sections={[
        {
          heading: "When to use",
          body: "Any agent run longer than a few seconds. Pin it to the run, not the transcript, so it stays reachable while the user scrolls. The stop affordance earns delegation: users hand more work to agents they can visibly take back.",
        },
        {
          heading: "Behavior",
          body: "Shows the current activity and elapsed time. Stop transitions to a receipt stating what was preserved. The steer input stays live during the whole run; each steer renders an acknowledgment line so the user knows which version of the plan is executing.",
        },
        {
          heading: "Usage",
          code: `import { InterruptBar } from "@/components/interrupt-bar";

<InterruptBar
  activity="Comparing 14 flights against your $400 cap…"
  elapsed={12}
  keptOnStop="14 search results saved to the thread"
  onStop={stopRun}
  onSteer={(msg) => agent.redirect(msg)}
  acknowledgment={lastAck}
/>`,
        },
      ]}
    />
  );
}
