import { ComponentDoc } from "@/components/docs/doc-page";
import { AgentInboxDemo } from "./demo";

export const metadata = {
  title: "Agent Inbox — Agent Pit Stop",
  description: "The review queue for background agents: results wait for human eyes, ordered by what needs you most.",
};

export default function Page() {
  return (
    <ComponentDoc
      slug="agent-inbox"
      intro="Background agents finish laps while you're elsewhere. The inbox is where their results wait: runs that need a decision surface first with the reason named, running work stays visible, and finished work files itself quietly. It's the difference between agents you check on and agents that report to you."
      chatPrompt="What did my agents get done today?"
      preview={<AgentInboxDemo />}
      sections={[
        {
          heading: "When to use",
          body: "Any product with agents that outlive the session: overnight runs, scheduled jobs, long research tasks. Skip it if every run completes while the user watches; a queue of one is ceremony.",
        },
        {
          heading: "Behavior",
          body: "Four statuses: needs you, running, done, failed. Needs-review items carry the reason (low confidence, irreversible step, failure), because a red dot without a why just manufactures anxiety. Nothing auto-completes past a consent point while sitting in the queue.",
        },
        {
          heading: "Usage",
          code: `import { AgentInbox } from "@/components/agent-inbox";

<AgentInbox
  items={runs}
  onOpen={(id) => router.push(\`/runs/\${id}\`)}
/>`,
        },
      ]}
    />
  );
}
