/**
 * SEER Expo floor plan: the hall of Saldus sporta skola, seen from the main
 * spectator seating (bottom of the plan).
 *
 * THIS IS THE ONE PLACE TO EDIT STANDS. Move a stand, change its size, or set
 * `status` / `exhibitorName` for a deal made outside the website. Bookings made
 * on the website are layered on top: they can make a place more taken
 * (free → reserved → sold), never free it again.
 * Prices and stand dimensions come from `standTypes` in config/event.ts.
 *
 * Units: one cell ≈ 3 m (the width of an S stand). The floor is 14 × 12 cells.
 * The curtain (open during the fair) runs across the middle: as much floor
 * behind it (rows 0–6) as in front of it (rows 6–12).
 *
 * Labels shown on the plan are translated in messages/lv.ts and messages/en.ts
 * (`stands.*`); the English meaning is noted next to each group below.
 */
import { innovatorStandLimit, standTypes, type StandSize } from "@/config/event";

/** free = Brīvs, reserved = Rezervēts, sold = Pārdots / aizņemts. */
export type PlaceStatus = "free" | "reserved" | "sold";
export type PaidSize = Exclude<StandSize, "innovator">;

/**
 * Where a place is, used for its location notes and grouping:
 * rearRow = back wall row, rearWall = side walls behind the curtain,
 * frontWall = side walls in front of the curtain, frontRow = front row by the
 * entrance, innovator = the innovator zone.
 */
export type HallZone = "rearRow" | "rearWall" | "frontWall" | "frontRow" | "innovator";

/** A rectangle on the plan, in cells. */
export interface HallRect {
  col: number;
  row: number;
  w: number;
  h: number;
}

export interface HallStand extends HallRect {
  /** Stand number shown on the plan. */
  id: number;
  zone: HallZone;
  size: PaidSize;
  /** e.g. "3 × 3 m" (from standTypes). */
  dimensions: string;
  /** Floor area in m². */
  areaM2: number;
  /** Provisional price for all three days, in euros (from standTypes). */
  priceEUR: number;
  /** Set by the organisers; website bookings are layered on top. */
  status: PlaceStatus;
  /** Who holds it, for a booking made outside the website (shown when sold). */
  exhibitorName?: string;
}

export interface InnovatorSlot {
  /** Shown as "I1" … "I16". */
  id: string;
  /** 1–16, left to right, top row first. */
  index: number;
  zone: "innovator";
  size: "innovator";
  dimensions: string;
  areaM2: number;
  priceEUR: number;
  status: PlaceStatus;
  exhibitorName?: string;
}

const FOOTPRINT: Record<PaidSize, { w: number; h: number }> = { L: { w: 2, h: 2 }, M: { w: 2, h: 1 }, S: { w: 1, h: 1 } };
const dimensions = (size: StandSize) => `${standTypes[size].width} × ${standTypes[size].depth} m`;
const area = (size: StandSize) => standTypes[size].width * standTypes[size].depth;

/** One paid stand: number, size, zone, top-left cell; optional organiser status. */
function stand(id: number, size: PaidSize, zone: HallZone, col: number, row: number, status: PlaceStatus = "free", exhibitorName?: string): HallStand {
  return { id, size, zone, col, row, ...FOOTPRINT[size], dimensions: dimensions(size), areaM2: area(size), priceEUR: standTypes[size].price, status, exhibitorName };
}

function innovatorSlot(index: number, status: PlaceStatus = "free", exhibitorName?: string): InnovatorSlot {
  return {
    id: `I${index}`,
    index,
    zone: "innovator",
    size: "innovator",
    dimensions: dimensions("innovator"),
    areaM2: area("innovator"),
    priceEUR: standTypes.innovator.price,
    status,
    exhibitorName,
  };
}

export const hallPlan = {
  hall: {
    cols: 14,
    rows: 12,
    /** The curtain line: the front half and the half behind it are the same size. */
    curtainRow: 6,
    /** Main stage (Galvenā skatuve), in the middle of the half behind the curtain. */
    stage: { col: 5, row: 2.5, w: 4, h: 2.6 } satisfies HallRect,
    /** Innovator zone (Inovatoru zona), just in front of the curtain line: 2 rows × 8 micro-booths. */
    innovatorZone: { col: 5, row: 6.4, w: 4, h: 1.4, cols: 8, rows: 2 },
    /** Entrance (Ieeja): the stairs through the spectator seating in the front wall. */
    entrance: { col: 6, w: 2 },
  },

  stands: [
    // Behind the curtain · back wall, left: three large stands (EN: rear half, top-left row)
    stand(1, "L", "rearRow", 0, 0),
    stand(2, "L", "rearRow", 2, 0),
    stand(3, "L", "rearRow", 4, 0),
    // Behind the curtain · back wall, right: three medium stands (EN: rear half, top-right row)
    stand(4, "M", "rearRow", 8, 0),
    stand(5, "M", "rearRow", 10, 0),
    stand(6, "M", "rearRow", 12, 0),
    // Front row by the entrance, medium (EN: bottom row)
    stand(7, "M", "frontRow", 1, 11),
    stand(8, "M", "frontRow", 3, 11),
    stand(9, "M", "frontRow", 9, 11),
    // Behind the curtain · left wall (EN: upper-left wall)
    stand(10, "S", "rearWall", 0, 3),
    stand(11, "S", "rearWall", 0, 4),
    stand(12, "S", "rearWall", 0, 5),
    // In front of the curtain · left wall (EN: mid-lower left wall)
    stand(13, "S", "frontWall", 0, 8),
    // Behind the curtain · right wall (EN: upper-right wall)
    stand(14, "S", "rearWall", 13, 3),
    stand(15, "S", "rearWall", 13, 4),
    stand(16, "S", "rearWall", 13, 5),
    // In front of the curtain · right wall (EN: mid-lower right wall)
    stand(17, "S", "frontWall", 13, 8),
    // Front row by the entrance, small (EN: bottom row)
    stand(18, "S", "frontRow", 5, 11),
    stand(19, "S", "frontRow", 8, 11),
    stand(20, "S", "frontRow", 11, 11),
    stand(21, "S", "frontRow", 12, 11),
  ] satisfies HallStand[],

  /** The 16 free innovator places (EN: innovator zone micro-booths). */
  innovatorSlots: Array.from({ length: innovatorStandLimit }, (_, i) => innovatorSlot(i + 1)) satisfies InnovatorSlot[],
};

/** The paid stands with `number` (= id), as the booking logic uses them. */
export const hallStands = hallPlan.stands.map((s) => ({ ...s, number: s.id }));

/** Stand numbers of one size, in number order (handy for examples and tests). */
export const standsOfSize = (size: PaidSize) => hallStands.filter((s) => s.size === size).map((s) => s.number);
