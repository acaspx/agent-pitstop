"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { Collapse, Stage, States, Stream, Window, Bar, type Act } from "@/components/stageshow/kit";
import { AgentTaskList, type AgentTaskStatus } from "@/registry/agent-task-list/agent-task-list";
import { ToolCallCard, type ToolCallState } from "@/registry/tool-call-card/tool-call-card";
import { ApprovalGate, type ApprovalState } from "@/registry/approval-gate/approval-gate";
import "./hero-lap.css";

/*
 * Landing hero: one pit stop in a real-looking product, built from the
 * system's own components. A travel agent has been working on its own; it
 * holds a seat, then stops at the irreversible step and waits. The visitor's
 * stand-in presses Approve, and the booking lands in the trip.
 *
 * Plan (Stageshow):
 * - Place: full width under the landing hero, 976 wide on the dark page.
 *   The page is the ground: no plate. Fade crop: the window spans the
 *   column and fades out at its foot, over the composer (filler).
 * - Focal object: the Approval Gate. Action: Approve. Payoff: the gate
 *   folds to its receipt, the plan ticks Book flight, and the fare on the
 *   trip turns Booked, the consequence landing somewhere else.
 * - Real strings: the request, the tool call, the gate and its scope, the
 *   fare and its price, the trip title. Everything else is bars.
 * - Plays once when it comes into view; the poster is the booked state.
 *   A Replay button in the host remounts it.
 */

type Fare = "holding" | "held" | "booked";
type S = {
  tool: ToolCallState;
  hold: AgentTaskStatus;
  book: AgentTaskStatus;
  gateOpen: boolean;
  gate: ApprovalState;
  fare: Fare;
  /** words of the agent's reply shown so far */
  words: number;
};

const REPLY = "Booked. Seat 14A on TAP 202, Mar 12. Confirmation PSL7QK is on your trip.";
const REPLY_WORDS = REPLY.split(" ").length;

const initial: S = { tool: "running", hold: "active", book: "pending", gateOpen: false, gate: "awaiting", fare: "holding", words: 0 };
const POSTER: S = { tool: "success", hold: "done", book: "done", gateOpen: true, gate: "approved", fare: "booked", words: REPLY_WORDS };

const REST = { wide: { x: 880, y: 400 }, compact: { x: 320, y: 300 } };

async function script(a: Act<S>) {
  await a.wait(900);
  // The agent finishes the hold on its own: the call lands, the plan ticks,
  // and the seat shows as held on the trip
  a.mark("held");
  await a.set({ tool: "success", hold: "done" });
  await a.wait(350);
  await a.set({ fare: "held" });
  await a.wait(700);
  // The irreversible step: the agent stops and asks
  a.mark("gate");
  await a.set({ book: "active", gateOpen: true });
  await a.wait(1500);
  // The human says yes
  await a.move({ at: "approve", x: 0.82, y: 0.62 });
  await a.wait(350);
  await a.click();
  a.mark("approved");
  await a.set({ gate: "approved" });
  await a.wait(450);
  await a.set({ book: "done" });
  await a.wait(300);
  await a.set({ fare: "booked" });
  a.move("rest");
  // The agent reports back in the thread, streamed word by word
  for (let w = 1; w <= REPLY_WORDS; w++) {
    a.put({ words: w });
    await a.wait(70);
  }
  await a.wait(2400);
}

/** The gate's buttons are the component's own; name the Approve one for the cursor. */
function NamedGate(props: Parameters<typeof ApprovalGate>[0]) {
  const ref = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    const btn = ref.current?.querySelector("button");
    if (btn) btn.setAttribute("data-target", "approve");
  });
  return (
    <div ref={ref}>
      <ApprovalGate {...props} />
    </div>
  );
}

function FareStatus({ fare }: { fare: Fare }) {
  return (
    <span className="hl-status" data-fare={fare}>
      <i className="hl-status__dot" />
      <States
        value={fare}
        align="end"
        states={{ holding: <span>Holding</span>, held: <span>Held</span>, booked: <span>Booked</span> }}
      />
    </span>
  );
}

function FareRow({ fare }: { fare: Fare }) {
  return (
    <div className="hl-fare" data-fare={fare}>
      <div className="hl-fare__lines">
        <span className="hl-fare__name">TAP 202 · SFO → LIS</span>
        <Bar w={120} h={6} tone={2} />
      </div>
      <span className="hl-fare__price">$612</span>
      <FareStatus fare={fare} />
    </div>
  );
}

export function HeroLap() {
  return (
    <Stage<S>
      width={976}
      height={460}
      compact={{ below: 760, width: 358, height: 330 }}
      theme="dark"
      play="once"
      initial={initial}
      poster={POSTER}
      script={script}
      cursor={{ at: REST }}
      className="hl"
    >
      {(s, _rect, layout) => {
        const tasks = [
          { title: "Compare nonstop fares", status: "done" as AgentTaskStatus },
          { title: "Hold seat 14A", status: s.hold, detail: "Holding on TAP 202" },
          { title: "Book flight", status: s.book, detail: "Waiting for your approval" },
        ];
        return (
          <>
            <Window title="Trips" className="hl-win">
              <div className="hl-body" data-layout={layout}>
                {/* The conversation with the agent */}
                <section className="hl-run" data-ss-host>
                  {/* The phone column keeps only the stop itself: the gate,
                      then its receipt and the agent's reply */}
                  {layout === "wide" && (
                    <>
                      <div className="hl-ask">
                        <span className="hl-ask__text">Book the cheapest nonstop to Lisbon on March 12.</span>
                      </div>
                      <ToolCallCard
                        name="hold_seat"
                        intent="Holding 14A on TAP 202, SFO → LIS"
                        state={s.tool}
                      />
                    </>
                  )}
                  <Collapse open={s.gateOpen || layout === "compact"} reveal="drop">
                    <NamedGate
                      title="Book TAP 202 for $612?"
                      scope={[
                        { label: "Charge Visa ending 4242", detail: "$612.00, nonrefundable", risky: true },
                        { label: "Confirm seat 14A", detail: "Window, economy" },
                      ]}
                      state={s.gate}
                    />
                  </Collapse>
                  <Collapse open={s.words > 0} reveal="drop" from="below">
                    <p className="hl-reply">
                      <Stream text={REPLY} count={s.words} />
                    </p>
                  </Collapse>
                  {/* The phone column has no trip pane, so the booked fare
                      lands in the thread, under the reply */}
                  {layout === "compact" && (
                    <Collapse open={s.fare === "booked"} reveal="drop">
                      <FareRow fare={s.fare} />
                    </Collapse>
                  )}
                  {layout === "wide" && (
                    <div className="hl-composer" aria-hidden>
                      <Bar w={180} h={7} tone={2} />
                    </div>
                  )}
                </section>

                {/* The trip the run is working on; hidden in the phone column */}
                {layout === "wide" && (
                  <aside className="hl-trip" data-ss-host>
                    <div className="hl-trip__head">
                      <div className="hl-trip__title">Lisbon</div>
                      <Bar w={92} h={7} tone={2} />
                    </div>
                    <FareRow fare={s.fare} />
                    <div className="hl-fare hl-fare--filler" aria-hidden>
                      <div className="hl-fare__lines">
                        <Bar w={110} h={8} tone={2} />
                        <Bar w={84} h={6} tone={1} />
                      </div>
                      <Bar w={36} h={8} tone={2} />
                    </div>
                    <AgentTaskList label="Plan" tasks={tasks} />
                  </aside>
                )}
              </div>
            </Window>
            <span data-target="rest" style={{ position: "absolute", left: REST[layout].x, top: REST[layout].y }} />
          </>
        );
      }}
    </Stage>
  );
}

/** Host wrapper: the demo plus a Replay control that remounts it at the story boundary. */
export default function HeroLapDemo() {
  const [run, setRun] = useState(0);
  return (
    <div className="hl-host">
      <HeroLap key={run} />
      <button type="button" className="hl-replay" onClick={() => setRun((n) => n + 1)}>
        <span aria-hidden>↻</span> Replay
      </button>
    </div>
  );
}
