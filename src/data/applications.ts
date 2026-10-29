/**
 * SEER — example applications and one example passport (all fictional people).
 * `mine: true` = shown in the student's "My placements" in this browser, so the
 * passport is visible on first load. The others give companies applicants to review.
 */
import type { Application, Passport } from './types'

const L = (lv: string, en: string) => ({ lv, en })

export const APPLICATIONS: Application[] = [
  {
    id: 'app-demo-completed',
    placementId: 'pata-downtime',
    student: { name: 'Anna Kalniņa', age: 17, school: 'Saldus tehnikums, 2. kurss', email: 'anna@piemers.lv', guardianConsent: true, guardianContact: 'Inese Kalniņa, 20000000' },
    dates: { start: '2026-10-05', end: '2026-10-08' },
    motivation: 'Gribu redzēt, kā īstā ražotnē izmanto datus, un pārbaudīt, vai datu analīze ir man.',
    status: 'completed',
    mine: true,
    isExample: true,
    createdAt: '2026-09-20T10:00:00Z',
  },
  {
    id: 'app-demo-2',
    placementId: 'pata-downtime',
    student: { name: 'Roberts Ozols', age: 19, school: 'Saldus tehnikums, 3. kurss', email: 'roberts@piemers.lv' },
    dates: { start: '2026-11-16', end: '2026-11-19' },
    motivation: 'Mācos datorsistēmas un gribu pamēģināt darbu ar īstiem ražošanas datiem.',
    experience: 'Skolas projekts: Excel tabula par sporta rezultātiem.',
    status: 'applied',
    mine: false,
    isExample: true,
    createdAt: '2026-10-22T15:30:00Z',
  },
  {
    id: 'app-demo-3',
    placementId: 'jets-network-check',
    student: { name: 'Elīza Liepa', age: 18, school: 'Saldus vidusskola, 12. klase', email: 'eliza@piemers.lv' },
    dates: { start: '2026-12-01', end: '2026-12-03' },
    motivation: 'Mani interesē kiberdrošība, esmu piedalījusies CTF sacensībās.',
    status: 'accepted',
    mine: false,
    isExample: true,
    createdAt: '2026-10-18T12:00:00Z',
  },
  {
    id: 'app-demo-4',
    placementId: 'tervete-cold-chain',
    student: { name: 'Dāvis Krūmiņš', age: 16, school: 'Saldus tehnikums, 1. kurss', email: 'davis@piemers.lv', guardianConsent: true, guardianContact: 'Agris Krūmiņš, 20000001' },
    dates: { start: '2027-01-11', end: '2027-01-14' },
    motivation: 'Gribu uzzināt, kā pārtikas ražotnē uzrauga kvalitāti, un iemācīties veidot grafikus.',
    status: 'applied',
    mine: false,
    isExample: true,
    createdAt: '2026-10-25T09:10:00Z',
  },
]

export const PASSPORTS: Passport[] = [
  {
    id: 'SEER-2026-0042',
    applicationId: 'app-demo-completed',
    issuedAt: '2026-10-08',
    skills: [
      { label: L('Datu tīrīšana', 'Data cleaning'), level: 3 },
      { label: L('Datu vizualizācija', 'Data visualisation'), level: 3 },
      { label: L('Ražošanas procesu izpratne', 'Understanding production processes'), level: 2 },
      { label: L('Rezultātu prezentēšana', 'Presenting results'), level: 4 },
    ],
    feedback: 'Anna ātri saprata, kā rodas iekārtu dati, un patstāvīgi atrada divas kļūdas sensoru ierakstos. Viņas dīkstāves panelis jau tiek izmantots maiņu sapulcēs.',
    mentorName: 'Mārtiņš Kalns',
    mentorRole: L('Ražošanas inženieris', 'Production engineer'),
    isExample: true,
  },
]
