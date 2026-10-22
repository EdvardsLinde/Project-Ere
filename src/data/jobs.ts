/**
 * SEER — jobs & internships (FICTIONAL EXAMPLES). Each role lists the skill levels
 * (0–100) it needs; the Jobs page compares them with the user's levels → fit %.
 */
import type { TrackId } from './careers'
import type { SkillAreaId } from './skillAreas'
import type { Lang, Localized } from './types'

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
  /** Working languages. */
  languages: Lang[]
  /** "Ko prasām" — requirements. */
  requires: Localized[]
  /** "Ko sagaidām" — what the work involves day to day. */
  expects: Localized[]
  /** "Ko piedāvājam" — what the employer offers. */
  offers: Localized[]
  /** Hours / schedule in one line. */
  schedule: Localized
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
    languages: ['lv'],
    requires: [
      { lv: 'Interese par datoriem un tehniku', en: 'Interest in computers and tech' },
      { lv: 'Spēja mierīgi un pieklājīgi runāt ar cilvēkiem', en: 'Ability to talk to people calmly and politely' },
      { lv: 'Mācies skolā vai ģimnāzijā Saldū vai tuvumā', en: 'You study at a school in or near Saldus' },
    ],
    expects: [
      { lv: 'Palīdzēt kolēģiem ar paroļu atjaunošanu un printeriem', en: 'Help colleagues with password resets and printers' },
      { lv: 'Uzstādīt programmas jaunajiem datoriem', en: 'Install software on new computers' },
      { lv: 'Pierakstīt, kas izdarīts, vienkāršā tabulā', en: 'Note what you did in a simple sheet' },
    ],
    offers: [
      { lv: 'Apmaksāts darbs pēc stundām', en: 'Paid work after school' },
      { lv: 'Mentors no IT nodaļas', en: 'A mentor from the IT team' },
      { lv: 'Atsauksme tavam CV', en: 'A reference for your CV' },
    ],
    schedule: { lv: '10–15 h nedēļā, pēc stundām', en: '10–15 h a week, after school' },
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
    languages: ['lv', 'en'],
    requires: [
      { lv: 'Angļu valoda sarunu līmenī', en: 'Conversational English' },
      { lv: 'Pamatzināšanas par Windows un tīkliem', en: 'Basic Windows and networking knowledge' },
      { lv: 'Pacietība un skaidra rakstīšana', en: 'Patience and clear writing' },
    ],
    expects: [
      { lv: 'Atbildēt klientiem čatā un e-pastā', en: 'Answer customers by chat and email' },
      { lv: 'Atjaunot piekļuvi kontiem', en: 'Restore account access' },
      { lv: 'Sarežģītākas problēmas nodot kolēģiem', en: 'Escalate harder issues to colleagues' },
    ],
    offers: [
      { lv: 'Pilnībā attālināti — strādā no Saldus', en: 'Fully remote — work from Saldus' },
      { lv: 'Klēpjdators un austiņas', en: 'Laptop and headset' },
      { lv: 'Apmaksāti sertifikācijas kursi', en: 'Paid certification courses' },
    ],
    schedule: { lv: 'Pilna slodze, maiņas 8:00–16:00 vai 12:00–20:00', en: 'Full-time, shifts 8:00–16:00 or 12:00–20:00' },
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
    languages: ['lv', 'en'],
    requires: [
      { lv: 'Izpratne par tīkliem un drošības pamatiem', en: 'Understanding of networks and security basics' },
      { lv: 'Angļu valoda darba līmenī', en: 'Working English' },
      { lv: 'Uzmanība detaļām', en: 'Attention to detail' },
    ],
    expects: [
      { lv: 'Uzraudzīt drošības brīdinājumus', en: 'Monitor security alerts' },
      { lv: 'Izmeklēt aizdomīgus e-pastus un pieteikšanās', en: 'Investigate suspicious emails and logins' },
      { lv: 'Rakstīt īsus incidentu pārskatus', en: 'Write short incident reports' },
    ],
    offers: [
      { lv: '3 mēnešu apmācības ar mentoru', en: '3 months of mentored training' },
      { lv: '2 dienas birojā Rīgā, pārējās — attālināti', en: '2 days in the Riga office, the rest remote' },
      { lv: 'Atbalsts sertifikātu iegūšanai', en: 'Support for certifications' },
    ],
    schedule: { lv: 'Pilna slodze', en: 'Full-time' },
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
    languages: ['lv'],
    requires: [
      { lv: 'Interese par kiberdrošību (CTF pieredze — plus)', en: 'Interest in cybersecurity (CTF experience is a plus)' },
      { lv: 'Pamatzināšanas par datoriem un internetu', en: 'Basic computer and internet knowledge' },
      { lv: 'Vēlme mācīties', en: 'Eagerness to learn' },
    ],
    expects: [
      { lv: 'Pārbaudīt paroļu politiku un konfigurācijas', en: 'Review password policies and settings' },
      { lv: 'Palīdzēt testēt sistēmas kopā ar analītiķiem', en: 'Help test systems with analysts' },
      { lv: 'Noslēgumā prezentēt savu mazo projektu', en: 'Present a small project at the end' },
    ],
    offers: [
      { lv: 'Apmaksāta prakse', en: 'Paid internship' },
      { lv: 'Darbs no mājām', en: 'Work from home' },
      { lv: 'Prakses sertifikāts', en: 'Internship certificate' },
    ],
    schedule: { lv: '2 mēneši vasarā, 20–30 h nedēļā', en: '2 months in summer, 20–30 h a week' },
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
    languages: ['lv'],
    requires: [
      { lv: 'Precizitāte un pacietība', en: 'Accuracy and patience' },
      { lv: 'Prot strādāt ar izklājlapām (Excel vai Google Sheets)', en: 'Can use spreadsheets (Excel or Google Sheets)' },
      { lv: 'Angļu valodas pamati', en: 'Basic English' },
    ],
    expects: [
      { lv: 'Pārbaudīt un labot datus MI projektiem', en: 'Check and fix data for AI projects' },
      { lv: 'Atzīmēt attēlus un tekstus pēc instrukcijas', en: 'Label images and text by instructions' },
      { lv: 'Ziņot par kļūdām datos', en: 'Report errors in data' },
    ],
    offers: [
      { lv: 'Apmaksāts vasaras darbs', en: 'Paid summer job' },
      { lv: 'Attālināti, elastīgs laiks', en: 'Remote, flexible hours' },
      { lv: 'Iepazīsti, kā top MI', en: 'See how AI is built' },
    ],
    schedule: { lv: 'Vasarā, līdz 30 h nedēļā', en: 'Summer, up to 30 h a week' },
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
    languages: ['lv', 'en'],
    requires: [
      { lv: 'Python vai SQL pamati', en: 'Basic Python or SQL' },
      { lv: 'Laba matemātika un loģika', en: 'Good maths and logic' },
      { lv: 'Angļu valoda darba līmenī', en: 'Working English' },
    ],
    expects: [
      { lv: 'Veidot atskaites un grafikus klientiem', en: 'Build reports and charts for clients' },
      { lv: 'Sakārtot datus no dažādiem avotiem', en: 'Clean data from different sources' },
      { lv: 'Skaidri izskaidrot rezultātus', en: 'Explain results clearly' },
    ],
    offers: [
      { lv: 'Attālināti, komandas diena Kuldīgā reizi mēnesī', en: 'Remote, a team day in Kuldīga once a month' },
      { lv: 'Mentors un koda pārskatīšana', en: 'Mentor and code review' },
      { lv: 'Apmaksāti kursi', en: 'Paid courses' },
    ],
    schedule: { lv: 'Pilna slodze', en: 'Full-time' },
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
    languages: ['en'],
    requires: [
      { lv: 'HTML, CSS un JavaScript', en: 'HTML, CSS and JavaScript' },
      { lv: 'React pamati (vai vēlme ātri apgūt)', en: 'React basics (or eager to learn fast)' },
      { lv: 'Portfolio ar vismaz vienu projektu', en: 'A portfolio with at least one project' },
    ],
    expects: [
      { lv: 'Veidot mājaslapu daļas pēc dizaina', en: 'Build parts of websites from designs' },
      { lv: 'Labot kļūdas un uzlabot ātrumu', en: 'Fix bugs and improve speed' },
      { lv: 'Strādāt komandā ar Git', en: 'Work in a team with Git' },
    ],
    offers: [
      { lv: 'Pilnībā attālināti', en: 'Fully remote' },
      { lv: 'Klēpjdators', en: 'Laptop' },
      { lv: 'Projekti klientiem visā Eiropā', en: 'Projects for clients across Europe' },
    ],
    schedule: { lv: 'Pilna slodze, elastīgs sākuma laiks', en: 'Full-time, flexible start time' },
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
    languages: ['lv'],
    requires: [
      { lv: 'Gaume un acs detaļām', en: 'An eye for design and detail' },
      { lv: 'Prot fotografēt ar telefonu', en: 'Can take photos with a phone' },
      { lv: 'Pareiza latviešu valoda', en: 'Good written Latvian' },
    ],
    expects: [
      { lv: 'Pievienot produktus un aprakstus veikalam', en: 'Add products and descriptions to the shop' },
      { lv: 'Apstrādāt produktu bildes', en: 'Edit product photos' },
      { lv: 'Pārbaudīt, vai lapa izskatās labi telefonā', en: 'Check the site looks good on phones' },
    ],
    offers: [
      { lv: 'Darbs Saldū vai no mājām', en: 'Work in Saldus or from home' },
      { lv: 'Elastīgs laiks pēc stundām', en: 'Flexible hours after school' },
      { lv: 'Pirmā darba pieredze e-komercijā', en: 'First experience in e-commerce' },
    ],
    schedule: { lv: '5–10 h nedēļā', en: '5–10 h a week' },
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
    languages: ['en'],
    requires: [
      { lv: 'HTML, CSS un JavaScript pamati', en: 'Basic HTML, CSS and JavaScript' },
      { lv: 'Angļu valoda lasīšanas līmenī', en: 'Reading-level English' },
      { lv: 'Vēlme mācīties no koda pārskatiem', en: 'Willing to learn from code reviews' },
    ],
    expects: [
      { lv: 'Labot nelielas kļūdas īstā produktā', en: 'Fix small bugs in a real product' },
      { lv: 'Veidot vienkāršas funkcijas', en: 'Build simple features' },
      { lv: 'Piedalīties komandas sapulcēs tiešsaistē', en: 'Join online team meetings' },
    ],
    offers: [
      { lv: 'Apmaksāta prakse', en: 'Paid internship' },
      { lv: 'Iknedēļas mentora saruna', en: 'Weekly mentor call' },
      { lv: 'Iespēja palikt pēc prakses', en: 'Chance to stay on after the internship' },
    ],
    schedule: { lv: '3 mēneši, 20 h nedēļā', en: '3 months, 20 h a week' },
    posted: '2026-10-07',
  },
]
