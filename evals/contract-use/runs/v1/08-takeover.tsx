import { useState } from "react";
import { TakeoverBanner } from "@/components/ui/takeover-banner";

type Driver = "agent" | "human";

export default function Screen({ onTakeOver }: { onTakeOver: () => void }) {
  const [driver, setDriver] = useState<Driver>("agent");

  const handleTakeOver = () => {
    setDriver("human");
    onTakeOver();
  };

  const handleHandBack = () => {
    setDriver("agent");
  };

  return (
    <main className="mx-auto flex min-h-screen max-w-4xl flex-col gap-4 p-6">
      <header className="flex flex-col gap-1">
        <h1 className="text-lg font-semibold">Booking your flight</h1>
        <p className="text-sm text-neutral-600">
          Your agent reached JetBlue's sign-in page. It doesn't type passwords, so you'll sign in yourself.
        </p>
      </header>

      {/* The browser surface the agent controls; the banner is pinned to it. */}
      <section
        aria-label="Agent browser"
        className="flex flex-col overflow-hidden rounded-xl border border-neutral-200"
      >
        <TakeoverBanner
          state={driver}
          reason={
            driver === "agent"
              ? "Sign in to JetBlue to continue. I don't type passwords."
              : "You're signing in to JetBlue"
          }
          onTakeOver={handleTakeOver}
          onHandBack={handleHandBack}
        />

        <div className="flex items-center gap-2 border-b border-neutral-200 bg-neutral-50 px-3 py-2">
          <span className="truncate rounded-md bg-white px-3 py-1 text-xs text-neutral-600 ring-1 ring-neutral-200">
            https://www.jetblue.com/signin
          </span>
        </div>

        <div className="flex flex-1 items-center justify-center bg-white p-10">
          <div className="w-full max-w-sm space-y-4">
            <h2 className="text-xl font-semibold">Sign in to TrueBlue</h2>
            <div className="space-y-1">
              <p className="text-sm font-medium">Email or TrueBlue number</p>
              <div className="h-10 rounded-md border border-neutral-300" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium">Password</p>
              <div className="h-10 rounded-md border border-neutral-300" />
            </div>
            <div className="h-10 rounded-md bg-neutral-200" aria-hidden="true" />
          </div>
        </div>
      </section>
    </main>
  );
}
