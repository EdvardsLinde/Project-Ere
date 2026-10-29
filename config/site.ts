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

/** SEER light palette: Saldus coat-of-arms blue and gold on warm white. */
const light: ThemeTokens = {
  bg: "#F7F5F3",
  surface: "#FFFFFF",
  "surface-muted": "#EFEBE7",
  line: "#E3DED9",
  ink: "#171412",
  "ink-muted": "#655E58",
  primary: "#005DAB",
  "primary-fill": "#005DAB",
  "primary-hover": "#004A8A",
  "primary-soft": "#EAF3FB",
  accent: "#A38443",
  "accent-hover": "#8F7339",
  "accent-ink": "#7D6326",
  "accent-soft": "#F8F4EA",
  "on-accent": "#231F1E",
  night: "#0C0A09",
  "on-night": "#F5F2EF",
  success: "#17663F",
  "success-soft": "#E3F3E9",
  warning: "#7A5600",
  "warning-soft": "#FBEDC9",
  danger: "#C21E26",
  "danger-soft": "#FDECED",
};

/** SEER dark palette (the default): near-black surfaces, blue and gold accents. */
const dark: ThemeTokens = {
  bg: "#0B0A09",
  surface: "#151210",
  "surface-muted": "#1C1917",
  line: "#2A2522",
  ink: "#F5F2EF",
  "ink-muted": "#B6AFA9",
  primary: "#6CB2EC",
  "primary-fill": "#005DAB",
  "primary-hover": "#0068BD",
  "primary-soft": "#0D2033",
  accent: "#B8964D",
  "accent-hover": "#C9A960",
  "accent-ink": "#D8BD80",
  "accent-soft": "#2A2213",
  "on-accent": "#231F1E",
  night: "#050403",
  "on-night": "#F5F2EF",
  success: "#5FD39A",
  "success-soft": "#0F2A1D",
  warning: "#F2CC77",
  "warning-soft": "#2A2512",
  danger: "#FF8A8F",
  "danger-soft": "#3A1416",
};

export const siteConfig = {
  /** Brand shown in the header and footer. */
  brand: "SEER",
  tagline: { lv: "Ieraugi, kur var aizvest tava karjera", en: "See where your career can go" },
  name: { lv: "SEER — Saldus industriālā digitālā prakse", en: "SEER — Saldus Industrial Digital Immersion" },
  subtitle: { lv: "Saldus industriālā digitālā prakse", en: "Saldus Industrial Digital Immersion" },
  /**
   * Hero photo: Saldus town square, supplied by the team.
   * TODO: credit the photographer before going public.
   */
  heroPhoto: "/saldus-square.webp",
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
  /** Dark mode is SEER's default; the header toggle remembers the visitor's choice. */
  defaultTheme: "dark" as "dark" | "light",

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
