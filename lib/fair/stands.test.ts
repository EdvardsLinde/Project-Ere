import { describe, expect, it } from "vitest";
import { hallStands, innovatorStandLimit } from "@/config/event";
import type { Exhibitor } from "@/lib/data/fair-types";
import { freeStands, innovatorSpotsLeft, isStandAvailable, standArea, standPrice, standSizeOf, standStates } from "./stands";

const holder = (number: number | undefined, status: Exhibitor["status"], size: Exhibitor["stand"]["size"] = "S") => ({
  stand: { size, number, days: [1], needs: [] } as Exhibitor["stand"],
  status,
});

describe("stand prices", () => {
  it("uses the placeholder table and keeps innovator stands free", () => {
    expect(standPrice("S")).toBe(250);
    expect(standPrice("M")).toBe(450);
    expect(standPrice("L")).toBe(800);
    expect(standPrice("innovator")).toBe(0);
  });

  it("computes floor areas", () => {
    expect(standArea("S")).toBe(9);
    expect(standArea("M")).toBe(18);
    expect(standArea("L")).toBe(36);
    expect(standArea("innovator")).toBe(4);
  });
});

describe("stand availability", () => {
  it("marks approved as sold, submitted as reserved and ignores rejected", () => {
    const states = standStates([holder(1, "approved", "L"), holder(4, "submitted", "M"), holder(10, "rejected")]);
    expect(states.get(1)).toBe("sold");
    expect(states.get(4)).toBe("reserved");
    expect(states.get(10)).toBe("free");
    expect(states.size).toBe(hallStands.length);
  });

  it("keeps sold over reserved when two exhibitors name the same stand", () => {
    expect(standStates([holder(12, "submitted"), holder(12, "approved")]).get(12)).toBe("sold");
  });

  it("accepts only an existing, free stand of the chosen size", () => {
    const taken = [holder(12, "submitted")];
    expect(isStandAvailable(13, "S", taken)).toBe(true);
    expect(isStandAvailable(12, "S", taken)).toBe(false);
    expect(isStandAvailable(1, "S", taken)).toBe(false);
    expect(isStandAvailable(999, "S", taken)).toBe(false);
  });

  it("lists free stands of one size and looks up sizes", () => {
    const freeL = freeStands("L", [holder(1, "approved", "L")]);
    expect(freeL).toEqual(hallStands.filter((s) => s.size === "L" && s.number !== 1).map((s) => s.number));
    expect(standSizeOf(1)).toBe("L");
    expect(standSizeOf(999)).toBeUndefined();
  });

  it("counts innovator places left, never below zero", () => {
    const innovators = (n: number, status: Exhibitor["status"] = "submitted") =>
      Array.from({ length: n }, () => holder(undefined, status, "innovator"));
    expect(innovatorSpotsLeft([])).toBe(innovatorStandLimit);
    expect(innovatorSpotsLeft([...innovators(3), holder(12, "submitted")])).toBe(innovatorStandLimit - 3);
    expect(innovatorSpotsLeft(innovators(2, "rejected"))).toBe(innovatorStandLimit);
    expect(innovatorSpotsLeft(innovators(innovatorStandLimit + 4))).toBe(0);
  });
});
