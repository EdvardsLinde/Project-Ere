/**
 * ERE — career tracks and their 3-step learning paths
 * Mock data: typed constants that a real API can replace later.
 */
import { Brain, CodeXml, Headset, ShieldCheck } from 'lucide-react'
import type { SkillAreaId } from './skillAreas'
import type { Localized, LucideIcon } from './types'

/** The four career tracks scored by the skills test. */
export type TrackId = 'cyber' | 'ai-data' | 'web' | 'it-support'

/* -------------------------------------------------------------------------- */
/*  5. CAREERS — screen "Tavi iespējamie karjeras ceļi"                        */
/*     `interests` = which interest ids this career fits (used to sort cards   */
/*     and show "matches your interests" chips).                               */
/* -------------------------------------------------------------------------- */
export interface Career {
  id: TrackId
  icon: LucideIcon
  /** Tailwind classes for the icon tile, so each career has its own colour. */
  tone: string
  title: Localized
  description: Localized
  dayToDay: Localized[]
  interests: string[]
  /** Skill levels (0–100) a junior in this track needs. Used for gaps and job fit. */
  requiredSkills: Partial<Record<SkillAreaId, number>>
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
    requiredSkills: { networks: 60, security: 70, programming: 40, troubleshooting: 50, english: 60 },
  },
  {
    id: 'ai-data',
    icon: Brain,
    tone: 'bg-amber-50 text-amber-800 ring-amber-200',
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
    requiredSkills: { math: 60, data: 70, programming: 60, english: 50 },
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
    requiredSkills: { web: 70, programming: 60, design: 40, english: 50 },
  },
  {
    id: 'it-support',
    icon: Headset,
    tone: 'bg-accent-50 text-accent-800 ring-accent-200',
    title: { lv: 'IT atbalsts', en: 'IT support' },
    description: {
      lv: 'Tu esi tas, pie kā cilvēki nāk, kad dators, Wi-Fi vai programma nestrādā — un tu mierīgi palīdzi to salabot.',
      en: 'You’re the person people turn to when a computer, Wi-Fi or app stops working — and you calmly help fix it.',
    },
    dayToDay: [
      { lv: 'Palīdzi kolēģiem ar datoriem un kontiem', en: 'Help colleagues with computers and accounts' },
      { lv: 'Uzstādi programmas un tīklu', en: 'Set up software and networks' },
      { lv: 'Atrodi, kāpēc kaut kas nestrādā', en: 'Find out why something isn’t working' },
    ],
    interests: ['games', 'problems', 'security'],
    requiredSkills: { troubleshooting: 70, networks: 50, communication: 70, security: 40 },
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

export const TRAINING: Record<TrackId, [TrainingStep, TrainingStep, TrainingStep]> = {
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
  'it-support': [
    {
      description: {
        lv: 'Uzzini, kā dators “iekšēji” strādā, kā uzstādīt programmas un kā darbojas Wi-Fi un tīkls.',
        en: 'Learn how a computer works inside, how to install software and how Wi-Fi and networks work.',
      },
      duration: { lv: '~4 nedēļas', en: '~4 weeks' },
      format: { lv: 'Tiešsaistē, savā tempā', en: 'Online, at your own pace' },
      outcome: { lv: 'Proti salabot biežākās problēmas', en: 'You can fix the most common problems' },
    },
    {
      description: {
        lv: 'Praktiski: risini īstus atbalsta pieteikumus treniņu vidē un mācies mierīgi izskaidrot risinājumu.',
        en: 'Hands-on: solve real support tickets in a training environment and learn to explain the fix calmly.',
      },
      duration: { lv: '~6 nedēļas', en: '~6 weeks' },
      format: { lv: 'Tiešsaistē + mentors', en: 'Online + mentor' },
      outcome: { lv: 'Atbalsta pieredze ar īstiem rīkiem', en: 'Support experience with real tools' },
    },
    {
      description: {
        lv: 'Palīdzi vietējai skolai, bibliotēkai vai biedrībai sakārtot datorus un tīklu kopā ar mentoru.',
        en: 'With a mentor, help a local school, library or NGO sort out their computers and network.',
      },
      duration: { lv: '~4 nedēļas', en: '~4 weeks' },
      format: { lv: 'Projekts ar mentoru', en: 'Mentored project' },
      outcome: { lv: 'Projekts, ko parādīt CV', en: 'A project to show on your CV' },
    },
  ],
}
