/**
 * ERE — free training tasks a provider attaches to a course (FICTIONAL EXAMPLE).
 * Each task is a short real-life challenge with one correct answer. Solving it
 * marks the task done and adds its skill points (see lib/skills.ts).
 *
 * Example: SecNord Labs gives 4 free practice tasks with "Kiberdrošības pamati jauniešiem".
 */
import type { SkillAreaId } from './skillAreas'
import type { Localized } from './types'

/** Optional material shown above the question. */
export type TaskMaterial =
  | { kind: 'email'; from: string; subject: Localized; body: Localized }
  | { kind: 'table'; columns: Localized[]; rows: string[][] }
  | { kind: 'urls'; items: string[] }

export interface TrainingTask {
  id: string
  courseId: string
  title: Localized
  /** What to do, in one or two sentences. */
  brief: Localized
  difficulty: 'easy' | 'medium' | 'hard'
  minutes: number
  material?: TaskMaterial
  question: Localized
  options: Localized[]
  correct: number
  /** Shown after answering — teaches the "why". */
  explanation: Localized
  skills: Partial<Record<SkillAreaId, number>>
}

export const TASKS: TrainingTask[] = [
  {
    id: 'phishing-email',
    courseId: 'sec-basics',
    title: { lv: 'Atpazīsti krāpniecisku e-pastu', en: 'Spot a scam email' },
    brief: { lv: 'Izlasi e-pastu un atrodi galveno krāpšanas pazīmi.', en: 'Read the email and find the main sign of a scam.' },
    difficulty: 'easy',
    minutes: 3,
    material: {
      kind: 'email',
      from: 'atbalsts@konts-drosiba-lv.info',
      subject: { lv: 'Tavs konts tiks bloķēts 24 stundu laikā!', en: 'Your account will be blocked within 24 hours!' },
      body: {
        lv: 'Sveiki! Mēs pamanījām aizdomīgas darbības. Lai konts netiktu bloķēts, nekavējoties ievadi savu paroli šeit: konts-drosiba-lv.info/login',
        en: 'Hi! We noticed suspicious activity. To keep your account from being blocked, enter your password here right away: konts-drosiba-lv.info/login',
      },
    },
    question: { lv: 'Kas liecina, ka tā ir krāpšana?', en: 'What shows this is a scam?' },
    options: [
      { lv: 'E-pasts ir latviešu valodā', en: 'The email is in Latvian' },
      { lv: 'Steidzamība un lūgums ievadīt paroli nezināmā lapā', en: 'Urgency and a request to enter your password on an unknown site' },
      { lv: 'E-pastā nav bilžu', en: 'The email has no pictures' },
    ],
    correct: 1,
    explanation: {
      lv: 'Īsti uzņēmumi nekad neprasa paroli e-pastā. Steidzamība (“24 stundās!”) un dīvaina adrese ir klasiskas krāpšanas pazīmes.',
      en: 'Real companies never ask for your password by email. Urgency (“within 24 hours!”) and an odd address are classic scam signs.',
    },
    skills: { security: 5 },
  },
  {
    id: 'strong-password',
    courseId: 'sec-basics',
    title: { lv: 'Izvēlies drošāko paroli', en: 'Pick the strongest password' },
    brief: { lv: 'Kura no šīm parolēm ir visgrūtāk uzminama?', en: 'Which of these passwords is hardest to guess?' },
    difficulty: 'easy',
    minutes: 2,
    question: { lv: 'Drošākā parole ir…', en: 'The strongest password is…' },
    options: [
      { lv: 'Anna2008', en: 'Anna2008' },
      { lv: 'Saldus123!', en: 'Saldus123!' },
      { lv: 'zils-ozols-lietus-kafija', en: 'blue-oak-rain-coffee' },
    ],
    correct: 2,
    explanation: {
      lv: 'Garas frāzes no nejaušiem vārdiem ir grūti uzminēt, bet viegli atcerēties. Vārds + gads vai pilsēta + cipari ir pirmais, ko izmēģina uzlauzēji.',
      en: 'Long phrases of random words are hard to guess but easy to remember. Name + year or city + digits are the first things attackers try.',
    },
    skills: { security: 5 },
  },
  {
    id: 'suspicious-login',
    courseId: 'sec-basics',
    title: { lv: 'Atrodi aizdomīgu pieteikšanos', en: 'Find the suspicious login' },
    brief: {
      lv: 'Šis ir viena konta pieteikšanās žurnāls. Kura rinda ir aizdomīga?',
      en: 'This is one account’s login log. Which row is suspicious?',
    },
    difficulty: 'medium',
    minutes: 5,
    material: {
      kind: 'table',
      columns: [
        { lv: 'Laiks', en: 'Time' },
        { lv: 'Vieta', en: 'Place' },
        { lv: 'Ierīce', en: 'Device' },
        { lv: 'Rezultāts', en: 'Result' },
      ],
      rows: [
        ['08:14', 'Saldus, LV', 'Android', '✓'],
        ['12:40', 'Saldus, LV', 'Windows', '✓'],
        ['03:12', '?? (VPN)', 'Linux', '5× ✗, ✓'],
        ['19:05', 'Rīga, LV', 'Android', '✓'],
      ],
    },
    question: { lv: 'Kura pieteikšanās ir aizdomīga?', en: 'Which login is suspicious?' },
    options: [
      { lv: '08:14 no Saldus', en: '08:14 from Saldus' },
      { lv: '03:12 pēc 5 neveiksmīgiem mēģinājumiem', en: '03:12 after 5 failed attempts' },
      { lv: '19:05 no Rīgas', en: '19:05 from Riga' },
    ],
    correct: 1,
    explanation: {
      lv: 'Nakts laiks, nezināma vieta, jauna ierīce un vairāki nepareizi mēģinājumi pēc kārtas — tā izskatās paroles minēšana. Analītiķis šādu kontu bloķētu un mainītu paroli.',
      en: 'Night time, unknown place, a new device and several failed tries in a row — that’s password guessing. An analyst would lock the account and reset the password.',
    },
    skills: { security: 5, networks: 5 },
  },
  {
    id: 'safe-url',
    courseId: 'sec-basics',
    title: { lv: 'Kurā lapā drīkst ievadīt paroli?', en: 'Where is it safe to enter a password?' },
    brief: { lv: 'Apskati adreses un izvēlies drošo.', en: 'Look at the addresses and pick the safe one.' },
    difficulty: 'hard',
    minutes: 4,
    material: {
      kind: 'urls',
      items: ['http://skola-saldus.lv/login', 'https://skoIa-saldus.lv/login', 'https://skola-saldus.lv/login'],
    },
    question: { lv: 'Drošā adrese ir…', en: 'The safe address is…' },
    options: [
      { lv: 'Pirmā (http://)', en: 'The first (http://)' },
      { lv: 'Otrā (https://skoIa…)', en: 'The second (https://skoIa…)' },
      { lv: 'Trešā (https://skola…)', en: 'The third (https://skola…)' },
    ],
    correct: 2,
    explanation: {
      lv: 'Pirmā nav šifrēta (http). Otrajā “l” vietā ir liels “I” — tā ir viltus lapa. Vienmēr pārbaudi gan https, gan katru burtu adresē.',
      en: 'The first isn’t encrypted (http). The second uses a capital “I” instead of “l” — a fake site. Always check both https and every letter of the address.',
    },
    skills: { security: 10, networks: 5 },
  },
]
