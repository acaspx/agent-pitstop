import { ComponentDoc } from "@/components/docs/doc-page";
import { AgentTaskListDemo } from "./demo";

export const metadata = {
  title: "Agent Task List — Agent Pit Stop",
  description: "The agent's plan, made visible: pending, active, done, and failed.",
};

const cliVariant = (
  <pre className="font-mono text-[12px] leading-relaxed text-smoke">
    {`Booking your trip                       2/4

  ✓ Find flights SFO → JFK
  ✓ Compare prices with your budget
  ✗ Hold the best option
    └ fare expired, trying next option
  ○ Draft itinerary email`}
  </pre>
);

export default function Page() {
  return (
    <ComponentDoc
      slug="agent-task-list"
      intro="A spinner says trust me. A plan says check me. The task list shows the agent's intent before execution, keeps exactly one task active with a live sublabel, and leaves failures in place with the error attached, because the plan itself is the best recovery interface."
      chatPrompt="Book my New York trip, budget $400."
      preview={<AgentTaskListDemo />}
      variants={{ cli: cliVariant }}
      sections={[
        {
          heading: "When to use",
          body: "Multi-step agent runs where the user benefits from seeing the plan up front: bookings, refactors, research tasks, batch operations. Skip it for single-step actions; a plan of one item is ceremony.",
        },
        {
          heading: "Behavior",
          body: "Statuses: pending, active, done, failed. One active task at a time with a live sublabel. Completed tasks dim rather than disappear so the run stays auditable. A failed step keeps its error inline and doesn't block later steps from rendering their eventual outcome.",
        },
        {
          heading: "Usage",
          code: `import { AgentTaskList } from "@/components/agent-task-list";

<AgentTaskList
  label="Booking your trip"
  tasks={[
    { title: "Find flights SFO → JFK", status: "done" },
    { title: "Compare prices", status: "active", detail: "14 flights vs $400 cap" },
    { title: "Hold the best option", status: "pending" },
  ]}
/>`,
        },
      ]}
    />
  );
}
