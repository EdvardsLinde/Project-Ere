/**
 * Everything the team is likely to change lives here: name, certificate ID
 * prefix, colours, contacts and the option lists used across the site.
 *
 * Option labels are bilingual ({ lv, en }) because they are content lists,
 * not UI chrome. All other UI text lives in `messages/lv.ts` / `messages/en.ts`.
 */

export type Bilingual = { lv: string; en: string };

export const siteConfig = {
  name: { lv: "Saldus Industriālais digitālais sertifikāts", en: "Saldus Industrial Digital Certificate" },
  shortName: { lv: "Digitālais sertifikāts", en: "Digital Certificate" },
  /** Certificate IDs look like `SDS-2026-0001` (Saldus Digitālais Sertifikāts). */
  certificatePrefix: "SDS",
  /** Used to build absolute links (QR code) when `window.location` is not available. */
  siteUrl: "https://saldus-digital-certificate.vercel.app",

  contacts: {
    email: "[TODO: team email]",
    surveyUrl: "https://forms.cloud.microsoft/e/T8sBiTEdKi?origin=lprLink",
  },

  /** Age range the programme is for. */
  ageMin: 15,
  ageMax: 24,

  /**
   * Colour tokens (see DESIGN.md). Injected as CSS variables in app/layout.tsx;
   * Tailwind classes like `bg-primary` and `text-ink-muted` read them.
   */
  theme: {
    bg: "#FAF7F2",
    surface: "#FFFFFF",
    "surface-muted": "#F2EEE6",
    line: "#E2DCD0",
    ink: "#1F2421",
    "ink-muted": "#5A615C",
    primary: "#1E5A3C",
    "primary-hover": "#16472F",
    "primary-soft": "#E6F0EA",
    accent: "#F26A1B",
    "accent-hover": "#DB5A0F",
    "accent-ink": "#A8430A",
    "accent-soft": "#FDEBDD",
    "on-accent": "#1F2421",
    success: "#17663F",
    "success-soft": "#E3F3E9",
    warning: "#8A5A00",
    "warning-soft": "#FFF4D6",
    danger: "#B42318",
    "danger-soft": "#FDECEA",
  },

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
