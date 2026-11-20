import { describe, expect, it } from "vitest";
import { hallLayout, hallStands, innovatorStandLimit, type HallRect } from "@/config/event";

const cells = (r: HallRect) => {
  const out: string[] = [];
  for (let c = r.col; c < r.col + r.w; c++) for (let row = r.row; row < r.row + r.h; row++) out.push(`${c},${row}`);
  return out;
};

describe("hall layout", () => {
  it("keeps every stand, the stage and the innovator zone inside the hall", () => {
    for (const r of [...hallStands, hallLayout.stage, hallLayout.innovatorZone]) {
      expect(r.col).toBeGreaterThanOrEqual(0);
      expect(r.row).toBeGreaterThanOrEqual(0);
      expect(r.col + r.w).toBeLessThanOrEqual(hallLayout.cols);
      expect(r.row + r.h).toBeLessThanOrEqual(hallLayout.rows);
    }
  });

  it("gives each stand the footprint of its size", () => {
    const area = { S: 1, M: 2, L: 4 } as const;
    for (const s of hallStands) {
      expect(s.w * s.h).toBe(area[s.size]);
      if (s.size === "L") expect([s.w, s.h]).toEqual([2, 2]);
    }
  });

  it("has no overlaps between stands, the stage and the innovator zone", () => {
    const seen = new Map<string, string>();
    const place = (name: string, r: HallRect) => {
      for (const cell of cells(r)) {
        expect(seen.get(cell), `${name} overlaps ${seen.get(cell)} at ${cell}`).toBeUndefined();
        seen.set(cell, name);
      }
    };
    hallStands.forEach((s) => place(`stand ${s.number}`, s));
    place("stage", hallLayout.stage);
    place("innovator zone", hallLayout.innovatorZone);
  });

  it("keeps the doorway in the bottom wall clear", () => {
    const { entrance, rows } = hallLayout;
    const door = cells({ col: entrance.col, row: rows - 1, w: entrance.w, h: 1 });
    for (const s of hallStands) for (const cell of cells(s)) expect(door).not.toContain(cell);
  });

  it("divides the whole floor: 45 stands, every size present", () => {
    expect(hallStands).toHaveLength(45);
    expect(new Set(hallStands.map((s) => s.number)).size).toBe(hallStands.length);
    for (const size of ["S", "M", "L"] as const) expect(hallStands.some((s) => s.size === size)).toBe(true);
  });

  it("numbers stands row by row from the back-left corner", () => {
    const order = hallStands.map((s) => s.row * 100 + s.col);
    expect(order).toEqual([...order].sort((a, b) => a - b));
    expect(hallStands[0]).toMatchObject({ number: 1, row: 0, col: 0 });
  });

  it("fits all innovator places in their zone (four half-cell places per cell)", () => {
    const { w, h } = hallLayout.innovatorZone;
    expect(w * h * 4).toBeGreaterThanOrEqual(innovatorStandLimit);
  });
});
