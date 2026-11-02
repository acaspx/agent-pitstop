"use client";

import { Stage, Window, type Act } from "@/components/stageshow/kit";
import { ToolCallCard, type ToolCallState } from "@/registry/tool-call-card/tool-call-card";
import { Checkpoint } from "@/registry/checkpoint/checkpoint";
import { Composer, Host, REST, SIZE, Targets } from "./shared";

/*
 * Graceful Failure: a bad turn costs one step back.
 * Focal object: the Checkpoint list. Actions: Restore, then confirm.
 * Payoff: the marker moves to the good save point and the failing tests
 * rerun green, the consequence landing on the card that failed.
 */

type S = { tests: ToolCallState; confirming: string | null; current: string };

const CHECKPOINTS = [
  { id: "c3", label: "Refactored billing client", time: "just now" },
  { id: "c2", label: "Tests passing on v2", time: "4 min ago", undoes: "the refactor, 3 files" },
  { id: "c1", label: "Before the agent started", time: "12 min ago", undoes: "every change in this run" },
];

const initial: S = { tests: "error", confirming: null, current: "c3" };
const POSTER: S = { tests: "success", confirming: null, current: "c2" };

async function script(a: Act<S>) {
  await a.wait(1400);
  await a.move({ at: "restore", x: 0.5, y: 0.55 });
  await a.wait(300);
  await a.click();
  a.mark("confirm");
  await a.set({ confirming: "c2" });
  await a.wait(1100);
  // the confirm opens in place; its Restore is now the first one
  await a.move({ at: "restore", x: 0.5, y: 0.55 });
  await a.wait(300);
  await a.click();
  a.mark("restored");
  await a.set({ confirming: null, current: "c2" });
  a.move("rest");
  await a.wait(500);
  await a.set({ tests: "running" });
  await a.wait(1300);
  await a.set({ tests: "success" });
  await a.wait(3000);
}

export function GracefulFailureLap() {
  return (
    <Stage<S>
      width={SIZE.width}
      height={SIZE.height}
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
          <Window title="Code" className="pl-win">
            <section className="pl-run" data-layout={layout} data-ss-host>
              <ToolCallCard
                name="run_tests"
                intent="billing/*.test.ts"
                state={s.tests}
                detail={
                  s.tests === "error"
                    ? "3 of 14 failed: currency rounding"
                    : s.tests === "success"
                      ? "14 of 14 passed"
                      : undefined
                }
              />
              <Targets names={{ restore: { text: "Restore" } }}>
                <Checkpoint checkpoints={CHECKPOINTS} current={s.current} confirming={s.confirming} />
              </Targets>
              {layout === "wide" && <Composer />}
            </section>
          </Window>
          <span data-target="rest" style={{ position: "absolute", left: REST[layout].x, top: REST[layout].y }} />
        </>
      )}
    </Stage>
  );
}

export default function GracefulFailureDemo() {
  return <Host label="Restoring a checkpoint after a failed step">{(run) => <GracefulFailureLap key={run} />}</Host>;
}
