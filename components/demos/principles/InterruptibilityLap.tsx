"use client";

import { Collapse, Stage, Stream, Window, type Act } from "@/components/stageshow/kit";
import { ToolCallCard, type ToolCallState } from "@/registry/tool-call-card/tool-call-card";
import { InterruptBar, type InterruptBarState } from "@/registry/interrupt-bar/interrupt-bar";
import { Composer, Host, REST, SIZE, Targets } from "./shared";

/*
 * Interruptibility: stopping a run keeps what it found.
 * Focal object: the Interrupt Bar. Action: Stop.
 * Payoff: the bar says what was kept, and the agent confirms nothing
 * was booked.
 */

type S = { search: ToolCallState; act: number; elapsed: number; bar: InterruptBarState; words: number };

const ACTS = ["Searching 3 flight providers…", "Comparing 14 flights against $400…", "Opening seat maps for the top 3…"];
const REPLY = "Stopped. The 14 flights I found are saved here. Nothing was held or booked.";
const N = REPLY.split(" ").length;

const initial: S = { search: "running", act: 0, elapsed: 3, bar: "running", words: 0 };
const POSTER: S = { search: "success", act: 2, elapsed: 9, bar: "stopped", words: N };

async function script(a: Act<S>) {
  await a.wait(900);
  await a.set({ search: "success", act: 1, elapsed: 5 });
  await a.wait(1200);
  await a.set({ act: 2, elapsed: 8 });
  await a.wait(900);
  // the person changes their mind: one press, mid-step
  await a.move({ at: "stop", x: 0.5, y: 0.55 });
  a.put({ elapsed: 9 });
  await a.wait(300);
  await a.click();
  a.mark("stopped");
  await a.set({ bar: "stopped" });
  a.move("rest");
  await a.wait(500);
  for (let w = 1; w <= N; w++) {
    a.put({ words: w });
    await a.wait(65);
  }
  await a.wait(3000);
}

export function InterruptibilityLap() {
  return (
    <Stage<S>
      width={SIZE.width}
      height={360}
      compact={SIZE.compact}
      theme="dark"
      play="once"
      initial={initial}
      poster={POSTER}
      script={script}
      cursor={{ at: REST }}
      className="pl"
    >
      {(s, _rect, layout) => (
        <>
          <Window title="Assistant" className="pl-win">
            <section className="pl-run" data-layout={layout} data-ss-host>
              <div className="pl-ask">Find nonstop flights to JFK under $400.</div>
              <ToolCallCard
                name="search_flights"
                intent="SFO → JFK, Aug 12, nonstop"
                state={s.search}
                detail={s.search === "success" ? "14 flights under $400" : undefined}
              />
              <Targets names={{ stop: { text: "Stop" } }}>
                <InterruptBar
                  activity={ACTS[s.act]}
                  elapsed={s.elapsed}
                  state={s.bar}
                  keptOnStop="14 flights saved to this thread"
                />
              </Targets>
              <Collapse open={s.words > 0} reveal="drop" from="below">
                <p className="pl-reply">
                  <Stream text={REPLY} count={s.words} />
                </p>
              </Collapse>
              {layout === "wide" && <Composer />}
            </section>
          </Window>
          <span data-target="rest" style={{ position: "absolute", left: REST[layout].x, top: REST[layout].y }} />
        </>
      )}
    </Stage>
  );
}

export default function InterruptibilityDemo() {
  return <Host label="Stopping a running agent">{(run) => <InterruptibilityLap key={run} />}</Host>;
}
