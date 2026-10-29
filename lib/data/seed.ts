/**
 * Initial demo data, loaded on first launch and by "Reset demo data".
 *
 * IMPORTANT: the 8 sample companies have NOT confirmed participation.
 * - every sample placement has `isSample: true` (UI shows "Ilustratīvs piemērs");
 * - companies have `confirmed: false`; their `contact` data is never displayed;
 * - exact street addresses are unknown (`[TODO: confirm address]`);
 * - mentors are invented and marked `isSample: true`.
 */
import { endAfterWorkingDays } from "@/lib/dates";
import { formatCertificateId } from "@/lib/placements";
import type {
  Application,
  Certificate,
  CompanyProfile,
  DayPlanItem,
  DemoDatabase,
  Placement,
  PlacementTerm,
  StudentProfile,
  User,
} from "./types";
import { demoHash } from "./util";

/** Bump when seed data or the stored shape changes: browsers with an older version reseed. */
export const DB_VERSION = 3;

export const DEMO_ACCOUNTS = {
  company: { email: "demo@uznemums.lv", password: "demo1234" },
  student: { email: "demo@skolens.lv", password: "demo1234" },
} as const;

const ADDRESS_TODO = "[TODO: confirm address]";
const SEED_TIME = "2026-10-01T09:00:00.000Z";

const b = (lv: string, en: string) => ({ lv, en });

function term(id: string, start: string, days: number, spots: number): PlacementTerm {
  return { id, start, end: endAfterWorkingDays(start, days), spots };
}

function plan(items: [string, string, string, string][]): DayPlanItem[] {
  return items.map(([tLv, tEn, dLv, dEn]) => ({ title: b(tLv, tEn), description: b(dLv, dEn) }));
}

const DAY1 = (taskLv: string, taskEn: string): [string, string, string, string] => [
  "Iepazīšanās un uzdevums",
  "Introductions and task brief",
  `Iepazīšanās ar komandu un uzņēmumu, darba drošības instruktāža, uzdevuma izklāsts: ${taskLv}.`,
  `Meet the team and the company, workplace safety briefing, task brief: ${taskEn}.`,
];
const LAST = (resultLv: string, resultEn: string): [string, string, string, string] => [
  "Rezultāta prezentācija",
  "Presenting the result",
  `Rezultāta (${resultLv}) prezentācija komandai, mentora vērtējums un Industriālā digitālā sertifikāta izsniegšana.`,
  `Presenting the result (${resultEn}) to the team, mentor evaluation and the Industrial Digital Certificate.`,
];

const UNCONFIRMED_DIRECTIONS = b(
  "Precīzu adresi un to, kā nokļūt, uzņēmums norādīs pēc dalības apstiprināšanas.",
  "The company will give the exact address and directions once it confirms participation.",
);

const NO_CONTACT = { name: "", position: "", email: "", phone: "" };

function sampleCompany(
  id: string,
  name: string,
  industry: CompanyProfile["industry"],
  employees: string,
  town: string,
  parish: string,
  description: { lv: string; en: string },
  contact: CompanyProfile["contact"],
): CompanyProfile {
  return {
    id,
    userId: null,
    name,
    regNumber: "",
    industry,
    description,
    employees,
    website: "",
    logo: "",
    address: { street: ADDRESS_TODO, town, parish, postcode: "" },
    directions: UNCONFIRMED_DIRECTIONS,
    contactPerson: NO_CONTACT,
    confirmed: false,
    contact,
    isSample: true,
  };
}

const companies: CompanyProfile[] = [
  sampleCompany(
    "cmp_pata",
    "PATA Saldus",
    "wood",
    "155",
    "Saldus",
    "",
    b(
      "Lielākais Saldus uzņēmums pēc apgrozījuma (~68 milj. eiro). Kokzāģēšana, koksnes apstrāde un loģistika; ražošanā izmanto digitālas uzskaites un ražošanas sistēmas. PATA grupai ir lielākais mežistrādes tehnikas parks Latvijā.",
      "The largest company in Saldus by turnover (~€68 million). Sawmilling, timber processing and logistics, run on digital tracking and production systems. The PATA group has the largest forestry-machine fleet in Latvia.",
    ),
    { emails: ["info@patasaldus.lv"], phones: ["+371 25666005"] },
  ),
  sampleCompany(
    "cmp_jets",
    "JETS Vacuum",
    "metal",
    "41",
    "Saldus novads",
    "",
    b(
      "Norvēģijai piederošs uzņēmums, kas ražo augstas precizitātes vakuuma sistēmas kuģiem un rūpniecībai. Digitāla uzraudzība, IoT un datu platforma Jets® INSIGHT; testu dati un kiberdrošības pārbaudes.",
      "Norwegian-owned maker of high-precision vacuum systems for ships and industry. Digital monitoring, IoT and the Jets® INSIGHT data platform; test data and cyber checks.",
    ),
    { emails: [], phones: ["+371 63822771"] },
  ),
  sampleCompany(
    "cmp_scgrupa",
    "SC GRUPA",
    "construction",
    "350",
    "Saldus",
    "",
    b(
      "Ceļu būves un asfalta uzņēmums (agrāk Saldus Ceļinieks): 4 asfalta rūpnīcas, vairāk nekā 200 tehnikas vienību un 3 akreditētas laboratorijas. Izmanto GPS, digitālo plānošanu un sensorus; ir sava prakses programma topošajiem inženieriem.",
      "Road building and asphalt company (formerly Saldus Ceļinieks): 4 asphalt plants, 200+ machines and 3 accredited labs. Uses GPS, digital planning and sensors; runs its own internship programme for future engineers.",
    ),
    { emails: ["sc@scgrupa.lv"], phones: ["+371 63807060", "+371 63291311"] },
  ),
  sampleCompany(
    "cmp_schwenk",
    "SCHWENK Latvija",
    "materials",
    "350+",
    "Brocēni",
    "",
    b(
      "Viena no modernākajām cementa rūpnīcām Eiropā, strādā 24/7. PLC vadības sistēmas, sensoru kalibrēšana, saules parka enerģijas dati; piedāvā apmaksātas prakses PLC programmēšanā.",
      "One of Europe's most advanced cement plants, running 24/7. PLC control systems, sensor calibration, solar park energy data; offers paid internships in PLC programming.",
    ),
    { emails: ["info.lv@schwenk.com"], phones: ["+371 67033500"] },
  ),
  sampleCompany(
    "cmp_brimer",
    "Brimer Saldus / Norplast",
    "plastics",
    "59",
    "Saldus",
    "",
    b(
      "Stiklšķiedras kompozītu ražošana ar vakuuma infūzijas metodi naftas un zivkopības nozarei. Kvalitātes pārbaudes, CAD rasējumi; vakance: projektu asistents.",
      "Fibreglass composite production using vacuum injection for the oil and fish-farming industries. Quality inspection, CAD drawings; open vacancy: project assistant.",
    ),
    { emails: ["saldus@brimer.lv"], phones: ["+371 63807074"] },
  ),
  sampleCompany(
    "cmp_tervete",
    "Tērvete Food",
    "food",
    "48",
    "Saldus novads",
    "",
    b(
      "Pārtikas ražotājs (saldējums “Druva”). Ražošana pēc HACCP principiem, aukstās ķēdes temperatūras dati.",
      "Food producer (“Druva” ice cream). HACCP-based production and cold-chain temperature data.",
    ),
    { emails: ["info@tervetefood.lv"], phones: ["+371 29397603"] },
  ),
  sampleCompany(
    "cmp_delta",
    "DELTA LV",
    "logistics",
    "170",
    "Saldus novads",
    "",
    b(
      "Beramkravu autopārvadājumi. Degvielas patēriņa un loģistikas programmatūra.",
      "Bulk-cargo trucking company using fuel-consumption and logistics software.",
    ),
    { emails: ["info@deltalv.lv"], phones: ["+371 63120900"] },
  ),
  sampleCompany(
    "cmp_warmeston",
    "Warmeston",
    "energy",
    "37",
    "Brocēni",
    "Cieceres pagasts",
    b(
      "Igaunijai piederoša, augsti automatizēta granulu rūpnīca (150 000 t gadā) un biomasas koģenerācijas stacija (3,98 MW elektroenerģijas / 15,9 MW siltuma), kuras siltumu izmanto izejvielas žāvēšanai. ISO 50001 energopārvaldība. Darbinieku skaits: 37 (2024).",
      "Estonian-owned, highly automated wood-pellet factory (150,000 t/year) and a biomass combined heat-and-power plant (3.98 MW electricity / 15.9 MW heat) whose heat dries the raw material. ISO 50001 energy management. Staff: 37 (2024).",
    ),
    { emails: [], phones: ["+371 28604880"], note: "office administrator" },
  ),
];

function companySnapshot(c: CompanyProfile): Placement["company"] {
  return {
    name: c.name,
    regNumber: c.regNumber,
    industry: c.industry,
    description: c.description,
    employees: c.employees,
    website: c.website,
    logo: c.logo,
    address: { ...c.address },
    directions: c.directions,
    contactPerson: { ...c.contactPerson },
  };
}

type SampleInput = Pick<
  Placement,
  | "id"
  | "companyId"
  | "title"
  | "focusArea"
  | "lengthDays"
  | "terms"
  | "problem"
  | "outputType"
  | "outputDescription"
  | "dayPlan"
  | "tools"
  | "dataSystems"
  | "skillsRequired"
  | "skillsNice"
  | "mentor"
> &
  Partial<Placement>;

function samplePlacement(input: SampleInput): Placement {
  const company = companies.find((c) => c.id === input.companyId)!;
  return {
    status: "published",
    isSample: true,
    createdAt: SEED_TIME,
    updatedAt: SEED_TIME,
    publishedAt: SEED_TIME,
    company: companySnapshot(company),
    hoursFrom: "08:30",
    hoursTo: "16:00",
    format: "onsite",
    languages: ["lv"],
    ageFrom: 15,
    ageTo: 24,
    educationLevels: ["secondary", "vocational", "university"],
    beginnerFriendly: true,
    ndaRequired: false,
    skillLevel: "basic",
    bring: [b("Personu apliecinošs dokuments", "ID document"), b("Slēgti apavi", "Closed shoes")],
    safetyBriefing: true,
    ppe: b("Uzņēmums izsniedz nepieciešamos individuālos aizsardzības līdzekļus.", "The company provides the required protective equipment."),
    minorRestrictions: b(
      "Nepilngadīgie ražošanas zonās uzturas tikai mentora pavadībā.",
      "Minors enter production areas only when accompanied by the mentor.",
    ),
    parentalConsentRequired: true,
    recognisesCertificate: false,
    compensation: { none: false, stipend: false, stipendAmount: null, meals: false, travel: false },
    opportunities: [],
    opportunitiesOther: "",
    deadlineDays: 10,
    requireCv: false,
    requireMotivation: true,
    questions: [],
    selectionMethod: "review",
    ...input,
  };
}

const sampleMentor = (name: string, posLv: string, posEn: string, bioLv: string, bioEn: string) => ({
  name,
  position: b(posLv, posEn),
  bio: b(bioLv, bioEn),
  isSample: true,
});

const samplePlacements: Placement[] = [
  samplePlacement({
    id: "plc_pata_downtime",
    companyId: "cmp_pata",
    title: b("Ražošanas līnijas dīkstāvju datu panelis", "Production line downtime dashboard"),
    focusArea: "data",
    lengthDays: 5,
    terms: [term("trm_pata_1", "2026-11-23", 5, 2), term("trm_pata_2", "2027-03-15", 5, 2)],
    problem: b(
      "Zāģētavas līnija ik pa laikam apstājas, bet dīkstāvju iemesli ir izkaisīti dažādās tabulās un sensoru žurnālos. Grūti redzēt, kuras apstāšanās atkārtojas un cik laika tās kopā aizņem.",
      "The sawmill line stops from time to time, but the reasons are scattered across spreadsheets and sensor logs. It is hard to see which stops repeat and how much time they cost in total.",
    ),
    outputType: "dashboard",
    outputDescription: b(
      "Vienkāršs datu panelis, kas rāda dīkstāves pēc iemesla, maiņas un nedēļas, un īss secinājumu kopsavilkums ražošanas vadītājam.",
      "A simple dashboard showing downtime by cause, shift and week, plus a short summary of findings for the production manager.",
    ),
    dayPlan: plan([
      DAY1("iepazīties ar zāģētavas līniju un tās datiem", "get to know the sawmill line and its data"),
      ["Datu tīrīšana", "Cleaning the data", "Ražošanas un sensoru datu apvienošana vienā tabulā, dublikātu un kļūdu labošana.", "Merging production and sensor data into one table, fixing duplicates and errors."],
      ["Dīkstāvju modeļi", "Finding downtime patterns", "Dīkstāvju grupēšana pēc iemesla un laika; biežāko cēloņu atrašana.", "Grouping stops by cause and time; finding the most frequent causes."],
      ["Datu panelis", "Building the dashboard", "Paneļa izveide un pārbaude kopā ar mentoru un līnijas operatoru.", "Building the dashboard and checking it with the mentor and a line operator."],
      LAST("datu panelis un secinājumi", "dashboard and findings"),
    ]),
    tools: ["Excel", "Power BI"],
    dataSystems: b("Ražošanas uzskaites sistēmas eksports un līnijas sensoru žurnāli (anonimizēti).", "Exports from the production tracking system and line sensor logs (anonymised)."),
    skillsRequired: [b("Excel pamati", "Excel basics")],
    skillsNice: ["Power BI", b("Interese par ražošanu", "Interest in manufacturing")],
    bring: [b("Klēpjdators (ja ir)", "Laptop (if you have one)"), b("Personu apliecinošs dokuments", "ID document"), b("Slēgti apavi", "Closed shoes")],
    mentor: sampleMentor(
      "Mārtiņš Ozols",
      "Ražošanas datu inženieris",
      "Production data engineer",
      "Strādā ar zāģētavas ražošanas sistēmām un palīdz komandai pieņemt lēmumus, balstoties datos.",
      "Works with the sawmill's production systems and helps the team make decisions based on data.",
    ),
  }),
  samplePlacement({
    id: "plc_jets_cyber",
    companyId: "cmp_jets",
    title: b("Ražošanas tīkla kiberdrošības pamataudits", "Basic cybersecurity audit of the production network"),
    focusArea: "cyber",
    lengthDays: 4,
    terms: [term("trm_jets_1", "2027-02-08", 4, 2)],
    problem: b(
      "Ražošanā arvien vairāk iekārtu ir pieslēgtas tīklam un datu platformai. Uzņēmumam vajag vienkāršu, atkārtojamu pārbaudi, lai redzētu, vai pamata drošības prasības ir izpildītas.",
      "More and more production equipment is connected to the network and the data platform. The company needs a simple, repeatable check to see whether basic security requirements are met.",
    ),
    outputType: "audit",
    outputDescription: b(
      "Kiberdrošības kontrolsaraksts, tā rezultāti pēc pārbaudes kopā ar mentoru un ieteikumu saraksts prioritātes secībā.",
      "A cybersecurity checklist, its results after running it with the mentor, and a prioritised list of recommendations.",
    ),
    dayPlan: plan([
      DAY1("saprast ražošanas tīklu un tā riskus", "understand the production network and its risks"),
      ["Kontrolsaraksts", "Writing the checklist", "Kontrolsaraksta izveide, balstoties uz CERT.LV un ISO 27001 pamatprincipiem.", "Writing a checklist based on CERT.LV guidance and ISO 27001 basics."],
      ["Pārbaude", "Running the audit", "Kontrolsaraksta izpilde kopā ar mentoru: paroles, atjauninājumi, piekļuves tiesības, rezerves kopijas.", "Running the checklist with the mentor: passwords, updates, access rights, backups."],
      LAST("audits un ieteikumi", "audit and recommendations"),
    ]),
    tools: ["Excel", "IoT sensors"],
    dataSystems: b("Ražošanas tīkla iekārtu saraksts un piekļuves iestatījumi (tikai skatīšanās režīmā).", "List of production network devices and access settings (view-only)."),
    ndaRequired: true,
    skillsRequired: [b("Uzmanība detaļām", "Attention to detail")],
    skillsNice: [b("Tīklu pamati", "Networking basics"), b("Angļu valoda", "English")],
    skillLevel: "basic",
    languages: ["lv", "en"],
    ageFrom: 16,
    mentor: sampleMentor(
      "Laura Bērziņa",
      "IT sistēmu speciāliste",
      "IT systems specialist",
      "Atbild par ražošanas IT sistēmām un drošību, palīdz kolēģiem atpazīt pikšķerēšanu.",
      "Looks after production IT systems and security, and helps colleagues spot phishing.",
    ),
  }),
  samplePlacement({
    id: "plc_scgrupa_gps",
    companyId: "cmp_scgrupa",
    title: b("Būvtehnikas GPS datu analīze", "Construction machinery GPS data analysis"),
    focusArea: "gps",
    lengthDays: 5,
    terms: [term("trm_sc_1", "2026-11-23", 5, 3), term("trm_sc_2", "2027-02-08", 5, 3)],
    problem: b(
      "Uzņēmumam ir vairāk nekā 200 tehnikas vienību ar GPS. Dati tiek savākti, bet neviens nepaspēj tos analizēt, lai atrastu kavējumus un dīkstāves objektos.",
      "The company has 200+ machines with GPS. The data is collected, but nobody has time to analyse it to find delays and idle time on sites.",
    ),
    outputType: "dashboard",
    outputDescription: b(
      "Karte un grafiki, kas rāda tehnikas dīkstāves un kavējumus pa objektiem, un īss ieteikumu saraksts.",
      "A map and charts showing machine idle time and delays by site, and a short list of recommendations.",
    ),
    dayPlan: plan([
      DAY1("iepazīties ar tehnikas parku un GPS sistēmu", "get to know the fleet and the GPS system"),
      ["GPS datu sagatavošana", "Preparing GPS data", "GPS žurnālu eksports, laika zonu un kļūdainu punktu labošana.", "Exporting GPS logs, fixing time zones and faulty points."],
      ["Dīkstāvju meklēšana", "Finding idle time", "Kad tehnika stāv ar ieslēgtu motoru vai gaida uz objekta; aprēķini pa objektiem.", "When machines idle with the engine on or wait on site; calculations by site."],
      ["Vizualizācija", "Visualisation", "Kartes un grafiku izveide, pārbaude ar objekta vadītāju.", "Building the map and charts, checking them with a site manager."],
      LAST("karte, grafiki un ieteikumi", "map, charts and recommendations"),
    ]),
    tools: ["GPS data", "Excel", "Google Sheets"],
    dataSystems: b("Tehnikas GPS žurnāli un objektu grafiks (anonimizēti).", "Machine GPS logs and the site schedule (anonymised)."),
    skillsRequired: [b("Excel pamati", "Excel basics")],
    skillsNice: [b("Kartes un GIS", "Maps and GIS"), b("Interese par inženieriju", "Interest in engineering")],
    opportunities: ["internship"],
    opportunitiesOther: b("Uzņēmuma prakses programma topošajiem inženieriem.", "The company's internship programme for future engineers."),
    mentor: sampleMentor(
      "Andris Liepa",
      "Tehnikas parka un GPS sistēmu vadītājs",
      "Fleet and GPS systems manager",
      "Plāno tehnikas darbu ceļu būves objektos un ievieš digitālo plānošanu.",
      "Plans machine work on road-building sites and introduces digital planning.",
    ),
  }),
  samplePlacement({
    id: "plc_schwenk_solar",
    companyId: "cmp_schwenk",
    title: b("Saules parka enerģijas datu panelis", "Solar park energy data dashboard"),
    focusArea: "energy",
    lengthDays: 5,
    terms: [term("trm_schwenk_1", "2027-03-15", 5, 2)],
    problem: b(
      "Rūpnīcas saules parks ražo elektroenerģiju, bet dati par izstrādi ir dažādās sistēmās. Vajag vienu skatu, kas rāda ražošanu pa dienām un salīdzina to ar laikapstākļiem un patēriņu.",
      "The plant's solar park produces electricity, but production data sits in different systems. One view is needed that shows output by day and compares it with weather and consumption.",
    ),
    outputType: "dashboard",
    outputDescription: b(
      "Enerģijas datu panelis ar ražošanu pa dienām un mēnešiem un salīdzinājumu ar laikapstākļiem.",
      "An energy dashboard with daily and monthly output and a comparison with the weather.",
    ),
    dayPlan: plan([
      DAY1("saprast, kā darbojas saules parks un rūpnīcas enerģijas uzskaite", "understand the solar park and the plant's energy metering"),
      ["Datu savākšana", "Collecting data", "Invertoru un skaitītāju datu eksports, laikapstākļu datu pievienošana.", "Exporting inverter and meter data, adding weather data."],
      ["Datu tīrīšana", "Cleaning the data", "Trūkstošo vērtību un kļūdu labošana, vienotas tabulas izveide.", "Fixing missing values and errors, building one table."],
      ["Datu panelis", "Building the dashboard", "Paneļa izveide un pārbaude kopā ar energoinženieri.", "Building the dashboard and checking it with the energy engineer."],
      LAST("enerģijas datu panelis", "energy dashboard"),
    ]),
    tools: ["Excel", "Power BI", "SCADA"],
    dataSystems: b("Saules parka invertoru un skaitītāju dati (eksports).", "Solar park inverter and meter data (export)."),
    skillsRequired: [b("Excel pamati", "Excel basics")],
    skillsNice: [b("Fizika", "Physics"), "Power BI"],
    ageFrom: 16,
    minorRestrictions: b(
      "Rūpnīcas ražošanas teritorijā nepilngadīgie uzturas tikai mentora pavadībā; darbs galvenokārt notiek birojā.",
      "Minors enter the plant's production area only with the mentor; most of the work happens in the office.",
    ),
    opportunities: ["internship"],
    opportunitiesOther: b("Apmaksātas prakses PLC programmēšanā.", "Paid internships in PLC programming."),
    mentor: sampleMentor(
      "Kristīne Vītola",
      "Energoinženiere",
      "Energy engineer",
      "Atbild par rūpnīcas energoefektivitāti un saules parka datiem.",
      "Responsible for the plant's energy efficiency and solar park data.",
    ),
  }),
  samplePlacement({
    id: "plc_brimer_quality",
    companyId: "cmp_brimer",
    title: b("Digitāls kvalitātes kontroles kontrolsaraksts", "Digital quality-control checklist"),
    focusArea: "quality",
    lengthDays: 3,
    terms: [term("trm_brimer_1", "2026-11-23", 3, 2)],
    problem: b(
      "Kompozītu izstrādājumu pārbaudes rezultāti tiek pierakstīti uz papīra. Tos ir grūti meklēt, analizēt un nodot klientiem.",
      "Inspection results for composite products are written on paper. They are hard to search, analyse and pass on to customers.",
    ),
    outputType: "checklist",
    outputDescription: b(
      "Papīra pārbaudes lapa, pārveidota digitālā formā (piem., Microsoft Forms vai Google Forms) ar rezultātu tabulu.",
      "The paper inspection sheet turned into a digital form (e.g. Microsoft Forms or Google Forms) with a results table.",
    ),
    dayPlan: plan([
      DAY1("iepazīt pārbaudes procesu un esošo papīra lapu", "learn the inspection process and the current paper sheet"),
      ["Digitālā forma", "Building the digital form", "Formas izveide, pārbaude ražošanā kopā ar kvalitātes kontrolieri, labojumi.", "Building the form, testing it on the floor with a quality inspector, fixing issues."],
      LAST("digitālais kontrolsaraksts", "digital checklist"),
    ]),
    tools: ["Excel", "Google Sheets"],
    dataSystems: b("Esošās pārbaudes lapas un CAD rasējumu izvilkumi.", "Current inspection sheets and extracts from CAD drawings."),
    skillsRequired: [b("Uzmanība detaļām", "Attention to detail")],
    skillsNice: [b("CAD pamati", "CAD basics")],
    opportunities: ["other"],
    opportunitiesOther: b("Uzņēmumā ir vakance: projektu asistents.", "The company has an open vacancy: project assistant."),
    mentor: sampleMentor(
      "Jānis Kļaviņš",
      "Kvalitātes vadītājs",
      "Quality manager",
      "Atbild par kompozītu izstrādājumu kvalitāti un klientu prasībām.",
      "Responsible for composite product quality and customer requirements.",
    ),
  }),
  samplePlacement({
    id: "plc_tervete_coldchain",
    companyId: "cmp_tervete",
    title: b("Aukstās ķēdes temperatūras uzraudzības panelis", "Cold-chain temperature monitoring dashboard"),
    focusArea: "data",
    lengthDays: 3,
    terms: [term("trm_tervete_1", "2027-02-08", 3, 2), term("trm_tervete_2", "2027-03-15", 3, 2)],
    problem: b(
      "Saldējumam visu laiku jābūt pareizā temperatūrā. Temperatūras dati tiek reģistrēti, bet novirzes pamana par vēlu.",
      "Ice cream must stay at the right temperature all the time. Temperature data is logged, but deviations are noticed too late.",
    ),
    outputType: "dashboard",
    outputDescription: b(
      "Panelis, kas rāda temperatūru noliktavās un transportā un izceļ novirzes no HACCP robežām.",
      "A dashboard showing temperatures in storage and transport and highlighting deviations from HACCP limits.",
    ),
    dayPlan: plan([
      DAY1("saprast aukstās ķēdes un HACCP prasības", "understand the cold chain and HACCP requirements"),
      ["Dati un panelis", "Data and dashboard", "Temperatūras žurnālu apstrāde un paneļa izveide ar novirzēm.", "Processing temperature logs and building a dashboard that flags deviations."],
      LAST("temperatūras uzraudzības panelis", "temperature monitoring dashboard"),
    ]),
    tools: ["Excel", "Google Sheets", "IoT sensors"],
    dataSystems: b("Temperatūras sensoru žurnāli no noliktavām un transporta.", "Temperature sensor logs from storage and transport."),
    skillsRequired: [b("Excel pamati", "Excel basics")],
    skillsNice: [b("Interese par pārtikas ražošanu", "Interest in food production")],
    ppe: b("Uzņēmums izsniedz higiēnas apģērbu ražošanas zonai.", "The company provides hygiene clothing for the production area."),
    mentor: sampleMentor(
      "Agnese Zariņa",
      "Kvalitātes un HACCP speciāliste",
      "Quality and HACCP specialist",
      "Uzrauga pārtikas drošību un temperatūras režīmus ražošanā.",
      "Oversees food safety and temperature control in production.",
    ),
  }),
  samplePlacement({
    id: "plc_delta_fuel",
    companyId: "cmp_delta",
    title: b("Degvielas patēriņa analīze pa maršrutiem", "Fuel consumption analysis by route"),
    focusArea: "gps",
    lengthDays: 4,
    terms: [term("trm_delta_1", "2027-03-15", 4, 2)],
    problem: b(
      "Degviela ir viena no lielākajām izmaksām. Uzņēmums grib salīdzināt maršrutus un saprast, kur patēriņš ir lielāks, nekā vajadzētu.",
      "Fuel is one of the biggest costs. The company wants to compare routes and understand where consumption is higher than it should be.",
    ),
    outputType: "audit",
    outputDescription: b(
      "Maršrutu salīdzinājums ar degvielas patēriņu uz 100 km un ietaupījuma iespēju saraksts.",
      "A route comparison with fuel use per 100 km and a list of possible savings.",
    ),
    dayPlan: plan([
      DAY1("iepazīt maršrutus un loģistikas programmatūru", "get to know the routes and the logistics software"),
      ["Datu sagatavošana", "Preparing data", "Braucienu un degvielas datu apvienošana pa maršrutiem.", "Combining trip and fuel data by route."],
      ["Salīdzinājums", "Comparison", "Patēriņa aprēķins un maršrutu salīdzinājums, novirzes un iespējamie iemesli.", "Calculating consumption, comparing routes, finding outliers and likely causes."],
      LAST("maršrutu analīze un ieteikumi", "route analysis and recommendations"),
    ]),
    tools: ["Excel", "GPS data"],
    dataSystems: b("Loģistikas programmatūras braucienu un degvielas eksports (anonimizēts).", "Trip and fuel exports from the logistics software (anonymised)."),
    skillsRequired: [b("Excel pamati", "Excel basics"), b("Matemātika", "Maths")],
    skillsNice: [b("Interese par loģistiku", "Interest in logistics")],
    mentor: sampleMentor(
      "Edgars Krūmiņš",
      "Loģistikas analītiķis",
      "Logistics analyst",
      "Plāno maršrutus un seko līdzi autoparka izmaksām.",
      "Plans routes and keeps track of fleet costs.",
    ),
  }),
  samplePlacement({
    id: "plc_warmeston_energy",
    companyId: "cmp_warmeston",
    title: b("Enerģijas datu panelis un digitāls apkopes žurnāls", "Energy data dashboard and digital maintenance log"),
    focusArea: "energy",
    lengthDays: 4,
    terms: [term("trm_warmeston_1", "2026-11-23", 4, 2), term("trm_warmeston_2", "2027-02-08", 4, 2)],
    problem: b(
      "Koģenerācijas stacijas un granulu rūpnīcas enerģijas dati un apkopes ieraksti ir atsevišķi. ISO 50001 energopārvaldībai vajag pārskatāmu ainu un ērtu apkopes žurnālu.",
      "Energy data from the CHP plant and the pellet factory are kept separately from maintenance records. ISO 50001 energy management needs a clear overview and an easy-to-use maintenance log.",
    ),
    outputType: "tool",
    outputDescription: b(
      "Enerģijas datu panelis (elektroenerģija, siltums, patēriņš) un digitāls apkopes žurnāls tabulas vai formas veidā.",
      "An energy dashboard (electricity, heat, consumption) and a digital maintenance log as a spreadsheet or form.",
    ),
    dayPlan: plan([
      DAY1("iepazīt granulu ražošanu un koģenerācijas staciju", "get to know pellet production and the CHP plant"),
      ["Enerģijas dati", "Energy data", "Datu eksports un enerģijas paneļa izveide.", "Exporting data and building the energy dashboard."],
      ["Apkopes žurnāls", "Maintenance log", "Esošo apkopes ierakstu pārnešana digitālā žurnālā, pārbaude ar tehniķi.", "Moving current maintenance records into a digital log, testing it with a technician."],
      LAST("enerģijas panelis un apkopes žurnāls", "energy dashboard and maintenance log"),
    ]),
    tools: ["Excel", "Power BI", "SCADA"],
    dataSystems: b("Stacijas vadības sistēmas (SCADA) eksports un apkopes ieraksti.", "Exports from the plant control system (SCADA) and maintenance records."),
    skillsRequired: [b("Excel pamati", "Excel basics")],
    skillsNice: [b("Fizika", "Physics"), b("Interese par enerģētiku", "Interest in energy")],
    mentor: sampleMentor(
      "Dace Siliņa",
      "Energopārvaldības speciāliste",
      "Energy management specialist",
      "Atbild par ISO 50001 energopārvaldību un stacijas datu uzskaiti.",
      "Responsible for ISO 50001 energy management and plant data records.",
    ),
  }),
];

// Demo company --------------------------------------------------------

const DEMO_COMPANY_USER = "usr_demo_company";
const DEMO_STUDENT_USER = "usr_demo_student";

const demoCompany: CompanyProfile = {
  id: "cmp_demo",
  userId: DEMO_COMPANY_USER,
  name: "Demo Ražotne SIA",
  regNumber: "40000000000",
  industry: "metal",
  description: b(
    "Izdomāts metālapstrādes uzņēmums Saldū demonstrācijai: ražo metāla konstrukcijas un detaļas lauksaimniecības tehnikai.",
    "A fictional metalworking company in Saldus for the demo: makes metal structures and parts for farm machinery.",
  ),
  employees: "60",
  website: "",
  logo: "",
  address: { street: "Rūpniecības iela 1", town: "Saldus", parish: "", postcode: "LV-3801" },
  directions: b(
    "~1 km no Saldus autoostas; autostāvvieta pie galvenās ieejas. (Izdomāta adrese)",
    "~1 km from Saldus bus station; parking at the main entrance. (Fictional address)",
  ),
  contactPerson: { name: "Ivars Demo", position: "Ražošanas vadītājs", email: "demo@uznemums.lv", phone: "+371 20000000" },
  confirmed: true,
  isSample: false,
};

function demoPlacement(p: Partial<Placement> & Pick<Placement, "id" | "status" | "title" | "terms">): Placement {
  return {
    companyId: demoCompany.id,
    isSample: false,
    createdAt: "2026-09-15T08:00:00.000Z",
    updatedAt: "2026-10-20T08:00:00.000Z",
    publishedAt: p.status === "draft" ? null : "2026-09-20T08:00:00.000Z",
    company: companySnapshot(demoCompany),
    focusArea: "data",
    lengthDays: 3,
    hoursFrom: "09:00",
    hoursTo: "15:00",
    format: "onsite",
    languages: ["lv"],
    ageFrom: 15,
    ageTo: 24,
    educationLevels: ["secondary", "vocational"],
    beginnerFriendly: true,
    problem: "",
    outputType: "dashboard",
    outputDescription: "",
    dayPlan: [],
    tools: ["Excel"],
    dataSystems: "",
    ndaRequired: false,
    skillsRequired: [],
    skillsNice: [],
    skillLevel: "none",
    bring: [b("Slēgti apavi", "Closed shoes")],
    safetyBriefing: true,
    ppe: b("Austiņas un aizsargbrilles ražošanas zonā.", "Ear defenders and safety glasses in the production area."),
    minorRestrictions: b("Ražošanas zonā tikai mentora pavadībā.", "Production area only with the mentor."),
    parentalConsentRequired: true,
    mentor: {
      name: "Ivars Demo",
      position: b("Ražošanas vadītājs", "Production manager"),
      bio: b("Vada ražošanu 12 gadus un mīl Excel.", "Has run production for 12 years and loves Excel."),
      isSample: false,
    },
    recognisesCertificate: true,
    compensation: { none: false, stipend: false, stipendAmount: null, meals: true, travel: true },
    opportunities: ["summer-job", "tour"],
    opportunitiesOther: "",
    deadlineDays: 10,
    requireCv: false,
    requireMotivation: true,
    questions: [
      { id: "q_demo_1", text: b("Vai tev ir pieredze ar Excel?", "Do you have experience with Excel?"), type: "yesno" },
    ],
    selectionMethod: "review",
    ...p,
  };
}

const demoPlacements: Placement[] = [
  demoPlacement({
    id: "plc_demo_stock",
    status: "published",
    title: b("Noliktavas atlikumu datu sakārtošana", "Cleaning up warehouse stock data"),
    terms: [term("trm_demo_stock_1", "2027-02-08", 3, 2)],
    problem: b(
      "Noliktavas atlikumi Excel tabulā nesakrīt ar faktisko daudzumu: ir dublikāti, dažādi nosaukumi vienai detaļai un trūkstošas vērtības.",
      "Warehouse stock in the Excel sheet doesn't match what's on the shelves: duplicates, different names for the same part and missing values.",
    ),
    outputDescription: b(
      "Sakārtota atlikumu tabula un vienkāršs panelis ar detaļām, kuru krājumi beidzas.",
      "A cleaned stock table and a simple dashboard showing parts that are running low.",
    ),
    dayPlan: plan([
      DAY1("saprast noliktavas uzskaiti", "understand how the warehouse keeps stock"),
      ["Datu tīrīšana un panelis", "Cleaning data and dashboard", "Dublikātu un nosaukumu sakārtošana, atlikumu panelis.", "Fixing duplicates and names, building the stock dashboard."],
      LAST("atlikumu tabula un panelis", "stock table and dashboard"),
    ]),
    dataSystems: b("Noliktavas Excel tabula un grāmatvedības eksports.", "The warehouse Excel sheet and an accounting export."),
    skillsRequired: [b("Excel pamati", "Excel basics")],
  }),
  demoPlacement({
    id: "plc_demo_quality",
    status: "finished",
    title: b("Metināšanas kvalitātes kontrolsaraksts", "Welding quality checklist"),
    focusArea: "quality",
    outputType: "checklist",
    terms: [term("trm_demo_quality_1", "2026-10-12", 3, 2)],
    problem: b(
      "Metināto šuvju pārbaudes notiek pēc atmiņas, un rezultāti netiek pierakstīti vienotā veidā.",
      "Weld inspections are done from memory, and results are not recorded in one consistent way.",
    ),
    outputDescription: b(
      "Digitāls metināšanas kvalitātes kontrolsaraksts planšetdatorā ar rezultātu tabulu.",
      "A digital welding quality checklist on a tablet with a results table.",
    ),
    dayPlan: plan([
      DAY1("iepazīt metināšanas cehu un pārbaudes", "get to know the welding shop and inspections"),
      ["Kontrolsaraksts", "Checklist", "Kontrolsaraksta izveide un pārbaude cehā.", "Building the checklist and testing it in the shop."],
      LAST("digitālais kontrolsaraksts", "digital checklist"),
    ]),
    dataSystems: b("Metināšanas instrukcijas un esošie pārbaudes pieraksti.", "Welding instructions and current inspection notes."),
  }),
  demoPlacement({
    id: "plc_demo_draft",
    status: "draft",
    title: b("Biroja datoru drošības pārbaude", "Office computer security check"),
    focusArea: "cyber",
    lengthDays: 4,
    outputType: "audit",
    terms: [],
    problem: b("Biroja datoriem nav vienotu drošības iestatījumu.", "Office computers have no consistent security settings."),
  }),
];

// Demo student -------------------------------------------------------

const demoStudent: StudentProfile = {
  userId: DEMO_STUDENT_USER,
  firstName: "Elza",
  lastName: "Paraudziņa",
  email: "demo@skolens.lv",
  phone: "+371 21111111",
  birthDate: "2009-03-14",
  schoolId: "saldus-tehnikums",
  schoolOther: "",
  grade: "2. kurss",
  interests: ["Dati", "Ražošana", "Excel"],
  bio: "Man patīk saprast, kā lietas strādā, un sakārtot datus.",
};

const demoApplicant = {
  firstName: demoStudent.firstName,
  lastName: demoStudent.lastName,
  email: demoStudent.email,
  phone: demoStudent.phone,
  birthDate: demoStudent.birthDate as string,
  school: "Saldus tehnikums",
  grade: demoStudent.grade,
};

const demoGuardian = { name: "Ilze Paraudziņa", phone: "+371 22222222", email: "ilze@example.lv", consent: true };

const demoEvaluation = {
  problemSolving: 5,
  data: 4,
  communication: 4,
  independence: 4,
  responsibility: 5,
  comment: "Ātri saprata procesu un izveidoja kontrolsarakstu, ko tagad lietojam katru dienu.",
  evaluatedAt: "2026-10-14T14:00:00.000Z",
};

const certificateId = formatCertificateId(2026, 1);

const demoApplications: Application[] = [
  {
    id: "app_demo_approved",
    placementId: "plc_demo_stock",
    studentId: DEMO_STUDENT_USER,
    termId: "trm_demo_stock_1",
    status: "approved",
    submittedAt: "2026-10-18T10:15:00.000Z",
    updatedAt: "2026-10-20T08:00:00.000Z",
    applicant: demoApplicant,
    motivation: "Gribu iemācīties sakārtot īstus uzņēmuma datus un saprast, kā strādā noliktava.",
    answers: [{ questionId: "q_demo_1", value: "yes" }],
    cv: null,
    guardian: demoGuardian,
    dataConsent: true,
    evaluation: null,
    certificateId: null,
  },
  {
    id: "app_demo_completed",
    placementId: "plc_demo_quality",
    studentId: DEMO_STUDENT_USER,
    termId: "trm_demo_quality_1",
    status: "completed",
    submittedAt: "2026-09-25T12:00:00.000Z",
    updatedAt: "2026-10-14T14:00:00.000Z",
    applicant: demoApplicant,
    motivation: "Mani interesē kvalitātes kontrole un metināšana.",
    answers: [{ questionId: "q_demo_1", value: "yes" }],
    cv: { name: "Elza_CV.pdf", size: 182_400 },
    guardian: demoGuardian,
    dataConsent: true,
    evaluation: demoEvaluation,
    certificateId,
  },
];

const qualityPlacement = demoPlacements[1];
const demoCertificates: Certificate[] = [
  {
    id: certificateId,
    applicationId: "app_demo_completed",
    placementId: qualityPlacement.id,
    studentId: DEMO_STUDENT_USER,
    issuedAt: "2026-10-14T14:00:00.000Z",
    participantName: `${demoStudent.firstName} ${demoStudent.lastName}`,
    companyName: demoCompany.name,
    placementTitle: qualityPlacement.title,
    focusArea: qualityPlacement.focusArea,
    start: qualityPlacement.terms[0].start,
    end: qualityPlacement.terms[0].end,
    days: qualityPlacement.lengthDays,
    outputType: qualityPlacement.outputType,
    output: qualityPlacement.outputDescription,
    evaluation: demoEvaluation,
    mentor: { name: qualityPlacement.mentor.name, position: qualityPlacement.mentor.position },
  },
];

const users: User[] = [
  {
    id: DEMO_COMPANY_USER,
    email: DEMO_ACCOUNTS.company.email,
    passwordHash: demoHash(DEMO_ACCOUNTS.company.password),
    role: "company",
    createdAt: SEED_TIME,
  },
  {
    id: DEMO_STUDENT_USER,
    email: DEMO_ACCOUNTS.student.email,
    passwordHash: demoHash(DEMO_ACCOUNTS.student.password),
    role: "student",
    createdAt: SEED_TIME,
  },
];

export function createSeedDatabase(): DemoDatabase {
  return structuredClone({
    version: DB_VERSION,
    users,
    students: [demoStudent],
    companies: [...companies, demoCompany],
    placements: [...samplePlacements, ...demoPlacements],
    applications: demoApplications,
    certificates: demoCertificates,
    certificateCounters: { "2026": 1 },
  });
}
