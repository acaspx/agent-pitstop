/**
 * TrackLoop — the Agent Pit Stop system as a circuit.
 * The agent (abstract racecar) laps autonomously; the pit lane is where
 * humans approve, steer, and verify. Pure SVG + SMIL, no JS.
 *
 * variant="hero"  — compact, unlabeled, for the landing card
 * variant="full"  — numbered station callouts, for /how-it-works
 */

const LOOP =
  "M 340 62 H 480 A 92 92 0 0 1 572 154 V 158 A 92 92 0 0 1 480 250 H 200 A 92 92 0 0 1 108 158 V 154 A 92 92 0 0 1 200 62 H 340";
const PIT_LANE =
  "M 442 250 C 442 288 414 302 372 302 H 288 C 246 302 218 288 218 250";

function Car({ ghost = false }: { ghost?: boolean }) {
  return (
    <g opacity={ghost ? 0.95 : 1}>
      <rect x="-15" y="-4" width="3" height="8" fill="var(--color-pit)" />
      <path
        d="M -12 0 L -8 -3.5 L 3 -3.5 L 9 -1.5 L 14 0 L 9 1.5 L 3 3.5 L -8 3.5 Z"
        fill="var(--color-pit)"
      />
      <rect x="12" y="-3.5" width="2.5" height="7" fill="var(--color-pit)" />
      <rect x="-8" y="-7" width="5.5" height="3" rx="1" fill="var(--color-chalk)" />
      <rect x="-8" y="4" width="5.5" height="3" rx="1" fill="var(--color-chalk)" />
      <rect x="5" y="-7" width="5.5" height="3" rx="1" fill="var(--color-chalk)" />
      <rect x="5" y="4" width="5.5" height="3" rx="1" fill="var(--color-chalk)" />
      <circle cx="-2" cy="0" r="1.7" fill="var(--color-track)" />
    </g>
  );
}

export function TrackLoop({
  variant = "hero",
  className,
}: {
  variant?: "hero" | "full";
  className?: string;
}) {
  const full = variant === "full";

  return (
    <svg
      viewBox={full ? "0 0 680 470" : "84 26 512 400"}
      className={className}
      role="img"
      aria-label="The Agent Pit Stop loop: an agent laps autonomously; humans approve, steer, and verify at the pit."
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* track ring */}
      <path id="ap-loop" d={LOOP} fill="none" stroke="var(--color-asphalt)" strokeWidth="34" />
      <path
        d={LOOP}
        fill="none"
        stroke="var(--color-line)"
        strokeWidth="1"
        strokeDasharray="6 7"
        opacity="0.9"
      />

      {/* start/finish checkers */}
      <g transform="translate(332 45)" fill="var(--color-chalk)">
        <rect x="0" y="0" width="7" height="8.5" />
        <rect x="7" y="8.5" width="7" height="8.5" />
        <rect x="0" y="17" width="7" height="8.5" />
        <rect x="7" y="25.5" width="7" height="8.5" />
      </g>

      {/* direction chevrons */}
      <g
        stroke="var(--color-ash)"
        strokeWidth="1.6"
        fill="none"
        opacity="0.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M 560 118 l 6 7 l 6 -7" />
        <path d="M 560 140 l 6 7 l 6 -7" />
      </g>

      {/* pit lane */}
      <path d={PIT_LANE} fill="none" stroke="var(--color-asphalt)" strokeWidth="20" />
      <path
        d={PIT_LANE}
        fill="none"
        stroke="var(--color-line)"
        strokeWidth="1"
        strokeDasharray="3 5"
        opacity="0.7"
      />

      {/* pit box */}
      <rect
        x="252"
        y="322"
        width="176"
        height="86"
        rx="10"
        fill="var(--color-asphalt)"
        stroke="var(--color-line)"
      />
      <text
        x="340"
        y="342"
        textAnchor="middle"
        fontSize="11"
        fontWeight="600"
        fill="var(--color-chalk)"
        className="font-mono"
      >
        PIT · HUMAN IN THE LOOP
      </text>
      <rect x="266" y="352" width="62" height="20" rx="6" fill="var(--color-pit)" />
      <text
        x="297"
        y="365.5"
        textAnchor="middle"
        fontSize="10"
        fontWeight="600"
        fill="var(--color-track)"
      >
        Approve
      </text>
      <rect x="334" y="352" width="48" height="20" rx="6" fill="none" stroke="var(--color-line)" />
      <text x="358" y="365.5" textAnchor="middle" fontSize="10" fill="var(--color-smoke)">
        Deny
      </text>
      <line
        x1="266"
        y1="390"
        x2="382"
        y2="390"
        stroke="var(--color-line)"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <circle cx="330" cy="390" r="5" fill="var(--color-pit)" />
      <text x="392" y="394" fontSize="10" fill="var(--color-smoke)">
        steer
      </text>

      {/* human at the pit wall */}
      <g transform="translate(232 356)">
        <circle cx="0" cy="0" r="5.5" fill="var(--color-chalk)" />
        <path d="M -8 16 C -8 8 8 8 8 16 Z" fill="var(--color-chalk)" />
        <text x="0" y="30" textAnchor="middle" fontSize="10" fill="var(--color-smoke)">
          you
        </text>
      </g>

      {/* ghost car being serviced */}
      <g transform="translate(340 302) rotate(180)">
        <Car ghost />
      </g>

      {/* the agent, lapping */}
      <g>
        <animateMotion dur="9s" repeatCount="indefinite" rotate="auto">
          <mpath href="#ap-loop" />
        </animateMotion>
        <Car />
      </g>

      {full && (
        <g className="font-mono">
          <line x1="339" y1="40" x2="300" y2="24" stroke="var(--color-line)" strokeWidth="1" />
          <text x="292" y="20" textAnchor="end" fontSize="11.5" fontWeight="600" fill="var(--color-chalk)">
            1 · Contract before the lap
          </text>
          <text x="292" y="34" textAnchor="end" fontSize="10.5" fill="var(--color-smoke)">
            Approval Gate · scope agreed
          </text>

          <line x1="592" y1="122" x2="608" y2="112" stroke="var(--color-line)" strokeWidth="1" />
          <text x="610" y="108" fontSize="11.5" fontWeight="600" fill="var(--color-chalk)">
            2 · Legible lap
          </text>
          <text x="610" y="123" fontSize="10.5" fill="var(--color-smoke)">
            Tool Calls
          </text>
          <text x="610" y="136" fontSize="10.5" fill="var(--color-smoke)">
            Task List
          </text>

          <line x1="452" y1="270" x2="500" y2="296" stroke="var(--color-line)" strokeWidth="1" />
          <text x="504" y="294" fontSize="11.5" fontWeight="600" fill="var(--color-chalk)">
            3 · Pit trigger
          </text>
          <text x="504" y="308" fontSize="10.5" fill="var(--color-smoke)">
            Low confidence · failure
          </text>
          <text x="504" y="321" fontSize="10.5" fill="var(--color-smoke)">
            or your stop
          </text>

          <text x="340" y="430" textAnchor="middle" fontSize="10.5" fill="var(--color-smoke)">
            4 · Approve · Steer · Verify
          </text>

          <line x1="210" y1="272" x2="164" y2="296" stroke="var(--color-line)" strokeWidth="1" />
          <text x="160" y="296" textAnchor="end" fontSize="11.5" fontWeight="600" fill="var(--color-chalk)">
            5 · Resume
          </text>
          <text x="160" y="310" textAnchor="end" fontSize="10.5" fill="var(--color-smoke)">
            new plan accepted,
          </text>
          <text x="160" y="323" textAnchor="end" fontSize="10.5" fill="var(--color-smoke)">
            partial work kept
          </text>
        </g>
      )}
    </svg>
  );
}
