import type {
  Application,
  ApplicationStatus,
  Certificate,
  CompanyProfile,
  Evaluation,
  Placement,
  PlacementStatus,
  Session,
  StudentProfile,
} from "./types";

/**
 * The only way pages and components touch data.
 *
 * `LocalStorageRepository` (demo mode) implements it today; a
 * `SupabaseRepository` can implement the same interface later without
 * changing any page or component. Every method is async for that reason.
 *
 * Methods throw `DataError` with a stable `code`; the UI maps codes to
 * translated messages (`messages.errors[code]`).
 */
export interface DataRepository {
  // Auth ---------------------------------------------------------------
  getSession(): Promise<Session | null>;
  login(email: string, password: string): Promise<Session>;
  registerStudent(input: RegisterStudentInput): Promise<Session>;
  registerCompany(input: RegisterCompanyInput): Promise<Session>;
  logout(): Promise<void>;

  // Profiles -----------------------------------------------------------
  updateStudentProfile(userId: string, patch: Partial<Omit<StudentProfile, "userId">>): Promise<StudentProfile>;
  updateCompanyProfile(companyId: string, patch: Partial<Omit<CompanyProfile, "id" | "userId">>): Promise<CompanyProfile>;
  getCompany(companyId: string): Promise<CompanyProfile | null>;

  // Placements ---------------------------------------------------------
  /** Published placements, for the public catalogue. */
  listPublishedPlacements(): Promise<Placement[]>;
  listCompanyPlacements(companyId: string): Promise<Placement[]>;
  getPlacement(id: string): Promise<Placement | null>;
  createPlacement(companyId: string, data: PlacementInput): Promise<Placement>;
  updatePlacement(id: string, data: PlacementInput): Promise<Placement>;
  duplicatePlacement(id: string): Promise<Placement>;
  setPlacementStatus(id: string, status: PlacementStatus): Promise<Placement>;
  deletePlacement(id: string): Promise<void>;

  // Applications -------------------------------------------------------
  listStudentApplications(studentId: string): Promise<Application[]>;
  /**
   * All applications for a placement. Only the owning company sees personal
   * data in the UI; the catalogue uses this to count free spots.
   */
  listPlacementApplications(placementId: string): Promise<Application[]>;
  listCompanyApplications(companyId: string): Promise<Application[]>;
  getApplication(id: string): Promise<Application | null>;
  submitApplication(input: SubmitApplicationInput): Promise<Application>;
  setApplicationStatus(id: string, status: Exclude<ApplicationStatus, "completed">): Promise<Application>;
  /** Marks the application completed, stores the evaluation and issues a certificate. */
  completeApplication(id: string, evaluation: Omit<Evaluation, "evaluatedAt">): Promise<Certificate>;

  // Certificates -------------------------------------------------------
  getCertificate(id: string): Promise<Certificate | null>;
  listStudentCertificates(studentId: string): Promise<Certificate[]>;

  // Demo ---------------------------------------------------------------
  resetDemoData(): Promise<void>;

  /** Called after any change (also from other tabs). Returns an unsubscribe function. */
  subscribe(listener: () => void): () => void;
}

export type PlacementInput = Omit<
  Placement,
  "id" | "companyId" | "status" | "isSample" | "createdAt" | "updatedAt" | "publishedAt"
>;

export interface RegisterStudentInput {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  birthDate: string;
  schoolId: string;
  schoolOther: string;
  grade: string;
}

export interface RegisterCompanyInput {
  email: string;
  password: string;
  companyName: string;
  contactName: string;
  industry: string;
  town: string;
}

export type SubmitApplicationInput = Pick<
  Application,
  "placementId" | "studentId" | "termId" | "applicant" | "motivation" | "answers" | "cv" | "guardian" | "dataConsent"
>;

export type DataErrorCode =
  | "invalidCredentials"
  | "emailTaken"
  | "notFound"
  | "forbidden"
  | "duplicateApplication"
  | "deadlinePassed"
  | "noSpots"
  | "notPublished"
  | "storageFull"
  | "invalidState"
  | "notEnded";

export class DataError extends Error {
  constructor(public code: DataErrorCode) {
    super(code);
    this.name = "DataError";
  }
}
