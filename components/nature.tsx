/**
 * Hand-drawn nature motifs for Saldus: forestry (pine branch), agriculture (wheat
 * ear), a leafy twig, and the "circuit leaf" whose veins are circuit traces, the
 * meeting point of nature and IT/AI/cybersecurity. All decorative (aria-hidden),
 * drawn in the theme tokens with the same 2px ink edge as the sticker shapes.
 */

const EDGE = "var(--color-edge)";
const GREEN = "var(--color-primary-fill)";
const ORANGE = "var(--color-accent)";

type Pt = [number, number];

/** Point and tangent angle (degrees) on a quadratic Bézier curve. */
function onCurve(p0: Pt, p1: Pt, p2: Pt, t: number): { x: number; y: number; angle: number } {
  const u = 1 - t;
  const x = u * u * p0[0] + 2 * u * t * p1[0] + t * t * p2[0];
  const y = u * u * p0[1] + 2 * u * t * p1[1] + t * t * p2[1];
  const dx = 2 * u * (p1[0] - p0[0]) + 2 * t * (p2[0] - p1[0]);
  const dy = 2 * u * (p1[1] - p0[1]) + 2 * t * (p2[1] - p1[1]);
  return { x, y, angle: (Math.atan2(dy, dx) * 180) / Math.PI };
}

const r1 = (n: number) => Math.round(n * 10) / 10;

/** A leaf pointing up from (0,0): length 40, width 32. */
const LEAF = "M0 0C-16-12-9.6-34 0-40 9.6-34 16-12 0 0Z";

/** A curved twig with alternating green and orange leaves. */
export function LeafSprig({ className = "w-40" }: { className?: string }) {
  const p0: Pt = [30, 190];
  const p1: Pt = [40, 100];
  const p2: Pt = [118, 44];
  const leaves = [0.18, 0.3, 0.42, 0.54, 0.66, 0.78, 0.9];
  return (
    <svg viewBox="0 0 160 200" className={className} aria-hidden="true" fill="none">
      <path d={`M${p0[0]} ${p0[1]}Q${p1[0]} ${p1[1]} ${p2[0]} ${p2[1]}`} stroke={EDGE} strokeWidth="3" strokeLinecap="round" />
      {leaves.map((t, i) => {
        const { x, y, angle } = onCurve(p0, p1, p2, t);
        const side = i % 2 ? 1 : -1;
        const scale = 1.15 - t * 0.45;
        return (
          <g key={t} transform={`translate(${r1(x)} ${r1(y)}) rotate(${r1(angle + 90 + side * 55)}) scale(${r1(scale * 10) / 10})`}>
            <path d={LEAF} fill={i % 3 === 1 ? ORANGE : GREEN} stroke={EDGE} strokeWidth="2" strokeLinejoin="round" />
            <path d="M0-3V-34" stroke={EDGE} strokeWidth="1.5" strokeLinecap="round" opacity=".55" />
          </g>
        );
      })}
      <g transform={`translate(${p2[0]} ${p2[1]}) rotate(55)`}>
        <path d={LEAF} fill={GREEN} stroke={EDGE} strokeWidth="2" strokeLinejoin="round" />
      </g>
    </svg>
  );
}

/** A pine branch (forestry): needles along a gentle curve and one cone. */
export function PineBranch({ className = "w-48" }: { className?: string }) {
  const p0: Pt = [8, 120];
  const p1: Pt = [90, 70];
  const p2: Pt = [206, 66];
  const needles: { x: number; y: number; angle: number; len: number }[] = [];
  for (let i = 0; i <= 30; i++) {
    const t = 0.03 + i * 0.032;
    const pt = onCurve(p0, p1, p2, t);
    needles.push({ ...pt, len: (30 - t * 14) * (i % 2 ? 0.86 : 1) });
  }
  const line = (x: number, y: number, deg: number, len: number) => {
    const a = (deg * Math.PI) / 180;
    return `M${r1(x)} ${r1(y)}l${r1(Math.cos(a) * len)} ${r1(Math.sin(a) * len)}`;
  };
  const cone = onCurve(p0, p1, p2, 0.42);
  return (
    <svg viewBox="0 0 240 170" className={className} aria-hidden="true" fill="none">
      <path
        d={needles.map((n) => line(n.x, n.y, n.angle - 38, n.len) + line(n.x, n.y, n.angle + 38, n.len)).join("")}
        stroke={GREEN}
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path d={`M${p0[0]} ${p0[1]}Q${p1[0]} ${p1[1]} ${p2[0]} ${p2[1]}`} stroke={EDGE} strokeWidth="3.5" strokeLinecap="round" />
      <g transform={`translate(${r1(cone.x)} ${r1(cone.y + 6)})`}>
        <path d="M0 0v10" stroke={EDGE} strokeWidth="2.5" strokeLinecap="round" />
        <ellipse cx="0" cy="34" rx="15" ry="25" fill={ORANGE} stroke={EDGE} strokeWidth="2" />
        <path d="M-13 24q13 7 26 0M-14 36q14 7 28 0M-11 48q11 6 22 0" stroke={EDGE} strokeWidth="1.6" strokeLinecap="round" />
      </g>
    </svg>
  );
}

/** A wheat ear (agriculture): paired grains with awns on a slightly bent stalk. */
export function WheatEar({ className = "h-48" }: { className?: string }) {
  const grains: { x: number; y: number; rot: number }[] = [];
  for (let i = 0; i < 6; i++) {
    const y = 128 - i * 17;
    const x = 52 + i * 0.8;
    grains.push({ x: x - 9, y, rot: -28 }, { x: x + 9, y, rot: 28 });
  }
  grains.push({ x: 57, y: 20, rot: 0 });
  return (
    <svg viewBox="0 0 110 230" className={className} aria-hidden="true" fill="none">
      <path d="M50 226C52 196 52 170 54 140" stroke={EDGE} strokeWidth="3.5" strokeLinecap="round" />
      <path d="M52 196C34 186 22 166 20 146" stroke={EDGE} strokeWidth="2.5" strokeLinecap="round" />
      <path d="M52 196C34 186 22 166 20 146C36 152 48 170 52 196Z" fill={GREEN} stroke={EDGE} strokeWidth="2" strokeLinejoin="round" />
      {grains.map((g, i) => {
        const a = ((g.rot - 90) * Math.PI) / 180;
        const tipX = g.x + Math.cos(a) * 11;
        const tipY = g.y + Math.sin(a) * 11;
        const awnA = ((g.rot * 1.5 - 90) * Math.PI) / 180;
        return (
          <g key={i}>
            <path
              d={`M${r1(tipX)} ${r1(tipY)}l${r1(Math.cos(awnA) * 30)} ${r1(Math.sin(awnA) * 30)}`}
              stroke={EDGE}
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            <ellipse cx={g.x} cy={g.y} rx="7" ry="12" transform={`rotate(${g.rot} ${g.x} ${g.y})`} fill={ORANGE} stroke={EDGE} strokeWidth="2" />
          </g>
        );
      })}
    </svg>
  );
}

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
