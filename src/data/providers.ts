/**
 * SEER — course & job providers (FICTIONAL EXAMPLES)
 * Mock data: typed constants that a real API can replace later.
 */
import type { Localized } from './types'

/* ========================================================================== */
/*  EXAMPLE DATA — everything below is FICTIONAL.                             */
/*  Companies, courses and people are invented to demonstrate the idea.      */
/*  The UI labels them as examples. Replace with real partners once agreed.   */
/* ========================================================================== */

/* -------------------------------------------------------------------------- */
/*  7. PROVIDERS — companies / organisations offering courses (EXAMPLES)       */
/* -------------------------------------------------------------------------- */
export interface Provider {
  id: string
  name: string
  kind: Localized
  location: Localized
  /** Tailwind classes for the logo tile. */
  tone: string
}

export const PROVIDERS: Provider[] = [
  {
    id: 'secnord',
    name: 'SecNord Labs',
    kind: { lv: 'Kiberdrošības uzņēmums', en: 'Cybersecurity company' },
    location: { lv: 'Rīga · strādā attālināti', en: 'Riga · works remotely' },
    tone: 'bg-brand-600 text-white',
  },
  {
    id: 'datudarbnica',
    name: 'DatuDarbnīca',
    kind: { lv: 'Datu analītikas uzņēmums', en: 'Data analytics company' },
    location: { lv: 'Kuldīga', en: 'Kuldīga' },
    tone: 'bg-amber-100 text-amber-800',
  },
  {
    id: 'weblauks',
    name: 'WebLauks',
    kind: { lv: 'Web izstrādes aģentūra', en: 'Web development agency' },
    location: { lv: 'Liepāja', en: 'Liepāja' },
    tone: 'bg-accent-500 text-on-accent',
  },
  {
    id: 'cloudbalt',
    name: 'CloudBalt',
    kind: { lv: 'IT pakalpojumu uzņēmums', en: 'IT services company' },
    location: { lv: 'Rīga · attālināti', en: 'Riga · remote' },
    tone: 'bg-brand-100 text-brand-800',
  },
  {
    id: 'kodaklubs',
    name: 'Novada Koda klubs',
    kind: { lv: 'Jauniešu biedrība', en: 'Youth NGO' },
    location: { lv: 'Saldus', en: 'Saldus' },
    tone: 'bg-amber-200 text-amber-900',
  },
  {
    id: 'ozollog',
    name: 'OzolLog',
    kind: { lv: 'Loģistikas uzņēmums', en: 'Logistics company' },
    location: { lv: 'Saldus', en: 'Saldus' },
    tone: 'bg-brand-200 text-brand-900',
  },
  {
    id: 'kurzemeshop',
    name: 'Kurzemes Krams',
    kind: { lv: 'Interneta veikals', en: 'Online shop' },
    location: { lv: 'Saldus', en: 'Saldus' },
    tone: 'bg-accent-200 text-accent-900',
  },
]
