"use client";

import { Collapse, Stage, Stream, Window, type Act } from "@/components/stageshow/kit";
import { PlanReview, type PlanReviewState } from "@/registry/plan-review/plan-review";
import { Composer, Host, REST, SIZE, Targets } from "./shared";

/*
 * Delegation Contracts: the plan is edited before it is signed.
 * Focal object: the Plan Review. Actions: drop the risky step, approve.
 * Payoff: the plan is marked Approved without that step, and the agent
 * restates the contract it is about to run.
 */

type S = { dropped: number[]; plan: PlanReviewState; words: number };

const STEPS = [
  { title: "Read the billing client", detail: "src/billing, 6 files" },
  { title: "Swap charge() for createPayment()" },
  { title: "Run the migration on staging", risky: true },
  { title: "Open a pull request" },
];
const REPLY = "Running 3 steps. I'll leave staging alone and open the PR for you.";
const N = REPLY.split(" ").length;

const initial: S = { dropped: [], plan: "reviewing", words: 0 };
const POSTER: S = { dropped: [2], plan: "approved", words: N };

async function script(a: Act<S>) {
  await a.wait(1100);
  // the person reads the plan and drops the step that touches staging
  await a.move({ at: "drop", x: 0.5, y: 0.55 });
  await a.wait(300);
  await a.click();
  a.mark("dropped");
  await a.set({ dropped: [2] });
  await a.wait(900);
  await a.move({ at: "approve", x: 0.55, y: 0.55 });
  await a.wait(300);
  await a.click();
  a.mark("approved");
  await a.set({ plan: "approved" });
  a.move("rest");
  await a.wait(450);
  for (let w = 1; w <= N; w++) {
    a.put({ words: w });
    await a.wait(65);
  }
  await a.wait(3000);
}

export function DelegationContractsLap() {
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
              {layout === "wide" && <div className="pl-ask">Move billing to the v2 payments API.</div>}
              <Targets names={{ drop: { text: "Drop", nth: 2 }, approve: { text: "Approve plan" } }}>
                <PlanReview goal="Move billing to the v2 API" steps={STEPS} dropped={s.dropped} state={s.plan} />
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

export default function DelegationContractsDemo() {
  return <Host label="Editing a plan before approving it">{(run) => <DelegationContractsLap key={run} />}</Host>;
}
