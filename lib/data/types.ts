import type { FocusAreaId, IndustryId, OpportunityId, OutputTypeId } from "@/config/site";

export type Locale = "lv" | "en";
export type Role = "student" | "company";

/**
 * Text that may be bilingual. Seed content is written in both languages;
 * content typed by a company in the builder is a plain string in one language.
 */
export type Text = string | { lv: string; en: string };

/** ISO date `YYYY-MM-DD` (no time zone). */
export type ISODate = string;
/** ISO timestamp. */
export type ISODateTime = string;

export interface User {
  id: string;
  email: string;
  /**
   * DEMO ONLY — NOT SECURE. A simple non-cryptographic hash so the password is
   * not stored in plain text. Anyone with access to the browser can read and
   * change localStorage. Replace with real auth (e.g. Supabase Auth).
   */
  passwordHash: string;
  role: Role;
  createdAt: ISODateTime;
}

export interface StudentProfile {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  birthDate: ISODate | "";
  schoolId: string;
  schoolOther: string;
  grade: string;
  interests: string[];
  bio: string;
}

export interface Address {
  street: string;
  town: string;
  parish: string;
  postcode: string;
}

export interface ContactPerson {
  name: string;
  position: string;
  email: string;
  phone: string;
}

export interface CompanyProfile {
  id: string;
  /** Owner account. `null` for seed companies that have no account yet. */
  userId: string | null;
  name: string;
  regNumber: string;
  industry: IndustryId | "";
  description: Text;
  employees: string;
  website: string;
  /** Data URL (base64) in demo mode. */
  logo: string;
  address: Address;
  directions: Text;
  contactPerson: ContactPerson;
  /**
   * Whether the company has confirmed participation. Seed companies are
   * `false`: their `contact` data must never be shown publicly.
   */
  confirmed: boolean;
  /** Internal contact details (from public sources). Not displayed while `confirmed` is false. */
  contact?: { emails: string[]; phones: string[]; note?: string };
  isSample: boolean;
}

export type PlacementStatus = "draft" | "published" | "closed" | "finished";

export interface PlacementTerm {
  id: string;
  start: ISODate;
  /** Calculated from `start` + placement length in working days. */
  end: ISODate;
  spots: number;
}

export interface DayPlanItem {
  title: Text;
  description: Text;
}

export type QuestionType = "short" | "long" | "yesno";
export interface ScreeningQuestion {
  id: string;
  text: Text;
  type: QuestionType;
}

export type SkillLevel = "none" | "basic" | "intermediate";
export type SelectionMethod = "first-come" | "review" | "interview";
export type WorkFormat = "onsite" | "hybrid";
export type WorkLanguage = "lv" | "en" | "ru";
export type EducationLevel = "secondary" | "vocational" | "university";

export interface Mentor {
  name: string;
  position: Text;
  bio: Text;
  /** Invented mentor for illustrative placements. */
  isSample: boolean;
}

export interface Compensation {
  none: boolean;
  stipend: boolean;
  stipendAmount: number | null;
  meals: boolean;
  travel: boolean;
}

/** Company details as shown on a placement (step 1 of the builder). */
export interface PlacementCompany {
  name: string;
  regNumber: string;
  industry: IndustryId | "";
  description: Text;
  employees: string;
  website: string;
  logo: string;
  address: Address;
  directions: Text;
  /** Visible only to approved participants. */
  contactPerson: ContactPerson;
}

export interface Placement {
  id: string;
  companyId: string;
  status: PlacementStatus;
  /** Illustrative example based on public info; company has not confirmed. */
  isSample: boolean;
  createdAt: ISODateTime;
  updatedAt: ISODateTime;
  publishedAt: ISODateTime | null;

  // Step 1 — company
  company: PlacementCompany;

  // Step 2 — basics
  title: Text;
  focusArea: FocusAreaId | "";
  lengthDays: 3 | 4 | 5;
  terms: PlacementTerm[];
  hoursFrom: string;
  hoursTo: string;
  format: WorkFormat;
  languages: WorkLanguage[];
  ageFrom: number;
  ageTo: number;
  educationLevels: EducationLevel[];
  beginnerFriendly: boolean;

  // Step 3 — task
  problem: Text;
  outputType: OutputTypeId | "";
  outputDescription: Text;
  dayPlan: DayPlanItem[];
  tools: string[];
  dataSystems: Text;
  ndaRequired: boolean;

  // Step 4 — requirements
  skillsRequired: Text[];
  skillsNice: Text[];
  skillLevel: SkillLevel;
  bring: Text[];
  safetyBriefing: boolean;
  ppe: Text;
  minorRestrictions: Text;
  parentalConsentRequired: boolean;

  // Step 5 — what the participant gets
  mentor: Mentor;
  recognisesCertificate: boolean;
  compensation: Compensation;
  opportunities: OpportunityId[];
  opportunitiesOther: Text;

  // Step 6 — applications
  /** Applications for each date range close this many days before its start. */
  deadlineDays: number;
  requireCv: boolean;
  requireMotivation: boolean;
  questions: ScreeningQuestion[];
  selectionMethod: SelectionMethod;
}

export type ApplicationStatus = "new" | "approved" | "rejected" | "completed";

export interface Evaluation {
  problemSolving: number;
  data: number;
  communication: number;
  independence: number;
  responsibility: number;
  comment: string;
  evaluatedAt: ISODateTime;
}

export interface ApplicantDetails {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  birthDate: ISODate;
  school: string;
  grade: string;
}

export interface Application {
  id: string;
  placementId: string;
  studentId: string;
  termId: string;
  status: ApplicationStatus;
  submittedAt: ISODateTime;
  updatedAt: ISODateTime;
  applicant: ApplicantDetails;
  motivation: string;
  answers: { questionId: string; value: string }[];
  /** Demo mode stores only metadata, not the file itself. */
  cv: { name: string; size: number } | null;
  guardian: { name: string; phone: string; email: string; consent: boolean } | null;
  dataConsent: boolean;
  evaluation: Evaluation | null;
  certificateId: string | null;
}

export interface Certificate {
  /** e.g. `SDS-2026-0001` */
  id: string;
  applicationId: string;
  placementId: string;
  studentId: string;
  issuedAt: ISODateTime;
  participantName: string;
  companyName: string;
  placementTitle: Text;
  focusArea: FocusAreaId | "";
  start: ISODate;
  end: ISODate;
  days: number;
  outputType: OutputTypeId | "";
  output: Text;
  evaluation: Evaluation;
  mentor: { name: string; position: Text };
}

/** The whole demo database, as stored in localStorage. */
export interface DemoDatabase {
  version: number;
  users: User[];
  students: StudentProfile[];
  companies: CompanyProfile[];
  placements: Placement[];
  applications: Application[];
  certificates: Certificate[];
  /** Running counter per year for certificate IDs. */
  certificateCounters: Record<string, number>;
}

export interface Session {
  user: User;
  student: StudentProfile | null;
  company: CompanyProfile | null;
}
