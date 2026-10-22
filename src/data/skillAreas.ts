/**
 * SEER — skill areas used by the skills test, career match, courses and jobs.
 * Levels are 0–100. The test sets a base level; completed courses add to it.
 */
import { BookOpen, ChartColumn, CodeXml, Globe, Languages, MessageCircle, Network, Palette, ShieldCheck, Sigma, Wrench } from 'lucide-react'
import type { Localized, LucideIcon } from './types'

export type SkillAreaId =
  | 'programming'
  | 'math'
  | 'networks'
  | 'security'
  | 'data'
  | 'web'
  | 'design'
  | 'communication'
  | 'english'
  | 'troubleshooting'

export interface SkillArea {
  id: SkillAreaId
  icon: LucideIcon
  label: Localized
  /** One line in plain language: what this skill means in practice. */
  hint: Localized
}

export const SKILL_AREAS: SkillArea[] = [
  {
    id: 'programming',
    icon: CodeXml,
    label: { lv: 'Programmēšana', en: 'Programming' },
    hint: { lv: 'Rakstīt kodu, kas dara to, ko tu gribi', en: 'Writing code that does what you want' },
  },
  {
    id: 'math',
    icon: Sigma,
    label: { lv: 'Matemātika un loģika', en: 'Maths & logic' },
    hint: { lv: 'Skaitļi, likumsakarības, loģiska domāšana', en: 'Numbers, patterns, logical thinking' },
  },
  {
    id: 'networks',
    icon: Network,
    label: { lv: 'Datori un tīkli', en: 'Computers & networks' },
    hint: { lv: 'Kā dators, Wi-Fi un internets strādā', en: 'How computers, Wi-Fi and the internet work' },
  },
  {
    id: 'security',
    icon: ShieldCheck,
    label: { lv: 'Drošība internetā', en: 'Online security' },
    hint: { lv: 'Atpazīt krāpniecību un sargāt kontus', en: 'Spotting scams and protecting accounts' },
  },
  {
    id: 'data',
    icon: ChartColumn,
    label: { lv: 'Darbs ar datiem', en: 'Working with data' },
    hint: { lv: 'Tabulas, grafiki, secinājumi no skaitļiem', en: 'Tables, charts, conclusions from numbers' },
  },
  {
    id: 'web',
    icon: Globe,
    label: { lv: 'Mājaslapu veidošana', en: 'Building websites' },
    hint: { lv: 'HTML, CSS un lapas, ko var atvērt pārlūkā', en: 'HTML, CSS and pages you can open in a browser' },
  },
  {
    id: 'design',
    icon: Palette,
    label: { lv: 'Dizains', en: 'Design' },
    hint: { lv: 'Lai lietas izskatās labi un ir ērti lietojamas', en: 'Making things look good and easy to use' },
  },
  {
    id: 'communication',
    icon: MessageCircle,
    label: { lv: 'Komunikācija', en: 'Communication' },
    hint: { lv: 'Mierīgi izskaidrot lietas citiem', en: 'Calmly explaining things to others' },
  },
  {
    id: 'english',
    icon: Languages,
    label: { lv: 'Angļu valoda', en: 'English' },
    hint: { lv: 'Svarīga attālinātam darbam ar ārzemju komandām', en: 'Key for remote work with international teams' },
  },
  {
    id: 'troubleshooting',
    icon: Wrench,
    label: { lv: 'Problēmu novēršana', en: 'Troubleshooting' },
    hint: { lv: 'Atrast, kāpēc kaut kas nestrādā, un salabot', en: 'Finding why something breaks and fixing it' },
  },
]

/** Fallback icon for unknown skill ids. */
export const SKILL_FALLBACK_ICON = BookOpen
