/**
 * DEMO MODE data layer — everything is stored in this browser's localStorage.
 *
 * ⚠️ NOT SECURE and not shared: other browsers and devices start from the seed
 * data. When storage is blocked (private mode, sandboxed previews) the data
 * lives in memory for the visit instead of failing.
 */
import {
  bookingToExhibitor,
  innovatorToExhibitor,
  meetingFromInput,
  teamFromInput,
  validateInnovator,
  validateMeeting,
  validateStandBooking,
  validateTeam,
  type InnovatorInput,
  type MeetingInput,
  type StandBookingInput,
  type TeamInput,
} from "@/lib/fair/forms";
import { canTransition, meetingFlow } from "@/lib/fair/status";
import { DataError, type DataRepository } from "./repository";
import { createSeedDatabase, DB_VERSION } from "./seed";
import type { FairDatabase } from "./types";
import { newId } from "./util";

const DB_KEY = "seer:fair";

const isQuotaError = (e: unknown) =>
  e instanceof DOMException && (e.name === "QuotaExceededError" || e.name === "NS_ERROR_DOM_QUOTA_REACHED");

export class LocalStorageRepository implements DataRepository {
  private db: FairDatabase | null = null;
  private listeners = new Set<() => void>();

  constructor() {
    if (typeof window !== "undefined") {
      window.addEventListener("storage", (e) => {
        if (e.key === DB_KEY) {
          this.db = null;
          this.emit();
        }
      });
    }
  }

  // Storage ------------------------------------------------------------

  private load(): FairDatabase {
    if (this.db) return this.db;
    let parsed: FairDatabase | null = null;
    try {
      const raw = window.localStorage.getItem(DB_KEY);
      if (raw) parsed = JSON.parse(raw) as FairDatabase;
    } catch {
      parsed = null; // blocked or corrupt: start from the seed
    }
    if (!parsed || parsed.version !== DB_VERSION || !Array.isArray(parsed.exhibitors)) {
      parsed = createSeedDatabase();
      this.db = parsed;
      this.persist();
    }
    this.db = parsed;
    return parsed;
  }

  /** Saves to localStorage; when storage is blocked the in-memory copy is kept. */
  private persist() {
    try {
      window.localStorage.setItem(DB_KEY, JSON.stringify(this.db));
    } catch (e) {
      if (isQuotaError(e)) throw new DataError("storageFull");
    }
  }

  private commit<T>(fn: (db: FairDatabase) => T): T {
    const db = this.load();
    const result = fn(db);
    this.persist();
    this.emit();
    return result;
  }

  private emit() {
    for (const l of this.listeners) l();
  }

  subscribe(listener: () => void) {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private now() {
    return new Date().toISOString();
  }

  // Stands -------------------------------------------------------------

  async listExhibitors() {
    return [...this.load().exhibitors];
  }

  async getExhibitor(id: string) {
    return this.load().exhibitors.find((e) => e.id === id) ?? null;
  }

  async submitStand(input: StandBookingInput) {
    return this.commit((db) => {
      const errors = validateStandBooking(input, db.exhibitors);
      if (errors.number === "standTaken") throw new DataError("standTaken");
      if (Object.keys(errors).length) throw new DataError("invalid");
      const exhibitor = bookingToExhibitor(input, newId("exh"), this.now());
      db.exhibitors.push(exhibitor);
      db.mine.exhibitors.push(exhibitor.id);
      return exhibitor;
    });
  }

  async submitInnovator(input: InnovatorInput) {
    return this.commit((db) => {
      const errors = validateInnovator(input, db.exhibitors);
      if (errors.spots) throw new DataError("noSpots");
      if (Object.keys(errors).length) throw new DataError("invalid");
      const exhibitor = innovatorToExhibitor(input, newId("exh"), this.now());
      db.exhibitors.push(exhibitor);
      db.mine.exhibitors.push(exhibitor.id);
      return exhibitor;
    });
  }

  // Meetings -----------------------------------------------------------

  async listMeetings() {
    return [...this.load().meetings];
  }

  async requestMeeting(exhibitorId: string, input: MeetingInput) {
    return this.commit((db) => {
      const exhibitor = db.exhibitors.find((e) => e.id === exhibitorId);
      if (!exhibitor || !exhibitor.investment || exhibitor.status === "rejected") throw new DataError("notFound");
      if (Object.keys(validateMeeting(input)).length) throw new DataError("invalid");
      const meeting = meetingFromInput(input, exhibitorId, newId("mtg"), this.now());
      db.meetings.push(meeting);
      db.mine.meetings.push(meeting.id);
      return meeting;
    });
  }

  async answerMeeting(id: string, status: "accepted" | "declined") {
    return this.commit((db) => {
      const meeting = db.meetings.find((m) => m.id === id);
      if (!meeting) throw new DataError("notFound");
      if (!canTransition(meetingFlow, meeting.status, status)) throw new DataError("invalidState");
      meeting.status = status;
      return { ...meeting };
    });
  }

  // School challenge -----------------------------------------------------

  async listChallenges() {
    return [...this.load().challenges];
  }

  async getChallenge(id: string) {
    return this.load().challenges.find((c) => c.id === id) ?? null;
  }

  async listTeams() {
    return [...this.load().teams];
  }

  async applyTeam(challengeId: string, input: TeamInput) {
    return this.commit((db) => {
      if (!db.challenges.some((c) => c.id === challengeId)) throw new DataError("notFound");
      if (Object.keys(validateTeam(input)).length) throw new DataError("invalid");
      const team = teamFromInput(input, challengeId, newId("team"), this.now());
      db.teams.push(team);
      db.mine.teams.push(team.id);
      return team;
    });
  }

  // Programme ------------------------------------------------------------

  async listAgenda() {
    return [...this.load().agenda].sort((a, b) => a.day - b.day || a.time.localeCompare(b.time));
  }

  // This browser -----------------------------------------------------------

  async getMine() {
    const { mine } = this.load();
    return { exhibitors: [...mine.exhibitors], meetings: [...mine.meetings], teams: [...mine.teams] };
  }

  async listSaved() {
    return [...this.load().saved];
  }

  async toggleSaved(exhibitorId: string) {
    return this.commit((db) => {
      const i = db.saved.indexOf(exhibitorId);
      if (i === -1) db.saved.push(exhibitorId);
      else db.saved.splice(i, 1);
      return i === -1;
    });
  }

  // Demo -----------------------------------------------------------------

  async resetDemoData() {
    this.db = createSeedDatabase();
    this.persist();
    this.emit();
  }
}
