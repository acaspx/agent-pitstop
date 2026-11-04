import { AgentTaskList } from "@/components/agent-task-list";

export default function Screen() {
  return (
    <AgentTaskList
      label="Trip to Lisbon"
      tasks={[
        { title: "Compare nonstop fares", status: "done" },
        { title: "Hold seat 14A", status: "done" },
        { title: "Book the flight", status: "failed", detail: "Card declined" },
        { title: "Email the itinerary", status: "pending" },
      ]}
    />
  );
}
