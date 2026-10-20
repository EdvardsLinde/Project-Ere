/**
 * ERE — people to follow (FICTIONAL EXAMPLES, not real persons)
 * Mock data: typed constants that a real API can replace later.
 */
import type { Localized } from './types'

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
