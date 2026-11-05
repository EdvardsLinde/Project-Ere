import { describe, expect, it } from "vitest";
import { createFairSeed } from "@/lib/data/fair-seed";
import type { Exhibitor } from "@/lib/data/fair-types";
import { filterChallenges, filterExhibitors, filterShowcase, isInShowcase } from "./filters";
import { canTransition, exhibitorFlow, meetingFlow, teamFlow, transition } from "./status";

const seed = createFairSeed();

describe("exhibitor directory filters", () => {
  it("filters by sector, size and seeking investment, hiding rejected", () => {
    const rejected: Exhibitor = { ...seed.exhibitors[0], id: "x", status: "rejected" };
    const list = [...seed.exhibitors, rejected];
    expect(filterExhibitors(list).some((e) => e.id === "x")).toBe(false);
    expect(filterExhibitors(list, { sector: "forestry" }).every((e) => e.sector === "forestry")).toBe(true);
    expect(filterExhibitors(list, { size: "innovator" }).every((e) => e.stand.size === "innovator")).toBe(true);
    expect(filterExhibitors(list, { seekingInvestment: true }).every((e) => !!e.investment)).toBe(true);
  });
});

describe("investment showcase", () => {
  it("lists only exhibitors with an investment section that are not rejected", () => {
    const items = filterShowcase(seed.exhibitors);
    expect(items.length).toBeGreaterThan(0);
    expect(items.every(isInShowcase)).toBe(true);
    const rejected = { ...items[0], status: "rejected" as const };
    expect(isInShowcase(rejected)).toBe(false);
  });

  it("filters by sector, stage and amount range", () => {
    const bySector = filterShowcase(seed.exhibitors, { sector: "agriculture" });
    expect(bySector.map((e) => e.name)).toEqual(["AgroSense"]);
    expect(filterShowcase(seed.exhibitors, { stage: "operating" }).map((e) => e.name)).toEqual(["TimberTrack"]);
    expect(filterShowcase(seed.exhibitors, { amount: "upTo50k" }).map((e) => e.name)).toEqual(["RouteMate"]);
    expect(filterShowcase(seed.exhibitors, { sector: "logistics", stage: "operating" })).toEqual([]);
  });
});

describe("challenges filter", () => {
  it("returns all challenges without a field and matching ones with it", () => {
    expect(filterChallenges(seed.challenges)).toHaveLength(seed.challenges.length);
    expect(filterChallenges(seed.challenges, "cyber").every((c) => c.field === "cyber")).toBe(true);
  });
});

describe("status transitions", () => {
  it("allows only forward moves", () => {
    expect(canTransition(exhibitorFlow, "submitted", "approved")).toBe(true);
    expect(canTransition(exhibitorFlow, "approved", "rejected")).toBe(false);
    expect(canTransition(meetingFlow, "pending", "declined")).toBe(true);
    expect(canTransition(meetingFlow, "declined", "accepted")).toBe(false);
    expect(canTransition(teamFlow, "applied", "accepted")).toBe(true);
    expect(canTransition(teamFlow, "applied", "presenting")).toBe(false);
  });

  it("throws on an invalid change", () => {
    expect(transition(meetingFlow, "pending", "accepted")).toBe("accepted");
    expect(() => transition(meetingFlow, "accepted", "declined")).toThrow();
  });
});
