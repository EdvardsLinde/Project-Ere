/**
 * DEMO MODE data layer — everything is stored in this browser's localStorage.
 *
 * ⚠️ NOT SECURE. Accounts, "passwords" and personal data can be read and edited
 * by anyone with access to the browser. This exists only to demonstrate the
 * product. Swap it for a real backend (see `lib/data/index.ts` and README).
 */
import { siteConfig } from "@/config/site";
import { todayISO } from "@/lib/dates";
import { applyBlockReason, formatCertificateId, isTermOpen } from "@/lib/placements";
import {
  DataError,
  type DataRepository,
  type PlacementInput,
  type RegisterCompanyInput,
  type RegisterStudentInput,
  type SubmitApplicationInput,
} from "./repository";
import { createSeedDatabase, DB_VERSION } from "./seed";
import type {
  Application,
  Certificate,
  CompanyProfile,
  DemoDatabase,
  Evaluation,
  Placement,
  PlacementStatus,
  Session,
  StudentProfile,
  User,
} from "./types";
import { demoHash, newId } from "./util";

const DB_KEY = "sdp:db";
const SESSION_KEY = "sdp:session";

export class LocalStorageRepository implements DataRepository {
  private db: DemoDatabase | null = null;
  private listeners = new Set<() => void>();
  private memorySession: string | null = null;

  constructor() {
    if (typeof window !== "undefined") {
      window.addEventListener("storage", (e) => {
        if (e.key === DB_KEY || e.key === SESSION_KEY) {
          this.db = null;
          this.emit();
        }
      });
    }
  }

  // Storage ------------------------------------------------------------

  private load(): DemoDatabase {
    if (this.db) return this.db;
    let parsed: DemoDatabase | null = null;
    try {
      const raw = window.localStorage.getItem(DB_KEY);
      if (raw) parsed = JSON.parse(raw) as DemoDatabase;
    } catch {
      parsed = null;
    }
    if (!parsed || parsed.version !== DB_VERSION || !Array.isArray(parsed.placements)) {
      parsed = createSeedDatabase();
      this.db = parsed;
      this.persist();
    }
    this.db = parsed;
    return parsed;
  }

  private persist() {
    try {
      window.localStorage.setItem(DB_KEY, JSON.stringify(this.db));
    } catch {
      throw new DataError("storageFull");
    }
  }

  private commit<T>(fn: (db: DemoDatabase) => T): T {
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

  private readSessionId(): string | null {
    try {
      return window.localStorage.getItem(SESSION_KEY);
    } catch {
      return this.memorySession;
    }
  }

  private writeSessionId(id: string | null) {
    this.memorySession = id;
    try {
      if (id) window.localStorage.setItem(SESSION_KEY, id);
      else window.localStorage.removeItem(SESSION_KEY);
    } catch {
      /* private mode: keep the in-memory session */
    }
  }

  private sessionFor(db: DemoDatabase, user: User): Session {
    return {
      user,
      student: db.students.find((s) => s.userId === user.id) ?? null,
      company: db.companies.find((c) => c.userId === user.id) ?? null,
    };
  }

  private currentUser(db: DemoDatabase): User | null {
    const id = this.readSessionId();
    return db.users.find((u) => u.id === id) ?? null;
  }

  // Auth ---------------------------------------------------------------

  async getSession() {
    const db = this.load();
    const user = this.currentUser(db);
    return user ? this.sessionFor(db, user) : null;
  }

  async login(email: string, password: string) {
    const db = this.load();
    const user = db.users.find((u) => u.email.toLowerCase() === email.trim().toLowerCase());
    if (!user || user.passwordHash !== demoHash(password)) throw new DataError("invalidCredentials");
    this.writeSessionId(user.id);
    this.emit();
    return this.sessionFor(db, user);
  }

  private createUser(db: DemoDatabase, email: string, password: string, role: User["role"]): User {
    const normalized = email.trim().toLowerCase();
    if (db.users.some((u) => u.email.toLowerCase() === normalized)) throw new DataError("emailTaken");
    const user: User = {
      id: newId("usr"),
      email: normalized,
      passwordHash: demoHash(password),
      role,
      createdAt: new Date().toISOString(),
    };
    db.users.push(user);
    return user;
  }

  async registerStudent(input: RegisterStudentInput) {
    const session = this.commit((db) => {
      const user = this.createUser(db, input.email, input.password, "student");
      const profile: StudentProfile = {
        userId: user.id,
        firstName: input.firstName.trim(),
        lastName: input.lastName.trim(),
        email: user.email,
        phone: "",
        birthDate: input.birthDate,
        schoolId: input.schoolId,
        schoolOther: input.schoolOther.trim(),
        grade: input.grade.trim(),
        interests: [],
        bio: "",
      };
      db.students.push(profile);
      return this.sessionFor(db, user);
    });
    this.writeSessionId(session.user.id);
    this.emit();
    return session;
  }

  async registerCompany(input: RegisterCompanyInput) {
    const session = this.commit((db) => {
      const user = this.createUser(db, input.email, input.password, "company");
      const company: CompanyProfile = {
        id: newId("cmp"),
        userId: user.id,
        name: input.companyName.trim(),
        regNumber: "",
        industry: (input.industry || "") as CompanyProfile["industry"],
        description: "",
        employees: "",
        website: "",
        logo: "",
        address: { street: "", town: input.town.trim(), parish: "", postcode: "" },
        directions: "",
        contactPerson: { name: input.contactName.trim(), position: "", email: user.email, phone: "" },
        // A company that registers itself has, by doing so, confirmed it takes part.
        confirmed: true,
        isSample: false,
      };
      db.companies.push(company);
      return this.sessionFor(db, user);
    });
    this.writeSessionId(session.user.id);
    this.emit();
    return session;
  }

  async logout() {
    this.writeSessionId(null);
    this.emit();
  }

  // Profiles -----------------------------------------------------------

  async updateStudentProfile(userId: string, patch: Partial<Omit<StudentProfile, "userId">>) {
    return this.commit((db) => {
      const p = db.students.find((s) => s.userId === userId);
      if (!p) throw new DataError("notFound");
      Object.assign(p, patch);
      return { ...p };
    });
  }

  async updateCompanyProfile(companyId: string, patch: Partial<Omit<CompanyProfile, "id" | "userId">>) {
    return this.commit((db) => {
      const c = db.companies.find((x) => x.id === companyId);
      if (!c) throw new DataError("notFound");
      Object.assign(c, patch);
      return { ...c };
    });
  }

  async getCompany(companyId: string) {
    return this.load().companies.find((c) => c.id === companyId) ?? null;
  }

  // Placements ---------------------------------------------------------

  async listPublishedPlacements() {
    return this.load().placements.filter((p) => p.status === "published");
  }

  async listCompanyPlacements(companyId: string) {
    return this.load()
      .placements.filter((p) => p.companyId === companyId)
      .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  }

  async getPlacement(id: string) {
    return this.load().placements.find((p) => p.id === id) ?? null;
  }

  async createPlacement(companyId: string, data: PlacementInput) {
    return this.commit((db) => {
      const now = new Date().toISOString();
      const placement: Placement = {
        ...structuredClone(data),
        id: newId("plc"),
        companyId,
        status: "draft",
        isSample: false,
        createdAt: now,
        updatedAt: now,
        publishedAt: null,
      };
      db.placements.push(placement);
      return placement;
    });
  }

  async updatePlacement(id: string, data: PlacementInput) {
    return this.commit((db) => {
      const p = db.placements.find((x) => x.id === id);
      if (!p) throw new DataError("notFound");
      Object.assign(p, structuredClone(data), { updatedAt: new Date().toISOString() });
      return { ...p };
    });
  }

  async duplicatePlacement(id: string) {
    return this.commit((db) => {
      const src = db.placements.find((x) => x.id === id);
      if (!src) throw new DataError("notFound");
      const now = new Date().toISOString();
      const copy: Placement = {
        ...structuredClone(src),
        id: newId("plc"),
        status: "draft",
        isSample: false,
        createdAt: now,
        updatedAt: now,
        publishedAt: null,
        terms: src.terms.map((t) => ({ ...t, id: newId("trm") })),
        title: typeof src.title === "string" ? `${src.title} (2)` : { lv: `${src.title.lv} (kopija)`, en: `${src.title.en} (copy)` },
      };
      db.placements.push(copy);
      return copy;
    });
  }

  async setPlacementStatus(id: string, status: PlacementStatus) {
    return this.commit((db) => {
      const p = db.placements.find((x) => x.id === id);
      if (!p) throw new DataError("notFound");
      p.status = status;
      p.updatedAt = new Date().toISOString();
      if (status === "published" && !p.publishedAt) p.publishedAt = p.updatedAt;
      return { ...p };
    });
  }

  async deletePlacement(id: string) {
    this.commit((db) => {
      db.placements = db.placements.filter((p) => p.id !== id);
      // Applications without certificates go with it; issued certificates stay verifiable.
      db.applications = db.applications.filter((a) => a.placementId !== id || a.certificateId);
    });
  }

  // Applications -------------------------------------------------------

  async listStudentApplications(studentId: string) {
    return this.load()
      .applications.filter((a) => a.studentId === studentId)
      .sort((a, b) => b.submittedAt.localeCompare(a.submittedAt));
  }

  async listPlacementApplications(placementId: string) {
    return this.load()
      .applications.filter((a) => a.placementId === placementId)
      .sort((a, b) => b.submittedAt.localeCompare(a.submittedAt));
  }

  async listCompanyApplications(companyId: string) {
    const db = this.load();
    const ids = new Set(db.placements.filter((p) => p.companyId === companyId).map((p) => p.id));
    return db.applications.filter((a) => ids.has(a.placementId));
  }

  async getApplication(id: string) {
    return this.load().applications.find((a) => a.id === id) ?? null;
  }

  async submitApplication(input: SubmitApplicationInput) {
    return this.commit((db) => {
      const placement = db.placements.find((p) => p.id === input.placementId);
      if (!placement) throw new DataError("notFound");
      const existing = db.applications.filter((a) => a.placementId === placement.id);
      const block = applyBlockReason(placement, existing, input.studentId);
      if (block === "duplicate") throw new DataError("duplicateApplication");
      if (block === "deadline") throw new DataError("deadlinePassed");
      if (block === "not-published") throw new DataError("notPublished");
      const term = placement.terms.find((t) => t.id === input.termId);
      if (!term || term.start < todayISO()) throw new DataError("invalidState");
      if (!isTermOpen(term, placement)) throw new DataError("deadlinePassed");
      const taken = existing.filter(
        (a) => a.termId === term.id && (a.status === "approved" || a.status === "completed"),
      ).length;
      if (block === "full" || taken >= term.spots) throw new DataError("noSpots");
      const now = new Date().toISOString();
      const app: Application = {
        ...structuredClone(input),
        id: newId("app"),
        status: "new",
        submittedAt: now,
        updatedAt: now,
        evaluation: null,
        certificateId: null,
      };
      db.applications.push(app);
      return app;
    });
  }

  async setApplicationStatus(id: string, status: "new" | "approved" | "rejected") {
    return this.commit((db) => {
      const app = db.applications.find((a) => a.id === id);
      if (!app) throw new DataError("notFound");
      if (app.status === "completed") throw new DataError("invalidState");
      if (status === "approved" && app.status !== "approved") {
        const placement = db.placements.find((p) => p.id === app.placementId);
        const term = placement?.terms.find((t) => t.id === app.termId);
        const taken = db.applications.filter(
          (a) => a.termId === app.termId && (a.status === "approved" || a.status === "completed"),
        ).length;
        if (term && taken >= term.spots) throw new DataError("noSpots");
      }
      app.status = status;
      app.updatedAt = new Date().toISOString();
      return { ...app };
    });
  }

  async completeApplication(id: string, evaluation: Omit<Evaluation, "evaluatedAt">) {
    return this.commit((db) => {
      const app = db.applications.find((a) => a.id === id);
      if (!app) throw new DataError("notFound");
      if (app.status !== "approved") throw new DataError("invalidState");
      const placement = db.placements.find((p) => p.id === app.placementId);
      if (!placement) throw new DataError("notFound");
      const term = placement.terms.find((t) => t.id === app.termId) ?? placement.terms[0];
      if (!siteConfig.allowCertificateBeforeEnd && term.end > todayISO()) throw new DataError("notEnded");
      const now = new Date();
      const year = now.getFullYear();
      const seq = (db.certificateCounters[year] ?? 0) + 1;
      db.certificateCounters[year] = seq;
      const fullEvaluation = { ...evaluation, evaluatedAt: now.toISOString() };
      const cert: Certificate = {
        id: formatCertificateId(year, seq),
        applicationId: app.id,
        placementId: placement.id,
        studentId: app.studentId,
        issuedAt: now.toISOString(),
        participantName: `${app.applicant.firstName} ${app.applicant.lastName}`.trim(),
        companyName: placement.company.name,
        placementTitle: placement.title,
        focusArea: placement.focusArea,
        start: term.start,
        end: term.end,
        days: placement.lengthDays,
        outputType: placement.outputType,
        output: placement.outputDescription,
        evaluation: fullEvaluation,
        mentor: { name: placement.mentor.name, position: placement.mentor.position },
      };
      db.certificates.push(cert);
      app.status = "completed";
      app.evaluation = fullEvaluation;
      app.certificateId = cert.id;
      app.updatedAt = now.toISOString();
      return cert;
    });
  }

  // Certificates -------------------------------------------------------

  async getCertificate(id: string) {
    const normalized = id.trim().toUpperCase();
    return this.load().certificates.find((c) => c.id.toUpperCase() === normalized) ?? null;
  }

  async listStudentCertificates(studentId: string) {
    return this.load()
      .certificates.filter((c) => c.studentId === studentId)
      .sort((a, b) => b.issuedAt.localeCompare(a.issuedAt));
  }

  // Demo ---------------------------------------------------------------

  async resetDemoData() {
    this.db = createSeedDatabase();
    this.persist();
    this.writeSessionId(null);
    this.emit();
  }
}
