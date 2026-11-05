# SEER Expo · Saldus inovāciju izstāde

**LV** · Saldus lauksaimniecības, mežsaimniecības un loģistikas inovāciju izstāde. Trīs dienas: uzņēmumu stendi, bezmaksas stendi inovatoriem, investīciju vitrīna ar B2B tikšanās pieprasījumiem un IT / MI / kiberdrošības izaicinājumi skolu komandām.

**EN** · Saldus Agriculture, Forestry & Logistics Innovation Fair. Three days: company stands, free stands for innovators, an investment showcase with B2B meeting requests, and IT / AI / cybersecurity challenges for school teams.

> ⚠️ **Demo mode / Demo režīms.** There is no server and there are no accounts. Everything lives in the browser's `localStorage`; the role switch only changes menus and the dashboard. / Servera un kontu nav. Viss glabājas pārlūka `localStorage`; lomas izvēle maina tikai izvēlni un paneli.

> **Dates and venue are not decided yet** and prices are placeholders. Every example company, startup, challenge and agenda item is marked **PIEMĒRS / EXAMPLE**. / **Datumi un vieta vēl nav zināmi**, cenas ir aptuvenas. Visi piemēri ir apzīmēti ar **PIEMĒRS**.

---

## English

### Run it

```bash
npm install
```

```bash
npm run dev
```

Open http://localhost:3000. Requires Node.js 20+.

| Command | What it does |
|---|---|
| `npm test` | Vitest unit tests for the pure logic in `lib/fair/` and the seed rules |
| `npm run build` | Production build (type-checks too) |
| `npm run lint` | ESLint |
| `npm run build:artifact -- <out.html>` | Single-file clickable preview (see below) |

### Roles

There is no login. A visitor picks a role with the buttons on the home page or the **"Izvēlēties lomu" (Choose a role)** menu in the header. The role is remembered in a cookie (so the server renders the right menu) and in `localStorage`. "Leave this role" in the role menu returns to the general view.

| Role | Menu |
|---|---|
| none | About · Agenda · Exhibitors · Investment showcase · role buttons |
| Exhibitor (company) | About · Stands · Book a stand · My dashboard |
| Innovator | About · Apply for a free stand · My dashboard |
| Investor | About · Investment showcase · Investing in Latvia · My dashboard |
| School team | About · Challenges · My dashboard |

**My dashboard** shows what *this browser* submitted (stand bookings, innovator applications, meeting requests, team applications, saved startups). It is a demo convenience, not an account.

### Pages

| Route | What |
|---|---|
| `/` | Landing page: hero, key facts, sectors, why Saldus, the three parts of the fair, the three days, for exhibitors / investors, FAQ |
| `/agenda` | Programme in three day tabs; dates and venue come from `config/event.ts` |
| `/exhibitors`, `/exhibitors/[id]` | Directory with sector / stand size / "seeking investment" filters, and exhibitor detail |
| `/stands` | Hall map with free / reserved / sold stands, stand types with placeholder prices |
| `/apply/stand?stand=N` | Stand booking: company, stand (pick on the map), days and needs, showcase goals, optional investment details; live preview and price summary |
| `/apply/innovator` | Free innovator stand (2×2 m, day 2) with a live "places left" counter |
| `/investment`, `/investment/[id]` | Investment showcase: sector / stage / amount filters; detail with "Save" |
| `/investment/[id]/meet` | B2B meeting request (day, time, topic) |
| `/invest-in-latvia` | General pointers and official links for foreign investors |
| `/challenges`, `/challenges/[id]` | School challenges (AI, IT, cybersecurity) |
| `/challenges/[id]/apply` | Team application: 2–5 members aged 12–25; guardian consent required when anyone is under 18 |
| `/dashboard` | Per-role dashboard; exhibitors accept or decline meeting requests here |
| `/privacy` | Privacy notice |

### How the main flows connect

- **Booking a stand** marks it *reserved* on the map. Ticking "seeking investment" and filling in the investment details puts the company in the investment showcase.
- **An investor** filters the showcase, saves startups and requests a meeting. **The exhibitor** sees the request on their dashboard and accepts or declines it; the investor's dashboard shows the answer.
- **Innovator applications** use up one of the 16 free places; the counter on the form and the stands page updates at once.
- **Team applications** are validated by team size, age and guardian consent.

All of this only meets up inside one browser, because there is no server.

### Reset demo data

Footer → **"Atiestatīt demo datus" (Reset demo data)**. Deletes everything created in this browser and restores the seed data. The chosen role stays.

### Project structure

```
app/                 routes, one folder per page
components/          header (role menu), footer, role buttons, expo illustration, ui/ (button, form, dialog, …)
components/fair/     stand map, booking form, exhibitor / showcase / challenge cards, filters, badges
config/event.ts      event name, subtitle, dates & venue text, stand layout and prices, sectors, option lists, age limits
config/site.ts       brand, tagline, contacts, colour tokens (light/dark), schools
messages/lv.ts       all UI text in Latvian (source of truth)
messages/en.ts       English, type-checked against lv.ts (the build fails if a key is missing)
lib/data/            data layer: types.ts, repository.ts (interface), local-storage.ts (demo), seed.ts, hooks.ts
lib/fair/            pure logic with tests: stands.ts, filters.ts, status.ts, forms.ts
lib/roles.ts         roles and per-role menus (server-safe); lib/role.tsx is the client provider
DESIGN.md            design tokens and component rules
```

**Conventions:** no hard-coded UI text (add it to both dictionaries); pages and components touch data only through `getRepository()` / `useQuery()`; colours only through the tokens in `config/site.ts`; business rules go in `lib/fair/` with a test.

### Things to change before the real event

All in `config/event.ts` unless noted:

- `eventConfig.datesVenue`: replace "Dates and venue to be confirmed" once they are known. The agenda's day tabs show "Day 1/2/3" until then.
- `standTypes[...].price`: stand prices are **placeholders** (S €250, M €450, L €800); the UI labels them as such.
- `hallStands`: the hall layout (21 paid stands: 3 L, 6 M, 12 S). `innovatorStandLimit`: 16 free places.
- `eventConfig.advicePartner`: "In cooperation with LIAA and a partner law firm (to be confirmed)".
- `config/site.ts`: team contacts, the school list.
- `lib/data/seed.ts`: example data (see below).

### Example data (seed) rules

`lib/data/seed.test.ts` checks these:

- **Real Saldus companies** (PATA Saldus, DELTA LV, Warmeston, Tērvete Food, SC GRUPA) appear only with their name and what they do, marked **PIEMĒRS** and **"Dalība vēl nav apstiprināta" / "Participation not confirmed"**. They never appear in the investment showcase.
- **The investment showcase holds only fictional startups** (AgroSense, TimberTrack, RouteMate, FarmShield) plus whatever is submitted in this browser.
- 2 fictional innovators, 5 example challenges, 13 example agenda items across 3 days. All are marked PIEMĒRS.

### "Investing in Latvia" page

General pointers only, with links to official sources (Register of Enterprises, LIAA and its forestry page, State Forest Service, Rural Support Service, business.gov.lv support overview). It states **no legal costs, deadlines or rules as fact**; visitors are told to check with the official source or an adviser. Links were checked in November 2026.

### Single-file preview

`npm run build:artifact -- <out.html>` bundles the whole app into one HTML file. An in-memory router replaces Next's routing (see `artifact/`). Use it to share a clickable demo without a server, e.g. as a claude.ai artifact.

### Demo-mode limitations

- **Data lives only in that browser.** Another device, browser or private window starts from the seed data.
- If the browser blocks storage, the site still works but forgets everything on reload.
- Logos are stored as base64 (max 200 KB); localStorage holds about 5 MB per site.
- No emails are sent; nobody "receives" a booking or a meeting request outside this browser.

### Connecting a real backend (next step)

The UI depends only on the `DataRepository` interface in `lib/data/repository.ts`.

1. Create tables matching `lib/data/types.ts`: `exhibitors` (JSON columns are fine for `stand`, `investment`, `team`), `meetings`, `challenges`, `teams`, `agenda`.
2. Add authentication with real roles (exhibitor, innovator, investor, school, organiser) and Row Level Security: exhibitors see only meeting requests addressed to them; team member data (names, ages, guardian consent) is visible only to the team and the organisers.
3. Write e.g. `lib/data/supabase.ts` implementing `DataRepository` (same method names, same `DataError` codes) and return it from `getRepository()` in `lib/data/index.ts`.
4. Move stand allocation and the innovator place count into the database (a transaction or RPC), so two people can't book the same stand.
5. Add an organiser view that approves bookings (`submitted → approved / rejected`); the status flow is already in `lib/fair/status.ts`.

---

## Latviešu

### Palaišana

```bash
npm install
```

```bash
npm run dev
```

Atver http://localhost:3000. `npm test` palaiž testus, `npm run build` izveido produkcijas versiju (arī pārbauda tipus), `npm run lint` palaiž ESLint. Vajag Node.js 20+.

### Lomas

Pieslēgšanās nav. Lomu izvēlas ar pogām sākumlapā vai galvenes izvēlnē **"Izvēlēties lomu"**. Loma maina izvēlni un paneli **"Mans panelis"**, kurā redzams tas, kas iesniegts *šajā pārlūkā*.

### Galvenās plūsmas

- Rezervēts stends kartē kļūst *rezervēts*. Ja uzņēmums atzīmē "meklējam investīcijas", tas parādās investīciju vitrīnā.
- Investors filtrē vitrīnu un pieprasa tikšanos; uzņēmums savā panelī to pieņem vai noraida.
- Inovatoru pieteikumi samazina 16 bezmaksas vietu skaitītāju.
- Skolu komandā 2–5 dalībnieki vecumā 12–25 gadi; ja kāds ir jaunāks par 18, vajag vecāku piekrišanu.

### Demo datu atiestatīšana

Lapas apakšā → **"Atiestatīt demo datus"**. Tiek dzēsts viss šajā pārlūkā izveidotais un atjaunoti sākuma dati. Izvēlētā loma paliek.

### Kas jānomaina pirms īstās izstādes

`config/event.ts`: datumi un vieta, stendu cenas (pašlaik aptuvenas), zāles plānojums, inovatoru vietu skaits, partneru teksts. `config/site.ts`: kontakti un skolu saraksts.

### Piemēru noteikumi

- Īsti Saldus uzņēmumi redzami tikai ar nosaukumu un darbības jomu, ar **PIEMĒRS** un **"Dalība vēl nav apstiprināta"**. Investīciju vitrīnā tie nav.
- Investīciju vitrīnā ir tikai izdomāti jaunuzņēmumi.
- Lapā "Investēt Latvijā" ir tikai vispārīgi norādījumi un oficiālas saites, bez konkrētām juridiskām izmaksām vai noteikumiem.

### Demo režīma ierobežojumi

Dati ir tikai tajā pārlūkā. Ja pārlūks bloķē krātuvi, lapa strādā, bet pēc pārlādes visu aizmirst. E-pasti netiek sūtīti. Īsta servera pieslēgšana: skatīt angļu sadaļu "Connecting a real backend".
