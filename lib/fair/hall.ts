/**
 * Geometry of the floor plan (config/hall.ts): innovator booth positions,
 * overlap checks and the location notes shown when a place is chosen.
 */
import { hallPlan, type HallRect } from "@/config/hall";

/** Location notes, best first. Labels: messages `stands.highlights`. */
export type Highlight = "innovatorZone" | "nearStage" | "nearEntrance" | "wall";

export const rectsOverlap = (a: HallRect, b: HallRect) =>
  a.col < b.col + b.w && b.col < a.col + a.w && a.row < b.row + b.h && b.row < a.row + a.h;

/** Shortest distance between two rectangles, in cells (0 when they touch or overlap). */
export function rectGap(a: HallRect, b: HallRect): number {
  const dx = Math.max(0, Math.max(a.col, b.col) - Math.min(a.col + a.w, b.col + b.w));
  const dy = Math.max(0, Math.max(a.row, b.row) - Math.min(a.row + a.h, b.row + b.h));
  return Math.hypot(dx, dy);
}

/** Where innovator booth `index` (1–16) sits: 8 per row, top row first. */
export function innovatorSlotRect(index: number): HallRect {
  const z = hallPlan.hall.innovatorZone;
  const i = index - 1;
  const w = z.w / z.cols;
  const h = z.h / z.rows;
  return { col: z.col + (i % z.cols) * w, row: z.row + Math.floor(i / z.cols) * h, w, h };
}

/** The doorway, as a rectangle on the front row. */
export function entranceRect(): HallRect {
  const { entrance, rows } = hallPlan.hall;
  return { col: entrance.col, row: rows - 1, w: entrance.w, h: 1 };
}

/** What is good about a place's location, best first. */
export function placeHighlights(rect: HallRect, isInnovator = false): Highlight[] {
  const { stage, cols, rows } = hallPlan.hall;
  const out: Highlight[] = [];
  if (isInnovator) out.push("innovatorZone");
  if (rectGap(rect, stage) <= 1.5) out.push("nearStage");
  if (rectGap(rect, entranceRect()) <= 1.5) out.push("nearEntrance");
  if (!isInnovator && (rect.col <= 0 || rect.row <= 0 || rect.col + rect.w >= cols || rect.row + rect.h >= rows)) out.push("wall");
  return out;
}
