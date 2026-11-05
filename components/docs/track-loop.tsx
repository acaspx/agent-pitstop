"use client";

/**
 * TrackLoop — the Agent Pit Stop system as a race.
 *
 * A real circuit (main straight with the start line and pit lane beside it, a hairpin
 * into the infield, S-bends, kerbs on every corner) and one 18-second story that loops:
 *
 *   1. The orange car (the agent) leaves its garage and runs a lap on its own.
 *   2. It pits: the run stops for a check.
 *   3. Eval: the blue car's light pulses while the work is checked.
 *   4. The person presses Approve: the button and the pit light turn green.
 *   5. The green car (the approved plan) comes out and runs its lap, then parks,
 *      and the orange car goes out again.
 *
 * Pure SVG + SMIL on one shared clock (every animation is DUR long and starts at 0), so
 * the cars, lights and labels can't drift apart. Under prefers-reduced-motion the clock
 * is paused on the approved frame: green light on, green car on track.
 */

import { useEffect, useRef } from "react";

const DUR = "18s";
/** When each beat happens, as a share of the loop. */
const T = { pitIn: 0.4, evalStart: 0.42, approve: 0.565, greenOut: 0.6, greenIn: 0.98 };

// ------------------------------------------------------------------ the circuit
// Travel runs left to right on the bottom (main) straight, up the right side, right to
// left across the top with a hairpin dive into the infield, and down the left side.
const TURN_1 = "C 530 330 560 312 560 268";
const LAP_AFTER_TURN_1 =
  "V 210 C 560 186 538 176 538 152 C 538 128 560 118 560 94 C 560 60 542 40 508 40 H 420 " +
  "C 398 40 394 60 394 84 V 140 C 394 178 322 178 322 140 V 84 C 322 60 318 40 296 40 H 214 " +
  "C 182 40 164 60 164 92 V 160 C 164 184 186 194 186 218 C 186 242 164 252 164 276 C 164 312 184 330 220 330";
const CIRCUIT = `M 300 330 H 480 ${TURN_1} ${LAP_AFTER_TURN_1} H 300 Z`;

/** Red and white kerbs on the big corners only, as on a real track (not on every bend). */
const KERBS = [
  `M 480 330 ${TURN_1}`,
  "M 560 94 C 560 60 542 40 508 40",
  "M 394 140 C 394 178 322 178 322 140",
  "M 214 40 C 182 40 164 60 164 92",
  "M 164 276 C 164 312 184 330 220 330",
];

// ------------------------------------------------------------------ the pit
// The lane runs beside the main straight: in after the last corner, out before turn 1.
const LANE_Y = 360;
const PIT_LANE = `M 228 330 C 248 330 252 ${LANE_Y} 272 ${LANE_Y} H 440 C 460 ${LANE_Y} 464 330 480 330`;
const BAY_Y = 378;
const BAYS = { orange: 312, blue: 362, green: 412 };

/** A stint for the car in the garage at x: pull out, down the lane, a full lap, back in. */
const stint = (x: number) =>
  `M ${x} ${BAY_Y} C ${x + 12} ${BAY_Y} ${x + 12} ${LANE_Y} ${x + 26} ${LANE_Y} H 440 C 460 ${LANE_Y} 464 330 480 330 ` +
  `${TURN_1} ${LAP_AFTER_TURN_1} H 228 C 248 330 252 ${LANE_Y} 272 ${LANE_Y} ` +
  `H ${x - 26} C ${x - 12} ${LANE_Y} ${x - 12} ${BAY_Y} ${x} ${BAY_Y}`;

const BLUE = "#60a5fa";

function Car({ color }: { color: string }) {
  return (
    <g>
      <rect x="-15" y="-4" width="3" height="8" fill={color} />
      <path d="M -12 0 L -8 -3.5 L 3 -3.5 L 9 -1.5 L 14 0 L 9 1.5 L 3 3.5 L -8 3.5 Z" fill={color} />
      <rect x="12" y="-3.5" width="2.5" height="7" fill={color} />
      <rect x="-8" y="-7" width="5.5" height="3" rx="1" fill="var(--color-chalk)" />
      <rect x="-8" y="4" width="5.5" height="3" rx="1" fill="var(--color-chalk)" />
      <rect x="5" y="-7" width="5.5" height="3" rx="1" fill="var(--color-chalk)" />
      <rect x="5" y="4" width="5.5" height="3" rx="1" fill="var(--color-chalk)" />
      <circle cx="-2" cy="0" r="1.7" fill="var(--color-track)" />
    </g>
  );
}

/** Shown from one beat to another (and hidden the rest of the loop). */
function Between({ from, to }: { from: number; to: number }) {
  return <animate attributeName="opacity" values="0;1;0" keyTimes={`0;${from};${to}`} calcMode="discrete" dur={DUR} repeatCount="indefinite" />;
}

/** A car that sits in its garage until `start`, runs its stint, and is back by `end`. */
function Stint({ x, color, start, end, id }: { x: number; color: string; start: number; end: number; id: string }) {
  const keyPoints = start === 0 ? "0;1;1" : end === 1 ? "0;0;1" : "0;0;1;1";
  const keyTimes = start === 0 ? `0;${end};1` : end === 1 ? `0;${start};1` : `0;${start};${end};1`;
  return (
    <>
      <path id={id} d={stint(x)} fill="none" />
      <g>
        <animateMotion dur={DUR} repeatCount="indefinite" rotate="auto" calcMode="linear" keyPoints={keyPoints} keyTimes={keyTimes}>
          <mpath href={`#${id}`} />
        </animateMotion>
        <Car color={color} />
      </g>
    </>
  );
}

export function TrackLoop({ variant = "hero", className }: { variant?: "hero" | "full"; className?: string }) {
  const full = variant === "full";
  const ref = useRef<SVGSVGElement>(null);

  // Reduced motion: stop the clock on the frame that tells the story on its own.
  useEffect(() => {
    const svg = ref.current;
    if (!svg || !window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    svg.pauseAnimations();
    svg.setCurrentTime(18 * 0.75);
  }, []);

  return (
    <svg
      ref={ref}
      viewBox={full ? "0 0 724 500" : "140 14 444 470"}
      className={className}
      role="img"
      aria-label="The Agent Pit Stop loop: the agent laps on its own, pits for an eval, and goes back out only after a person approves."
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* ---------------------------------------------------------- circuit */}
      <path d={CIRCUIT} fill="none" stroke="var(--color-line)" strokeWidth="33" strokeLinejoin="round" />
      {KERBS.map((d) => (
        <g key={d}>
          <path d={d} fill="none" stroke="var(--color-chalk)" strokeWidth="38" opacity="0.75" />
          <path d={d} fill="none" stroke="var(--color-flag)" strokeWidth="38" strokeDasharray="5 5" opacity="0.9" />
        </g>
      ))}
      <path d={CIRCUIT} fill="none" stroke="var(--color-asphalt)" strokeWidth="30" strokeLinejoin="round" />
      <path d={CIRCUIT} fill="none" stroke="var(--color-line)" strokeWidth="1" strokeDasharray="6 7" opacity="0.9" />

      {/* start / finish, on the main straight */}
      <g transform="translate(326 315)">
        {Array.from({ length: 8 }, (_, i) => (
          <rect key={i} x={(i % 2) * 7} y={Math.floor(i / 2) * 7.5} width="7" height="7.5"
            fill={(i + Math.floor(i / 2)) % 2 ? "var(--color-track)" : "var(--color-chalk)"} />
        ))}
      </g>

      {/* direction of travel, on the top straight */}
      <g stroke="var(--color-ash)" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round" opacity="0.85">
        <path d="M 486 33 l -7 7 l 7 7" />
        <path d="M 470 33 l -7 7 l 7 7" />
      </g>

      {/* ---------------------------------------------------------- pit lane and garages */}
      <path d={PIT_LANE} fill="none" stroke="var(--color-line)" strokeWidth="19" />
      <path d={PIT_LANE} fill="none" stroke="var(--color-asphalt)" strokeWidth="16" />
      <path d={PIT_LANE} fill="none" stroke="var(--color-line)" strokeWidth="1" strokeDasharray="3 5" opacity="0.7" />
      {Object.entries(BAYS).map(([car, x]) => (
        <g key={car}>
          <rect x={x - 21} y="367" width="42" height="23" rx="3" fill="var(--color-carbon)" stroke="var(--color-line)" />
          {/* each garage's light: off, then lit while its car's moment is on */}
          <circle cx={x + 16} cy="371.5" r="2.2" fill="var(--color-line)" />
        </g>
      ))}
      {/* blue: lit while the eval runs; green: lit once approved */}
      <circle cx={BAYS.blue + 16} cy="371.5" r="2.2" fill={BLUE} opacity="0">
        <Between from={T.evalStart} to={T.greenIn} />
      </circle>
      <circle cx={BAYS.green + 16} cy="371.5" r="2.2" fill="var(--color-signal)" opacity="0">
        <Between from={T.approve} to={T.greenIn} />
      </circle>

      {/* the eval: two pulses out from the blue car while the orange car sits in the pit */}
      <circle cx={BAYS.blue} cy={BAY_Y} r="12" fill="none" stroke={BLUE} strokeWidth="1.5" opacity="0">
        <animate attributeName="r" dur={DUR} repeatCount="indefinite" values="12;12;12;26;12;26;12;12"
          keyTimes={`0;${T.evalStart};${T.evalStart};0.48;0.48;0.54;0.54;1`} />
        <animate attributeName="opacity" dur={DUR} repeatCount="indefinite" values="0;0;0.8;0;0.8;0;0;0"
          keyTimes={`0;${T.evalStart};${T.evalStart};0.48;0.48;0.54;0.54;1`} />
      </circle>

      {/* the blue car stays in: it's the check, not a runner */}
      <g transform={`translate(${BAYS.blue} ${BAY_Y})`}>
        <Car color={BLUE} />
      </g>

      {/* ---------------------------------------------------------- the human, at the pit wall */}
      <rect x="247" y="398" width="230" height="74" rx="10" fill="var(--color-asphalt)" stroke="var(--color-line)" />
      {full && (
        <g className="font-mono">
          <text x="262" y="416" fontSize="10.5" fontWeight="600" fill="var(--color-chalk)">
            PIT · HUMAN IN THE LOOP
          </text>
          {/* what's happening now, in words: one line at a time */}
          <text x="262" y="431" fontSize="9.5" fill="var(--color-smoke)" opacity="1">
            Agent on track
            <animate attributeName="opacity" values="1;0;1" keyTimes={`0;${T.pitIn};${T.greenIn}`} calcMode="discrete" dur={DUR} repeatCount="indefinite" />
          </text>
          <text x="262" y="431" fontSize="9.5" fill={BLUE} opacity="0">
            Pit stop · eval running
            <Between from={T.pitIn} to={T.approve} />
          </text>
          <text x="262" y="431" fontSize="9.5" fill="var(--color-signal)" opacity="0">
            Approved · green car out
            <Between from={T.approve} to={T.greenIn} />
          </text>
        </g>
      )}

      {/* pit light: off, amber while waiting on the check, green once approved */}
      <circle cx="462" cy="412" r="4.5" fill="var(--color-line)" />
      <circle cx="462" cy="412" r="4.5" fill="var(--color-caution)" opacity="0">
        <Between from={T.pitIn} to={T.approve} />
      </circle>
      <circle cx="462" cy="412" r="4.5" fill="var(--color-signal)" opacity="0">
        <Between from={T.approve} to={T.greenIn} />
      </circle>
      <circle cx="462" cy="412" r="8" fill="var(--color-signal)" opacity="0">
        <animate attributeName="opacity" values="0;0;0.25;0.25;0" keyTimes={`0;${T.approve};${T.approve + 0.005};${T.greenIn};1`} dur={DUR} repeatCount="indefinite" />
      </circle>

      {/* Approve: pressed once, then it stays green until the green car is home */}
      <g>
        <rect x="262" y="441" width="64" height="19" rx="6" fill="var(--color-pit)" />
        <rect x="262" y="441" width="64" height="19" rx="6" fill="var(--color-signal)" opacity="0">
          <Between from={T.approve} to={T.greenIn} />
        </rect>
        {/* the press: a ring that springs out from the button */}
        <rect x="262" y="441" width="64" height="19" rx="6" fill="none" stroke="var(--color-signal)" strokeWidth="2" opacity="0">
          <animate attributeName="opacity" values="0;0;0.9;0;0" keyTimes={`0;${T.approve - 0.002};${T.approve};${T.approve + 0.03};1`} dur={DUR} repeatCount="indefinite" />
        </rect>
        {full && (
          <text x="294" y="454" textAnchor="middle" fontSize="10" fontWeight="600" fill="var(--color-track)">
            Approve
          </text>
        )}
      </g>
      <rect x="332" y="441" width="44" height="19" rx="6" fill="none" stroke="var(--color-line)" />
      {full && (
        <text x="354" y="454" textAnchor="middle" fontSize="10" fill="var(--color-smoke)">
          Deny
        </text>
      )}
      <line x1="388" y1="450.5" x2="462" y2="450.5" stroke="var(--color-line)" strokeWidth="2" strokeLinecap="round" />
      <circle cx="430" cy="450.5" r="4.5" fill="var(--color-pit)" />

      <g transform="translate(228 424)">
        <circle cx="0" cy="0" r="5.5" fill="var(--color-chalk)" />
        <path d="M -8 16 C -8 8 8 8 8 16 Z" fill="var(--color-chalk)" />
        {full && (
          <text x="0" y="30" textAnchor="middle" fontSize="10" fill="var(--color-smoke)">
            you
          </text>
        )}
      </g>

      {/* ---------------------------------------------------------- the runners */}
      <Stint id="stint-orange" x={BAYS.orange} color="var(--color-pit)" start={0} end={T.pitIn} />
      <Stint id="stint-green" x={BAYS.green} color="var(--color-signal)" start={T.greenOut} end={T.greenIn} />

      {/* ---------------------------------------------------------- callouts */}
      {full && (
        <g className="font-mono">
          {/* 1 sits in the infield, right above the start line */}
          <text x="333" y="286" textAnchor="middle" fontSize="11.5" fontWeight="600" fill="var(--color-chalk)">
            1 · Contract before the lap
          </text>
          <text x="333" y="300" textAnchor="middle" fontSize="10.5" fill="var(--color-smoke)">
            Approval Gate · scope agreed
          </text>

          <line x1="578" y1="146" x2="592" y2="140" stroke="var(--color-line)" strokeWidth="1" />
          <text x="596" y="138" fontSize="11.5" fontWeight="600" fill="var(--color-chalk)">
            2 · Legible lap
          </text>
          <text x="596" y="153" fontSize="10.5" fill="var(--color-smoke)">
            Tool Calls
          </text>
          <text x="596" y="166" fontSize="10.5" fill="var(--color-smoke)">
            Task List
          </text>

          <line x1="242" y1="348" x2="210" y2="400" stroke="var(--color-line)" strokeWidth="1" />
          <text x="206" y="410" textAnchor="end" fontSize="11.5" fontWeight="600" fill="var(--color-chalk)">
            3 · Pit trigger
          </text>
          <text x="206" y="424" textAnchor="end" fontSize="10.5" fill="var(--color-smoke)">
            Low confidence · failure
          </text>
          <text x="206" y="437" textAnchor="end" fontSize="10.5" fill="var(--color-smoke)">
            or your stop
          </text>

          <text x="362" y="492" textAnchor="middle" fontSize="10.5" fill="var(--color-smoke)">
            4 · Approve · Steer · Verify
          </text>

          <line x1="466" y1="348" x2="496" y2="400" stroke="var(--color-line)" strokeWidth="1" />
          <text x="500" y="410" fontSize="11.5" fontWeight="600" fill="var(--color-chalk)">
            5 · Resume
          </text>
          <text x="500" y="424" fontSize="10.5" fill="var(--color-smoke)">
            new plan accepted,
          </text>
          <text x="500" y="437" fontSize="10.5" fill="var(--color-smoke)">
            partial work kept
          </text>
        </g>
      )}
    </svg>
  );
}
