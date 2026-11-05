/**
 * Geometry for the SEER Expo key visual: Saldus seen from above. Field parcels
 * (crop rows = agriculture, tree crowns = forestry, meadows, stubble), an orange
 * road along the field corners (logistics) and linked points on it (innovation).
 *
 * Pure and deterministic: the same options always give the same picture, so the
 * server render, the browser and the link preview image all match. Colours are
 * not decided here; see `components/key-visual.tsx` and `app/opengraph-image.tsx`.
 */

export type ParcelKind = "crop" | "forest" | "meadow" | "wheat";

export interface Point {
  x: number;
  y: number;
}

export interface Parcel {
  kind: ParcelKind;
  /** Which rotation of the kind's pattern to use (see `PATTERN_ANGLES`). */
  variant: number;
  points: Point[];
  center: Point;
}

export interface Landscape {
  width: number;
  height: number;
  parcels: Parcel[];
  /** Smooth SVG path for the road, left edge to right edge. */
  road: string;
  /** Points on the road that stand for innovation. */
  nodes: Point[];
  /** Dashed links from each node to nearby fields ("sensors"). */
  links: { from: Point; to: Point }[];
}

export interface LandscapeOptions {
  width: number;
  height: number;
  seed: number;
  cols?: number;
  rows?: number;
  /** Most innovation points to place on the road. */
  nodes?: number;
}

/** Pattern rotations per kind, in degrees. A parcel's `variant` indexes into these. */
export const PATTERN_ANGLES: Record<Exclude<ParcelKind, "meadow">, readonly number[]> = {
  crop: [18, -32, 64, 104],
  forest: [0, 30],
  wheat: [-20, 40],
};

/** Small seeded PRNG (mulberry32). */
function random(seed: number) {
  let s = seed | 0;
  return () => {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const r1 = (n: number) => Math.round(n * 10) / 10;

/** Catmull-Rom spline through the points, as cubic Bézier segments. */
export function smoothPath(pts: Point[]): string {
  let d = `M${r1(pts[0].x)} ${r1(pts[0].y)}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] ?? p2;
    d +=
      ` C${r1(p1.x + (p2.x - p0.x) / 6)} ${r1(p1.y + (p2.y - p0.y) / 6)}` +
      ` ${r1(p2.x - (p3.x - p1.x) / 6)} ${r1(p2.y - (p3.y - p1.y) / 6)}` +
      ` ${r1(p2.x)} ${r1(p2.y)}`;
  }
  return d;
}

export function buildLandscape({ width: W, height: H, seed, cols = 5, rows = 4, nodes: maxNodes = 4 }: LandscapeOptions): Landscape {
  const rand = random(seed);
  const bleed = 30;

  // Field corners on a jittered grid that bleeds past the edges.
  const P: Point[][] = [];
  for (let i = 0; i <= cols; i++) {
    P[i] = [];
    for (let j = 0; j <= rows; j++) {
      const edgeX = i === 0 || i === cols;
      const edgeY = j === 0 || j === rows;
      P[i][j] = {
        x: r1((i / cols) * (W + 2 * bleed) - bleed + (edgeX ? 0 : (rand() - 0.5) * (W / cols) * 0.45)),
        y: r1((j / rows) * (H + 2 * bleed) - bleed + (edgeY ? 0 : (rand() - 0.5) * (H / rows) * 0.45)),
      };
    }
  }

  const parcels: Parcel[] = [];
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      const t = rand();
      const kind: ParcelKind = t < 0.36 ? "crop" : t < 0.64 ? "forest" : t < 0.82 ? "meadow" : "wheat";
      const variant = kind === "meadow" ? 0 : Math.floor(rand() * PATTERN_ANGLES[kind].length);
      const points = [P[i][j], P[i + 1][j], P[i + 1][j + 1], P[i][j + 1]];
      const center = { x: r1(points.reduce((a, p) => a + p.x, 0) / 4), y: r1(points.reduce((a, p) => a + p.y, 0) / 4) };
      parcels.push({ kind, variant, points, center });
    }
  }

  // The road runs left to right through field corners, climbing at most one row per field.
  let row = Math.max(1, Math.min(rows - 1, Math.round(rows * 0.7)));
  const roadPoints: Point[] = [];
  for (let i = 0; i <= cols; i++) {
    roadPoints.push(P[i][row]);
    if (rand() < 0.5 && row > 1) row -= 1;
  }

  const margin = 30;
  const inside = (p: Point) => p.x > margin && p.x < W - margin && p.y > margin && p.y < H - margin;
  const nodes = roadPoints.slice(1, -1).filter(inside).slice(0, maxNodes);

  const links = nodes.flatMap((n) =>
    parcels
      .map((p) => p.center)
      .filter(inside)
      .sort((a, b) => Math.hypot(a.x - n.x, a.y - n.y) - Math.hypot(b.x - n.x, b.y - n.y))
      .slice(0, 2)
      .map((to) => ({ from: n, to })),
  );

  return { width: W, height: H, parcels, road: smoothPath(roadPoints), nodes, links };
}

export const polygonPoints = (pts: Point[]) => pts.map((p) => `${p.x},${p.y}`).join(" ");
