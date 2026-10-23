/**
 * SEER — news, events, courses and volunteering feed (FICTIONAL EXAMPLES).
 * Dates are ISO strings; the News page sorts and labels upcoming items.
 */
import type { TrackId } from './careers'
import type { Localized } from './types'
import { newsPhoto } from './newsPhotos'
import type { NewsPhoto } from './newsPhotos'

/** article = explainer / tips about a field (AI, cybersecurity, data, web, IT support). */
export type NewsKind = 'news' | 'article' | 'event' | 'course' | 'volunteering'

/** Extra cover-illustration scenes for news (besides the career tracks). */
export type NewsScene = 'town' | 'trophy' | 'people' | 'laptop' | 'gaming' | 'phone' | 'cv'

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
  /** Article text, one entry per paragraph (the summary is shown above it as the standfirst). */
  body?: Localized[]
  /** Byline (fictional). Defaults to "SEER redakcija". */
  author?: string
  /** Reading time in minutes. */
  readMin?: number
  /** Publish time for news, e.g. "08:30". */
  at?: string
  /** Cover photo (see newsPhotos.ts). Without one the card shows an illustration. */
  photo?: NewsPhoto
  /** Cover illustration; defaults to the track or the item type. */
  scene?: NewsScene | TrackId
  /** Shown as the lead story on the news front page. */
  featured?: boolean
  /** Price in euros for events, courses and volunteering; 0 = free. */
  price?: number
}

const ITEMS: NewsItem[] = [
  {
    id: 'ai-how-it-learns',
    kind: 'article',
    title: { lv: 'Kā mākslīgais intelekts “mācās”? Skaidrojums 5 minūtēs', en: 'How does AI “learn”? Explained in 5 minutes' },
    summary: {
      lv: 'MI nedomā kā cilvēks — tas meklē likumsakarības milzīgā daudzumā piemēru. Vienkāršs skaidrojums ar piemēriem no ikdienas: ieteikumi YouTube, teksta tulkošana un sejas atpazīšana telefonā.',
      en: 'AI doesn’t think like a person — it finds patterns in huge numbers of examples. A simple explanation using everyday examples: YouTube suggestions, translation and face unlock.',
    },
    date: '2026-10-19',
    place: { lv: 'SEER raksts', en: 'SEER article' },
    track: 'ai-data',
    inSaldus: false,
    author: 'Roberts Liepa',
    readMin: 4,
    body: [
      { lv: 'Kad telefons atpazīst tavu seju vai YouTube iesaka nākamo video, aiz tā ir modelis, kas apmācīts uz miljoniem piemēru. Tas neko “nesaprot” — tas ir iemācījies, kuras pazīmes parasti iet kopā.', en: 'When your phone recognises your face or YouTube suggests the next video, there’s a model behind it trained on millions of examples. It doesn’t “understand” anything — it has learned which features usually go together.' },
      { lv: 'Apmācība notiek tā: modelim parāda piemēru, tas izdara minējumu, un, ja minējums ir nepareizs, tā iekšējos skaitļus mazliet pieregulē. To atkārto miljoniem reižu, līdz minējumi kļūst labi.', en: 'Training works like this: the model sees an example, makes a guess, and if the guess is wrong its internal numbers are nudged a little. Repeat that millions of times and the guesses get good.' },
      { lv: 'Tāpēc MI ir tik labs, cik labi ir dati. Ja piemēros ir kļūdas vai aizspriedumi, modelis tos iemācīsies arī. Tieši tāpēc datu speciālisti ir tikpat svarīgi kā programmētāji.', en: 'That’s why AI is only as good as its data. If the examples contain mistakes or bias, the model learns those too. It’s also why data specialists matter as much as programmers.' },
    ],
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
    place: { lv: 'SEER raksts', en: 'SEER article' },
    track: 'ai-data',
    inSaldus: false,
    author: 'Līga Bērziņa',
    readMin: 3,
    scene: 'laptop',
    body: [
      { lv: 'Labs veids, kā izmantot čatbotu: lūdz, lai tas izskaidro tēmu tā, it kā tev būtu 12 gadi, un pēc tam pats pastāsti to savos vārdos. Tā tu pārbaudi, vai tiešām saprati.', en: 'A good way to use a chatbot: ask it to explain a topic as if you were 12, then retell it in your own words. That’s how you check you really understood.' },
      { lv: 'Sliktāks veids — likt tam uzrakstīt visu darbu. Skolotāji to bieži pamana, bet galvenais — tu neko neiemācies. Un MI mēdz pārliecinoši izdomāt faktus, tāpēc katru svarīgu skaitli pārbaudi citā avotā.', en: 'A worse way is to have it write the whole assignment. Teachers often notice, but more importantly you learn nothing. And AI can confidently make up facts, so check every important number in another source.' },
    ],
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
    place: { lv: 'SEER raksts', en: 'SEER article' },
    track: 'cyber',
    inSaldus: false,
    author: 'Jānis Ozols',
    readMin: 3,
    body: [
      { lv: 'Krāpnieki rēķinās ar to, ka tu steigsies. Tāpēc ziņās ir vārdi “steidzami”, “pēdējā iespēja” vai “konts tiks bloķēts”. Ja ziņa liek tev uztraukties, tas jau ir brīdinājuma signāls.', en: 'Scammers count on you rushing. That’s why messages say “urgent”, “last chance” or “your account will be blocked”. If a message makes you anxious, that alone is a warning sign.' },
      { lv: 'Pirms spied saiti, uzbrauc tai ar peli vai turi pirkstu, lai redzētu īsto adresi. “bank-lv-login.com” nav tava banka. Īsta banka nekad neprasīs paroli e-pastā.', en: 'Before you tap a link, hover over it or long-press to see the real address. “bank-lv-login.com” is not your bank. A real bank will never ask for your password by email.' },
      { lv: 'Ja jau esi uzspiedis: nomaini paroli, ieslēdz divu soļu pieteikšanos un pastāsti pieaugušajam vai bankai. Kauns nav jājūt — tas notiek arī IT speciālistiem.', en: 'If you’ve already clicked: change your password, turn on two-step login and tell an adult or your bank. No need to feel embarrassed — it happens to IT professionals too.' },
    ],
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
    place: { lv: 'SEER raksts', en: 'SEER article' },
    track: 'cyber',
    inSaldus: false,
    author: 'Jānis Ozols',
    readMin: 2,
    body: [
      { lv: 'Divu soļu pieteikšanās nozīmē, ka bez paroles vajag vēl kaut ko, kas ir tikai tev — parasti kodu no lietotnes vai īsziņas. Pat ja parole nopludināta, ar to vien nepietiek.', en: 'Two-step login means you need something besides your password that only you have — usually a code from an app or a text message. Even if your password leaks, it isn’t enough on its own.' },
      { lv: 'Sāc ar e-pastu, jo caur to var atjaunot visus pārējos kontus. Pēc tam — sociālie tīkli un spēļu konti. Iestatījumos meklē “Drošība” → “Divpakāpju verifikācija”.', en: 'Start with your email, because it can be used to reset every other account. Then social media and gaming accounts. In settings, look for “Security” → “Two-step verification”.' },
    ],
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
    place: { lv: 'SEER raksts', en: 'SEER article' },
    track: 'cyber',
    inSaldus: false,
    author: 'Roberts Liepa',
    readMin: 4,
    body: [
      { lv: '8:30 — kafija un brīdinājumu saraksts. Sistēmas nakts laikā atzīmējušas 40 notikumus; lielākā daļa ir nekaitīgi, bet divi izskatās dīvaini: pieteikšanās no citas valsts un liels failu apjoms, kas nosūtīts naktī.', en: '8:30 — coffee and the alert queue. Overnight the systems flagged 40 events; most are harmless, but two look odd: a login from another country and a large batch of files sent at night.' },
      { lv: 'Pusdienlaikā analītiķis izpēta aizdomīgu e-pastu, ko darbinieks pārsūtījis. Tā ir krāpšana, tāpēc tiek bloķēts sūtītājs un nosūtīts brīdinājums visiem kolēģiem.', en: 'At midday the analyst investigates a suspicious email forwarded by an employee. It’s phishing, so the sender is blocked and a warning goes out to all colleagues.' },
      { lv: 'Lai sāktu, nav vajadzīgs augstākais līmenis. Noder ziņkārība, uzmanība detaļām un tīklu pamati — tos var apgūt bezmaksas kursos un CTF sacensībās.', en: 'You don’t need to be an expert to start. Curiosity, attention to detail and networking basics help — and you can learn those in free courses and CTF contests.' },
    ],
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
    place: { lv: 'SEER raksts', en: 'SEER article' },
    track: 'ai-data',
    inSaldus: false,
    author: 'Līga Bērziņa',
    readMin: 3,
    body: [
      { lv: 'Datu analītiķis atbild uz jautājumiem ar skaitļiem: kurā dienā veikalā ir visvairāk pircēju? Kuri autobusi brauc pustukši? Atbilde parasti ir viens skaidrs grafiks.', en: 'A data analyst answers questions with numbers: which day has the most shoppers? Which buses run half-empty? The answer is usually one clear chart.' },
      { lv: 'Pirmais rīks ir izklājlapa — filtri, kārtošana un kopsavilkuma tabulas. Vēlāk nāk SQL un Python. Pirmais projekts var būt kaut kas personisks, piemēram, tava telefona lietošanas laiks mēneša garumā.', en: 'The first tool is a spreadsheet — filters, sorting and pivot tables. SQL and Python come later. A first project can be personal, like a month of your phone screen-time.' },
    ],
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
    place: { lv: 'SEER raksts', en: 'SEER article' },
    track: 'web',
    inSaldus: false,
    author: 'Marta Kalniņa',
    readMin: 4,
    body: [
      { lv: 'Atver jebkuru teksta redaktoru, izveido failu index.html un ieraksti virsrakstu un dažus teikumus par sevi. Atver failu pārlūkā — apsveicam, tā ir tava pirmā mājaslapa.', en: 'Open any text editor, create a file called index.html and write a heading and a few sentences about yourself. Open it in a browser — congratulations, that’s your first website.' },
      { lv: 'Tad pievieno CSS: krāsas, fontu, atstarpes. Un visbeidzot mazliet JavaScript — piemēram, pogu, kas pārslēdz tumšo režīmu. Bez maksas lapu var publicēt dažās minūtēs.', en: 'Then add CSS: colours, a font, spacing. Finally a bit of JavaScript — say, a button that toggles dark mode. You can publish the page for free in a few minutes.' },
    ],
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
    place: { lv: 'SEER raksts', en: 'SEER article' },
    track: 'it-support',
    inSaldus: false,
    author: 'Roberts Liepa',
    readMin: 3,
    body: [
      { lv: 'Pirmais solis — atver uzdevumu pārvaldnieku un apskaties, kas startējas kopā ar datoru. Bieži tur ir desmitiem programmu, kuras nekad neizmanto.', en: 'Step one — open Task Manager and see what starts with the computer. There are often dozens of programs you never use.' },
      { lv: 'Otrkārt, pārbaudi disku: ja tas ir gandrīz pilns, dators kļūst lēns. Treškārt, instalē atjauninājumus. Ceturtkārt, iztīri ventilatoru — karstums samazina ātrumu.', en: 'Second, check the disk: if it’s nearly full, the computer slows down. Third, install updates. Fourth, clean the fan — heat slows things down.' },
    ],
  },
  {
    id: 'ai-workshop-saldus',
    kind: 'event',
    price: 0,
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
    author: 'Marta Kalniņa',
    readMin: 2,
    scene: 'people',
    body: [
      { lv: 'Telpā ir 20 darba vietas, divas sapulču telpas un ātrs internets. Strādāt var no 8:00 līdz 20:00, un jauniešiem līdz 21 gadam darba dienās tas ir bez maksas.', en: 'The space has 20 desks, two meeting rooms and fast internet. It’s open 8:00–20:00, and free on weekdays for under-21s.' },
      { lv: 'Telpas vadītāja stāsta, ka mērķis ir, lai cilvēkiem nebūtu jābrauc uz Rīgu, lai strādātu labā darbā. Reizi mēnesī notiks arī tīklošanās brokastis.', en: 'The manager says the goal is that people don’t have to move to Riga for a good job. There will also be a networking breakfast once a month.' },
    ],
  },
  {
    id: 'remote-trend',
    kind: 'news',
    title: { lv: 'IT uzņēmumi arvien biežāk meklē darbiniekus reģionos', en: 'IT companies increasingly hire in the regions' },
    summary: {
      lv: 'Vairāki Rīgas uzņēmumi SEER stāsta, ka attālināts darbs ļauj pieņemt cilvēkus no visas Latvijas — galvenais ir prasmes un angļu valoda.',
      en: 'Several Riga companies tell SEER that remote work lets them hire from all over Latvia — what matters is skills and English.',
    },
    date: '2026-10-08',
    place: { lv: 'Latvija', en: 'Latvia' },
    inSaldus: false,
    author: 'SEER redakcija',
    readMin: 2,
    scene: 'town',
    body: [
      { lv: 'Uzņēmumi saka, ka pēc 2020. gada attālinātais darbs ir kļuvis par normu. Svarīgākais ir prasmes, uzticamība un spēja sazināties angliski.', en: 'Companies say remote work has become normal since 2020. What matters most is skills, reliability and the ability to communicate in English.' },
      { lv: 'Jauniešiem tas nozīmē: portfolio ar īstiem projektiem bieži ir svarīgāks par diplomu. Sāc ar maziem projektiem un krāj tos vienuviet.', en: 'For young people that means a portfolio of real projects often matters more than a diploma. Start small and keep your projects in one place.' },
    ],
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
    author: 'SEER redakcija',
    readMin: 2,
    body: [
      { lv: 'Praktikanti palīdzēs uzturēt biroja datorus, printerus un Wi-Fi tīklu, kā arī atbildēs uz kolēģu jautājumiem. Prakse būs apmaksāta, un labākajiem piedāvās turpināt darbu.', en: 'The interns will help maintain office computers, printers and the Wi-Fi network, and answer colleagues’ questions. The internship is paid, and the best will be offered to stay on.' },
      { lv: 'Uzņēmums iesaka jau tagad apgūt tīklu pamatus un uztaisīt pāris mazus projektus, ko parādīt intervijā.', en: 'The company suggests learning networking basics now and doing a couple of small projects to show at the interview.' },
    ],
  },
  {
    id: 'ctf-night',
    kind: 'event',
    price: 0,
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
    price: 0,
    title: { lv: 'Tiešsaistes karjeras diena: IT uzņēmumi atbild', en: 'Online career day: IT companies answer your questions' },
    summary: {
      lv: 'Piecu uzņēmumu speciālisti stāsta par savu ikdienu un atbild uz jautājumiem. Var pieslēgties no telefona.',
      en: 'Specialists from five companies talk about their day and answer questions. Join from your phone.',
    },
    date: '2026-11-21',
    place: { lv: 'Tiešsaistē', en: 'Online' },
    inSaldus: false,
    author: 'SEER redakcija',
    readMin: 2,
    scene: 'people',
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
    price: 0,
    title: { lv: 'Hakatons: digitāli risinājumi Saldus novadam', en: 'Hackathon: digital solutions for the Saldus region' },
    summary: {
      lv: 'Divas dienas komandās veidojam idejas un prototipus vietējām problēmām. Balvas un mentori no IT uzņēmumiem.',
      en: 'Two days building ideas and prototypes for local problems in teams. Prizes and mentors from IT companies.',
    },
    date: '2026-12-05',
    place: { lv: 'Saldus', en: 'Saldus' },
    track: 'web',
    inSaldus: true,
    author: 'SEER redakcija',
    readMin: 2,
    scene: 'trophy',
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
    price: 0,
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
    price: 25,
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
    price: 0,
    title: { lv: 'Palīdzi senioriem apgūt viedtālruņus', en: 'Help seniors learn to use smartphones' },
    summary: {
      lv: 'Divas stundas sestdienās: palīdzi vecākiem cilvēkiem ar viedtālruņiem un drošību internetā. Lieliska komunikācijas pieredze.',
      en: 'Two hours on Saturdays: help older people with smartphones and online safety. Great communication experience.',
    },
    date: '2026-11-14',
    place: { lv: 'Saldus', en: 'Saldus' },
    track: 'it-support',
    inSaldus: true,
    author: 'SEER redakcija',
    readMin: 2,
    scene: 'phone',
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
    price: 0,
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
  /* ---------------- Saldus local news (all fictional) ---------------- */
  {
    id: 'saldus-tech-week',
    kind: 'news',
    featured: true,
    title: { lv: 'Saldū pirmo reizi notiks Tehnoloģiju nedēļa jauniešiem', en: 'Saldus to host its first Tech Week for young people' },
    summary: {
      lv: 'No 9. līdz 15. novembrim — MI darbnīcas, CTF sacensības, robotu izstāde un IT speciālistu stāsti. Visi pasākumi bez maksas, pieteikties var jau tagad.',
      en: 'From 9 to 15 November — AI workshops, a CTF contest, a robot show and talks by IT specialists. Every event is free, and sign-up is open now.',
    },
    date: '2026-10-22',
    at: '08:30',
    place: { lv: 'Saldus', en: 'Saldus' },
    inSaldus: true,
    author: 'Marta Kalniņa',
    readMin: 3,
    scene: 'town',
    body: [
      { lv: 'Novembrī Saldus kļūs par mazu tehnoloģiju galvaspilsētu. Septiņās dienās notiks vairāk nekā 15 pasākumu — no iesācēju darbnīcām līdz sacensībām, kurās komandas risinās kiberdrošības mīklas.', en: 'In November Saldus becomes a small tech capital. Over seven days there will be more than 15 events — from beginner workshops to a contest where teams solve cybersecurity puzzles.' },
      { lv: '“Gribējām parādīt, ka digitālā karjera nav tikai Rīgā,” stāsta viena no organizatorēm. “Daudzi jaunieši domā, ka IT nav priekš viņiem, bet pēc pirmās darbnīcas viņi saprot, ka tas ir kā spēle ar noteikumiem, ko var iemācīties.”', en: '“We wanted to show that a digital career isn’t only in Riga,” says one of the organisers. “Many young people think IT isn’t for them, but after the first workshop they see it’s like a game with rules you can learn.”' },
      { lv: 'Programmā: MI darbnīca, kurā katrs uztaisīs savu čatbotu, “Uzlauz mani” CTF vakars, robotu izstāde tirgus laukumā un sarunas ar cilvēkiem, kas strādā Rīgas un ārzemju uzņēmumiem, dzīvojot Kurzemē.', en: 'On the programme: an AI workshop where everyone builds their own chatbot, a “Hack me” CTF evening, a robot show on the market square and talks with people who work for Riga and foreign companies while living in Kurzeme.' },
      { lv: 'Visi pasākumi ir bez maksas, bet vietu skaits darbnīcās ir ierobežots. Pilnu programmu publicēs nākamnedēļ.', en: 'All events are free, but workshop places are limited. The full programme will be published next week.' },
    ],
  },
  {
    id: 'phishing-wave',
    kind: 'news',
    title: { lv: 'Saldeniekiem sūta viltus īsziņas par “neizņemtu paku”', en: 'Saldus residents receive fake “parcel waiting” texts' },
    summary: {
      lv: 'Īsziņā ir saite uz lapu, kas izskatās pēc pakomāta, un tiek prasīts samaksāt 1,99 €. Tā ir krāpšana — neievadi kartes datus.',
      en: 'The text links to a page that looks like a parcel locker site and asks you to pay €1.99. It’s a scam — don’t enter your card details.',
    },
    date: '2026-10-22',
    at: '11:15',
    place: { lv: 'Saldus novads', en: 'Saldus region' },
    track: 'cyber',
    inSaldus: true,
    author: 'Jānis Ozols',
    readMin: 2,
    scene: 'phone',
    body: [
      { lv: 'Šonedēļ vairāki novada iedzīvotāji saņēmuši īsziņu: “Jūsu paka gaida. Apmaksājiet piegādi 24 stundu laikā.” Saite ved uz lapu, kas ļoti līdzinās īstai piegādes lapai.', en: 'This week several people in the region received a text: “Your parcel is waiting. Pay for delivery within 24 hours.” The link leads to a page that looks very much like a real delivery site.' },
      { lv: 'Pazīmes, ka tā ir krāpšana: steidzamība, dīvaina adrese (piemēram, paku-lv-piegade.top) un prasība ievadīt kartes datus mazai summai. Mazā summa ir triks — īstais mērķis ir tava karte.', en: 'Signs it’s a scam: urgency, a strange address (like paku-lv-piegade.top) and a request for card details for a tiny amount. The small amount is a trick — the real target is your card.' },
      { lv: 'Ja jau esi ievadījis datus, nekavējoties zvani savai bankai un bloķē karti. Un pastāsti par to vecvecākiem — viņi bieži ir pirmie, kam šādas ziņas sūta.', en: 'If you’ve already entered your details, call your bank straight away and block the card. And tell your grandparents — they are often the first to receive these messages.' },
    ],
  },
  {
    id: 'coding-club-record',
    kind: 'news',
    title: { lv: 'Koda klubā rekordliels pieteikumu skaits — atver otru grupu', en: 'Record sign-ups at the coding club — a second group opens' },
    summary: {
      lv: 'Rudenī pieteicās 46 jaunieši, bet vietas bija 20. Tagad nodarbības notiks arī sestdienās, un divi bijušie dalībnieki kļūs par mentoriem.',
      en: '46 young people signed up this autumn for 20 places. Now there will be Saturday sessions too, and two former members will become mentors.',
    },
    date: '2026-10-21',
    at: '16:40',
    place: { lv: 'Novada Koda klubs, Saldus', en: 'Novada Koda klubs, Saldus' },
    track: 'web',
    inSaldus: true,
    author: 'Līga Bērziņa',
    readMin: 2,
    scene: 'people',
    body: [
      { lv: 'Pirms trim gadiem klubā bija seši dalībnieki. Šoruden pieteikumu bija tik daudz, ka nācās veidot gaidīšanas sarakstu. Tagad sestdienās no 10:00 līdz 13:00 notiks otra grupa.', en: 'Three years ago the club had six members. This autumn there were so many sign-ups that a waiting list was needed. Now a second group will meet on Saturdays from 10:00 to 13:00.' },
      { lv: 'Jaunajā grupā veidos spēles un mājaslapas, bet pavasarī — kopīgu projektu novadam. Divi bijušie dalībnieki, kuri tagad studē, palīdzēs kā mentori.', en: 'The new group will make games and websites, and in spring a shared project for the region. Two former members who are now at university will help as mentors.' },
    ],
  },
  {
    id: 'student-app-win',
    kind: 'news',
    title: { lv: 'Saldus skolēnu lietotne “Kad būs autobuss?” uzvar Kurzemes jauniešu hakatonā', en: 'Saldus students’ app “When’s the bus?” wins Kurzeme youth hackathon' },
    summary: {
      lv: 'Trīs 11. klases skolēni 48 stundās uztaisīja lietotni, kas rāda lauku autobusu laikus arī bez interneta. Balvā — prakse IT uzņēmumā.',
      en: 'Three 11th-graders built an app in 48 hours that shows rural bus times even without internet. The prize: an internship at an IT company.',
    },
    date: '2026-10-20',
    place: { lv: 'Kurzeme', en: 'Kurzeme' },
    track: 'web',
    inSaldus: true,
    author: 'Marta Kalniņa',
    readMin: 3,
    scene: 'trophy',
    body: [
      { lv: '“Mēs paši katru dienu gaidām autobusu pie skolas, un internets tur ir slikts,” stāsta komandas vadītāja Paula (17). “Tāpēc lietotne saglabā sarakstus telefonā un parāda, cik minūtes vēl jāgaida.”', en: '“We wait for the bus outside school every day, and the signal there is bad,” says team lead Paula (17). “So the app saves the timetables on your phone and shows how many minutes are left.”' },
      { lv: 'Komanda uzvarēja 14 komandu konkurencē. Žūrija uzslavēja vienkāršo dizainu un to, ka risinājums atrisina īstu problēmu. Neviens no komandas pirms gada nebija programmējis.', en: 'The team beat 14 others. The jury praised the simple design and the fact that it solves a real problem. A year ago none of them had written any code.' },
      { lv: 'Balvā viņi saņēma vasaras praksi IT uzņēmumā un mentoru, kas palīdzēs lietotni publicēt. Nākamais mērķis — pievienot arī vilcienu sarakstus.', en: 'Their prize is a summer internship at an IT company and a mentor to help publish the app. Next goal: add train times too.' },
    ],
  },
  {
    id: 'ai-corner',
    kind: 'news',
    title: { lv: 'Koprades telpā atver “MI stūrīti” ar bezmaksas konsultācijām', en: 'Coworking space opens an “AI corner” with free advice' },
    summary: {
      lv: 'Katru ceturtdienu no 15:00 līdz 18:00 var atnākt ar jautājumu par mākslīgo intelektu — mācībām, darbam vai savam projektam.',
      en: 'Every Thursday 15:00–18:00 you can drop in with a question about AI — for school, work or your own project.',
    },
    date: '2026-10-16',
    place: { lv: 'Saldus centrs', en: 'Saldus centre' },
    track: 'ai-data',
    inSaldus: true,
    author: 'Roberts Liepa',
    readMin: 2,
    body: [
      { lv: 'Konsultācijas vada brīvprātīgie, kuri ikdienā strādā ar datiem un MI. Var atnākt ar pavisam vienkāršu jautājumu, piemēram, kā ar MI palīdzību sagatavoties eksāmenam.', en: 'The sessions are run by volunteers who work with data and AI. You can come with a very simple question, like how to use AI to prepare for an exam.' },
      { lv: 'Pirmajā nedēļā atnāca 12 cilvēki — no skolēniem līdz mazā biznesa īpašniekiem. Iepriekš nav jāpiesakās.', en: 'In the first week 12 people came — from students to small business owners. No need to book in advance.' },
    ],
  },
  {
    id: 'remote-worker-story',
    kind: 'article',
    title: { lv: '“Strādāju Rīgas uzņēmumam, bet dzīvoju Saldū” — 23 gadus vecās Elīzas stāsts', en: '“I work for a Riga company but live in Saldus” — 23-year-old Elīza’s story' },
    summary: {
      lv: 'Elīza ir testētāja IT uzņēmumā. Uz biroju viņa brauc reizi mēnesī, bet pārējās dienas strādā no mājām vai koprades telpas.',
      en: 'Elīza is a software tester at an IT company. She goes to the office once a month and works from home or the coworking space the rest of the time.',
    },
    date: '2026-10-13',
    place: { lv: 'Saldus', en: 'Saldus' },
    inSaldus: true,
    author: 'Līga Bērziņa',
    readMin: 5,
    scene: 'laptop',
    body: [
      { lv: 'Pēc vidusskolas Elīza nezināja, ko darīt. Viņa strādāja veikalā un vakaros sāka bezmaksas testēšanas kursu. “Man patika meklēt kļūdas — tas ir kā detektīvdarbs,” viņa smejas.', en: 'After school Elīza didn’t know what to do. She worked in a shop and started a free testing course in the evenings. “I liked finding bugs — it’s like detective work,” she laughs.' },
      { lv: 'Pēc pusgada viņa nosūtīja CV piecām kompānijām. Divas uzaicināja uz interviju, viena pieņēma darbā. Galvenais, viņa saka, bija portfolio ar trim nelieliem projektiem.', en: 'Six months later she sent her CV to five companies. Two invited her to interview and one hired her. The key, she says, was a portfolio with three small projects.' },
      { lv: '“Dzīvot Saldū ir lētāk, ģimene ir tuvu, un uz Rīgu var aizbraukt, kad vajag. Vienīgais, ko iesaku — atrodi vietu, kur strādāt ārpus mājām, citādi diena saplūst.”', en: '“Living in Saldus is cheaper, family is close, and Riga is there when I need it. My only tip — find somewhere to work outside your home, or the days blur together.”' },
    ],
  },
  {
    id: 'internet-villages',
    kind: 'news',
    title: { lv: 'Vēl trīs novada pagastos ievilks ātro internetu', en: 'Fast internet coming to three more villages in the region' },
    summary: {
      lv: 'Līdz pavasarim optiskais internets būs pieejams vēl ~900 mājsaimniecībām. Tas nozīmē, ka strādāt attālināti varēs arī ārpus pilsētas.',
      en: 'By spring, fibre internet will reach about 900 more households — so remote work will be possible outside town too.',
    },
    date: '2026-10-15',
    place: { lv: 'Saldus novads', en: 'Saldus region' },
    inSaldus: true,
    author: 'SEER redakcija',
    readMin: 2,
    scene: 'town',
    body: [
      { lv: 'Darbi sāksies novembrī un ilgs līdz aprīlim. Pieslēgums būs pieejams gan mājām, gan pagastu centriem, kur iekārtos arī nelielas darba vietas.', en: 'Work starts in November and runs until April. Connections will be available for homes and for village centres, where small workspaces will also be set up.' },
      { lv: 'Jauniešiem tā ir laba ziņa: mācīties tiešsaistē un strādāt attālināti varēs, nebraucot uz pilsētu.', en: 'Good news for young people: you’ll be able to study online and work remotely without travelling into town.' },
    ],
  },
  {
    id: 'youth-survey',
    kind: 'news',
    title: { lv: 'Aptauja: 6 no 10 novada jauniešiem gribētu strādāt attālināti', en: 'Survey: 6 in 10 young people in the region would like to work remotely' },
    summary: {
      lv: 'Aptaujāti 312 jaunieši vecumā no 15 līdz 24 gadiem. Lielākā daļa vēlas palikt Kurzemē, bet trūkst informācijas, kur sākt.',
      en: '312 young people aged 15–24 took part. Most want to stay in Kurzeme but don’t know where to start.',
    },
    date: '2026-10-10',
    place: { lv: 'Saldus novads', en: 'Saldus region' },
    track: 'ai-data',
    inSaldus: true,
    author: 'Roberts Liepa',
    readMin: 3,
    body: [
      { lv: '61% atbildēja, ka gribētu strādāt attālināti, 48% — ka vēlas palikt dzīvot novadā. Biežākais šķērslis: “Nezinu, kādas profesijas tādas ir un kā tās apgūt.”', en: '61% said they’d like to work remotely and 48% want to keep living in the region. The most common obstacle: “I don’t know what jobs like that exist or how to learn them.”' },
      { lv: 'Populārākās jomas, par kurām jaunieši gribētu uzzināt vairāk: kiberdrošība, spēļu izstrāde, dizains un datu analīze.', en: 'The fields young people most want to know about: cybersecurity, game development, design and data analysis.' },
    ],
  },
  {
    id: 'cv-workshop',
    kind: 'event',
    price: 0,
    title: { lv: 'CV darbnīca: uzraksti savu pirmo CV vienā pēcpusdienā', en: 'CV workshop: write your first CV in one afternoon' },
    summary: {
      lv: 'Ko rakstīt, ja vēl nav darba pieredzes? Kopā izveidosim CV, kurā redzami tavi projekti, hobiji un prasmes.',
      en: 'What to write when you have no work experience yet? Together we’ll make a CV that shows your projects, hobbies and skills.',
    },
    date: '2026-10-29',
    time: '16:00–18:00',
    place: { lv: 'Koprades telpa, Saldus centrs', en: 'Coworking space, Saldus centre' },
    inSaldus: true,
    scene: 'cv',
    details: {
      lv: 'Divu stundu darbnīca ar personāla atlases speciālisti. Uzzināsi, ko darba devēji skatās pirmajās 10 sekundēs, kā aprakstīt skolas projektus un brīvprātīgo darbu un kā uzrakstīt īsu motivācijas vēstuli. Aiziesi mājās ar gatavu CV.',
      en: 'A two-hour workshop with a recruiter. Learn what employers look at in the first 10 seconds, how to describe school projects and volunteering, and how to write a short cover letter. You’ll leave with a finished CV.',
    },
    info: [
      { lv: 'Ņem līdzi klēpjdatoru vai telefonu', en: 'Bring a laptop or phone' },
      { lv: 'Bez maksas, 20 vietas', en: 'Free, 20 places' },
      { lv: 'Vecums: 15–24', en: 'Age: 15–24' },
    ],
  },
  {
    id: 'repair-cafe',
    kind: 'volunteering',
    price: 0,
    title: { lv: 'Remontu kafejnīca: palīdzi salabot datorus un telefonus', en: 'Repair café: help fix computers and phones' },
    summary: {
      lv: 'Iedzīvotāji atnes salūzušas ierīces, bet brīvprātīgie kopā ar meistariem tās mēģina salabot. Lieliska IT atbalsta prakse.',
      en: 'Locals bring broken devices and volunteers try to fix them with experienced repairers. Great IT support practice.',
    },
    date: '2026-10-31',
    time: '10:00–14:00',
    place: { lv: 'Jauniešu centrs, Saldus', en: 'Youth centre, Saldus' },
    track: 'it-support',
    inSaldus: true,
    scene: 'it-support',
    details: {
      lv: 'Reizi mēnesī notiek remontu kafejnīca: lēni datori, telefoni, kas neuzlādējas, printeri, kas “nedrukā”. Tu strādāsi pārī ar pieredzējušu meistaru un mācīsies meklēt problēmas cēloni. Nav jāzina viss — galvenais ir vēlme mācīties.',
      en: 'Once a month there’s a repair café: slow computers, phones that won’t charge, printers that “won’t print”. You’ll work with an experienced repairer and learn to find the cause of a problem. You don’t need to know everything — just be keen to learn.',
    },
    info: [
      { lv: 'Brīvprātīgā darba apliecinājums', en: 'Volunteering certificate' },
      { lv: 'Instrumenti būs uz vietas', en: 'Tools provided' },
      { lv: 'Kafija un smalkmaizītes', en: 'Coffee and pastries' },
    ],
  },
  {
    id: 'gaming-lan',
    kind: 'event',
    price: 3,
    title: { lv: 'Spēļu turnīrs un saruna “Kā top datorspēles”', en: 'Gaming tournament and talk: “How video games are made”' },
    summary: {
      lv: 'Visu dienu turnīrs komandās, bet pusdienlaikā — spēļu izstrādātājs stāsta, kā no idejas top spēle un kādas profesijas tur vajag.',
      en: 'An all-day team tournament, and at lunchtime a game developer explains how a game goes from idea to release — and the jobs involved.',
    },
    date: '2026-11-01',
    time: '12:00–20:00',
    place: { lv: 'Novada Koda klubs, Saldus', en: 'Novada Koda klubs, Saldus' },
    inSaldus: true,
    scene: 'gaming',
    details: {
      lv: 'Turnīrā piedalās komandas pa 3 cilvēkiem. 14:00 — saruna ar spēļu izstrādātāju: programmētāji, mākslinieki, testētāji, skaņu dizaineri un kā kļūt par vienu no viņiem. Var atnākt arī tikai uz sarunu.',
      en: 'Teams of 3 compete in the tournament. At 14:00 there’s a talk with a game developer: programmers, artists, testers, sound designers — and how to become one. You can come just for the talk.',
    },
    info: [
      { lv: 'Pieteikšanās komandām līdz 29. oktobrim', en: 'Team sign-up by 29 October' },
      { lv: 'Datori būs uz vietas', en: 'Computers provided' },
      { lv: 'Vecums: 13–24', en: 'Age: 13–24' },
    ],
  },
  {
    id: 'girls-in-tech',
    kind: 'event',
    price: 0,
    title: { lv: 'Meitenes tehnoloģijās: sarunu vakars ar IT speciālistēm', en: 'Girls in tech: an evening with women in IT' },
    summary: {
      lv: 'Četras IT speciālistes no Kurzemes stāsta, kā sāka, kas bija grūti un ko darītu citādi. Jautājumus var uzdot anonīmi.',
      en: 'Four women working in IT in Kurzeme share how they started, what was hard and what they’d do differently. Questions can be anonymous.',
    },
    date: '2026-11-19',
    time: '17:00–19:00',
    place: { lv: 'Koprades telpa, Saldus centrs', en: 'Coworking space, Saldus centre' },
    inSaldus: true,
    scene: 'people',
    details: {
      lv: 'Vakarā piedalīsies kiberdrošības analītiķe, datu analītiķe, web izstrādātāja un IT projektu vadītāja. Pēc sarunas — neformāla daļa, kur var aprunāties ar katru atsevišķi. Gaidīti visi, ne tikai meitenes.',
      en: 'Speakers include a security analyst, a data analyst, a web developer and an IT project manager. Afterwards there’s an informal part where you can talk to each of them. Everyone is welcome, not just girls.',
    },
    info: [
      { lv: 'Bez maksas', en: 'Free' },
      { lv: 'Tēja un uzkodas', en: 'Tea and snacks' },
      { lv: 'Var pieslēgties arī tiešsaistē', en: 'You can also join online' },
    ],
  },
]

/** All news items, each with its cover photo attached. */
export const NEWS: NewsItem[] = ITEMS.map((n) => ({ ...n, photo: n.photo ?? newsPhoto(n.id) }))
