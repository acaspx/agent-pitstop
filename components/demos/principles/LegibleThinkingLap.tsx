"use client";

import { Collapse, Stage, Stream, Window, type Act } from "@/components/stageshow/kit";
import { ReasoningTrace, type ReasoningStep } from "@/registry/reasoning-trace/reasoning-trace";
import { CitationChip, SourceDrawer, type Source } from "@/registry/citation-chip/citation-chip";
import { Host, REST, SIZE, Targets } from "./shared";

/*
 * Legible Thinking: a research answer whose work can be checked.
 * Focal object: the citation on the claim. Action: open it.
 * Payoff: the exact passage the agent relied on, under the answer.
 * Beats: the trace streams three steps and folds; the answer streams with
 * its sources inline; the cursor opens source 1 and the passage appears.
 */

type S = { at: number; streaming: boolean; words: number; open: number | null };

const STEPS = [
  { label: "Searching fare tables", detail: "14 nonstop fares, 4 carriers", sources: ["jetblue.com", "united.com"] },
  { label: "Checking carry-on rules", detail: "Blue Basic excludes a carry-on", sources: ["jetblue.com"] },
  { label: "Comparing totals with a bag" },
];
const A = "No. JetBlue's cheapest fare doesn't include a carry-on";
const B = ", so United Basic is $19 cheaper all in.";
const NA = A.split(" ").length;
const NB = B.split(" ").length;

const SOURCES: Source[] = [
  { title: "Fare rules: Blue Basic", domain: "jetblue.com", quote: "Carry-on bags are not included with Blue Basic." },
  { title: "Basic Economy bags", domain: "united.com", quote: "One full-sized carry-on is allowed on New York routes." },
];

/* rest below the drawer, clear of the passage */
const AT = { wide: { x: 610, y: 424 }, compact: REST.compact };

const initial: S = { at: 0, streaming: true, words: 0, open: null };
const POSTER: S = { at: 3, streaming: false, words: NA + NB, open: 1 };

async function script(a: Act<S>) {
  await a.wait(700);
  for (let i = 1; i <= STEPS.length; i++) {
    await a.set({ at: i });
    await a.wait(850);
  }
  a.mark("folded");
  // the trace folds as the answer starts: the handoff overlaps
  a.put({ streaming: false });
  await a.wait(180);
  for (let w = 1; w <= NA + NB; w++) {
    a.put({ words: w });
    await a.wait(65);
  }
  await a.wait(700);
  await a.move({ at: "chip", x: 0.5, y: 0.55 });
  await a.wait(300);
  await a.click();
  a.mark("source");
  await a.set({ open: 1 });
  a.move("rest");
  await a.wait(3200);
}

export function LegibleThinkingLap() {
  return (
    <Stage<S>
      width={SIZE.width}
      height={440}
      compact={SIZE.compact}
      theme="dark"
      play="once"
      initial={initial}
      poster={POSTER}
      script={script}
      cursor={{ at: AT }}
      className="pl"
    >
      {(s, _rect, layout) => {
        const steps: ReasoningStep[] = STEPS.map((st, i) => ({
          ...st,
          status: i < s.at ? "done" : i === s.at ? "active" : "pending",
        }));
        return (
          <>
            <Window title="Research" className="pl-win">
              <section className="pl-run" data-layout={layout} data-ss-host>
                {layout === "wide" && (
                  <div className="pl-ask">Is the cheapest SFO → JFK fare still cheapest with a carry-on?</div>
                )}
                <ReasoningTrace steps={steps} streaming={s.streaming} seconds={4} />
                <Collapse open={s.words > 0} reveal="drop" from="below">
                  <Targets names={{ chip: { text: "1jet" } }}>
                    <p className="pl-reply">
                      <Stream text={A} count={Math.min(s.words, NA)} />
                      {s.words >= NA && (
                        <span className="pl-pop">
                          <CitationChip index={1} source={SOURCES[0]} active={s.open === 1} />
                        </span>
                      )}
                      {s.words > NA && <Stream text={B} count={s.words - NA} />}
                      {s.words >= NA + NB && (
                        <span className="pl-pop">
                          <CitationChip index={2} source={SOURCES[1]} active={s.open === 2} />
                        </span>
                      )}
                    </p>
                  </Targets>
                </Collapse>
                <SourceDrawer sources={SOURCES} activeIndex={s.open} />
              </section>
            </Window>
            <span data-target="rest" style={{ position: "absolute", left: AT[layout].x, top: AT[layout].y }} />
          </>
        );
      }}
    </Stage>
  );
}

export default function LegibleThinkingDemo() {
  return <Host label="Legible thinking in a research product">{(run) => <LegibleThinkingLap key={run} />}</Host>;
}
