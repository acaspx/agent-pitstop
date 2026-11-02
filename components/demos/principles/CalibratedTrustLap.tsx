"use client";

import { Collapse, Stage, Stream, Window, type Act } from "@/components/stageshow/kit";
import { ConfidenceMeter } from "@/registry/confidence-meter/confidence-meter";
import { Composer, Host, REST, SIZE, Targets } from "./shared";

/*
 * Calibrated Trust: the agent says how sure it is, and where to look.
 * Focal object: the Confidence Meter. Action: Check this.
 * Payoff: the band rises to high on the person's check, and the invoice
 * moves on with a reason the person supplied.
 */

type S = { words: number; checked: boolean; words2: number };

const REPLY = "Mostly. Vendor, PO number and line items match. The total is a blurry scan.";
const N = REPLY.split(" ").length;
const DONE = "Matched. Sent to Dana for approval.";
const N2 = DONE.split(" ").length;

const initial: S = { words: 0, checked: false, words2: 0 };
const POSTER: S = { words: N, checked: true, words2: N2 };

async function script(a: Act<S>) {
  await a.wait(700);
  for (let w = 1; w <= N; w++) {
    a.put({ words: w });
    await a.wait(60);
  }
  await a.wait(1300);
  await a.move({ at: "check", x: 0.5, y: 0.55 });
  await a.wait(300);
  await a.click();
  a.mark("checked");
  await a.set({ checked: true });
  a.move("rest");
  await a.wait(700);
  for (let w = 1; w <= N2; w++) {
    a.put({ words2: w });
    await a.wait(65);
  }
  await a.wait(3000);
}

export function CalibratedTrustLap() {
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
          <Window title="Payables" className="pl-win">
            <section className="pl-run" data-layout={layout} data-ss-host>
              <div className="pl-ask">Does invoice 2231 match PO #4412?</div>
              <Collapse open={s.words > 0} reveal="drop" from="below">
                <p className="pl-reply">
                  <Stream text={REPLY} count={s.words} />
                </p>
              </Collapse>
              <Collapse open={s.words >= N} reveal="drop" from="below">
                <Targets names={{ check: { text: "Check this" } }}>
                  <ConfidenceMeter
                    claim="Invoice 2231 matches PO #4412"
                    confidence={s.checked ? 0.96 : 0.58}
                    basis={s.checked ? "You confirmed the total: $4,180.00" : "3 of 4 fields match, total unreadable"}
                  />
                </Targets>
              </Collapse>
              <Collapse open={s.words2 > 0} reveal="drop" from="below">
                <p className="pl-reply">
                  <Stream text={DONE} count={s.words2} />
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

export default function CalibratedTrustDemo() {
  return <Host label="Checking a medium-confidence claim">{(run) => <CalibratedTrustLap key={run} />}</Host>;
}
