# SEER — see where your career can go · Ieraugi, kur var aizvest tava karjera

**SEER — Saldus Industrial Digital Immersion / Saldus industriālā digitālā prakse**

**EN** · 3–5 day placements for 15–24-year-olds from Saldus municipality at local companies. The young person solves a real, small digital task on the company's actual data and systems with a mentor, and earns the **Industrial Digital Certificate**, a diploma-style document the partner companies recognise.

**LV** · 3–5 dienu prakses Saldus novada uzņēmumos 15–24 gadus veciem jauniešiem. Jaunietis kopā ar mentoru atrisina īstu, nelielu digitālu uzdevumu ar uzņēmuma datiem un sistēmām un saņem **Industriālo digitālo sertifikātu**, ko atzīst partneruzņēmumi.

> ⚠️ **Demo mode / Demo režīms.** There is no server. Accounts, placements, applications and certificates live in the browser's `localStorage`. Login is **not secure** and exists for demonstration only. / Servera nav. Konti, prakses, pieteikumi un sertifikāti glabājas pārlūka `localStorage`. Pieslēgšanās **nav droša** un paredzēta tikai demonstrācijai.

---

## English

### Run it

```bash
npm install
```

```bash
npm run dev
```

Open http://localhost:3000. `npm run build` makes a production build (type-checks too), `npm run lint` runs ESLint. Requires Node.js 20+.

### Demo accounts

| Role | Email | Password | What's there |
|---|---|---|---|
| Company | `demo@uznemums.lv` | `demo1234` | "Demo Ražotne SIA", Saldus: 1 published placement, 1 draft, 1 finished placement with an issued certificate |
| Student | `demo@skolens.lv` | `demo1234` | Elza Paraudziņa, Saldus tehnikums, aged 17: 1 approved application, 1 completed, certificate `SEER-2026-0001` |

The login page has a "Fill in the demo account" button.

### Reset demo data

Footer → **"Atiestatīt demo datus" (Reset demo data)**. This deletes everything created in this browser and restores the seed data. Clearing the site data in the browser does the same.

### Pages

| Route | Who | What |
|---|---|---|
| `/` | everyone | "Ideja" home page: hero, statistics with sources, how it works, benefits, certificate, comparison, partners, sample week, FAQ |
| `/prakses` | guests, students (companies → `/uznemums`) | Catalogue: filters, search, sort |
| `/prakses/[id]` | everyone | Placement detail; apply button (sticky on mobile) |
| `/prakses/[id]/pieteikties` | students (guests → registration → back here) | Application form |
| `/pieslegties?loma=skolens\|uznemums&tab=register` | guests | Login / registration with the role preselected |
| `/students` | students (companies → `/uznemums`) | My applications, my certificates, profile summary |
| `/profils` | logged in | Student or company profile |
| `/uznemums` | companies (students → `/students`) | Dashboard: stats, placements, actions |
| `/uznemums/prakses/jauna`, `/uznemums/prakses/[id]/rediget` | companies | 7-step builder: live preview, draft autosave, validation |
| `/uznemums/prakses/[id]/pieteikumi` | companies | Applications: status, details, mentor evaluation, issue certificate |
| `/sertifikats/[id]` | anyone with the link | Printable A4 certificate with QR code ("Download PDF" = browser print) |
| `/parbaudit`, `/parbaudit/[id]` | everyone | Certificate verification |
| `/privatums` | everyone | Privacy notice |

### Project structure

```
app/                 routes (Latvian URLs), one folder per page
components/          header, footer, placement card/detail, builder, certificate, ui/ (button, form, dialog, …)
config/site.ts       name, certificate prefix, colours, contacts, schools, industries, focus areas, other lists
messages/lv.ts       all UI text in Latvian (source of truth)
messages/en.ts       English, type-checked against lv.ts (build fails if a key is missing)
lib/data/            the data layer: types.ts, repository.ts (interface), local-storage.ts (demo), seed.ts, hooks.ts
lib/                 dates, placement rules (free spots, deadlines, age), builder validation, i18n, session
DESIGN.md            design tokens and component rules
```

**Conventions:** no hard-coded UI text (add it to both dictionaries); pages and components touch data only through `getRepository()` / `useQuery()`; colours only through the tokens in `config/site.ts` (`bg-primary`, `text-ink-muted`, …).

### Deploy to Vercel (free)

1. Push this repository to GitHub.
2. On https://vercel.com, choose **Add New → Project** and import the repository. Vercel detects Next.js; keep the defaults (`npm run build`).
3. Click **Deploy**. Every push to the main branch redeploys automatically.
4. Optional: set `siteUrl` in `config/site.ts` to your Vercel URL. QR codes use the current browser address, so this is only a fallback.

### Single-file preview

`npm run build:artifact -- <out.html> [publicUrl]` bundles the whole app into one HTML file (an in-memory router replaces Next's routing; see `artifact/`). It's handy for sharing a clickable demo without a server, e.g. as a claude.ai artifact. `publicUrl` is where the file will be hosted, so certificate QR codes link to its verification view. Printing to PDF is hidden there because the host blocks the print dialog.

### Demo-mode limitations

- **Data lives only in that browser.** Another device, browser or private window starts from the seed data. A company and a student "meet" only if they use the same browser (that's how the demo flow works).
- **Certificate verification works only in the same browser** where the certificate was issued. A QR code scanned on a phone will say "not found" unless the phone has the same data.
- Passwords are stored as a simple non-cryptographic hash, which is **not security**. Anyone with access to the browser can read or change the data.
- CV upload stores only the file name and size. Logos are stored as base64 (max 200 KB).
- localStorage is limited (~5 MB per site).

### Connecting Supabase (next step)

The UI depends only on the `DataRepository` interface in `lib/data/repository.ts`.

1. Create a Supabase project. Add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` to `.env.local` and to Vercel.
2. `npm install @supabase/supabase-js`.
3. Create tables matching `lib/data/types.ts`: `profiles_students`, `companies`, `placements` (JSON columns are fine for `terms`, `day_plan`, `questions`, `company`), `applications`, `certificates`, plus a sequence for certificate numbers.
4. Use **Supabase Auth** for email + password and drop `passwordHash`. Add Row Level Security:
   - companies read/write only their own placements and the applications to them;
   - students read/write only their own profile and applications;
   - published placements and certificates are readable by everyone, but only the public fields (expose certificates through a view without personal contact data);
   - a company's `contact` stays private until `confirmed = true`.
5. Write `lib/data/supabase.ts` implementing `DataRepository` (same method names, same `DataError` codes). Make `subscribe()` use Supabase Realtime or just re-fetch after mutations.
6. Return it from `getRepository()` in `lib/data/index.ts`, e.g. when `process.env.NEXT_PUBLIC_DATA_BACKEND === "supabase"`.
7. Move certificate issuing and ID numbering into a database function (RPC), so IDs are unique and can't be forged from the browser.

Out of scope for now (structure only): email notifications, an admin dashboard that approves placements before publishing, and a school/teacher role. Each fits behind the repository interface or as a new role in `Role`.

### Assumptions

Decisions made where the brief was open. Change them if they're wrong.

1. **Rebuilt from scratch on Next.js.** The previous Vite prototype ("SEER") was removed; it is still in git history.
2. **SEER identity.** The app uses the SEER prototype's identity: the SEER name, tagline and "S" mark, the Saldus coat-of-arms blue/gold palette, Inter, the Saldus town-square photo in the hero, and dark mode by default with a toggle (remembered in a cookie, so the server renders the right theme with no flash). Certificates always render and print light. Colours are in `theme.light` / `theme.dark` in `config/site.ts`. The earlier Vite SEER prototype stays on branch `claude/ere-career-discovery-app-gk6v7q`. The hero photo was supplied by the team; **its photographer still needs to be credited** (`[TODO]` in `config/site.ts`).
3. **Free spots** = spots minus *approved + completed* applications per date. New (unreviewed) applications don't hold a spot, so more people can apply than there are spots, and approving is blocked when a date is full.
4. **Deadlines are per set of dates.** The brief asks for one "application deadline"; a single date would close *all* dates of a placement at once (e.g. a February date would close in November). Instead the company sets "days before the start" (default 10, as the brief suggests) and each set of dates closes that many days before it begins. The detail page and application form show each date's own deadline.
5. **Guardian consent** is required when the applicant is under 18 *and* the placement keeps "minors need parental consent" on (default yes).
6. **Applicant age** must be within the placement's age range (15–24 by default); registration requires 15–24.
7. **Companies may view** a public placement page (e.g. their own) but can't apply; only the `/prakses` list redirects them to `/uznemums`.
8. **Contact person** is shown to a student only after approval *and* only if the company is `confirmed`. Companies that register themselves count as confirmed; the 8 sample companies are not.
9. **Published placements don't autosave** (changes would go live half-finished). They have "Save changes", which validates first. Drafts autosave about 0.7 s after each change.
10. **Certificates before the end date.** In the demo a company can issue a certificate before the placement's end date (with a warning), so the whole flow can be tried on future dates. Set `allowCertificateBeforeEnd: false` in `config/site.ts` for real use: then the button is disabled until the end date and the data layer refuses it too.
11. **The demo company has an extra finished placement** (12–14 Oct 2026), so the demo student's completed application and certificate `SEER-2026-0001` have a real source.
12. **Sample mentors are invented** and marked "Parauga mentors" / "Sample mentor". Sample compensation and opportunities are left as "to be confirmed by the company", except the opportunities the brief lists (SCHWENK, SC GRUPA, Brimer).
13. **Bilingual content.** Sample data is written in LV and EN. Text that companies and students type is stored as typed and shown in both languages unchanged.
14. **Address placeholders** like `[TODO: confirm address]` stay in the data but are never shown in the UI.
15. **"Completed placements"** on the company dashboard counts placements with status *Finished*.
16. **Name: "sertifikāts", not "diploms".** The credential was renamed from "Industriālā digitālā pase" to "Industriālais digitālais sertifikāts" and is laid out like a diploma. "Diploms" is avoided on purpose: in Latvia it usually means an official education document from an accredited institution. Certificate IDs start with `SEER` (e.g. `SEER-2026-0001`); the prefix is in `config/site.ts`.

### Statistics on the home page

Figures come from the team's brief, with source links on the page. Checked on 2026-10-28 by web search, where possible:

- ✅ 48.43% vs EU 60.40% basic digital skills; ICT specialists 4.5% (2030 target 10%); CERT.LV record 923 incidents in Q4 2025.
- ✅ Youth unemployment 9.4% in Q1 2026, lowest in 18 years: consistent with CSB releases (Q2 2026 = 15.0%, +5.6 points).
- ⚠️ Not independently verified (source sites weren't reachable from the build environment): Saldus 46 registered unemployed youth and the regional comparison, VARAM's 418 trained / +160% IT support requests, 59.2% of SMEs, and CERT.LV's "six times more than before 2022". **Open each source link and check before presenting.**
- `[TODO]` items to fill in: team email (`config/site.ts`, privacy page), mentor time commitment (FAQ), the full school list (`config/site.ts`).

---

## Latviešu

### Palaišana

```bash
npm install
```

```bash
npm run dev
```

Atver http://localhost:3000. `npm run build` izveido produkcijas versiju (arī pārbauda tipus), `npm run lint` palaiž ESLint. Vajag Node.js 20+.

### Demo konti

| Loma | E-pasts | Parole | Kas tur ir |
|---|---|---|---|
| Uzņēmums | `demo@uznemums.lv` | `demo1234` | "Demo Ražotne SIA", Saldus: 1 publicēta prakse, 1 melnraksts, 1 pabeigta prakse ar izsniegtu sertifikātu |
| Skolēns | `demo@skolens.lv` | `demo1234` | Elza Paraudziņa, Saldus tehnikums, 17 gadi: 1 apstiprināts pieteikums, 1 pabeigts, sertifikāts `SEER-2026-0001` |

Pieslēgšanās lapā ir poga "Aizpildīt ar demo kontu".

### Demo datu atiestatīšana

Lapas apakšā → **"Atiestatīt demo datus"**. Tiek dzēsts viss šajā pārlūkā izveidotais un atjaunoti sākuma dati.

### Publicēšana Vercel (bez maksas)

1. Augšupielādē repozitoriju GitHub.
2. Vietnē https://vercel.com izvēlies **Add New → Project** un importē repozitoriju. Vercel pats atpazīst Next.js; noklusējuma iestatījumi der.
3. Nospied **Deploy**. Katra izmaiņa galvenajā zarā tiek publicēta automātiski.

### Demo režīma ierobežojumi

- **Dati ir tikai tajā pārlūkā.** Citā ierīcē, pārlūkā vai privātajā logā redzami tikai sākuma dati.
- **Sertifikāta pārbaude darbojas tikai tajā pašā pārlūkā**, kurā sertifikāts izsniegts.
- Paroles nav drošas. CV saglabā tikai faila nosaukumu un izmēru.

### Supabase pieslēgšana

Visas lapas izmanto tikai `DataRepository` saskarni (`lib/data/repository.ts`). Izveido `lib/data/supabase.ts` ar tām pašām metodēm, izmanto Supabase Auth un Row Level Security un atgriez to no `getRepository()` (`lib/data/index.ts`). Sīkāk skatīt angļu sadaļu.

### Pieņēmumi

Galvenie pieņēmumi (pilns saraksts angļu sadaļā):

- Brīvās vietas = vietas mīnus apstiprinātie un pabeigtie pieteikumi.
- Pieteikšanās termiņš ir “N dienas pirms sākuma” katriem datumiem atsevišķi (noklusējums 10).
- Vecāku piekrišana vajadzīga, ja jaunietim nav 18 gadu.
- Kontaktpersona redzama tikai pēc apstiprināšanas un tikai apstiprinātiem uzņēmumiem.
- Publicētas prakses nesaglabājas automātiski; melnraksti saglabājas.
- Demo režīmā sertifikātu var izsniegt pirms prakses beigām (ar brīdinājumu). Īstai lietošanai `config/site.ts` iestati `allowCertificateBeforeEnd: false`.
- 8 parauga uzņēmumi **nav apstiprinājuši dalību**: tiem ir "Ilustratīvs piemērs" emblēma, izdomāti mentori, un kontakti netiek rādīti.

### Statistika

Pirms prezentēšanas atver katru avota saiti un pārbaudi skaitļus. Daļa skaitļu nav neatkarīgi pārbaudīta (skatīt angļu sadaļu "Statistics on the home page").
