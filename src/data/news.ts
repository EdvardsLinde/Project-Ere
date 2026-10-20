/**
 * ERE — news, events, courses and volunteering feed (FICTIONAL EXAMPLES).
 * Dates are ISO strings; the News page sorts and labels upcoming items.
 */
import type { TrackId } from './careers'
import type { Localized } from './types'

/** article = explainer / tips about a field (AI, cybersecurity, data, web, IT support). */
export type NewsKind = 'news' | 'article' | 'event' | 'course' | 'volunteering'

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
  /** Longer description shown in the detail window. */
  details?: Localized
  /** Time, e.g. "18:00–21:00". */
  time?: string
  /** What to bring / how to join, as short bullets. */
  info?: Localized[]
}

export const NEWS: NewsItem[] = [
  {
    id: 'ai-how-it-learns',
    kind: 'article',
    title: { lv: 'Kā mākslīgais intelekts “mācās”? Skaidrojums 5 minūtēs', en: 'How does AI “learn”? Explained in 5 minutes' },
    summary: {
      lv: 'MI nedomā kā cilvēks — tas meklē likumsakarības milzīgā daudzumā piemēru. Vienkāršs skaidrojums ar piemēriem no ikdienas: ieteikumi YouTube, teksta tulkošana un sejas atpazīšana telefonā.',
      en: 'AI doesn’t think like a person — it finds patterns in huge numbers of examples. A simple explanation using everyday examples: YouTube suggestions, translation and face unlock.',
    },
    date: '2026-10-19',
    place: { lv: 'ERE raksts', en: 'ERE article' },
    track: 'ai-data',
    inSaldus: false,
  },
  {
    id: 'ai-school-honest',
    kind: 'article',
    title: { lv: 'MI rīki mācībās: kā tos izmantot gudri un godīgi', en: 'AI tools for studying: how to use them smartly and honestly' },
    summary: {
      lv: 'Čatboti var palīdzēt saprast tēmu vai pārbaudīt savu darbu, bet var arī kļūdīties. Padomi, kā likt MI tev skaidrot, nevis darīt darbu tavā vietā — un kā pārbaudīt tā atbildes.',
      en: 'Chatbots can help you understand a topic or check your work, but they can also be wrong. Tips for getting AI to explain rather than do the work for you — and how to check its answers.',
    },
    date: '2026-10-16',
    place: { lv: 'ERE raksts', en: 'ERE article' },
    track: 'ai-data',
    inSaldus: false,
  },
  {
    id: 'cyber-phishing-signs',
    kind: 'article',
    title: { lv: '5 pazīmes, ka e-pasts vai īsziņa ir krāpšana', en: '5 signs an email or text message is a scam' },
    summary: {
      lv: 'Steidzamība (“konts tiks bloķēts!”), dīvaina sūtītāja adrese, saite uz līdzīgu, bet ne īsto lapu, lūgums pēc paroles un kļūdas tekstā. Ko darīt, ja jau esi uzspiedis saitei.',
      en: 'Urgency (“your account will be blocked!”), a strange sender address, a link to a look-alike site, a request for your password and typos. What to do if you’ve already clicked.',
    },
    date: '2026-10-18',
    place: { lv: 'ERE raksts', en: 'ERE article' },
    track: 'cyber',
    inSaldus: false,
  },
  {
    id: 'cyber-2fa',
    kind: 'article',
    title: { lv: 'Divu soļu pieteikšanās: 10 minūtes, kas pasargā tavus kontus', en: 'Two-step login: 10 minutes that protect your accounts' },
    summary: {
      lv: 'Pat ja kāds uzzina tavu paroli, otrais solis (kods telefonā vai lietotnē) neļaus ielauzties. Kā to ieslēgt e-pastam, sociālajos tīklos un spēļu kontiem.',
      en: 'Even if someone learns your password, the second step (a code on your phone or in an app) keeps them out. How to turn it on for email, social media and gaming accounts.',
    },
    date: '2026-10-12',
    place: { lv: 'ERE raksts', en: 'ERE article' },
    track: 'cyber',
    inSaldus: false,
  },
  {
    id: 'cyber-what-analyst-does',
    kind: 'article',
    title: { lv: 'Diena kiberdrošības analītiķa dzīvē', en: 'A day in the life of a security analyst' },
    summary: {
      lv: 'Rīts sākas ar brīdinājumu pārskatīšanu, pusdienlaikā — aizdomīga e-pasta izpēte, pēcpusdienā — kolēģu apmācība. Ko šis darbs nozīmē patiesībā un ar ko sākt, ja tas tevi interesē.',
      en: 'Mornings start with reviewing alerts, midday is investigating a suspicious email, afternoons are training colleagues. What the job really involves and where to start.',
    },
    date: '2026-10-05',
    place: { lv: 'ERE raksts', en: 'ERE article' },
    track: 'cyber',
    inSaldus: false,
  },
  {
    id: 'data-analyst-explained',
    kind: 'article',
    title: { lv: 'Ko īsti dara datu analītiķis?', en: 'What does a data analyst actually do?' },
    summary: {
      lv: 'No tabulas ar tūkstošiem rindu līdz vienam skaidram grafikam, kas palīdz pieņemt lēmumu. Kādas prasmes vajag (spoiler: sāk ar izklājlapām) un kā izskatās pirmais projekts.',
      en: 'From a table with thousands of rows to one clear chart that helps make a decision. Which skills you need (spoiler: it starts with spreadsheets) and what a first project looks like.',
    },
    date: '2026-10-09',
    place: { lv: 'ERE raksts', en: 'ERE article' },
    track: 'ai-data',
    inSaldus: false,
  },
  {
    id: 'web-first-site',
    kind: 'article',
    title: { lv: 'Pirmā mājaslapa vienā vakarā: no kā sastāv katra lapa', en: 'Your first website in one evening: what every page is made of' },
    summary: {
      lv: 'HTML ir lapas “skelets”, CSS — tās izskats, JavaScript — kustība un pogas. Vienkāršs plāns, kā šovakar uztaisīt savu vizītkartes lapu un parādīt to draugiem.',
      en: 'HTML is the page’s skeleton, CSS is its look, JavaScript makes it move and react. A simple plan to build your own personal page tonight and show it to friends.',
    },
    date: '2026-10-14',
    place: { lv: 'ERE raksts', en: 'ERE article' },
    track: 'web',
    inSaldus: false,
  },
  {
    id: 'support-slow-pc',
    kind: 'article',
    title: { lv: 'Kāpēc dators kļūst lēns — un 4 lietas, ko pārbaudīt pirms jauna pirkšanas', en: 'Why computers slow down — and 4 things to check before buying a new one' },
    summary: {
      lv: 'Pārāk daudz programmu startējot, pilns disks, neinstalēti atjauninājumi un karstums. IT atbalsta speciālista padomi, ko vari izmēģināt jau šodien.',
      en: 'Too many startup programs, a full disk, missing updates and overheating. Tips from an IT support specialist you can try today.',
    },
    date: '2026-10-11',
    place: { lv: 'ERE raksts', en: 'ERE article' },
    track: 'it-support',
    inSaldus: false,
  },
  {
    id: 'ai-workshop-saldus',
    kind: 'event',
    title: { lv: 'MI darbnīca jauniešiem: uztaisi savu čatbotu', en: 'AI workshop for young people: build your own chatbot' },
    summary: {
      lv: 'Trīs stundās izveidosim vienkāršu čatbotu un parunāsim, kur MI kļūdās. Pieredze nav vajadzīga, klēpjdatori būs uz vietas.',
      en: 'In three hours we’ll build a simple chatbot and talk about where AI gets things wrong. No experience needed, laptops provided.',
    },
    date: '2026-11-12',
    place: { lv: 'Novada Koda klubs, Saldus', en: 'Novada Koda klubs, Saldus' },
    track: 'ai-data',
    inSaldus: true,
    details: { lv: 'Praktiska darbnīca: izveidosim vienkāršu čatbotu, kas atbild uz jautājumiem par Saldus novadu, un pārbaudīsim, kur MI kļūdās un kāpēc. Uzzināsi, kā strādā valodas modeļi un kā tos izmantot gudri.', en: 'Hands-on workshop: build a simple chatbot that answers questions about the Saldus region and test where AI goes wrong and why. Learn how language models work and how to use them wisely.' },
    time: '15:00–18:00',
    info: [
      { lv: 'Klēpjdatori būs uz vietas', en: 'Laptops provided' },
      { lv: 'Pieredze nav vajadzīga', en: 'No experience needed' },
      { lv: 'Vietu skaits: 15', en: '15 places' },
    ],
  },
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
    details: { lv: 'CTF (Capture The Flag) ir sacensības, kurās komandās risina drošības mīklas: atrod paslēptas paroles, atšifrē ziņas un meklē kļūdas lapās. Vakars sāksies ar 15 minūšu ievadu iesācējiem, tad 2 stundas spēles un beigās — risinājumu apskats.', en: 'CTF (Capture The Flag) is a contest where teams solve security puzzles: find hidden passwords, decode messages and spot bugs in websites. The evening starts with a 15-minute intro for beginners, then 2 hours of play and a review of solutions at the end.' },
    time: '18:00–21:00',
    info: [
      { lv: 'Ņem līdzi klēpjdatoru (vai izmanto kluba datoru)', en: 'Bring a laptop (or use one of the club’s)' },
      { lv: 'Pieredze nav vajadzīga', en: 'No experience needed' },
      { lv: 'Bez maksas, pica uz vietas', en: 'Free, pizza provided' },
    ],
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
    details: { lv: 'Piecu IT uzņēmumu speciālisti — drošības analītiķis, datu analītiķe, web izstrādātājs, IT atbalsta vadītājs un UX dizainere — 10 minūtēs pastāstīs par savu ikdienu un atbildēs uz jautājumiem čatā. Jautājumus var uzdot anonīmi.', en: 'Specialists from five IT companies — a security analyst, a data analyst, a web developer, an IT support lead and a UX designer — each spend 10 minutes on their workday and answer chat questions. Questions can be anonymous.' },
    time: '16:00–17:30',
    info: [
      { lv: 'Pieslēdzies no telefona vai datora', en: 'Join from your phone or computer' },
      { lv: 'Saite tiks atsūtīta dienu iepriekš', en: 'The link is sent a day before' },
      { lv: 'Bez maksas', en: 'Free' },
    ],
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
    details: { lv: 'Divas dienas komandās (3–5 cilvēki) veidojam idejas un prototipus reālām Saldus novada problēmām — piemēram, sabiedriskā transporta informācijai vai vietējo pasākumu kalendāram. Katrai komandai palīdz mentors no IT uzņēmuma. Noslēgumā — prezentācijas un balvas.', en: 'Over two days, teams of 3–5 build ideas and prototypes for real problems in the Saldus region — for example public transport info or a local events calendar. Each team gets a mentor from an IT company. Presentations and prizes at the end.' },
    time: '10:00–18:00',
    info: [
      { lv: 'Var pieteikties vienatnē — palīdzēsim atrast komandu', en: 'You can sign up alone — we’ll help you find a team' },
      { lv: 'Ēdināšana nodrošināta', en: 'Food provided' },
      { lv: 'Vecums: 15–24', en: 'Age: 15–24' },
    ],
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
    details: { lv: 'Trīs nedēļu tiešsaistes kurss ar īsiem video un praktiskiem uzdevumiem: IP adreses, maršrutētāji, DNS un Wi-Fi problēmu meklēšana. Katru nedēļu — tiešsaistes jautājumu stunda ar pasniedzēju.', en: 'A three-week online course with short videos and hands-on tasks: IP addresses, routers, DNS and Wi-Fi troubleshooting. A live Q&A hour with the teacher every week.' },
    info: [
      { lv: 'Bez maksas', en: 'Free' },
      { lv: 'Apliecinājums par pabeigšanu', en: 'Certificate of completion' },
    ],
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
    details: { lv: 'Astoņas nedēļas: Python pamati, darbs ar tabulām un grafiku veidošana no īstiem Latvijas datiem. Noslēgumā — mazs datu projekts par tēmu, kas interesē tieši tev.', en: 'Eight weeks: Python basics, working with tables and making charts from real Latvian data. Finish with a small data project on a topic you care about.' },
    info: [
      { lv: 'Iesācējiem', en: 'For beginners' },
      { lv: 'Iknedēļas mentora atbalsts', en: 'Weekly mentor support' },
    ],
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
    details: { lv: 'Sestdienās bibliotēkā palīdzam vecākiem cilvēkiem apgūt viedtālruņus: videozvanus, fotogrāfijas, internetbanku un drošību internetā. Tu strādā pārī ar citu brīvprātīgo, un ir īss ievads, kā skaidrot vienkārši.', en: 'On Saturdays we help older people learn to use smartphones: video calls, photos, online banking and online safety. You work in a pair with another volunteer, after a short intro on explaining things simply.' },
    time: '11:00–13:00',
    info: [
      { lv: 'Brīvprātīgā darba apliecinājums', en: 'Volunteering certificate' },
      { lv: 'Lieliska komunikācijas pieredze CV', en: 'Great communication experience for your CV' },
      { lv: 'Pievienoties var jebkurā sestdienā', en: 'Join any Saturday' },
    ],
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
    details: { lv: 'Kopā ar web izstrādātāju-mentoru pārveidosim vienas novada skolas mājaslapu: jauns dizains, ērta lietošana telefonā un vienkārša jaunumu pievienošana. Darbs notiek attālināti ar tikšanos reizi nedēļā.', en: 'With a web developer mentor, we’ll redo a school website in the region: new design, mobile-friendly and easy to post news. Work is remote with a weekly meeting.' },
    info: [
      { lv: 'Vajag HTML/CSS pamatus', en: 'Basic HTML/CSS needed' },
      { lv: 'Īsts projekts tavam portfolio', en: 'A real project for your portfolio' },
      { lv: 'Apliecinājums no mentora', en: 'A reference from your mentor' },
    ],
  },
]
