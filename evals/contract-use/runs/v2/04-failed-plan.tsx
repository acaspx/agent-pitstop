import { AgentTaskList, type AgentTask } from "@/components/agent-task-list";

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
    detail: "Card declined",
  },
  {
    title: "Email the itinerary",
    status: "pending",
  },
];

export default function Screen() {
  return (
    <main className="mx-auto w-full max-w-xl p-6">
      <AgentTaskList label="Booking your trip to Lisbon" tasks={tasks} />
    </main>
  );
}
