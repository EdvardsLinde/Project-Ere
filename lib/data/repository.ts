import type { InnovatorInput, MeetingInput, StandBookingInput, TeamInput } from "@/lib/fair/forms";
import type { AgendaItem, Challenge, Exhibitor, FairDatabase, MeetingRequest, TeamApplication } from "./types";

/**
 * The only way pages and components touch data.
 *
 * `LocalStorageRepository` (demo mode) implements it today; a real backend can
 * implement the same interface later without changing any page. Every method
 * is async for that reason. Methods validate their input again and throw
 * `DataError` with a stable `code`; the UI maps codes to `messages.errors[code]`.
 */
export interface DataRepository {
  // Stands -------------------------------------------------------------
  /** Paid and innovator stands, including examples. */
  listExhibitors(): Promise<Exhibitor[]>;
  getExhibitor(id: string): Promise<Exhibitor | null>;
  /** Books a paid stand (status `submitted`; with section D it also enters the showcase). */
  submitStand(input: StandBookingInput): Promise<Exhibitor>;
  /** Applies for a free innovator stand. */
  submitInnovator(input: InnovatorInput): Promise<Exhibitor>;

  // Meetings -----------------------------------------------------------
  listMeetings(): Promise<MeetingRequest[]>;
  requestMeeting(exhibitorId: string, input: MeetingInput): Promise<MeetingRequest>;
  /** The exhibitor accepts or declines a pending request. */
  answerMeeting(id: string, status: "accepted" | "declined"): Promise<MeetingRequest>;

  // School challenge -----------------------------------------------------
  listChallenges(): Promise<Challenge[]>;
  getChallenge(id: string): Promise<Challenge | null>;
  listTeams(): Promise<TeamApplication[]>;
  applyTeam(challengeId: string, input: TeamInput): Promise<TeamApplication>;

  // Programme ------------------------------------------------------------
  listAgenda(): Promise<AgendaItem[]>;

  // This browser -----------------------------------------------------------
  /** Ids of what this browser created (there are no accounts). */
  getMine(): Promise<FairDatabase["mine"]>;
  listSaved(): Promise<string[]>;
  /** Saves or unsaves a showcase item; returns whether it is saved now. */
  toggleSaved(exhibitorId: string): Promise<boolean>;

  // Demo -----------------------------------------------------------------
  resetDemoData(): Promise<void>;

  /** Called after any change (also from other tabs). Returns an unsubscribe function. */
  subscribe(listener: () => void): () => void;
}

export type DataErrorCode = "notFound" | "invalid" | "standTaken" | "noSpots" | "invalidState" | "storageFull";

export class DataError extends Error {
  constructor(public code: DataErrorCode) {
    super(code);
    this.name = "DataError";
  }
}
