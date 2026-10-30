/**
 * The one drawn nature motif: the "circuit leaf", whose veins are circuit traces,
 * the meeting point of Saldus nature and IT/AI/cybersecurity. Real plants are
 * photos (components/photo.tsx). Decorative (aria-hidden), in the theme tokens
 * with the same 2px ink edge as the sticker shapes.
 */

const EDGE = "var(--color-edge)";
const GREEN = "var(--color-primary-fill)";
const ORANGE = "var(--color-accent)";

/**
 * The circuit leaf: a big leaf whose midrib and veins are circuit traces ending
 * in round nodes, nature meeting IT, AI and cybersecurity.
 */
export function CircuitLeaf({
  className = "w-48",
  fill = GREEN,
  trace = "#FFFFFF",
  node = ORANGE,
}: {
  className?: string;
  fill?: string;
  trace?: string;
  node?: string;
}) {
  const veins = [
    { y: 150, dx: 34, up: 18 },
    { y: 118, dx: 40, up: 20 },
    { y: 86, dx: 36, up: 18 },
    { y: 56, dx: 24, up: 14 },
  ];
  return (
    <svg viewBox="0 0 160 230" className={className} aria-hidden="true" fill="none">
      <path d="M80 226V196" stroke={EDGE} strokeWidth="4" strokeLinecap="round" />
      <path d="M80 198C20 168 12 70 80 10 148 70 140 168 80 198Z" fill={fill} stroke={EDGE} strokeWidth="2.5" strokeLinejoin="round" />
      <g stroke={trace} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <path d="M80 186V36" />
        {veins.flatMap((v) =>
          [-1, 1].map((s) => (
            <path key={`${v.y}${s}`} d={`M80 ${v.y}l${s * v.up} ${-v.up}h${s * (v.dx - v.up)}`} />
          )),
        )}
      </g>
      <g fill={node} stroke={EDGE} strokeWidth="2">
        <circle cx="80" cy="32" r="5" />
        {veins.flatMap((v) => [-1, 1].map((s) => <circle key={`${v.y}${s}`} cx={80 + s * v.dx} cy={v.y - v.up} r="4.5" />))}
      </g>
    </svg>
  );
}
