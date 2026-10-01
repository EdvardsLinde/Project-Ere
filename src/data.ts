/**
 * ERE — editable content.
 *
 * All career, course, interest and skill data lives here so it can be edited
 * without touching any component. Every user-facing text has an `lv` and `en`
 * version. UI strings (buttons, headings, etc.) live in `i18n.ts`.
 */
import type { LucideIcon } from 'lucide-react'
import {
  Brain,
  ChartColumn,
  CodeXml,
  Gamepad2,
  Palette,
  Puzzle,
  ShieldCheck,
  Sigma,
} from 'lucide-react'

export type Lang = 'lv' | 'en'
export type Localized = Record<Lang, string>

/* -------------------------------------------------------------------------- */
/*  1. INTERESTS — screen "Kas tevi interesē?" (multi-select tags)             */
/* -------------------------------------------------------------------------- */
export interface Interest {
  id: string
  icon: LucideIcon
  label: Localized
}

export const INTERESTS: Interest[] = [
  { id: 'games', icon: Gamepad2, label: { lv: 'Datori un spēles', en: 'Computers & games' } },
  { id: 'problems', icon: Puzzle, label: { lv: 'Problēmu risināšana', en: 'Problem solving' } },
  { id: 'design', icon: Palette, label: { lv: 'Dizains', en: 'Design' } },
  { id: 'security', icon: ShieldCheck, label: { lv: 'Drošība', en: 'Security' } },
  { id: 'ai', icon: Brain, label: { lv: 'Mākslīgais intelekts', en: 'Artificial intelligence' } },
  { id: 'math', icon: Sigma, label: { lv: 'Matemātika', en: 'Maths' } },
  { id: 'coding', icon: CodeXml, label: { lv: 'Programmēšana', en: 'Programming' } },
  { id: 'data', icon: ChartColumn, label: { lv: 'Dati', en: 'Data' } },
]

/* -------------------------------------------------------------------------- */
/*  2. SKILLS — profile section "Prasmes" (multi-select + add your own)        */
/* -------------------------------------------------------------------------- */
export interface Skill {
  id: string
  label: Localized
}

export const SKILLS: Skill[] = [
  { id: 'programming', label: { lv: 'Programmēšana', en: 'Programming' } },
  { id: 'math', label: { lv: 'Matemātika', en: 'Maths' } },
  { id: 'communication', label: { lv: 'Komunikācija', en: 'Communication' } },
  { id: 'teamwork', label: { lv: 'Komandas darbs', en: 'Teamwork' } },
  { id: 'design', label: { lv: 'Dizains', en: 'Design' } },
  { id: 'languages', label: { lv: 'Valodas', en: 'Languages' } },
  { id: 'problem-solving', label: { lv: 'Problēmu risināšana', en: 'Problem solving' } },
]

/* -------------------------------------------------------------------------- */
/*  3. MOTIVATION TAGS — profile section "Motivācija" (optional tags)          */
/* -------------------------------------------------------------------------- */
export const MOTIVATION_TAGS: Skill[] = [
  { id: 'salary', label: { lv: 'Gribu labu algu', en: 'I want a good salary' } },
  { id: 'tech', label: { lv: 'Interesē tehnoloģijas', en: "I'm into technology" } },
  { id: 'remote', label: { lv: 'Gribu strādāt attālināti', en: 'I want to work remotely' } },
  { id: 'saldus', label: { lv: 'Gribu palikt Saldū', en: 'I want to stay in Saldus' } },
]

/* -------------------------------------------------------------------------- */
/*  4. EXPERIENCE TYPES — profile section "Pieredze"                           */
/*     Shown as chips so teens see that more than paid work counts.            */
/* -------------------------------------------------------------------------- */
export const EXPERIENCE_TYPES: Skill[] = [
  { id: 'school', label: { lv: 'Skolas projekts', en: 'School project' } },
  { id: 'hobby', label: { lv: 'Hobijs', en: 'Hobby' } },
  { id: 'course', label: { lv: 'Kurss', en: 'Course' } },
  { id: 'volunteer', label: { lv: 'Brīvprātīgais darbs', en: 'Volunteering' } },
  { id: 'job', label: { lv: 'Darbs', en: 'Job' } },
]

/* -------------------------------------------------------------------------- */
/*  5. CAREERS — screen "Tavi iespējamie karjeras ceļi"                        */
/*     `interests` = which interest ids this career fits (used to sort cards   */
/*     and show "matches your interests" chips).                               */
/* -------------------------------------------------------------------------- */
export interface Career {
  id: string
  icon: LucideIcon
  /** Tailwind classes for the icon tile, so each career has its own colour. */
  tone: string
  title: Localized
  description: Localized
  dayToDay: Localized[]
  interests: string[]
}

export const CAREERS: Career[] = [
  {
    id: 'cyber',
    icon: ShieldCheck,
    tone: 'bg-brand-50 text-brand-700 ring-brand-100',
    title: { lv: 'Kiberdrošība', en: 'Cybersecurity' },
    description: {
      lv: 'Tu sargā uzņēmumu datorus, kontus un datus no hakeriem — un atrodi vājās vietas, pirms tās atrod kāds cits.',
      en: 'You protect a company’s computers, accounts and data from hackers — and find weak spots before someone else does.',
    },
    dayToDay: [
      { lv: 'Pārbaudi, vai sistēmās nav drošības caurumu', en: 'Check systems for security holes' },
      { lv: 'Atpazīsti krāpnieciskus e-pastus un uzbrukumus', en: 'Spot scam emails and attacks' },
      { lv: 'Māci kolēģiem drošus ieradumus', en: 'Teach colleagues safe habits' },
    ],
    interests: ['security', 'problems', 'games', 'coding'],
  },
  {
    id: 'ai-data',
    icon: Brain,
    tone: 'bg-violet-50 text-violet-700 ring-violet-100',
    title: { lv: 'Mākslīgais intelekts un dati', en: 'AI & data' },
    description: {
      lv: 'Tu palīdz datoriem atrast likumsakarības lielos datu apjomos — piemēram, paredzēt pieprasījumu vai veidot gudrus palīgrīkus.',
      en: 'You help computers find patterns in large amounts of data — for example, to forecast demand or build smart assistant tools.',
    },
    dayToDay: [
      { lv: 'Sakārto un analizē datus', en: 'Clean up and analyse data' },
      { lv: 'Veido grafikus, kas izskaidro skaitļus', en: 'Make charts that explain the numbers' },
      { lv: 'Trenē un pārbaudi MI modeļus', en: 'Train and test AI models' },
    ],
    interests: ['ai', 'data', 'math', 'problems'],
  },
  {
    id: 'web',
    icon: CodeXml,
    tone: 'bg-accent-50 text-accent-700 ring-accent-100',
    title: { lv: 'Web izstrāde', en: 'Web development' },
    description: {
      lv: 'Tu veido mājaslapas un tiešsaistes rīkus, ko cilvēki lieto katru dienu — no interneta veikala līdz pierakstu sistēmai.',
      en: 'You build websites and online tools people use every day — from online shops to booking systems.',
    },
    dayToDay: [
      { lv: 'Raksti kodu, kas “atdzīvina” lapu', en: 'Write the code that brings a page to life' },
      { lv: 'Pārvērt dizainu strādājošā lapā', en: 'Turn a design into a working page' },
      { lv: 'Labo kļūdas un uzlabo ātrumu', en: 'Fix bugs and make things faster' },
    ],
    interests: ['coding', 'design', 'games', 'problems'],
  },
]

/* -------------------------------------------------------------------------- */
/*  6. TRAINING PATHS — 3 steps per career (keyed by career id)                */
/*     Step titles are shared ("1. Pamati", ...) and live in i18n.ts.          */
/* -------------------------------------------------------------------------- */
export interface TrainingStep {
  description: Localized
  duration: Localized
  format: Localized
  outcome: Localized
}

export const TRAINING: Record<string, [TrainingStep, TrainingStep, TrainingStep]> = {
  cyber: [
    {
      description: {
        lv: 'Uzzini, kā darbojas internets, tīkli un paroles. Iemācies atpazīt tipiskus uzbrukumus, piemēram, pikšķerēšanas (krāpnieciskus) e-pastus.',
        en: 'Learn how the internet, networks and passwords work. Learn to recognise common attacks such as phishing (scam) emails.',
      },
      duration: { lv: '~4 nedēļas', en: '~4 weeks' },
      format: { lv: 'Tiešsaistē, savā tempā', en: 'Online, at your own pace' },
      outcome: { lv: 'Saproti drošības pamatus', en: 'You understand the security basics' },
    },
    {
      description: {
        lv: 'Mācies drošā treniņu vidē: meklē ievainojamības, analizē aizdomīgus failus un piedalies CTF — drošības “mīklu” sacensībās.',
        en: 'Practise in a safe training environment: hunt for vulnerabilities, analyse suspicious files and join CTFs — security “puzzle” competitions.',
      },
      duration: { lv: '~8 nedēļas', en: '~8 weeks' },
      format: { lv: 'Tiešsaistē + mentors', en: 'Online + mentor' },
      outcome: { lv: 'Praktiskas iemaņas ar īstiem rīkiem', en: 'Hands-on skills with real tools' },
    },
    {
      description: {
        lv: 'Kopā ar mentoru pārbaudi vietējas organizācijas mājaslapas drošību vai sagatavo drošības atgādni savai skolai.',
        en: 'With a mentor, check the security of a local organisation’s website or create a security guide for your school.',
      },
      duration: { lv: '~4 nedēļas', en: '~4 weeks' },
      format: { lv: 'Projekts ar mentoru', en: 'Mentored project' },
      outcome: { lv: 'Projekts, ko parādīt CV', en: 'A project to show on your CV' },
    },
  ],
  'ai-data': [
    {
      description: {
        lv: 'Uzzini, kas ir mākslīgais intelekts un kā tas mācās no datiem. Apgūsti izklājlapu un Python programmēšanas pamatus.',
        en: 'Find out what artificial intelligence is and how it learns from data. Learn spreadsheet and Python programming basics.',
      },
      duration: { lv: '~4 nedēļas', en: '~4 weeks' },
      format: { lv: 'Tiešsaistē, savā tempā', en: 'Online, at your own pace' },
      outcome: { lv: 'Saproti, kā strādā MI', en: 'You understand how AI works' },
    },
    {
      description: {
        lv: 'Strādā ar īstiem datiem: sakārto tos, veido grafikus un uztrenē savu pirmo vienkāršo MI modeli.',
        en: 'Work with real data: clean it, build charts and train your first simple AI model.',
      },
      duration: { lv: '~8 nedēļas', en: '~8 weeks' },
      format: { lv: 'Tiešsaistē + mentors', en: 'Online + mentor' },
      outcome: { lv: 'Tavs pirmais MI modelis', en: 'Your first AI model' },
    },
    {
      description: {
        lv: 'Izveido datu projektu par Saldus novadu — piemēram, analizē laikapstākļu vai satiksmes datus — un prezentē rezultātus.',
        en: 'Build a data project about the Saldus region — for example, analyse weather or traffic data — and present your results.',
      },
      duration: { lv: '~4 nedēļas', en: '~4 weeks' },
      format: { lv: 'Projekts ar mentoru', en: 'Mentored project' },
      outcome: { lv: 'Projekts, ko parādīt CV', en: 'A project to show on your CV' },
    },
  ],
  web: [
    {
      description: {
        lv: 'Apgūsti HTML, CSS un JavaScript — trīs “valodas”, no kurām sastāv katra mājaslapa. Izveido savu pirmo lapu.',
        en: 'Learn HTML, CSS and JavaScript — the three “languages” every website is made of. Build your first page.',
      },
      duration: { lv: '~4 nedēļas', en: '~4 weeks' },
      format: { lv: 'Tiešsaistē, savā tempā', en: 'Online, at your own pace' },
      outcome: { lv: 'Tava pirmā mājaslapa', en: 'Your first website' },
    },
    {
      description: {
        lv: 'Veido interaktīvas lapas ar modernu rīku (React), iemācies lietot Git un strādāt komandā kā īstā IT uzņēmumā.',
        en: 'Build interactive pages with a modern tool (React), learn Git and work in a team like at a real IT company.',
      },
      duration: { lv: '~8 nedēļas', en: '~8 weeks' },
      format: { lv: 'Tiešsaistē + mentors', en: 'Online + mentor' },
      outcome: { lv: 'Darbs komandā ar īstiem rīkiem', en: 'Teamwork with real tools' },
    },
    {
      description: {
        lv: 'Izveido īstu mājaslapu vietējam uzņēmumam, biedrībai vai pasākumam un pievieno to savam portfolio.',
        en: 'Build a real website for a local business, NGO or event and add it to your portfolio.',
      },
      duration: { lv: '~4 nedēļas', en: '~4 weeks' },
      format: { lv: 'Projekts ar mentoru', en: 'Mentored project' },
      outcome: { lv: 'Projekts, ko parādīt CV', en: 'A project to show on your CV' },
    },
  ],
}
