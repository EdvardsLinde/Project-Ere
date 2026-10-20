/**
 * ERE — jobs & internships (FICTIONAL EXAMPLES). Each role lists the skill levels
 * (0–100) it needs; the Jobs page compares them with the user's levels → fit %.
 */
import type { TrackId } from './careers'
import type { SkillAreaId } from './skillAreas'
import type { Localized } from './types'

export type JobLocation = 'saldus' | 'remote' | 'hybrid'
export type Employment = 'full' | 'part' | 'summer' | 'internship'

export interface Job {
  id: string
  providerId: string
  track: TrackId
  title: Localized
  description: Localized
  location: JobLocation
  employment: Employment
  /** Minimum age. Rules for working minors are strict — check before going live. */
  minAge: number
  requiredSkills: Partial<Record<SkillAreaId, number>>
  /** ISO date. */
  posted: string
}

export const JOBS: Job[] = [
  {
    id: 'ozollog-it-helper',
    providerId: 'ozollog',
    track: 'it-support',
    title: { lv: 'IT atbalsta palīgs (nepilna slodze)', en: 'IT support helper (part-time)' },
    description: {
      lv: 'Palīdzi birojā Saldū ar datoriem, printeriem un kontiem. 10–15 stundas nedēļā, var savienot ar skolu.',
      en: 'Help the Saldus office with computers, printers and accounts. 10–15 hours a week, fits around school.',
    },
    location: 'saldus',
    employment: 'part',
    minAge: 16,
    requiredSkills: { troubleshooting: 40, communication: 50, networks: 30 },
    posted: '2026-10-12',
  },
  {
    id: 'cloudbalt-helpdesk',
    providerId: 'cloudbalt',
    track: 'it-support',
    title: { lv: 'Junior helpdesk speciālists', en: 'Junior helpdesk specialist' },
    description: {
      lv: 'Atbildi uz klientu jautājumiem čatā un e-pastā, risini kontu un piekļuves problēmas. Pilnībā attālināti — var strādāt no Saldus.',
      en: 'Answer customer questions by chat and email and solve account and access issues. Fully remote — you can work from Saldus.',
    },
    location: 'remote',
    employment: 'full',
    minAge: 18,
    requiredSkills: { troubleshooting: 60, communication: 60, english: 60, networks: 40 },
    posted: '2026-10-15',
  },
  {
    id: 'secnord-soc',
    providerId: 'secnord',
    track: 'cyber',
    title: { lv: 'Jaunākais drošības analītiķis', en: 'Junior security analyst' },
    description: {
      lv: 'Uzraugi drošības brīdinājumus un palīdzi izmeklēt incidentus. Pirmie 3 mēneši — apmācības ar mentoru.',
      en: 'Monitor security alerts and help investigate incidents. The first 3 months are mentored training.',
    },
    location: 'hybrid',
    employment: 'full',
    minAge: 18,
    requiredSkills: { security: 60, networks: 50, english: 60, troubleshooting: 40 },
    posted: '2026-10-09',
  },
  {
    id: 'secnord-summer',
    providerId: 'secnord',
    track: 'cyber',
    title: { lv: 'Kiberdrošības vasaras prakse', en: 'Cybersecurity summer internship' },
    description: {
      lv: 'Divi mēneši drošības komandā: pārbaudi paroļu politiku, palīdzi testēt sistēmas un mācies no analītiķiem.',
      en: 'Two months in a security team: review password policies, help test systems and learn from analysts.',
    },
    location: 'remote',
    employment: 'internship',
    minAge: 16,
    requiredSkills: { security: 40, networks: 30, english: 40 },
    posted: '2026-10-01',
  },
  {
    id: 'datu-summer',
    providerId: 'datudarbnica',
    track: 'ai-data',
    title: { lv: 'Datu kvalitātes asistents (vasaras darbs)', en: 'Data quality assistant (summer job)' },
    description: {
      lv: 'Pārbaudi un sakārto datus MI projektiem. Labs pirmais darbs — visu nepieciešamo iemācīsim.',
      en: 'Check and tidy data for AI projects. A great first job — we’ll teach you everything you need.',
    },
    location: 'remote',
    employment: 'summer',
    minAge: 16,
    requiredSkills: { data: 40, math: 40, english: 30 },
    posted: '2026-10-05',
  },
  {
    id: 'datu-junior',
    providerId: 'datudarbnica',
    track: 'ai-data',
    title: { lv: 'Junior datu analītiķis', en: 'Junior data analyst' },
    description: {
      lv: 'Veido atskaites un grafikus klientiem, strādā ar Python un SQL. Attālināti ar komandas dienām Kuldīgā reizi mēnesī.',
      en: 'Build reports and charts for clients using Python and SQL. Remote, with a team day in Kuldīga once a month.',
    },
    location: 'remote',
    employment: 'full',
    minAge: 18,
    requiredSkills: { data: 65, math: 60, programming: 50, english: 50 },
    posted: '2026-10-16',
  },
  {
    id: 'weblauks-frontend',
    providerId: 'weblauks',
    track: 'web',
    title: { lv: 'Junior frontend izstrādātājs', en: 'Junior frontend developer' },
    description: {
      lv: 'Veido mājaslapu daļas klientu projektiem kopā ar pieredzējušu komandu. Pilnībā attālināti.',
      en: 'Build parts of client websites with an experienced team. Fully remote.',
    },
    location: 'remote',
    employment: 'full',
    minAge: 18,
    requiredSkills: { web: 65, programming: 55, design: 30, english: 50 },
    posted: '2026-10-11',
  },
  {
    id: 'krams-content',
    providerId: 'kurzemeshop',
    track: 'web',
    title: { lv: 'Interneta veikala satura palīgs', en: 'Online shop content assistant' },
    description: {
      lv: 'Pievieno produktus, bildes un aprakstus veikala lapai. Darbs Saldū vai no mājām, pēc stundām.',
      en: 'Add products, photos and descriptions to the shop’s website. In Saldus or from home, after school.',
    },
    location: 'hybrid',
    employment: 'part',
    minAge: 15,
    requiredSkills: { web: 30, design: 40, communication: 40 },
    posted: '2026-10-18',
  },
  {
    id: 'cloudbalt-web-intern',
    providerId: 'cloudbalt',
    track: 'web',
    title: { lv: 'Web izstrādes prakse', en: 'Web development internship' },
    description: {
      lv: 'Labo kļūdas un veido nelielas funkcijas īstā produktā. Attālināti, ar mentoru katru nedēļu.',
      en: 'Fix bugs and build small features in a real product. Remote, with a weekly mentor call.',
    },
    location: 'remote',
    employment: 'internship',
    minAge: 17,
    requiredSkills: { web: 45, programming: 40, english: 40 },
    posted: '2026-10-07',
  },
]
