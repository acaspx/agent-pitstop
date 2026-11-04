import { useState } from "react";
import { TakeoverBanner, type TakeoverState } from "@/components/takeover-banner";
import { AgentTaskList, type AgentTask } from "@/components/agent-task-list";

export default function Screen({ onTakeOver }: { onTakeOver: () => void }) {
  const [driver, setDriver] = useState<TakeoverState>("needs-you");

  const tasks: AgentTask[] = [
    { title: "Find your flight", status: "done" },
    { title: "Go to JetBlue checkout", status: "done" },
    {
      title: "Sign in to JetBlue",
      status: "active",
      detail:
        driver === "you"
          ? "You're signing in"
          : "Waiting for you. I don't type passwords",
    },
    { title: "Finish booking the flight", status: "pending" },
  ];

  function handleTakeOver() {
    setDriver("you");
    onTakeOver();
  }

  return (
    <main className="mx-auto flex max-w-3xl flex-col gap-6 p-6">
      <header className="flex flex-col gap-1">
        <h1 className="text-lg font-semibold">Booking your flight</h1>
        <p className="text-sm text-neutral-600">
          The agent reached JetBlue's sign-in page. It doesn't type passwords, so
          you'll need to sign in yourself.
        </p>
      </header>

      {/* The surface the agent controls: the browser, with the banner pinned to it */}
      <section
        aria-label="Agent's browser"
        className="overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm"
      >
        <div className="sticky top-0 z-10">
          <TakeoverBanner
            state={driver}
            reason="JetBlue needs you to sign in. I don't type passwords."
            onTakeOver={handleTakeOver}
            onHandBack={() => setDriver("resuming")}
          />
        </div>

        <div className="flex items-center gap-2 border-b border-neutral-200 bg-neutral-50 px-4 py-2">
          <span className="truncate rounded-md bg-white px-3 py-1 text-xs text-neutral-600 ring-1 ring-neutral-200">
            jetblue.com/signin
          </span>
        </div>

        <div className="flex min-h-64 items-center justify-center p-8">
          <div className="w-full max-w-xs rounded-lg border border-neutral-200 p-5 text-center">
            <p className="text-base font-semibold">Sign in to JetBlue</p>
            <p className="mt-1 text-sm text-neutral-500">
              {driver === "you"
                ? "You have control. Enter your email and password here."
                : "Take over to enter your email and password."}
            </p>
          </div>
        </div>
      </section>

      <AgentTaskList label="Booking your flight" tasks={tasks} />
    </main>
  );
}
