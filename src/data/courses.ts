/**
 * SEER — courses, bootcamps & internships (FICTIONAL EXAMPLES)
 * Mock data: typed constants that a real API can replace later.
 */
import type { TrackId } from './careers'
import type { SkillAreaId } from './skillAreas'
import type { Lang, Localized } from './types'

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
  careerId: TrackId
  type: CourseType
  format: CourseFormat
  level: 'beginner' | 'intermediate'
  price: number
  title: Localized
  description: Localized
  duration: Localized
  start: Localized
  keywords: string
  /** Languages the course is taught in. */
  languages: Lang[]
  /** Skill points (0–100 scale) gained when the course is completed. Highlights courses that close gaps. */
  skills: Partial<Record<SkillAreaId, number>>
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
    languages: ['lv'],
    skills: { security: 30, networks: 15 },
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
    languages: ['lv', 'en'],
    skills: { security: 25, networks: 20, troubleshooting: 15, english: 10 },
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
    languages: ['lv'],
    skills: { security: 20, troubleshooting: 15, programming: 10 },
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
    languages: ['lv'],
    skills: { programming: 25, data: 25, math: 10 },
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
    languages: ['lv', 'en'],
    skills: { data: 25, programming: 15, math: 15 },
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
    languages: ['en'],
    skills: { data: 30, english: 10, communication: 10 },
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
    languages: ['lv'],
    skills: { web: 30, design: 15 },
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
    languages: ['lv', 'en'],
    skills: { web: 25, programming: 25 },
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
    languages: ['lv'],
    skills: { web: 20, design: 15, communication: 10 },
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
    languages: ['en'],
    skills: { web: 20, programming: 20, english: 10 },
  },
  {
    id: 'pc-basics',
    providerId: 'kodaklubs',
    careerId: 'it-support',
    type: 'course',
    format: 'saldus',
    level: 'beginner',
    price: 0,
    title: { lv: 'Datoru labošanas darbnīca', en: 'Computer repair workshop' },
    description: {
      lv: 'Izjauc un saliec datoru, uzstādi sistēmu un uzzini, kā atrast problēmas cēloni. Klātienē Saldū.',
      en: 'Take apart and rebuild a computer, install an operating system and learn to find the cause of a problem. In person in Saldus.',
    },
    duration: { lv: '6 sestdienas', en: '6 Saturdays' },
    start: { lv: 'Sākas novembrī', en: 'Starts in November' },
    keywords: 'dators remonts hardware atbalsts support saldus klātienē',
    languages: ['lv'],
    skills: { troubleshooting: 30, networks: 15 },
  },
  {
    id: 'helpdesk-course',
    providerId: 'cloudbalt',
    careerId: 'it-support',
    type: 'course',
    format: 'online',
    level: 'beginner',
    price: 0,
    title: { lv: 'IT atbalsta pamati: no pieteikuma līdz risinājumam', en: 'IT support basics: from ticket to fix' },
    description: {
      lv: 'Kā pieņemt pieteikumu, uzdot pareizos jautājumus un skaidri izskaidrot risinājumu cilvēkam, kurš nav IT speciālists.',
      en: 'How to take a ticket, ask the right questions and clearly explain the fix to someone who isn’t technical.',
    },
    duration: { lv: '4 nedēļas', en: '4 weeks' },
    start: { lv: 'Sāc jebkurā laikā', en: 'Start any time' },
    keywords: 'helpdesk atbalsts support komunikācija angļu',
    languages: ['lv', 'en'],
    skills: { communication: 25, troubleshooting: 20, english: 10 },
  },
  {
    id: 'network-basics',
    providerId: 'secnord',
    careerId: 'it-support',
    type: 'course',
    format: 'online',
    level: 'beginner',
    price: 0,
    title: { lv: 'Tīkli un Wi-Fi iesācējiem', en: 'Networks and Wi-Fi for beginners' },
    description: {
      lv: 'Kas ir IP adrese, maršrutētājs un DNS — un kā atrast, kāpēc internets “nestrādā”.',
      en: 'What an IP address, router and DNS are — and how to find out why the internet “isn’t working”.',
    },
    duration: { lv: '3 nedēļas', en: '3 weeks' },
    start: { lv: 'Sāc jebkurā laikā', en: 'Start any time' },
    keywords: 'tīkli network wifi internets ip dns',
    languages: ['lv'],
    skills: { networks: 30, troubleshooting: 10, security: 10 },
  },
]
