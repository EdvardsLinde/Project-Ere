import { describe, expect, it } from "vitest";
import { createFairSeed } from "./fair-seed";

/** The content rules from the brief. */
describe("seed data rules", () => {
  const db = createFairSeed();
  const realCompanies = ["PATA Saldus", "DELTA LV", "Warmeston", "Tērvete Food", "SC GRUPA"];

  it("marks every example as an example", () => {
    expect(db.exhibitors.every((e) => e.isExample)).toBe(true);
    expect(db.challenges.every((c) => c.isExample)).toBe(true);
    expect(db.agenda.every((a) => a.isExample)).toBe(true);
  });

  it("never lists a real company as looking for investment", () => {
    for (const e of db.exhibitors.filter((x) => realCompanies.includes(x.name))) {
      expect(e.investment).toBeUndefined();
      expect(e.goals).toEqual([]);
      expect(e.logoDataUrl).toBeUndefined();
      expect(e.status).toBe("submitted");
    }
  });

  it("has 4–5 school challenges and an agenda for all three days", () => {
    expect(db.challenges.length).toBeGreaterThanOrEqual(4);
    expect(db.challenges.length).toBeLessThanOrEqual(5);
    expect(new Set(db.agenda.map((a) => a.day))).toEqual(new Set([1, 2, 3]));
  });

  it("does not put two exhibitors on one stand", () => {
    const numbers = db.exhibitors.map((e) => e.stand.number).filter((n) => n !== undefined);
    expect(new Set(numbers).size).toBe(numbers.length);
  });
});
