import { describe, expect, it } from "vitest";
import { buildLandscape, smoothPath } from "./key-visual";

describe("key visual", () => {
  const opts = { width: 640, height: 520, seed: 7, cols: 5, rows: 4, nodes: 3 };

  it("is deterministic for a seed", () => {
    expect(buildLandscape(opts)).toEqual(buildLandscape(opts));
    expect(buildLandscape({ ...opts, seed: 8 })).not.toEqual(buildLandscape(opts));
  });

  it("tiles the whole picture with cols × rows fields", () => {
    const l = buildLandscape(opts);
    expect(l.parcels).toHaveLength(20);
    const xs = l.parcels.flatMap((p) => p.points.map((pt) => pt.x));
    const ys = l.parcels.flatMap((p) => p.points.map((pt) => pt.y));
    expect(Math.min(...xs)).toBeLessThanOrEqual(0);
    expect(Math.max(...xs)).toBeGreaterThanOrEqual(640);
    expect(Math.min(...ys)).toBeLessThanOrEqual(0);
    expect(Math.max(...ys)).toBeGreaterThanOrEqual(520);
  });

  it("keeps innovation points and their links inside the frame", () => {
    for (const seed of [1, 7, 21, 99]) {
      const l = buildLandscape({ ...opts, seed });
      expect(l.nodes.length).toBeGreaterThan(0);
      expect(l.nodes.length).toBeLessThanOrEqual(3);
      for (const p of [...l.nodes, ...l.links.map((k) => k.to)]) {
        expect(p.x).toBeGreaterThan(0);
        expect(p.x).toBeLessThan(640);
        expect(p.y).toBeGreaterThan(0);
        expect(p.y).toBeLessThan(520);
      }
    }
  });

  it("draws the road as one smooth path", () => {
    const d = smoothPath([
      { x: 0, y: 0 },
      { x: 10, y: 5 },
      { x: 20, y: 0 },
    ]);
    expect(d.startsWith("M0 0")).toBe(true);
    expect(d.match(/C/g)).toHaveLength(2);
    expect(d.endsWith("20 0")).toBe(true);
  });
});
