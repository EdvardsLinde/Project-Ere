/**
 * Starting data for the demo. Everything here is an EXAMPLE and is shown with
 * "PIEMĒRS" in the UI.
 *
 * Rules:
 * - Real Saldus companies appear only with their name and what they do; their
 *   participation is not confirmed (the UI says so), they have no logo, headcount
 *   or goals, and they are NEVER listed as looking for investment.
 * - Everything in the investment showcase is a clearly fictional startup.
 */
import type { AgendaItem, Challenge, Exhibitor, FairDatabase } from "./types";

export const DB_VERSION = 1;

const b = (lv: string, en: string) => ({ lv, en });
const SEEDED_AT = "2026-10-01T09:00:00.000Z";

/** Real companies from the region: name and what they do only; not confirmed. */
function localCompany(
  id: string,
  name: string,
  sector: Exhibitor["sector"],
  whatTheyDo: { lv: string; en: string },
  stand: Exhibitor["stand"],
  adjacentNote?: { lv: string; en: string },
): Exhibitor {
  return {
    id,
    name,
    address: "Saldus novads",
    sector,
    adjacentNote,
    description: whatTheyDo,
    contactName: "",
    email: "",
    stand,
    showcase: whatTheyDo,
    goals: [],
    status: "submitted",
    isExample: true,
    createdAt: SEEDED_AT,
  };
}

const localCompanies: Exhibitor[] = [
  localCompany(
    "exh_pata",
    "PATA Saldus",
    "forestry",
    b("Kokzāģēšana, koksnes apstrāde un loģistika.", "Sawmilling, timber processing and logistics."),
    { size: "L", number: 1, days: [1, 2, 3], needs: [] },
  ),
  localCompany(
    "exh_delta",
    "DELTA LV",
    "logistics",
    b("Beramkravu autopārvadājumi.", "Bulk-cargo trucking."),
    { size: "M", number: 4, days: [1, 2], needs: [] },
  ),
  localCompany(
    "exh_warmeston",
    "Warmeston",
    "adjacent",
    b("Koksnes granulu ražošana un biomasas koģenerācija.", "Wood-pellet production and biomass combined heat and power."),
    { size: "M", number: 5, days: [1, 2, 3], needs: [] },
    b("Biomasa un enerģētika", "Biomass and energy"),
  ),
  localCompany(
    "exh_tervete",
    "Tērvete Food",
    "adjacent",
    b("Pārtikas ražošana (saldējums “Druva”).", "Food production (“Druva” ice cream)."),
    { size: "S", number: 10, days: [1, 2], needs: [] },
    b("Pārtikas ražošana", "Food production"),
  ),
  localCompany(
    "exh_scgrupa",
    "SC GRUPA",
    "adjacent",
    b("Ceļu būve un asfalta ražošana.", "Road building and asphalt production."),
    { size: "S", number: 11, days: [1], needs: [] },
    b("Ceļu būve", "Road building"),
  ),
];

/** Fictional startups: the only entries in the investment showcase. */
function startup(e: Omit<Exhibitor, "status" | "isExample" | "createdAt" | "address" | "contactName" | "email">): Exhibitor {
  return {
    ...e,
    address: "Saldus novads",
    contactName: "",
    email: "",
    status: "approved",
    isExample: true,
    createdAt: SEEDED_AT,
  };
}

const startups: Exhibitor[] = [
  startup({
    id: "exh_agrosense",
    name: "AgroSense",
    sector: "agriculture",
    description: b(
      "Augsnes mitruma un temperatūras sensori ar lietotni, kas palīdz plānot laistīšanu un mēslošanu.",
      "Soil moisture and temperature sensors with an app that helps plan irrigation and fertilising.",
    ),
    stand: { size: "S", number: 12, days: [1, 2, 3], needs: ["power", "table"] },
    showcase: b("Sensoru prototips un dzīvs datu panelis no izmēģinājuma lauka.", "Sensor prototype and a live dashboard from a test field."),
    goals: ["investment", "productPartners"],
    investment: {
      amountRange: "50kTo200k",
      purpose: b("Pirmās sensoru partijas ražošana un pilotprojekti desmit saimniecībās.", "Producing the first sensor batch and pilots on ten farms."),
      where: b("Saldus novads un Kurzeme", "Saldus municipality and Kurzeme"),
      stage: "prototype",
      offer: b("Kapitāla daļa un pieeja pilotsaimniecību datiem.", "Equity and access to pilot-farm data."),
    },
  }),
  startup({
    id: "exh_timbertrack",
    name: "TimberTrack",
    sector: "forestry",
    description: b(
      "Kokmateriālu izsekošana no cirsmas līdz zāģētavai ar RFID birkām un kartēm.",
      "Tracking timber from the cutting site to the sawmill with RFID tags and maps.",
    ),
    stand: { size: "M", number: 6, days: [1, 2], needs: ["power", "screen"] },
    showcase: b("Birku nolasīšana uz vietas un piegādes ķēdes karte.", "On-site tag scanning and a supply-chain map."),
    goals: ["investment", "distributors"],
    investment: {
      amountRange: "200kTo1m",
      purpose: b("Platformas izstrāde un pārdošanas komanda Baltijā.", "Building the platform and a sales team for the Baltics."),
      where: b("Latvija un Baltija", "Latvia and the Baltics"),
      stage: "operating",
      offer: b("Kapitāla daļa un vieta valdē.", "Equity and a board seat."),
    },
  }),
  startup({
    id: "exh_routemate",
    name: "RouteMate",
    sector: "logistics",
    description: b(
      "Maršrutu plānošana lauksaimniecības kravām, kas samazina tukšbraucienus ražas laikā.",
      "Route planning for farm freight that cuts empty runs at harvest time.",
    ),
    stand: { size: "S", number: 13, days: [1, 2], needs: ["power"] },
    showcase: b("Maršrutu plānotāja demonstrācija ar reālu ražas sezonas scenāriju.", "A route-planner demo on a realistic harvest scenario."),
    goals: ["investment", "productPartners"],
    investment: {
      amountRange: "upTo50k",
      purpose: b("Pilotprojekts ar trim pārvadātājiem.", "A pilot with three hauliers."),
      where: b("Kurzeme", "Kurzeme"),
      stage: "idea",
      offer: b("Konvertējams aizdevums.", "A convertible loan."),
    },
  }),
  startup({
    id: "exh_farmshield",
    name: "FarmShield",
    sector: "adjacent",
    adjacentNote: b("Kiberdrošība", "Cybersecurity"),
    description: b(
      "Kiberdrošības pārbaude un uzraudzība viedajām fermām un lauksaimniecības tehnikai.",
      "Cybersecurity checks and monitoring for smart farms and farm machinery.",
    ),
    stand: { size: "S", number: 14, days: [1, 2, 3], needs: ["power", "screen"] },
    showcase: b("Tiešraides demonstrācija: kā pasargāt fermas tīklu.", "Live demo: how to protect a farm network."),
    goals: ["investment", "adjacentPartners"],
    investment: {
      amountRange: "50kTo200k",
      purpose: b("Uzraudzības pakalpojuma izstrāde un sertifikācija.", "Building the monitoring service and getting it certified."),
      where: b("Latvija", "Latvia"),
      stage: "prototype",
      offer: b("Kapitāla daļa.", "Equity."),
    },
  }),
];

/** Fictional innovators on free stands. */
const innovators: Exhibitor[] = [
  {
    id: "exh_beecount",
    name: "BeeCount",
    address: "",
    sector: "agriculture",
    description: b("Skaņas sensors, kas pēc bišu dūkoņas brīdina par saimes problēmām.", "A sound sensor that warns about hive problems from the bees' hum."),
    contactName: "",
    email: "",
    stand: { size: "innovator", days: [2], needs: [] },
    showcase: b("Bišu saimes skaņas sensors", "Beehive sound sensor"),
    goals: ["mentors", "customers"],
    stage: "prototype",
    status: "approved",
    isExample: true,
    createdAt: SEEDED_AT,
  },
  {
    id: "exh_chipbrick",
    name: "Skaidu brikete",
    address: "",
    sector: "forestry",
    description: b("Neliela prese, kas zāģu skaidas pārvērš kurināmajās briketēs uz vietas.", "A small press that turns sawdust into fuel briquettes on site."),
    contactName: "",
    email: "",
    stand: { size: "innovator", days: [2], needs: [] },
    showcase: b("Mobilā brikešu prese", "Mobile briquette press"),
    goals: ["partners", "investors"],
    stage: "idea",
    status: "approved",
    isExample: true,
    createdAt: SEEDED_AT,
  },
];

const challenges: Challenge[] = [
  {
    id: "chl_disease",
    company: "AgroSense",
    field: "ai",
    problem: b(
      "Atpazīt graudaugu slimības pēc lapu fotoattēliem, lai lauksaimnieks laikus zinātu, kur jārīkojas.",
      "Recognise cereal diseases from leaf photos so a farmer knows early where to act.",
    ),
    provides: b("Fotoattēlu kopa ar marķējumu un mentors no komandas.", "A labelled photo set and a mentor from the team."),
    timeline: b("6 nedēļas pirms izstādes; rezultātu prezentē 2. dienā.", "6 weeks before the fair; results presented on day 2."),
    isExample: true,
  },
  {
    id: "chl_inventory",
    company: "TimberTrack",
    field: "it",
    problem: b(
      "Mobilā lietotne cirsmas inventarizācijai, kas strādā arī bez interneta mežā.",
      "A mobile app for cutting-site inventory that also works offline in the forest.",
    ),
    provides: b("Datu paraugi, API piekļuve un iknedēļas konsultācija.", "Sample data, API access and a weekly check-in."),
    timeline: b("8 nedēļas pirms izstādes.", "8 weeks before the fair."),
    isExample: true,
  },
  {
    id: "chl_forecast",
    company: "RouteMate",
    field: "ai",
    problem: b(
      "Prognozēt, cik kravu būs vajadzīgs ražas laikā, no laikapstākļiem un iepriekšējo gadu datiem.",
      "Forecast how much freight harvest time will need from weather and past years' data.",
    ),
    provides: b("Anonimizēti kravu dati par trim sezonām.", "Anonymised freight data for three seasons."),
    timeline: b("6 nedēļas pirms izstādes.", "6 weeks before the fair."),
    isExample: true,
  },
  {
    id: "chl_network",
    company: "FarmShield",
    field: "cyber",
    problem: b(
      "Pārbaudīt viedās fermas mācību tīklu un izveidot drošības kontrolsarakstu fermas īpašniekam.",
      "Test a smart-farm training network and write a security checklist for the farm owner.",
    ),
    provides: b("Izolēts mācību tīkls un drošības speciālista mentorings.", "An isolated training network and mentoring from a security specialist."),
    timeline: b("4 nedēļas pirms izstādes.", "4 weeks before the fair."),
    isExample: true,
  },
  {
    id: "chl_dairy",
    company: b("Piena saimniecība Saldus novadā", "A dairy farm in Saldus municipality"),
    field: "it",
    problem: b(
      "Vienkāršs datu panelis, kas rāda ganāmpulka izslaukumu un barības patēriņu pa nedēļām.",
      "A simple dashboard showing the herd's milk yield and feed use by week.",
    ),
    provides: b("Izslaukuma un barības tabulas un apmeklējums saimniecībā.", "Milk-yield and feed spreadsheets and a farm visit."),
    timeline: b("5 nedēļas pirms izstādes.", "5 weeks before the fair."),
    isExample: true,
  },
];

const agenda: AgendaItem[] = [
  // Day 1: business and investor day
  { id: "ag_1_1", day: 1, time: "09:30", type: "panel", title: b("Atklāšana: kāpēc Saldus", "Opening: why Saldus"), isExample: true },
  { id: "ag_1_2", day: 1, time: "10:30", type: "panel", title: b("Paneļdiskusija: lauksaimniecības tehnoloģijas", "Panel: farming technology"), isExample: true },
  { id: "ag_1_3", day: 1, time: "11:30", type: "panel", title: b("Paneļdiskusija: mežs un koksne", "Panel: forest and timber"), isExample: true },
  { id: "ag_1_4", day: 1, time: "13:30", type: "pitch", title: b("Investīciju vitrīna: uzņēmumu prezentācijas", "Investment showcase: company pitches"), isExample: true },
  { id: "ag_1_5", day: 1, time: "15:30", type: "b2b", title: b("B2B tikšanās ar investoriem un uzņēmumiem", "B2B meetings with investors and companies"), isExample: true },
  // Day 2: innovators and the school showcase
  { id: "ag_2_1", day: 2, time: "10:00", type: "showcase", title: b("Inovatoru stendu prezentācijas", "Innovator stand presentations"), isExample: true },
  { id: "ag_2_2", day: 2, time: "11:30", type: "workshop", title: b("Darbnīca: no prototipa līdz pirmajam klientam", "Workshop: from prototype to first customer"), isExample: true },
  { id: "ag_2_3", day: 2, time: "13:30", type: "showcase", title: b("Skolu izaicinājuma rezultāti", "School challenge results"), isExample: true },
  { id: "ag_2_4", day: 2, time: "15:00", type: "workshop", title: b("Darbnīca: loģistikas dati praksē", "Workshop: logistics data in practice"), isExample: true },
  // Day 3: site visits and closing
  { id: "ag_3_1", day: 3, time: "09:00", type: "visit", title: b("Vizīte kokapstrādes uzņēmumā", "Visit to a wood-processing company"), isExample: true },
  { id: "ag_3_2", day: 3, time: "11:00", type: "visit", title: b("Vizīte lauksaimniecības uzņēmumā", "Visit to a farming business"), isExample: true },
  { id: "ag_3_3", day: 3, time: "13:30", type: "visit", title: b("Vizīte loģistikas centrā", "Visit to a logistics hub"), isExample: true },
  { id: "ag_3_4", day: 3, time: "15:30", type: "panel", title: b("Noslēgums un nākamie soļi", "Closing and next steps"), isExample: true },
];

export function createSeedDatabase(): FairDatabase {
  return {
    version: DB_VERSION,
    exhibitors: [...localCompanies, ...startups, ...innovators],
    meetings: [],
    challenges,
    teams: [],
    agenda,
    mine: { exhibitors: [], meetings: [], teams: [] },
    saved: [],
  };
}
