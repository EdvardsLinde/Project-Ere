/**
 * Everything the team is likely to change lives here: name, certificate ID
 * prefix, colours, contacts and the option lists used across the site.
 *
 * Option labels are bilingual ({ lv, en }) because they are content lists,
 * not UI chrome. All other UI text lives in `messages/lv.ts` / `messages/en.ts`.
 */

export type Bilingual = { lv: string; en: string };

type ThemeTokens = Record<
  | "bg"
  | "surface"
  | "surface-muted"
  | "line"
  | "edge"
  | "ink"
  | "ink-muted"
  | "primary"
  | "primary-fill"
  | "primary-hover"
  | "primary-soft"
  | "accent"
  | "accent-hover"
  | "accent-ink"
  | "accent-soft"
  | "on-accent"
  | "night"
  | "on-night"
  | "success"
  | "success-soft"
  | "warning"
  | "warning-soft"
  | "danger"
  | "danger-soft",
  string
>;

/**
 * SEER light palette (the default), taken from the "Saldus novads · Digitālā
 * prakse" badge: forest green as the one strong colour, orange as the warm
 * highlight, warm off-white page, green-black ink outlines.
 */
const light: ThemeTokens = {
  bg: "#F8F6F1",
  surface: "#FFFFFF",
  "surface-muted": "#EEEBE3",
  line: "#DDD9CE",
  edge: "#13241A",
  ink: "#13241A",
  "ink-muted": "#4D5C52",
  primary: "#2F593E",
  "primary-fill": "#2F593E",
  "primary-hover": "#24462F",
  "primary-soft": "#E6EFE8",
  accent: "#E17235",
  "accent-hover": "#E8834D",
  "accent-ink": "#944012",
  "accent-soft": "#FCEADF",
  "on-accent": "#13241A",
  night: "#13241A",
  "on-night": "#F8F6F1",
  success: "#14693F",
  "success-soft": "#DDF4E6",
  warning: "#7A4F00",
  "warning-soft": "#FFEFC2",
  danger: "#C0182A",
  "danger-soft": "#FDE8EA",
};

/** SEER dark palette (optional, via the header toggle): green-black surfaces, the same green and orange. */
const dark: ThemeTokens = {
  bg: "#0E1712",
  surface: "#16211B",
  "surface-muted": "#1D2B23",
  line: "#2B3B31",
  edge: "#4E6A58",
  ink: "#F2F0EA",
  "ink-muted": "#AEBBB2",
  primary: "#7FC79A",
  "primary-fill": "#2F593E",
  "primary-hover": "#3A6B4B",
  "primary-soft": "#17301F",
  accent: "#E17235",
  "accent-hover": "#EA8650",
  "accent-ink": "#F2A174",
  "accent-soft": "#2E1E14",
  "on-accent": "#13241A",
  night: "#08100B",
  "on-night": "#F2F0EA",
  success: "#6FDBA4",
  "success-soft": "#10291D",
  warning: "#FFD27A",
  "warning-soft": "#2B2410",
  danger: "#FF8E98",
  "danger-soft": "#3A1519",
};

export const siteConfig = {
  /** Brand shown in the header and footer. */
  brand: "SEER",
  tagline: { lv: "Ieraugi, kur var aizvest tava karjera", en: "See where your career can go" },
  name: { lv: "SEER — Saldus industriālā digitālā prakse", en: "SEER — Saldus Industrial Digital Immersion" },
  subtitle: { lv: "Saldus industriālā digitālā prakse", en: "Saldus Industrial Digital Immersion" },
  /** Certificate IDs look like `SEER-2026-0001`. */
  certificatePrefix: "SEER",
  /** Used to build absolute links (QR code) when `window.location` is not available. */
  siteUrl: "https://seer-saldus.vercel.app",

  contacts: {
    email: "[TODO: team email]",
    surveyUrl: "https://forms.cloud.microsoft/e/T8sBiTEdKi?origin=lprLink",
  },

  /** Age range the programme is for. */
  ageMin: 15,
  ageMax: 24,

  /**
   * Colour tokens (see DESIGN.md). app/layout.tsx turns them into CSS variables:
   * `light` on :root, `dark` under html.dark. Certificates always use `light`
   * (`.paper`), and printing is always light. Tailwind classes like `bg-primary-fill`
   * and `text-ink-muted` read them.
   */
  theme: { light, dark },
  /** Light mode is the default; the header toggle remembers the visitor's choice. */
  defaultTheme: "light" as "dark" | "light",

  /** `[TODO: team will extend the list]` — "other" shows a free-text field. */
  schools: [
    { id: "saldus-tehnikums", label: { lv: "Saldus tehnikums", en: "Saldus Technical School" } },
    { id: "other", label: { lv: "Cita", en: "Other" } },
  ],

  industries: [
    { id: "wood", label: { lv: "Kokapstrāde un mežsaimniecība", en: "Wood processing & forestry" } },
    { id: "construction", label: { lv: "Būvniecība un ceļu būve", en: "Construction & road building" } },
    { id: "materials", label: { lv: "Būvmateriāli", en: "Building materials" } },
    { id: "metal", label: { lv: "Metālapstrāde un ražošana", en: "Metalworking & manufacturing" } },
    { id: "plastics", label: { lv: "Plastmasa un kompozīti", en: "Plastics & composites" } },
    { id: "food", label: { lv: "Pārtikas ražošana", en: "Food production" } },
    { id: "energy", label: { lv: "Enerģētika un biomasa", en: "Energy & biomass" } },
    { id: "logistics", label: { lv: "Loģistika un transports", en: "Logistics & transport" } },
    { id: "it", label: { lv: "IT un pakalpojumi", en: "IT & services" } },
    { id: "other", label: { lv: "Cita", en: "Other" } },
  ],

  focusAreas: [
    { id: "data", label: { lv: "Datu analīze un vizualizācija", en: "Data analysis & visualisation" } },
    { id: "iot", label: { lv: "Sensori un IoT", en: "Sensors & IoT" } },
    { id: "cyber", label: { lv: "Kiberdrošība", en: "Cybersecurity" } },
    { id: "production", label: { lv: "Ražošanas digitalizācija", en: "Production digitalisation" } },
    { id: "quality", label: { lv: "Kvalitātes kontrole", en: "Quality control" } },
    { id: "gps", label: { lv: "Loģistika un GPS dati", en: "Logistics & GPS data" } },
    { id: "energy", label: { lv: "Enerģijas dati", en: "Energy data" } },
    { id: "cad", label: { lv: "CAD un inženierija", en: "CAD & engineering" } },
    { id: "other", label: { lv: "Cita", en: "Other" } },
  ],

  outputTypes: [
    { id: "dashboard", label: { lv: "Datu panelis", en: "Data dashboard" } },
    { id: "checklist", label: { lv: "Kontrolsaraksts", en: "Checklist" } },
    { id: "audit", label: { lv: "Audits / atskaite", en: "Audit / report" } },
    { id: "tool", label: { lv: "Rīks vai prototips", en: "Tool or prototype" } },
    { id: "presentation", label: { lv: "Prezentācija", en: "Presentation" } },
    { id: "other", label: { lv: "Cits", en: "Other" } },
  ],

  toolSuggestions: ["Excel", "Google Sheets", "Power BI", "Python", "SQL", "PLC", "SCADA", "GPS data", "CAD", "IoT sensors"],

  bringSuggestions: [
    { lv: "Klēpjdators", en: "Laptop" },
    { lv: "Personu apliecinošs dokuments", en: "ID document" },
    { lv: "Slēgti apavi", en: "Closed shoes" },
    { lv: "Ērts apģērbs", en: "Comfortable clothes" },
    { lv: "Pusdienas", en: "Lunch" },
  ],

  interestSuggestions: [
    { lv: "Dati", en: "Data" },
    { lv: "Programmēšana", en: "Programming" },
    { lv: "Kiberdrošība", en: "Cybersecurity" },
    { lv: "Ražošana", en: "Manufacturing" },
    { lv: "Enerģētika", en: "Energy" },
    { lv: "Loģistika", en: "Logistics" },
    { lv: "Inženierija", en: "Engineering" },
    { lv: "Dizains", en: "Design" },
  ],

  opportunities: [
    { id: "summer-job", label: { lv: "Vasaras darbs", en: "Summer job" } },
    { id: "internship", label: { lv: "Garāka prakse", en: "Longer internship" } },
    { id: "interview", label: { lv: "Darba intervija", en: "Job interview" } },
    { id: "tour", label: { lv: "Uzņēmuma ekskursija", en: "Company tour" } },
    { id: "other", label: { lv: "Cits", en: "Other" } },
  ],

  /** Partner names shown as text chips on the home page (no logos). */
  potentialPartners: [
    "PATA Saldus",
    "JETS Vacuum",
    "SC GRUPA",
    "SCHWENK Latvija",
    "Brimer Saldus / Norplast",
    "Tērvete Food",
    "DELTA LV",
    "Warmeston",
  ],

  /**
   * Demo convenience: allow issuing a certificate before the placement's end date,
   * so the whole flow can be tried on future dates. Set to `false` for real use.
   */
  allowCertificateBeforeEnd: true,

  /** Size limits for demo-mode uploads (stored in localStorage). */
  uploads: {
    logoMaxBytes: 200 * 1024,
    cvMaxBytes: 5 * 1024 * 1024,
  },
} as const;

export type IndustryId = (typeof siteConfig.industries)[number]["id"];
export type FocusAreaId = (typeof siteConfig.focusAreas)[number]["id"];
export type OutputTypeId = (typeof siteConfig.outputTypes)[number]["id"];
export type OpportunityId = (typeof siteConfig.opportunities)[number]["id"];
export type SchoolId = (typeof siteConfig.schools)[number]["id"];
