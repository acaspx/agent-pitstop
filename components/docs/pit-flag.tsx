/**
 * PitFlag — Agent Pit Stop logo mark.
 * A checkered flag as a halftone sticker: die-cut white border hugging
 * the shapes, fine dot-pattern checks, dotted black pole, film grain,
 * and a slow SMIL cloth ripple. Pure SVG, no JS.
 */

const WAVE_A =
  "M10 7.5 C 16.5 5, 23 10.5, 29.5 8 C 36 5.5, 42.5 10.5, 49 8 L 49 26 C 42.5 28.5, 36 23.5, 29.5 26 C 23 28.5, 16.5 23.5, 10 26 Z";
const WAVE_B =
  "M10 7.5 C 16.5 10.5, 23 5, 29.5 8 C 36 11, 42.5 5.5, 49 8 L 49 26 C 42.5 23, 36 28.5, 29.5 26 C 23 23.5, 16.5 28.5, 10 26 Z";

function ClothAnimate() {
  return (
    <animate
      attributeName="d"
      values={`${WAVE_A};${WAVE_B};${WAVE_A}`}
      dur="5s"
      repeatCount="indefinite"
      calcMode="spline"
      keySplines="0.45 0 0.55 1;0.45 0 0.55 1"
    />
  );
}

export function PitFlag({ size = 22, className }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size * (50 / 54)}
      viewBox="0 0 54 50"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
      style={{ transform: "rotate(-3deg)" }}
    >
      <defs>
        {/* fine halftone for dark checks */}
        <pattern
          id="pf-halftone"
          width="1.5"
          height="1.5"
          patternUnits="userSpaceOnUse"
          patternTransform="rotate(15)"
        >
          <rect width="1.5" height="1.5" fill="#f4f2ec" />
          <circle cx="0.75" cy="0.75" r="0.56" fill="#17171a" />
        </pattern>
        {/* micro dot grid for the black pole */}
        <pattern
          id="pf-poledots"
          width="1.8"
          height="1.8"
          patternUnits="userSpaceOnUse"
          patternTransform="rotate(15)"
        >
          <rect width="1.8" height="1.8" fill="#17171a" />
          <circle cx="0.9" cy="0.9" r="0.34" fill="#f4f2ec" />
        </pattern>
        <clipPath id="pf-cloth">
          <path d={WAVE_A}>
            <ClothAnimate />
          </path>
        </clipPath>
        {/* grain clips to flag + pole only */}
        <clipPath id="pf-shapes">
          <path d={WAVE_A}>
            <ClothAnimate />
          </path>
          <rect x="6" y="4" width="3.6" height="41" rx="1.8" />
        </clipPath>
        <filter id="pf-grain" x="-5%" y="-5%" width="110%" height="110%">
          <feTurbulence type="fractalNoise" baseFrequency="1.2" numOctaves="2" seed="7" result="n" />
          <feColorMatrix
            in="n"
            type="matrix"
            values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0.5 0.5 0.5 0 -0.62"
          />
        </filter>
      </defs>

      {/* soft paper shadow */}
      <g transform="translate(1.4 1.8)" opacity="0.35">
        <rect x="6" y="4" width="3.6" height="41" rx="1.8" fill="#000" stroke="#000" strokeWidth="4" />
        <path d={WAVE_A} fill="#000" stroke="#000" strokeWidth="4" strokeLinejoin="round">
          <ClothAnimate />
        </path>
      </g>

      {/* white die-cut hugging the shapes */}
      <rect x="6" y="4" width="3.6" height="41" rx="1.8" fill="#f4f2ec" stroke="#f4f2ec" strokeWidth="4" />
      <path d={WAVE_A} fill="#f4f2ec" stroke="#f4f2ec" strokeWidth="4" strokeLinejoin="round">
        <ClothAnimate />
      </path>

      {/* pole: black with small dot grid */}
      <rect x="6" y="4" width="3.6" height="41" rx="1.8" fill="url(#pf-poledots)" stroke="#17171a" strokeWidth="1" />

      {/* checker cloth, waving */}
      <g clipPath="url(#pf-cloth)">
        <rect x="10" y="2" width="39" height="30" fill="#f4f2ec" />
        {[0, 1, 2].map((row) =>
          [0, 1, 2].map((col) =>
            (row + col) % 2 === 0 ? (
              <rect
                key={`${row}-${col}`}
                x={10 + col * 13}
                y={2 + row * 10}
                width="13"
                height="10"
                fill="url(#pf-halftone)"
              />
            ) : null,
          ),
        )}
      </g>

      {/* ink outline of the cloth, waving in sync */}
      <path d={WAVE_A} stroke="#17171a" strokeWidth="1.4" strokeLinejoin="round" fill="none">
        <ClothAnimate />
      </path>

      {/* film grain over flag + pole */}
      <g clipPath="url(#pf-shapes)">
        <rect x="0" y="0" width="54" height="50" filter="url(#pf-grain)" fill="#17171a" opacity="0.26" />
      </g>
    </svg>
  );
}
