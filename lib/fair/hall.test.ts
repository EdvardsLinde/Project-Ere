import { describe, expect, it } from "vitest";
import { innovatorStandLimit, standTypes } from "@/config/event";
import { hallPlan, hallStands, type HallRect } from "@/config/hall";
import { entranceRect, innovatorSlotRect, placeHighlights, rectsOverlap } from "./hall";

const { hall } = hallPlan;
const byId = (id: number) => hallStands.find((s) => s.id === id)!;

describe("floor plan layout", () => {
  it("has the 21 stands of the plan: L 1–3, M 4–9, S 10–21", () => {
    expect(hallStands.map((s) => s.id)).toEqual(Array.from({ length: 21 }, (_, i) => i + 1));
    expect(hallStands.filter((s) => s.size === "L").map((s) => s.id)).toEqual([1, 2, 3]);
    expect(hallStands.filter((s) => s.size === "M").map((s) => s.id)).toEqual([4, 5, 6, 7, 8, 9]);
    expect(hallStands.filter((s) => s.size === "S").map((s) => s.id)).toEqual([10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21]);
  });

  it("splits the hall into two equal halves at the curtain", () => {
    expect(hall.curtainRow * 2).toBe(hall.rows);
  });

  it("puts each group where the plan says", () => {
    const rear = (id: number) => byId(id).row + byId(id).h <= hall.curtainRow;
    const front = (id: number) => byId(id).row >= hall.curtainRow;
    // Behind the curtain: L 1–3 top-left, M 4–6 top-right, S 10–12 left wall, S 14–16 right wall.
    for (const id of [1, 2, 3, 4, 5, 6, 10, 11, 12, 14, 15, 16]) expect(rear(id)).toBe(true);
    expect([1, 2, 3].every((id) => byId(id).row === 0 && byId(id).col < hall.cols / 2)).toBe(true);
    expect([4, 5, 6].every((id) => byId(id).row === 0 && byId(id).col >= hall.cols / 2)).toBe(true);
    expect([10, 11, 12].every((id) => byId(id).col === 0)).toBe(true);
    expect([14, 15, 16].every((id) => byId(id).col + byId(id).w === hall.cols)).toBe(true);
    // In front: S 13 / S 17 on the side walls, the bottom row either side of the entrance.
    for (const id of [7, 8, 9, 13, 17, 18, 19, 20, 21]) expect(front(id)).toBe(true);
    expect(byId(13).col).toBe(0);
    expect(byId(17).col + byId(17).w).toBe(hall.cols);
    const door = entranceRect();
    expect([7, 8, 18].every((id) => byId(id).row === hall.rows - 1 && byId(id).col + byId(id).w <= door.col)).toBe(true);
    expect([19, 9, 20, 21].every((id) => byId(id).row === hall.rows - 1 && byId(id).col >= door.col + door.w)).toBe(true);
  });

  it("keeps everything inside the hall without overlaps, and the doorway clear", () => {
    const rects: [string, HallRect][] = [
      ...hallStands.map((s) => [`stand ${s.id}`, s] as [string, HallRect]),
      ["stage", hall.stage],
      ["innovator zone", hall.innovatorZone],
    ];
    for (const [, r] of rects) {
      expect(r.col).toBeGreaterThanOrEqual(0);
      expect(r.row).toBeGreaterThanOrEqual(0);
      expect(r.col + r.w).toBeLessThanOrEqual(hall.cols);
      expect(r.row + r.h).toBeLessThanOrEqual(hall.rows);
    }
    for (let i = 0; i < rects.length; i++)
      for (let j = i + 1; j < rects.length; j++) expect(rectsOverlap(rects[i][1], rects[j][1]), `${rects[i][0]} / ${rects[j][0]}`).toBe(false);
    for (const s of hallStands) expect(rectsOverlap(s, entranceRect())).toBe(false);
  });

  it("puts the stage behind the curtain and the innovator zone just in front of it", () => {
    expect(hall.stage.row + hall.stage.h).toBeLessThanOrEqual(hall.curtainRow);
    expect(hall.innovatorZone.row).toBeGreaterThanOrEqual(hall.curtainRow);
    expect(hall.innovatorZone.row - hall.curtainRow).toBeLessThan(1);
  });

  it("has 16 innovator booths in a 2 × 8 grid inside the zone", () => {
    expect(hallPlan.innovatorSlots).toHaveLength(innovatorStandLimit);
    expect(hall.innovatorZone.cols * hall.innovatorZone.rows).toBe(innovatorStandLimit);
    const z = hall.innovatorZone;
    for (const slot of hallPlan.innovatorSlots) {
      const r = innovatorSlotRect(slot.index);
      expect(r.col).toBeGreaterThanOrEqual(z.col - 1e-9);
      expect(r.row).toBeGreaterThanOrEqual(z.row - 1e-9);
      expect(r.col + r.w).toBeLessThanOrEqual(z.col + z.w + 1e-9);
      expect(r.row + r.h).toBeLessThanOrEqual(z.row + z.h + 1e-9);
    }
    expect(innovatorSlotRect(9).row).toBeGreaterThan(innovatorSlotRect(8).row);
  });

  it("fills dimensions and prices from the stand types", () => {
    for (const s of hallStands) {
      expect(s.priceEUR).toBe(standTypes[s.size].price);
      expect(s.areaM2).toBe(standTypes[s.size].width * standTypes[s.size].depth);
      expect(s.dimensions).toBe(`${standTypes[s.size].width} × ${standTypes[s.size].depth} m`);
    }
  });
});

describe("location notes", () => {
  it("names stands near the stage and by the entrance", () => {
    expect(placeHighlights(byId(3))).toContain("nearStage");
    expect(placeHighlights(byId(18))).toContain("nearEntrance");
    expect(placeHighlights(byId(19))).toContain("nearEntrance");
    expect(placeHighlights(byId(13))).not.toContain("nearStage");
    expect(placeHighlights(byId(10))).toEqual(["wall"]);
  });

  it("marks innovator booths as innovator zone, near the stage", () => {
    expect(placeHighlights(innovatorSlotRect(1), true).slice(0, 2)).toEqual(["innovatorZone", "nearStage"]);
  });
});
