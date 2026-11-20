import { describe, expect, it } from "vitest";
import { innovatorStandLimit } from "@/config/event";
import { standsOfSize } from "@/config/hall";
import type { Exhibitor } from "@/lib/data/types";
import {
  bookingToExhibitor,
  emptyStandRequest,
  requestToExhibitor,
  validateStandRequest,
  emptyInnovator,
  emptyMeeting,
  emptyStandBooking,
  emptyTeam,
  innovatorToExhibitor,
  meetingFromInput,
  needsGuardianConsent,
  teamFromInput,
  validateInnovator,
  validateMeeting,
  validateStandBooking,
  validateTeam,
  type StandBookingInput,
} from "./forms";

/** A small stand that no demo exhibitor uses. */
const S4 = standsOfSize("S")[10];

const NOW = "2026-11-05T10:00:00.000Z";

function validBooking(): StandBookingInput {
  return {
    ...emptyStandBooking(),
    name: "Mežs un Tehnika SIA",
    address: "Saldus",
    sector: "forestry",
    description: "Meža tehnikas serviss.",
    contactName: "Anna Ozola",
    email: "anna@example.lv",
    size: "S",
    number: S4,
    showcase: "Jauns harvestera simulators",
  };
}

describe("stand booking validation", () => {
  it("passes a complete booking", () => {
    expect(validateStandBooking(validBooking(), [])).toEqual({});
  });

  it("requires the starred fields", () => {
    const e = validateStandBooking(emptyStandBooking(), []);
    for (const k of ["name", "address", "sector", "description", "contactName", "email", "size", "showcase"]) {
      expect(e[k]).toBe("required");
    }
  });

  it("asks which adjacent field and checks email, phone and website", () => {
    const e = validateStandBooking(
      { ...validBooking(), sector: "adjacent", email: "nope", phone: "12", website: "not a site" },
      [],
    );
    expect(e.adjacentNote).toBe("required");
    expect(e.email).toBe("email");
    expect(e.phone).toBe("phone");
    expect(e.website).toBe("url");
  });

  it("rejects a taken stand or one of another size, and no days", () => {
    const taken = [{ stand: { size: "S" as const, number: S4, days: [1 as const], needs: [] }, status: "submitted" as const }];
    expect(validateStandBooking(validBooking(), taken).number).toBe("standTaken");
    expect(validateStandBooking({ ...validBooking(), number: standsOfSize("L")[0] }, []).number).toBe("standTaken");
    expect(validateStandBooking({ ...validBooking(), number: null }, taken)).toEqual({});
    expect(validateStandBooking({ ...validBooking(), days: [] }, []).days).toBe("noDays");
  });

  it("requires section D only when looking for investment", () => {
    const withGoal = { ...validBooking(), goals: ["investment" as const] };
    const e = validateStandBooking(withGoal, []);
    expect(e["investment.amountRange"]).toBe("required");
    expect(e["investment.purpose"]).toBe("required");
    expect(e["investment.where"]).toBe("required");
    expect(e["investment.stage"]).toBe("required");
    expect(e["investment.offer"]).toBeUndefined();
  });
});

describe("booking to exhibitor", () => {
  it("stores a submitted, non-example record and drops section D without the goal", () => {
    const input = { ...validBooking(), investment: { amountRange: "upTo50k" as const, purpose: "x", where: "y", stage: "idea" as const, offer: "" } };
    const ex = bookingToExhibitor(input, "exh_1", NOW);
    expect(ex.status).toBe("submitted");
    expect(ex.isExample).toBe(false);
    expect(ex.investment).toBeUndefined();
    expect(ex.stand).toEqual({ size: "S", number: S4, days: [1, 2, 3], needs: [] });
  });

  it("keeps section D when looking for investment, so it enters the showcase", () => {
    const input: StandBookingInput = {
      ...validBooking(),
      goals: ["investment"],
      investment: { amountRange: "50kTo200k", purpose: " Jauna līnija ", where: "Saldus", stage: "operating", offer: "Daļas" },
    };
    const ex = bookingToExhibitor(input, "exh_2", NOW);
    expect(ex.investment).toEqual({ amountRange: "50kTo200k", purpose: "Jauna līnija", where: "Saldus", stage: "operating", offer: "Daļas" });
  });
});

describe("innovator stand", () => {
  const valid = { ...emptyInnovator(), name: "Jānis", title: "Skaidu prese", description: "Prese", sector: "forestry" as const, email: "j@example.lv" };

  it("validates required fields and the remaining places", () => {
    expect(validateInnovator(valid, [])).toEqual({});
    const full: Pick<Exhibitor, "stand" | "status">[] = Array.from({ length: innovatorStandLimit }, () => ({
      stand: { size: "innovator", days: [2], needs: [] },
      status: "submitted",
    }));
    expect(validateInnovator(valid, full).spots).toBe("noSpots");
    const e = validateInnovator(emptyInnovator(), []);
    expect(e.title).toBe("required");
    expect(e.sector).toBe("required");
  });

  it("becomes a free innovator stand", () => {
    const ex = innovatorToExhibitor({ ...valid, lookingFor: ["mentors"], stage: "idea" }, "exh_3", NOW);
    expect(ex.stand.size).toBe("innovator");
    expect(ex.goals).toEqual(["mentors"]);
    expect(ex.stage).toBe("idea");
    expect(ex.status).toBe("submitted");
  });
});

describe("meeting request", () => {
  it("requires name, organisation and message, and a valid time", () => {
    expect(validateMeeting(emptyMeeting())).toEqual({ name: "required", organisation: "required", message: "required" });
    const ok = { ...emptyMeeting(), name: "A", organisation: "Fonds", message: "Sveiki", time: "14:30" };
    expect(validateMeeting(ok)).toEqual({});
    expect(validateMeeting({ ...ok, time: "25:00" }).time).toBe("time");
  });

  it("is created pending", () => {
    const m = meetingFromInput({ ...emptyMeeting(), name: "A", organisation: "B", message: "C", day: 2 }, "exh_1", "mtg_1", NOW);
    expect(m.status).toBe("pending");
    expect(m.day).toBe(2);
    expect(m.time).toBeUndefined();
  });
});

describe("school team", () => {
  const valid = {
    ...emptyTeam(),
    school: "Saldus tehnikums",
    teamName: "Datu vilki",
    members: [
      { name: "Elza", age: "18" },
      { name: "Kārlis", age: "19" },
    ],
    mentor: "Skolotāja Liepa",
    contact: "team@example.lv",
  };

  it("accepts 2–5 adult members without guardian consent", () => {
    expect(validateTeam(valid)).toEqual({});
  });

  it("needs guardian consent when anyone is under 18", () => {
    const minors = { ...valid, members: [...valid.members, { name: "Toms", age: "16" }] };
    expect(needsGuardianConsent(minors.members)).toBe(true);
    expect(validateTeam(minors).guardianConsent).toBe("guardianConsent");
    expect(validateTeam({ ...minors, guardianConsent: true })).toEqual({});
  });

  it("checks team size and member ages", () => {
    expect(validateTeam({ ...valid, members: [{ name: "Viens", age: "17" }] }).members).toBe("teamSize");
    const six = Array.from({ length: 6 }, (_, i) => ({ name: `M${i}`, age: "18" }));
    expect(validateTeam({ ...valid, members: six }).members).toBe("teamSize");
    const e = validateTeam({ ...valid, members: [{ name: "", age: "x" }, { name: "B", age: "40" }] });
    expect(e["members.0.name"]).toBe("required");
    expect(e["members.0.age"]).toBe("age");
    expect(e["members.1.age"]).toBe("age");
  });

  it("stores numeric ages and keeps consent only when needed", () => {
    const t = teamFromInput(valid, "chl_1", "team_1", NOW);
    expect(t.members[0].age).toBe(18);
    expect(t.guardianConsent).toBeUndefined();
    expect(t.status).toBe("applied");
  });
});

describe("quick application from the floor plan", () => {
  const free = standsOfSize("M")[5];
  const filled = (place: Parameters<typeof emptyStandRequest>[0]) => ({
    ...emptyStandRequest(place),
    company: "Kokzāģētava SIA",
    sector: "forestry" as const,
    contactName: "Jānis Bērziņš",
    email: "janis@example.lv",
    phone: "+371 20000000",
  });

  it("passes a complete application and checks each field", () => {
    expect(validateStandRequest(filled({ kind: "stand", number: free }), [])).toEqual({});
    const e = validateStandRequest(emptyStandRequest({ kind: "stand", number: free }), []);
    for (const k of ["company", "sector", "contactName", "email", "phone"]) expect(e[k]).toBe("required");
    expect(validateStandRequest({ ...filled({ kind: "stand", number: free }), regNo: "123" }, []).regNo).toBe("regNo");
    expect(validateStandRequest({ ...filled({ kind: "stand", number: free }), regNo: "400 0303 2949" }, [])).toEqual({});
  });

  it("refuses a taken stand or innovator place", () => {
    const taken = [{ stand: { size: "M" as const, number: free, days: [1 as const], needs: [] }, status: "submitted" as const }];
    expect(validateStandRequest(filled({ kind: "stand", number: free }), taken).place).toBe("standTaken");
    expect(validateStandRequest(filled({ kind: "stand", number: 999 }), []).place).toBe("standTaken");
    const innovator = [{ stand: { size: "innovator" as const, number: 3, days: [2 as const], needs: [] }, status: "submitted" as const }];
    expect(validateStandRequest(filled({ kind: "innovator", index: 3 }), innovator).place).toBe("standTaken");
    expect(validateStandRequest(filled({ kind: "innovator", index: 4 }), innovator)).toEqual({});
  });

  it("stores a submitted record for that place", () => {
    const ex = requestToExhibitor({ ...filled({ kind: "innovator", index: 7 }), regNo: "400 0303 2949", needs: ["power"] }, "exh_q", NOW);
    expect(ex.status).toBe("submitted");
    expect(ex.regNo).toBe("40003032949");
    expect(ex.stand).toEqual({ size: "innovator", number: 7, days: [2], needs: ["power"] });
    const paid = requestToExhibitor(filled({ kind: "stand", number: free }), "exh_p", NOW);
    expect(paid.stand.size).toBe("M");
    expect(paid.stand.days).toEqual([1, 2, 3]);
  });
});

