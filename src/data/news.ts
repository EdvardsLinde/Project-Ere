/**
 * ERE — news, events, courses and volunteering feed (FICTIONAL EXAMPLES).
 * Dates are ISO strings; the News page sorts and labels upcoming items.
 */
import type { TrackId } from './careers'
import type { Localized } from './types'

export type NewsKind = 'news' | 'event' | 'course' | 'volunteering'

export interface NewsItem {
  id: string
  kind: NewsKind
  title: Localized
  summary: Localized
  /** ISO date: publish date for news, start date for everything else. */
  date: string
  place: Localized
  /** Related career track, if any. */
  track?: TrackId
  inSaldus: boolean
}

export const NEWS: NewsItem[] = [
  {
    id: 'cowork-saldus',
    kind: 'news',
    title: { lv: 'Saldū atver koprades telpu attālinātajiem darbiniekiem', en: 'A coworking space for remote workers opens in Saldus' },
    summary: {
      lv: 'Ātrs internets, galdi un kafija — vieta, kur strādāt attālināti, ja mājās nav ērti. Jauniešiem līdz 21 gadam — bez maksas darba dienās.',
      en: 'Fast internet, desks and coffee — a place to work remotely when home isn’t ideal. Free on weekdays for under-21s.',
    },
    date: '2026-10-14',
    place: { lv: 'Saldus centrs', en: 'Saldus centre' },
    inSaldus: true,
  },
  {
    id: 'remote-trend',
    kind: 'news',
    title: { lv: 'IT uzņēmumi arvien biežāk meklē darbiniekus reģionos', en: 'IT companies increasingly hire in the regions' },
    summary: {
      lv: 'Vairāki Rīgas uzņēmumi ERE stāsta, ka attālināts darbs ļauj pieņemt cilvēkus no visas Latvijas — galvenais ir prasmes un angļu valoda.',
      en: 'Several Riga companies tell ERE that remote work lets them hire from all over Latvia — what matters is skills and English.',
    },
    date: '2026-10-08',
    place: { lv: 'Latvija', en: 'Latvia' },
    inSaldus: false,
  },
  {
    id: 'summer-interns',
    kind: 'news',
    title: { lv: 'Vietējs uzņēmums meklē vasaras praktikantus IT jomā', en: 'A local company is looking for summer IT interns' },
    summary: {
      lv: 'OzolLog nākamvasar pieņems divus praktikantus IT atbalstā. Pieteikšanās sāksies martā — sāc gatavoties jau tagad.',
      en: 'OzolLog will take two IT support interns next summer. Applications open in March — start preparing now.',
    },
    date: '2026-10-17',
    place: { lv: 'Saldus', en: 'Saldus' },
    track: 'it-support',
    inSaldus: true,
  },
  {
    id: 'ctf-night',
    kind: 'event',
    title: { lv: 'CTF vakars jauniešiem', en: 'CTF night for young people' },
    summary: {
      lv: 'Komandās risinām drošības mīklas. Iesācēji ļoti gaidīti — mentori palīdzēs. Pica uz vietas.',
      en: 'We solve security puzzles in teams. Beginners very welcome — mentors will help. Pizza provided.',
    },
    date: '2026-11-07',
    place: { lv: 'Novada Koda klubs, Saldus', en: 'Novada Koda klubs, Saldus' },
    track: 'cyber',
    inSaldus: true,
  },
  {
    id: 'career-day',
    kind: 'event',
    title: { lv: 'Tiešsaistes karjeras diena: IT uzņēmumi atbild', en: 'Online career day: IT companies answer your questions' },
    summary: {
      lv: 'Piecu uzņēmumu speciālisti stāsta par savu ikdienu un atbild uz jautājumiem. Var pieslēgties no telefona.',
      en: 'Specialists from five companies talk about their day and answer questions. Join from your phone.',
    },
    date: '2026-11-21',
    place: { lv: 'Tiešsaistē', en: 'Online' },
    inSaldus: false,
  },
  {
    id: 'hackathon',
    kind: 'event',
    title: { lv: 'Hakatons: digitāli risinājumi Saldus novadam', en: 'Hackathon: digital solutions for the Saldus region' },
    summary: {
      lv: 'Divas dienas komandās veidojam idejas un prototipus vietējām problēmām. Balvas un mentori no IT uzņēmumiem.',
      en: 'Two days building ideas and prototypes for local problems in teams. Prizes and mentors from IT companies.',
    },
    date: '2026-12-05',
    place: { lv: 'Saldus', en: 'Saldus' },
    track: 'web',
    inSaldus: true,
  },
  {
    id: 'networks-course',
    kind: 'course',
    title: { lv: 'Sākas bezmaksas kurss “Tīkli un Wi-Fi iesācējiem”', en: 'Free course “Networks and Wi-Fi for beginners” starts' },
    summary: {
      lv: 'Trīs nedēļas tiešsaistē. Pēc kursa varēsi saprast, kāpēc internets “nestrādā”, un to salabot.',
      en: 'Three weeks online. Afterwards you’ll understand why the internet “doesn’t work” — and fix it.',
    },
    date: '2026-11-03',
    place: { lv: 'Tiešsaistē', en: 'Online' },
    track: 'it-support',
    inSaldus: false,
  },
  {
    id: 'python-course',
    kind: 'course',
    title: { lv: 'Python un datu analīze — jauna grupa decembrī', en: 'Python and data analysis — new group in December' },
    summary: {
      lv: 'Astoņas nedēļas ar īstiem Latvijas datiem. Iesācējiem, bez iepriekšējas pieredzes.',
      en: 'Eight weeks with real Latvian data. For beginners, no previous experience needed.',
    },
    date: '2026-12-01',
    place: { lv: 'Tiešsaistē', en: 'Online' },
    track: 'ai-data',
    inSaldus: false,
  },
  {
    id: 'seniors-phones',
    kind: 'volunteering',
    title: { lv: 'Palīdzi senioriem apgūt viedtālruņus', en: 'Help seniors learn to use smartphones' },
    summary: {
      lv: 'Divas stundas sestdienās: palīdzi vecākiem cilvēkiem ar viedtālruņiem un drošību internetā. Lieliska komunikācijas pieredze.',
      en: 'Two hours on Saturdays: help older people with smartphones and online safety. Great communication experience.',
    },
    date: '2026-11-14',
    place: { lv: 'Saldus', en: 'Saldus' },
    track: 'it-support',
    inSaldus: true,
  },
  {
    id: 'school-site',
    kind: 'volunteering',
    title: { lv: 'Meklējam brīvprātīgos skolas mājaslapas atjaunošanai', en: 'Volunteers wanted to refresh a school website' },
    summary: {
      lv: 'Kopā ar mentoru pārveido vienas novada skolas mājaslapu. Iegūsi īstu projektu savam portfolio.',
      en: 'With a mentor, redo the website of a school in the region. You’ll get a real project for your portfolio.',
    },
    date: '2026-11-28',
    place: { lv: 'Saldus novads', en: 'Saldus region' },
    track: 'web',
    inSaldus: true,
  },
]
