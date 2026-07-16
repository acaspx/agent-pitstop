/**
 * PitFlag — Agent Pit Stop logo mark.
 * A checkered flag reduced to its silhouette: only the dark checks,
 * skewed into a diagonal composition, waving via staggered column
 * ripples. Draws in currentColor. Pure SVG + SMIL, no JS.
 */

const COLS = 4;
const ROWS = 3;
const CELL_W = 11;
const CELL_H = 10;

/** ripple amplitude grows toward the flag's free edge */
const AMP = [0.7, 1.3, 1.9, 2.5];

export function PitFlag({ size = 22, className }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size * (44 / 56)}
      viewBox="0 0 56 44"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      <g transform="translate(12 9) skewX(-18) rotate(-7)">
        {Array.from({ length: COLS }, (_, col) => (
          <g key={col}>
            <animateTransform
              attributeName="transform"
              type="translate"
              values={`0 ${AMP[col]}; 0 ${-AMP[col]}; 0 ${AMP[col]}`}
              keyTimes="0; 0.5; 1"
              dur="2.8s"
              begin={`${-col * 0.35}s`}
              repeatCount="indefinite"
              calcMode="spline"
              keySplines="0.45 0 0.55 1; 0.45 0 0.55 1"
            />
            {Array.from({ length: ROWS }, (_, row) =>
              (row + col) % 2 === 0 ? (
                <rect
                  key={row}
                  x={col * CELL_W}
                  y={row * CELL_H}
                  width={CELL_W}
                  height={CELL_H}
                  fill="currentColor"
                />
              ) : null,
            )}
          </g>
        ))}
      </g>
    </svg>
  );
}
