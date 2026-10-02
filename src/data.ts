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
    tone: 'bg-violet-600 text-white',
  },
  {
    id: 'weblauks',
    name: 'WebLauks',
    kind: { lv: 'Web izstrādes aģentūra', en: 'Web development agency' },
    location: { lv: 'Liepāja', en: 'Liepāja' },
    tone: 'bg-accent-600 text-white',
  },
  {
    id: 'cloudbalt',
    name: 'CloudBalt',
    kind: { lv: 'IT pakalpojumu uzņēmums', en: 'IT services company' },
    location: { lv: 'Rīga · attālināti', en: 'Riga · remote' },
    tone: 'bg-sky-600 text-white',
  },
  {
    id: 'kodaklubs',
    name: 'Novada Koda klubs',
    kind: { lv: 'Jauniešu biedrība', en: 'Youth NGO' },
    location: { lv: 'Saldus', en: 'Saldus' },
    tone: 'bg-amber-500 text-white',
  },
]

/* -------------------------------------------------------------------------- */
/*  8. COURSES & TRAINING — offered by the providers above (EXAMPLES)          */
/*     type:   course = kurss · bootcamp = intensīvais · internship = prakse   */
/*     format: online · saldus (in person in Saldus) · hybrid                  */
/*     price:  0 = free, otherwise euros                                       */
/* -------------------------------------------------------------------------- */
export type CourseType = 'course' | 'bootcamp' | 'internship'
export type CourseFormat = 'online' | 'saldus' | 'hybrid'

export interface Course {
  id: string
  providerId: string
  careerId: string
  type: CourseType
  format: CourseFormat
  level: 'beginner' | 'intermediate'
  price: number
  title: Localized
  description: Localized
  duration: Localized
  start: Localized
  keywords: string
}

export const COURSES: Course[] = [
  {
    id: 'sec-basics',
    providerId: 'secnord',
    careerId: 'cyber',
    type: 'course',
    format: 'online',
    level: 'beginner',
    price: 0,
    title: { lv: 'Kiberdrošības pamati jauniešiem', en: 'Cybersecurity basics for young people' },
    description: {
      lv: 'Paroles, tīkli, pikšķerēšana un tas, kā domā uzbrucējs. Ar praktiskiem uzdevumiem pārlūkā.',
      en: 'Passwords, networks, phishing and how an attacker thinks. With hands-on tasks in the browser.',
    },
    duration: { lv: '6 nedēļas', en: '6 weeks' },
    start: { lv: 'Sākas novembrī', en: 'Starts in November' },
    keywords: 'security drošība hacker paroles tīkli phishing',
  },
  {
    id: 'sec-intern',
    providerId: 'secnord',
    careerId: 'cyber',
    type: 'internship',
    format: 'hybrid',
    level: 'intermediate',
    price: 0,
    title: { lv: 'Vasaras prakse drošības komandā', en: 'Summer internship in a security team' },
    description: {
      lv: 'Divus mēnešus strādā kopā ar drošības analītiķiem: uzraugi brīdinājumus un palīdzi izmeklēt incidentus.',
      en: 'Spend two months with security analysts: monitor alerts and help investigate incidents.',
    },
    duration: { lv: '2 mēneši', en: '2 months' },
    start: { lv: 'Pieteikšanās līdz aprīlim', en: 'Apply by April' },
    keywords: 'prakse internship soc analītiķis',
  },
  {
    id: 'ctf-saldus',
    providerId: 'kodaklubs',
    careerId: 'cyber',
    type: 'course',
    format: 'saldus',
    level: 'beginner',
    price: 0,
    title: { lv: 'CTF treniņi Saldū', en: 'CTF practice in Saldus' },
    description: {
      lv: 'Reizi nedēļā risinām drošības “mīklas” komandās. Atnāc ar savu klēpjdatoru vai izmanto kluba datoru.',
      en: 'Once a week we solve security “puzzles” in teams. Bring your laptop or use one of the club’s.',
    },
    duration: { lv: 'Katru ceturtdienu', en: 'Every Thursday' },
    start: { lv: 'Var pievienoties jebkurā laikā', en: 'Join any time' },
    keywords: 'ctf spēles games komanda saldus klātienē',
  },
  {
    id: 'python-data',
    providerId: 'datudarbnica',
    careerId: 'ai-data',
    type: 'course',
    format: 'online',
    level: 'beginner',
    price: 39,
    title: { lv: 'Python un datu analīze no nulles', en: 'Python and data analysis from zero' },
    description: {
      lv: 'Iemācies Python, strādā ar tabulām un veido grafikus no īstiem Latvijas datiem.',
      en: 'Learn Python, work with tables and build charts from real Latvian data.',
    },
    duration: { lv: '8 nedēļas', en: '8 weeks' },
    start: { lv: 'Sākas decembrī', en: 'Starts in December' },
    keywords: 'python dati data excel grafiki analīze',
  },
  {
    id: 'ai-bootcamp',
    providerId: 'datudarbnica',
    careerId: 'ai-data',
    type: 'bootcamp',
    format: 'hybrid',
    level: 'intermediate',
    price: 79,
    title: { lv: 'MI projektu intensīvais kurss', en: 'AI projects bootcamp' },
    description: {
      lv: 'Četrās nedēļās uztrenē savu MI modeli un izveido nelielu čatbotu. Noslēgumā — prezentācija uzņēmumam.',
      en: 'In four weeks, train your own AI model and build a small chatbot. Ends with a pitch to the company.',
    },
    duration: { lv: '4 nedēļas', en: '4 weeks' },
    start: { lv: 'Sākas februārī', en: 'Starts in February' },
    keywords: 'mi ai mākslīgais intelekts machine learning čatbots',
  },
  {
    id: 'data-intern',
    providerId: 'cloudbalt',
    careerId: 'ai-data',
    type: 'internship',
    format: 'online',
    level: 'beginner',
    price: 0,
    title: { lv: 'Datu analītiķa prakse (attālināti)', en: 'Data analyst internship (remote)' },
    description: {
      lv: 'Palīdzi komandai sakārtot datus un veidot atskaites. Strādā no mājām, ar mentoru katru nedēļu.',
      en: 'Help the team clean data and build reports. Work from home, with a weekly mentor call.',
    },
    duration: { lv: '3 mēneši', en: '3 months' },
    start: { lv: 'Pieteikšanās atvērta', en: 'Applications open' },
    keywords: 'prakse internship dati remote attālināti',
  },
  {
    id: 'first-site',
    providerId: 'weblauks',
    careerId: 'web',
    type: 'course',
    format: 'online',
    level: 'beginner',
    price: 0,
    title: { lv: 'Pirmā mājaslapa: HTML un CSS', en: 'Your first website: HTML and CSS' },
    description: {
      lv: 'Soli pa solim izveido un publicē savu personīgo mājaslapu. Nekāda iepriekšēja pieredze nav vajadzīga.',
      en: 'Build and publish your own personal website step by step. No previous experience needed.',
    },
    duration: { lv: '4 nedēļas', en: '4 weeks' },
    start: { lv: 'Sāc jebkurā laikā', en: 'Start any time' },
    keywords: 'html css web mājaslapa dizains',
  },
  {
    id: 'react-bootcamp',
    providerId: 'weblauks',
    careerId: 'web',
    type: 'bootcamp',
    format: 'hybrid',
    level: 'intermediate',
    price: 59,
    title: { lv: 'React izstrādes intensīvais kurss', en: 'React development bootcamp' },
    description: {
      lv: 'Strādā komandā pie īsta projekta, mācies Git un koda pārskatīšanu kā īstā aģentūrā.',
      en: 'Work in a team on a real project, learning Git and code review like at a real agency.',
    },
    duration: { lv: '6 nedēļas', en: '6 weeks' },
    start: { lv: 'Sākas martā', en: 'Starts in March' },
    keywords: 'react javascript programmēšana git komanda',
  },
  {
    id: 'web-workshop',
    providerId: 'kodaklubs',
    careerId: 'web',
    type: 'course',
    format: 'saldus',
    level: 'beginner',
    price: 0,
    title: { lv: 'Web projektu darbnīca Saldū', en: 'Web project workshop in Saldus' },
    description: {
      lv: 'Kopā veidojam mājaslapas vietējām biedrībām un pasākumiem. Labs pirmais projekts tavā portfolio.',
      en: 'We build websites for local NGOs and events together. A great first portfolio project.',
    },
    duration: { lv: 'Sestdienās, 8 nedēļas', en: 'Saturdays, 8 weeks' },
    start: { lv: 'Sākas janvārī', en: 'Starts in January' },
    keywords: 'web saldus klātienē projekts portfolio',
  },
  {
    id: 'web-intern',
    providerId: 'cloudbalt',
    careerId: 'web',
    type: 'internship',
    format: 'online',
    level: 'intermediate',
    price: 0,
    title: { lv: 'Junior web izstrādātāja prakse', en: 'Junior web developer internship' },
    description: {
      lv: 'Labo kļūdas un veido nelielas funkcijas īstā produktā. Pilnībā attālināti.',
      en: 'Fix bugs and build small features in a real product. Fully remote.',
    },
    duration: { lv: '3 mēneši', en: '3 months' },
    start: { lv: 'Pieteikšanās līdz maijam', en: 'Apply by May' },
    keywords: 'prakse internship javascript remote',
  },
]

/* -------------------------------------------------------------------------- */
/*  9. PEOPLE — suggested people to follow (EXAMPLES, not real persons)        */
/*     kind: mentor · pro (professional) · peer (another young person)         */
/* -------------------------------------------------------------------------- */
export type PersonKind = 'mentor' | 'pro' | 'peer'

export interface Person {
  id: string
  name: string
  kind: PersonKind
  role: Localized
  location: Localized
  careerId: string
  interests: string[]
  bio: Localized
  followers: number
  /** Tools and skills on the person's profile. "LV / EN" strings are split by language. */
  skills: string[]
  /** "Mans ceļš" — how they got into the field, oldest first. */
  journey: { when: Localized; text: Localized }[]
}

export const PEOPLE: Person[] = [
  {
    id: 'laura',
    name: 'Laura Kalniņa',
    kind: 'mentor',
    role: { lv: 'Kiberdrošības analītiķe, SecNord Labs', en: 'Security analyst, SecNord Labs' },
    location: { lv: 'Saldus (attālināti)', en: 'Saldus (remote)' },
    careerId: 'cyber',
    interests: ['security', 'problems'],
    bio: {
      lv: 'Strādāju Rīgas uzņēmumam, dzīvojot Saldū. Palīdzu iesācējiem saprast, ar ko sākt drošībā.',
      en: 'I work for a Riga company while living in Saldus. I help beginners figure out where to start in security.',
    },
    followers: 214,
    skills: ['Linux', 'Tīklu drošība / Network security', 'SIEM', 'Python', 'Incidentu analīze / Incident response'],
    journey: [
      { when: { lv: '2017', en: '2017' }, text: { lv: 'Saldū pabeidzu vidusskolu, interesēja datori un spēles.', en: 'Finished school in Saldus; into computers and games.' } },
      { when: { lv: '2019', en: '2019' }, text: { lv: 'Bezmaksas tiešsaistes drošības kurss un pirmās CTF sacensības.', en: 'A free online security course and my first CTF competitions.' } },
      { when: { lv: '2021', en: '2021' }, text: { lv: 'Prakse drošības komandā, pēc tam pastāvīgs darbs — attālināti no Saldus.', en: 'Internship in a security team, then a permanent remote job from Saldus.' } },
    ],
  },
  {
    id: 'martins',
    name: 'Mārtiņš Ozols',
    kind: 'mentor',
    role: { lv: 'Datu zinātnieks, DatuDarbnīca', en: 'Data scientist, DatuDarbnīca' },
    location: { lv: 'Kuldīga', en: 'Kuldīga' },
    careerId: 'ai-data',
    interests: ['ai', 'data', 'math'],
    bio: {
      lv: 'Pirms 5 gadiem nezināju, kas ir Python. Tagad māku stāstīt, kā tur nokļūt bez augstskolas diploma datorzinātnēs.',
      en: 'Five years ago I didn’t know what Python was. Now I share how to get there without a CS degree.',
    },
    followers: 389,
    skills: ['Python', 'SQL', 'Pandas', 'Mašīnmācīšanās / Machine learning', 'Datu vizualizācija / Data visualisation'],
    journey: [
      { when: { lv: '2018', en: '2018' }, text: { lv: 'Strādāju veikalā un sāku mācīties Python vakaros.', en: 'Worked in a shop and started learning Python in the evenings.' } },
      { when: { lv: '2020', en: '2020' }, text: { lv: 'Pirmais datu projekts: pārdošanas prognoze vietējam uzņēmumam.', en: 'First data project: a sales forecast for a local business.' } },
      { when: { lv: '2022', en: '2022' }, text: { lv: 'Datu zinātnieks — tagad mācu citus iesācējus.', en: 'Data scientist — now I teach other beginners.' } },
    ],
  },
  {
    id: 'eliza',
    name: 'Elīza Bērziņa',
    kind: 'pro',
    role: { lv: 'Frontend izstrādātāja, WebLauks', en: 'Frontend developer, WebLauks' },
    location: { lv: 'Saldus', en: 'Saldus' },
    careerId: 'web',
    interests: ['coding', 'design'],
    bio: {
      lv: 'Veidoju mājaslapas klientiem visā Eiropā. Dalos ar padomiem par portfolio un pirmo darbu.',
      en: 'I build websites for clients across Europe. Sharing tips on portfolios and landing a first job.',
    },
    followers: 156,
    skills: ['HTML', 'CSS', 'JavaScript', 'React', 'Figma'],
    journey: [
      { when: { lv: '2019', en: '2019' }, text: { lv: 'Uztaisīju mājaslapu sava drauga grupai.', en: 'Built a website for a friend’s band.' } },
      { when: { lv: '2021', en: '2021' }, text: { lv: 'Intensīvais web kurss un pirmie klientu projekti.', en: 'A web bootcamp and my first client projects.' } },
      { when: { lv: '2023', en: '2023' }, text: { lv: 'Frontend izstrādātāja aģentūrā, strādāju no Saldus.', en: 'Frontend developer at an agency, working from Saldus.' } },
    ],
  },
  {
    id: 'davis',
    name: 'Dāvis Krūmiņš',
    kind: 'mentor',
    role: { lv: 'Novada Koda kluba vadītājs', en: 'Leader, Novada Koda klubs' },
    location: { lv: 'Saldus', en: 'Saldus' },
    careerId: 'web',
    interests: ['coding', 'games', 'problems'],
    bio: {
      lv: 'Organizēju CTF treniņus un web darbnīcas Saldū. Nāc ciemos — pieredze nav vajadzīga!',
      en: 'I run CTF practice and web workshops in Saldus. Drop by — no experience needed!',
    },
    followers: 97,
    skills: ['JavaScript', 'Linux', 'CTF', 'Mentorēšana / Mentoring', 'Pasākumu organizēšana / Event organising'],
    journey: [
      { when: { lv: '2015', en: '2015' }, text: { lv: 'Sāku programmēt kā hobijs.', en: 'Started programming as a hobby.' } },
      { when: { lv: '2020', en: '2020' }, text: { lv: 'Nodibināju koda klubu Saldū ar 6 dalībniekiem.', en: 'Founded a code club in Saldus with 6 members.' } },
      { when: { lv: '2024', en: '2024' }, text: { lv: 'Klubā tagad ir regulāri CTF treniņi un web darbnīcas.', en: 'The club now runs regular CTF practice and web workshops.' } },
    ],
  },
  {
    id: 'anete',
    name: 'Anete Vītola',
    kind: 'pro',
    role: { lv: 'UX dizainere, CloudBalt', en: 'UX designer, CloudBalt' },
    location: { lv: 'Brocēni (attālināti)', en: 'Brocēni (remote)' },
    careerId: 'web',
    interests: ['design', 'problems'],
    bio: {
      lv: 'Projektēju, kā cilvēki lieto lietotnes. Dizains IT nozarē ir daudz vairāk nekā skaistas bildes.',
      en: 'I design how people use apps. Design in tech is much more than pretty pictures.',
    },
    followers: 131,
    skills: ['Figma', 'Lietotāju izpēte / User research', 'Prototipēšana / Prototyping', 'Dizaina sistēmas / Design systems'],
    journey: [
      { when: { lv: '2018', en: '2018' }, text: { lv: 'Mācījos grafisko dizainu.', en: 'Studied graphic design.' } },
      { when: { lv: '2020', en: '2020' }, text: { lv: 'Tiešsaistes UX kurss un pirmais lietotnes projekts.', en: 'An online UX course and my first app project.' } },
      { when: { lv: '2022', en: '2022' }, text: { lv: 'UX dizainere IT uzņēmumā, attālināti no Brocēniem.', en: 'UX designer at an IT company, remote from Brocēni.' } },
    ],
  },
  {
    id: 'kristaps',
    name: 'Kristaps Jansons',
    kind: 'peer',
    role: { lv: 'Kiberdrošības praktikants, 20 g.', en: 'Security intern, 20' },
    location: { lv: 'Saldus', en: 'Saldus' },
    careerId: 'cyber',
    interests: ['security', 'games', 'coding'],
    bio: {
      lv: 'Sāku ar CTF treniņiem kodu klubā, tagad esmu praksē. Pastāstīšu, kā tas bija.',
      en: 'I started with CTF practice at the code club, now I’m an intern. Happy to share how it went.',
    },
    followers: 48,
    skills: ['Linux', 'Python', 'CTF', 'Wireshark'],
    journey: [
      { when: { lv: '2022', en: '2022' }, text: { lv: 'Pirmais CTF treniņš koda klubā Saldū.', en: 'First CTF practice at the code club in Saldus.' } },
      { when: { lv: '2024', en: '2024' }, text: { lv: 'Kiberdrošības pamatu kurss tiešsaistē.', en: 'An online cybersecurity basics course.' } },
      { when: { lv: '2025', en: '2025' }, text: { lv: 'Prakse drošības uzņēmumā.', en: 'Internship at a security company.' } },
    ],
  },
  {
    id: 'katrina',
    name: 'Katrīna Zariņa',
    kind: 'peer',
    role: { lv: 'Datorzinātņu studente, 19 g.', en: 'Computer science student, 19' },
    location: { lv: 'Rīga (no Saldus)', en: 'Riga (from Saldus)' },
    careerId: 'ai-data',
    interests: ['ai', 'math', 'data'],
    bio: {
      lv: 'Studēju un mācos par mākslīgo intelektu. Rakstu par to, kā izvēlēties studijas.',
      en: 'Studying and learning about AI. I write about how to choose what to study.',
    },
    followers: 63,
    skills: ['Python', 'Matemātika / Maths', 'Jupyter', 'Statistika / Statistics'],
    journey: [
      { when: { lv: '2023', en: '2023' }, text: { lv: 'Matemātikas olimpiāde un pirmā saskarsme ar MI.', en: 'Maths olympiad and my first encounter with AI.' } },
      { when: { lv: '2024', en: '2024' }, text: { lv: 'Iestājos datorzinātņu studijās.', en: 'Started a computer science degree.' } },
      { when: { lv: '2025', en: '2025' }, text: { lv: 'Mācos mašīnmācīšanos un rakstu par to blogā.', en: 'Learning machine learning and blogging about it.' } },
    ],
  },
  {
    id: 'roberts',
    name: 'Roberts Liepiņš',
    kind: 'peer',
    role: { lv: 'Vidusskolēns, 17 g.', en: 'High-school student, 17' },
    location: { lv: 'Saldus', en: 'Saldus' },
    careerId: 'web',
    interests: ['games', 'coding'],
    bio: {
      lv: 'Veidoju savu pirmo spēli un mācos JavaScript. Meklēju, ar ko kopā taisīt projektus.',
      en: 'Making my first game and learning JavaScript. Looking for people to build projects with.',
    },
    followers: 22,
    skills: ['JavaScript', 'HTML', 'Spēļu izstrāde / Game development'],
    journey: [
      { when: { lv: '2024', en: '2024' }, text: { lv: 'Sāku taisīt vienkāršas spēles pārlūkā.', en: 'Started making simple browser games.' } },
      { when: { lv: '2025', en: '2025' }, text: { lv: 'Pievienojos koda klubam Saldū.', en: 'Joined the code club in Saldus.' } },
      { when: { lv: '2026', en: '2026' }, text: { lv: 'Meklēju komandu savai pirmajai lielajai spēlei.', en: 'Looking for a team for my first big game.' } },
    ],
  },
]
