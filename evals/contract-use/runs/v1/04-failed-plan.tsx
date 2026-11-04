import { AgentTaskList, type AgentTask } from "@/components/ui/agent-task-list";

const tasks: AgentTask[] = [
  {
    title: "Compare nonstop fares to Lisbon",
    status: "done",
  },
  {
    title: "Hold seat 14A",
    status: "done",
  },
  {
    title: "Book the flight",
    status: "failed",
    error: "Card declined",
  },
  {
    title: "Email the itinerary",
    status: "pending",
  },
];

export default function Screen() {
  return (
    <main className="mx-auto max-w-xl p-6">
      <AgentTaskList label="Booking your trip to Lisbon" tasks={tasks} />
    </main>
  );
}
