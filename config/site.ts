/**
 * Brand, colours and contacts. The fair itself (name, dates, stands, prices,
 * option lists) is configured in `config/event.ts`. All UI text lives in
 * `messages/lv.ts` / `messages/en.ts`.
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
  | "danger-soft"
  | "land-crop"
  | "land-row"
  | "land-forest"
  | "land-moss"
  | "land-meadow"
  | "land-wheat"
  | "land-straw",
  string
>;

/**
 * SEER light palette (the default), taken from the "Saldus novads · Digitālā
 * prakse" badge: forest green as the one strong colour, orange as the warm
 * highlight, warm off-white page, soft outlines. `land-*` colour the fields of
 * the hero's key visual (components/key-visual.tsx).
 */
const light: ThemeTokens = {
  bg: "#F8F6F1",
  surface: "#FFFFFF",
  "surface-muted": "#EEEBE3",
  line: "#DDD9CE",
  edge: "#D2CDBF",
  ink: "#13241A",
  "ink-muted": "#4D5C52",
  primary: "#2F593E",
  "primary-fill": "#2F593E",
  "primary-hover": "#24462F",
  "primary-soft": "#E6EFE8",
  accent: "#E17235",
  "accent-hover": "#E8834D",
  "accent-ink": "#A84B17",
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
  "land-crop": "#CBD9C8",
  "land-row": "#2F593E",
  "land-forest": "#1D3828",
  "land-moss": "#4E7A5C",
  "land-meadow": "#A9C2AE",
  "land-wheat": "#EFDDC3",
  "land-straw": "#D9A06F",
};

/** SEER dark palette (optional, via the header toggle): green-black surfaces, the same green and orange. */
const dark: ThemeTokens = {
  bg: "#0E1712",
  surface: "#16211B",
  "surface-muted": "#1D2B23",
  line: "#2B3B31",
  edge: "#33463A",
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
  "land-crop": "#24392C",
  "land-row": "#4C7D5D",
  "land-forest": "#122219",
  "land-moss": "#3A5E46",
  "land-meadow": "#3B5A45",
  "land-wheat": "#4A3E2D",
  "land-straw": "#9A6E45",
};

export const siteConfig = {
  /** Brand shown in the header and footer. The event name lives in `config/event.ts`. */
  brand: "SEER",
  tagline: { lv: "Ieraugi Saldus potenciālu", en: "See the potential of Saldus" },

  contacts: {
    /** The team's address. Leave empty until there is one: the footer then leaves the line out. */
    email: "",
    surveyUrl: "https://forms.cloud.microsoft/e/T8sBiTEdKi?origin=lprLink",
  },

  /**
   * Colour tokens (see DESIGN.md). app/layout.tsx turns them into CSS variables:
   * `light` on :root, `dark` under html.dark; printing is always light.
   * Tailwind classes like `bg-primary-fill` and `text-ink-muted` read them.
   */
  theme: { light, dark },
  /** Light mode is the default; the header toggle remembers the visitor's choice. */
  defaultTheme: "light" as "dark" | "light",

  /** Suggestions for the school field of the team form (any school can be typed). */
  schools: ["Saldus tehnikums", "Saldus vidusskola", "Brocēnu vidusskola"],

  /** Size limit for a logo uploaded with a stand booking (stored in the browser). */
  logoMaxBytes: 200 * 1024,
} as const;
