import { describe, expect, it } from "vitest";
import { notchPath } from "./notch";

/** Pull the end points (M/L targets and arc end points) out of a path() value. */
function points(clip: string) {
  const tokens = clip.slice(6, -2).split(" ");
  const pts: [number, number][] = [];
  for (let i = 0; i < tokens.length; i++) {
    if (tokens[i] === "M" || tokens[i] === "L") {
      pts.push([+tokens[i + 1], +tokens[i + 2]]);
      i += 2;
    } else if (tokens[i] === "A") {
      pts.push([+tokens[i + 6], +tokens[i + 7]]);
      i += 7;
    }
  }
  return pts;
}

describe("notched shape", () => {
  it("is a closed path inside the box", () => {
    const clip = notchPath(400, 300);
    expect(clip.startsWith("path('M")).toBe(true);
    expect(clip.endsWith("Z')")).toBe(true);
    for (const [x, y] of points(clip)) {
      expect(x).toBeGreaterThanOrEqual(0);
      expect(x).toBeLessThanOrEqual(400);
      expect(y).toBeGreaterThanOrEqual(0);
      expect(y).toBeLessThanOrEqual(300);
    }
  });

  it("cuts the top-left corner: nothing on the top edge left of the notch", () => {
    const pts = points(notchPath(400, 300, "tl"));
    const onTop = pts.filter(([, y]) => y === 0).map(([x]) => x);
    expect(Math.min(...onTop)).toBeGreaterThan(400 * 0.36 - 1);
  });

  it("mirrors to the bottom-right corner", () => {
    const pts = points(notchPath(400, 300, "br"));
    const onBottom = pts.filter(([, y]) => y === 300).map(([x]) => x);
    expect(Math.max(...onBottom)).toBeLessThan(400 - 400 * 0.36 + 1);
  });

  it("keeps small boxes sane", () => {
    expect(() => notchPath(40, 30)).not.toThrow();
    for (const [x, y] of points(notchPath(40, 30))) {
      expect(Number.isFinite(x) && Number.isFinite(y)).toBe(true);
    }
  });
});
